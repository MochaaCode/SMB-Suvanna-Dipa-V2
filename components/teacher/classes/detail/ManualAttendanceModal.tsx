"use client";

import { useState } from "react";
import { AppModal } from "@/components/shared/AppModal";
import { AppButton } from "@/components/shared/AppButton";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import toast from "react-hot-toast";
import { recordManualAttendance } from "@/actions/teacher/attendance";

interface StudentData {
  id: string;
  full_name: string | null;
}

interface ManualAttendanceModalProps {
  isOpen: boolean;
  onClose: () => void;
  students: StudentData[];
}

export function ManualAttendanceModal({
  isOpen,
  onClose,
  students,
}: ManualAttendanceModalProps) {
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);

    const formData = new FormData(e.currentTarget);
    const profileId = formData.get("profile_id") as string;
    const status = formData.get("status") as string;

    if (!profileId || !status) {
      toast.error("Pilih siswa dan status kehadiran!");
      setLoading(false);
      return;
    }

    const tid = toast.loading("Mencatat absensi...");
    const result = await recordManualAttendance(profileId, status);

    if (result.success) {
      toast.success(result.message, { id: tid });
      onClose(); // Tutup modal jika sukses
    } else {
      toast.error(result.error || "Gagal mencatat absensi", { id: tid });
    }

    setLoading(false);
  };

  return (
    <AppModal
      isOpen={isOpen}
      onClose={onClose}
      title="Absensi Manual"
      description="Pilih siswa dan catat kehadiran secara manual tanpa kartu RFID."
      variant="orange"
    >
      <form onSubmit={handleSubmit} className="space-y-5 pt-2">
        <div className="space-y-2">
          <Label className="text-xs font-bold text-slate-500 uppercase tracking-wider">
            Pilih Siswa
          </Label>
          <Select name="profile_id" required>
            <SelectTrigger className="h-11 border-slate-200 bg-white font-medium focus:ring-orange-500">
              <SelectValue placeholder="Cari atau pilih siswa..." />
            </SelectTrigger>
            <SelectContent className="max-h-64">
              {students.map((student) => (
                <SelectItem key={student.id} value={student.id}>
                  {student.full_name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label className="text-xs font-bold text-slate-500 uppercase tracking-wider">
            Status Kehadiran
          </Label>
          <Select name="status" required defaultValue="hadir">
            <SelectTrigger className="h-11 border-slate-200 bg-white font-medium focus:ring-orange-500">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="hadir">Hadir (Tepat Waktu)</SelectItem>
              <SelectItem value="terlambat">Terlambat</SelectItem>
              <SelectItem value="izin">Izin / Sakit</SelectItem>
              <SelectItem value="alpa">Alpa (Tanpa Keterangan)</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <AppButton
          type="submit"
          isLoading={loading}
          className="w-full h-11 mt-4"
        >
          Simpan Kehadiran
        </AppButton>
      </form>
    </AppModal>
  );
}
