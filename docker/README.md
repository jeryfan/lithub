# Docker Notes

## Files

- `docker/docker-compose.yaml`: compose entrypoint
- `docker/nginx/nginx.conf`: reverse proxy config
- `docker/.env`: host port overrides for compose variable substitution
- `../.env`: application runtime env injected into containers

## Why there are two env files

`docker compose` resolves `${VAR}` from the directory of the compose file. Because the compose file lives under `docker/`, host port variables must be defined in `docker/.env`.

The application itself still reads runtime env from the repo root `.env` through:

- `env_file: ../.env`

Do not merge these two concerns. If you remove `docker/.env`, future runs may silently fall back to `3000/27017/6379` and fail with port conflicts.

## Production runtime

This project uses Next.js standalone output.

- `nginx` is the only public entrypoint
- `web` must run the `web-runtime` image target
- `web` starts with `node server.js`
- `worker` must run the `worker-runtime` image target

Do not switch `web` back to `next start`. That breaks the standalone deployment contract and reintroduces the warning seen during verification.

## Verification commands

```bash
docker compose -f docker/docker-compose.yaml up --build -d
docker compose -f docker/docker-compose.yaml ps
docker exec docker-web-1 wget -qO- http://127.0.0.1:3000/api/livez
docker exec docker-web-1 wget -qO- http://127.0.0.1:3000/api/readyz
docker exec docker-nginx-1 wget -qO- http://127.0.0.1/healthz
docker exec docker-mongo-1 mongosh --quiet --eval "db.adminCommand({ ping: 1 })"
docker exec docker-redis-1 redis-cli ping
docker compose -f docker/docker-compose.yaml logs --tail=50 worker
```

## Health model

- `livez`: process is running
- `readyz`: process is ready and dependencies are reachable
- `nginx /healthz`: external proxy-level probe

Do not replace `livez` with `readyz` in container `healthcheck` blindly. If MongoDB or Redis has a transient issue, using `readyz` as the container liveness probe can trigger avoidable restart loops.
