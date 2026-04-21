"use client";

import { Coins, ArrowUpRight, ArrowDownRight } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { id } from "date-fns/locale";

import type { PointHistoryWithProfile } from "@/types";

interface PointHistoryCardProps {
  logs: PointHistoryWithProfile[];
}

export function PointHistoryCard({ logs }: PointHistoryCardProps) {
  return (
    <div className="bg-white p-6 rounded-[1rem] border border-slate-200 shadow-sm space-y-5 flex-1 w-full">
      <div className="flex items-center justify-between border-b border-slate-100 pb-4">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-yellow-50 rounded-lg text-yellow-600 border border-yellow-100">
            <Coins size={18} />
          </div>
          <h3 className="text-base font-bold text-slate-800">Mutasi Poin</h3>
        </div>
        <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider flex items-center gap-1.5">
          LIVE TRACKING
        </span>
      </div>

      <div className="space-y-2.5 max-h-72 overflow-y-auto pr-2 custom-scrollbar">
        {logs.length === 0 ? (
          <div className="flex items-center justify-center py-10">
            <p className="text-xs font-medium text-slate-400">
              Belum ada riwayat transaksi poin.
            </p>
          </div>
        ) : (
          logs.map((log) => {
            const isEarning = log.type === "earning";

            return (
              <div
                key={log.id}
                className="flex items-center justify-between p-3.5 bg-slate-50/50 rounded-xl border border-slate-100 hover:border-slate-300 hover:bg-slate-50 transition-colors group"
              >
                <div className="flex items-center gap-3.5">
                  <div
                    className={`w-9 h-9 rounded-lg flex items-center justify-center shrink-0 ${
                      isEarning
                        ? "bg-green-50 text-green-600 border border-green-100"
                        : "bg-red-50 text-red-600 border border-red-100"
                    }`}
                  >
                    {isEarning ? (
                      <ArrowUpRight size={16} />
                    ) : (
                      <ArrowDownRight size={16} />
                    )}
                  </div>
                  <div className="space-y-1 max-w-37.5 md:max-w-50">
                    <p className="text-sm font-semibold text-slate-800 truncate group-hover:text-yellow-600 transition-colors">
                      {log.profiles?.full_name || "Siswa Tidak Ditemukan"}
                    </p>
                    <p
                      className="text-[10px] font-medium text-slate-500 truncate"
                      title={log.description}
                    >
                      {log.description}
                    </p>
                    <p className="text-[9px] font-bold text-slate-400 uppercase tracking-wider">
                      {formatDistanceToNow(new Date(log.created_at), {
                        addSuffix: true,
                        locale: id,
                      })}
                    </p>
                  </div>
                </div>
                <div
                  className={`px-2.5 py-1 rounded-md border text-xs font-bold tracking-wide shrink-0 ${
                    isEarning
                      ? "bg-green-50 border-green-200 text-green-700"
                      : "bg-red-50 border-red-200 text-red-700"
                  }`}
                >
                  {isEarning ? "+" : ""}
                  {log.amount}
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
