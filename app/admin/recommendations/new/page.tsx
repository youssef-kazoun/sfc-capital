"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Button, Input, Select, Textarea } from "@/components/ui/primitives";

interface StockOption {
  id: string;
  symbol: string;
  name: string;
}

export default function NewRecommendationPage() {
  const router = useRouter();
  const [stocks, setStocks] = useState<StockOption[]>([]);
  const [busy, setBusy] = useState(false);
  const [form, setForm] = useState({
    stockId: "",
    action: "BUY",
    entryPrice: "",
    targetPrice: "",
    stopLoss: "",
    riskLevel: "Medium",
    timeHorizon: "Medium-term",
    rationale: "",
  });

  useEffect(() => {
    fetch("/api/stocks").then((r) => r.json()).then(setStocks);
  }, []);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true);
    const res = await fetch("/api/admin/recommendations", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });
    setBusy(false);
    if (res.ok) router.push("/admin/recommendations");
  }

  return (
    <div>
      <h1 className="font-display text-2xl text-ink mb-6">New recommendation</h1>
      <form onSubmit={handleSubmit} className="space-y-4 max-w-xl">
        <div>
          <label className="text-xs text-slate">Stock</label>
          <Select value={form.stockId} onChange={(e) => setForm({ ...form, stockId: e.target.value })} required>
            <option value="">Select...</option>
            {stocks.map((s) => (
              <option key={s.id} value={s.id}>{s.symbol} — {s.name}</option>
            ))}
          </Select>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="text-xs text-slate">Action</label>
            <Select value={form.action} onChange={(e) => setForm({ ...form, action: e.target.value })}>
              <option value="BUY">Buy</option>
              <option value="ACCUMULATE">Accumulate</option>
              <option value="HOLD">Hold</option>
              <option value="REDUCE">Reduce</option>
              <option value="SELL">Sell</option>
            </Select>
          </div>
          <div>
            <label className="text-xs text-slate">Risk level</label>
            <Select value={form.riskLevel} onChange={(e) => setForm({ ...form, riskLevel: e.target.value })}>
              <option>Low</option>
              <option>Medium</option>
              <option>High</option>
            </Select>
          </div>
        </div>
        <div className="grid grid-cols-3 gap-4">
          <div>
            <label className="text-xs text-slate">Entry price</label>
            <Input type="number" step="0.01" value={form.entryPrice} onChange={(e) => setForm({ ...form, entryPrice: e.target.value })} required />
          </div>
          <div>
            <label className="text-xs text-slate">Target price</label>
            <Input type="number" step="0.01" value={form.targetPrice} onChange={(e) => setForm({ ...form, targetPrice: e.target.value })} required />
          </div>
          <div>
            <label className="text-xs text-slate">Stop loss</label>
            <Input type="number" step="0.01" value={form.stopLoss} onChange={(e) => setForm({ ...form, stopLoss: e.target.value })} required />
          </div>
        </div>
        <div>
          <label className="text-xs text-slate">Time horizon</label>
          <Input value={form.timeHorizon} onChange={(e) => setForm({ ...form, timeHorizon: e.target.value })} />
        </div>
        <div>
          <label className="text-xs text-slate">Rationale</label>
          <Textarea rows={4} value={form.rationale} onChange={(e) => setForm({ ...form, rationale: e.target.value })} required />
        </div>
        <Button type="submit" disabled={busy}>{busy ? "Saving..." : "Create recommendation"}</Button>
      </form>
    </div>
  );
}
