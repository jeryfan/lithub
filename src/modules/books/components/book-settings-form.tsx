"use client";

import { useRouter } from "next/navigation";
import { FormEvent, useState } from "react";

type BookPayload = {
  _id: string;
  title: string;
  premise: string;
  genre: string;
  status: string;
  settings: {
    tone: string;
    targetWords: number;
    model: string;
    audience?: string;
    pointOfView?: string;
  };
};

export function BookSettingsForm({ book }: { book: BookPayload }) {
  const router = useRouter();
  const [form, setForm] = useState({
    title: book.title,
    premise: book.premise,
    genre: book.genre,
    tone: book.settings.tone,
    targetWords: String(book.settings.targetWords),
    model: book.settings.model,
    audience: book.settings.audience ?? "general",
    pointOfView: book.settings.pointOfView ?? "third-person",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setIsSubmitting(true);
    setMessage(null);

    const response = await fetch(`/api/books/${book._id}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        title: form.title,
        premise: form.premise,
        genre: form.genre,
        settings: {
          tone: form.tone,
          targetWords: Number(form.targetWords),
          model: form.model,
          audience: form.audience,
          pointOfView: form.pointOfView,
        },
      }),
    });

    const payload = (await response.json()) as { message?: string };

    setIsSubmitting(false);
    setMessage(payload.message ?? (response.ok ? "已保存。" : "保存失败。"));

    if (response.ok) {
      router.refresh();
    }
  }

  async function handleStartGeneration() {
    setIsSubmitting(true);
    setMessage(null);

    const response = await fetch("/api/jobs", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        bookId: book._id,
      }),
    });

    const payload = (await response.json()) as { message?: string };
    setIsSubmitting(false);
    setMessage(payload.message ?? (response.ok ? "任务已创建。" : "任务创建失败。"));

    if (response.ok) {
      router.refresh();
    }
  }

  return (
    <form onSubmit={handleSubmit} className="mt-5 grid gap-6">
      <Field label="书名">
        <input
          required
          value={form.title}
          onChange={(event) => setForm((current) => ({ ...current, title: event.target.value }))}
          className="w-full rounded-2xl border border-stone-900/10 bg-white px-4 py-3 text-sm text-stone-900 outline-none transition focus:border-stone-900/30"
        />
      </Field>
      <Field label="题材">
        <input
          required
          value={form.genre}
          onChange={(event) => setForm((current) => ({ ...current, genre: event.target.value }))}
          className="w-full rounded-2xl border border-stone-900/10 bg-white px-4 py-3 text-sm text-stone-900 outline-none transition focus:border-stone-900/30"
        />
      </Field>
      <Field label="核心 premise">
        <textarea
          required
          rows={5}
          value={form.premise}
          onChange={(event) =>
            setForm((current) => ({ ...current, premise: event.target.value }))
          }
          className="w-full rounded-2xl border border-stone-900/10 bg-white px-4 py-3 text-sm text-stone-900 outline-none transition focus:border-stone-900/30"
        />
      </Field>
      <div className="grid gap-6 sm:grid-cols-2">
        <Field label="风格">
          <input
            value={form.tone}
            onChange={(event) => setForm((current) => ({ ...current, tone: event.target.value }))}
            className="w-full rounded-2xl border border-stone-900/10 bg-white px-4 py-3 text-sm text-stone-900 outline-none transition focus:border-stone-900/30"
          />
        </Field>
        <Field label="目标字数">
          <input
            type="number"
            min="1000"
            value={form.targetWords}
            onChange={(event) =>
              setForm((current) => ({ ...current, targetWords: event.target.value }))
            }
            className="w-full rounded-2xl border border-stone-900/10 bg-white px-4 py-3 text-sm text-stone-900 outline-none transition focus:border-stone-900/30"
          />
        </Field>
        <Field label="模型">
          <input
            value={form.model}
            onChange={(event) => setForm((current) => ({ ...current, model: event.target.value }))}
            className="w-full rounded-2xl border border-stone-900/10 bg-white px-4 py-3 text-sm text-stone-900 outline-none transition focus:border-stone-900/30"
          />
        </Field>
        <Field label="目标受众">
          <input
            value={form.audience}
            onChange={(event) =>
              setForm((current) => ({ ...current, audience: event.target.value }))
            }
            className="w-full rounded-2xl border border-stone-900/10 bg-white px-4 py-3 text-sm text-stone-900 outline-none transition focus:border-stone-900/30"
          />
        </Field>
        <Field label="叙事视角">
          <input
            value={form.pointOfView}
            onChange={(event) =>
              setForm((current) => ({ ...current, pointOfView: event.target.value }))
            }
            className="w-full rounded-2xl border border-stone-900/10 bg-white px-4 py-3 text-sm text-stone-900 outline-none transition focus:border-stone-900/30"
          />
        </Field>
      </div>

      {message ? <p className="text-sm text-stone-600">{message}</p> : null}

      <div className="flex flex-col gap-3 sm:flex-row sm:justify-end">
        <button
          type="button"
          onClick={handleStartGeneration}
          disabled={isSubmitting}
          className="inline-flex h-12 items-center justify-center rounded-full border border-stone-900/10 bg-white px-6 text-sm font-medium text-stone-900 transition hover:bg-stone-50 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {isSubmitting ? "处理中..." : "创建生成任务"}
        </button>
        <button
          type="submit"
          disabled={isSubmitting}
          className="inline-flex h-12 items-center justify-center rounded-full bg-stone-950 px-6 text-sm font-medium text-white transition hover:bg-stone-800 disabled:cursor-not-allowed disabled:opacity-60"
        >
          保存设定
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
