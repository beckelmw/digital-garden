---
title: SQLModel
category: code
status: seedling
url: /code/python/sql-model
description: Notes on SQLModel
---

## Setting the table name
```python
class User(UserBase, UUIDModel, table=True):
    __tablename__ = "users"
```

## Example validator

https://pydantic-docs.helpmanual.io/usage/validators/

```python
class UserBase(SQLModel):
    @validator("username")
    def must_be_beckelman_net(cls, v: str):
        if not v.endswith("@beckelman.net"):
            raise ValueError("Username must end with @beckelman.net")
        return v

    first_name: str
    last_name: str
    username: EmailStr = Field(index=True, sa_column_kwargs={"unique": True})
```

## UUID Model

```python
class UUIDModel(SQLModel):
    uuid: uuid_pkg.UUID = Field(
        default_factory=uuid_pkg.uuid4,
        primary_key=True,
        index=True,
        nullable=False,
        sa_column_kwargs={"server_default": text("gen_random_uuid()"), "unique": True},
    )
```
From https://medium.com/@estretyakov/the-ultimate-async-setup-fastapi-sqlmodel-alembic-pytest-ae5cdcfed3d4

## TimestampModel

```python
class TimestampModel(SQLModel):
    created_at: datetime = Field(
        default_factory=datetime.utcnow,
        nullable=False,
        sa_column_kwargs={"server_default": text("current_timestamp(0)")},
    )

    updated_at: datetime = Field(
        default_factory=datetime.utcnow,
        nullable=False,
        sa_column_kwargs={
            "server_default": text("current_timestamp(0)"),
            "onupdate": text("current_timestamp(0)"),
        },
    )
```
From https://medium.com/@estretyakov/the-ultimate-async-setup-fastapi-sqlmodel-alembic-pytest-ae5cdcfed3d4

## Generic Repository

```python
T = TypeVar("T", bound=SQLModel)


class RepositoryProtocol(Protocol[T]):
    async def findOne(self, reference) -> T | None:
        ...

    async def find(self, reference) -> list[T]:
        ...

    async def get(self, id: UUID) -> T | None:
        ...

    async def add(self, item: T) -> T:
        ...

    async def update(self, item: T, data: T) -> T | None:
        ...

    async def delete(self, item: T) -> bool:
        ...
```

- https://peps.python.org/pep-0544/