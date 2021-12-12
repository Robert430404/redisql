container-name = redisql-dev-redis

start-dev:
	podman run --name $(container-name) -p 6379:6379 -d redis

stop-dev:
	podman stop $(container-name)
	podman rm $(container-name)

unit-test:
	npm run test:unit

integration-test:
	npm run test:integration