/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import {
  Trash2,
  Calendar as CalendarIcon,
  User,
  Power,
  PowerOff,
  Eye,
  Pencil,
  BookOpen,
} from "lucide-react";
import {
  deleteSchedule,
  toggleAttendanceActive,
} from "@/actions/admin/schedules";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { formatInTimeZone } from "date-fns-tz";
import { ViewScheduleModal } from "./ViewScheduleModal";
import { AddScheduleModal } from "./AddScheduleModal";
import { AppButton } from "../../shared/AppButton";

// IMPORT TIPE KETAT
import type { ScheduleWithRelations } from "@/actions/admin/schedules";
import type { Class } from "@/types";

interface ScheduleTableProps {
  schedules: ScheduleWithRelations[];
  classes: Class[];
}

export function ScheduleTable({ schedules, classes }: ScheduleTableProps) {
  const [selectedSchedule, setSelectedSchedule] =
    useState<ScheduleWithRelations | null>(null);
  const [isViewOpen, setIsViewOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);

  const router = useRouter();
  const timeZone = "Asia/Jakarta";

  const handleDelete = async (id: number) => {
    if (!confirm("Hapus jadwal ini secara permanen?")) return;
    try {
      await deleteSchedule(id);
      toast.success("Jadwal berhasil dihapus");
      router.refresh();
    } catch (error: any) {
      toast.error(error.message);
    }
  };

  const handleToggleAttendance = async (id: number, currentState: boolean) => {
    try {
      await toggleAttendanceActive(id, !currentState);
      toast.success(!currentState ? "Absensi diaktifkan!" : "Absensi ditutup.");
      router.refresh();
    } catch (error: any) {
      toast.error(error.message);
    }
  };

  return (
    <>
      <div className="overflow-x-auto w-full">
        <Table>
          <TableHeader className="bg-slate-50/80 border-b border-slate-200">
            <TableRow className="border-none hover:bg-transparent">
              <TableHead className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-slate-500 w-48">
                Waktu & Tipe
              </TableHead>
              <TableHead className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-slate-500">
                Judul Agenda
              </TableHead>
              <TableHead className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-slate-500 text-center w-32">
                Absensi
              </TableHead>
              <TableHead className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-slate-500 text-center w-44">
                Aksi
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody className="bg-white">
            {schedules.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={4}
                  className="py-16 text-center text-slate-400 font-medium text-sm"
                >
                  Belum ada jadwal yang terdaftar.
                </TableCell>
              </TableRow>
            ) : (
              schedules.map((item) => {
                const formattedDate = formatInTimeZone(
                  new Date(item.event_date),
                  timeZone,
                  "dd MMM yyyy",
                );
                const targetClass = classes.find((c) => c.id === item.class_id);

                return (
                  <TableRow
                    key={item.id}
                    className="hover:bg-slate-50/50 transition-colors border-b border-slate-100 group"
                  >
                    {/* WAKTU & TIPE */}
                    <TableCell className="px-6 py-4">
                      <div className="flex flex-col items-start gap-1.5">
                        <div className="flex items-center gap-1.5 text-slate-800 font-bold text-sm">
                          <CalendarIcon size={14} className="text-orange-600" />
                          {formattedDate}
                        </div>
                        <Badge
                          className={`${
                            item.is_announcement
                              ? "bg-blue-50 text-blue-700 border-blue-200"
                              : "bg-orange-50 text-orange-700 border-orange-200"
                          } text-[9px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-md shadow-none`}
                        >
                          {item.is_announcement ? "Pengumuman" : "Materi Kelas"}
                        </Badge>
                      </div>
                    </TableCell>

                    {/* JUDUL & TARGET */}
                    <TableCell className="px-6 py-4">
                      <div className="space-y-1.5">
                        <p className="text-sm font-bold text-slate-800 line-clamp-1 group-hover:text-orange-600 transition-colors">
                          {item.title}
                        </p>
                        <div className="flex items-center gap-4 text-[10px] font-bold text-slate-500 uppercase tracking-wider">
                          <span className="flex items-center gap-1.5">
                            <BookOpen size={12} className="text-orange-500" />{" "}
                            {targetClass?.name || "Semua Kelas"}
                          </span>
                          <span className="flex items-center gap-1.5">
                            <User size={12} className="text-orange-500" />{" "}
                            {item.author?.full_name || "Admin"}
                          </span>
                        </div>
                      </div>
                    </TableCell>

                    {/* STATUS ABSENSI */}
                    <TableCell className="px-6 py-4">
                      <div className="flex flex-col items-center gap-2">
                        <Badge
                          variant="outline"
                          className={`${
                            item.is_active
                              ? "border-green-200 text-green-700 bg-green-50"
                              : "border-slate-200 text-slate-500 bg-slate-50"
                          } text-[9px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-md shadow-none whitespace-nowrap`}
                        >
                          {item.is_active ? "Sesi Dibuka" : "Sesi Ditutup"}
                        </Badge>
                        <AppButton
                          variant={item.is_active ? "red" : "default"}
                          size="icon"
                          onClick={() =>
                            handleToggleAttendance(item.id, item.is_active)
                          }
                          className="h-8 w-8 rounded-lg shadow-sm"
                          title={item.is_active ? "Tutup Absen" : "Buka Absen"}
                        >
                          {item.is_active ? (
                            <PowerOff size={14} />
                          ) : (
                            <Power size={14} />
                          )}
                        </AppButton>
                      </div>
                    </TableCell>

                    {/* AKSI */}
                    <TableCell className="px-6 py-4 text-center">
                      <div className="flex justify-center gap-2">
                        <AppButton
                          variant="secondary"
                          size="icon"
                          className="h-8 w-8 text-slate-600 border border-slate-200 bg-white hover:text-orange-600 hover:border-orange-200"
                          onClick={() => {
                            setSelectedSchedule(item);
                            setIsViewOpen(true);
                          }}
                          title="Lihat Detail"
                        >
                          <Eye size={14} />
                        </AppButton>
                        <AppButton
                          variant="secondary"
                          size="icon"
                          className="h-8 w-8 text-slate-600 border border-slate-200 bg-white hover:text-orange-600 hover:border-orange-200"
                          onClick={() => {
                            setSelectedSchedule(item);
                            setIsEditOpen(true);
                          }}
                          title="Edit Jadwal"
                        >
                          <Pencil size={14} />
                        </AppButton>
                        <AppButton
                          variant="secondary"
                          size="icon"
                          className="h-8 w-8 text-red-600 border border-slate-200 bg-white hover:text-red-700 hover:bg-red-50 hover:border-red-200"
                          onClick={() => handleDelete(item.id)}
                          title="Hapus Jadwal"
                        >
                          <Trash2 size={14} />
                        </AppButton>
                      </div>
                    </TableCell>
                  </TableRow>
                );
              })
            )}
          </TableBody>
        </Table>
      </div>

      <ViewScheduleModal
        isOpen={isViewOpen}
        onClose={() => {
          setIsViewOpen(false);
          setSelectedSchedule(null);
        }}
        schedule={selectedSchedule}
      />
      <AddScheduleModal
        isOpen={isEditOpen}
        onClose={() => {
          setIsEditOpen(false);
          setSelectedSchedule(null);
        }}
        classes={classes}
        initialData={selectedSchedule}
      />
    </>
  );
}
