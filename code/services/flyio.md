---
title: flyio
category: code
status: seedling
url: /code/services/flyio
description: Notes on using fly.io
---

Notes from deploying a python FastAPI app on fly.io using an async postgres connection.

## Connecting to async postgres

You can [attach your app](https://fly.io/docs/reference/postgres/#attaching-an-app-to-a-postgres-app) to the postgres cluster using `flyctl postgres attach --app <app-name> <postgres-app-name>`, but the `DATABASE_URL` they set in your secrets will not work with async postgres. Instead, after you run the attach command you wil need to reset the secret yourself using: 

```
flyctl secrets set DATABASE_URL=postgresql+asyncpg://<USERNAME>:<PASSWORD>@<POSTGRES_APP_NAME>.internal:5432/<DATABASE_NAME>
```

## Connecting to your remote fly.io postgres database locally

```
flyctl proxy <LOCAL_PORT_YOU_WANT>:5432 -a <POSTGRES_APP_NAME>
```

## Startup

I couldn't get a Procfile working and instead set a process entry in the `fly.toml` file. It's important to bind to port 8080 as that is what fly.io is expecting.

```toml
[processes]
web = "gunicorn -w 4 -k uvicorn.workers.UvicornWorker app.main:app --bind=0.0.0.0:8080"
```

## Running migrations

In order to run my alembic migrations, I added a `[deploy]` section to the `fly.toml` file with a `release_command`

```toml
[deploy]
  release_command = "alembic upgrade head"
```