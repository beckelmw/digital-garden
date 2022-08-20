---
title: Docker
category: code
status: seedling
url: /code/docker
description: Notes on using docker
---

## Environment variables

Docker compose can use your `.env` file.

```toml
version: '3.8'

services:

  web:
    env_file:
      - .env
```