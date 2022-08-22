---
title: python
category: code
status: seedling
url: /code/python
description: Notes on python
---

## Related

- [alembic](alembic.md)
- [fast-api](fast-api.md)
- [pydantic](pydantic.md)
- [pytest](pytest.md)
- [SQLModel](sql-model.md)

## Async Generators

### Typing

https://docs.python.org/3/library/typing.html#typing.AsyncGenerator

```python
@pytest_asyncio.fixture(scope="function")
async def async_session() -> AsyncGenerator[AsyncSession, None]:
    session = sessionmaker(async_engine, class_=AsyncSession, expire_on_commit=False)

    async with session() as s:
        async with async_engine.begin() as conn:
            await conn.run_sync(SQLModel.metadata.create_all)

        yield s

    async with async_engine.begin() as conn:
        await conn.run_sync(SQLModel.metadata.drop_all)

    await async_engine.dispose()
```