"use client";

import { useState, useMemo } from "react";
import {
  Store,
  Plus,
  PackageSearch,
  Search,
  Trash2,
  ArrowLeft,
} from "lucide-react";

import { PageHeader } from "../../shared/PageHeader";
import { AppButton } from "../../shared/AppButton";
import AddProductModal from "./AddProductModal";
import ProductList from "./ProductList";

import { Input } from "@/components/ui/input";
import { useDebounce } from "@/hooks/useDebounce";

import type { Product } from "@/types";

interface ProductManagementUIProps {
  activeProducts: Product[];
  archivedProducts: Product[];
}

export function ProductManagementUI({
  activeProducts,
  archivedProducts,
}: ProductManagementUIProps) {
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isTrashMode, setIsTrashMode] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const debouncedSearch = useDebounce(searchQuery, 300);

  // OPTIMASI: Filtering di sisi client menggunakan useMemo (Super Cepat)
  const filteredProducts = useMemo(() => {
    const baseList = isTrashMode ? archivedProducts : activeProducts;
    if (!debouncedSearch) return baseList;

    return baseList.filter((p) =>
      p.name.toLowerCase().includes(debouncedSearch.toLowerCase()),
    );
  }, [activeProducts, archivedProducts, isTrashMode, debouncedSearch]);

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-top-4 duration-700">
      <PageHeader
        title={isTrashMode ? "TEMPAT" : "KATALOG"}
        highlightText={isTrashMode ? "SAMPAH" : "PRODUK"}
        icon={isTrashMode ? <Trash2 size={24} /> : <Store size={24} />}
        subtitle={
          isTrashMode
            ? "Manajemen produk yang telah ditarik dari toko"
            : "Kelola barang hadiah Point Shop untuk memotivasi siswa"
        }
        themeColor={isTrashMode ? "red" : "orange"}
        rightContent={
          <div className="flex items-center gap-3">
            <AppButton
              variant={isTrashMode ? "secondary" : "red"}
              onClick={() => setIsTrashMode(!isTrashMode)}
              leftIcon={
                isTrashMode ? <ArrowLeft size={16} /> : <Trash2 size={16} />
              }
              className="font-bold rounded-[1rem] h-10 text-xs"
            >
              {isTrashMode ? "Kembali ke Toko" : "Tempat Sampah"}
            </AppButton>

            {!isTrashMode && (
              <AppButton
                onClick={() => setIsAddModalOpen(true)}
                leftIcon={<Plus size={16} />}
                className="font-bold shadow-md rounded-[1rem] h-10 text-xs"
              >
                Tambah Produk
              </AppButton>
            )}
          </div>
        }
      />

      {/* SEARCH BAR SECTION */}
      <div className="relative max-w-md">
        <Search
          className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400"
          size={18}
        />
        <Input
          placeholder="Cari nama produk..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="pl-11 h-11 rounded-[1rem] border-slate-200 focus-visible:ring-orange-500 bg-white shadow-sm font-medium"
        />
      </div>

      {/* GRID PRODUK */}
      {filteredProducts.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-24 text-center bg-white rounded-[1rem] border border-dashed border-slate-300 shadow-sm">
          <div className="p-5 bg-slate-50 rounded-xl mb-5 border border-slate-100">
            <PackageSearch size={40} className="text-slate-400" />
          </div>
          <h3 className="text-xl font-bold text-slate-800 mb-2">
            {searchQuery
              ? "Produk Tidak Ditemukan"
              : isTrashMode
                ? "Tempat Sampah Kosong"
                : "Katalog Masih Kosong"}
          </h3>
          <p className="text-slate-500 max-w-sm mb-8 font-medium leading-relaxed text-sm px-6">
            {searchQuery
              ? `Tidak ada produk bernama "${searchQuery}" di daftar ini.`
              : isTrashMode
                ? "Tidak ada produk yang diarsipkan saat ini."
                : "Silakan tambahkan produk menarik seperti alat tulis atau mainan untuk memotivasi siswa."}
          </p>
          {!isTrashMode && !searchQuery && (
            <AppButton
              onClick={() => setIsAddModalOpen(true)}
              className="rounded-[1rem]"
            >
              Mulai Tambah Produk
            </AppButton>
          )}
        </div>
      ) : (
        <ProductList products={filteredProducts} isTrashMode={isTrashMode} />
      )}

      <AddProductModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
      />
    </div>
  );
}
