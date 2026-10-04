"use client";

import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from "recharts";

export default function PriceChart({
  data,
}: {
  data: { date: string; close: number }[];
}) {
  const gain = data.length > 1 && data[data.length - 1].close >= data[0].close;

  return (
    <div className="h-72 w-full">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={data} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
          <defs>
            <linearGradient id="priceFill" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor={gain ? "#1f7a5c" : "#b23a2f"} stopOpacity={0.25} />
              <stop offset="95%" stopColor={gain ? "#1f7a5c" : "#b23a2f"} stopOpacity={0} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="#e3ddce" vertical={false} />
          <XAxis
            dataKey="date"
            tickLine={false}
            axisLine={false}
            tick={{ fontSize: 11, fill: "#5b6472" }}
            minTickGap={40}
          />
          <YAxis
            domain={["auto", "auto"]}
            tickLine={false}
            axisLine={false}
            tick={{ fontSize: 11, fill: "#5b6472" }}
            width={50}
          />
          <Tooltip
            contentStyle={{ border: "1px solid #e3ddce", borderRadius: 2, fontSize: 12 }}
          />
          <Area
            type="monotone"
            dataKey="close"
            stroke={gain ? "#1f7a5c" : "#b23a2f"}
            strokeWidth={2}
            fill="url(#priceFill)"
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}
