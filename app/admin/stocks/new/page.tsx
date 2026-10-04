"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import StockForm, { StockFormValues } from "@/components/admin/stock-form";

export default function NewStockPage() {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(values: StockFormValues) {
    setError(null);
    const res = await fetch("/api/admin/stocks", {
      method: "POST",
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

  return (
    <div>
      <h1 className="font-display text-2xl text-ink mb-6">سهم جديد</h1>
      {error && <p className="text-sm text-loss mb-4">{error}</p>}
      <StockForm onSubmit={handleSubmit} />
    </div>
  );
}
