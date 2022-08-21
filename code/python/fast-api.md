---
title: FastAPI
category: code
status: seedling
url: /code/python/fast-api
description: Notes on FastAPI
---

## Routers

You can think of APIRouter as a "mini FastAPI" class.

- All the same options are supported.
- All the same parameters, responses, dependencies, tags, etc.

```python
from fastapi import APIRouter

router = APIRouter(
    prefix="/notes",
    tags=["notes"],
    dependencies=[Depends(get_current_user)],
)
```

Then from main app

```python
app.include_router(notes_router)
```

You can also include a router in another router:

```python
router.include_router(other_router)
```

More info https://fastapi.tiangolo.com/tutorial/bigger-applications/

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

## Example data

https://fastapi.tiangolo.com/tutorial/schema-extra-example/

Interesting thought to separate into separate example's file so model isn't cluttered

```python
class Item(BaseModel):
    name: str
    description: str | None = None
    price: float
    tax: float | None = None

    class Config:
        schema_extra = {
            "example": {
                "name": "Foo",
                "description": "A very nice Item",
                "price": 35.4,
                "tax": 3.2,
            }
        }
```

- ![External examples](https://imagedelivery.net/jUwSKjsiLWz8U8lfkVW6uQ/08b505a3-f0b2-41e5-2b4c-445e87cf1b00/public)

From https://medium.com/@estretyakov/the-data-scraping-on-demand-using-fastapi-39a0bd47146b