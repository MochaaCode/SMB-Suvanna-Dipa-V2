/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useState, useMemo, useEffect } from "react";
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
  ShieldAlert,
  RotateCcw,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import {
  deleteSchedule,
  toggleAttendanceActive,
  restoreSchedule,
  hardDeleteSchedule,
} from "@/actions/admin/schedules";
import toast from "react-hot-toast";
import { formatInTimeZone } from "date-fns-tz";
import { ViewScheduleModal } from "./ViewScheduleModal";
import { AddScheduleModal } from "./AddScheduleModal";
import { AppButton } from "../../shared/AppButton";
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogCancel,
  AlertDialogAction,
} from "@/components/ui/alert-dialog";

import type { ScheduleWithRelations } from "@/actions/admin/schedules";
import type { Class } from "@/types";

interface ScheduleTableProps {
  schedules: ScheduleWithRelations[];
  classes: Class[];
  isTrashMode?: boolean;
}

export function ScheduleTable({
  schedules,
  classes,
  isTrashMode = false,
}: ScheduleTableProps) {
  const [selectedSchedule, setSelectedSchedule] =
    useState<ScheduleWithRelations | null>(null);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isViewOpen, setIsViewOpen] = useState(false);

  const [confirmDialog, setConfirmDialog] = useState<{
    isOpen: boolean;
    type: "delete" | "hard-delete" | "restore" | null;
    id: number | null;
  }>({ isOpen: false, type: null, id: null });
  const [isPending, setIsPending] = useState(false);

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const totalPages = useMemo(
    () => Math.max(1, Math.ceil(schedules.length / itemsPerPage)),
    [schedules.length],
  );
  const paginatedSchedules = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    return schedules.slice(startIndex, startIndex + itemsPerPage);
  }, [schedules, currentPage]);

  useEffect(() => {
    setCurrentPage(1);
  }, [schedules, isTrashMode]);

  const handleToggleActive = async (id: number, currentStatus: boolean) => {
    const tid = toast.loading("Memperbarui status sesi...");
    try {
      await toggleAttendanceActive(id, !currentStatus);
      toast.success(
        `Sesi berhasil ${!currentStatus ? "diaktifkan" : "dinonaktifkan"}!`,
        { id: tid },
      );
    } catch (error: any) {
      toast.error(error.message, { id: tid });
    }
  };

  const executeAction = async () => {
    if (!confirmDialog.id || !confirmDialog.type) return;
    setIsPending(true);
    const tid = toast.loading("Memproses aksi...");
    try {
      if (confirmDialog.type === "delete") {
        await deleteSchedule(confirmDialog.id);
        toast.success("Jadwal dipindahkan ke tempat sampah.", { id: tid });
      } else if (confirmDialog.type === "restore") {
        await restoreSchedule(confirmDialog.id);
        toast.success("Jadwal berhasil dipulihkan.", { id: tid });
      } else if (confirmDialog.type === "hard-delete") {
        await hardDeleteSchedule(confirmDialog.id);
        toast.success("Jadwal dihapus permanen.", { id: tid });
      }
      setConfirmDialog({ isOpen: false, type: null, id: null });
    } catch (error: any) {
      toast.error(error.message, { id: tid });
    } finally {
      setIsPending(false);
    }
  };

  return (
    <div className="w-full flex flex-col h-full rounded-[1rem]">
      <div className="overflow-x-auto">
        <Table>
          <TableHeader
            className={isTrashMode ? "bg-red-50" : "bg-orange-50/50"}
          >
            <TableRow className="border-slate-200">
              <TableHead className="w-48 text-xs font-bold uppercase tracking-wider text-slate-500 py-4">
                Tanggal & Waktu
              </TableHead>
              <TableHead className="text-xs font-bold uppercase tracking-wider text-slate-500 py-4">
                Informasi Kegiatan
              </TableHead>
              <TableHead className="text-center text-xs font-bold uppercase tracking-wider text-slate-500 py-4">
                Target Kelas
              </TableHead>
              <TableHead className="text-center text-xs font-bold uppercase tracking-wider text-slate-500 py-4">
                Status Sesi
              </TableHead>
              <TableHead className="w-44 text-center text-xs font-bold uppercase tracking-wider text-slate-500 py-4">
                Aksi
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {paginatedSchedules.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={5}
                  className="h-32 text-center text-slate-400 font-medium text-sm"
                >
                  Belum ada data jadwal.
                </TableCell>
              </TableRow>
            ) : (
              paginatedSchedules.map((item) => {
                const isAnnouncement = item.is_announcement;
                const formattedDate = formatInTimeZone(
                  new Date(item.event_date),
                  "Asia/Jakarta",
                  "dd MMM yyyy",
                );

                // SAFE GUARD: Cek apakah start_time dan end_time ada datanya sebelum di-substring
                const formattedStart = item.start_time
                  ? String(item.start_time).substring(0, 5)
                  : "09:00";
                const formattedEnd = item.end_time
                  ? String(item.end_time).substring(0, 5)
                  : "11:00";

                return (
                  <TableRow
                    key={item.id}
                    className={`group transition-colors border-b border-slate-100 ${isAnnouncement ? "bg-blue-50/20 hover:bg-blue-50/50" : "hover:bg-slate-50/50"}`}
                  >
                    <TableCell className="align-top">
                      <div className="flex items-center gap-2 mb-1.5">
                        <CalendarIcon
                          size={14}
                          className={
                            isAnnouncement ? "text-blue-500" : "text-orange-500"
                          }
                        />
                        <span className="text-sm font-bold text-slate-800">
                          {formattedDate}
                        </span>
                      </div>
                      <div className="text-[11px] font-medium text-slate-500 bg-slate-100/50 inline-block px-2 py-0.5 rounded-md border border-slate-200">
                        {formattedStart} - {formattedEnd} WIB
                      </div>
                    </TableCell>

                    <TableCell className="align-top">
                      <div className="space-y-1.5">
                        <div className="flex items-center gap-2">
                          <span
                            className={`text-[9px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-md ${isAnnouncement ? "bg-blue-100 text-blue-700" : "bg-orange-100 text-orange-700"}`}
                          >
                            {isAnnouncement ? "Pengumuman" : "Materi Belajar"}
                          </span>
                          <span className="text-[10px] text-slate-400 font-medium flex items-center gap-1">
                            <User size={10} />{" "}
                            {item.author?.full_name || "Admin"}
                          </span>
                        </div>
                        <p
                          className={`text-sm font-bold leading-tight ${isAnnouncement ? "text-blue-900" : "text-slate-800"}`}
                        >
                          {item.title}
                        </p>
                      </div>
                    </TableCell>

                    <TableCell className="align-middle text-center">
                      {item.class ? (
                        <Badge className="bg-slate-100 text-slate-700 hover:bg-slate-200 border-slate-200 rounded-[1rem] shadow-none font-bold text-[10px] px-2.5">
                          Kelas {item.class.name}
                        </Badge>
                      ) : (
                        <Badge
                          variant="outline"
                          className="text-slate-400 border-dashed rounded-[1rem] font-bold text-[10px]"
                        >
                          Semua Kelas
                        </Badge>
                      )}
                    </TableCell>

                    <TableCell className="align-middle text-center">
                      {item.is_active ? (
                        <div
                          className="inline-flex flex-col items-center gap-1 p-2 rounded-[1rem] bg-green-50 border border-green-100 text-green-700 w-24 cursor-pointer hover:bg-green-100 transition-colors"
                          onClick={() =>
                            !isTrashMode &&
                            handleToggleActive(item.id, item.is_active)
                          }
                        >
                          <Power size={14} />
                          <span className="text-[9px] font-bold uppercase tracking-wider">
                            Sesi Aktif
                          </span>
                        </div>
                      ) : (
                        <div
                          className="inline-flex flex-col items-center gap-1 p-2 rounded-[1rem] bg-slate-50 border border-slate-200 text-slate-400 w-24 cursor-pointer hover:bg-slate-100 transition-colors"
                          onClick={() =>
                            !isTrashMode &&
                            handleToggleActive(item.id, item.is_active)
                          }
                        >
                          <PowerOff size={14} />
                          <span className="text-[9px] font-bold uppercase tracking-wider">
                            Sesi Ditutup
                          </span>
                        </div>
                      )}
                    </TableCell>

                    <TableCell className="align-middle">
                      <div className="flex justify-center gap-2">
                        {!isTrashMode ? (
                          <>
                            <AppButton
                              variant="secondary"
                              size="icon"
                              className="h-8 w-8 text-slate-600 border border-slate-200 bg-white hover:text-slate-900 hover:bg-slate-100 rounded-[1rem]"
                              onClick={() => {
                                setSelectedSchedule(item);
                                setIsViewOpen(true);
                              }}
                              title="Lihat Materi"
                            >
                              <Eye size={14} />
                            </AppButton>
                            <AppButton
                              variant="secondary"
                              size="icon"
                              className="h-8 w-8 text-orange-600 border border-slate-200 bg-white hover:text-orange-700 hover:bg-orange-50 hover:border-orange-200 rounded-[1rem]"
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
                              className="h-8 w-8 text-red-600 border border-slate-200 bg-white hover:text-red-700 hover:bg-red-50 hover:border-red-200 rounded-[1rem]"
                              onClick={() =>
                                setConfirmDialog({
                                  isOpen: true,
                                  type: "delete",
                                  id: item.id,
                                })
                              }
                              title="Hapus Jadwal"
                            >
                              <Trash2 size={14} />
                            </AppButton>
                          </>
                        ) : (
                          <div className="flex gap-2">
                            <AppButton
                              variant="secondary"
                              className="h-8 px-3 text-xs bg-white border border-slate-200 text-slate-700 hover:bg-slate-50 rounded-[1rem]"
                              onClick={() =>
                                setConfirmDialog({
                                  isOpen: true,
                                  type: "restore",
                                  id: item.id,
                                })
                              }
                              leftIcon={<RotateCcw size={14} />}
                            >
                              Pulihkan
                            </AppButton>
                            <AppButton
                              variant="red"
                              className="h-8 px-3 text-xs rounded-[1rem]"
                              onClick={() =>
                                setConfirmDialog({
                                  isOpen: true,
                                  type: "hard-delete",
                                  id: item.id,
                                })
                              }
                              leftIcon={<ShieldAlert size={14} />}
                            >
                              Hapus
                            </AppButton>
                          </div>
                        )}
                      </div>
                    </TableCell>
                  </TableRow>
                );
              })
            )}
          </TableBody>
        </Table>
      </div>

      <div className="flex items-center justify-between px-6 py-4 bg-slate-50 border-t border-slate-200 mt-auto rounded-b-[1rem]">
        <p className="text-xs font-medium text-slate-500">
          Menampilkan{" "}
          <span className="font-bold text-slate-900">
            {schedules.length === 0 ? 0 : (currentPage - 1) * itemsPerPage + 1}-
            {Math.min(currentPage * itemsPerPage, schedules.length)}
          </span>{" "}
          dari {schedules.length} data
        </p>
        <div className="flex gap-2">
          <AppButton
            variant="outline"
            className="h-8 w-8 p-0 rounded-[1rem]"
            onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
            disabled={currentPage === 1}
          >
            <ChevronLeft size={16} />
          </AppButton>
          <AppButton
            variant="outline"
            className="h-8 w-8 p-0 rounded-[1rem]"
            onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
            disabled={currentPage === totalPages || totalPages === 0}
          >
            <ChevronRight size={16} />
          </AppButton>
        </div>
      </div>

      <AlertDialog
        open={confirmDialog.isOpen}
        onOpenChange={(open) =>
          !open && setConfirmDialog({ isOpen: false, type: null, id: null })
        }
      >
        <AlertDialogContent className="rounded-[1rem] p-8 border-slate-200 shadow-xl max-w-md">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-xl font-bold text-slate-800">
              {confirmDialog.type === "hard-delete"
                ? "Hapus Permanen?"
                : confirmDialog.type === "restore"
                  ? "Pulihkan Jadwal?"
                  : "Konfirmasi Hapus"}
            </AlertDialogTitle>
            <AlertDialogDescription className="text-sm font-medium text-slate-600 mt-2 leading-relaxed">
              {confirmDialog.type === "hard-delete" &&
                "Data jadwal beserta log absensi yang terkait akan dihapus permanen dari database. Aksi ini tidak dapat dibatalkan."}
              {confirmDialog.type === "restore" &&
                "Jadwal akan diaktifkan kembali dan muncul di daftar agenda siswa."}
              {confirmDialog.type === "delete" &&
                "Pindahkan jadwal ini ke tempat sampah sementara?"}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter className="mt-6">
            <AlertDialogCancel asChild>
              <AppButton
                variant="outline"
                onClick={() =>
                  setConfirmDialog({ isOpen: false, type: null, id: null })
                }
                disabled={isPending}
                className="h-10 text-xs rounded-[1rem]"
              >
                Batal
              </AppButton>
            </AlertDialogCancel>
            <AlertDialogAction asChild>
              <AppButton
                variant={confirmDialog.type === "restore" ? "default" : "red"}
                onClick={executeAction}
                isLoading={isPending}
                className="h-10 text-xs rounded-[1rem]"
              >
                Ya, Eksekusi
              </AppButton>
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

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
    </div>
  );
}
