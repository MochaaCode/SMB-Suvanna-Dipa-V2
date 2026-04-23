/* eslint-disable @typescript-eslint/no-explicit-any */
"use server";

import { createClient } from "@/lib/supabase/server";

export async function getPembinaDashboardStats() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) throw new Error("Sesi tidak valid atau telah berakhir.");

  try {
    const { data: classes } = await supabase
      .from("classes")
      .select("id, name, teacher_id, assistant_ids")
      .eq("is_deleted", false);

    const myClass = classes?.find(
      (c) =>
        c.teacher_id === user.id ||
        (c.assistant_ids && c.assistant_ids.includes(user.id)),
    );

    if (!myClass) {
      return {
        className: "Belum Punya Kelas",
        stats: { totalStudents: 0, weeklyAttendance: 0, birthdaysCount: 0 },
        birthdays: [],
        recentLogs: [],
        upcomingSchedules: [],
      };
    }

    const { data: students } = await supabase
      .from("profiles")
      .select("id, full_name, birth_date")
      .eq("role", "siswa")
      .eq("class_id", myClass.id)
      .eq("is_deleted", false);

    const studentIds = students?.map((s) => s.id) || [];

    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const nextWeek = new Date(today);
    nextWeek.setDate(today.getDate() + 7);

    const upcomingBirthdays = (students || [])
      .filter((s) => {
        if (!s.birth_date) return false;
        const bDate = new Date(s.birth_date);
        const bThisYear = new Date(
          today.getFullYear(),
          bDate.getMonth(),
          bDate.getDate(),
        );
        const bNextYear = new Date(
          today.getFullYear() + 1,
          bDate.getMonth(),
          bDate.getDate(),
        );

        return (
          (bThisYear >= today && bThisYear <= nextWeek) ||
          (bNextYear >= today && bNextYear <= nextWeek)
        );
      })
      .map((s) => ({
        id: s.id,
        name: s.full_name,
        date: s.birth_date,
      }));

    const todayWIB = new Date().toLocaleDateString("en-CA", {
      timeZone: "Asia/Jakarta",
    });
    const startOfDay = `${todayWIB}T00:00:00+07:00`;

    const startOfWeek = new Date(today);
    startOfWeek.setDate(today.getDate() - today.getDay());
    const startOfWeekStr = startOfWeek.toISOString();

    const [attendanceRes, recentLogsRes, schedulesRes] = await Promise.all([
      studentIds.length > 0
        ? supabase
            .from("attendance_logs")
            .select("id", { count: "exact", head: true })
            .in("profile_id", studentIds)
            .gte("scan_time", startOfWeekStr)
        : { count: 0 },
      studentIds.length > 0
        ? supabase
            .from("attendance_logs")
            .select(
              `id, status, scan_time, method, profiles!profile_id(full_name), schedules(title)`,
            )
            .in("profile_id", studentIds)
            .order("scan_time", { ascending: false })
            .limit(5)
        : { data: [] },
      supabase
        .from("schedules")
        .select("id, title, event_date, is_announcement, class:classes(name)")
        .eq("is_deleted", false)
        .gte("event_date", startOfDay)
        .or(`class_id.eq.${myClass.id},class_id.is.null`)
        .order("event_date", { ascending: true })
        .limit(3),
    ]);

    return {
      className: myClass.name,
      stats: {
        totalStudents: students?.length || 0,
        weeklyAttendance: attendanceRes.count || 0,
        birthdaysCount: upcomingBirthdays.length,
      },
      birthdays: upcomingBirthdays,
      recentLogs: recentLogsRes.data || [],
      upcomingSchedules: schedulesRes.data || [],
    };
  } catch (error: any) {
    throw new Error("Gagal memuat data dashboard: " + error.message);
  }
}
