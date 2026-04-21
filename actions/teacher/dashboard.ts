/* eslint-disable @typescript-eslint/no-explicit-any */
"use server";

import { createClient } from "@/lib/supabase/server";

export async function getPembinaDashboardStats() {
  const supabase = await createClient();

  const {
    data: { user },
    error: authErr,
  } = await supabase.auth.getUser();

  if (authErr || !user)
    throw new Error("Sesi tidak valid atau telah berakhir.");

  try {
    const todayWIB = new Date().toLocaleDateString("en-CA", {
      timeZone: "Asia/Jakarta",
    });
    const startOfDay = `${todayWIB}T00:00:00+07:00`;

    const [
      studentsRes,
      attendanceRes,
      pointsRes,
      recentLogsRes,
      upcomingSchedulesRes,
    ] = await Promise.all([
      supabase
        .from("profiles")
        .select("id", { count: "exact", head: true })
        .eq("role", "siswa")
        .eq("is_deleted", false),

      supabase
        .from("attendance_logs")
        .select("id", { count: "exact", head: true })
        .gte("scan_time", startOfDay),

      // Total poin yang pernah diberikan oleh pembina ini
      supabase
        .from("point_history")
        .select("amount")
        .eq("given_by", user.id)
        .eq("type", "earning"),

      // 5 Log Aktivitas Absensi Terbaru
      supabase
        .from("attendance_logs")
        .select(
          `
          id, status, scan_time, method,
          profiles!profile_id(full_name),
          schedules(title)
        `,
        )
        .order("scan_time", { ascending: false })
        .limit(5),

      // 3 Jadwal Terdekat mulai hari ini
      supabase
        .from("schedules")
        .select("id, title, event_date, is_announcement, class:classes(name)")
        .eq("is_deleted", false)
        .gte("event_date", startOfDay)
        .order("event_date", { ascending: true })
        .limit(3),
    ]);

    const totalPointsGiven =
      pointsRes.data?.reduce((acc, curr) => acc + curr.amount, 0) || 0;

    return {
      stats: {
        totalStudents: studentsRes.count || 0,
        todayAttendance: attendanceRes.count || 0,
        pointsDistributed: totalPointsGiven,
      },
      recentLogs: recentLogsRes.data || [],
      upcomingSchedules: upcomingSchedulesRes.data || [],
    };
  } catch (error: any) {
    throw new Error("Gagal memuat data dashboard: " + error.message);
  }
}
