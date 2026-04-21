"use client";

import { Gift, Cake, Users, User, CalendarDays } from "lucide-react";

import type { Profile } from "@/types";

interface BirthdayCardProps {
  students: Profile[];
}

export function BirthdayCard({ students }: BirthdayCardProps) {
  const currentMonth = new Date().getMonth();
  const currentYear = new Date().getFullYear();

  const startMonthIndex = Math.floor(currentMonth / 2) * 2;
  const endMonthIndex = startMonthIndex + 1;

  const monthNames = [
    "Januari",
    "Februari",
    "Maret",
    "April",
    "Mei",
    "Juni",
    "Juli",
    "Agustus",
    "September",
    "Oktober",
    "November",
    "Desember",
  ];

  const periodLabel = `${monthNames[startMonthIndex]} - ${monthNames[endMonthIndex]}`;

  // 1. FILTERING DATA
  const birthdayKids = students
    .filter((s) => {
      if (!s.birth_date) return false;
      const birthMonth = new Date(s.birth_date).getMonth();
      return birthMonth === startMonthIndex || birthMonth === endMonthIndex;
    })
    .sort((a, b) => {
      const dateA = new Date(a.birth_date!);
      const dateB = new Date(b.birth_date!);
      if (dateA.getMonth() !== dateB.getMonth())
        return dateA.getMonth() - dateB.getMonth();
      return dateA.getDate() - dateB.getDate();
    });

  // 2. MENGHITUNG STATISTIK ANALITIK
  const totalKids = birthdayKids.length;
  const maleCount = birthdayKids.filter((k) => k.gender === "Laki-Laki").length;
  const femaleCount = birthdayKids.filter(
    (k) => k.gender === "Perempuan",
  ).length;
  const firstMonthCount = birthdayKids.filter(
    (k) => new Date(k.birth_date!).getMonth() === startMonthIndex,
  ).length;
  const secondMonthCount = birthdayKids.filter(
    (k) => new Date(k.birth_date!).getMonth() === endMonthIndex,
  ).length;

  return (
    <div className="bg-white p-6 rounded-[1rem] border border-slate-200 shadow-sm space-y-6 flex flex-col w-full lg:col-span-2">
      {/* HEADER UTAMA */}
      <div className="flex flex-col md:flex-row md:items-center justify-between border-b border-slate-100 pb-4 gap-4">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-pink-50 rounded-lg text-pink-600 border border-pink-100">
            <Gift size={18} />
          </div>
          <div className="space-y-0.5">
            <h3 className="text-base font-bold text-slate-800">
              Ulang Tahun Siswa
            </h3>
            <p className="text-[10px] font-bold uppercase tracking-wider text-slate-500">
              Periode {periodLabel}
            </p>
          </div>
        </div>

        {/* STATISTIK RINGKASAN (Fitur Baru) */}
        {totalKids > 0 && (
          <div className="flex flex-wrap items-center gap-2 md:gap-4 bg-slate-50/80 p-2 md:px-4 md:py-2 rounded-lg border border-slate-100">
            <div className="flex items-center gap-1.5 text-[11px] font-semibold text-slate-600">
              <Users size={14} className="text-pink-500" />
              <span>Total: {totalKids} Siswa</span>
            </div>
            <div className="hidden md:block w-px h-4 bg-slate-200"></div>
            <div className="flex items-center gap-1.5 text-[11px] font-semibold text-slate-600">
              <User size={14} className="text-blue-500" />
              <span>
                {maleCount} Pria / {femaleCount} Wanita
              </span>
            </div>
            <div className="hidden md:block w-px h-4 bg-slate-200"></div>
            <div className="flex items-center gap-1.5 text-[11px] font-semibold text-slate-600">
              <CalendarDays size={14} className="text-orange-500" />
              <span>
                {monthNames[startMonthIndex]}: {firstMonthCount} |{" "}
                {monthNames[endMonthIndex]}: {secondMonthCount}
              </span>
            </div>
          </div>
        )}
      </div>

      {/* LIST SISWA */}
      <div className="flex flex-wrap gap-4">
        {totalKids === 0 ? (
          <div className="w-full py-10 flex items-center justify-center bg-slate-50/50 rounded-xl border border-dashed border-slate-200">
            <p className="text-xs font-medium text-slate-400">
              Tidak ada siswa yang berulang tahun pada periode ini.
            </p>
          </div>
        ) : (
          birthdayKids.map((kid) => {
            const birthDate = new Date(kid.birth_date!);
            const ageTurning = currentYear - birthDate.getFullYear();
            const displayDate = birthDate.toLocaleDateString("id-ID", {
              day: "numeric",
              month: "long",
            });

            return (
              <div
                key={kid.id}
                className="flex items-center gap-4 p-3.5 bg-white rounded-xl border border-slate-200 hover:border-pink-300 hover:shadow-sm transition-all group min-w-65 flex-1"
              >
                <div className="w-10 h-10 bg-pink-50 rounded-lg flex items-center justify-center shrink-0 border border-pink-100 group-hover:scale-105 transition-transform">
                  <Cake size={18} className="text-pink-500" />
                </div>
                <div className="flex-1 space-y-1 truncate pr-2">
                  <p className="text-sm font-semibold text-slate-800 group-hover:text-pink-600 transition-colors truncate">
                    {kid.full_name}
                  </p>
                  <p className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">
                    {displayDate}
                  </p>
                </div>
                <div className="px-2.5 py-1 rounded-md border border-slate-200 bg-slate-50 text-[11px] font-bold tracking-wide shrink-0 text-slate-700">
                  {ageTurning} Tahun
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
