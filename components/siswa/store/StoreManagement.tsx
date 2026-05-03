"use client";

import { useState, useTransition, useMemo } from "react";
import {
  Gift,
  Wallet,
  Search,
  Package,
  AlertCircle,
  Sparkles,
} from "lucide-react";
import { PageHeader } from "@/components/shared/PageHeader";
import { AppCard } from "@/components/shared/AppCard";
import { Input } from "@/components/ui/input";
import { ProductCard } from "./ProductCard";
import { redeemRewardAction } from "@/actions/siswa/store";
import toast from "react-hot-toast";
import { AppButton } from "@/components/shared/AppButton";
import { AppModal } from "@/components/shared/AppModal";
import type { Product } from "@/types";

interface StoreManagementProps {
  products: Product[];
  userPoints: number;
}

export function StoreManagement({
  products,
  userPoints,
}: StoreManagementProps) {
  const [isPending, startTransition] = useTransition();
  const [searchQuery, setSearchQuery] = useState("");

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

  const filteredProducts = useMemo(() => {
    return products.filter((p) =>
      p.name.toLowerCase().includes(searchQuery.toLowerCase()),
    );
  }, [products, searchQuery]);

  const handleRedeemClick = (product: Product) => {
    setSelectedProduct(product);
    setIsModalOpen(true);
  };

  const handleConfirmRedeem = () => {
    if (!selectedProduct) return;

    startTransition(async () => {
      const tid = toast.loading(`Sedang memproses penukaran...`);
      try {
        const result = await redeemRewardAction({
          product_id: selectedProduct.id,
        });

        if (!result.success) throw new Error(result.error);

        toast.success(`Berhasil! Silakan ambil hadiahmu di Vihara.`, {
          id: tid,
        });
        setIsModalOpen(false);
      } catch (error: unknown) {
        if (error instanceof Error) {
          toast.error(error.message, { id: tid });
        } else {
          toast.error("Terjadi kesalahan sistem", { id: tid });
        }
      }
    });
  };

  return (
    <div className="space-y-8 pb-20 animate-in fade-in duration-700">
      <PageHeader
        title="KATALOG"
        highlightText="PRODUK"
        subtitle="Tukarkan poin Anda dengan berbagai hadiah menarik."
        icon={<Gift size={24} className="text-orange-500" />}
        themeColor="orange"
      />

      <div className="flex flex-col md:flex-row gap-5">
        <div className="w-full md:w-1/3 p-6 bg-linear-to-br from-orange-500 to-amber-500 rounded-[1.5rem] text-white flex items-center justify-between overflow-hidden relative shadow-[0_8px_30px_rgb(234,88,12,0.25)]">
          <Sparkles
            size={100}
            className="absolute -right-6 -bottom-6 opacity-20 rotate-12"
          />
          <div className="relative z-10">
            <p className="text-[10px] font-black uppercase tracking-[0.2em] opacity-90 drop-shadow-sm">
              Saldo Poin Kamu
            </p>
            <p className="text-4xl font-black leading-none mt-2 drop-shadow-md">
              {userPoints.toLocaleString()}{" "}
              <span className="text-sm font-bold opacity-80 tracking-widest uppercase">
                Pts
              </span>
            </p>
          </div>
          <div className="relative z-10 p-3 bg-white/20 backdrop-blur-md rounded-2xl border border-white/30 shadow-sm">
            <Wallet size={28} className="text-white" />
          </div>
        </div>

        <div className="w-full md:w-2/3">
          <AppCard className="p-2 bg-white border-slate-200 shadow-sm rounded-[1.5rem] h-full flex flex-col justify-center">
            <div className="relative">
              <Search
                className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
                size={20}
              />
              <Input
                placeholder="Cari nama barang atau suvenir..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-12 h-14 bg-slate-50 border-transparent rounded-[1rem] focus-visible:ring-orange-500 font-bold text-sm"
              />
            </div>
          </AppCard>
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
        {filteredProducts.length > 0 ? (
          filteredProducts.map((p) => (
            <ProductCard
              key={p.id}
              product={p}
              onRedeem={handleRedeemClick}
              isPending={isPending}
              userPoints={userPoints}
            />
          ))
        ) : (
          <div className="col-span-full py-24 text-center bg-white rounded-[2rem] border border-dashed border-slate-200">
            <Package size={48} className="mx-auto text-slate-200 mb-4" />
            <h3 className="text-lg font-bold text-slate-700">
              Produk Tidak Ditemukan
            </h3>
            <p className="text-slate-400 text-sm font-medium italic mt-1 px-10">
              {searchQuery
                ? "Coba kata kunci lain."
                : "Belum ada hadiah yang tersedia saat ini."}
            </p>
          </div>
        )}
      </div>

      <AppModal
        isOpen={isModalOpen}
        onClose={() => !isPending && setIsModalOpen(false)}
        title="Konfirmasi Penukaran"
        variant="orange"
      >
        <div className="space-y-5 pt-2">
          <span className="space-y-3 pt-2 block">
            <span className="p-4 bg-orange-50 rounded-2xl border border-orange-100 flex items-start gap-3">
              <AlertCircle
                className="text-orange-600 shrink-0 mt-0.5"
                size={20}
              />
              <span className="text-sm text-orange-900 leading-relaxed block font-medium">
                Tukar poin dengan <strong>{selectedProduct?.name}</strong>{" "}
                seharga <strong>{selectedProduct?.price} Poin</strong>?
              </span>
            </span>
            <span className="text-[10px] text-slate-400 italic text-center uppercase tracking-widest block font-bold">
              Poin akan otomatis terpotong dari saldo Anda.
            </span>
          </span>
          <div className="flex gap-3 w-full">
            <AppButton
              variant="outline"
              className="flex-1 rounded-xl h-11"
              onClick={() => setIsModalOpen(false)}
              disabled={isPending}
            >
              Batal
            </AppButton>
            <AppButton
              variant="orange"
              className="flex-1 rounded-xl h-11"
              onClick={handleConfirmRedeem}
              isLoading={isPending}
            >
              Ya, Tukar Sekarang
            </AppButton>
          </div>
        </div>
      </AppModal>
    </div>
  );
}
