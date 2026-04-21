"use client";

import { useState } from "react";
import { AppModal } from "@/components/shared/AppModal";
import { AppButton } from "@/components/shared/AppButton";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import toast from "react-hot-toast";
import { bulkGivePointsAction } from "@/actions/teacher/points";

interface StudentData {
  id: string;
  full_name: string | null;
}

interface BulkGivePointsModalProps {
  isOpen: boolean;
  onClose: () => void;
  students: StudentData[];
}

export function BulkGivePointsModal({
  isOpen,
  onClose,
  students,
}: BulkGivePointsModalProps) {
  const [loading, setLoading] = useState(false);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [amount, setAmount] = useState(10);

  const toggleStudent = (id: string) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id],
    );
  };

  const handleSelectAll = (e: React.MouseEvent) => {
    e.preventDefault();
    setSelectedIds((prev) =>
      prev.length === students.length ? [] : students.map((s) => s.id),
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (selectedIds.length === 0)
      return toast.error("Pilih minimal satu siswa!");

    setLoading(true);
    const result = await bulkGivePointsAction(
      selectedIds,
      amount,
      "Apresiasi partisipasi kelas",
    );

    if (result.success) {
      toast.success(result.message || "Poin berhasil dibagikan!");
      setSelectedIds([]);
      onClose();
    } else {
      toast.error(result.error || "Gagal membagikan poin.");
    }
    setLoading(false);
  };

  return (
    <AppModal
      isOpen={isOpen}
      onClose={onClose}
      title="Bagi Poin Kelas"
      description="Pilih siswa yang aktif dan berikan poin apresiasi sekaligus."
      variant="orange"
    >
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <Label className="text-xs font-bold text-slate-500 uppercase">
              Daftar Siswa
            </Label>
            <button
              type="button"
              onClick={handleSelectAll}
              className="text-[10px] font-bold text-orange-600 hover:bg-orange-50 px-2 py-1 rounded-md transition-colors"
            >
              {selectedIds.length === students.length
                ? "Batal Semua"
                : "Pilih Semua"}
            </button>
          </div>

          <div className="h-64 overflow-y-auto custom-scrollbar border border-slate-100 rounded-xl p-2 bg-slate-50/30">
            <div className="space-y-1">
              {students.map((s) => (
                <div
                  key={s.id}
                  onClick={() => toggleStudent(s.id)}
                  className="flex items-center gap-3 p-3 hover:bg-white rounded-lg cursor-pointer transition-colors border border-transparent hover:border-slate-100"
                >
                  {/* FIX: Menggunakan checkbox native HTML yang 100x lebih ringan dari Shadcn */}
                  <input
                    type="checkbox"
                    checked={selectedIds.includes(s.id)}
                    readOnly // Supaya React gak ngomel minta onChange
                    className="w-4 h-4 rounded border-slate-300 text-orange-600 focus:ring-orange-500 pointer-events-none"
                  />
                  <span className="text-sm font-semibold text-slate-700">
                    {s.full_name}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="space-y-2">
          <Label className="text-xs font-bold text-slate-500 uppercase">
            Jumlah Poin per Anak
          </Label>
          <Input
            type="number"
            value={amount}
            onChange={(e) => setAmount(Number(e.target.value))}
            className="h-11 font-bold text-lg text-orange-600 focus-visible:ring-orange-500"
          />
        </div>

        <AppButton type="submit" isLoading={loading} className="w-full h-11">
          Bagikan {amount * selectedIds.length} Poin Total
        </AppButton>
      </form>
    </AppModal>
  );
}
