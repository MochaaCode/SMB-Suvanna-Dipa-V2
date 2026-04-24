"use client";

import { useState } from "react";
import {
  GraduationCap,
  Users,
  Award,
  Sparkles,
  Venus,
  Mars,
} from "lucide-react";
import { PageHeader } from "@/components/shared/PageHeader";
import { AppCard } from "@/components/shared/AppCard";
import { AppButton } from "@/components/shared/AppButton";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { BulkGivePointsModal } from "./BulkGivePointsModal";
import type { Profile } from "@/types";

interface MyClassProps {
  data: {
    classInfo: { name: string; roleInClass: string };
    students: Profile[];
    stats: {
      total: number;
      laki: number;
      perempuan: number;
      avgPoints: number;
    };
  } | null;
}

export function MyClassManagement({ data }: MyClassProps) {
  const [isPointsModalOpen, setIsPointsModalOpen] = useState(false);

  if (!data) {
    return (
      <div className="py-24 text-center space-y-4 bg-white rounded-[2rem] border border-dashed border-slate-200">
        <GraduationCap size={48} className="mx-auto text-slate-200" />
        <h3 className="text-xl font-bold text-slate-800">
          Belum Terdaftar di Kelas
        </h3>
        <p className="text-slate-500 max-w-xs mx-auto text-sm">
          Silakan hubungi Admin untuk didaftarkan ke dalam kelas binaan.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6 pb-20 animate-in fade-in duration-700">
      <PageHeader
        title="KELAS"
        highlightText="SAYA"
        subtitle={`Manajemen siswa dan aktivitas di ${data.classInfo.name}`}
        icon={<GraduationCap size={24} />}
        themeColor="orange"
      />

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatMiniCard
          label="Total Siswa"
          value={data.stats.total}
          icon={<Users size={18} />}
          theme="blue"
        />
        <StatMiniCard
          label="Laki-Laki"
          value={data.stats.laki}
          icon={<Mars size={18} />}
          theme="indigo"
        />
        <StatMiniCard
          label="Perempuan"
          value={data.stats.perempuan}
          icon={<Venus size={18} />}
          theme="pink"
        />
        <StatMiniCard
          label="Rata-rata Poin"
          value={data.stats.avgPoints}
          icon={<Sparkles size={18} />}
          theme="orange"
        />
      </div>

      <div className="flex flex-col sm:flex-row justify-end gap-3">
        <AppButton
          className="w-full sm:w-auto h-12 rounded-2xl shadow-sm font-bold px-6"
          leftIcon={<Award size={18} />}
          onClick={() => setIsPointsModalOpen(true)}
        >
          Bagi Poin Reward
        </AppButton>
      </div>

      <AppCard className="p-0 overflow-hidden border-slate-200 shadow-sm rounded-[2rem]">
        <div className="p-6 border-b border-slate-50 bg-slate-50/50 flex items-center justify-between">
          <h3 className="font-black text-slate-800 flex items-center gap-2 uppercase tracking-wider text-sm">
            <Users size={18} className="text-orange-500" /> Daftar Murid Binaan
          </h3>
          <span className="text-[10px] font-black bg-orange-600 text-white px-3 py-1 rounded-full">
            {data.classInfo.roleInClass}
          </span>
        </div>

        <div className="divide-y divide-slate-50">
          {data.students.map((student) => (
            <div
              key={student.id}
              className="p-4 flex items-center justify-between hover:bg-slate-50 transition-colors group"
            >
              <div className="flex items-center gap-4">
                <Avatar className="h-12 w-12 border-2 border-white shadow-sm transition-transform group-hover:scale-110">
                  <AvatarFallback
                    className={
                      student.gender === "Perempuan"
                        ? "bg-pink-100 text-pink-600"
                        : "bg-blue-100 text-blue-600"
                    }
                  >
                    {student.full_name?.substring(0, 2).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <p className="font-bold text-slate-800 text-sm">
                    {student.full_name}
                  </p>
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                    {student.buddhist_name || student.gender}
                  </p>
                </div>
              </div>
              <div className="px-4 py-2 rounded-xl bg-orange-50 border border-orange-100 text-orange-700 font-black text-xs shadow-sm">
                {student.points}{" "}
                <span className="text-[9px] opacity-60">PTS</span>
              </div>
            </div>
          ))}
        </div>
      </AppCard>

      <BulkGivePointsModal
        isOpen={isPointsModalOpen}
        onClose={() => setIsPointsModalOpen(false)}
        students={data.students}
      />
    </div>
  );
}

function StatMiniCard({
  label,
  value,
  icon,
  theme,
}: {
  label: string;
  value: number;
  icon: React.ReactNode;
  theme: string;
}) {
  const colors: Record<string, string> = {
    blue: "bg-blue-50 text-blue-600 border-blue-100",
    indigo: "bg-indigo-50 text-indigo-600 border-indigo-100",
    pink: "bg-pink-50 text-pink-600 border-pink-100",
    orange: "bg-orange-50 text-orange-600 border-orange-100",
  };
  return (
    <div
      className={`p-4 rounded-2xl border ${colors[theme]} flex flex-col gap-2 shadow-sm`}
    >
      <div className="flex items-center justify-between">
        <span className="p-1.5 bg-white/50 rounded-lg">{icon}</span>
        <span className="text-xl font-black">{value}</span>
      </div>
      <p className="text-[9px] font-black uppercase tracking-widest opacity-70">
        {label}
      </p>
    </div>
  );
}
