"use client";

import { Wallet, IdCard, Sparkles } from "lucide-react";
import { AppCard } from "@/components/shared/AppCard";

interface VirtualMemberCardProps {
  studentInfo: {
    id: string;
    fullName: string;
    buddhistName: string | null;
  };
  className: string;
  points: number;
}

export function VirtualMemberCard({
  studentInfo,
  className,
  points,
}: VirtualMemberCardProps) {
  return (
    <AppCard className="p-6 border border-orange-400/30 bg-linear-to-br from-orange-500 via-orange-500 to-amber-500 text-white shadow-[0_8px_30px_rgb(234,88,12,0.25)] relative overflow-hidden rounded-[2rem]">
      <div className="absolute -top-10 -right-10 p-4 opacity-10 rotate-12 pointer-events-none">
        <IdCard size={200} />
      </div>

      <div className="relative z-10 flex flex-col h-full justify-between space-y-6">
        <div className="flex justify-between items-start">
          <div className="space-y-1.5">
            <p className="text-[10px] font-black uppercase tracking-[0.25em] text-white/80 drop-shadow-sm">
              Kartu Anggota SMB
            </p>
            <div className="inline-block px-3 py-1 bg-white/20 backdrop-blur-md rounded-full border border-white/30 shadow-sm">
              <span className="text-[11px] font-bold tracking-wider">
                {className}
              </span>
            </div>
          </div>
          <div className="p-2.5 bg-white/10 rounded-2xl backdrop-blur-md border border-white/20">
            <Sparkles size={20} className="text-white fill-white/50" />
          </div>
        </div>

        <div className="pt-2">
          <p className="text-2xl font-black tracking-tight leading-none drop-shadow-md">
            {studentInfo.fullName}
          </p>
          <p className="text-[11px] font-bold text-orange-100 mt-2 italic tracking-wide">
            {studentInfo.buddhistName || "Siswa Suvannadipa"}
          </p>
        </div>

        <div className="pt-4 border-t border-white/20 flex justify-between items-end">
          <div className="space-y-1">
            <p className="text-[9px] font-black uppercase tracking-widest opacity-70">
              ID Digital
            </p>
            <p className="font-mono text-xs font-bold tracking-widest text-white/90 drop-shadow-sm">
              {studentInfo.id.substring(0, 12)}
            </p>
          </div>
          <div className="text-right space-y-0.5">
            <p className="text-[9px] font-black uppercase tracking-widest opacity-70">
              Saldo Poin
            </p>
            <p className="text-2xl font-black tracking-tighter flex items-center justify-end gap-1.5 drop-shadow-lg">
              <Wallet size={18} className="fill-white/80" />
              {points.toLocaleString()}{" "}
              <span className="text-[10px] opacity-80 uppercase tracking-widest font-bold">
                Pts
              </span>
            </p>
          </div>
        </div>
      </div>
    </AppCard>
  );
}
