# Lithub

Lithub 是一个面向 AI 小说、长篇故事和其他书籍内容生成的工作台项目。当前仓库已经初始化为：

- `Next.js 16` Web + BFF
- `MongoDB` 业务数据存储
- `Redis + BullMQ` 长任务队列
- `worker` 独立消费生成任务
- `Nginx` 反向代理入口
- `Docker Compose` 本地或单机部署

## Quick Start

1. 复制环境变量：

```bash
cp .env.example .env
```

如果本机已经占用了 `3000`、`27017`、`6379`，还需要同步检查 [docker/.env](/Users/fanjunjie/Documents/repositories/personal/lithub/docker/.env) 里的宿主机端口映射。`docker compose` 默认读取的是 `docker/` 目录下的 `.env`，不是仓库根目录的 `.env`。

2. 安装依赖：

```bash
pnpm install
```

3. 启动基础设施：

```bash
docker compose -f docker/docker-compose.yaml up -d mongo redis
```

4. 启动 Web：

```bash
pnpm dev
```

5. 启动 Worker：

```bash
pnpm dev:worker
```

## API

- `GET /api/health`
- `GET /api/jobs`
- `POST /api/jobs`

示例创建任务：

```bash
curl -X POST http://localhost:3000/api/jobs \
  -H 'Content-Type: application/json' \
  -d '{
    "title": "星海归途",
    "premise": "一名失忆舰长在坍缩星门废墟中苏醒。",
    "genre": "科幻冒险",
    "tone": "沉稳克制",
    "targetWords": 80000
  }'
```

## Docker Compose

完整部署：

```bash
docker compose -f docker/docker-compose.yaml up --build
```

默认服务：

- `nginx` on `http://localhost:3001`
- `web` internal only
- `worker`
- `mongo` on `localhost:27018`
- `redis` on `localhost:6380`

## Deployment Notes

### 1. Compose-level env vs app-level env

- 仓库根目录 `.env` 供应用容器内部使用，比如 `MONGODB_URI`、`REDIS_URL`
- `docker/.env` 供 `docker compose` 自身做变量替换，比如 `WEB_PORT`、`MONGO_PORT`、`REDIS_PORT`
- `docker/.env` 供 `docker compose` 自身做变量替换，比如 `NGINX_PORT`、`MONGO_PORT`、`REDIS_PORT`
- 如果你只改了根目录 `.env`，compose 里的端口映射不会跟着变

### 2. Next.js production runtime

- 项目启用了 `output: "standalone"`，生产环境不能再用 `next start`
- `web` 服务必须运行 `node server.js`
- `worker` 服务必须使用单独运行时镜像，不能和 `web` 共用一个错误的启动命令
- 外部流量应先进入 `nginx`，不要直接暴露 `web`

这些已经在 [Dockerfile](/Users/fanjunjie/Documents/repositories/personal/lithub/Dockerfile) 和 [docker/docker-compose.yaml](/Users/fanjunjie/Documents/repositories/personal/lithub/docker/docker-compose.yaml) 里固定好了，不要再改回 `pnpm start`

### 3. Port conflicts

- 如果宿主机已有本地 Redis、MongoDB 或其他服务，占用默认端口会导致容器启动失败
- 当前验证使用的是：
  - `NGINX_PORT=3001`
  - `MONGO_PORT=27018`
  - `REDIS_PORT=6380`

### 4. Recommended smoke tests

整栈启动后，优先用下面几条命令验证：

```bash
docker compose -f docker/docker-compose.yaml ps
docker exec docker-web-1 wget -qO- http://127.0.0.1:3000/api/livez
docker exec docker-web-1 wget -qO- http://127.0.0.1:3000/api/readyz
docker exec docker-mongo-1 mongosh --quiet --eval "db.adminCommand({ ping: 1 })"
docker exec docker-redis-1 redis-cli ping
docker exec docker-nginx-1 wget -qO- http://127.0.0.1/healthz
docker compose -f docker/docker-compose.yaml logs --tail=50 worker
```

如果你在某些受限环境里发现宿主机 `curl http://127.0.0.1:<port>` 不稳定，优先以容器内探活命令为准。

### 5. What has been verified

我已经验证过以下链路：

- `web` 镜像构建成功
- `worker` 镜像构建成功
- `mongo`、`redis`、`web`、`worker` 全部启动成功
- `nginx`、`web` 健康检查通过
- `mongo` ping 成功
- `redis` ping 成功
- 通过 `POST /api/jobs` 成功写入 Mongo、推入 Redis、由 worker 消费并完成任务

### 6. Health endpoints

- `/api/livez`: 仅用于进程存活检查，不依赖外部服务
- `/api/readyz`: 用于就绪检查，会同时验证 MongoDB 和 Redis
- `nginx` 对外暴露 `/healthz`，反代到 `web` 的 `/api/livez`

建议：

- 容器 `healthcheck` 默认打 `livez`
- 发布系统或上游负载均衡探活可打 `healthz`
- 真正需要检查依赖联通性时再打 `readyz`

### 7. Logging and operations

- 当前所有容器日志默认输出到 stdout/stderr，适合先接 Docker logging driver 或外部日志系统
- `worker` 已使用结构化 JSON 日志，便于后续接入 Loki、ELK 或 Datadog
- `nginx` 已经关闭代理缓冲，适合后续接流式响应

### 8. Resource guidance

当前 compose 文件没有硬编码资源上限，原因是不同开发机差异较大。建议线上至少按下面的量级规划：

- `nginx`: `0.25 CPU / 128MB`
- `web`: `1 CPU / 512MB`
- `worker`: `1 CPU / 512MB`
- `mongo`: `1 CPU / 1GB`
- `redis`: `0.5 CPU / 256MB`

如果后面切到云主机或正式环境，可以再把这些限制固化到部署模版里。

## Next Steps

- 接入真实 LLM provider
- 拆分大纲、角色卡、章节生成和润色流水线
- 增加版本管理和导出流程
- 接入 MinIO 用于封面和导出文件
