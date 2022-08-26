---
title: mypy
category: code
status: seedling
url: /code/python/mypy
description: Notes on using mypy
---

## Configuration

Via command line:

```bash
mypy --disallow-untyped-defs

# Make sure any provided defs are complete
mypy --disallow-incomplete-defs
```

In a `mypi.ini` file:

```
[mypy]
disallow_incomplete_defs = True
```

### Configuration in pyproject.toml

mypi can [pickup configuration from a shared pyproject.toml file](https://mypy.readthedocs.io/en/stable/config_file.html#using-a-pyproject-toml-file). It just needs to be prefixed with `tool.`.

```toml
[tool.mypy]
disallow_incomplete_defs = true
```
