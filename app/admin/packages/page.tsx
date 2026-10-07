"use client";

import { useEffect, useState } from "react";
import { Button, Input, Textarea, Card, Badge } from "@/components/ui/primitives";

interface PackageRow {
  id: string;
  name: string;
  nameAr: string | null;
  description: string;
  priceMonthly: number;
  priceYearly: number;
  priceMonthlySar: number | null;
  priceYearlySar: number | null;
  features: string;
  isActive: boolean;
}

export default function AdminPackagesPage() {
  const [rows, setRows] = useState<PackageRow[] | null>(null);
  const [status, setStatus] = useState<string | null>(null);

  async function load() {
    const res = await fetch("/api/admin/packages");
    if (res.ok) setRows(await res.json());
  }

  useEffect(() => {
    load();
  }, []);

  function updateField(id: string, field: keyof PackageRow, value: any) {
    setRows((prev) => prev?.map((p) => (p.id === id ? { ...p, [field]: value } : p)) || null);
  }

  async function save(pkg: PackageRow) {
    setStatus(null);
    const res = await fetch(`/api/admin/packages/${pkg.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        ...pkg,
        features: JSON.parse(pkg.features || "[]"),
      }),
    });
    setStatus(res.ok ? `تم حفظ: ${pkg.name}` : "حدث خطأ أثناء الحفظ");
  }

  if (rows === null) return <p className="text-slate">جاري التحميل...</p>;

  return (
    <div>
      <h1 className="font-display text-2xl text-ink mb-2">إدارة الباقات</h1>
      <p className="text-sm text-slate mb-6">
        السعر بالدولار للعرض فقط. <strong>السعر بالريال السعودي هو المبلغ الفعلي الذي يُخصم عبر Moyasar</strong> —
        لازم تحطه قبل ما تقدر الباقة تتفعّل بدفع حقيقي.
      </p>

      {status && <p className="text-sm text-gain mb-4">{status}</p>}

      <div className="space-y-6">
        {rows.map((pkg) => (
          <Card key={pkg.id} className="max-w-2xl">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-display text-lg text-ink">{pkg.name}</h3>
              <Badge tone={pkg.isActive ? "gain" : "neutral"}>{pkg.isActive ? "نشطة" : "معطّلة"}</Badge>
            </div>

            <div className="grid grid-cols-2 gap-4 mb-4">
              <div>
                <label className="text-xs text-slate">الاسم</label>
                <Input value={pkg.name} onChange={(e) => updateField(pkg.id, "name", e.target.value)} />
              </div>
              <div>
                <label className="text-xs text-slate">الاسم بالعربي (اختياري)</label>
                <Input value={pkg.nameAr || ""} onChange={(e) => updateField(pkg.id, "nameAr", e.target.value)} />
              </div>
            </div>

            <div className="mb-4">
              <label className="text-xs text-slate">الوصف</label>
              <Textarea rows={2} value={pkg.description} onChange={(e) => updateField(pkg.id, "description", e.target.value)} />
            </div>

            <div className="grid grid-cols-2 gap-4 mb-4">
              <div>
                <label className="text-xs text-slate">السعر الشهري (دولار، للعرض)</label>
                <Input type="number" value={pkg.priceMonthly} onChange={(e) => updateField(pkg.id, "priceMonthly", +e.target.value)} />
              </div>
              <div>
                <label className="text-xs text-slate">السعر السنوي (دولار، للعرض)</label>
                <Input type="number" value={pkg.priceYearly} onChange={(e) => updateField(pkg.id, "priceYearly", +e.target.value)} />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4 mb-4 bg-gold/5 border border-gold/30 rounded-sm p-3">
              <div>
                <label className="text-xs text-ink font-medium">السعر الشهري (ريال سعودي — فعلي)</label>
                <Input
                  type="number"
                  value={pkg.priceMonthlySar ?? ""}
                  onChange={(e) => updateField(pkg.id, "priceMonthlySar", e.target.value === "" ? null : +e.target.value)}
                  placeholder="مثال: 109"
                />
              </div>
              <div>
                <label className="text-xs text-ink font-medium">السعر السنوي (ريال سعودي — فعلي)</label>
                <Input
                  type="number"
                  value={pkg.priceYearlySar ?? ""}
                  onChange={(e) => updateField(pkg.id, "priceYearlySar", e.target.value === "" ? null : +e.target.value)}
                  placeholder="مثال: 1090"
                />
              </div>
            </div>

            <div className="mb-4">
              <label className="text-xs text-slate">المزايا (سطر لكل ميزة)</label>
              <Textarea
                rows={4}
                value={JSON.parse(pkg.features || "[]").join("\n")}
                onChange={(e) => updateField(pkg.id, "features", JSON.stringify(e.target.value.split("\n").filter(Boolean)))}
              />
            </div>

            <label className="flex items-center gap-2 text-sm text-ink mb-4">
              <input type="checkbox" checked={pkg.isActive} onChange={(e) => updateField(pkg.id, "isActive", e.target.checked)} />
              الباقة نشطة ومعروضة للمستخدمين
            </label>

            <Button onClick={() => save(pkg)}>حفظ</Button>
          </Card>
        ))}
      </div>
    </div>
  );
}
