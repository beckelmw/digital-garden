---
title: python
category: code
status: seedling
url: /code/python
description: Notes on python
---

## Related

- [alembic](/code/python/alembic.md)
- [fast-api](/code/python/fast-api.md)
- [pydantic](/code/python/pydantic.md)
- [pytest](/code/python/pytest.md)
- [SQLModel](/code/python/sql-model.md)

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
From https://medium.com/@estretyakov/the-ultimate-async-setup-fastapi-sqlmodel-alembic-pytest-ae5cdcfed3d4 with typing fixed


### Async Context Manager

Class needs to implement `__aenter__` and `__aexit`. See https://docs.python.org/3/reference/datamodel.html#async-context-managers.

```python
class UnitOfWork(Generic[T], AbstractAsyncContextManager):
    def __init__(self, model: Type[T]):
        self.model = model

    def __call__(self, session: AsyncSession = Depends(get_session)):
        self.session = session
        return self

    async def __aenter__(self):
        self.repo: RepositoryProtocol[T] = Repository(model=self.model)(self.session)

    async def __aexit__(self, *args):
        self.session.close()

    async def commit(self) -> None:
        await self.session.commit()

    async def rollback(self) -> None:
        await self.session.rollback()

```