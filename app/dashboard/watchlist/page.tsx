"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { PriceChange, Button } from "@/components/ui/primitives";
import { formatCurrency } from "@/lib/utils";
import { X } from "lucide-react";

interface WatchlistRow {
  id: string;
  stockId: string;
  symbol: string;
  name: string;
  lastPrice: number;
  changePct: number;
  currency: string;
}

export default function WatchlistPage() {
  const [rows, setRows] = useState<WatchlistRow[] | null>(null);

  async function load() {
    const res = await fetch("/api/watchlist");
    if (res.ok) setRows(await res.json());
  }

  useEffect(() => {
    load();
  }, []);

  async function remove(id: string) {
    setRows((r) => r?.filter((row) => row.id !== id) || null);
    await fetch("/api/watchlist", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id }),
    });
  }

  if (rows === null) return <p className="text-slate">جاري التحميل...</p>;

  return (
    <div>
      <h1 className="font-display text-2xl text-ink mb-6">قائمة المتابعة</h1>
      {rows.length === 0 ? (
        <EmptyState />
      ) : (
        <div className="rounded-sm border border-line bg-white divide-y divide-line">
          {rows.map((r) => (
            <div key={r.id} className="flex items-center justify-between px-4 py-3">
              <Link href={`/stocks/${r.symbol}`} className="flex-1">
                <div className="font-mono text-xs text-slate">{r.symbol}</div>
                <div className="font-medium text-ink">{r.name}</div>
              </Link>
              <div className="text-right mr-4">
                <div className="font-mono">{formatCurrency(r.lastPrice, r.currency)}</div>
                <PriceChange value={r.changePct} />
              </div>
              <button onClick={() => remove(r.id)} aria-label="Remove" className="text-slate hover:text-loss">
                <X className="h-4 w-4" />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function EmptyState() {
  return (
    <div className="rounded-sm border border-dashed border-line p-10 text-center">
      <p className="text-slate">لا توجد أسهم في قائمة متابعتك حتى الآن.</p>
      <Link href="/markets">
        <Button variant="secondary" className="mt-4">
          استكشف الأسواق
        </Button>
      </Link>
    </div>
  );
}
