---
title: Pydantic
category: code
status: seedling
url: /code/python/pydantic
description: Notes on using pydantic
---

One of pydantic's most useful applications is [settings management](https://pydantic-docs.helpmanual.io/usage/settings/).

Given environment variables in an `.env` file:

```
DATABASE_URL=
```

```python
from pydantic import BaseSettings


class Settings(BaseSettings):
    DATABASE_URL: str
```

Usage:

```python
    settings = Settings()
```

In my case I am using vscode with a `launch.json` configuration to pull in the environment variables:

```json
{
  "version": "0.2.0",
  "configurations": [
    {
      "name": "Python: FastAPI",
      "type": "python",
      "request": "launch",
      "module": "uvicorn",
      "args": ["project.app.main:app"],
      "jinja": true,
      "justMyCode": true,
      "envFile": "${workspaceFolder}/.env"
    }
  ]
}

```

When running with docker-compose I am using the `env_file`

```yaml
services:
  db:
    image: postgres:13.4
    ports:
      - 5432:5432
    env_file:
      - .env
```