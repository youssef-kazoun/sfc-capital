"use client";

import { useEffect, useState } from "react";
import { Badge, Select } from "@/components/ui/primitives";
import { formatDate } from "@/lib/utils";

interface UserRow {
  id: string;
  name: string;
  email: string;
  role: string;
  isActive: boolean;
  createdAt: string;
}

export default function AdminUsersPage() {
  const [rows, setRows] = useState<UserRow[] | null>(null);

  async function load() {
    const res = await fetch("/api/admin/users");
    if (res.ok) setRows(await res.json());
  }

  useEffect(() => {
    load();
  }, []);

  async function updateRole(id: string, role: string) {
    setRows((r) => r?.map((u) => (u.id === id ? { ...u, role } : u)) || null);
    await fetch(`/api/admin/users/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ role }),
    });
  }

  async function toggleActive(id: string, isActive: boolean) {
    setRows((r) => r?.map((u) => (u.id === id ? { ...u, isActive } : u)) || null);
    await fetch(`/api/admin/users/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ isActive }),
    });
  }

  if (rows === null) return <p className="text-slate">جاري التحميل...</p>;

  return (
    <div>
      <h1 className="font-display text-2xl text-ink mb-6">المستخدمون</h1>
      <div className="rounded-sm border border-line bg-white overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-line text-left text-slate">
              <th className="px-4 py-3">الاسم</th>
              <th className="px-4 py-3">البريد الإلكتروني</th>
              <th className="px-4 py-3">الدور</th>
              <th className="px-4 py-3">الحالة</th>
              <th className="px-4 py-3">تاريخ الانضمام</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((u) => (
              <tr key={u.id} className="border-b border-line last:border-0">
                <td className="px-4 py-3 font-medium">{u.name}</td>
                <td className="px-4 py-3 text-slate">{u.email}</td>
                <td className="px-4 py-3">
                  <Select value={u.role} onChange={(e) => updateRole(u.id, e.target.value)} className="w-36">
                    <option value="CUSTOMER">عميل</option>
                    <option value="SUPPORT">دعم فني</option>
                    <option value="ANALYST">محلل</option>
                    <option value="ADMIN">مدير</option>
                  </Select>
                </td>
                <td className="px-4 py-3">
                  <button onClick={() => toggleActive(u.id, !u.isActive)}>
                    <Badge tone={u.isActive ? "gain" : "loss"}>{u.isActive ? "نشط" : "معطّل"}</Badge>
                  </button>
                </td>
                <td className="px-4 py-3 text-slate">{formatDate(u.createdAt)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
