"use client";

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import NewsForm, { NewsFormValues } from "@/components/admin/news-form";

export default function EditNewsPage() {
  const router = useRouter();
  const params = useParams<{ id: string }>();
  const [initial, setInitial] = useState<NewsFormValues | null>(null);

  useEffect(() => {
    fetch(`/api/admin/news/${params.id}`)
      .then((r) => r.json())
      .then((data) =>
        setInitial({
          title: data.title,
          titleAr: data.titleAr || "",
          excerpt: data.excerpt,
          content: data.content,
          category: data.category,
          published: data.published,
        })
      );
  }, [params.id]);

  async function handleSubmit(values: NewsFormValues) {
    const res = await fetch(`/api/admin/news/${params.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(values),
    });
    if (res.ok) router.push("/admin/news");
  }

  if (!initial) return <p className="text-slate">جاري التحميل...</p>;

  return (
    <div>
      <h1 className="font-display text-2xl text-ink mb-6">تعديل المقال</h1>
      <NewsForm initial={initial} onSubmit={handleSubmit} />
    </div>
  );
}
