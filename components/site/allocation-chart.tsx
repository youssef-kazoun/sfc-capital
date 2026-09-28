"use client";

import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, Legend } from "recharts";

const COLORS = ["#b8912f", "#1f7a5c", "#5b6472", "#b23a2f", "#16233a", "#d4af37", "#0f1a2b"];

export default function AllocationChart({
  data,
}: {
  data: { name: string; value: number }[];
}) {
  if (data.length === 0) return null;

  return (
    <div className="h-64 w-full">
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={data}
            dataKey="value"
            nameKey="name"
            cx="50%"
            cy="50%"
            innerRadius={50}
            outerRadius={85}
            paddingAngle={2}
          >
            {data.map((_, i) => (
              <Cell key={i} fill={COLORS[i % COLORS.length]} />
            ))}
          </Pie>
          <Tooltip
            formatter={((value: any) => `${Number(value ?? 0).toFixed(1)}%`) as any}
            contentStyle={{ border: "1px solid #e3ddce", borderRadius: 2, fontSize: 12 }}
          />
          <Legend wrapperStyle={{ fontSize: 12 }} />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
}
