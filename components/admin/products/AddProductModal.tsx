/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useState, useTransition } from "react";
import { AppModal } from "../../shared/AppModal";
import { AppButton } from "../../shared/AppButton";
import { upsertProduct } from "@/actions/admin/products";

import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";

import { ImagePlus, X, Save } from "lucide-react";
import toast from "react-hot-toast";
import Image from "next/image";

interface AddProductModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function AddProductModal({
  isOpen,
  onClose,
}: AddProductModalProps) {
  const [isPending, startTransition] = useTransition();
  const [preview, setPreview] = useState<string | null>(null);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const formElement = e.currentTarget;
    const formData = new FormData(formElement);
    const imageFile = formData.get("image") as File | null;

    if (imageFile && imageFile.size > 1024 * 1024) {
      return toast.error("Ukuran gambar terlalu besar! Maksimal 1MB.");
    }

    if (!imageFile || imageFile.size === 0) {
      return toast.error("Silakan pilih gambar terlebih dahulu!");
    }

    startTransition(async () => {
      try {
        await upsertProduct(formData);
        toast.success("Produk & Gambar berhasil disimpan!");
        onClose();
        setPreview(null);
      } catch (error: any) {
        toast.error(error.message || "Gagal menambah produk");
      }
    });
  };

  return (
    <AppModal
      isOpen={isOpen}
      onClose={() => {
        onClose();
        setPreview(null);
      }}
      title="Tambah Produk Baru"
      description="Tambahkan hadiah baru untuk ditaruh di Point Shop siswa."
      variant="orange"
      maxWidth="md"
      footer={
        <div className="w-full flex justify-end gap-3">
          <AppButton variant="outline" onClick={onClose} disabled={isPending}>
            Batal
          </AppButton>
          <AppButton
            type="submit"
            form="add-product-form"
            isLoading={isPending}
            leftIcon={<Save size={16} />}
          >
            Simpan Produk
          </AppButton>
        </div>
      }
    >
      <form
        id="add-product-form"
        onSubmit={handleSubmit}
        className="space-y-4 text-left"
      >
        <div className="space-y-2">
          <Label className="text-xs font-bold text-slate-500 uppercase tracking-wider">
            Foto Produk (Max 1MB)
          </Label>

          <div className="relative group">
            <input
              id="product-image-upload"
              type="file"
              name="image"
              accept="image/*"
              onChange={handleImageChange}
              className="hidden"
            />

            {preview ? (
              <div className="relative aspect-video rounded-xl overflow-hidden border border-slate-200 bg-white shadow-sm">
                <Image
                  src={preview}
                  alt="Preview Produk"
                  fill
                  className="object-contain p-2 transition-opacity duration-300"
                  sizes="(max-width: 425px) 100vw"
                />
                <button
                  type="button"
                  onClick={() => {
                    setPreview(null);
                    const input = document.getElementById(
                      "product-image-upload",
                    ) as HTMLInputElement;
                    if (input) input.value = "";
                  }}
                  className="absolute top-2 right-2 z-10 p-1.5 bg-red-500 text-white rounded-md shadow-sm hover:bg-red-600 transition-all"
                >
                  <X size={14} />
                </button>
              </div>
            ) : (
              <label
                htmlFor="product-image-upload"
                className="flex flex-col items-center justify-center aspect-video rounded-xl border-2 border-dashed border-slate-200 bg-slate-50 hover:bg-orange-50 hover:border-orange-200 transition-all cursor-pointer group"
              >
                <ImagePlus
                  size={32}
                  className="text-slate-300 group-hover:text-orange-400 transition-colors"
                />
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 mt-3">
                  Klik untuk pilih gambar
                </span>
              </label>
            )}
          </div>
        </div>

        <div className="space-y-2">
          <Label
            htmlFor="name"
            className="text-xs font-bold text-slate-500 uppercase tracking-wider"
          >
            Nama Produk
          </Label>
          <Input
            id="name"
            name="name"
            required
            placeholder="Contoh: Pensil Mekanik"
            className="h-11 rounded-lg border-slate-200 focus-visible:ring-orange-500 font-medium"
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label
              htmlFor="price"
              className="text-xs font-bold text-slate-500 uppercase tracking-wider"
            >
              Harga (Poin)
            </Label>
            <Input
              id="price"
              name="price"
              type="number"
              required
              placeholder="0"
              className="h-11 rounded-lg border-slate-200 focus-visible:ring-orange-500 font-medium"
            />
          </div>
          <div className="space-y-2">
            <Label
              htmlFor="stock"
              className="text-xs font-bold text-slate-500 uppercase tracking-wider"
            >
              Stok Awal
            </Label>
            <Input
              id="stock"
              name="stock"
              type="number"
              required
              placeholder="0"
              className="h-11 rounded-lg border-slate-200 focus-visible:ring-orange-500 font-medium"
            />
          </div>
        </div>

        <div className="space-y-2">
          <Label
            htmlFor="description"
            className="text-xs font-bold text-slate-500 uppercase tracking-wider"
          >
            Deskripsi Singkat
          </Label>
          <Textarea
            id="description"
            name="description"
            placeholder="Deskripsikan spesifikasi hadiah ini..."
            className="rounded-lg border-slate-200 focus-visible:ring-orange-500 min-h-25 resize-none font-medium"
          />
        </div>
      </form>
    </AppModal>
  );
}
