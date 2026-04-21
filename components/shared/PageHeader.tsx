"use client";

import { ReactNode } from "react";

interface PageHeaderProps {
  title: string;
  highlightText?: string;
  icon: ReactNode;
  subtitle: ReactNode;
  themeColor?: "orange" | "blue" | "green" | "red" | "slate";
  rightContent?: ReactNode;
}

export function PageHeader({
  title,
  highlightText,
  icon,
  subtitle,
  themeColor = "orange",
  rightContent,
}: PageHeaderProps) {
  const colorMap = {
    orange: {
      bg: "bg-orange-50",
      border: "border-orange-100",
      text: "text-orange-600",
    },
    blue: {
      bg: "bg-blue-50",
      border: "border-blue-100",
      text: "text-blue-600",
    },
    green: {
      bg: "bg-green-50",
      border: "border-green-100",
      text: "text-green-600",
    },
    red: {
      bg: "bg-red-50",
      border: "border-red-100",
      text: "text-red-600",
    },
    slate: {
      bg: "bg-slate-50",
      border: "border-slate-200",
      text: "text-slate-700",
    },
  };

  const theme = colorMap[themeColor];

  return (
    <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 bg-white p-6 md:p-7 rounded-[1rem] border border-slate-100 shadow-sm transition-all">
      <div className="space-y-1.5">
        <div className="flex items-center gap-3.5">
          <div
            className={`p-3 rounded-xl border shadow-inner ${theme.bg} ${theme.border} ${theme.text}`}
          >
            {icon}
          </div>
          <h1 className="text-2xl font-black text-slate-800 italic tracking-tighter uppercase leading-none">
            {title}{" "}
            {highlightText && (
              <span className={theme.text}>{highlightText}</span>
            )}
          </h1>
        </div>
        <div className="text-[10px] text-slate-400 font-bold uppercase tracking-widest flex items-center gap-2 ml-1">
          {subtitle}
        </div>
      </div>

      {rightContent && (
        <div className="flex items-center shrink-0">{rightContent}</div>
      )}
    </div>
  );
}
