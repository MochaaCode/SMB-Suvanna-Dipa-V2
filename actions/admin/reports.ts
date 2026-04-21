/* eslint-disable @typescript-eslint/no-explicit-any */
"use server";

import { createAdminClient } from "@/lib/supabase/admin";

export interface RichReportData {
  "Nama Lengkap": string;
  Usia: string;
  Email: string;
  "No. Telepon": string;
  Kelas: string;
  "Kartu RFID": string;
  "Total Poin": number;
  "Rutin Hadir": number;
  "Barang Dibeli": string;
  "Status Keaktifan": string;
}

export interface ChartAnalytics {
  attendanceByMonth: { month: string; hadir: number }[];
  classStats: { name: string; count: number; avgAge: string }[];
}

export async function getComprehensiveReportData() {
  const supabaseAdmin = createAdminClient();

  // 1. Tarik Data Profil + Semua Relasinya secara Spesifik (Fix Relasi Ganda)
  const { data: profiles, error } = await supabaseAdmin
    .from("profiles")
    .select(
      `
      id, full_name, birth_date, phone_number, parent_phone_number, points,
      classes!profiles_class_id_fkey (name),
      attendance_logs!attendance_logs_profile_id_fkey (status, scan_time),
      product_orders!product_orders_user_id_fkey ( products(name) ),
      rfid_tags!rfid_tags_profile_id_fkey (uid)
    `,
    )
    .eq("role", "siswa")
    .eq("is_deleted", false);

  if (error) throw new Error("Gagal mengambil data laporan: " + error.message);

  // 2. Tarik Data Email dari Auth (Bypass RLS)
  const { data: authData } = await supabaseAdmin.auth.admin.listUsers();
  const emailMap = new Map(authData.users.map((u) => [u.id, u.email]));

  // VARIABEL UNTUK CHARTS
  const attendanceMonthlyMap: Record<string, number> = {};
  const classMap: Record<string, { count: number; totalAge: number }> = {};

  // 3. Transformasi Data
  const richData: RichReportData[] = (profiles || []).map((s: any) => {
    // --- Kalkulasi Usia ---
    let ageNumber = 0;
    let ageStr = "Belum Diisi";
    if (s.birth_date) {
      const birth = new Date(s.birth_date);
      const diff = Date.now() - birth.getTime();
      ageNumber = Math.abs(new Date(diff).getUTCFullYear() - 1970);
      ageStr = `${ageNumber} Tahun`;
    }

    // --- Kontak & Email ---
    const email = emailMap.get(s.id) || "Tidak Ada Email";
    const phone = s.phone_number || s.parent_phone_number || "Tidak Ada Kontak";

    // --- Kartu RFID ---
    const rfid =
      s.rfid_tags?.length > 0 ? s.rfid_tags[0].uid : "Belum Terpasang";

    // --- Barang Dibeli ---
    const purchases = s.product_orders
      ?.map((po: any) => po.products?.name)
      .filter(Boolean);
    const purchaseStr =
      purchases?.length > 0 ? purchases.join(", ") : "Belum Pernah Tukar";

    // --- Kehadiran & Chart Bulanan ---
    let totalHadir = 0;
    s.attendance_logs?.forEach((log: any) => {
      if (log.status === "hadir" || log.status === "terlambat") {
        totalHadir++;
        // Hitung untuk Chart Bulanan
        const monthKey = new Date(log.scan_time).toLocaleDateString("id-ID", {
          month: "short",
          year: "numeric",
        });
        attendanceMonthlyMap[monthKey] =
          (attendanceMonthlyMap[monthKey] || 0) + 1;
      }
    });

    // --- Kelas & Chart Kelas ---
    const className = s.classes?.name || "Tanpa Kelas";
    if (!classMap[className]) classMap[className] = { count: 0, totalAge: 0 };
    classMap[className].count += 1;
    classMap[className].totalAge += ageNumber;

    return {
      "Nama Lengkap": s.full_name || "Tanpa Nama",
      Usia: ageStr,
      Email: email,
      "No. Telepon": phone,
      Kelas: className,
      "Kartu RFID": rfid,
      "Total Poin": s.points || 0,
      "Rutin Hadir": totalHadir,
      "Barang Dibeli": purchaseStr,
      "Status Keaktifan":
        totalHadir >= 12 ? "Sangat Aktif" : totalHadir > 0 ? "Aktif" : "Pasif",
    };
  });

  // FORMATTING DATA CHARTS
  const attendanceByMonth = Object.entries(attendanceMonthlyMap).map(
    ([month, hadir]) => ({ month, hadir }),
  );

  const classStats = Object.entries(classMap).map(([name, stats]) => ({
    name,
    count: stats.count,
    avgAge: stats.count > 0 ? (stats.totalAge / stats.count).toFixed(1) : "0",
  }));

  return {
    tableData: richData.sort((a, b) => b["Total Poin"] - a["Total Poin"]),
    analytics: { attendanceByMonth, classStats },
  };
}
