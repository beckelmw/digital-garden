---
title: make
category: code
status: seedling
url: /code/tools/make
description: Notes on using make
---

## Docs

https://www.gnu.org/software/make/manual/make.html

## Make help

Set default target `.DEFAULT_GOAL := help`

https://gist.github.com/prwhite/8168133

```bash
.PHONY: help
help: ## Help
	@awk 'BEGIN {FS = ":.*##"; printf "Usage: make \033[36m<target>\033[0m\n"} /^[a-zA-Z_-]+:.*?##/ { printf "  \033[36m%-10s\033[0m %s\n", $$1, $$2 } /^##@/ { printf "\n\033[1m%s\033[0m\n", substr($$0, 5) } ' $(MAKEFILE_LIST)
```

- ![Make help demo](https://imagedelivery.net/jUwSKjsiLWz8U8lfkVW6uQ/5853efd2-27ee-4195-401d-ec8ac92aa900/public)

## Testing for a required variable with test

```bash
.PHONY add-migration:
add-migration: ## Create migration. Usage make add-migration name=""
	@test -n "$(name)" || (echo 'A name must be defined for the migration. Ex: make add-migration name=init' && exit 1)
	docker-compose exec web alembic revision --autogenerate -m "$(name)"
```

https://stackoverflow.com/questions/4728810/how-to-ensure-makefile-variable-is-set-as-a-prerequisite