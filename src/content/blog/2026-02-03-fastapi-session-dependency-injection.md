---
title: FastAPI database session dependency injection considered harmful
category: notes
publishedDate: 2026-02-03
---

The common FastAPI pattern of injecting a database session via `Depends()` creates a long-lived session that spans the entire request lifecycle. This causes subtle bugs.

## The pattern

```python
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

@app.get("/users/{user_id}")
def get_user(user_id: int, db: Session = Depends(get_db)):
    return db.query(User).filter(User.id == user_id).first()
```

## The problems

**Stale reads.** SQLAlchemy's identity map caches objects. If you read a user early in the request, then call an external service that modifies that user, subsequent reads return stale cached data.

```python
@app.post("/process")
def process(db: Session = Depends(get_db)):
    user = db.query(User).get(1)  # cached
    external_service.update_user(1)  # modifies user in another transaction
    user = db.query(User).get(1)  # still returns cached version
```

**Memory accumulation.** Every object loaded stays in the session's identity map. Long-running requests that process many records accumulate memory.

**Background tasks inherit dead sessions.** FastAPI background tasks run after the response is sent, but the session is already closed.

```python
@app.post("/submit")
def submit(background_tasks: BackgroundTasks, db: Session = Depends(get_db)):
    background_tasks.add_task(send_email, db)  # db is closed when this runs
    return {"status": "ok"}
```

## Alternatives

**Explicit session management.** Create sessions where you need them with clear boundaries.

```python
@app.post("/process")
def process():
    with SessionLocal() as db:
        user = db.query(User).get(1)
        # do work
    # session closed, cache cleared

    with SessionLocal() as db:
        user = db.query(User).get(1)  # fresh read
```

**Expire on commit.** Use `expire_on_commit=True` and commit frequently to force fresh reads. This is the default but often disabled.

**Session-per-operation.** For read-heavy endpoints, use `db.expire_all()` or create short-lived sessions for each logical operation.

The convenience of dependency injection hides the session lifecycle from you. Sometimes that's fine. Often it's not.
