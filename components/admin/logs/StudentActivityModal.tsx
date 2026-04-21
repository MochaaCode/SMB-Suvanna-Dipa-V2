/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useEffect, useState, useTransition } from "react";
import { getStudentDetailedLogs } from "@/actions/admin/logs";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import {
  History,
  CalendarCheck,
  Gift,
  ArrowUpRight,
  ArrowDownLeft,
  Clock,
  Loader2,
  Star,
} from "lucide-react";
import toast from "react-hot-toast";
import { AppModal } from "../../shared/AppModal";
import { format } from "date-fns";
import { id as localeId } from "date-fns/locale";

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

  const [prevStudentId, setPrevStudentId] = useState<string | undefined>(
    undefined,
  );

  if (student?.id !== prevStudentId) {
    setPrevStudentId(student?.id);
    setLogs(null);
  }

  useEffect(() => {
    if (student) {
      startTransition(async () => {
        try {
          const data = await getStudentDetailedLogs(student.id);
          setLogs(data);
        } catch (error: any) {
          toast.error("Gagal menarik data: " + error.message);
        }
      });
    }
  }, [student]);

  if (!student) return null;

  return (
    <AppModal
      isOpen={!!student}
      onClose={onClose}
      title="Detail Riwayat Siswa"
      description={`Rekam jejak aktivitas untuk ${student.full_name}`}
      variant="orange"
      maxWidth="2xl"
    >
      {/* INFO CARD */}
      <div className="flex items-center gap-4 bg-slate-50 p-4 rounded-[1rem] border border-slate-200 shadow-sm mb-6 mt-2 text-left">
        <div className="h-12 w-12 rounded-[1rem] bg-orange-100 border border-orange-200 flex items-center justify-center text-orange-600 font-black text-lg">
          {student.full_name?.substring(0, 2).toUpperCase()}
        </div>
        <div className="flex-1 space-y-1">
          <h3 className="font-black text-slate-800 text-base leading-none">
            {student.full_name}
          </h3>
          <p className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">
            {student.classes?.name || "Tanpa Kelas"} •{" "}
            {student.buddhist_name || "Siswa"}
          </p>
        </div>
        <div className="bg-white px-4 py-2 rounded-[0.8rem] border border-slate-200 text-center shadow-sm">
          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-0.5">
            Total Poin
          </p>
          <div className="text-orange-600 font-black text-base flex items-center justify-center gap-1">
            <Star size={14} fill="currentColor" /> {student.points}
          </div>
        </div>
      </div>

      {/* TABS NAVIGATION */}
      <Tabs defaultValue="mutasi" className="w-full">
        <TabsList className="w-full grid grid-cols-3 bg-slate-100 p-1 rounded-[1rem] h-12 mb-4">
          <TabsTrigger
            value="mutasi"
            className="rounded-[0.8rem] text-xs font-bold data-[state=active]:bg-white data-[state=active]:text-orange-600 data-[state=active]:shadow-sm"
          >
            <History size={14} className="mr-2" /> Mutasi
          </TabsTrigger>
          <TabsTrigger
            value="absensi"
            className="rounded-[0.8rem] text-xs font-bold data-[state=active]:bg-white data-[state=active]:text-blue-600 data-[state=active]:shadow-sm"
          >
            <CalendarCheck size={14} className="mr-2" /> Kehadiran
          </TabsTrigger>
          <TabsTrigger
            value="hadiah"
            className="rounded-[0.8rem] text-xs font-bold data-[state=active]:bg-white data-[state=active]:text-green-600 data-[state=active]:shadow-sm"
          >
            <Gift size={14} className="mr-2" /> Hadiah
          </TabsTrigger>
        </TabsList>

        <div className="bg-white rounded-[1rem] border border-slate-200 overflow-hidden shadow-sm text-left">
          {isPending || !logs ? (
            <div className="flex flex-col items-center justify-center h-72 space-y-3 text-slate-400">
              <Loader2 size={32} className="animate-spin text-orange-500" />
              <p className="text-xs font-bold uppercase tracking-widest">
                Menarik Data...
              </p>
            </div>
          ) : (
            <ScrollArea className="h-72 custom-scrollbar">
              {/* TAB 1: MUTASI POIN */}
              <TabsContent value="mutasi" className="m-0 p-4 space-y-3">
                {logs.mutations.length === 0 ? (
                  <p className="text-center text-sm font-medium text-slate-400 py-10">
                    Belum ada riwayat mutasi poin.
                  </p>
                ) : (
                  logs.mutations.map((m) => (
                    <div
                      key={m.id}
                      className="flex items-center justify-between p-3 rounded-[0.8rem] border border-slate-100 hover:bg-slate-50 transition-colors"
                    >
                      <div className="flex items-center gap-3">
                        <div
                          className={`p-2 rounded-lg ${m.type === "earning" ? "bg-green-100 text-green-600" : "bg-red-100 text-red-600"}`}
                        >
                          {m.type === "earning" ? (
                            <ArrowDownLeft size={16} />
                          ) : (
                            <ArrowUpRight size={16} />
                          )}
                        </div>
                        <div className="space-y-0.5">
                          <p className="text-sm font-bold text-slate-800 line-clamp-1">
                            {m.description}
                          </p>
                          <div className="flex items-center gap-2 text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                            <Clock size={10} />{" "}
                            {format(
                              new Date(m.created_at),
                              "dd MMM yyyy HH:mm",
                              { locale: localeId },
                            )}
                            {m.admin && <span>• By: {m.admin.full_name}</span>}
                          </div>
                        </div>
                      </div>
                      <span
                        className={`font-black text-sm whitespace-nowrap ${m.type === "earning" ? "text-green-600" : "text-red-600"}`}
                      >
                        {m.type === "earning" ? "+" : ""}
                        {m.amount}
                      </span>
                    </div>
                  ))
                )}
              </TabsContent>

              {/* TAB 2: ABSENSI */}
              <TabsContent value="absensi" className="m-0 p-4 space-y-3">
                {logs.attendance.length === 0 ? (
                  <p className="text-center text-sm font-medium text-slate-400 py-10">
                    Belum ada riwayat kehadiran.
                  </p>
                ) : (
                  logs.attendance.map((a) => (
                    <div
                      key={a.id}
                      className="flex items-center justify-between p-3 rounded-[0.8rem] border border-slate-100 hover:bg-slate-50 transition-colors"
                    >
                      <div className="flex items-center gap-3">
                        <div className="p-2 rounded-lg bg-blue-50 text-blue-600">
                          <CalendarCheck size={16} />
                        </div>
                        <div className="space-y-0.5">
                          <p className="text-sm font-bold text-slate-800">
                            {a.schedule?.title || "Sesi Tidak Diketahui"}
                          </p>
                          <div className="flex items-center gap-2 text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                            <Clock size={10} />{" "}
                            {format(
                              new Date(a.scan_time),
                              "dd MMM yyyy HH:mm",
                              { locale: localeId },
                            )}
                          </div>
                        </div>
                      </div>
                      <Badge
                        variant="outline"
                        className={`px-2.5 py-0.5 text-[9px] font-black uppercase tracking-widest shadow-none ${
                          a.status === "hadir"
                            ? "bg-green-50 text-green-700 border-green-200"
                            : a.status === "terlambat"
                              ? "bg-orange-50 text-orange-700 border-orange-200"
                              : "bg-red-50 text-red-700 border-red-200"
                        }`}
                      >
                        {a.status}
                      </Badge>
                    </div>
                  ))
                )}
              </TabsContent>

              {/* TAB 3: HADIAH / ORDERS */}
              <TabsContent value="hadiah" className="m-0 p-4 space-y-3">
                {logs.orders.length === 0 ? (
                  <p className="text-center text-sm font-medium text-slate-400 py-10">
                    Belum ada riwayat penukaran hadiah.
                  </p>
                ) : (
                  logs.orders.map((o) => (
                    <div
                      key={o.id}
                      className="flex items-center justify-between p-3 rounded-[0.8rem] border border-slate-100 hover:bg-slate-50 transition-colors"
                    >
                      <div className="flex items-center gap-3">
                        <div className="p-2 rounded-lg bg-purple-50 text-purple-600">
                          <Gift size={16} />
                        </div>
                        <div className="space-y-0.5">
                          <p className="text-sm font-bold text-slate-800 line-clamp-1">
                            {o.product?.name}
                          </p>
                          <div className="flex items-center gap-2 text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                            <Clock size={10} />{" "}
                            {format(new Date(o.created_at), "dd MMM yyyy", {
                              locale: localeId,
                            })}
                            <span className="text-orange-500 flex items-center gap-0.5 ml-1">
                              <Star size={10} fill="currentColor" />{" "}
                              {o.total_points} Pts
                            </span>
                          </div>
                        </div>
                      </div>
                      <Badge
                        variant="outline"
                        className={`px-2.5 py-0.5 text-[9px] font-black uppercase tracking-widest shadow-none ${
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
          )}
        </div>
      </Tabs>
    </AppModal>
  );
}
