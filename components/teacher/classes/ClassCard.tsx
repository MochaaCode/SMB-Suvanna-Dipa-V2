"use client";

import Link from "next/link";
import { Users, ChevronRight, GraduationCap, Lock, Star } from "lucide-react";
import { AppCard } from "@/components/shared/AppCard";

interface ClassCardProps {
  name: string;
  slug: string;
  studentCount: number;
  isAuthorized: boolean;
  roleInClass: string | null;
}

export function ClassCard({
  name,
  slug,
  studentCount,
  isAuthorized,
  roleInClass,
}: ClassCardProps) {
  // Tampilan kartu jika Pembina memiliki akses ke kelas ini
  if (isAuthorized) {
    return (
      <Link href={`/pembina/classes/${slug}`}>
        <AppCard className="p-6 cursor-pointer hover:border-orange-300 hover:shadow-md transition-all group border-slate-200 relative overflow-hidden">
          {/* Badge Role (Guru/GL) */}
          <div className="absolute top-0 right-0 bg-orange-100 text-orange-700 text-[10px] font-black uppercase tracking-widest px-3 py-1 rounded-bl-xl flex items-center gap-1 shadow-sm">
            <Star size={10} className="fill-orange-500" /> {roleInClass}
          </div>

          <div className="flex items-center justify-between mt-2">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-orange-50 text-orange-600 rounded-xl group-hover:scale-110 transition-transform">
                <GraduationCap size={24} />
              </div>
              <div>
                <h3 className="text-lg font-bold text-slate-800 group-hover:text-orange-600 transition-colors">
                  {name}
                </h3>
                <p className="text-sm font-medium text-slate-500 flex items-center gap-1.5 mt-0.5">
                  <Users size={14} className="text-slate-400" />
                  {studentCount} Siswa
                </p>
              </div>
            </div>
            <div className="w-8 h-8 rounded-full bg-slate-50 flex items-center justify-center text-slate-400 group-hover:bg-orange-100 group-hover:text-orange-600 transition-colors">
              <ChevronRight size={18} />
            </div>
          </div>
        </AppCard>
      </Link>
    );
  }

  // Tampilan kartu abu-abu (Disabled) jika tidak ada akses
  return (
    <AppCard className="p-6 border-slate-100 bg-slate-50/50 opacity-75 relative overflow-hidden">
      <div className="absolute top-0 right-0 bg-slate-200 text-slate-500 text-[10px] font-black uppercase tracking-widest px-3 py-1 rounded-bl-xl flex items-center gap-1">
        <Lock size={10} /> Akses Terkunci
      </div>

      <div className="flex items-center justify-between mt-2">
        <div className="flex items-center gap-4">
          <div className="p-3 bg-slate-100 text-slate-400 rounded-xl grayscale">
            <GraduationCap size={24} />
          </div>
          <div>
            <h3 className="text-lg font-bold text-slate-500">{name}</h3>
            <p className="text-sm font-medium text-slate-400 flex items-center gap-1.5 mt-0.5">
              <Users size={14} />
              {studentCount} Siswa
            </p>
          </div>
        </div>
        <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-slate-300">
          <Lock size={16} />
        </div>
      </div>
    </AppCard>
  );
}
