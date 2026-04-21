"use client";

import {
  ShieldAlert,
  KeyRound,
  CheckCircle2,
  XCircle,
  User,
} from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { id } from "date-fns/locale";

import type { PasswordResetToken } from "@/types";

interface PasswordResetLogsCardProps {
  logs: PasswordResetToken[];
}

export function PasswordResetLogsCard({ logs }: PasswordResetLogsCardProps) {
  const getStatus = (log: PasswordResetToken) => {
    const baseStyle =
      "flex items-center gap-1.5 px-2.5 py-1 rounded-md border text-[9px] font-bold uppercase tracking-wider shrink-0";

    if (log.is_used) {
      return {
        label: "SELESAI",
        style: `${baseStyle} bg-green-50 text-green-700 border-green-200`,
        icon: CheckCircle2,
      };
    }

    if (new Date() > new Date(log.expires_at)) {
      return {
        label: "KADALUARSA",
        style: `${baseStyle} bg-slate-50 text-slate-500 border-slate-200`,
        icon: XCircle,
      };
    }

    return {
      label: "MENUNGGU",
      style: `${baseStyle} bg-orange-50 text-orange-700 border-orange-200`,
      icon: KeyRound,
      isPending: true,
    };
  };

  return (
    <div className="bg-white p-6 rounded-[1rem] border border-slate-200 shadow-sm space-y-5 flex-1 w-full">
      <div className="flex items-center justify-between border-b border-slate-100 pb-4">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-slate-900 rounded-lg text-white border border-slate-800">
            <ShieldAlert size={18} />
          </div>
          <h3 className="text-base font-bold text-slate-800">Log Keamanan</h3>
        </div>
        <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">
          RESET KATA SANDI
        </span>
      </div>

      <div className="space-y-2.5 max-h-72 overflow-y-auto pr-2 custom-scrollbar">
        {logs.length === 0 ? (
          <div className="flex items-center justify-center py-10">
            <p className="text-xs font-medium text-slate-400">
              Tidak ada permintaan reset kata sandi.
            </p>
          </div>
        ) : (
          logs.map((log) => {
            const status = getStatus(log);
            const StatusIcon = status.icon;
            const displayName = log.profiles?.full_name || log.email;

            return (
              <div
                key={log.id}
                className="flex items-center justify-between p-3.5 bg-slate-50/50 rounded-xl border border-slate-100 hover:border-slate-300 hover:bg-slate-50 transition-colors"
              >
                <div className="space-y-1.5 truncate pr-4">
                  <p className="text-sm font-bold text-slate-800 truncate flex items-center gap-1.5">
                    <User size={14} className="text-slate-400" /> {displayName}
                  </p>
                  <p className="text-[10px] font-semibold text-slate-500 tracking-wider truncate">
                    {log.email} •{" "}
                    {formatDistanceToNow(new Date(log.created_at), {
                      addSuffix: true,
                      locale: id,
                    })}
                  </p>
                </div>
                <div className={status.style}>
                  {status.isPending && (
                    <span className="w-1.5 h-1.5 rounded-full bg-orange-500 animate-pulse"></span>
                  )}
                  <StatusIcon size={12} strokeWidth={2.5} /> {status.label}
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
