import Link from "next/link";

export default function Home() {
  return (
    <main className="mx-auto flex w-full max-w-6xl flex-1 flex-col px-6 py-8 sm:px-10">
      <section className="rounded-[1.75rem] border border-stone-900/10 bg-white/85 p-5 shadow-[0_20px_60px_rgba(120,53,15,0.08)]">
        <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
          <div className="min-w-0">
            <div className="text-[11px] uppercase tracking-[0.24em] text-stone-500">
              Lithub Console
            </div>
            <h1 className="mt-2 text-2xl font-semibold tracking-tight text-stone-950">
              AI 书籍生成后台
            </h1>
            <p className="mt-2 max-w-3xl text-sm leading-6 text-stone-600">
              当前开发模式已经切到本地热更新。日常开发只需要本地运行 Next.js 和 worker，Docker 负责 MongoDB 与 Redis，不需要每次重新构建镜像。
            </p>
          </div>

          <div className="flex shrink-0 flex-wrap gap-3">
            <Link
              className="inline-flex h-10 items-center justify-center rounded-full bg-stone-950 px-5 text-sm font-medium text-white transition hover:bg-stone-800"
              href="/books"
            >
              书籍工作台
            </Link>
            <Link
              className="inline-flex h-10 items-center justify-center rounded-full border border-stone-900/10 bg-white px-5 text-sm font-medium text-stone-800 transition hover:bg-stone-50"
              href="/books"
            >
              新建书籍
            </Link>
          </div>
        </div>
      </section>

      <section className="mt-5 grid gap-4 lg:grid-cols-[1.15fr_0.85fr]">
        <div className="rounded-[1.5rem] border border-stone-900/10 bg-white/82 p-5 shadow-[0_20px_60px_rgba(120,53,15,0.08)]">
          <div className="text-[11px] uppercase tracking-[0.24em] text-stone-500">
            Development Flow
          </div>
          <div className="mt-4 grid gap-3">
            <Stage label="1" title="创建书籍实体" desc="书籍先独立存在，再由任务消费。" />
            <Stage label="2" title="从详情页发起任务" desc="避免任务和书籍耦合成一次性请求。" />
            <Stage label="3" title="worker 异步生成" desc="长链路步骤在队列中推进并回写状态。" />
            <Stage label="4" title="持续查看结果" desc="通过书籍详情和任务详情观察执行情况。" />
          </div>
        </div>

        <div className="rounded-[1.5rem] border border-stone-900/10 bg-stone-950 p-5 text-stone-100 shadow-[0_20px_60px_rgba(41,37,36,0.24)]">
          <div className="text-[11px] uppercase tracking-[0.24em] text-amber-300">
            Dev Commands
          </div>
          <pre className="mt-4 overflow-x-auto text-sm leading-6 text-stone-300">
{`pnpm dev:infra
pnpm dev
pnpm dev:worker`}
          </pre>
          <p className="mt-4 text-sm leading-6 text-stone-300">
            本地界面默认运行在 <span className="font-semibold text-stone-100">3000</span>，生产式代理入口仍保留在 Docker 的 <span className="font-semibold text-stone-100">3001</span>。
          </p>
        </div>
      </section>
    </main>
  );
}

function Stage({
  label,
  title,
  desc,
}: {
  label: string;
  title: string;
  desc: string;
}) {
  return (
    <div className="grid grid-cols-[2rem_minmax(0,1fr)] items-start gap-3 rounded-[1.25rem] border border-stone-900/10 bg-stone-50/80 px-4 py-3">
      <div className="flex h-8 w-8 items-center justify-center rounded-full bg-stone-950 text-xs font-semibold text-white">
        {label}
      </div>
      <div>
        <div className="text-sm font-semibold text-stone-900">{title}</div>
        <div className="mt-1 text-sm leading-6 text-stone-600">{desc}</div>
      </div>
    </div>
  );
}
