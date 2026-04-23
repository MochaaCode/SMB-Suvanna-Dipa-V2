/* eslint-disable @typescript-eslint/no-explicit-any */
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
import { recordManualAttendance } from "@/actions/pembina/attendance";
import { ClipboardCheck } from "lucide-react";

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
    try {
      const result = await recordManualAttendance(profileId, status);

      // FIX BUILD ERROR: Gunakan operator || untuk memberikan fallback string jika message undefined
      if (result.success) {
        toast.success(result.message || "Presensi berhasil dicatat!", {
          id: tid,
        });
        onClose();
      } else {
        toast.error(result.error || "Gagal mencatat absensi", { id: tid });
      }
    } catch (error: any) {
      toast.error(error.message || "Terjadi kesalahan sistem", { id: tid });
    } finally {
      setLoading(false);
    }
  };

  return (
    <AppModal
      isOpen={isOpen}
      onClose={onClose}
      title="Presensi Manual"
      description="Catat kehadiran siswa secara langsung tanpa pemindaian kartu RFID."
      variant="orange"
    >
      <form onSubmit={handleSubmit} className="space-y-6 pt-4 text-left">
        <div className="space-y-2">
          <Label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
            Identitas Siswa
          </Label>
          <Select name="profile_id" required>
            <SelectTrigger className="h-12 border-slate-200 bg-white rounded-[1rem] font-bold focus:ring-orange-500 shadow-sm">
              <SelectValue placeholder="Klik untuk mencari siswa..." />
            </SelectTrigger>
            <SelectContent className="max-h-64 rounded-[1rem]">
              {students.map((student) => (
                <SelectItem
                  key={student.id}
                  value={student.id}
                  className="font-bold py-3"
                >
                  {student.full_name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
            Status Presensi Hari Ini
          </Label>
          <Select name="status" required defaultValue="hadir">
            <SelectTrigger className="h-12 border-slate-200 bg-white rounded-[1rem] font-bold focus:ring-orange-500 shadow-sm">
              <SelectValue />
            </SelectTrigger>
            <SelectContent className="rounded-[1rem]">
              <SelectItem
                value="hadir"
                className="font-bold py-3 text-green-600"
              >
                Hadir (Tepat Waktu)
              </SelectItem>
              <SelectItem
                value="terlambat"
                className="font-bold py-3 text-orange-600"
              >
                Hadir (Terlambat)
              </SelectItem>
              <SelectItem value="izin" className="font-bold py-3 text-blue-600">
                Izin / Sakit
              </SelectItem>
              <SelectItem value="alpa" className="font-bold py-3 text-red-600">
                Alpa (Tanpa Kabar)
              </SelectItem>
            </SelectContent>
          </Select>
        </div>

        <AppButton
          type="submit"
          isLoading={loading}
          className="w-full h-12 mt-4 rounded-[1rem] font-black text-xs uppercase tracking-widest shadow-lg shadow-orange-100"
          leftIcon={<ClipboardCheck size={18} />}
        >
          Simpan Data Presensi
        </AppButton>
      </form>
    </AppModal>
  );
}
