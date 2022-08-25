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