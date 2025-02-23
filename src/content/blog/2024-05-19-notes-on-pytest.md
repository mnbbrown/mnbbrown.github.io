---
title: pytest snippets for python 3.11+
category: notes
publishedDate: 2025-02-23
---

Below is a set of snippets that I used frequently when using pytest in the later versions of python.

### asyncio tests without any plugins

The following snippet adds very basic support to pytest for async tests in python 3.11 and above.
Add it to your `conftest.py` and async tests will run in an an `asyncio.Runner`

```python
import asyncio
import inspect
import logging
from contextlib import contextmanager
from typing import Any, AsyncGenerator, Generator, TypeVar

import pytest

# Set up logging for debugging
logger = logging.getLogger(__name__)

T = TypeVar("T")


@contextmanager
def async_to_sync_generator(
    runner: asyncio.Runner, agen: AsyncGenerator[T, Any]
) -> Generator[T | None, None, None]:
    """
    Converts an async generator into a synchronous generator using the provided asyncio.Runner.
    """

    async def get_next(agen):
        try:
            return await anext(agen), None
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
        # Ensure cleanup for the async generator
        runner.run(agen.aclose())


def pytest_sessionstart(session):
    """Initialize an asyncio.Runner for the pytest session."""
    if not hasattr(asyncio, "Runner"):
        pytest.exit("This plugin requires Python 3.11 or higher", returncode=1)
    session.asyncio_runner = asyncio.Runner()
    logger.debug("Asyncio Runner initialized for the session.")


def pytest_sessionfinish(session):
    """Close the asyncio.Runner after the session ends."""
    if hasattr(session, "asyncio_runner"):
        try:
            session.asyncio_runner.close()
            logger.debug("Asyncio Runner closed after the session.")
        except Exception as e:
            logger.error(f"Error closing asyncio Runner: {e}")


async def anext(agen: AsyncGenerator):
    """Fetch the next item from an async generator."""
    return await agen.__anext__()


@pytest.hookimpl(hookwrapper=True)
def pytest_fixture_setup(fixturedef, request):
    """
    Convert async fixtures into their synchronous counterparts, handling both async generators and coroutines.
    """
    if inspect.isasyncgenfunction(fixturedef.func):
        generator = fixturedef.func

        def gen_wrapper(*args, **kwargs):
            runner: asyncio.Runner = request.session.asyncio_runner
            gen_obj = generator(*args, **kwargs)
            with async_to_sync_generator(runner, gen_obj) as v:
                yield v

        fixturedef.func = gen_wrapper
        logger.debug(f"Converted async generator fixture {fixturedef.func} to sync.")

    elif inspect.iscoroutinefunction(fixturedef.func):
        coro = fixturedef.func
        runner: asyncio.Runner = request.session.asyncio_runner

        def coro_wrapper(*args, **kwargs):
            return runner.run(coro(*args, **kwargs))

        fixturedef.func = coro_wrapper
        logger.debug(f"Converted coroutine fixture {fixturedef.func} to sync.")

    yield


@pytest.hookimpl(hookwrapper=True)
def pytest_runtest_call(item):
    """
    Convert async test functions to sync functions by running them in the asyncio.Runner.
    """
    if inspect.iscoroutinefunction(item.obj):
        runner = item.session.asyncio_runner
        original = item.obj

        def item_wrapper(*args, **kwargs):
            return runner.run(original(*args, **kwargs))

        item.obj = item_wrapper
        logger.debug(f"Converted async test {item.obj} to sync.")

    yield

```

#### integration tests

Mark tests as integration tests that don't run by default.
You have to run pytest with the `--integration` flag to run them.

```python
def pytest_addoption(parser):
    parser.addoption(
        "--integration",
        action="store_true",
        default=False,
        help="Run tests marked with @pytest.mark.integration",
    )


def pytest_configure(config):
    config.addinivalue_line(
        "markers", "integration: mark test to run only with --integration"
    )


def pytest_collection_modifyitems(config, items):
    if config.getoption("--integration"):
        # Only run tests marked with 'integration'
        integration_items = [item for item in items if "integration" in item.keywords]
        items[:] = integration_items
    else:
        # Skip tests marked with 'integration'
        skip_integration = pytest.mark.skip(reason="Need --integration option to run")
        for item in items:
            if "integration" in item.keywords:
                item.add_marker(skip_integration)
```

#### sqlalchemy async support with factory-boy

I find passing in an explicit session easier than the built in factory-boy session local behaviour.
So this is a little snippet adds factory generated instances to the current session.


```python

# factory
T = TypeVar("T", bound=BaseFactory)
Factory = Callable[Concatenate[Type[T], ...], Awaitable[T]]


@pytest.fixture(scope="function", name="factory")
async def factory_fixture(session: AsyncSession):
    """
    Creates a factory fixture for creating models.
    Explicitly uses the current active session
    """

    async def fn(factory: Type[T], **overrides):
        instance = factory.build(**overrides)
        session.add(instance)
        await session.flush()
        return instance

    return fn

### usage

async def test_user(factory: Factory):
    instance = await factory(UserFactory)
```
