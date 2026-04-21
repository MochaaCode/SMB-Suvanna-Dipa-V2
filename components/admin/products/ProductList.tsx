/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useState, useEffect } from "react";
import { Package, Trash2, Sparkles, LayoutGrid, Maximize2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { setProductDeletedStatus } from "@/actions/admin/products";
import toast from "react-hot-toast";
import Image from "next/image";
import { useRouter } from "next/navigation";
import * as VisuallyHidden from "@radix-ui/react-visually-hidden";
import { AppButton } from "../../shared/AppButton";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogTrigger,
} from "@/components/ui/dialog";
import EditProductModal from "./EditProductModal";

// IMPORT TIPE KETAT
import type { Product } from "@/types";

export default function ProductList({
  initialProducts,
}: {
  initialProducts: Product[];
}) {
  const router = useRouter();
  const [products, setProducts] = useState<Product[]>(initialProducts);

  useEffect(() => {
    setProducts(initialProducts);
  }, [initialProducts]);

  const handleDelete = async (id: number) => {
    const tid = toast.loading("Mengarsipkan produk...");
    try {
      await setProductDeletedStatus(id, true);
      toast.success("Produk berhasil diarsipkan!", { id: tid });
      router.refresh();
    } catch (error: any) {
      toast.error(error.message || "Gagal mengarsipkan produk.", { id: tid });
    }
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 animate-in fade-in duration-700">
      {products.map((product) => (
        <div
          key={`${product.id}-${product.updated_at}`}
          className="group bg-white rounded-[1rem] border border-slate-200 shadow-sm hover:shadow-md hover:border-slate-300 transition-all duration-300 flex overflow-hidden h-48"
        >
          {/* IMAGE SECTION */}
          <div className="relative w-40 shrink-0 bg-slate-50 overflow-hidden border-r border-slate-100 flex items-center justify-center">
            {product.image_url ? (
              <>
                <Image
                  src={`${product.image_url}?t=${new Date(product.updated_at).getTime()}`}
                  alt={product.name}
                  unoptimized
                  fill
                  className="object-cover transition-all duration-500 group-hover:scale-105"
                />
                <Dialog>
                  <DialogTrigger asChild>
                    <button className="absolute inset-0 bg-slate-900/0 hover:bg-slate-900/10 transition-all duration-300 flex items-center justify-center group/btn">
                      <div className="bg-white/90 backdrop-blur-sm p-2 rounded-lg shadow-sm opacity-0 group-hover/btn:opacity-100 transition-all text-slate-700">
                        <Maximize2 size={16} />
                      </div>
                    </button>
                  </DialogTrigger>
                  <DialogContent className="max-w-[95vw] sm:max-w-4xl p-0 overflow-hidden border-none bg-transparent shadow-none">
                    <VisuallyHidden.Root>
                      <DialogHeader>
                        <DialogTitle>{product.name}</DialogTitle>
                        <DialogDescription>
                          Pratinjau gambar penuh
                        </DialogDescription>
                      </DialogHeader>
                    </VisuallyHidden.Root>
                    <div className="relative w-full h-[80vh]">
                      <Image
                        src={`${product.image_url}?t=${new Date(product.updated_at).getTime()}`}
                        alt={product.name}
                        unoptimized
                        fill
                        className="object-contain"
                      />
                    </div>
                  </DialogContent>
                </Dialog>
              </>
            ) : (
              <Package size={32} className="text-slate-300" strokeWidth={1.5} />
            )}

            <div className="absolute top-2 left-2 z-10">
              <div className="bg-slate-900/80 backdrop-blur-sm px-2.5 py-1 rounded-md border border-white/20">
                <p className="text-[10px] font-bold text-white flex items-center gap-1">
                  <Sparkles size={10} className="text-orange-400" />
                  {product.price.toLocaleString()}{" "}
                  <span className="text-[9px] text-orange-200">Pts</span>
                </p>
              </div>
            </div>
          </div>

          {/* CONTENT SECTION */}
          <div className="p-4 flex flex-col justify-between grow overflow-hidden text-left">
            <div className="space-y-1.5">
              <div className="flex items-center justify-between gap-2 mb-1">
                <span className="text-[9px] font-bold uppercase tracking-wider text-blue-600 truncate">
                  Reward SMB
                </span>
                <Badge
                  className={`${
                    product.stock > 0
                      ? "bg-green-50 text-green-700 border-green-200"
                      : "bg-red-50 text-red-700 border-red-200"
                  } text-[9px] font-bold uppercase px-2 py-0 shadow-none border`}
                >
                  {product.stock > 0 ? "Ada" : "Habis"}
                </Badge>
              </div>
              <h3 className="text-sm font-bold text-slate-800 leading-tight truncate">
                {product.name}
              </h3>
              <p className="text-[11px] text-slate-500 font-medium line-clamp-2 leading-relaxed">
                {product.description || "Tidak ada deskripsi produk."}
              </p>
            </div>

            <div className="flex items-center justify-between pt-3 mt-auto">
              <div className="flex items-center gap-1.5">
                <LayoutGrid size={12} className="text-slate-400" />
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500">
                  Sisa: <span className="text-slate-900">{product.stock}</span>
                </span>
              </div>

              <div className="flex gap-2">
                <EditProductModal product={product} />

                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <AppButton
                      variant="secondary"
                      size="icon"
                      className="h-8 w-8 text-slate-400 hover:text-red-600 hover:bg-red-50 border border-slate-200 bg-white"
                    >
                      <Trash2 size={14} />
                    </AppButton>
                  </AlertDialogTrigger>
                  <AlertDialogContent className="rounded-[1rem] border-slate-200 p-8 shadow-xl max-w-md">
                    <AlertDialogHeader>
                      <AlertDialogTitle className="text-xl font-bold text-slate-800">
                        Arsipkan Produk?
                      </AlertDialogTitle>
                      <AlertDialogDescription className="text-sm font-medium text-slate-600">
                        <span className="font-bold text-slate-900">
                          {product.name}
                        </span>{" "}
                        akan ditarik dari etalase Point Shop siswa.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter className="gap-2 mt-6">
                      <AlertDialogCancel className="rounded-lg h-10 px-6 font-bold text-xs border-slate-200 text-slate-600 hover:bg-slate-50">
                        Batal
                      </AlertDialogCancel>
                      <AlertDialogAction
                        onClick={() => handleDelete(product.id)}
                        className="rounded-lg h-10 px-6 font-bold text-xs bg-slate-900 hover:bg-red-600 text-white border-none shadow-sm transition-colors"
                      >
                        Ya, Arsipkan
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
