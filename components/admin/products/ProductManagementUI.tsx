"use client";

import { useState } from "react";
import { Store, Plus, PackageSearch } from "lucide-react";
import { PageHeader } from "../../shared/PageHeader";
import { AppButton } from "../../shared/AppButton";
import ProductList from "./ProductList";
import AddProductModal from "./AddProductModal";
import ArchiveModal from "./ArchiveModal";

// IMPORT TIPE KETAT
import type { Product } from "@/types";

interface ProductManagementUIProps {
  initialProducts: Product[];
}

export function ProductManagementUI({
  initialProducts,
}: ProductManagementUIProps) {
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-top-4 duration-700">
      {/* HEADER SECTION */}
      <PageHeader
        title="KATALOG"
        highlightText="PRODUK"
        icon={<Store size={24} />}
        subtitle="Kelola barang hadiah Point Shop untuk memotivasi siswa"
        themeColor="orange"
        rightContent={
          <div className="flex items-center gap-3">
            <ArchiveModal />
            <AppButton
              onClick={() => setIsAddModalOpen(true)}
              leftIcon={<Plus size={16} />}
              className="font-bold shadow-md"
            >
              Tambah Produk
            </AppButton>
          </div>
        }
      />

      {/* GRID PRODUK SECTION */}
      {initialProducts.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-24 text-center bg-white rounded-[1rem] border border-dashed border-slate-300 shadow-sm">
          <div className="p-5 bg-slate-50 rounded-xl mb-5 border border-slate-100">
            <PackageSearch size={40} className="text-slate-400" />
          </div>
          <h3 className="text-xl font-bold text-slate-800 mb-2">
            Katalog Masih Kosong
          </h3>
          <p className="text-slate-500 max-w-sm mb-8 font-medium leading-relaxed text-sm">
            Belum ada produk yang terdaftar. Silakan tambahkan produk menarik
            seperti alat tulis atau mainan untuk memotivasi siswa.
          </p>
          <AppButton onClick={() => setIsAddModalOpen(true)}>
            Mulai Tambah Produk
          </AppButton>
        </div>
      ) : (
        <ProductList initialProducts={initialProducts} />
      )}

      {/* MODAL TAMBAH PRODUK */}
      <AddProductModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
      />
    </div>
  );
}
