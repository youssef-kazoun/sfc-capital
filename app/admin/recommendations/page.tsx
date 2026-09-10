"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Badge, Button } from "@/components/ui/primitives";
import { Plus, Trash2 } from "lucide-react";

interface RecRow {
  id: string;
  action: string;
  status: string;
  entryPrice: number;
  targetPrice: number;
  stopLoss: number;
  symbol: string;
  name: string;
}

const ACTION_LABELS: Record<string, string> = {
  BUY: "شراء",
  SELL: "بيع",
  HOLD: "احتفاظ",
  ACCUMULATE: "تجميع",
  REDUCE: "تخفيف",
};

const STATUS_LABELS: Record<string, string> = {
  OPEN: "مفتوحة",
  CLOSED: "مغلقة",
  EXPIRED: "منتهية",
};

export default function AdminRecommendationsPage() {
  const [rows, setRows] = useState<RecRow[] | null>(null);

  async function load() {
    const res = await fetch("/api/admin/recommendations");
    if (res.ok) setRows(await res.json());
  }

  useEffect(() => {
    load();
  }, []);

  async function closeRec(id: string) {
    await fetch(`/api/admin/recommendations/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status: "CLOSED" }),
    });
    load();
  }

  async function remove(id: string) {
    if (!confirm("حذف هذه التوصية؟")) return;
    setRows((r) => r?.filter((row) => row.id !== id) || null);
    await fetch(`/api/admin/recommendations/${id}`, { method: "DELETE" });
  }

  if (rows === null) return <p className="text-slate">جاري التحميل...</p>;

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="font-display text-2xl text-ink">إدارة التوصيات</h1>
        <Link href="/admin/recommendations/new">
          <Button><span className="flex items-center gap-1.5"><Plus className="h-4 w-4" /> توصية جديدة</span></Button>
        </Link>
      </div>
      <div className="rounded-sm border border-line bg-white divide-y divide-line">
        {rows.map((r) => (
          <div key={r.id} className="flex items-center justify-between px-4 py-3">
            <div>
              <div className="font-mono text-xs text-slate">{r.symbol}</div>
              <div className="font-medium text-ink">{r.name}</div>
            </div>
            <Badge>{ACTION_LABELS[r.action] || r.action}</Badge>
            <div className="text-xs text-slate font-mono">
              {r.entryPrice} ← {r.targetPrice}
            </div>
            <Badge tone={r.status === "OPEN" ? "gain" : "neutral"}>{STATUS_LABELS[r.status] || r.status}</Badge>
            {r.status === "OPEN" && (
              <button onClick={() => closeRec(r.id)} className="text-xs text-gold">
                إغلاق
              </button>
            )}
            <button onClick={() => remove(r.id)} className="text-slate hover:text-loss">
              <Trash2 className="h-4 w-4" />
            </button>
          </div>
        ))}
        {rows.length === 0 && <p className="p-6 text-slate text-sm">لا توجد توصيات حتى الآن.</p>}
      </div>
    </div>
  );
}
