"use client";

import { useState } from "react";

import { BookCreateForm } from "@/src/modules/books/components/book-create-form";

export function BookCreateDialog({
  buttonClassName,
  buttonLabel = "新建书籍",
}: {
  buttonClassName?: string;
  buttonLabel?: string;
}) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <button
        type="button"
        onClick={() => setIsOpen(true)}
        className={
          buttonClassName ??
          "inline-flex h-10 items-center justify-center rounded-full bg-stone-950 px-5 text-sm font-medium text-white transition hover:bg-stone-800"
        }
      >
        {buttonLabel}
      </button>

      {isOpen ? (
        <div
          className="fixed inset-0 z-50 flex items-start justify-center bg-black/30 px-4 py-6 backdrop-blur-[2px]"
          onClick={() => setIsOpen(false)}
        >
          <div
            className="flex max-h-[calc(100vh-3rem)] w-full max-w-xl flex-col overflow-hidden rounded-[2rem] border border-stone-900/10 bg-[#fcfbf8] p-5 shadow-[0_30px_100px_rgba(0,0,0,0.18)]"
            onClick={(event) => event.stopPropagation()}
          >
            <div className="mb-4 flex items-center justify-between gap-4">
              <div className="text-base font-medium tracking-tight text-stone-900">新建书籍</div>
              <button
                type="button"
                onClick={() => setIsOpen(false)}
                className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-stone-900/10 bg-white text-stone-600 transition hover:bg-stone-50 hover:text-stone-900"
                aria-label="关闭弹窗"
              >
                ×
              </button>
            </div>

            <div className="overflow-y-auto pr-1">
              <BookCreateForm className="grid gap-6" />
            </div>
          </div>
        </div>
      ) : null}
    </>
  );
}
