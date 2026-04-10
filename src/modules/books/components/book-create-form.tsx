"use client";

import { useRouter } from "next/navigation";
import { FormEvent, useState } from "react";

type FormState = {
  title: string;
  premise: string;
  genre: string;
  tone: string;
  targetWords: string;
  audience: string;
  pointOfView: string;
};

const initialState: FormState = {
  title: "",
  premise: "",
  genre: "",
  tone: "cinematic",
  targetWords: "50000",
  audience: "general",
  pointOfView: "third-person",
};

export function BookCreateForm() {
  const router = useRouter();
  const [form, setForm] = useState<FormState>(initialState);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setIsSubmitting(true);
    setError(null);

    const response = await fetch("/api/books", {
      method: "POST",
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
          audience: form.audience,
          pointOfView: form.pointOfView,
        },
      }),
    });

    const payload = (await response.json()) as {
      book?: { _id: string };
      message?: string;
    };

    setIsSubmitting(false);

    if (!response.ok || !payload.book?._id) {
      setError(payload.message ?? "创建书籍失败。");
      return;
    }

    router.push(`/books/${payload.book._id}`);
    router.refresh();
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="rounded-[2rem] border border-stone-900/10 bg-white/80 p-8 shadow-[0_20px_80px_rgba(120,53,15,0.08)]"
    >
      <div className="grid gap-6">
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
              onChange={(event) =>
                setForm((current) => ({ ...current, tone: event.target.value }))
              }
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
