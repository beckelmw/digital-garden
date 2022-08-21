---
title: Alembic
category: code
status: seedling
url: /code/python/alembic
description: Notes on using alembic for migrations
---

## Init

```bash
alembic init -t async migrations
```

- Add `import sqlmodel` to generated `script.py.mako` file.
- Update `migrations/env.py` to:

```python
import asyncio
import os
from logging.config import fileConfig

from alembic import context
from app.models import User  # noqa: F401 ------------- NEW
from sqlalchemy import engine_from_config, pool
from sqlalchemy.ext.asyncio import AsyncEngine
from sqlmodel import SQLModel  # ------------- NEW

# this is the Alembic Config object, which provides
# access to the values within the .ini file in use.
config = context.config

# Interpret the config file for Python logging.
# This line sets up loggers basically.
fileConfig(config.config_file_name)

# add your model's MetaData object here
# for 'autogenerate' support
# from myapp import mymodel
# target_metadata = mymodel.Base.metadata
target_metadata = SQLModel.metadata   # ------------- UPDATED

# other values from the config, defined by the needs of env.py,
# can be acquired:
# my_important_option = config.get_main_option("my_important_option")
# ... etc.


def run_migrations_offline():
    url = os.getenv("DATABASE_URL")   # ------------- NEW
    context.configure(
        url=url,   # ------------- UPDATED
        target_metadata=target_metadata,
        literal_binds=True,
        dialect_opts={"paramstyle": "named"},
    )

    with context.begin_transaction():
        context.run_migrations()


def do_run_migrations(connection):
    context.configure(connection=connection, target_metadata=target_metadata)

    with context.begin_transaction():
        context.run_migrations()


async def run_migrations_online():
    config_section = config.get_section(config.config_ini_section)  # ------------- NEW
    url = os.getenv("DATABASE_URL")  # ------------- NEW
    config_section["sqlalchemy.url"] = url  # ------------- NEW

    connectable = AsyncEngine(
        engine_from_config(
            config_section,  # ------------- UPDATED
            prefix="sqlalchemy.",
            poolclass=pool.NullPool,
            future=True,
        )
    )

    async with connectable.connect() as connection:
        await connection.run_sync(do_run_migrations)


if context.is_offline_mode():
    run_migrations_offline()
else:
    asyncio.run(run_migrations_online())

```


- Generate the first migration with `alembic revision --autogenerate -m "init"`

## Apply migrations

```bash
alembic upgrade head
```

## Create migration

```bash
alembic revision --autogenerate -m "add year"
```
 

## Tutorials

- https://testdriven.io/blog/fastapi-sqlmodel/