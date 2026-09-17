"use client";

import { useState } from "react";
import {
  Button,
  Input,
  Select,
  SectionHeading,
} from "@/components/ui/primitives";

const SERVICES = [
  "توصيات السوق السعودي",
  "توصيات السوق الأمريكي",
  "الباقات الخاصة",
  "باقات السوق الأمريكي",
  "إدارة المحفظة",
];

export default function TrialPage() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    serviceType: SERVICES[0],
    market: "SAUDI",
    liquiditySize: "",
    currency: "SAR",
  });

  const [status, setStatus] = useState<
    "idle" | "busy" | "sent" | "error"
  >("idle");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setStatus("busy");

    const res = await fetch("/api/trial", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });

    setStatus(res.ok ? "sent" : "error");
  }

  if (status === "sent") {
    return (
      <div className="mx-auto max-w-lg px-4 py-24 text-center">
        <h1 className="font-display text-2xl text-ink">
          تم استلام طلبك
        </h1>

        <p className="text-slate mt-2">
          سيتواصل معك فريقنا خلال ساعات العمل لتفعيل الفترة التجريبية.
        </p>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-lg px-4 py-16">
      <SectionHeading
        title="سجّل في الفترة التجريبية"
        subtitle="جرّب توصياتنا مجانًا لفترة محدودة قبل الاشتراك"
      />

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="text-xs text-slate">الاسم الكامل</label>
          <Input
            value={form.name}
            onChange={(e) =>
              setForm({ ...form, name: e.target.value })
            }
            required
          />
        </div>

        <div>
          <label className="text-xs text-slate">
            البريد الإلكتروني
          </label>
          <Input
            type="email"
            value={form.email}
            onChange={(e) =>
              setForm({ ...form, email: e.target.value })
            }
            required
          />
        </div>

        <div>
          <label className="text-xs text-slate">
            رقم الهاتف (يفضّل واتساب)
          </label>
          <Input
            value={form.phone}
            onChange={(e) =>
              setForm({ ...form, phone: e.target.value })
            }
            required
          />
        </div>

        <div>
          <label className="text-xs text-slate">نوع الخدمة</label>
          <Select
            value={form.serviceType}
            onChange={(e) =>
              setForm({
                ...form,
                serviceType: e.target.value,
              })
            }
          >
            {SERVICES.map((s) => (
              <option key={s}>{s}</option>
            ))}
          </Select>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="text-xs text-slate">
              السوق المهتم به
            </label>

            <Select
              value={form.market}
              onChange={(e) =>
                setForm({
                  ...form,
                  market: e.target.value,
                  currency:
                    e.target.value === "SAUDI"
                      ? "SAR"
                      : "USD",
                })
              }
            >
              <option value="SAUDI">السوق السعودي</option>
              <option value="US">السوق الأمريكي</option>
            </Select>
          </div>

          <div>
            <label className="text-xs text-slate">العملة</label>

            <Select
              value={form.currency}
              onChange={(e) =>
                setForm({
                  ...form,
                  currency: e.target.value,
                })
              }
            >
              <option value="SAR">ريال سعودي</option>
              <option value="USD">دولار أمريكي</option>
            </Select>
          </div>
        </div>

        <div>
          <label className="text-xs text-slate">
            حجم السيولة المتاحة للاستثمار (اختياري)
          </label>

          <Input
            value={form.liquiditySize}
            onChange={(e) =>
              setForm({
                ...form,
                liquiditySize: e.target.value,
              })
            }
            placeholder="مثال: 50,000"
          />
        </div>

        {status === "error" && (
          <p className="text-sm text-loss">
            حدث خطأ ما. حاول مرة أخرى.
          </p>
        )}

        <Button
          type="submit"
          className="w-full"
          disabled={status === "busy"}
        >
          {status === "busy"
            ? "جاري الإرسال..."
            : "إرسال الطلب"}
        </Button>

        <p className="text-xs text-slate text-center">
          بالضغط على &quot;إرسال الطلب&quot; فإنك توافق على تواصل
          فريقنا معك عبر البريد الإلكتروني أو الهاتف أو واتساب.
        </p>
      </form>
    </div>
  );
}