"use client";

import { useEffect, useState } from "react";
import { Button, Input, Select, Textarea, Card } from "@/components/ui/primitives";

interface SettingField {
  key: string;
  label: string;
  placeholder?: string;
  type?: "text" | "boolean" | "textarea";
}

const GENERAL_FIELDS: SettingField[] = [
  { key: "site_name", label: "اسم الموقع", placeholder: "SFC Capital" },
  { key: "support_email", label: "بريد الدعم الفني", placeholder: "support@sfccapital.com" },
  { key: "support_phone", label: "هاتف الدعم الفني", placeholder: "+966 50 000 0000" },
  { key: "maintenance_mode", label: "وضع الصيانة", type: "boolean" },
];

const STATS_FIELDS: SettingField[] = [
  { key: "stat_users", label: "عدد العملاء", placeholder: "5000" },
  { key: "stat_recommendations", label: "عدد التوصيات المنشورة", placeholder: "1200" },
  { key: "stat_alerts_sent", label: "عدد التنبيهات المرسلة", placeholder: "30000" },
  { key: "stat_accuracy", label: "دقة التوصيات (%)", placeholder: "87" },
];

const SOCIAL_FIELDS: SettingField[] = [
  { key: "whatsapp_number", label: "رقم واتساب (بالصيغة الدولية بدون +)", placeholder: "9665XXXXXXXX" },
  { key: "telegram_url", label: "رابط تيليجرام" },
  { key: "facebook_url", label: "رابط فيسبوك" },
  { key: "youtube_url", label: "رابط يوتيوب" },
  { key: "x_url", label: "رابط إكس (تويتر)" },
  { key: "instagram_url", label: "رابط إنستجرام" },
  { key: "tiktok_url", label: "رابط تيك توك" },
  { key: "snapchat_url", label: "رابط سناب شات" },
  { key: "linkedin_url", label: "رابط لينكدإن" },
];

const OFFERS_FIELD: SettingField = {
  key: "special_offers",
  label: 'العروض الخاصة (JSON — مصفوفة من {"title","description","badge"})',
  type: "textarea",
};

export default function AdminSettingsPage() {
  const [values, setValues] = useState<Record<string, string>>({});
  const [status, setStatus] = useState<string | null>(null);

  useEffect(() => {
    fetch("/api/admin/settings")
      .then((r) => r.json())
      .then((rows: { key: string; value: string }[]) => {
        const map: Record<string, string> = {};
        rows.forEach((r) => (map[r.key] = r.value));
        setValues(map);
      });
  }, []);

  async function saveKey(key: string, label: string) {
    setStatus(null);
    await fetch("/api/admin/settings", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ key, value: values[key] || "" }),
    });
    setStatus(`تم حفظ: ${label}`);
  }

  function renderField(f: SettingField) {
    return (
      <div key={f.key} className="flex items-end gap-2">
        <div className="flex-1">
          <label className="text-xs text-slate">{f.label}</label>
          {f.type === "boolean" ? (
            <Select
              value={values[f.key] || "false"}
              onChange={(e) => setValues({ ...values, [f.key]: e.target.value })}
            >
              <option value="false">مُعطّل</option>
              <option value="true">مُفعّل</option>
            </Select>
          ) : f.type === "textarea" ? (
            <Textarea
              rows={5}
              placeholder={f.placeholder}
              value={values[f.key] || ""}
              onChange={(e) => setValues({ ...values, [f.key]: e.target.value })}
            />
          ) : (
            <Input
              placeholder={f.placeholder}
              value={values[f.key] || ""}
              onChange={(e) => setValues({ ...values, [f.key]: e.target.value })}
            />
          )}
        </div>
        <Button variant="secondary" onClick={() => saveKey(f.key, f.label)}>حفظ</Button>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <h1 className="font-display text-2xl text-ink">إعدادات الموقع</h1>

      <div>
        <h2 className="font-display text-lg text-ink mb-3">عام</h2>
        <Card className="max-w-lg space-y-4">{GENERAL_FIELDS.map(renderField)}</Card>
      </div>

      <div>
        <h2 className="font-display text-lg text-ink mb-3">الإحصائيات المعروضة في الصفحة الرئيسية</h2>
        <Card className="max-w-lg space-y-4">{STATS_FIELDS.map(renderField)}</Card>
      </div>

      <div>
        <h2 className="font-display text-lg text-ink mb-3">روابط التواصل الاجتماعي</h2>
        <p className="text-xs text-slate mb-3">اتركها فاضية لإخفاء أي رابط من الفوتر تلقائيًا.</p>
        <Card className="max-w-lg space-y-4">{SOCIAL_FIELDS.map(renderField)}</Card>
      </div>

      <div>
        <h2 className="font-display text-lg text-ink mb-3">العروض الخاصة</h2>
        <Card className="max-w-lg space-y-4">{renderField(OFFERS_FIELD)}</Card>
      </div>

      {status && <p className="text-sm text-gain">{status}</p>}
    </div>
  );
}
