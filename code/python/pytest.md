

---
title: pytest
category: code
status: seedling
url: /code/python/pytest
description: Notes on pytest
---

## Assert raises exception

```python
async def test_get_note_errors_when_note_not_found():
    user_id = uuid4()
    not_found_id = uuid4()

    class FakeRepo:
        async def findOne(self):
            return None

    service = NotesService({"user_id": user_id}, FakeRepo)

    with pytest.raises(NotFoundException):
        await service.get_note(not_found_id)
```
From https://stackoverflow.com/questions/23337471/how-to-properly-assert-that-an-exception-gets-raised-in-pytest