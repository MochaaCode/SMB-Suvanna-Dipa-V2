"use client";

import { AppCard } from "../../shared/AppCard";
import { ReactNode } from "react";

interface ReportMetricCardProps {
  title: string;
  value: string | number;
  icon: ReactNode;
  theme: "blue" | "green" | "orange" | "purple";
}

export function ReportMetricCard({
  title,
  value,
  icon,
  theme,
}: ReportMetricCardProps) {
  const themes = {
    blue: "bg-blue-50 text-blue-600",
    green: "bg-green-50 text-green-600",
    orange: "bg-orange-50 text-orange-600",
    purple: "bg-purple-50 text-purple-600",
  };

  return (
    <AppCard className="p-5 flex items-center gap-4">
      <div className={`p-3 rounded-2xl ${themes[theme]}`}>{icon}</div>
      <div>
        <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">
          {title}
        </p>
        <p className="text-2xl font-black text-slate-800">{value}</p>
      </div>
    </AppCard>
  );
}
