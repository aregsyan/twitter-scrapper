LOG_PATH := $(or $(LOGPATH), './logs')
DB_PATH := $(or $(DBPATH), './mongodb')

default: build

build:
	@echo BUILD WEB-DEV
	@LOG_PATH=$(LOG_PATH) DB_PATH=$(DB_PATH) docker-compose -f docker-compose.yml -p twitter-scapper build

run: stop build
	@echo START WEB-DEV
	@LOG_PATH=$(LOG_PATH) DB_PATH=$(DB_PATH) docker-compose -f docker-compose.yml -p twitter-scapper up --remove-orphans -d

stop:
	@echo STOP WEB-DEV
	@docker stop twitter-scrapper-app || true && docker rm twitter-scrapper-app || true
	@docker stop twitter-scrapper-db || true && docker rm twitter-scrapper-db || true

clean: stop
	@docker ps -q -f status=exited | while read l; do docker rm $$l; done
	@docker images -q -f dangling=true | while read l; do docker rmi $$l; done
	@docker system prune -f