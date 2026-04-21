"use server";

import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { revalidatePath } from "next/cache";

// IMPORT TIPE KETAT
import type { ProductOrder, OrderStatus } from "@/types";

export interface OrderWithDetails extends ProductOrder {
  profiles: {
    full_name: string | null;
    buddhist_name: string | null;
  } | null;
  products: {
    name: string | null;
    image_url: string | null;
    price: number | null;
  } | null;
}

// HELPER: Proteksi Admin
async function ensureAdmin() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) throw new Error("Sesi berakhir.");

  const { data: profile } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", user.id)
    .single();

  if (profile?.role !== "admin") throw new Error("Akses ditolak!");

  return createAdminClient();
}

/**
 * 1. AMBIL SEMUA ORDERAN
 */
export async function getOrders(): Promise<OrderWithDetails[]> {
  const supabaseAdmin = await ensureAdmin();
  const { data, error } = await supabaseAdmin
    .from("product_orders")
    .select(
      `
      *,
      profiles:user_id (full_name, buddhist_name),
      products:product_id (name, image_url, price)
    `,
    )
    .order("created_at", { ascending: false });

  if (error) throw new Error("Gagal memuat pesanan.");

  // Type casting hasil join
  return data as unknown as OrderWithDetails[];
}

/**
 * 2. UPDATE STATUS ORDERAN
 * NOTE: Trigger Database lu akan handle pengembalian poin jika status 'cancelled'
 */
export async function updateOrderStatus(
  orderId: number,
  newStatus: OrderStatus,
) {
  const supabaseAdmin = await ensureAdmin();

  const { error } = await supabaseAdmin
    .from("product_orders")
    .update({
      status: newStatus,
      updated_at: new Date().toISOString(),
    })
    .eq("id", orderId);

  if (error) throw new Error("Gagal update status: " + error.message);

  revalidatePath("/admin/orders");
  revalidatePath("/admin/dashboard"); // Penting jika ada summary order di dashboard
  return { success: true };
}

/**
 * 3. HAPUS LOG ORDERAN
 */
export async function deleteOrderLog(orderId: number) {
  const supabaseAdmin = await ensureAdmin();
  const { error } = await supabaseAdmin
    .from("product_orders")
    .delete()
    .eq("id", orderId);

  if (error) throw new Error("Gagal hapus log.");

  revalidatePath("/admin/orders");
  return { success: true };
}
