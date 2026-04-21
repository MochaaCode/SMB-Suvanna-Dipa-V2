/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useState, useTransition } from "react";
import { AppModal } from "../../shared/AppModal";
import { AppButton } from "../../shared/AppButton";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { recordManualAttendance } from "@/actions/admin/attendance";
import toast from "react-hot-toast";
import { CheckCircle2 } from "lucide-react";

import type { Profile, AttendanceStatus } from "@/types";

interface ManualAttendanceModalProps {
  isOpen: boolean;
  onClose: () => void;
  scheduleId: number;
  eligibleStudents: Profile[];
}

export default function ManualAttendanceModal({
  isOpen,
  onClose,
  scheduleId,
  eligibleStudents,
}: ManualAttendanceModalProps) {
  const [isPending, startTransition] = useTransition();
  const [formData, setFormData] = useState({
    profileId: "",
    status: "hadir" as AttendanceStatus,
    notes: "",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.profileId) return toast.error("Silakan pilih siswa!");

    startTransition(async () => {
      const tid = toast.loading("Menyimpan presensi manual...");
      try {
        await recordManualAttendance({
          scheduleId,
          profileId: formData.profileId,
          status: formData.status,
          notes: formData.notes || "Dicatat manual oleh Administrator",
        });
        toast.success("Presensi berhasil disimpan!", { id: tid });

        setFormData({ profileId: "", status: "hadir", notes: "" });
        onClose();
      } catch (error: any) {
        toast.error(error.message, { id: tid });
      }
    });
  };

  return (
    <AppModal
      isOpen={isOpen}
      onClose={onClose}
      title="Presensi Manual"
      description="Gunakan fitur ini jika mesin RFID bermasalah atau kartu siswa tertinggal."
      variant="orange"
      maxWidth="md"
    >
      <form onSubmit={handleSubmit} className="space-y-5 text-left mt-2">
        <div className="space-y-2">
          <Label className="text-xs font-bold text-slate-500 uppercase tracking-wider">
            Pilih Siswa
          </Label>
          <Select
            value={formData.profileId}
            onValueChange={(val) =>
              setFormData({ ...formData, profileId: val })
            }
          >
            <SelectTrigger className="h-11 rounded-[1rem] border-slate-200 bg-white font-medium focus:ring-orange-500">
              <SelectValue placeholder="Cari / Pilih Nama Siswa..." />
            </SelectTrigger>
            <SelectContent className="max-h-60">
              {eligibleStudents.length === 0 ? (
                <SelectItem value="none" disabled>
                  Tidak ada siswa di kelas ini
                </SelectItem>
              ) : (
                eligibleStudents.map((s) => (
                  <SelectItem key={s.id} value={s.id}>
                    {s.full_name}
                  </SelectItem>
                ))
              )}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label className="text-xs font-bold text-slate-500 uppercase tracking-wider">
            Status Kehadiran
          </Label>
          <Select
            value={formData.status}
            onValueChange={(val: AttendanceStatus) =>
              setFormData({ ...formData, status: val })
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
            Catatan Tambahan (Opsional)
          </Label>
          <Input
            value={formData.notes}
            onChange={(e) =>
              setFormData({ ...formData, notes: e.target.value })
            }
            placeholder="Contoh: Lupa bawa kartu RFID"
            className="h-11 rounded-[1rem] border-slate-200 bg-slate-50 font-medium focus-visible:ring-orange-500"
          />
        </div>

        <div className="pt-4 mt-6">
          <AppButton
            type="submit"
            isLoading={isPending}
            className="w-full h-11 rounded-[1rem] font-bold"
            leftIcon={<CheckCircle2 size={18} />}
          >
            Simpan Presensi Manual
          </AppButton>
        </div>
      </form>
    </AppModal>
  );
}
