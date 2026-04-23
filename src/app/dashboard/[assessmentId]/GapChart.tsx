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
  Cell,
} from "recharts";

type Datum = {
  skill: string;
  target: number;
  self: number;
};

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white dark:bg-slate-900 p-4 border border-slate-200 dark:border-slate-800 shadow-xl rounded-xl backdrop-blur-md bg-white/90 dark:bg-slate-900/90">
        <p className="text-sm font-black mb-2 text-slate-900 dark:text-slate-100 uppercase tracking-tight">{label}</p>
        <div className="space-y-1.5">
          <div className="flex items-center gap-3">
            <div className="w-2 h-2 rounded-full bg-primary" />
            <p className="text-xs font-bold text-slate-500 dark:text-slate-400">
              Target Level: <span className="text-slate-900 dark:text-slate-100">{payload[0].value}</span>
            </p>
          </div>
          <div className="flex items-center gap-3">
            <div className="w-2 h-2 rounded-full bg-amber-500" />
            <p className="text-xs font-bold text-slate-500 dark:text-slate-400">
              Current Level: <span className="text-slate-900 dark:text-slate-100">{payload[1].value}</span>
            </p>
          </div>
          {payload[0].value > payload[1].value && (
            <div className="mt-2 pt-2 border-t border-slate-100 dark:border-slate-800">
              <p className="text-[10px] font-black text-amber-600 dark:text-amber-400 uppercase">
                Gap: {payload[0].value - payload[1].value} Levels
              </p>
            </div>
          )}
        </div>
      </div>
    );
  }
  return null;
};

export function GapChart({ data }: { data: Datum[] }) {
  return (
    <div className="h-80 w-full mt-4">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart 
          data={data} 
          margin={{ left: 0, right: 0, top: 10, bottom: 20 }}
          barGap={8}
        >
          <defs>
            <linearGradient id="targetGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="var(--primary)" stopOpacity={1}/>
              <stop offset="100%" stopColor="var(--primary)" stopOpacity={0.6}/>
            </linearGradient>
            <linearGradient id="selfGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#f59e0b" stopOpacity={1}/>
              <stop offset="100%" stopColor="#d97706" stopOpacity={0.8}/>
            </linearGradient>
          </defs>
          <CartesianGrid vertical={false} strokeDasharray="4 4" stroke="var(--border)" opacity={0.5} />
          <XAxis 
            dataKey="skill" 
            axisLine={false}
            tickLine={false}
            tick={{ fill: 'currentColor', fontSize: 10, fontWeight: 700 }}
            interval={0} 
            angle={-20} 
            textAnchor="end" 
            height={60}
            className="text-slate-400 dark:text-slate-500"
          />
          <YAxis 
            domain={[0, 4]} 
            ticks={[0, 1, 2, 3, 4]} 
            axisLine={false}
            tickLine={false}
            tick={{ fill: 'currentColor', fontSize: 10, fontWeight: 700 }}
            className="text-slate-400 dark:text-slate-500"
          />
          <Tooltip content={<CustomTooltip />} cursor={{ fill: 'var(--muted)', opacity: 0.1 }} />
          <Legend 
            verticalAlign="top" 
            align="right" 
            iconType="circle"
            wrapperStyle={{ paddingBottom: '20px', fontSize: '10px', fontWeight: '900', textTransform: 'uppercase', letterSpacing: '0.05em' }}
          />
          <Bar 
            dataKey="target" 
            fill="url(#targetGradient)" 
            name="Required" 
            radius={[4, 4, 0, 0]}
            barSize={24}
          />
          <Bar 
            dataKey="self" 
            fill="url(#selfGradient)" 
            name="Achieved" 
            radius={[4, 4, 0, 0]}
            barSize={24}
          />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
