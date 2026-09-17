"use client";

import { useEffect, useState } from "react";
import { Badge, Select } from "@/components/ui/primitives";
import { formatDate } from "@/lib/utils";

interface TrialRow {
  id: string;
  name: string;
  email: string;
  phone: string;
  serviceType: string;
  market: string;
  liquiditySize: string | null;
  currency: string | null;
  status: string;
  createdAt: string;
}

const STATUS_LABELS: Record<string, string> = {
  NEW: "جديد",
  CONTACTED: "تم التواصل",
  CONVERTED: "تم التحويل لعميل",
  CLOSED: "مغلق",
};

const MARKET_LABELS: Record<string, string> = {
  SAUDI: "السوق السعودي",
  US: "السوق الأمريكي",
};

export default function AdminTrialRequestsPage() {
  const [rows, setRows] = useState<TrialRow[] | null>(null);

  
  useEffect(() => {
  let cancelled = false;

  async function fetchTrialRequests() {
    const res = await fetch("/api/admin/trial-requests");

    if (res.ok && !cancelled) {
      setRows(await res.json());
    }
  }

  fetchTrialRequests();

  return () => {
    cancelled = true;
  };
}, []);

  async function updateStatus(id: string, status: string) {
    setRows((r) => r?.map((row) => (row.id === id ? { ...row, status } : row)) || null);
    await fetch(`/api/admin/trial-requests/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status }),
    });
  }

  if (rows === null) return <p className="text-slate">جاري التحميل...</p>;

  return (
    <div>
      <h1 className="font-display text-2xl text-ink mb-6">طلبات الفترة التجريبية</h1>
      {rows.length === 0 ? (
        <div className="rounded-sm border border-dashed border-line p-10 text-center text-slate">
          لا توجد طلبات حتى الآن.
        </div>
      ) : (
        <div className="rounded-sm border border-line bg-white overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-line text-left text-slate">
                <th className="px-4 py-3">الاسم</th>
                <th className="px-4 py-3">التواصل</th>
                <th className="px-4 py-3">الخدمة</th>
                <th className="px-4 py-3">السوق</th>
                <th className="px-4 py-3">السيولة</th>
                <th className="px-4 py-3">التاريخ</th>
                <th className="px-4 py-3">الحالة</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((r) => (
                <tr key={r.id} className="border-b border-line last:border-0">
                  <td className="px-4 py-3 font-medium">{r.name}</td>
                  <td className="px-4 py-3 text-slate">
                    <div>{r.email}</div>
                    <div className="font-mono text-xs">{r.phone}</div>
                  </td>
                  <td className="px-4 py-3">{r.serviceType}</td>
                  <td className="px-4 py-3"><Badge>{MARKET_LABELS[r.market] || r.market}</Badge></td>
                  <td className="px-4 py-3 font-mono text-xs">
                    {r.liquiditySize ? `${r.liquiditySize} ${r.currency || ""}` : "—"}
                  </td>
                  <td className="px-4 py-3 text-slate">{formatDate(r.createdAt)}</td>
                  <td className="px-4 py-3">
                    <Select value={r.status} onChange={(e) => updateStatus(r.id, e.target.value)} className="w-40">
                      {Object.entries(STATUS_LABELS).map(([k, v]) => (
                        <option key={k} value={k}>{v}</option>
                      ))}
                    </Select>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
