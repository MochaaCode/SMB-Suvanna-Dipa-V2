/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { AppModal } from "../../shared/AppModal";
import { AppButton } from "../../shared/AppButton";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Edit3, Save, ImagePlus } from "lucide-react";
import { upsertProduct } from "@/actions/admin/products";
import toast from "react-hot-toast";
import Image from "next/image";

import type { Product } from "@/types";

interface EditProductModalProps {
  product: Product;
}

export default function EditProductModal({ product }: EditProductModalProps) {
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);
  const [isPending, startTransition] = useTransition();
  const [preview, setPreview] = useState<string | null>(
    product.image_url || null,
  );

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

    formData.append("id", product.id.toString());
    if (product.image_url) {
      formData.append("image_url", product.image_url);
    }

    startTransition(async () => {
      try {
        await upsertProduct(formData);
        toast.success("Perubahan berhasil disimpan!");
        setIsOpen(false);
        router.refresh();
      } catch (error: any) {
        toast.error(error.message || "Gagal memperbarui produk");
      }
    });
  };

  return (
    <>
      <AppButton
        variant="ghost"
        size="icon"
        onClick={() => setIsOpen(true)}
        className="h-8 w-8 text-blue-600 hover:text-blue-700 hover:bg-blue-50 transition-all rounded-[1rem]"
        title="Edit Produk"
      >
        <Edit3 size={14} />
      </AppButton>

      <AppModal
        isOpen={isOpen}
        onClose={() => {
          setIsOpen(false);
          setPreview(product.image_url);
        }}
        title="Edit Detail Hadiah"
        description={`Memperbarui detail produk ${product.name}`}
        variant="orange"
        maxWidth="md"
        footer={
          <div className="w-full flex justify-end gap-3">
            <AppButton
              variant="outline"
              onClick={() => setIsOpen(false)}
              disabled={isPending}
            >
              Batal
            </AppButton>
            <AppButton
              type="submit"
              form={`edit-product-form-${product.id}`}
              isLoading={isPending}
              leftIcon={<Save size={16} />}
            >
              Simpan Perubahan
            </AppButton>
          </div>
        }
      >
        <form
          id={`edit-product-form-${product.id}`}
          onSubmit={handleSubmit}
          className="space-y-4 text-left"
        >
          <div className="space-y-2 text-center">
            <Label className="text-xs font-bold text-slate-500 uppercase tracking-wider block mb-2 text-left">
              Ubah Foto Produk
            </Label>

            <div className="relative group">
              <input
                id={`edit-image-upload-${product.id}`}
                type="file"
                name="image"
                accept="image/*"
                onChange={handleImageChange}
                className="hidden"
              />

              <label
                htmlFor={`edit-image-upload-${product.id}`}
                className="relative block aspect-video rounded-xl overflow-hidden border border-slate-200 bg-white cursor-pointer group hover:border-orange-300 transition-all shadow-sm"
              >
                {preview ? (
                  <Image
                    src={preview}
                    alt="Preview"
                    fill
                    unoptimized
                    className="object-contain p-2 group-hover:scale-105 transition-transform duration-500"
                  />
                ) : (
                  <div className="flex flex-col items-center justify-center h-full">
                    <ImagePlus size={32} className="text-slate-300" />
                    <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 mt-2">
                      Pilih Foto Baru
                    </span>
                  </div>
                )}
              </label>
            </div>

            {preview !== product.image_url && (
              <button
                type="button"
                onClick={() => {
                  setPreview(product.image_url);
                  const input = document.getElementById(
                    `edit-image-upload-${product.id}`,
                  ) as HTMLInputElement;
                  if (input) input.value = "";
                }}
                className="mt-3 text-[10px] font-bold uppercase tracking-wider text-red-500 hover:underline"
              >
                Reset Ke Foto Asli
              </button>
            )}
          </div>

          <div className="space-y-2">
            <Label
              htmlFor="edit-name"
              className="text-xs font-bold text-slate-500 uppercase tracking-wider"
            >
              Nama Produk
            </Label>
            <Input
              id="edit-name"
              name="name"
              defaultValue={product.name}
              required
              className="h-11 rounded-lg border-slate-200 font-medium focus-visible:ring-orange-500"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label
                htmlFor="edit-price"
                className="text-xs font-bold text-slate-500 uppercase tracking-wider"
              >
                Harga (Poin)
              </Label>
              <Input
                id="edit-price"
                name="price"
                type="number"
                defaultValue={product.price}
                required
                className="h-11 rounded-lg border-slate-200 font-medium focus-visible:ring-orange-500"
              />
            </div>
            <div className="space-y-2">
              <Label
                htmlFor="edit-stock"
                className="text-xs font-bold text-slate-500 uppercase tracking-wider"
              >
                Sisa Stok
              </Label>
              <Input
                id="edit-stock"
                name="stock"
                type="number"
                defaultValue={product.stock}
                required
                className="h-11 rounded-lg border-slate-200 font-medium focus-visible:ring-orange-500"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label
              htmlFor="edit-description"
              className="text-xs font-bold text-slate-500 uppercase tracking-wider"
            >
              Deskripsi Singkat
            </Label>
            <Textarea
              id="edit-description"
              name="description"
              defaultValue={product.description || ""}
              className="rounded-lg border-slate-200 min-h-25 resize-none font-medium focus-visible:ring-orange-500"
            />
          </div>
        </form>
      </AppModal>
    </>
  );
}
