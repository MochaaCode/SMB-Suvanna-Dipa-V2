"use server";

import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";

// IMPORT TIPE KETAT DARI BASE TABLES
import type { Profile, PointHistory, AttendanceLog, ProductOrder } from "@/types";

// ==========================================
// TIPE KEMBALIAN KHUSUS UNTUK ACTIONS INI
// ==========================================
export interface StudentSummary extends Pick<
  Profile,
  "id" | "full_name" | "buddhist_name" | "points" | "role"
> {
  classes: { name: string } | null;
}

export interface PointMutation extends PointHistory {
  admin: { full_name: string | null } | null;
}

export interface AttendanceLogDetail extends AttendanceLog {
  schedule: { title: string; event_date: string } | null;
}

export interface OrderLogDetail extends ProductOrder {
  product: { name: string; price: number } | null;
}

export interface StudentDetailedLogs {
  mutations: PointMutation[];
  attendance: AttendanceLogDetail[];
  orders: OrderLogDetail[];
}

// HELPER: Proteksi Akses Log Admin
async function ensureAdmin() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) throw new Error("Sesi berakhir, silakan login kembali.");

  const { data: profile } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", user.id)
    .single();

  if (profile?.role !== "admin")
    throw new Error("Akses ditolak: Anda bukan admin.");

  return createAdminClient();
}

/**
 * 1. AMBIL DAFTAR SISWA (SUMMARY)
 */
export async function getStudentsSummary(): Promise<StudentSummary[]> {
  const supabaseAdmin = await ensureAdmin();
  const { data, error } = await supabaseAdmin
    .from("profiles")
    .select(
      `
      id, 
      full_name, 
      buddhist_name, 
      points, 
      role,
      classes:class_id (name)
    `,
    )
    .eq("role", "siswa")
    .eq("is_deleted", false)
    .order("full_name", { ascending: true });

  if (error) throw new Error(error.message);

  return data as unknown as StudentSummary[];
}

/**
 * 2. AMBIL SEMUA RIWAYAT SISWA (DETAIL)
 * Mengambil Mutasi Poin, Absensi, dan Orderan secara paralel
 */
export async function getStudentDetailedLogs(
  studentId: string,
): Promise<StudentDetailedLogs> {
  const supabaseAdmin = await ensureAdmin();

  const [pointsRes, attendanceRes, ordersRes] = await Promise.all([
    // A. Riwayat Poin (Mutasi)
    supabaseAdmin
      .from("point_history")
      .select(`*, admin:given_by(full_name)`)
      .eq("user_id", studentId)
      .order("created_at", { ascending: false }),

    // B. Riwayat Kehadiran
    supabaseAdmin
      .from("attendance_logs")
      .select(`*, schedule:schedule_id(title, event_date)`)
      .eq("profile_id", studentId)
      .order("scan_time", { ascending: false }),

    // C. Riwayat Order Hadiah
    supabaseAdmin
      .from("product_orders")
      .select(`*, product:product_id(name, price)`)
      .eq("user_id", studentId)
      .order("created_at", { ascending: false }),
  ]);

  return {
    mutations: (pointsRes.data as unknown as PointMutation[]) || [],
    attendance: (attendanceRes.data as unknown as AttendanceLogDetail[]) || [],
    orders: (ordersRes.data as unknown as OrderLogDetail[]) || [],
  };
}
