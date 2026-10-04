"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button, Input, Select } from "@/components/ui/primitives";

export interface StockFormValues {
  symbol: string;
  name: string;
  exchange: string;
  sector: string;
  currency: string;
  lastPrice: string;
  changePct: string;
  volume: string;
  marketCap: string;
  isConventionalFinance: boolean;
  debtRatio: string;
  cashRatio: string;
  nonCompliantIncomeRatio: string;
}

export const emptyStockForm: StockFormValues = {
  symbol: "",
  name: "",
  exchange: "TADAWUL",
  sector: "",
  currency: "SAR",
  lastPrice: "",
  changePct: "0",
  volume: "0",
  marketCap: "",
  isConventionalFinance: false,
  debtRatio: "",
  cashRatio: "",
  nonCompliantIncomeRatio: "",
};

export default function StockForm({
  initial,
  isEdit,
  onSubmit,
}: {
  initial?: StockFormValues;
  isEdit?: boolean;
  onSubmit: (values: StockFormValues) => Promise<void>;
}) {
  const router = useRouter();
  const [values, setValues] = useState<StockFormValues>(initial || emptyStockForm);
  const [busy, setBusy] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true);
    await onSubmit(values);
    setBusy(false);
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4 max-w-xl">
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="text-xs text-slate">الرمز</label>
          <Input
            value={values.symbol}
            onChange={(e) => setValues({ ...values, symbol: e.target.value.toUpperCase() })}
            disabled={isEdit}
            required
          />
        </div>
        <div>
          <label className="text-xs text-slate">اسم الشركة</label>
          <Input value={values.name} onChange={(e) => setValues({ ...values, name: e.target.value })} required />
        </div>
      </div>

      <div className="grid grid-cols-3 gap-4">
        <div>
          <label className="text-xs text-slate">البورصة</label>
          <Select
            value={values.exchange}
            onChange={(e) => {
              const exchange = e.target.value;
              setValues({ ...values, exchange, currency: exchange === "TADAWUL" ? "SAR" : "USD" });
            }}
          >
            <option value="TADAWUL">تداول السعودية</option>
            <option value="NASDAQ">ناسداك</option>
            <option value="NYSE">نيويورك</option>
          </Select>
        </div>
        <div>
          <label className="text-xs text-slate">العملة</label>
          <Select value={values.currency} onChange={(e) => setValues({ ...values, currency: e.target.value })}>
            <option value="SAR">ريال سعودي</option>
            <option value="USD">دولار أمريكي</option>
          </Select>
        </div>
        <div>
          <label className="text-xs text-slate">القطاع</label>
          <Input value={values.sector} onChange={(e) => setValues({ ...values, sector: e.target.value })} placeholder="مثال: بنوك" />
        </div>
      </div>

      <div className="grid grid-cols-3 gap-4">
        <div>
          <label className="text-xs text-slate">السعر الحالي</label>
          <Input type="number" step="0.01" value={values.lastPrice} onChange={(e) => setValues({ ...values, lastPrice: e.target.value })} required />
        </div>
        <div>
          <label className="text-xs text-slate">نسبة التغيّر اليومي (%)</label>
          <Input type="number" step="0.01" value={values.changePct} onChange={(e) => setValues({ ...values, changePct: e.target.value })} />
        </div>
        <div>
          <label className="text-xs text-slate">حجم التداول</label>
          <Input type="number" value={values.volume} onChange={(e) => setValues({ ...values, volume: e.target.value })} />
        </div>
      </div>

      <div>
        <label className="text-xs text-slate">القيمة السوقية (اختياري)</label>
        <Input type="number" value={values.marketCap} onChange={(e) => setValues({ ...values, marketCap: e.target.value })} />
      </div>

      <div className="border-t border-line pt-4">
        <h3 className="text-sm font-medium text-ink mb-3">بيانات فحص التوافق الشرعي (تقريبية)</h3>
        <label className="flex items-center gap-2 text-sm text-ink mb-3">
          <input
            type="checkbox"
            checked={values.isConventionalFinance}
            onChange={(e) => setValues({ ...values, isConventionalFinance: e.target.checked })}
          />
          نشاط تمويل تقليدي (بنك/تأمين تقليدي) — يُستبعد تلقائيًا من الفحص
        </label>
        {!values.isConventionalFinance && (
          <div className="grid grid-cols-3 gap-4">
            <div>
              <label className="text-xs text-slate">نسبة الدين (%)</label>
              <Input type="number" step="0.1" value={values.debtRatio} onChange={(e) => setValues({ ...values, debtRatio: e.target.value })} />
            </div>
            <div>
              <label className="text-xs text-slate">نسبة النقد (%)</label>
              <Input type="number" step="0.1" value={values.cashRatio} onChange={(e) => setValues({ ...values, cashRatio: e.target.value })} />
            </div>
            <div>
              <label className="text-xs text-slate">نسبة الدخل غير المتوافق (%)</label>
              <Input type="number" step="0.1" value={values.nonCompliantIncomeRatio} onChange={(e) => setValues({ ...values, nonCompliantIncomeRatio: e.target.value })} />
            </div>
          </div>
        )}
      </div>

      <div className="flex gap-3">
        <Button type="submit" disabled={busy}>{busy ? "جاري الحفظ..." : "حفظ"}</Button>
        <Button type="button" variant="ghost" onClick={() => router.push("/admin/stocks")}>إلغاء</Button>
      </div>
    </form>
  );
}
