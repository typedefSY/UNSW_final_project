.PHONY: default clean install up down destroy pre-commit all demo

all:
	@echo error: please specify a target.
	@cat .dev/make-hints || false
	@false


up:
	docker compose up -d

down:
	docker compose down --remove-orphans

destroy: clean
	docker compose down --volumes --remove-orphans

pre-commit:
	pre-commit install
	pre-commit install --hook-type commit-msg

db-diff:
	docker compose exec backend bash -c 'yarn && yarn prisma migrate dev --name "migration" --create-only'

db-apply:
	docker compose exec backend bash -c 'yarn && yarn prisma migrate dev'

update-endpoints:
	@docker compose exec endpoint-gen bash -c 'python3 rpc/generate.py rpc/model.yml client client/src/backend brainwaves /api'
	@docker compose exec endpoint-gen bash -c 'python3 rpc/generate.py rpc/model.yml ts-server server/src server/src/handlers server/src/apis /api'

clean:
	rm -rf client/node_modules
	rm -rf server/node_modules

# Production-ready Builds
build-local:
	env $$(cat .dev/secrets/local.env) docker compose -f docker-compose.local.yaml build

build-prod:
	env $$(cat .dev/secrets/production.env) docker compose -f docker-compose.build.yaml build

run-prod: build-prod
	env $$(cat .dev/secrets/production.env) docker compose -f docker-compose.build.yaml up

run-prod-up: build-prod
	env $$(cat .dev/secrets/production.env) docker compose -f docker-compose.build.yaml up -d

run-prod-down:
	env $$(cat .dev/secrets/production.env) docker compose -f docker-compose.build.yaml down

run-prod-update: run-prod-down run-prod-up

# Builds additional stuff (namely local db) from local yml.
run-local: build-local
	env $$(cat .dev/secrets/local.env) docker compose -f docker-compose.local.yaml build && \
    env $$(cat .dev/secrets/local.env) docker compose -f docker-compose.local.yaml up
