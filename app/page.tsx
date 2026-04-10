export default function Home() {
  return (
    <div className="relative flex min-h-screen flex-col overflow-hidden bg-[radial-gradient(circle_at_top,#f4e5c3,transparent_35%),linear-gradient(135deg,#f8f4ea_0%,#efe2c8_45%,#d8c6a5_100%)] text-stone-900">
      <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(to_right,rgba(120,53,15,0.08)_1px,transparent_1px),linear-gradient(to_bottom,rgba(120,53,15,0.08)_1px,transparent_1px)] bg-[size:56px_56px] opacity-40" />
      <main className="mx-auto flex w-full max-w-6xl flex-1 flex-col px-6 py-10 sm:px-10 lg:px-12">
        <div className="grid flex-1 gap-8 lg:grid-cols-[1.25fr_0.75fr]">
          <section className="rounded-[2rem] border border-stone-900/10 bg-white/70 p-8 shadow-[0_20px_80px_rgba(120,53,15,0.12)] backdrop-blur sm:p-10">
            <div className="mb-8 inline-flex rounded-full border border-amber-900/15 bg-amber-50 px-4 py-1 text-sm tracking-[0.2em] text-amber-900 uppercase">
              Lithub Studio
            </div>
            <h1 className="max-w-3xl text-4xl font-semibold tracking-tight text-balance sm:text-6xl">
              全自动 AI 小说生成工程骨架已经就位。
            </h1>
            <p className="mt-6 max-w-2xl text-lg leading-8 text-stone-700">
              当前仓库已按 Next.js 单体应用加 worker 的方式规划，适合先做内部工作台，再逐步扩展为完整出版流水线。
            </p>
            <div className="mt-10 grid gap-4 sm:grid-cols-2">
              <div className="rounded-3xl border border-stone-900/10 bg-stone-950 px-5 py-6 text-stone-50">
                <div className="text-sm uppercase tracking-[0.2em] text-amber-300">
                  Runtime
                </div>
                <div className="mt-3 text-2xl font-semibold">Next.js + Worker</div>
                <p className="mt-2 text-sm leading-6 text-stone-300">
                  Web 负责界面和 API，worker 负责长链路生成任务。
                </p>
              </div>
              <div className="rounded-3xl border border-stone-900/10 bg-white px-5 py-6">
                <div className="text-sm uppercase tracking-[0.2em] text-stone-500">
                  Data Plane
                </div>
                <div className="mt-3 text-2xl font-semibold">MongoDB + Redis</div>
                <p className="mt-2 text-sm leading-6 text-stone-600">
                  Mongo 存内容和版本，Redis 负责队列、状态和重试。
                </p>
              </div>
            </div>
            <div className="mt-10 flex flex-col gap-4 sm:flex-row">
              <a
                className="inline-flex h-12 items-center justify-center rounded-full bg-stone-950 px-6 text-sm font-medium text-white transition hover:bg-stone-800"
                href="/api/health"
              >
                检查健康状态
              </a>
              <a
                className="inline-flex h-12 items-center justify-center rounded-full border border-stone-900/10 bg-white/80 px-6 text-sm font-medium text-stone-900 transition hover:bg-white"
                href="/api/jobs"
              >
                查看任务接口
              </a>
            </div>
          </section>

          <section className="flex flex-col gap-4">
            <div className="rounded-[2rem] border border-stone-900/10 bg-stone-900 p-6 text-stone-100 shadow-[0_20px_80px_rgba(41,37,36,0.28)]">
              <div className="text-sm uppercase tracking-[0.24em] text-amber-300">
                First Milestone
              </div>
              <ul className="mt-4 space-y-3 text-sm leading-6 text-stone-300">
                <li>创建书籍项目并保存基础设定</li>
                <li>提交生成任务并进入 Redis 队列</li>
                <li>worker 消费任务并写入章节草稿</li>
                <li>前端通过 API 查看任务状态和结果</li>
              </ul>
            </div>
            <div className="rounded-[2rem] border border-stone-900/10 bg-white/80 p-6">
              <div className="text-sm uppercase tracking-[0.24em] text-stone-500">
                Project Layout
              </div>
              <pre className="mt-4 overflow-x-auto text-sm leading-6 text-stone-700">
{`src/
  lib/db
  lib/queue
  modules/books
  modules/generation
  workers/
app/api/
docker-compose.yml`}
              </pre>
            </div>
          </section>
        </div>
      </main>
    </div>
  );
}
