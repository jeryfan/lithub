import Link from "next/link";

import { listBooks } from "@/src/modules/books/book.service";

export const dynamic = "force-dynamic";

export default async function BooksPage() {
  const books = await listBooks();

  return (
    <main className="mx-auto flex w-full max-w-[1500px] flex-1 flex-col px-5 py-6 sm:px-8 lg:px-10">
      <section className="mb-6 flex items-center justify-between gap-4">
        <div className="flex items-center gap-3 text-sm text-stone-500">
          <span className="inline-flex h-9 items-center rounded-full border border-stone-900/10 bg-white px-4 font-medium text-stone-700 shadow-[0_10px_30px_rgba(120,53,15,0.06)]">
            共 {books.length} 本
          </span>
          <span className="hidden text-xs tracking-[0.18em] text-stone-400 uppercase sm:inline">
            Covers Shelf
          </span>
        </div>

        <Link
          href="/books/new"
          className="inline-flex h-10 items-center justify-center rounded-full bg-stone-950 px-5 text-sm font-medium text-white transition hover:bg-stone-800"
        >
          新建书籍
        </Link>
      </section>

      {books.length === 0 ? (
        <section className="flex min-h-[68vh] items-center justify-center rounded-[2rem] border border-dashed border-stone-900/15 bg-[linear-gradient(145deg,rgba(255,252,246,0.96),rgba(244,238,229,0.9))] p-10 text-center shadow-[0_24px_80px_rgba(120,53,15,0.08)]">
          <div className="max-w-md">
            <div className="mx-auto flex h-20 w-16 items-center justify-center rounded-[1.2rem] border border-stone-900/10 bg-[linear-gradient(180deg,#f2e4ca_0%,#d4af77_100%)] text-sm font-semibold tracking-[0.22em] text-stone-800 uppercase shadow-[0_18px_40px_rgba(120,53,15,0.12)]">
              Book
            </div>
            <h1 className="mt-5 text-2xl font-semibold tracking-tight text-stone-950">
              书架还是空的
            </h1>
            <p className="mt-3 text-sm leading-7 text-stone-600">
              创建第一本书后，这里会以封面卡片的形式展示项目，后续可以直接接入 AI 生成封面和版本状态。
            </p>
            <div className="mt-6">
              <Link
                href="/books/new"
                className="inline-flex h-11 items-center justify-center rounded-full bg-stone-950 px-6 text-sm font-medium text-white transition hover:bg-stone-800"
              >
                创建第一本书
              </Link>
            </div>
          </div>
        </section>
      ) : (
        <section className="grid gap-6 [grid-template-columns:repeat(auto-fill,minmax(220px,260px))]">
          {books.map((book, index) => {
            const coverStyle = COVER_TINTS[index % COVER_TINTS.length];

            return (
              <Link
                key={String(book._id)}
                href={`/books/${book._id}`}
                className="group block"
              >
                <article className="overflow-hidden rounded-[1.75rem] border border-stone-900/10 bg-white shadow-[0_18px_50px_rgba(120,53,15,0.08)] transition duration-300 hover:-translate-y-1 hover:border-stone-900/18 hover:shadow-[0_26px_70px_rgba(120,53,15,0.14)]">
                  <div
                    className={`relative aspect-[3/4] overflow-hidden ${coverStyle.cover}`}
                    aria-label={`${book.title} 封面`}
                  >
                    <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(255,255,255,0.14),transparent_30%,rgba(15,10,6,0.12))]" />
                    <div className="absolute inset-y-0 left-5 w-px bg-black/7" />
                    <div className="absolute left-4 top-4 h-14 w-14 rounded-full bg-white/12 blur-2xl" />
                    <div className="absolute bottom-4 right-4 h-20 w-20 rounded-full bg-black/10 blur-3xl" />

                    <div className="absolute inset-x-0 bottom-0 translate-y-full bg-[linear-gradient(180deg,rgba(24,24,27,0),rgba(24,24,27,0.9)_22%,rgba(24,24,27,0.96)_100%)] px-5 pb-5 pt-10 text-white transition duration-300 group-hover:translate-y-0">
                      <div className="truncate text-base font-medium tracking-tight">
                        {book.title}
                      </div>
                      <div className="mt-1 text-xs text-white/72">Version {book.latestVersion}</div>
                    </div>
                  </div>
                </article>
              </Link>
            );
          })}
        </section>
      )}
    </main>
  );
}

const COVER_TINTS = [
  {
    cover:
      "bg-[radial-gradient(circle_at_top,#fff3dc_0%,transparent_26%),linear-gradient(160deg,#f0dfbe_0%,#d0a56a_45%,#6b472f_100%)]",
  },
  {
    cover:
      "bg-[radial-gradient(circle_at_top,#eef9f5_0%,transparent_28%),linear-gradient(160deg,#dcece7_0%,#8cbdb1_48%,#2f5b56_100%)]",
  },
  {
    cover:
      "bg-[radial-gradient(circle_at_top,#f8ece6_0%,transparent_28%),linear-gradient(160deg,#eddccf_0%,#c57f61_48%,#5e2f22_100%)]",
  },
  {
    cover:
      "bg-[radial-gradient(circle_at_top,#eef0ff_0%,transparent_28%),linear-gradient(160deg,#dee1f2_0%,#8a96c9_48%,#313e73_100%)]",
  },
  {
    cover:
      "bg-[radial-gradient(circle_at_top,#f6f1e3_0%,transparent_28%),linear-gradient(160deg,#e8e0cd_0%,#b5a06d_48%,#50482b_100%)]",
  },
  {
    cover:
      "bg-[radial-gradient(circle_at_top,#f8eaf0_0%,transparent_28%),linear-gradient(160deg,#ecd9e1_0%,#c1829b_48%,#63354a_100%)]",
  },
];
