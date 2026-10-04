"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Badge } from "@/components/ui/primitives";
import { formatDate } from "@/lib/utils";

interface TicketRow {
  id: string;
  subject: string;
  status: string;
  priority: string;
  updatedAt: string;
  customerName: string;
  customerEmail: string;
}

const STATUS_LABELS: Record<string, string> = {
  OPEN: "مفتوحة",
  IN_PROGRESS: "قيد المعالجة",
  RESOLVED: "تم الحل",
  CLOSED: "مغلقة",
};

export default function AdminTicketsPage() {
  const [rows, setRows] = useState<TicketRow[] | null>(null);

  useEffect(() => {
    fetch("/api/admin/tickets")
      .then((r) => r.json())
      .then(setRows);
  }, []);

  if (rows === null) return <p className="text-slate">جاري التحميل...</p>;

  return (
    <div>
      <h1 className="font-display text-2xl text-ink mb-6">طلبات الدعم الفني</h1>
      <div className="rounded-sm border border-line bg-white divide-y divide-line">
        {rows.map((t) => (
          <Link
            key={t.id}
            href={`/admin/tickets/${t.id}`}
            className="flex items-center justify-between px-4 py-3 hover:bg-paper-dim"
          >
            <div>
              <div className="font-medium text-ink">{t.subject}</div>
              <div className="text-xs text-slate">
                {t.customerName} ({t.customerEmail}) · آخر تحديث {formatDate(t.updatedAt)}
              </div>
            </div>
            <Badge tone={t.status === "RESOLVED" || t.status === "CLOSED" ? "neutral" : "gain"}>
              {STATUS_LABELS[t.status] || t.status}
            </Badge>
          </Link>
        ))}
        {rows.length === 0 && <p className="p-6 text-slate text-sm">لا توجد طلبات دعم حتى الآن.</p>}
      </div>
    </div>
  );
}
