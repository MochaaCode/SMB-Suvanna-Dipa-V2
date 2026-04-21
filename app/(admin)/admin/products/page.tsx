import { Metadata } from "next";
import { getProducts } from "@/actions/admin/products";
import { ProductManagementUI } from "@/components/admin/products/ProductManagementUI";

export const metadata: Metadata = {
  title: "Manajemen Produk SMB",
  description: "Kelola katalog produk hadiah untuk point shop di SMB",
};

export default async function ProductsPage() {
  // 1. Ambil data produk awal dari server (yang is_deleted = false)
  const initialProducts = await getProducts();

  return (
    // Serahkan layouting sepenuhnya ke ManagementUI
    <ProductManagementUI initialProducts={initialProducts} />
  );
}
