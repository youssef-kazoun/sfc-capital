"use client";

import { useRouter } from "next/navigation";
import NewsForm, { NewsFormValues } from "@/components/admin/news-form";

export default function NewNewsPage() {
  const router = useRouter();

  async function handleSubmit(values: NewsFormValues) {
    const res = await fetch("/api/admin/news", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(values),
    });
    if (res.ok) router.push("/admin/news");
  }

  return (
    <div>
      <h1 className="font-display text-2xl text-ink mb-6">مقال جديد</h1>
      <NewsForm onSubmit={handleSubmit} />
    </div>
  );
}
