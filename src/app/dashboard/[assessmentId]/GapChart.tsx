"use client";

import {
  Bar,
  BarChart,
  CartesianGrid,
  Legend,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

type Datum = {
  skill: string;
  target: number;
  self: number;
};

export function GapChart({ data }: { data: Datum[] }) {
  return (
    <div className="h-80 w-full">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data} margin={{ left: 8, right: 8 }}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="skill" interval={0} angle={-25} textAnchor="end" height={70} />
          <YAxis domain={[0, 4]} ticks={[0, 1, 2, 3, 4]} />
          <Tooltip />
          <Legend />
          <Bar dataKey="target" fill="#2563eb" name="Target" />
          <Bar dataKey="self" fill="#f97316" name="You" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}

