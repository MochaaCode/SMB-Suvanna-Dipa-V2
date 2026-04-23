"use client";

import { ArrowUpRight, ArrowDownLeft, Clock } from "lucide-react";
import { format } from "date-fns";
import { id } from "date-fns/locale";
import type { PointHistory } from "@/types";

export function PointHistoryTab({ points }: { points: PointHistory[] }) {
  if (points.length === 0)
    return <EmptyState message="Belum ada riwayat mutasi poin." />;

  return (
    <div className="space-y-3">
      {points.map((p) => (
        <div
          key={p.id}
          className="p-4 bg-white border border-slate-200 rounded-2xl shadow-sm flex items-center justify-between"
        >
          <div className="flex items-center gap-3">
            <div
              className={`p-2 rounded-lg ${p.type === "earning" ? "bg-green-50 text-green-600" : "bg-red-50 text-red-600"}`}
            >
              {p.type === "earning" ? (
                <ArrowUpRight size={18} />
              ) : (
                <ArrowDownLeft size={18} />
              )}
            </div>
            <div>
              <p className="text-xs font-bold text-slate-800 leading-tight">
                {p.description}
              </p>
              <p className="text-[10px] font-medium text-slate-400 mt-1">
                {format(new Date(p.created_at), "dd MMM yyyy • HH:mm", {
                  locale: id,
                })}
              </p>
            </div>
          </div>
          <span
            className={`text-sm font-black ${p.type === "earning" ? "text-green-600" : "text-red-600"}`}
          >
            {p.type === "earning" ? "+" : ""}
            {p.amount}
          </span>
        </div>
      ))}
    </div>
  );
}

function EmptyState({ message }: { message: string }) {
  return (
    <div className="py-20 text-center bg-slate-50 border border-dashed border-slate-200 rounded-3xl">
      <Clock className="mx-auto text-slate-300 mb-3" size={40} />
      <p className="text-xs font-bold text-slate-400 uppercase tracking-widest px-10">
        {message}
      </p>
    </div>
  );
}
