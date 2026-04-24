/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useState } from "react";
import { AppModal } from "@/components/shared/AppModal";
import { AppButton } from "@/components/shared/AppButton";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import toast from "react-hot-toast";
import { bulkGivePointsAction } from "@/actions/pembina/my-class";
import type { Profile } from "@/types";

interface BulkGivePointsModalProps {
  isOpen: boolean;
  onClose: () => void;
  students: Profile[];
}

export function BulkGivePointsModal({
  isOpen,
  onClose,
  students,
}: BulkGivePointsModalProps) {
  const [loading, setLoading] = useState(false);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [amount, setAmount] = useState(10);
  const [reason, setReason] = useState("");

  const toggleStudent = (id: string) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id],
    );
  };

  const handleSelectAll = (e: React.MouseEvent) => {
    e.preventDefault();
    if (selectedIds.length === students.length) {
      setSelectedIds([]);
    } else {
      setSelectedIds(students.map((s) => s.id));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (selectedIds.length === 0) return toast.error("Pilih minimal 1 siswa.");
    if (!reason) return toast.error("Mohon isi alasan pemberian poin.");

    setLoading(true);
    try {
      await bulkGivePointsAction(selectedIds, amount, reason);
      toast.success(`Berhasil membagikan ${amount} poin!`);
      setSelectedIds([]);
      setReason("");
      onClose();
    } catch (err: any) {
      toast.error(err.message || "Gagal memberikan poin");
    } finally {
      setLoading(false);
    }
  };

  return (
    <AppModal
      isOpen={isOpen}
      onClose={onClose}
      title="Bagi Poin Reward"
      variant="orange"
    >
      <form onSubmit={handleSubmit} className="space-y-4 pt-4">
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <Label className="text-[10px] font-black uppercase text-slate-400">
              Pilih Siswa
            </Label>
            <button
              type="button"
              onClick={handleSelectAll}
              className="text-[10px] font-black text-orange-600 hover:text-orange-700 uppercase"
            >
              {selectedIds.length === students.length
                ? "Batal Pilih Semua"
                : "Pilih Semua"}
            </button>
          </div>
          <div className="border border-slate-200 rounded-xl max-h-48 overflow-y-auto p-2 bg-slate-50 space-y-1 custom-scrollbar">
            {students.map((s) => (
              <div
                key={s.id}
                onClick={() => toggleStudent(s.id)}
                className="flex items-center gap-3 p-3 hover:bg-white rounded-lg cursor-pointer transition-colors border border-transparent hover:border-slate-100"
              >
                <input
                  type="checkbox"
                  checked={selectedIds.includes(s.id)}
                  readOnly
                  className="w-4 h-4 rounded border-slate-300 text-orange-600 focus:ring-orange-500 pointer-events-none"
                />
                <span className="text-sm font-semibold text-slate-700">
                  {s.full_name}
                </span>
              </div>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 gap-4">
          <div className="space-y-2">
            <Label className="text-[10px] font-black uppercase text-slate-400">
              Jumlah Poin per Anak
            </Label>
            <Input
              type="number"
              value={amount}
              onChange={(e) => setAmount(Number(e.target.value))}
              className="h-12 font-black text-orange-600 focus-visible:ring-orange-500"
            />
          </div>
          <div className="space-y-2">
            <Label className="text-[10px] font-black uppercase text-slate-400">
              Alasan / Kegiatan
            </Label>
            <Textarea
              placeholder="Contoh: Menjawab kuis, Juara lomba mewarnai, dll"
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              className="resize-none h-20 rounded-xl focus-visible:ring-orange-500"
            />
          </div>
        </div>
        <AppButton
          type="submit"
          isLoading={loading}
          className="w-full h-12 rounded-2xl"
        >
          Bagikan {amount * selectedIds.length} Poin
        </AppButton>
      </form>
    </AppModal>
  );
}
