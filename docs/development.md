# Development Workflow

## Goal

开发阶段不再使用应用镜像反复重建。推荐模式是：

- MongoDB 和 Redis 通过 Docker 提供
- Next.js Web 本地运行，使用热更新
- worker 本地运行，使用热更新

## Commands

启动基础设施：

```bash
pnpm dev:infra
```

启动 Web：

```bash
pnpm dev
```

启动 Worker：

```bash
pnpm dev:worker
```

停止基础设施：

```bash
pnpm dev:infra:down
```

## Ports

- Web: `http://localhost:3000`
- MongoDB: `127.0.0.1:27018`
- Redis: `127.0.0.1:6380`
- Docker 代理入口仍可保留在 `http://localhost:3001`

## Notes

- 根目录 `.env` 已经改成指向 `27018` 和 `6380`，适配本地开发
- `docker/docker-compose.yaml` 仍然用于生产式整栈验证
- 日常改动页面、接口、worker 逻辑时，不需要重新 build 镜像
