/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useEffect, useState, useTransition } from "react";
import { getStudentDetailedLogs } from "@/actions/admin/logs";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  History,
  CalendarCheck,
  Gift,
  ArrowUpRight,
  ArrowDownLeft,
  Clock,
  Loader2,
  Star,
  UserCheck,
} from "lucide-react";
import toast from "react-hot-toast";
import { AppModal } from "../../shared/AppModal";

// IMPORT TIPE KETAT
import type { StudentSummary, StudentDetailedLogs } from "@/actions/admin/logs";

interface StudentActivityModalProps {
  student: StudentSummary | null;
  onClose: () => void;
}

export function StudentActivityModal({
  student,
  onClose,
}: StudentActivityModalProps) {
  const [logs, setLogs] = useState<StudentDetailedLogs | null>(null);
  const [isPending, startTransition] = useTransition();

  useEffect(() => {
    if (student) {
      startTransition(async () => {
        try {
          const data = await getStudentDetailedLogs(student.id);
          setLogs(data);
        } catch (err: any) {
          toast.error("Gagal memuat rekam jejak");
        }
      });
    }
  }, [student]);

  if (!student) return null;

  return (
    <AppModal
      isOpen={!!student}
      onClose={onClose}
      title="Rekam Jejak Aktivitas"
      description="Audit lengkap mutasi poin, presensi, dan penukaran hadiah."
      variant="orange"
      maxWidth="xl"
    >
      {/* HEADER: INFO UTAMA SISWA */}
      <div className="flex flex-col sm:flex-row items-center sm:items-start justify-between gap-5 bg-white p-5 rounded-2xl border border-slate-200 shadow-sm mb-6">
        <div className="flex items-center gap-4">
          <Avatar className="h-16 w-16 border border-slate-200 shadow-sm">
            <AvatarFallback className="bg-orange-100 text-orange-700 font-bold text-xl">
              {student.full_name?.substring(0, 2).toUpperCase()}
            </AvatarFallback>
          </Avatar>
          <div className="text-left">
            <h2 className="text-lg font-bold text-slate-800 leading-tight">
              {student.full_name}
            </h2>
            <p className="text-xs font-semibold text-slate-500 mt-1 flex items-center gap-1.5">
              <UserCheck size={14} className="text-orange-500" />{" "}
              {student.buddhist_name || "Tanpa Nama Buddhis"} •{" "}
              {student.classes?.name || "Umum"}
            </p>
          </div>
        </div>
        <div className="bg-slate-50 px-4 py-2.5 rounded-xl border border-slate-100 text-right min-w-30 flex flex-col justify-center items-end">
          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider leading-none mb-1.5">
            Total Saldo Poin
          </p>
          <div className="flex items-center gap-1.5 text-lg font-bold text-orange-600">
            <Star size={16} fill="currentColor" />{" "}
            {student.points.toLocaleString()}
          </div>
        </div>
      </div>

      {/* TABS NAVIGATION */}
      <Tabs defaultValue="mutasi" className="w-full">
        <TabsList className="grid w-full grid-cols-3 bg-slate-100 p-1 rounded-lg mb-4">
          <TabsTrigger
            value="mutasi"
            className="text-[11px] font-bold data-[state=active]:bg-white data-[state=active]:shadow-sm rounded-md transition-all flex items-center gap-1.5"
          >
            <History size={14} /> Mutasi Poin
          </TabsTrigger>
          <TabsTrigger
            value="absensi"
            className="text-[11px] font-bold data-[state=active]:bg-white data-[state=active]:shadow-sm rounded-md transition-all flex items-center gap-1.5"
          >
            <CalendarCheck size={14} /> Presensi
          </TabsTrigger>
          <TabsTrigger
            value="orderan"
            className="text-[11px] font-bold data-[state=active]:bg-white data-[state=active]:shadow-sm rounded-md transition-all flex items-center gap-1.5"
          >
            <Gift size={14} /> Hadiah
          </TabsTrigger>
        </TabsList>

        <div className="relative min-h-75">
          {isPending ? (
            <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 bg-white/80 z-20 rounded-lg">
              <Loader2 className="animate-spin text-orange-500" size={32} />
              <p className="text-xs font-bold text-slate-500">
                Menarik Data Siswa...
              </p>
            </div>
          ) : (
            logs && (
              <ScrollArea className="h-[45vh] pr-3">
                {/* 1. TAB MUTASI POIN */}
                <TabsContent
                  value="mutasi"
                  className="m-0 space-y-3 outline-none"
                >
                  {logs.mutations.length === 0 ? (
                    <p className="text-center py-16 text-slate-400 font-medium text-sm">
                      Belum ada riwayat mutasi poin.
                    </p>
                  ) : (
                    logs.mutations.map((m) => (
                      <div
                        key={m.id}
                        className="flex items-center justify-between p-4 rounded-xl bg-white border border-slate-200 hover:border-orange-300 shadow-sm transition-all group"
                      >
                        <div className="flex items-center gap-4 text-left">
                          <div
                            className={`h-10 w-10 rounded-lg flex items-center justify-center shrink-0 ${
                              m.amount > 0
                                ? "bg-green-50 text-green-600 border border-green-100"
                                : "bg-orange-50 text-orange-600 border border-orange-100"
                            }`}
                          >
                            {m.amount > 0 ? (
                              <ArrowUpRight size={18} />
                            ) : (
                              <ArrowDownLeft size={18} />
                            )}
                          </div>
                          <div className="space-y-1">
                            <p className="text-sm font-bold text-slate-800 leading-none group-hover:text-orange-600 transition-colors">
                              {m.description}
                            </p>
                            <p className="text-[10px] text-slate-500 font-semibold flex items-center gap-1.5">
                              <Clock size={12} className="text-slate-400" />{" "}
                              {new Date(m.created_at).toLocaleString("id-ID", {
                                day: "2-digit",
                                month: "short",
                                year: "numeric",
                                hour: "2-digit",
                                minute: "2-digit",
                              })}{" "}
                              WIB
                            </p>
                          </div>
                        </div>
                        <span
                          className={`text-sm font-bold ${
                            m.amount > 0 ? "text-green-600" : "text-orange-600"
                          }`}
                        >
                          {m.amount > 0 ? `+${m.amount}` : m.amount}
                        </span>
                      </div>
                    ))
                  )}
                </TabsContent>

                {/* 2. TAB PRESENSI */}
                <TabsContent
                  value="absensi"
                  className="m-0 space-y-3 outline-none"
                >
                  {logs.attendance.length === 0 ? (
                    <p className="text-center py-16 text-slate-400 font-medium text-sm">
                      Belum ada data kehadiran.
                    </p>
                  ) : (
                    logs.attendance.map((a) => (
                      <div
                        key={a.id}
                        className="flex items-center justify-between p-4 rounded-xl bg-white border border-slate-200 shadow-sm group hover:border-orange-300 transition-all"
                      >
                        <div className="space-y-1.5 text-left">
                          <p className="text-sm font-bold text-slate-800 leading-none group-hover:text-orange-600 transition-colors">
                            {a.schedule?.title || "Sesi Umum"}
                          </p>
                          <p className="text-[10px] text-slate-500 font-semibold flex items-center gap-1.5">
                            <CalendarCheck
                              size={12}
                              className="text-slate-400"
                            />
                            {new Date(a.scan_time).toLocaleDateString("id-ID", {
                              day: "2-digit",
                              month: "long",
                              year: "numeric",
                            })}
                          </p>
                        </div>
                        <Badge
                          className={`${
                            a.status === "hadir"
                              ? "bg-green-50 text-green-700 border-green-200"
                              : a.status === "terlambat"
                                ? "bg-orange-50 text-orange-700 border-orange-200"
                                : "bg-red-50 text-red-700 border-red-200"
                          } px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider shadow-none`}
                        >
                          {a.status}
                        </Badge>
                      </div>
                    ))
                  )}
                </TabsContent>

                {/* 3. TAB ORDERAN HADIAH */}
                <TabsContent
                  value="orderan"
                  className="m-0 space-y-3 outline-none"
                >
                  {logs.orders.length === 0 ? (
                    <p className="text-center py-16 text-slate-400 font-medium text-sm">
                      Belum ada penukaran hadiah.
                    </p>
                  ) : (
                    logs.orders.map((o) => (
                      <div
                        key={o.id}
                        className="flex items-center justify-between p-4 rounded-xl bg-white border border-slate-200 shadow-sm group hover:border-orange-300 transition-all"
                      >
                        <div className="flex items-center gap-4 text-left">
                          <div className="h-10 w-10 bg-slate-50 border border-slate-100 rounded-lg flex items-center justify-center text-slate-400 shrink-0">
                            <Gift size={18} />
                          </div>
                          <div className="space-y-1.5">
                            <p className="text-sm font-bold text-slate-800 leading-none group-hover:text-orange-600 transition-colors truncate max-w-45 sm:max-w-62.5">
                              {o.product?.name}
                            </p>
                            <p className="text-[10px] font-bold text-orange-600 flex items-center gap-1.5">
                              <Star size={10} fill="currentColor" />
                              Biaya: {o.total_points} Pts
                            </p>
                          </div>
                        </div>
                        <Badge
                          variant="outline"
                          className={`px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider shadow-none ${
                            o.status === "selesai"
                              ? "bg-green-50 text-green-700 border-green-200"
                              : o.status === "dibatalkan"
                                ? "bg-red-50 text-red-700 border-red-200"
                                : "bg-blue-50 text-blue-700 border-blue-200"
                          }`}
                        >
                          {o.status}
                        </Badge>
                      </div>
                    ))
                  )}
                </TabsContent>
              </ScrollArea>
            )
          )}
        </div>
      </Tabs>
    </AppModal>
  );
}
