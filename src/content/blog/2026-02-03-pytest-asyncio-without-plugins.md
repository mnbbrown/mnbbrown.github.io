---
title: pytest asyncio testing without plugins
category: notes
publishedDate: 2026-02-03
description: Python 3.11 introduced asyncio.Runner which allows async test support without pytest-asyncio.
---

Python 3.11 introduced `asyncio.Runner` which makes it possible to run async tests in pytest without the `pytest-asyncio` plugin. We've been using this approach for a few months now.

## Configuration

Add this to your root `conftest.py`:

```python
import asyncio
import inspect
from contextlib import contextmanager
from typing import AsyncGenerator, Generator, TypeVar

import pytest

T = TypeVar("T")


@contextmanager
def async_to_sync_generator(
    runner: asyncio.Runner, agen: AsyncGenerator[T, None]
) -> Generator[T | None, None, None]:
    async def get_next(agen):
        try:
            return await agen.__anext__(), None
        except StopAsyncIteration:
            return None, StopIteration
        except Exception as e:
            return None, e

    try:
        while True:
            value, exc = runner.run(get_next(agen))
            if exc is not None:
                if exc is StopIteration:
                    break
                raise exc
            yield value
    finally:
        runner.run(agen.aclose())


def pytest_sessionstart(session):
    session.asyncio_runner = asyncio.Runner()


def pytest_sessionfinish(session):
    if hasattr(session, "asyncio_runner"):
        session.asyncio_runner.close()


@pytest.hookimpl(hookwrapper=True)
def pytest_fixture_setup(fixturedef, request):
    if inspect.isasyncgenfunction(fixturedef.func):
        generator = fixturedef.func

        def gen_wrapper(*args, **kwargs):
            runner = request.session.asyncio_runner
            with async_to_sync_generator(runner, generator(*args, **kwargs)) as v:
                yield v

        fixturedef.func = gen_wrapper

    elif inspect.iscoroutinefunction(fixturedef.func):
        coro = fixturedef.func

        def coro_wrapper(*args, **kwargs):
            return request.session.asyncio_runner.run(coro(*args, **kwargs))

        fixturedef.func = coro_wrapper

    yield


@pytest.hookimpl(hookwrapper=True)
def pytest_runtest_call(item):
    if inspect.iscoroutinefunction(item.obj):
        runner = item.session.asyncio_runner
        original = item.obj

        def wrapper(*args, **kwargs):
            return runner.run(original(*args, **kwargs))

        item.obj = wrapper

    yield
```

## Writing tests

No decorators needed. Just write async functions:

```python
async def test_create_user(session, factory):
    user = await factory(UserFactory, name="test")
    assert user.id is not None

async def test_fetch_user(session, factory):
    user = await factory(UserFactory)
    result = await get_user(session, user.id)
    assert result.name == user.name
```

Async fixtures work the same way:

```python
@pytest.fixture
async def user(factory):
    return await factory(UserFactory)
```

## Database test isolation

Wrap each test in a transaction that rolls back:

```python
@pytest.fixture(scope="function", autouse=True)
async def test_transaction(engine: AsyncEngine):
    async with engine.connect() as connection:
        transaction = await connection.begin()
        try:
            session = AsyncSession(bind=connection, expire_on_commit=False)
            yield session
        finally:
            await session.close()
            await transaction.rollback()
```

All changes made during a test are rolled back automatically.

## Factory fixture

Use factories with explicit session management instead of mocking:

```python
T = TypeVar("T", bound=BaseFactory)

@pytest.fixture
async def factory(session: AsyncSession):
    async def fn(factory: type[T], **overrides):
        instance = factory.build(**overrides)
        session.add(instance)
        await session.flush()
        return instance

    return fn
```

Usage:

```python
async def test_order_total(factory):
    user = await factory(UserFactory)
    order = await factory(OrderFactory, user=user, amount=100)
    assert order.user_id == user.id
```

## Why a single event loop matters

The default `pytest-asyncio` behaviour creates a new event loop per test. This causes problems:

- **Database connection pooling breaks.** SQLAlchemy's async engine maintains connections on the event loop. New loop = new connections = pool exhaustion.
- **Fixtures and tests on different loops.** [A known issue](https://github.com/pytest-dev/pytest-asyncio/issues/744) where session-scoped fixtures run on a different loop than tests.
- **aiohttp client sessions.** These need to be created and closed on the same loop.

The `asyncio.Runner` approach uses one loop for the entire session, avoiding all of this.

## Known pitfalls

**Silent test failures.** The biggest risk with any async detection approach. If an async test isn't properly awaited, it passes without running. Earlier pytest versions [silently ignored](https://quantlane.com/blog/make-sure-asyncio-tests-always-run/) unmarked async tests entirely. The hook-based approach handles this, but watch for the warning: `RuntimeWarning: coroutine 'test_x' was never awaited`.

**Async generator cleanup.** The `async_to_sync_generator` must call `aclose()` in the finally block. Missing this causes resource leaks with async context managers.

**No multi-framework support.** This only works with asyncio. If you need trio or curio, use `pytest-asyncio`.

## Similar projects

[alt-pytest-asyncio](https://github.com/delfick/alt-pytest-asyncio) takes the same approach as a proper plugin:
- Single event loop for the session
- Auto-detects async tests (no decorators)
- Cleaner error tracebacks (no asyncio internals)
- Python 3.11+ only

If you want a maintained plugin rather than copying conftest code, use that.

## Comparison

**Advantages:**
- No `@pytest.mark.asyncio` decorators
- Single event loop per session (connection pooling works)
- Fixtures and tests guaranteed same loop
- No plugin version compatibility issues

**Limitations:**
- More setup code in conftest.py
- Less documentation
- Python 3.11+ only
- asyncio only (no trio/curio)
