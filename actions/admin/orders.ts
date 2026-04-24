"use server";

import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { revalidatePath } from "next/cache";

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

  return data as unknown as OrderWithDetails[];
}

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
  revalidatePath("/admin/dashboard");
  return { success: true };
}

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
