/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";
import React from "react";

interface AppHeaderProps {
  title: string;
  subtitle: string;
  icon: any;
  variant?: "orange" | "red" | "blue";
  actions?: React.ReactNode;
  className?: string;
}

export function AppHeader({
  title,
  subtitle,
  icon: Icon,
  variant = "orange",
  actions,
  className,
}: AppHeaderProps) {
  const variants = {
    orange: "bg-orange-50 text-orange-600 border-orange-100",
    red: "bg-red-50 text-red-600 border-red-100",
    blue: "bg-blue-50 text-blue-600 border-blue-100",
  };

  return (
    <div
      className={cn(
        "bg-white p-7 rounded-[1rem] border border-slate-100 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-6 animate-in fade-in slide-in-from-top-4 duration-700",
        className,
      )}
    >
      <div className="space-y-1">
        <div className="flex items-center gap-4 text-left">
          <div
            className={cn(
              "p-3 rounded-xl border shadow-inner transition-transform hover:scale-105",
              variants[variant],
            )}
          >
            <Icon size={28} strokeWidth={2.5} />
          </div>
          <div className="space-y-0.5">
            <h1 className="text-2xl font-black text-slate-900 italic tracking-tighter uppercase leading-none">
              {title}
            </h1>
            <p className="text-[10px] text-slate-400 font-black uppercase italic tracking-[0.2em] flex items-center gap-2">
              <Sparkles
                size={12}
                className={cn(
                  variant === "red" ? "text-red-400" : "text-orange-400",
                )}
              />
              {subtitle}
            </p>
          </div>
        </div>
      </div>
      {actions && (
        <div className="flex items-center gap-3 shrink-0">{actions}</div>
      )}
    </div>
  );
}
