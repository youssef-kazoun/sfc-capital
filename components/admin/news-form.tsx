"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button, Input, Textarea, Select } from "@/components/ui/primitives";

export interface NewsFormValues {
  title: string;
  titleAr?: string;
  excerpt: string;
  content: string;
  category: string;
  published: boolean;
}

export default function NewsForm({
  initial,
  onSubmit,
}: {
  initial?: NewsFormValues;
  onSubmit: (values: NewsFormValues) => Promise<void>;
}) {
  const router = useRouter();
  const [values, setValues] = useState<NewsFormValues>(
    initial || { title: "", titleAr: "", excerpt: "", content: "", category: "General", published: false }
  );
  const [busy, setBusy] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true);
    await onSubmit(values);
    setBusy(false);
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4 max-w-2xl">
      <div>
        <label className="text-xs text-slate">Title</label>
        <Input value={values.title} onChange={(e) => setValues({ ...values, title: e.target.value })} required />
      </div>
      <div>
        <label className="text-xs text-slate">Title (Arabic, optional)</label>
        <Input value={values.titleAr} onChange={(e) => setValues({ ...values, titleAr: e.target.value })} dir="rtl" />
      </div>
      <div>
        <label className="text-xs text-slate">Category</label>
        <Select value={values.category} onChange={(e) => setValues({ ...values, category: e.target.value })}>
          <option>General</option>
          <option>Markets</option>
          <option>Earnings</option>
          <option>Macro</option>
          <option>Corporate</option>
        </Select>
      </div>
      <div>
        <label className="text-xs text-slate">Excerpt</label>
        <Textarea rows={2} value={values.excerpt} onChange={(e) => setValues({ ...values, excerpt: e.target.value })} required />
      </div>
      <div>
        <label className="text-xs text-slate">Content</label>
        <Textarea rows={10} value={values.content} onChange={(e) => setValues({ ...values, content: e.target.value })} required />
      </div>
      <label className="flex items-center gap-2 text-sm text-ink">
        <input
          type="checkbox"
          checked={values.published}
          onChange={(e) => setValues({ ...values, published: e.target.checked })}
        />
        Published
      </label>
      <div className="flex gap-3">
        <Button type="submit" disabled={busy}>{busy ? "Saving..." : "Save"}</Button>
        <Button type="button" variant="ghost" onClick={() => router.push("/admin/news")}>Cancel</Button>
      </div>
    </form>
  );
}
