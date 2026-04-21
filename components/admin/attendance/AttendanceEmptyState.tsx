"use client";

import { CalendarDays, ArrowRight } from "lucide-react";
import Link from "next/link";
import { AppButton } from "../../shared/AppButton";

export default function AttendanceEmptyState() {
  return (
    <div className="flex h-[70vh] flex-col items-center justify-center p-6 text-center animate-in fade-in zoom-in duration-500">
      <div className="bg-slate-50 p-6 rounded-full mb-6 border border-slate-200 shadow-sm">
        <CalendarDays size={48} className="text-slate-400" />
      </div>
      <h1 className="text-2xl font-bold text-slate-800 mb-2">
        Presensi Belum Dibuka
      </h1>
      <p className="text-slate-500 max-w-sm mb-8 font-medium leading-relaxed">
        Sepertinya belum ada jadwal aktif hari ini. Silakan tentukan agenda dan
        buka gerbang presensi di Menu Jadwal terlebih dahulu.
      </p>
      <Link href="/admin/schedules">
        <AppButton className="group h-11 px-6 font-bold text-sm rounded-[1rem]">
          Pergi ke Jadwal{" "}
          <ArrowRight
            size={16}
            className="ml-2 group-hover:translate-x-1 transition-transform"
          />
        </AppButton>
      </Link>
    </div>
  );
}
