"use client";

import { useEffect, useState } from "react";
import { Button, Input, Select, Card } from "@/components/ui/primitives";

const KNOWN_KEYS: {
  key: string;
  label: string;
  placeholder?: string;
  arabicLabel?: string;
  type?: "text" | "boolean";
}[] = [
  { key: "site_name", label: "اسم الموقع", arabicLabel: "اسم الموقع", placeholder: "SFC Capital", type: "text" },
  { key: "support_email", label: "بريد الدعم الفني", arabicLabel: "بريد الدعم الفني", placeholder: "support@sfccapital.com", type: "text" },
  { key: "support_phone", label: "هاتف الدعم الفني", arabicLabel: "هاتف الدعم الفني", placeholder: "+966 50 000 0000", type: "text" },
  { key: "maintenance_mode", label: "وضع الصيانة", arabicLabel: "وضع الصيانة", type: "boolean" },
];

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

  async function saveKey(key: string, arabicLabel: string) {
    setStatus(null);
    await fetch("/api/admin/settings", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ key, value: values[key] || "" }),
    });
    setStatus(`تم حفظ ${arabicLabel}`);
  }

  return (
    <div>
      <h1 className="font-display text-2xl text-ink mb-6">إعدادات الموقع</h1>
      <Card className="max-w-lg space-y-4">
        {KNOWN_KEYS.map((k) => (
          <div key={k.key} className="flex items-end gap-2">
            <div className="flex-1">
              <label className="text-xs text-slate">{k.label}</label>
              {k.type === "boolean" ? (
                <Select
                  value={values[k.key] || "false"}
                  onChange={(e) => setValues({ ...values, [k.key]: e.target.value })}
                >
                  <option value="false">مُعطّل</option>
                  <option value="true">مُفعّل</option>
                </Select>
              ) : (
                <Input
                  placeholder={k.placeholder}
                  value={values[k.key] || ""}
                  onChange={(e) => setValues({ ...values, [k.key]: e.target.value })}
                />
              )}
            </div>
            <Button variant="secondary" onClick={() => saveKey(k.key, k.arabicLabel || k.label)}>
              حفظ
            </Button>
          </div>
        ))}
        {status && <p className="text-sm text-gain">{status}</p>}
      </Card>
    </div>
  );
}
