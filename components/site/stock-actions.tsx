"use client";

import { useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { Button, Input, Select } from "@/components/ui/primitives";
import { Bell, Star } from "lucide-react";

export default function StockActions({ stockId, lastPrice }: { stockId: string; lastPrice: number }) {
  const { data: session } = useSession();
  const router = useRouter();
  const [showAlert, setShowAlert] = useState(false);
  const [targetPrice, setTargetPrice] = useState(lastPrice.toFixed(2));
  const [condition, setCondition] = useState<"ABOVE" | "BELOW">("ABOVE");
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  if (!session?.user) {
    return (
      <Button variant="secondary" onClick={() => router.push("/login")}>
        سجّل الدخول لمتابعة هذا السهم
      </Button>
    );
  }

  async function addToWatchlist() {
    setBusy(true);
    setMessage(null);
    const res = await fetch("/api/watchlist", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ stockId }),
    });
    setBusy(false);
    setMessage(res.ok ? "تمت الإضافة إلى قائمة المتابعة." : "لم تتم الإضافة — حاول مرة أخرى.");
  }

  async function createAlert() {
    setBusy(true);
    setMessage(null);
    const res = await fetch("/api/alerts", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ stockId, targetPrice: Number(targetPrice), condition }),
    });
    setBusy(false);
    if (res.ok) {
      setMessage("تم إنشاء التنبيه.");
      setShowAlert(false);
    } else {
      setMessage("لم يتم إنشاء التنبيه.");
    }
  }

  return (
    <div className="flex flex-col gap-3">
      <div className="flex gap-3">
        <Button variant="secondary" onClick={addToWatchlist} disabled={busy}>
          <span className="flex items-center gap-1.5">
            <Star className="h-4 w-4" /> قائمة المتابعة
          </span>
        </Button>
        <Button variant="secondary" onClick={() => setShowAlert((v) => !v)}>
          <span className="flex items-center gap-1.5">
            <Bell className="h-4 w-4" /> تنبيه سعري
          </span>
        </Button>
      </div>

      {showAlert && (
        <div className="flex flex-wrap items-end gap-2 rounded-sm border border-line p-3">
          <div>
            <label className="text-xs text-slate">الشرط</label>
            <Select value={condition} onChange={(e) => setCondition(e.target.value as any)}>
              <option value="ABOVE">إذا ارتفع السعر فوق</option>
              <option value="BELOW">إذا انخفض السعر تحت</option>
            </Select>
          </div>
          <div>
            <label className="text-xs text-slate">السعر المستهدف</label>
            <Input
              type="number"
              step="0.01"
              value={targetPrice}
              onChange={(e) => setTargetPrice(e.target.value)}
            />
          </div>
          <Button onClick={createAlert} disabled={busy}>
            إنشاء تنبيه
          </Button>
        </div>
      )}

      {message && <p className="text-sm text-slate">{message}</p>}
    </div>
  );
}
