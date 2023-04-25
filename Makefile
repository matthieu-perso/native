.PHONY: test-frontend test-backend test-e2e test-all

all: help

test-frontend:
	npm test

test-backend:
	pytest

test-e2e:
	npm test app.e2e.test.js

test-all: test-frontend test-backend test-e2e


help:
	@echo '----'
	@echo 'test-frontend - run frontend unit tests'
	@echo 'test-backend - run backend unit tests'
	@echo 'test-e2e - run end-to-end tests'
	@echo 'test-all - run all tests (frontend, backend, and e2e)'