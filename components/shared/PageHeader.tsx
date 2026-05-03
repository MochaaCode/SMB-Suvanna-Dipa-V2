"use client";

import { ReactNode } from "react";

interface PageHeaderProps {
  title: string;
  highlightText?: string;
  icon: ReactNode;
  subtitle?: ReactNode;
  themeColor?: "orange" | "blue" | "green" | "red" | "slate";
  rightContent?: ReactNode;
}

export function PageHeader({
  title,
  highlightText,
  icon,
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
    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-4 md:p-5 rounded-[1rem] border border-slate-100 shadow-sm transition-all">
      <div className="space-y-1 min-w-0">
        <div className="flex items-center gap-2.5">
          <div
            className={`p-2 rounded-xl border shadow-inner shrink-0 ${theme.bg} ${theme.border} ${theme.text}`}
          >
            {icon}
          </div>
          <h1 className="text-lg font-black text-orange-600 tracking-tighter uppercase leading-none">
            {title}{" "}
            {highlightText && (
              <span className={theme.text}>{highlightText}</span>
            )}
          </h1>
        </div>
      </div>

      {rightContent && (
        <div className="flex items-center shrink-0">{rightContent}</div>
      )}
    </div>
  );
}
