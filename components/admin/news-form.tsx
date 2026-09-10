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
    initial || { title: "", titleAr: "", excerpt: "", content: "", category: "عام", published: false }
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
        <label className="text-xs text-slate">العنوان</label>
        <Input value={values.title} onChange={(e) => setValues({ ...values, title: e.target.value })} required />
      </div>
      <div>
        <label className="text-xs text-slate">القسم</label>
        <Select value={values.category} onChange={(e) => setValues({ ...values, category: e.target.value })}>
          <option>عام</option>
          <option>الأسواق</option>
          <option>الأرباح</option>
          <option>الاقتصاد الكلي</option>
          <option>الشركات</option>
        </Select>
      </div>
      <div>
        <label className="text-xs text-slate">المقتطف</label>
        <Textarea rows={2} value={values.excerpt} onChange={(e) => setValues({ ...values, excerpt: e.target.value })} required />
      </div>
      <div>
        <label className="text-xs text-slate">المحتوى</label>
        <Textarea rows={10} value={values.content} onChange={(e) => setValues({ ...values, content: e.target.value })} required />
      </div>
      <label className="flex items-center gap-2 text-sm text-ink">
        <input
          type="checkbox"
          checked={values.published}
          onChange={(e) => setValues({ ...values, published: e.target.checked })}
        />
        منشور
      </label>
      <div className="flex gap-3">
        <Button type="submit" disabled={busy}>{busy ? "جاري الحفظ..." : "حفظ"}</Button>
        <Button type="button" variant="ghost" onClick={() => router.push("/admin/news")}>إلغاء</Button>
      </div>
    </form>
  );
}
