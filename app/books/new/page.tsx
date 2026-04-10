import { BookCreateForm } from "@/src/modules/books/components/book-create-form";

export default function NewBookPage() {
  return (
    <main className="mx-auto flex w-full max-w-4xl flex-1 flex-col px-6 py-10 sm:px-10">
      <div className="rounded-[2rem] border border-stone-900/10 bg-white/80 p-8 shadow-[0_20px_80px_rgba(120,53,15,0.08)]">
        <div className="text-sm uppercase tracking-[0.24em] text-stone-500">
          New Book
        </div>
        <h1 className="mt-4 text-4xl font-semibold tracking-tight text-stone-950">
          新建书籍项目
        </h1>
        <p className="mt-4 max-w-2xl text-base leading-7 text-stone-600">
          先把书籍本身创建出来，再基于书籍发起生成任务。这是后续版本管理、任务重跑和中间结果持久化的基础。
        </p>
      </div>

      <div className="mt-8">
        <BookCreateForm />
      </div>
    </main>
  );
}
