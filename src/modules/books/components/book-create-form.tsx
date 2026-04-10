"use client";

import { useRouter } from "next/navigation";
import { ChangeEvent, FormEvent, useState } from "react";

type FormState = {
  title: string;
  coverFile: File | null;
};

const initialState: FormState = {
  title: "",
  coverFile: null,
};

export function BookCreateForm({
  className,
}: {
  className?: string;
}) {
  const router = useRouter();
  const [form, setForm] = useState<FormState>(initialState);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setIsSubmitting(true);
    setError(null);

    const payload = new FormData();
    payload.append("title", form.title);

    if (form.coverFile) {
      payload.append("cover", form.coverFile);
    }

    const response = await fetch("/api/books", {
      method: "POST",
      body: payload,
    });

    const result = (await response.json()) as {
      book?: { _id: string };
      message?: string;
    };

    setIsSubmitting(false);

    if (!response.ok || !result.book?._id) {
      setError(result.message ?? "创建书籍失败。");
      return;
    }

    router.push(`/books/${result.book._id}`);
    router.refresh();
  }

  function handleCoverChange(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0] ?? null;
    setForm((current) => ({ ...current, coverFile: file }));

    if (!file) {
      setPreviewUrl(null);
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      setPreviewUrl(typeof reader.result === "string" ? reader.result : null);
    };
    reader.readAsDataURL(file);
  }

  return (
    <form
      onSubmit={handleSubmit}
      className={
        className ??
        "rounded-[2rem] border border-stone-900/10 bg-white/80 p-8 shadow-[0_20px_80px_rgba(120,53,15,0.08)]"
      }
    >
      <div className="grid gap-6">
        <Field label="书名">
          <input
            required
            value={form.title}
            onChange={(event) => setForm((current) => ({ ...current, title: event.target.value }))}
            className="w-full rounded-2xl border border-stone-900/10 bg-white px-4 py-3 text-sm text-stone-900 outline-none transition focus:border-stone-900/30"
            placeholder="输入书籍名称"
          />
        </Field>

        <Field label="封面（选填）">
          <label className="block cursor-pointer">
            <input
              type="file"
              accept="image/png,image/jpeg,image/webp,image/avif"
              onChange={handleCoverChange}
              className="sr-only"
            />

            <div className="w-[220px] overflow-hidden rounded-[1.25rem] border border-stone-900/10 bg-stone-50 transition hover:border-stone-900/20">
              {previewUrl ? (
                <div
                  className="aspect-[3/4] w-full bg-cover bg-center bg-no-repeat"
                  style={{ backgroundImage: `url("${previewUrl}")` }}
                />
              ) : (
                <div className="flex aspect-[3/4] items-center justify-center border border-dashed border-stone-900/15 px-6 py-8 text-center transition hover:bg-stone-100/80">
                  <div className="grid gap-2">
                    <span className="text-sm font-medium text-stone-800">选择本地封面文件</span>
                    <span className="text-xs text-stone-500">支持 PNG、JPG、WEBP、AVIF</span>
                  </div>
                </div>
              )}
            </div>
          </label>

          <div className="h-5">
            {previewUrl ? (
              <button
                type="button"
                onClick={() => {
                  setForm((current) => ({ ...current, coverFile: null }));
                  setPreviewUrl(null);
                }}
                className="text-xs font-medium text-stone-500 transition hover:text-stone-900"
              >
                移除封面
              </button>
            ) : null}
          </div>
        </Field>
      </div>

      {error ? <p className="mt-6 text-sm text-red-600">{error}</p> : null}

      <div className="mt-8 flex justify-end">
        <button
          type="submit"
          disabled={isSubmitting}
          className="inline-flex h-12 items-center justify-center rounded-full bg-stone-950 px-6 text-sm font-medium text-white transition hover:bg-stone-800 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {isSubmitting ? "创建中..." : "创建书籍"}
        </button>
      </div>
    </form>
  );
}

function Field({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <label className="grid gap-2">
      <span className="text-sm font-medium text-stone-700">{label}</span>
      {children}
    </label>
  );
}
