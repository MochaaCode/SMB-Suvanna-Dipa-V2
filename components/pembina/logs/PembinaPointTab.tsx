"use client";

import { Coins, Clock, ArrowUpRight, ArrowDownLeft } from "lucide-react";
import { format } from "date-fns";
import { id } from "date-fns/locale";
import type { PembinaPointLog } from "@/actions/pembina/logs";

export function PembinaPointTab({ points }: { points: PembinaPointLog[] }) {
  if (points.length === 0) {
    return (
      <div className="py-20 text-center bg-white border border-dashed border-slate-200 rounded-[1.5rem] mt-2 shadow-sm">
        <div className="mx-auto text-slate-300 mb-4 flex justify-center">
          <Coins size={40} />
        </div>
        <h3 className="text-base font-bold text-slate-700 mb-1">
          Data Masih Kosong
        </h3>
        <p className="text-xs font-medium text-slate-400 px-10">
          Belum ada mutasi poin di kelas Anda.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {points.map((log) => {
        const isEarning = log.type === "earning";
        return (
          <div
            key={log.id}
            className="p-4 bg-white border border-slate-200 rounded-2xl shadow-sm flex items-center justify-between group hover:border-orange-200 transition-colors"
          >
            <div className="flex items-center gap-4 flex-1 min-w-0 pr-4">
              <div
                className={`p-3 rounded-xl shrink-0 ${isEarning ? "bg-green-50 text-green-600" : "bg-red-50 text-red-600"}`}
              >
                {isEarning ? (
                  <ArrowUpRight size={20} />
                ) : (
                  <ArrowDownLeft size={20} />
                )}
              </div>
              <div className="flex flex-col gap-1 min-w-0">
                <p className="text-sm font-bold text-slate-800 truncate">
                  {log.profiles?.full_name || "Siswa Tidak Diketahui"}
                </p>
                <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-2 text-[10px] font-medium text-slate-400">
                  <span className="truncate max-w-50 sm:max-w-62.5">
                    {log.description}
                  </span>
                  <span className="hidden sm:block w-1 h-1 rounded-full bg-slate-300 shrink-0" />
                  <span className="flex items-center gap-1 shrink-0">
                    <Clock size={12} className="text-orange-400" />
                    {format(new Date(log.created_at), "dd MMM yyyy, HH:mm", {
                      locale: id,
                    })}
                  </span>
                </div>
              </div>
            </div>
            <span
              className={`shrink-0 text-lg font-black tracking-tight ${isEarning ? "text-green-600" : "text-red-600"}`}
            >
              {isEarning ? "+" : "-"}
              {log.amount}
            </span>
          </div>
        );
      })}
    </div>
  );
}
