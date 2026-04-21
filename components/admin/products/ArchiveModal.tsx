"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
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
  Trash2,
  RotateCcw,
  PackageSearch,
  Loader2,
  AlertTriangle,
  Info,
} from "lucide-react";
import {
  getArchivedProducts,
  setProductDeletedStatus,
  deleteProductPermanent,
} from "@/actions/admin/products";
import toast from "react-hot-toast";
import { AppButton } from "../../shared/AppButton";

import type { Product } from "@/types";

export default function ArchiveModal() {
  const router = useRouter();
  const [archived, setArchived] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const fetchArchived = async () => {
    setIsLoading(true);
    try {
      const data = await getArchivedProducts();
      setArchived(data);
    } catch (error) {
      toast.error("Gagal mengambil data arsip");
    } finally {
      setIsLoading(false);
    }
  };

  const handleRestore = async (id: number) => {
    const tid = toast.loading("Memulihkan produk...");
    try {
      await setProductDeletedStatus(id, false);
      toast.success("Produk berhasil dikembalikan!", { id: tid });
      setArchived(archived.filter((p) => p.id !== id));
      router.refresh();
    } catch (error) {
      toast.error("Gagal mengembalikan produk", { id: tid });
    }
  };

  const handlePermanentDelete = async (id: number, imageUrl: string | null) => {
    const tid = toast.loading("Menghapus permanen...");
    try {
      await deleteProductPermanent(id, imageUrl);
      toast.success("Terhapus permanen dari server!", { id: tid });
      setArchived(archived.filter((p) => p.id !== id));
      router.refresh();
    } catch (error) {
      toast.error("Gagal menghapus permanen", { id: tid });
    }
  };

  return (
    <Sheet onOpenChange={(open) => open && fetchArchived()}>
      <SheetTrigger asChild>
        <AppButton
          variant="outline"
          className="font-bold text-slate-600 hover:text-red-600 hover:bg-red-50 hover:border-red-200 transition-colors"
          leftIcon={<Trash2 size={16} />}
        >
          Lihat Arsip
        </AppButton>
      </SheetTrigger>

      <SheetContent className="w-full sm:max-w-md border-l-slate-200 shadow-2xl overflow-y-auto bg-slate-50">
        <SheetHeader className="pb-6 border-b border-slate-200 text-left mt-2">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-red-100 rounded-lg border border-red-200">
              <Trash2 size={20} className="text-red-600" />
            </div>
            <div>
              <SheetTitle className="text-xl font-bold text-slate-800 leading-tight">
                Tempat Sampah
              </SheetTitle>
              <p className="text-[10px] font-bold uppercase tracking-wider text-slate-500 mt-1">
                Daftar produk yang ditarik dari toko
              </p>
            </div>
          </div>
        </SheetHeader>

        <div className="mt-6 space-y-3">
          {isLoading ? (
            <div className="flex flex-col items-center justify-center py-20">
              <Loader2 className="animate-spin text-slate-400 mb-3" size={32} />
              <p className="text-xs font-bold uppercase tracking-wider text-slate-500">
                Memuat Arsip...
              </p>
            </div>
          ) : archived.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-32 text-center bg-white rounded-xl border border-slate-200">
              <PackageSearch size={40} className="text-slate-300 mb-4" />
              <h3 className="text-sm font-bold text-slate-600">Arsip Kosong</h3>
            </div>
          ) : (
            archived.map((product) => (
              <div
                key={product.id}
                className="group flex items-center justify-between p-4 bg-white rounded-xl border border-slate-200 hover:border-slate-300 shadow-sm transition-all"
              >
                <div className="flex flex-col gap-1 max-w-[50%] text-left">
                  <span className="text-sm font-bold text-slate-800 truncate">
                    {product.name}
                  </span>
                  <span className="text-[10px] font-bold text-orange-600 uppercase tracking-wider">
                    {product.price} Pts
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  <AppButton
                    size="sm"
                    variant="secondary"
                    onClick={() => handleRestore(product.id)}
                    className="h-8 px-3 text-[10px] bg-green-50 text-green-700 hover:bg-green-600 hover:text-white border border-green-200"
                    leftIcon={<RotateCcw size={12} />}
                  >
                    Restore
                  </AppButton>

                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <AppButton
                        size="icon"
                        variant="outline"
                        className="h-8 w-8 text-red-500 hover:bg-red-600 hover:text-white border-red-200 bg-red-50 transition-all"
                      >
                        <Trash2 size={14} />
                      </AppButton>
                    </AlertDialogTrigger>
                    <AlertDialogContent className="rounded-[1rem] border-slate-200 p-8 shadow-xl max-w-sm">
                      <AlertDialogHeader>
                        <div className="flex items-center gap-3 mb-2">
                          <div className="p-2 bg-red-100 rounded-lg">
                            <AlertTriangle className="text-red-600" size={24} />
                          </div>
                          <AlertDialogTitle className="text-xl font-bold text-slate-800">
                            Hapus Permanen?
                          </AlertDialogTitle>
                        </div>
                        <AlertDialogDescription className="text-sm font-medium text-slate-600 leading-relaxed">
                          Tindakan ini akan menghapus produk{" "}
                          <span className="font-bold text-slate-900">
                            &quot;{product.name}&quot;
                          </span>{" "}
                          dan fotonya secara permanen. Data tidak bisa
                          dikembalikan!
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter className="mt-6 gap-2 sm:gap-0">
                        <AlertDialogCancel asChild>
                          <AppButton
                            variant="outline"
                            className="h-10 text-xs"
                          >
                            Batal
                          </AppButton>
                        </AlertDialogCancel>
                        <AlertDialogAction
                          onClick={() =>
                            handlePermanentDelete(product.id, product.image_url)
                          }
                          className="bg-red-600 hover:bg-red-700 text-white rounded-lg h-10 px-6 font-bold text-xs shadow-sm border-none"
                        >
                          Ya, Hapus Bersih
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                </div>
              </div>
            ))
          )}
        </div>

        {archived.length > 0 && (
          <div className="mt-8 p-4 bg-blue-50 rounded-xl border border-blue-100 flex gap-3 text-left">
            <Info className="text-blue-500 shrink-0 mt-0.5" size={16} />
            <p className="text-[10px] font-medium text-blue-800 leading-relaxed">
              Gunakan tombol <strong>Restore</strong> untuk mengembalikan produk
              ke toko, atau klik ikon tong sampah untuk menghapusnya secara
              permanen.
            </p>
          </div>
        )}
      </SheetContent>
    </Sheet>
  );
}
