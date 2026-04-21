import { Metadata } from "next";
import { getOrders } from "@/actions/admin/orders";

import { OrderManagementUI } from "@/components/admin/orders/OrderManagementUI";

export const metadata: Metadata = {
  title: "Manajemen Pesanan Siswa",
  description: "Kelola pesanan dan transaksi Point Shop di SMB dengan mudah",
};

export default async function OrdersPage() {
  // Fetch data langsung di server
  const orders = await getOrders();

  return <OrderManagementUI initialOrders={orders} />;
}
