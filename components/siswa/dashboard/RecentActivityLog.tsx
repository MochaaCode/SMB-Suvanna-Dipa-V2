"use client";

import { ArrowUpRight, ArrowDownLeft } from "lucide-react";
import { AppCard } from "@/components/shared/AppCard";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import { id as localeID } from "date-fns/locale";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function RecentActivityLog({ activities }: { activities: any[] }) {
  return (
    <div className="space-y-3">
      <h3 className="text-[11px] font-black text-slate-500 uppercase tracking-widest px-1">
        Aktivitas Poin
      </h3>
      <AppCard className="p-0 overflow-hidden border-slate-200 divide-y divide-slate-100 shadow-sm rounded-[1.5rem]">
        {activities.length > 0 ? (
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          activities.map((act: any) => (
            <div
              key={act.id}
              className="p-4 flex items-center justify-between hover:bg-slate-50 transition-colors"
            >
              <div className="flex items-center gap-3.5">
                <div
                  className={cn(
                    "p-2.5 rounded-xl border shadow-sm",
                    act.type === "earning"
                      ? "bg-green-50 text-green-600 border-green-100"
                      : "bg-red-50 text-red-600 border-red-100",
                  )}
                >
                  {act.type === "earning" ? (
                    <ArrowUpRight size={16} strokeWidth={3} />
                  ) : (
                    <ArrowDownLeft size={16} strokeWidth={3} />
                  )}
                </div>
                <div>
                  <p className="text-[12px] font-bold text-slate-800 line-clamp-1">
                    {act.description}
                  </p>
                  <p className="text-[10px] font-medium text-slate-400 mt-1">
                    {format(new Date(act.created_at), "dd MMM yyyy", {
                      locale: localeID,
                    })}
                  </p>
                </div>
              </div>
              <div
                className={cn(
                  "font-black text-sm tracking-tighter",
                  act.type === "earning" ? "text-green-600" : "text-red-600",
                )}
              >
                {act.type === "earning" ? "+" : "-"}
                {act.amount}
              </div>
            </div>
          ))
        ) : (
          <div className="p-10 text-center text-slate-400 text-[11px] font-bold italic">
            Belum ada aktivitas poin.
          </div>
        )}
      </AppCard>
    </div>
  );
}
