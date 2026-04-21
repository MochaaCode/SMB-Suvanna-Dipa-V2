"use client";

import { cn } from "@/lib/utils";
import React from "react";

interface AppCardProps {
  children: React.ReactNode;
  className?: string;
  noPadding?: boolean;
}

export function AppCard({
  children,
  className,
  noPadding = false,
}: AppCardProps) {
  return (
    <div
      className={cn(
        "bg-white rounded-[1rem] border border-slate-100 shadow-sm overflow-hidden animate-in fade-in slide-in-from-bottom-2 duration-500",
        !noPadding && "p-6 md:p-8",
        className,
      )}
    >
      {children}
    </div>
  );
}
