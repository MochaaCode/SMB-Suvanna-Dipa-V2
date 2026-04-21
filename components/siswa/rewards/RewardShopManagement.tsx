/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useState, useTransition } from "react";
import {
  Gift,
  Wallet,
  Search,
  Filter,
  Package,
  AlertCircle,
} from "lucide-react";
import { PageHeader } from "@/components/shared/PageHeader";
import { AppCard } from "@/components/shared/AppCard";
import { Input } from "@/components/ui/input";
import { ProductCard } from "./ProductCard";
import { Product } from "@/types";
import { redeemRewardAction } from "@/actions/student/rewards";
import toast from "react-hot-toast";
import { AppButton } from "@/components/shared/AppButton";
import { AppModal } from "@/components/shared/AppModal"; // Import komponen modal

interface RewardShopManagementProps {
  products: Product[];
  userPoints: number;
}

export function RewardShopManagement({
  products,
  userPoints,
}: RewardShopManagementProps) {
  const [isPending, startTransition] = useTransition();

  // STATE UNTUK MODAL KONFIRMASI
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

  // Trigger saat tombol "Tukar" di klik pada Card
  const handleRedeemClick = (product: Product) => {
    setSelectedProduct(product);
    setIsModalOpen(true);
  };

  // Eksekusi saat setuju di dalam Modal
  const handleConfirmRedeem = () => {
    if (!selectedProduct) return;

    startTransition(async () => {
      const tid = toast.loading(`Sedang memproses penukaran...`);
      try {
        // PERBAIKAN: Mengirim ID sebagai NUMBER murni (bukan String lagi)
        const result = await redeemRewardAction({
          product_id: selectedProduct.id,
        });

        if (!result.success) throw new Error(result.error);

        toast.success(`Berhasil! Silakan ambil hadiahmu di kantor pembina.`, {
          id: tid,
        });
        setIsModalOpen(false); // Tutup modal setelah sukses
      } catch (error: any) {
        toast.error(error.message, { id: tid });
      }
    });
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-700">
      <PageHeader
        title="Toko"
        highlightText="Hadiah"
        subtitle="Tukarkan poin hasil kerajinanmu dengan hadiah menarik"
        icon={<Gift size={24} />}
        themeColor="orange"
        rightContent={
          <div className="bg-orange-600 text-white px-5 py-3 rounded-2xl flex items-center gap-3 shadow-lg shadow-orange-200">
            <Wallet size={20} />
            <div>
              <p className="text-[10px] font-bold uppercase opacity-80 leading-none">
                Saldo Poin Kamu
              </p>
              <p className="text-xl font-black leading-none mt-1">
                {userPoints}
              </p>
            </div>
          </div>
        }
      />

      {/* FILTER & SEARCH */}
      <AppCard className="p-4 md:p-4 bg-slate-50/50 border-slate-200">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="relative flex-1">
            <Search
              className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
              size={18}
            />
            <Input
              placeholder="Cari hadiah..."
              className="pl-10 h-11 bg-white border-slate-200 focus-visible:ring-orange-500"
            />
          </div>
          <AppButton
            variant="outline"
            className="bg-white"
            leftIcon={<Filter size={18} />}
          >
            Filter
          </AppButton>
        </div>
      </AppCard>

      {/* PRODUCT GRID */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {products.length > 0 ? (
          products.map((p) => (
            <ProductCard
              key={p.id}
              product={p}
              onRedeem={handleRedeemClick} // Gunakan fungsi pembuka modal
              isPending={isPending}
              userPoints={userPoints}
            />
          ))
        ) : (
          <div className="col-span-full py-20 text-center space-y-3 bg-white rounded-3xl border border-dashed border-slate-200">
            <Package size={48} className="mx-auto text-slate-200" />
            <p className="text-slate-500 font-medium italic">
              Belum ada hadiah yang tersedia saat ini.
            </p>
          </div>
        )}
      </div>

      {/* =========================================
          MODAL KONFIRMASI UX ENTERPRISE
          ========================================= */}
      <AppModal
        isOpen={isModalOpen}
        onClose={() => !isPending && setIsModalOpen(false)}
        title="Konfirmasi Penukaran"
        description={
          // PERBAIKAN: Semua div dan p diubah menjadi span. Ditambahkan class "block" agar perilakunya sama seperti div/p.
          <span className="space-y-3 pt-2 block">
            <span className="p-4 bg-orange-50 rounded-xl border border-orange-100 flex items-start gap-3">
              <AlertCircle
                className="text-orange-600 shrink-0 mt-0.5"
                size={20}
              />
              <span className="text-sm text-orange-900 leading-relaxed block">
                Apakah Anda yakin ingin menukar hadiah{" "}
                <strong>{selectedProduct?.name}</strong> ini seharga{" "}
                <strong>{selectedProduct?.price} Poin</strong>?
              </span>
            </span>
            <span className="text-[10px] text-slate-400 italic text-center uppercase tracking-widest block">
              Poin akan otomatis terpotong dari saldo Anda.
            </span>
          </span>
        }
        footer={
          <div className="flex gap-3 w-full">
            <AppButton
              variant="outline"
              className="flex-1"
              onClick={() => setIsModalOpen(false)}
              disabled={isPending}
            >
              Batal
            </AppButton>
            <AppButton
              variant="orange"
              className="flex-1"
              onClick={handleConfirmRedeem}
              isLoading={isPending}
            >
              Ya, Tukar
            </AppButton>
          </div>
        }
      />
    </div>
  );
}
