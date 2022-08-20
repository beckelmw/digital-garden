---
title: Docker
category: code
status: seedling
url: /code/docker
description: Notes on using docker
---

## Environment variables

Docker compose can use your `.env` file. The path is relative to the docker-compose.yml file.

```yml
version: '3.8'

services:

  web:
    env_file:
      - .env
```