/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useEffect, useState, useTransition } from "react";
import { createClient } from "@/lib/supabase/client";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Fingerprint, Monitor, Pencil, Save, User } from "lucide-react";
import { format } from "date-fns";
import { id as localeId } from "date-fns/locale";
import toast from "react-hot-toast";

import { AppButton } from "../../shared/AppButton";
import { AppModal } from "../../shared/AppModal";
import { recordManualAttendance } from "@/actions/admin/attendance";

import type { AttendanceLogWithProfile, AttendanceStatus } from "@/types";

interface AttendanceTableProps {
  initialLogs: AttendanceLogWithProfile[];
  scheduleId: number;
}

export default function AttendanceTable({
  initialLogs,
  scheduleId,
}: AttendanceTableProps) {
  const [logs, setLogs] = useState<AttendanceLogWithProfile[]>(initialLogs);
  const supabase = createClient();

  const [isPending, startTransition] = useTransition();
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [selectedLog, setSelectedLog] =
    useState<AttendanceLogWithProfile | null>(null);
  const [editForm, setEditForm] = useState({
    status: "hadir" as AttendanceStatus,
    notes: "",
  });

  useEffect(() => {
    const channel = supabase
      .channel("live-attendance")
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "attendance_logs",
          filter: `schedule_id=eq.${scheduleId}`,
        },
        async (payload) => {
          const newRecord = payload.new as { id?: number };

          if (!newRecord || !newRecord.id) return;

          const { data: newData } = await supabase
            .from("attendance_logs")
            .select("*, profiles:profile_id(full_name, role)")
            .eq("id", newRecord.id)
            .single();

          if (newData) {
            setLogs((currentLogs) => {
              const existingIndex = currentLogs.findIndex(
                (l) => l.id === newData.id,
              );
              if (existingIndex !== -1) {
                const updatedLogs = [...currentLogs];
                updatedLogs[existingIndex] = newData as any;
                return updatedLogs;
              } else {
                return [newData as any, ...currentLogs];
              }
            });
          }
        },
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [scheduleId, supabase]);

  const handleOpenEdit = (log: AttendanceLogWithProfile) => {
    setSelectedLog(log);
    setEditForm({
      status: log.status,
      notes: log.notes || "",
    });
    setIsEditOpen(true);
  };

  const handleEditSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedLog) return;

    startTransition(async () => {
      const tid = toast.loading("Memproses revisi...");
      try {
        await recordManualAttendance({
          scheduleId,
          profileId: selectedLog.profile_id!,
          status: editForm.status,
          notes: editForm.notes || "Direvisi oleh Administrator",
        });
        toast.success("Log kehadiran berhasil diperbarui!", { id: tid });
        setIsEditOpen(false);
      } catch (error: any) {
        toast.error(error.message, { id: tid });
      }
    });
  };

  return (
    <div className="w-full flex flex-col rounded-[1rem]">
      <div className="overflow-x-auto max-h-125 custom-scrollbar">
        <Table className="min-w-[700px]">
          <TableHeader className="bg-slate-50/50 sticky top-0 z-10 backdrop-blur-sm">
            <TableRow className="border-slate-200">
              <TableHead className="w-56 text-xs font-bold uppercase tracking-wider text-slate-500 py-4 px-6">
                Siswa
              </TableHead>
              <TableHead className="text-xs font-bold uppercase tracking-wider text-slate-500 py-4 px-6 text-center">
                Waktu Scan
              </TableHead>
              <TableHead className="text-center text-xs font-bold uppercase tracking-wider text-slate-500 py-4 px-6">
                Status
              </TableHead>
              <TableHead className="text-center text-xs font-bold uppercase tracking-wider text-slate-500 py-4 px-6">
                Metode
              </TableHead>
              <TableHead className="w-24 text-center text-xs font-bold uppercase tracking-wider text-slate-500 py-4 px-6">
                Aksi Cepat
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {logs.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={5}
                  className="h-40 text-center text-slate-400 font-medium text-sm"
                >
                  Belum ada log kehadiran.
                </TableCell>
              </TableRow>
            ) : (
              logs.map((log) => (
                <TableRow
                  key={log.id}
                  className="group hover:bg-slate-50/50 transition-colors border-b border-slate-100"
                >
                  <TableCell className="px-6 py-4">
                    <p className="text-sm font-bold text-slate-800 truncate mb-1">
                      {log.profiles?.full_name || "Siswa Tidak Ditemukan"}
                    </p>
                    <div className="flex items-center gap-1.5 text-[10px] font-bold text-slate-500 uppercase tracking-wider">
                      <User size={12} className="text-slate-400" />{" "}
                      {log.profiles?.role || "Siswa"}
                    </div>
                  </TableCell>

                  <TableCell className="px-6 py-4 text-center">
                    <div className="flex flex-col items-center">
                      <span className="text-sm font-bold text-slate-700">
                        {format(new Date(log.scan_time), "HH:mm")}
                      </span>
                      <span className="text-[10px] font-medium text-slate-400 mt-0.5">
                        {format(new Date(log.scan_time), "dd MMM yyyy", {
                          locale: localeId,
                        })}
                      </span>
                    </div>
                  </TableCell>

                  <TableCell className="px-6 py-4 text-center">
                    <Badge
                      className={`
                        ${log.status === "hadir" ? "bg-green-50 text-green-700 border-green-200" : ""}
                        ${log.status === "terlambat" ? "bg-orange-50 text-orange-700 border-orange-200" : ""}
                        ${log.status === "alpa" ? "bg-red-50 text-red-700 border-red-200" : ""}
                        ${log.status === "izin" ? "bg-blue-50 text-blue-700 border-blue-200" : ""}
                        px-2.5 py-0.5 rounded-[1rem] text-[10px] font-bold uppercase tracking-wider shadow-none border
                      `}
                    >
                      {log.status}
                    </Badge>
                  </TableCell>

                  <TableCell className="px-6 py-4 text-center">
                    <div className="flex justify-center items-center gap-1.5 text-[10px] font-bold text-slate-500 uppercase tracking-wider">
                      {log.method === "rfid" ? (
                        <>
                          <Fingerprint size={14} className="text-orange-500" />{" "}
                          RFID
                        </>
                      ) : (
                        <>
                          <Monitor size={14} className="text-blue-500" /> Manual
                        </>
                      )}
                    </div>
                  </TableCell>

                  <TableCell className="px-6 py-4 text-center">
                    <AppButton
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 text-blue-600 hover:text-blue-700 hover:bg-blue-50 rounded-[1rem] mx-auto opacity-0 group-hover:opacity-100 transition-all"
                      onClick={() => handleOpenEdit(log)}
                      title="Revisi"
                    >
                      <Pencil size={14} />
                    </AppButton>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      <AppModal
        isOpen={isEditOpen}
        onClose={() => setIsEditOpen(false)}
        title="Revisi Kehadiran"
        description="Poin siswa akan dikalkulasi ulang secara otomatis setelah status diperbarui."
        variant="orange"
        maxWidth="md"
      >
        <form onSubmit={handleEditSubmit} className="space-y-5 text-left mt-2">
          <div className="space-y-2">
            <Label className="text-xs font-bold text-slate-500 uppercase tracking-wider">
              Siswa
            </Label>
            <Input
              disabled
              value={selectedLog?.profiles?.full_name || ""}
              className="h-11 rounded-[1rem] border-slate-200 bg-slate-100 font-bold"
            />
          </div>

          <div className="space-y-2">
            <Label className="text-xs font-bold text-slate-500 uppercase tracking-wider">
              Status Kehadiran
            </Label>
            <Select
              value={editForm.status}
              onValueChange={(val: AttendanceStatus) =>
                setEditForm({ ...editForm, status: val })
              }
            >
              <SelectTrigger className="h-11 rounded-[1rem] border-slate-200 bg-white font-medium focus:ring-orange-500">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="hadir">Hadir (Tepat Waktu)</SelectItem>
                <SelectItem value="terlambat">Hadir (Terlambat)</SelectItem>
                <SelectItem value="izin">Izin / Sakit</SelectItem>
                <SelectItem value="alpa">Tanpa Keterangan (Alpa)</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label className="text-xs font-bold text-slate-500 uppercase tracking-wider">
              Alasan Revisi (Opsional)
            </Label>
            <Input
              value={editForm.notes}
              onChange={(e) =>
                setEditForm({ ...editForm, notes: e.target.value })
              }
              placeholder="Contoh: Admin salah input sebelumnya"
              className="h-11 rounded-[1rem] border-slate-200 bg-slate-50 font-medium focus-visible:ring-orange-500"
            />
          </div>

          <div className="pt-4 mt-6">
            <AppButton
              type="submit"
              isLoading={isPending}
              className="w-full h-11 rounded-[1rem] font-bold"
              leftIcon={<Save size={18} />}
            >
              Simpan Perubahan
            </AppButton>
          </div>
        </form>
      </AppModal>
    </div>
  );
}
