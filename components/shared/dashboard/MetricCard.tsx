"use client";

import { AppCard } from "@/components/shared/AppCard";
import { ReactNode } from "react";

interface MetricCardProps {
  title: string;
  value: string | number;
  icon: ReactNode;
  description?: string;
  theme: "orange" | "blue" | "green" | "purple";
}

export function MetricCard({
  title,
  value,
  icon,
  description,
  theme,
}: MetricCardProps) {
  const themes = {
    orange: "bg-orange-50 text-orange-600 border-orange-100",
    blue: "bg-blue-50 text-blue-600 border-blue-100",
    green: "bg-green-50 text-green-600 border-green-100",
    purple: "bg-purple-50 text-purple-600 border-purple-100",
  };

  return (
    <AppCard className="p-6 transition-all hover:shadow-md border-slate-100 group">
      <div className="flex items-center gap-5">
        <div
          className={`p-4 rounded-2xl border ${themes[theme]} transition-transform group-hover:scale-110`}
        >
          {icon}
        </div>
        <div className="space-y-0.5">
          <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">
            {title}
          </p>
          <p className="text-3xl font-black text-slate-800 tracking-tight">
            {value}
          </p>
          {description && (
            <p className="text-[10px] font-medium text-slate-500 uppercase italic mt-1">
              {description}
            </p>
          )}
        </div>
      </div>
    </AppCard>
  );
}
