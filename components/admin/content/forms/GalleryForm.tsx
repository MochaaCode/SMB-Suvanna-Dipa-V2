/* eslint-disable @typescript-eslint/no-explicit-any */

"use client";

import { useState } from "react";
import { Save, Plus, Trash2, Loader2, ImagePlus } from "lucide-react";
import { AppButton } from "../../../shared/AppButton";
import { Input } from "@/components/ui/input";
import {
  uploadContentImage,
  deleteContentImage,
} from "@/actions/admin/content";
import toast from "react-hot-toast";
import Image from "next/image";

interface GalleryItem {
  url: string;
  caption: string;
}

interface GalleryFormProps {
  initialData: { items?: GalleryItem[] };
  onSave: (section: string, payload: Partial<{ items: GalleryItem[] }>) => void;
  isPending: boolean;
}

export function GalleryForm({
  initialData,
  onSave,
  isPending,
}: GalleryFormProps) {
  const [items, setItems] = useState<GalleryItem[]>(initialData?.items || []);
  const [uploadingIndex, setUploadingIndex] = useState<number | null>(null);

  const addItem = () => setItems([{ url: "", caption: "" }, ...items]);

  const updateItem = (
    index: number,
    field: keyof GalleryItem,
    value: string,
  ) => {
    const newItems = [...items];
    newItems[index][field] = value;
    setItems(newItems);
  };

  const handleRemoveItem = async (index: number) => {
    const item = items[index];

    if (item.url) {
      const tid = toast.loading("Menghapus foto dari storage...");
      try {
        await deleteContentImage(item.url);
        toast.success("Foto berhasil dihapus permanen", { id: tid });
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
    const tid = toast.loading("Mengunggah foto galeri...");

    try {
      const oldUrl = items[index].url;
      if (oldUrl) {
        await deleteContentImage(oldUrl);
      }

      const formData = new FormData();
      formData.append("image", file);

      const imageUrl = await uploadContentImage(formData);
      updateItem(index, "url", imageUrl);
      toast.success("Foto berhasil diunggah!", { id: tid });
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
          <h3 className="text-xl font-bold text-slate-800">Galeri Ceria</h3>
          <p className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider mt-1">
            Foto-foto yang akan berjalan otomatis (Marquee).
          </p>
        </div>
        <AppButton
          variant="secondary"
          onClick={addItem}
          leftIcon={<Plus size={16} />}
          className="text-orange-600 hover:text-orange-700 hover:bg-orange-50 bg-white border border-slate-200 h-10 shrink-0"
        >
          Tambah Foto Baru
        </AppButton>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5 max-h-150 overflow-y-auto pr-3 custom-scrollbar">
        {items.length === 0 && (
          <div className="col-span-full text-center py-16 bg-slate-50 rounded-xl border border-dashed border-slate-200 text-slate-400 font-semibold text-sm">
            Belum ada foto di galeri
          </div>
        )}

        {items.map((item, index) => (
          <div
            key={index}
            className="bg-white border border-slate-200 p-5 rounded-[1rem] flex flex-col gap-4 group relative hover:border-orange-300 transition-colors shadow-sm"
          >
            <button
              onClick={() => handleRemoveItem(index)}
              className="absolute top-3 right-3 p-2 bg-white text-red-500 rounded-lg shadow-sm hover:bg-red-50 hover:text-red-600 transition-all border border-slate-200 opacity-0 group-hover:opacity-100 z-10"
            >
              <Trash2 size={14} />
            </button>

            {item.url ? (
              <div className="w-full h-40 relative rounded-lg overflow-hidden border border-slate-200 bg-slate-50">
                <Image
                  src={item.url}
                  alt="Preview"
                  fill
                  className="object-cover"
                  unoptimized
                />
              </div>
            ) : (
              <div className="w-full h-40 flex items-center justify-center rounded-lg border border-dashed border-slate-200 bg-slate-50">
                <ImagePlus className="text-slate-300" size={32} />
              </div>
            )}

            <div className="space-y-2 pr-10">
              <label className="text-[10px] font-bold uppercase text-slate-500 tracking-wider">
                Upload Foto
              </label>
              <div className="flex gap-2 items-center">
                <Input
                  type="file"
                  accept="image/*"
                  onChange={(e) =>
                    handleImageUpload(index, e.target.files?.[0])
                  }
                  disabled={uploadingIndex === index}
                  className="h-10 text-xs rounded-lg border-slate-200 focus-visible:ring-orange-500 file:text-orange-600 file:font-semibold cursor-pointer"
                />
                {uploadingIndex === index && (
                  <Loader2
                    size={18}
                    className="animate-spin text-orange-500 shrink-0"
                  />
                )}
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-bold uppercase text-slate-500 tracking-wider">
                Keterangan / Caption
              </label>
              <Input
                value={item.caption}
                onChange={(e) => updateItem(index, "caption", e.target.value)}
                placeholder="Contoh: Keseruan Outbond..."
                className="h-10 rounded-lg border-slate-200 font-medium focus-visible:ring-orange-500"
              />
            </div>
          </div>
        ))}
      </div>

      <div className="pt-4">
        <AppButton
          onClick={() => onSave("gallery", { items })}
          disabled={uploadingIndex !== null}
          isLoading={isPending}
          leftIcon={<Save size={16} />}
          className="h-11"
        >
          Simpan Perubahan Galeri
        </AppButton>
      </div>
    </div>
  );
}
