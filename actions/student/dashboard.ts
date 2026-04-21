/* eslint-disable @typescript-eslint/no-explicit-any */
"use server";

import { createClient } from "@/lib/supabase/server";

export async function getStudentDashboardStats() {
  const supabase = await createClient();

  const {
    data: { user },
    error: authErr,
  } = await supabase.auth.getUser();
  if (authErr || !user)
    throw new Error("Sesi tidak valid atau telah berakhir.");

  try {
    // Ambil tanggal hari ini di zona waktu WIB untuk filter jadwal
    const todayWIB = new Date().toLocaleDateString("en-CA", {
      timeZone: "Asia/Jakarta",
    });
    const startOfDay = `${todayWIB}T00:00:00+07:00`;

    const [profileRes, attRes, ordersRes, scheduleRes, activityRes] =
      await Promise.all([
        supabase
          .from("profiles")
          .select("points, classes!profiles_class_id_fkey(name)")
          .eq("id", user.id)
          .single(),

        supabase
          .from("attendance_logs")
          .select("id", { count: "exact", head: true })
          .eq("profile_id", user.id)
          .eq("status", "hadir"),

        supabase
          .from("product_orders")
          .select("id", { count: "exact", head: true })
          .eq("user_id", user.id)
          .eq("status", "pending"),

        // QUERY BARU: Ambil 1 jadwal terdekat mulai dari hari ini
        supabase
          .from("schedules")
          .select("title, event_date, content")
          .eq("is_deleted", false)
          .gte("event_date", startOfDay)
          .order("event_date", { ascending: true })
          .limit(1)
          .maybeSingle(),

        // QUERY BARU: Ambil 5 riwayat poin/aktivitas terakhir
        supabase
          .from("point_history")
          .select("id, amount, type, description, created_at")
          .eq("user_id", user.id)
          .order("created_at", { ascending: false })
          .limit(5),
      ]);

    type ExpectedProfile = {
      points: number;
      classes: { name: string } | { name: string }[] | null;
    };

    const profileData = profileRes.data as unknown as ExpectedProfile | null;

    const cls = Array.isArray(profileData?.classes)
      ? profileData?.classes[0]
      : profileData?.classes;

    return {
      points: profileData?.points || 0,
      className: cls?.name || "Belum Masuk Kelas",
      totalAttendance: attRes.count || 0,
      pendingOrders: ordersRes.count || 0,
      upcomingSchedule: scheduleRes.data || null,
      recentActivities: activityRes.data || [],
    };
  } catch (error: any) {
    throw new Error("Gagal memuat data dashboard: " + error.message);
  }
}
