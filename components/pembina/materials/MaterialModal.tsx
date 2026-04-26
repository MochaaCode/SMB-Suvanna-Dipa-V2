/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useState, useEffect } from "react";
import { AppModal } from "@/components/shared/AppModal";
import { AppButton } from "@/components/shared/AppButton";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import toast from "react-hot-toast";
import { updateMaterialContent } from "@/actions/pembina/materials";
import { BookOpen, Info } from "lucide-react";
import type { ExtendedSchedule } from "@/actions/pembina/materials";

interface MaterialModalProps {
  selectedSched: ExtendedSchedule | null;
  onClose: () => void;
}

export function MaterialModal({ selectedSched, onClose }: MaterialModalProps) {
  const [materiText, setMateriText] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (selectedSched) {
      setMateriText(selectedSched.materials || "");
    }
  }, [selectedSched]);

  const handleSaveMateri = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedSched) return;

    setLoading(true);
    const tid = toast.loading("Menyimpan materi...");

    try {
      const result = await updateMaterialContent(selectedSched.id, materiText);
      if (!result.success) throw new Error(result.error as string);

      toast.success("Materi pembahasan berhasil diperbarui!", { id: tid });
      onClose();
    } catch (err: any) {
      toast.error(err.message || "Terjadi kesalahan", { id: tid });
    } finally {
      setLoading(false);
    }
  };

  const hasAdminContent =
    !!selectedSched?.content &&
    (selectedSched.content as string).trim().length > 0;

  return (
    <AppModal
      isOpen={!!selectedSched}
      onClose={() => !loading && onClose()}
      title="Editor Materi"
      variant="orange"
    >
      <form onSubmit={handleSaveMateri} className="space-y-4 pt-2">
        <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
          <p className="text-[10px] font-black text-slate-400 uppercase mb-1">
            Topik Pertemuan
          </p>
          <p className="text-sm font-bold text-slate-700">
            {selectedSched?.title}
          </p>
          {selectedSched?.class && (
            <p className="text-[10px] text-slate-400 mt-0.5">
              Kelas {(selectedSched.class as any).name}
            </p>
          )}
        </div>

        {hasAdminContent && (
          <div className="p-3 bg-blue-50 border border-blue-100 rounded-xl">
            <p className="text-[10px] font-black text-blue-400 uppercase mb-2 flex items-center gap-1">
              <BookOpen size={10} /> Konten dari Admin (Read Only)
            </p>
            <div
              className="prose prose-xs max-w-none text-slate-700 text-xs leading-relaxed"
              dangerouslySetInnerHTML={{
                __html: selectedSched?.content as string,
              }}
            />
          </div>
        )}

        <div className="space-y-2">
          <Label className="text-[10px] font-black text-slate-500 uppercase tracking-widest">
            Materi Pembahasan Kelas
          </Label>
          <Textarea
            value={materiText}
            onChange={(e) => setMateriText(e.target.value)}
            placeholder="Contoh: Siswa membahas sila ke-1, mengerjakan soal halaman 10, membawa buku catatan minggu depan..."
            className="min-h-40 rounded-2xl border-slate-200 focus-visible:ring-orange-500 text-sm leading-relaxed"
          />
          <p className="text-[9px] text-slate-400 italic flex items-start gap-1">
            <Info size={10} className="mt-0.5 shrink-0" />
            Materi ini dapat dilihat oleh siswa di halaman jadwal mereka.
            Opsional — kosongkan jika belum ada materi.
          </p>
        </div>

        <div className="flex gap-3 pt-2">
          <AppButton
            type="button"
            variant="outline"
            className="flex-1 h-12 rounded-2xl"
            onClick={onClose}
            disabled={loading}
          >
            Batal
          </AppButton>
          <AppButton
            type="submit"
            isLoading={loading}
            className="flex-1 h-12 rounded-2xl font-bold"
          >
            Simpan Materi
          </AppButton>
        </div>
      </form>
    </AppModal>
  );
}
