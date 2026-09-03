"use client";

import { useEffect, useState } from "react";
import { Button, Input, Select, Card } from "@/components/ui/primitives";
import { formatCurrency, formatPct } from "@/lib/utils";
import { X, Plus } from "lucide-react";

interface PortfolioRow {
  id: string;
  quantity: number;
  avgBuyPrice: number;
  symbol: string;
  name: string;
  lastPrice: number;
  currency: string;
}
interface StockOption {
  id: string;
  symbol: string;
  name: string;
  lastPrice: number;
  currency: string;
}

export default function PortfolioPage() {
  const [rows, setRows] = useState<PortfolioRow[] | null>(null);
  const [stocks, setStocks] = useState<StockOption[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ stockId: "", quantity: "", avgBuyPrice: "" });

  async function load() {
    const [pRes, sRes] = await Promise.all([fetch("/api/portfolio"), fetch("/api/stocks")]);
    if (pRes.ok) setRows(await pRes.json());
    if (sRes.ok) setStocks(await sRes.json());
  }

  useEffect(() => {
    load();
  }, []);

  async function addPosition(e: React.FormEvent) {
    e.preventDefault();
    await fetch("/api/portfolio", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        stockId: form.stockId,
        quantity: Number(form.quantity),
        avgBuyPrice: Number(form.avgBuyPrice),
      }),
    });
    setShowForm(false);
    setForm({ stockId: "", quantity: "", avgBuyPrice: "" });
    load();
  }

  async function remove(id: string) {
    setRows((r) => r?.filter((row) => row.id !== id) || null);
    await fetch("/api/portfolio", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id }),
    });
  }

  if (rows === null) return <p className="text-slate">Loading...</p>;

  const totalValue = rows.reduce((sum, r) => sum + r.quantity * r.lastPrice, 0);
  const totalCost = rows.reduce((sum, r) => sum + r.quantity * r.avgBuyPrice, 0);
  const totalPnlPct = totalCost ? ((totalValue - totalCost) / totalCost) * 100 : 0;

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="font-display text-2xl text-ink">Portfolio</h1>
        <Button variant="secondary" onClick={() => setShowForm((v) => !v)}>
          <span className="flex items-center gap-1.5"><Plus className="h-4 w-4" /> Add position</span>
        </Button>
      </div>

      {rows.length > 0 && (
        <div className="grid sm:grid-cols-3 gap-4 mb-6">
          <Card><div className="text-xs text-slate">Total value</div><div className="font-display text-xl mt-1">{formatCurrency(totalValue, rows[0]?.currency || "EGP")}</div></Card>
          <Card><div className="text-xs text-slate">Total cost</div><div className="font-display text-xl mt-1">{formatCurrency(totalCost, rows[0]?.currency || "EGP")}</div></Card>
          <Card><div className="text-xs text-slate">Unrealized P&L</div><div className={`font-display text-xl mt-1 ${totalPnlPct >= 0 ? "text-gain" : "text-loss"}`}>{formatPct(totalPnlPct)}</div></Card>
        </div>
      )}

      {showForm && (
        <form onSubmit={addPosition} className="rounded-sm border border-line bg-white p-4 mb-6 grid sm:grid-cols-4 gap-3 items-end">
          <div>
            <label className="text-xs text-slate">Stock</label>
            <Select value={form.stockId} onChange={(e) => setForm({ ...form, stockId: e.target.value })} required>
              <option value="">Select...</option>
              {stocks.map((s) => (
                <option key={s.id} value={s.id}>{s.symbol} — {s.name}</option>
              ))}
            </Select>
          </div>
          <div>
            <label className="text-xs text-slate">Quantity</label>
            <Input type="number" value={form.quantity} onChange={(e) => setForm({ ...form, quantity: e.target.value })} required />
          </div>
          <div>
            <label className="text-xs text-slate">Avg buy price</label>
            <Input type="number" step="0.01" value={form.avgBuyPrice} onChange={(e) => setForm({ ...form, avgBuyPrice: e.target.value })} required />
          </div>
          <Button type="submit">Add</Button>
        </form>
      )}

      {rows.length === 0 ? (
        <div className="rounded-sm border border-dashed border-line p-10 text-center text-slate">
          No positions yet. Add your first one above.
        </div>
      ) : (
        <div className="rounded-sm border border-line bg-white overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-line text-left text-slate">
                <th className="px-4 py-3">Stock</th>
                <th className="px-4 py-3">Qty</th>
                <th className="px-4 py-3">Avg cost</th>
                <th className="px-4 py-3">Last price</th>
                <th className="px-4 py-3">P&L</th>
                <th className="px-4 py-3"></th>
              </tr>
            </thead>
            <tbody>
              {rows.map((r) => {
                const pnlPct = r.avgBuyPrice ? ((r.lastPrice - r.avgBuyPrice) / r.avgBuyPrice) * 100 : 0;
                return (
                  <tr key={r.id} className="border-b border-line last:border-0">
                    <td className="px-4 py-3">
                      <div className="font-mono text-xs text-slate">{r.symbol}</div>
                      <div className="font-medium">{r.name}</div>
                    </td>
                    <td className="px-4 py-3 font-mono">{r.quantity}</td>
                    <td className="px-4 py-3 font-mono">{formatCurrency(r.avgBuyPrice, r.currency)}</td>
                    <td className="px-4 py-3 font-mono">{formatCurrency(r.lastPrice, r.currency)}</td>
                    <td className={`px-4 py-3 font-mono ${pnlPct >= 0 ? "text-gain" : "text-loss"}`}>{formatPct(pnlPct)}</td>
                    <td className="px-4 py-3">
                      <button onClick={() => remove(r.id)} className="text-slate hover:text-loss">
                        <X className="h-4 w-4" />
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
