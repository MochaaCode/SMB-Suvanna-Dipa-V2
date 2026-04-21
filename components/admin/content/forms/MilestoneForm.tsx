/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useState } from "react";
import { Save, Plus, Trash2, Loader2, ImagePlus } from "lucide-react";
import { AppButton } from "../../../shared/AppButton";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  uploadContentImage,
  deleteContentImage,
} from "@/actions/admin/content";
import toast from "react-hot-toast";
import Image from "next/image";

interface MilestoneItem {
  title: string;
  desc: string;
  img: string;
}

interface MilestoneFormProps {
  initialData: { items?: MilestoneItem[] };
  onSave: (section: string, payload: Partial<{ items: MilestoneItem[] }>) => void;
  isPending: boolean;
}

export function MilestoneForm({
  initialData,
  onSave,
  isPending,
}: MilestoneFormProps) {
  const [items, setItems] = useState<MilestoneItem[]>(initialData?.items || []);
  const [uploadingIndex, setUploadingIndex] = useState<number | null>(null);

  const addItem = () => setItems([{ title: "", desc: "", img: "" }, ...items]);

  const updateItem = (
    index: number,
    field: keyof MilestoneItem,
    value: string,
  ) => {
    const newItems = [...items];
    newItems[index][field] = value;
    setItems(newItems);
  };

  const handleRemoveItem = async (index: number) => {
    const item = items[index];
    if (item.img) {
      const tid = toast.loading("Menghapus gambar dari storage...");
      try {
        await deleteContentImage(item.img);
        toast.success("Gambar berhasil dihapus", { id: tid });
      } catch (error: any) {
        toast.error(error.message, { id: tid });
        return;
      }
    }
    setItems(items.filter((_, i) => i !== index));
  };

  const handleImageUpload = async (index: number, file: File | undefined) => {
    if (!file) return;
    setUploadingIndex(index);
    const tid = toast.loading("Mengunggah gambar...");

    try {
      const oldUrl = items[index].img;
      if (oldUrl) {
        await deleteContentImage(oldUrl);
      }

      const formData = new FormData();
      formData.append("image", file);

      const imageUrl = await uploadContentImage(formData);
      updateItem(index, "img", imageUrl);
      toast.success("Gambar berhasil diunggah!", { id: tid });
    } catch (error: any) {
      toast.error(error.message, { id: tid });
    } finally {
      setUploadingIndex(null);
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="border-b border-slate-200 pb-4 flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div>
          <h3 className="text-xl font-bold text-slate-800">Milestone Dharma</h3>
          <p className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider mt-1">
            Kegiatan rutin dan hari besar (Waisak, Kathina, dll).
          </p>
        </div>
        <AppButton
          variant="secondary"
          onClick={addItem}
          leftIcon={<Plus size={16} />}
          className="text-orange-600 hover:text-orange-700 hover:bg-orange-50 bg-white border border-slate-200 h-10 shrink-0"
        >
          Tambah Kegiatan
        </AppButton>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-5 max-h-150 overflow-y-auto pr-3 custom-scrollbar">
        {items.length === 0 && (
          <div className="col-span-full text-center py-10 bg-slate-50 rounded-xl border border-dashed border-slate-200 text-slate-400 font-semibold text-sm">
            Belum ada data kegiatan
          </div>
        )}

        {items.map((item, index) => (
          <div
            key={index}
            className="bg-white border border-slate-200 p-5 rounded-[1rem] flex flex-col gap-4 group hover:border-orange-300 transition-colors relative shadow-sm"
          >
            <button
              onClick={() => handleRemoveItem(index)}
              className="absolute top-3 right-3 p-2 bg-white text-red-500 rounded-lg shadow-sm hover:bg-red-50 hover:text-red-600 transition-all border border-slate-200 opacity-0 group-hover:opacity-100 z-10"
            >
              <Trash2 size={14} />
            </button>

            {item.img ? (
              <div className="w-full h-36 relative rounded-lg overflow-hidden border border-slate-200 bg-slate-50">
                <Image
                  src={item.img}
                  alt="Preview"
                  fill
                  className="object-cover"
                  unoptimized
                />
              </div>
            ) : (
              <div className="w-full h-36 flex items-center justify-center rounded-lg border border-dashed border-slate-200 bg-slate-50">
                <ImagePlus className="text-slate-300" size={32} />
              </div>
            )}

            <div className="space-y-2">
              <label className="text-[10px] font-bold uppercase text-slate-500 tracking-wider">
                Judul Kegiatan
              </label>
              <Input
                value={item.title}
                onChange={(e) => updateItem(index, "title", e.target.value)}
                placeholder="Contoh: Waisak"
                className="h-10 rounded-lg border-slate-200 font-bold focus-visible:ring-orange-500"
              />
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-bold uppercase text-slate-500 tracking-wider">
                Deskripsi Singkat
              </label>
              <Textarea
                value={item.desc}
                onChange={(e) => updateItem(index, "desc", e.target.value)}
                placeholder="Peringatan Tri Suci Waisak..."
                className="min-h-20 rounded-lg border-slate-200 font-medium text-sm focus-visible:ring-orange-500 resize-none"
              />
            </div>

            <div className="space-y-2 pr-10">
              <label className="text-[10px] font-bold uppercase text-slate-500 tracking-wider">
                Upload Gambar Sampul
              </label>
              <div className="flex gap-2 items-center">
                <Input
                  type="file"
                  accept="image/*"
                  onChange={(e) =>
                    handleImageUpload(index, e.target.files?.[0])
                  }
                  disabled={uploadingIndex === index}
                  className="h-10 text-xs rounded-lg border-slate-200 file:text-orange-600 file:font-semibold cursor-pointer"
                />
                {uploadingIndex === index && (
                  <Loader2
                    size={18}
                    className="animate-spin text-orange-500 shrink-0"
                  />
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="pt-4">
        <AppButton
          onClick={() => onSave("milestone", { items })}
          disabled={uploadingIndex !== null}
          isLoading={isPending}
          leftIcon={<Save size={16} />}
          className="h-11"
        >
          Simpan Perubahan Milestone
        </AppButton>
      </div>
    </div>
  );
}
