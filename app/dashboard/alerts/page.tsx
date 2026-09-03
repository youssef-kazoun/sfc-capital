"use client";

import { useEffect, useState } from "react";
import { Badge } from "@/components/ui/primitives";
import { formatCurrency, formatDate } from "@/lib/utils";
import { X } from "lucide-react";

interface AlertRow {
  id: string;
  condition: "ABOVE" | "BELOW";
  targetPrice: number;
  triggered: boolean;
  createdAt: string;
  symbol: string;
  name: string;
  lastPrice: number;
}

export default function AlertsPage() {
  const [rows, setRows] = useState<AlertRow[] | null>(null);

  async function load() {
    const res = await fetch("/api/alerts");
    if (res.ok) setRows(await res.json());
  }

  useEffect(() => {
    load();
  }, []);

  async function remove(id: string) {
    setRows((r) => r?.filter((row) => row.id !== id) || null);
    await fetch("/api/alerts", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id }),
    });
  }

  if (rows === null) return <p className="text-slate">Loading...</p>;

  return (
    <div>
      <h1 className="font-display text-2xl text-ink mb-6">Price alerts</h1>
      {rows.length === 0 ? (
        <div className="rounded-sm border border-dashed border-line p-10 text-center text-slate">
          No alerts set. Create one from any stock's page.
        </div>
      ) : (
        <div className="rounded-sm border border-line bg-white divide-y divide-line">
          {rows.map((r) => (
            <div key={r.id} className="flex items-center justify-between px-4 py-3">
              <div>
                <div className="font-mono text-xs text-slate">{r.symbol}</div>
                <div className="font-medium text-ink">{r.name}</div>
              </div>
              <div className="text-sm text-ink/80">
                Alert when price is {r.condition === "ABOVE" ? "above" : "below"}{" "}
                <span className="font-mono">{formatCurrency(r.targetPrice, "EGP")}</span>
              </div>
              <Badge tone={r.triggered ? "gold" : "neutral"}>{r.triggered ? "Triggered" : "Active"}</Badge>
              <button onClick={() => remove(r.id)} className="text-slate hover:text-loss">
                <X className="h-4 w-4" />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
