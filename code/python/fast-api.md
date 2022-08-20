---
title: FastAPI
category: code
status: seedling
url: /code/python/fast-api
description: Notes on FastAPI
---

## Exception handlers 

```python
@app.exception_handler(ServiceException)
async def service_exception_handler(request: Request, exc: ServiceException):
    headers: dict | None = None
    if exc.code == 401:
        headers = {"WWW-Authenticate": "Bearer"}

    return JSONResponse(
        status_code=exc.code, content={"message": exc.message}, headers=headers
    )
```

More examples https://fastapi.tiangolo.com/tutorial/handling-errors/#install-custom-exception-handlers