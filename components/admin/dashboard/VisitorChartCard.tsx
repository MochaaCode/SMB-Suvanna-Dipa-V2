"use client";

import { LineChart, BarChart2 } from "lucide-react";
import {
  Area,
  AreaChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
  CartesianGrid,
} from "recharts";

import type { DailyVisitorStat } from "@/types";

interface VisitorChartCardProps {
  data: DailyVisitorStat[];
  topPages: { name: string; views: number }[];
}

export function VisitorChartCard({ data, topPages }: VisitorChartCardProps) {
  const formattedData = data.map((d) => ({
    ...d,
    dateLabel: new Date(d.date).toLocaleDateString("id-ID", {
      day: "numeric",
      month: "short",
    }),
  }));

  return (
    <div className="bg-white p-6 rounded-[1rem] border border-slate-200 shadow-sm space-y-6 flex-1 w-full lg:col-span-2">
      <div className="flex items-center justify-between border-b border-slate-100 pb-4">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-orange-50 rounded-lg text-orange-600 border border-orange-100">
            <LineChart size={18} />
          </div>
          <h3 className="text-base font-bold text-slate-800">
            Statistik Pengunjung
          </h3>
        </div>
        <span className="text-[10px] font-bold text-orange-700 bg-orange-50 px-2.5 py-1 rounded-md border border-orange-200 tracking-wider uppercase">
          7 Hari Terakhir
        </span>
      </div>

      <div className="flex flex-col lg:flex-row gap-8">
        {/* AREA CHART */}
        <div className="flex-1 h-64 min-w-0">
          {data.length === 0 ? (
            <div className="w-full h-full flex items-center justify-center bg-slate-50/50 rounded-xl border border-dashed border-slate-200">
              <p className="text-xs font-medium text-slate-400">
                Belum ada data pengunjung.
              </p>
            </div>
          ) : (
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart
                data={formattedData}
                margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
              >
                <defs>
                  <linearGradient id="colorViews" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#ea580c" stopOpacity={0.2} />
                    <stop offset="95%" stopColor="#ea580c" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid
                  strokeDasharray="3 3"
                  vertical={false}
                  stroke="#f1f5f9"
                />
                <XAxis
                  dataKey="dateLabel"
                  axisLine={false}
                  tickLine={false}
                  tick={{ fontSize: 10, fill: "#64748b", fontWeight: "600" }}
                  dy={10}
                />
                <YAxis
                  axisLine={false}
                  tickLine={false}
                  tick={{ fontSize: 10, fill: "#64748b", fontWeight: "600" }}
                />
                <Tooltip
                  contentStyle={{
                    borderRadius: "12px",
                    border: "1px solid #e2e8f0",
                    boxShadow: "0 4px 6px -1px rgb(0 0 0 / 0.1)",
                    fontSize: "12px",
                  }}
                  labelStyle={{
                    fontWeight: "bold",
                    color: "#ea580c",
                    marginBottom: "4px",
                  }}
                />
                <Area
                  type="monotone"
                  dataKey="views"
                  stroke="#ea580c"
                  strokeWidth={3}
                  fillOpacity={1}
                  fill="url(#colorViews)"
                />
              </AreaChart>
            </ResponsiveContainer>
          )}
        </div>

        {/* TOP PAGES LIST */}
        <div className="w-full lg:w-64 space-y-4">
          <h4 className="text-[10px] font-bold uppercase text-slate-500 tracking-wider flex items-center gap-1.5 border-b border-slate-100 pb-2">
            <BarChart2 size={14} /> Halaman Populer
          </h4>
          <div className="space-y-2">
            {topPages.map((page, i) => (
              <div
                key={i}
                className="flex justify-between items-center p-2.5 bg-slate-50/50 rounded-lg border border-slate-100 group hover:bg-white hover:border-orange-200 transition-colors"
              >
                <span className="text-xs font-semibold text-slate-700 truncate pr-2 group-hover:text-orange-600 transition-colors">
                  {page.name || "Beranda"}
                </span>
                <span className="text-[10px] font-bold bg-white px-2 py-1 rounded-md text-slate-600 border border-slate-200 shadow-sm">
                  {page.views}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
