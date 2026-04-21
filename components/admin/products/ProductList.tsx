/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { Trash2, Sparkles, RotateCcw, ShieldAlert } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import {
  setProductDeletedStatus,
  deleteProductPermanent,
} from "@/actions/admin/products";
import toast from "react-hot-toast";
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
import EditProductModal from "./EditProductModal";
import { ProductImagePreview } from "./ProductImagePreview";

import type { Product } from "@/types";

export default function ProductList({
  products,
  isTrashMode,
}: {
  products: Product[];
  isTrashMode: boolean;
}) {
  const handleArchive = async (id: number) => {
    const tid = toast.loading("Memindahkan produk ke arsip...");
    try {
      await setProductDeletedStatus(id, true);
      toast.success("Produk berhasil diarsipkan.", { id: tid });
    } catch (error: any) {
      toast.error(error.message, { id: tid });
    }
  };

  const handleRestore = async (id: number) => {
    const tid = toast.loading("Mengembalikan produk ke toko...");
    try {
      await setProductDeletedStatus(id, false);
      toast.success("Produk kembali tersedia di toko.", { id: tid });
    } catch (error: any) {
      toast.error(error.message, { id: tid });
    }
  };

  const handleHardDelete = async (id: number, imageUrl: string | null) => {
    const tid = toast.loading("Menghapus produk permanen...");
    try {
      await deleteProductPermanent(id, imageUrl);
      toast.success("Data dan gambar produk telah dihapus bersih.", {
        id: tid,
      });
    } catch (error: any) {
      toast.error(error.message, { id: tid });
    }
  };

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 animate-in fade-in duration-500">
      {products.map((product) => (
        <div
          key={`${product.id}-${product.updated_at}`}
          className="group bg-white rounded-[1rem] border border-slate-200 shadow-sm overflow-hidden flex flex-col hover:border-orange-300 transition-all duration-300"
        >
          <div className="relative aspect-square bg-slate-50 overflow-hidden border-b border-slate-100">
            <ProductImagePreview src={product.image_url} alt={product.name} />

            <div className="absolute top-3 right-3 z-10 pointer-events-none">
              <Badge className="bg-slate-900/80 backdrop-blur-md text-white border-none rounded-lg px-3 py-1.5 font-black flex items-center gap-1 shadow-lg">
                <Sparkles
                  size={14}
                  className="text-yellow-400"
                  fill="currentColor"
                />
                {product.price.toLocaleString()} Poin
              </Badge>
            </div>
          </div>

          <div className="p-5 flex-1 flex flex-col">
            <div className="flex-1 space-y-1.5 mb-5 text-left">
              <h4 className="font-black text-slate-800 text-lg leading-tight group-hover:text-orange-600 transition-colors truncate">
                {product.name}
              </h4>
              <p className="text-xs font-medium text-slate-500 line-clamp-2 leading-relaxed">
                {product.description || "Tidak ada deskripsi produk."}
              </p>
            </div>

            <div className="flex items-center justify-between pt-4 border-t border-slate-50">
              <div className="space-y-0.5 text-left">
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest leading-none">
                  Stok
                </p>
                <p
                  className={`text-sm font-black ${product.stock > 0 ? "text-slate-800" : "text-red-500"}`}
                >
                  {product.stock} Unit
                </p>
              </div>

              <div className="flex items-center gap-2">
                {!isTrashMode ? (
                  <>
                    <EditProductModal product={product} />

                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <AppButton
                          variant="secondary"
                          size="icon"
                          className="h-9 w-9 rounded-lg text-slate-400 hover:text-red-600 border-slate-200"
                        >
                          <Trash2 size={16} />
                        </AppButton>
                      </AlertDialogTrigger>
                      <AlertDialogContent className="rounded-[1rem]">
                        <AlertDialogHeader>
                          <AlertDialogTitle className="text-xl font-bold text-slate-800">
                            Arsipkan Produk?
                          </AlertDialogTitle>
                          <AlertDialogDescription className="text-sm font-medium text-slate-600">
                            Produk{" "}
                            <span className="font-bold text-slate-900">
                              {product.name}
                            </span>{" "}
                            akan ditarik dari etalase.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter className="mt-4">
                          <AlertDialogCancel className="rounded-lg h-10 px-6 font-bold text-xs">
                            Batal
                          </AlertDialogCancel>
                          <AlertDialogAction
                            onClick={() => handleArchive(product.id)}
                            className="rounded-lg h-10 px-6 font-bold text-xs bg-red-600 hover:bg-red-700"
                          >
                            Ya, Arsipkan
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  </>
                ) : (
                  <div className="flex gap-2">
                    <AppButton
                      onClick={() => handleRestore(product.id)}
                      variant="secondary"
                      size="icon"
                      className="h-9 w-9 rounded-lg text-green-600 border-slate-200 bg-green-50/50"
                    >
                      <RotateCcw size={16} />
                    </AppButton>
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <AppButton
                          variant="secondary"
                          size="icon"
                          className="h-9 w-9 rounded-lg text-red-600 border-slate-200 bg-red-50/50"
                        >
                          <ShieldAlert size={16} />
                        </AppButton>
                      </AlertDialogTrigger>
                      <AlertDialogContent className="rounded-[1rem]">
                        <AlertDialogHeader>
                          <AlertDialogTitle className="text-xl font-black text-red-600">
                            Hapus Permanen?
                          </AlertDialogTitle>
                          <AlertDialogDescription className="font-medium text-slate-600 leading-relaxed bg-red-50 p-4 rounded-xl border border-red-100 mt-2 text-left">
                            Aksi ini akan menghapus data{" "}
                            <span className="font-bold text-slate-900">
                              {product.name}
                            </span>{" "}
                            dan gambarnya selamanya.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter className="mt-6">
                          <AlertDialogCancel className="rounded-lg h-10 px-6 font-bold text-xs">
                            Batal
                          </AlertDialogCancel>
                          <AlertDialogAction
                            onClick={() =>
                              handleHardDelete(product.id, product.image_url)
                            }
                            className="rounded-lg h-10 px-6 font-bold text-xs bg-red-600"
                          >
                            Hapus Bersih
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
