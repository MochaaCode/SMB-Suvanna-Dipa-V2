"use server";

import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";

// 1. IMPORT TIPE DATA KETAT YANG SUDAH KITA BUAT
import type {
  ProductOrderWithRelations,
  AttendanceLogWithProfile,
  PointHistoryWithProfile,
  Profile,
  DailyVisitorStat,
  PasswordResetToken,
} from "@/types";

// Proteksi Dashboard
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

  if (profile?.role !== "admin") throw new Error("Akses ditolak.");

  return createAdminClient();
}

export async function getLiveDashboardData() {
  const supabaseAdmin = await ensureAdmin();

  const today = new Date().toLocaleDateString("en-CA", {
    timeZone: "Asia/Jakarta",
  });

  const [
    ordersRes,
    attendanceRes,
    pointsRes,
    studentsRes,
    visitorRes,
    topPagesRes,
    resetTokensRes,
  ] = await Promise.all([
    // 1. Antrean Hadiah (Pending)
    supabaseAdmin
      .from("product_orders")
      .select(
        "id, created_at, profiles:user_id(full_name), products:product_id(name, image_url)",
      )
      .eq("status", "pending")
      .order("created_at", { ascending: true })
      .limit(5),

    // 2. Live Presensi
    supabaseAdmin
      .from("attendance_logs")
      .select("id, created_at, status, profiles:profile_id(full_name)")
      .gte("created_at", `${today}T00:00:00Z`)
      .order("created_at", { ascending: false })
      .limit(5),

    // 3. Mutasi Poin
    supabaseAdmin
      .from("point_history")
      .select(
        "id, created_at, amount, type, description, profiles:user_id(full_name)",
      )
      .order("created_at", { ascending: false })
      .limit(5),

    // 4. Daftar Siswa (Ultah Check)
    supabaseAdmin
      .from("profiles")
      .select("id, full_name, birth_date, gender")
      .eq("role", "siswa")
      .eq("is_deleted", false),

    // 5. Statistik Pengunjung
    supabaseAdmin
      .from("daily_visitor_stats")
      .select("date, views")
      .order("date", { ascending: false })
      .limit(7),

    // 6. Top Pages (Audit UX)
    supabaseAdmin
      .from("page_views")
      .select("page_path, page_name")
      .order("created_at", { ascending: false })
      .limit(50),

    // 7. Reset Tokens (Security Log)
    supabaseAdmin
      .from("password_reset_tokens")
      .select("id, email, created_at, expires_at, is_used")
      .order("created_at", { ascending: false })
      .limit(5),
  ]);

  // Agregasi Top Pages
  const pageCounts: Record<string, number> = {};
  topPagesRes.data?.forEach((log) => {
    const name = log.page_name || log.page_path;
    pageCounts[name] = (pageCounts[name] || 0) + 1;
  });

  const topPages = Object.entries(pageCounts)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5)
    .map(([name, views]) => ({ name, views }));

  // 2. TYPE CASTING: Menjembatani hasil Supabase dengan Strict Types kita
  return {
    pendingOrders:
      (ordersRes.data as unknown as ProductOrderWithRelations[]) || [],
    liveAttendance:
      (attendanceRes.data as unknown as AttendanceLogWithProfile[]) || [],
    pointHistory:
      (pointsRes.data as unknown as PointHistoryWithProfile[]) || [],
    allStudents: (studentsRes.data as unknown as Profile[]) || [],
    visitorChart: (
      (visitorRes.data as unknown as DailyVisitorStat[]) || []
    ).reverse(),
    topPages: topPages,
    resetLogs: (resetTokensRes.data as unknown as PasswordResetToken[]) || [],
  };
}
