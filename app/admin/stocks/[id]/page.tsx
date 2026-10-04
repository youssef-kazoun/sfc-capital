"use client";

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import StockForm, { StockFormValues } from "@/components/admin/stock-form";

export default function EditStockPage() {
  const router = useRouter();
  const params = useParams<{ id: string }>();
  const [initial, setInitial] = useState<StockFormValues | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetch(`/api/admin/stocks/${params.id}`)
      .then((r) => r.json())
      .then((data) =>
        setInitial({
          symbol: data.symbol,
          name: data.name,
          exchange: data.exchange,
          sector: data.sector || "",
          currency: data.currency,
          lastPrice: String(data.lastPrice ?? ""),
          changePct: String(data.changePct ?? "0"),
          volume: String(data.volume ?? "0"),
          marketCap: data.marketCap != null ? String(data.marketCap) : "",
          isConventionalFinance: !!data.isConventionalFinance,
          debtRatio: data.debtRatio != null ? String(data.debtRatio) : "",
          cashRatio: data.cashRatio != null ? String(data.cashRatio) : "",
          nonCompliantIncomeRatio:
            data.nonCompliantIncomeRatio != null ? String(data.nonCompliantIncomeRatio) : "",
        })
      );
  }, [params.id]);

  async function handleSubmit(values: StockFormValues) {
    setError(null);
    const res = await fetch(`/api/admin/stocks/${params.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(values),
    });
    if (res.ok) {
      router.push("/admin/stocks");
    } else {
      const data = await res.json();
      setError(data.error || "حدث خطأ ما");
    }
  }

  if (!initial) return <p className="text-slate">جاري التحميل...</p>;

  return (
    <div>
      <h1 className="font-display text-2xl text-ink mb-6">تعديل السهم</h1>
      {error && <p className="text-sm text-loss mb-4">{error}</p>}
      <StockForm initial={initial} isEdit onSubmit={handleSubmit} />
    </div>
  );
}
