"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Badge, Button } from "@/components/ui/primitives";
import { formatCurrency } from "@/lib/utils";
import { Plus, Trash2 } from "lucide-react";

interface StockRow {
  id: string;
  symbol: string;
  name: string;
  exchange: string;
  sector: string | null;
  currency: string;
  lastPrice: number;
  changePct: number;
}

const EXCHANGE_LABELS: Record<string, string> = {
  TADAWUL: "تداول السعودية",
  NASDAQ: "ناسداك",
  NYSE: "نيويورك",
};

export default function AdminStocksPage() {
  const [rows, setRows] = useState<StockRow[] | null>(null);
  const [error, setError] = useState<string | null>(null);

  async function load() {
    const res = await fetch("/api/admin/stocks");
    if (res.ok) setRows(await res.json());
  }

  useEffect(() => {
    load();
  }, []);

  async function remove(id: string) {
    if (!confirm("حذف هذا السهم نهائيًا؟")) return;
    setError(null);
    const res = await fetch(`/api/admin/stocks/${id}`, { method: "DELETE" });
    if (res.ok) {
      setRows((r) => r?.filter((row) => row.id !== id) || null);
    } else {
      const data = await res.json();
      setError(data.error || "تعذّر الحذف");
    }
  }

  if (rows === null) return <p className="text-slate">جاري التحميل...</p>;

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="font-display text-2xl text-ink">إدارة الأسهم</h1>
        <Link href="/admin/stocks/new">
          <Button><span className="flex items-center gap-1.5"><Plus className="h-4 w-4" /> سهم جديد</span></Button>
        </Link>
      </div>

      {error && <p className="text-sm text-loss mb-4">{error}</p>}

      <div className="rounded-sm border border-line bg-white overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-line text-left text-slate">
              <th className="px-4 py-3">الرمز</th>
              <th className="px-4 py-3">الاسم</th>
              <th className="px-4 py-3">البورصة</th>
              <th className="px-4 py-3">القطاع</th>
              <th className="px-4 py-3">السعر</th>
              <th className="px-4 py-3">التغيّر</th>
              <th className="px-4 py-3"></th>
            </tr>
          </thead>
          <tbody>
            {rows.map((s) => (
              <tr key={s.id} className="border-b border-line last:border-0">
                <td className="px-4 py-3 font-mono text-xs">
                  <Link href={`/admin/stocks/${s.id}`} className="text-gold hover:underline">
                    {s.symbol}
                  </Link>
                </td>
                <td className="px-4 py-3 font-medium">{s.name}</td>
                <td className="px-4 py-3"><Badge>{EXCHANGE_LABELS[s.exchange] || s.exchange}</Badge></td>
                <td className="px-4 py-3 text-slate">{s.sector || "—"}</td>
                <td className="px-4 py-3 font-mono">{formatCurrency(s.lastPrice, s.currency)}</td>
                <td className={`px-4 py-3 font-mono ${s.changePct >= 0 ? "text-gain" : "text-loss"}`}>
                  {s.changePct >= 0 ? "+" : ""}{s.changePct.toFixed(2)}%
                </td>
                <td className="px-4 py-3">
                  <button onClick={() => remove(s.id)} className="text-slate hover:text-loss">
                    <Trash2 className="h-4 w-4" />
                  </button>
                </td>
              </tr>
            ))}
            {rows.length === 0 && (
              <tr><td colSpan={7} className="p-6 text-slate text-sm text-center">لا توجد أسهم بعد.</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
