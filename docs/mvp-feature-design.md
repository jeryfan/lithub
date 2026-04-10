# Lithub MVP Feature Design

## Goal

首版目标不是做完整的“出版平台”，而是做一个可稳定运行的“AI 书籍生成工作台”。

这个版本需要解决四个核心问题：

1. 能创建一本待生成的书籍项目
2. 能把生成任务可靠地提交到队列并异步执行
3. 能持续看到任务步骤、日志和中间结果
4. 能对失败任务进行定位和重跑，而不是只能全量重来

## Product Positioning

当前阶段默认是单租户内部系统，不做登录、多租户、支付或权限隔离。所有功能围绕“内容团队内部生产”设计。

适用场景：

- AI 小说生成
- 非虚构长文或书稿骨架生成
- 世界观、角色卡、分卷、章节的结构化创作

不在 MVP 范围内：

- 对外发布平台
- 公开读者端
- 复杂协作权限
- 商业计费

## MVP Scope

### Must Have

- 书籍项目创建
- 书籍列表与详情页
- 基础设定编辑
- 生成任务创建
- 任务状态页
- 步骤日志展示
- 章节草稿结果展示
- 单任务重跑
- 最小导出能力

### Nice to Have

- 章节版本对比
- 批量任务排队
- 角色卡和世界观面板
- 生成参数模板
- 手动补写某一步

### Excluded

- 用户体系
- 团队协作审批
- 模型计费系统
- 复杂审查系统

## Primary User Flows

### Flow 1: Create Book Project

1. 进入书籍列表页
2. 点击“新建项目”
3. 输入基础信息
4. 保存后跳转到书籍详情页

基础字段：

- 书名
- 题材
- 核心 premise
- 风格
- 目标字数
- 目标受众
- 叙事视角

### Flow 2: Start Generation

1. 在书籍详情页点击“开始生成”
2. 选择生成模式
3. 提交任务
4. 前端显示任务已入队
5. 跳转到任务详情页

生成模式建议：

- 快速草稿：先出总纲和前两章
- 标准生成：出总纲、分卷、章节草稿
- 章节续写：针对指定章节继续生成

### Flow 3: Monitor Progress

1. 打开任务详情页
2. 查看当前步骤
3. 查看每一步日志
4. 查看结果产物
5. 如果失败，看到失败步骤和错误原因

### Flow 4: Retry Failed Step

1. 在任务详情页点击“从失败步骤重跑”
2. 系统创建新的 job attempt
3. 继承书籍上下文和已有中间产物
4. 只从指定步骤继续执行

## Information Architecture

建议第一版页面结构：

- `/`
  - 仪表盘
- `/books`
  - 书籍列表
- `/books/new`
  - 新建书籍
- `/books/[bookId]`
  - 书籍详情
- `/books/[bookId]/edit`
  - 书籍设定编辑
- `/jobs`
  - 任务列表
- `/jobs/[jobId]`
  - 任务详情
- `/settings`
  - 系统设置

## Screen Design Requirements

### Dashboard

目标是先让人一眼看到系统运行状态，而不是做宣传页。

应显示：

- 总书籍数
- 运行中任务数
- 失败任务数
- 最近完成任务
- 最近错误日志

### Books List

列表字段：

- 书名
- 题材
- 当前状态
- 最新版本
- 最近更新时间
- 最近任务状态

操作：

- 新建
- 查看详情
- 发起生成

### Book Detail

分成四块：

- 基础设定
- 最近任务
- 章节结果
- 当前版本摘要

首版重点是把“可生成”和“可观测”做扎实，不要一开始就堆太多编辑器功能。

### Job Detail

这是 MVP 最重要的页面。

必须包含：

- 任务状态
- 当前步骤
- 步骤时间线
- 原始日志
- 结果预览
- 错误信息
- 重跑按钮

## Generation Pipeline Design

第一版建议固定为下面的流水线：

1. `outline`
2. `world-setup`
3. `character-setup`
4. `volume-plan`
5. `chapter-plan`
6. `chapter-draft`
7. `chapter-polish`
8. `finalize`

### Why this pipeline

- 结构清晰，便于观察
- 每一步都可以单独持久化
- 失败后可以局部重跑
- 后续替换成真实 LLM provider 时不会推翻整体架构

### First Implemented Pipeline

为了降低首版复杂度，最先落地的可运行版本只实现：

1. `outline`
2. `chapter-draft`
3. `finalize`

其余步骤先保留为扩展位。

