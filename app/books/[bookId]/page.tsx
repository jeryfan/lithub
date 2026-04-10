import Link from "next/link";
import { notFound } from "next/navigation";

import { BookSettingsForm } from "@/src/modules/books/components/book-settings-form";
import { getBookDashboard } from "@/src/modules/books/book.service";

export const dynamic = "force-dynamic";

function formatDate(value: Date | string) {
  return new Intl.DateTimeFormat("zh-CN", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(new Date(value));
}

export default async function BookDetailPage({
  params,
}: {
  params: Promise<{ bookId: string }>;
}) {
  const { bookId } = await params;
  const dashboard = await getBookDashboard(bookId);

  if (!dashboard) {
    notFound();
  }

  const { book, jobs } = dashboard;
  const settings = book.settings ?? {
    tone: "cinematic",
    targetWords: 50000,
    model: "mock-llm",
    audience: "general",
    pointOfView: "third-person",
  };

  return (
    <main className="mx-auto flex w-full max-w-6xl flex-1 flex-col px-6 py-8 sm:px-10">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <Link
            href="/books"
            className="text-sm font-medium text-stone-500 transition hover:text-stone-900"
          >
            ← 返回书籍列表
          </Link>
          <h1 className="mt-3 text-3xl font-semibold tracking-tight text-stone-950">
            {book.title}
          </h1>
          <p className="mt-3 max-w-3xl text-sm leading-6 text-stone-600">
            {book.premise}
          </p>
        </div>

        <div className="rounded-full border border-stone-900/10 bg-white/70 px-4 py-2 text-xs text-stone-600">
          生成任务入口位于下方的书籍设定面板。
        </div>
      </div>

      <section className="mt-5 grid gap-5 lg:grid-cols-[1.15fr_0.85fr]">
        <div className="rounded-[1.5rem] border border-stone-900/10 bg-white/82 p-5 shadow-[0_20px_60px_rgba(120,53,15,0.08)]">
          <div className="text-[11px] uppercase tracking-[0.24em] text-stone-500">
            Book Settings
          </div>
          <BookSettingsForm
            book={{
              _id: String(book._id),
              title: book.title,
              premise: book.premise,
              genre: book.genre,
              status: book.status,
              settings: {
                tone: settings.tone,
                targetWords: settings.targetWords,
                model: settings.model,
                audience: settings.audience,
                pointOfView: settings.pointOfView,
              },
            }}
          />
        </div>

        <div className="rounded-[1.5rem] border border-stone-900/10 bg-stone-950 p-5 text-stone-100 shadow-[0_20px_60px_rgba(41,37,36,0.24)]">
          <div className="text-[11px] uppercase tracking-[0.24em] text-amber-300">
            Snapshot
          </div>
          <div className="mt-4 grid gap-3 sm:grid-cols-2">
            <MetricCard label="状态" value={book.status} />
            <MetricCard label="版本" value={`v${book.latestVersion}`} />
            <MetricCard label="目标字数" value={String(settings.targetWords)} />
            <MetricCard label="最近更新" value={formatDate(book.updatedAt)} />
          </div>
        </div>
      </section>

      <section className="mt-5 rounded-[1.5rem] border border-stone-900/10 bg-white/82 p-5 shadow-[0_20px_60px_rgba(120,53,15,0.08)]">
        <div className="flex items-end justify-between gap-4">
          <div>
            <div className="text-[11px] uppercase tracking-[0.24em] text-stone-500">
              Recent Jobs
            </div>
            <h2 className="mt-2 text-xl font-semibold text-stone-950">最近任务</h2>
          </div>
          <Link
            href="/api/jobs"
            className="text-sm font-medium text-stone-500 transition hover:text-stone-900"
          >
            查看原始接口
          </Link>
        </div>

        <div className="mt-6 grid gap-4">
          {jobs.length === 0 ? (
            <div className="rounded-[1.25rem] border border-dashed border-stone-900/15 bg-stone-50 px-6 py-10 text-center text-sm text-stone-600">
              这本书还没有生成任务。
            </div>
          ) : (
            jobs.map((job) => (
              <div
                key={String(job._id)}
                className="rounded-[1.25rem] border border-stone-900/10 bg-white px-4 py-4"
              >
                <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                  <div>
                    <div className="text-base font-semibold text-stone-950">
                      Job {String(job._id).slice(-6)}
                    </div>
                    <div className="mt-1 text-sm text-stone-600">
                      {job.status} · 当前步骤 {job.currentStep}
                    </div>
                  </div>
                  <div className="text-sm text-stone-500">
                    {formatDate(job.createdAt)}
                  </div>
                </div>

                <div className="mt-4 flex flex-wrap gap-2">
                  {job.steps.map((step) => (
                    <span
                      key={step.name}
                      className="rounded-full border border-stone-900/10 bg-stone-50 px-3 py-1 text-xs font-medium text-stone-700"
                    >
                      {step.name}: {step.status}
                    </span>
                  ))}
                </div>
              </div>
            ))
          )}
        </div>
      </section>
    </main>
  );
}

function MetricCard({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-[1rem] border border-white/10 bg-white/5 px-4 py-3">
      <div className="text-[10px] uppercase tracking-[0.24em] text-stone-400">{label}</div>
      <div className="mt-2 text-base font-semibold text-stone-100">{value}</div>
    </div>
  );
}
