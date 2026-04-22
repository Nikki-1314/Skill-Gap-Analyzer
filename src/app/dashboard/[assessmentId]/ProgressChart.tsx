"use client";

import { Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";

interface ProgressChartProps {
  data: {
    date: string;
    match: number;
  }[];
}

export function ProgressChart({ data }: ProgressChartProps) {
  return (
    <div className="h-[120px] w-full">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={data}>
          <XAxis 
            dataKey="date" 
            hide 
          />
          <YAxis hide domain={[0, 100]} />
          <Tooltip 
            labelClassName="text-xs font-bold"
            contentStyle={{ borderRadius: '8px', border: '1px solid #e2e8f0', fontSize: '12px' }}
            formatter={(value: number) => [`${value}%`, 'Match']}
          />
          <Line
            type="monotone"
            dataKey="match"
            stroke="oklch(0.2 0.03 240)"
            strokeWidth={3}
            dot={{ r: 4, fill: "oklch(0.2 0.03 240)", strokeWidth: 2, stroke: "#fff" }}
            activeDot={{ r: 6, strokeWidth: 0 }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
