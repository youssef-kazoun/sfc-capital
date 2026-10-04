"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Badge, Button } from "@/components/ui/primitives";
import { formatDate } from "@/lib/utils";
import { Plus, Trash2 } from "lucide-react";

interface NewsRow {
  id: string;
  title: string;
  category: string;
  published: boolean;
  createdAt: string;
}

export default function AdminNewsPage() {
  const [rows, setRows] = useState<NewsRow[] | null>(null);

  async function load() {
    const res = await fetch("/api/admin/news");
    if (res.ok) setRows(await res.json());
  }

  useEffect(() => {
    load();
  }, []);

  async function remove(id: string) {
    if (!confirm("حذف هذا المقال؟")) return;
    setRows((r) => r?.filter((row) => row.id !== id) || null);
    await fetch(`/api/admin/news/${id}`, { method: "DELETE" });
  }

  if (rows === null) return <p className="text-slate">جاري التحميل...</p>;

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="font-display text-2xl text-ink">إدارة الأخبار</h1>
        <Link href="/admin/news/new">
          <Button><span className="flex items-center gap-1.5"><Plus className="h-4 w-4" /> مقال جديد</span></Button>
        </Link>
      </div>
      <div className="rounded-sm border border-line bg-white divide-y divide-line">
        {rows.map((r) => (
          <div key={r.id} className="flex items-center justify-between px-4 py-3">
            <Link href={`/admin/news/${r.id}`} className="flex-1">
              <div className="font-medium text-ink">{r.title}</div>
              <div className="text-xs text-slate">{r.category} · {formatDate(r.createdAt)}</div>
            </Link>
            <Badge tone={r.published ? "gain" : "neutral"}>{r.published ? "منشور" : "مسودة"}</Badge>
            <button onClick={() => remove(r.id)} className="ml-4 text-slate hover:text-loss">
              <Trash2 className="h-4 w-4" />
            </button>
          </div>
        ))}
        {rows.length === 0 && <p className="p-6 text-slate text-sm">لا توجد مقالات حتى الآن.</p>}
      </div>
    </div>
  );
}