## Domain Model

### Book

表示一本书的主实体。

建议字段：

- `title`
- `genre`
- `premise`
- `status`
- `settings`
- `latestVersion`
- `activeJobId`

### BookVersion

表示一本书在某个版本下的内容快照。

建议字段：

- `bookId`
- `version`
- `outline`
- `worldSummary`
- `characterSummary`
- `chapterIds`
- `snapshotNote`

### Chapter

表示章节内容。

建议字段：

- `bookId`
- `version`
- `chapterNo`
- `title`
- `status`
- `content`
- `summary`

### GenerationJob

表示一次完整的生成任务。

建议字段：

- `bookId`
- `status`
- `mode`
- `currentStep`
- `steps`
- `logs`
- `result`
- `failedReason`
- `attempt`
- `retryFromStep`

### GenerationStep

建议字段：

- `name`
- `status`
- `startedAt`
- `finishedAt`
- `inputRef`
- `outputRef`
- `detail`

### ModelInvocation

当前仓库还没接真实 LLM，但这张表应该预留。

建议字段：

- `jobId`
- `step`
- `provider`
- `model`
- `promptDigest`
- `inputTokens`
- `outputTokens`
- `latencyMs`
- `status`
- `error`

## API Design

### Books

- `GET /api/books`
- `POST /api/books`
- `GET /api/books/:id`
- `PATCH /api/books/:id`

### Jobs

- `GET /api/jobs`
- `POST /api/jobs`
- `GET /api/jobs/:id`
- `POST /api/jobs/:id/retry`

### Chapters

- `GET /api/books/:id/chapters`
- `GET /api/chapters/:id`
- `PATCH /api/chapters/:id`

### System

- `GET /api/livez`
- `GET /api/readyz`
- `GET /api/health`

## Frontend Module Plan

建议按模块拆，而不是按技术层平铺。

### `src/modules/books`

职责：

- 书籍模型
- 书籍 CRUD 服务
- 书籍表单 schema
- 书籍列表页和详情页相关组件

### `src/modules/generation`

职责：

- 任务创建
- 任务查询
- 步骤状态管理
- 重跑逻辑
- 日志和结果聚合

### `src/modules/chapters`

职责：

- 章节实体
- 章节展示
- 后续人工编辑入口

### `src/modules/settings`

职责：

- 默认模型配置
- 默认生成参数
- 系统级模板

## Worker Responsibilities

worker 只做三类事：

1. 消费任务
2. 推进步骤状态
3. 写回结果

worker 不应该负责：

- 页面拼装
- 复杂请求鉴权
- 直接处理浏览器交互

## Error Handling Rules

### API Layer

- 请求参数错误返回 `400`
- 找不到资源返回 `404`
- 业务冲突返回 `409`
- 未知错误返回 `500`

### Job Layer

- job 失败必须记录 `failedReason`
- 失败步骤必须可定位
- 所有步骤都要记日志
- job 重试不能覆盖旧 attempt

### Worker Layer

- 每一步都要包裹错误边界
- 同一任务避免并发执行
- 遇到依赖错误时直接 fail fast

## Development Phases

### Phase 1: Book CRUD

产出：

- `books` API
- 书籍列表页
- 新建书籍页
- 编辑书籍页

### Phase 2: Job UI

产出：

- 任务列表页
- 任务详情页
- 从书籍详情页发起生成

### Phase 3: Pipeline Persistence

产出：

- `book_versions`
- `chapters`
- 更完整的步骤状态记录

### Phase 4: Retry and Recovery

产出：

- `retry` API
- 从指定步骤重跑
- 多 attempt 展示

### Phase 5: Export

产出：

- 导出 markdown
- 导出 txt
- 为后续 epub/pdf 预留接口

## Recommended Next Build Tasks

下一轮开发建议严格按下面顺序推进：

1. 增加 `books` 数据模型和 CRUD API
2. 增加 `/books`、`/books/new`、`/books/[id]` 页面
3. 将当前 `POST /api/jobs` 从“创建书籍并建任务”改为“基于现有书籍创建任务”
4. 增加 `GET /api/jobs/:id`
5. 增加任务详情页
6. 为 job 增加 `attempt` 和 `retryFromStep`

## Decision Summary

这个项目的首版应该是：

- 单租户
- 强后台工作台
- 异步任务优先
- 可观察性优先
- 局部重跑优先

不要先做成一个看起来完整但内部链路脆弱的“小说网站”。先把生产流程和失败恢复做对。
