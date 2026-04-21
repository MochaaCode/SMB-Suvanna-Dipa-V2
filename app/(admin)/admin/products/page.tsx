import { Metadata } from "next";
import { getProducts, getArchivedProducts } from "@/actions/admin/products";
import { ProductManagementUI } from "@/components/admin/products/ProductManagementUI";

export const metadata: Metadata = {
  title: "Manajemen Produk SMB",
  description: "Kelola katalog produk hadiah untuk point shop di SMB",
};

export default async function ProductsPage() {
  // Ambil kedua data secara paralel untuk kecepatan maksimal
  const [activeProducts, archivedProducts] = await Promise.all([
    getProducts(),
    getArchivedProducts(),
  ]);

  return (
    <ProductManagementUI
      activeProducts={activeProducts}
      archivedProducts={archivedProducts}
    />
  );
}
