/* eslint-disable @typescript-eslint/no-explicit-any */
"use server";

import { createClient } from "@/lib/supabase/server";

export interface PembinaAttendanceLog {
  id: number;
  status: string;
  scan_time: string;
  method: string;
  profiles: { full_name: string | null } | null;
  schedules: { title: string } | null;
}

export interface PembinaPointLog {
  id: number;
  amount: number;
  type: "earning" | "spending";
  description: string;
  created_at: string;
  profiles: { full_name: string | null } | null;
}

export interface PembinaLogsData {
  attendance: PembinaAttendanceLog[];
  points: PembinaPointLog[];
}

export async function getPembinaActivityLogs(): Promise<PembinaLogsData> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) throw new Error("Sesi tidak valid.");

  const { data: profile } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", user.id)
    .single();

  if (profile?.role !== "pembina") {
    throw new Error("FORBIDDEN_ROLE");
  }

  try {
    const { data: myClasses } = await supabase
      .from("classes")
      .select("id")
      .or(`teacher_id.eq.${user.id},assistant_ids.cs.{${user.id}}`)
      .eq("is_deleted", false);

    const classIds = myClasses?.map((c) => c.id) || [];

    if (classIds.length === 0) {
      return { attendance: [], points: [] };
    }

    const { data: students } = await supabase
      .from("profiles")
      .select("id")
      .in("class_id", classIds)
      .eq("role", "siswa")
      .eq("is_deleted", false);

    const studentIds = students?.map((s) => s.id) || [];

    if (studentIds.length === 0) {
      return { attendance: [], points: [] };
    }

    const [attendanceRes, pointsRes] = await Promise.all([
      supabase
        .from("attendance_logs")
        .select(
          "id, status, scan_time, method, profiles!attendance_logs_profile_id_fkey(full_name), schedules!attendance_logs_schedule_id_fkey(title)",
        )
        .in("profile_id", studentIds)
        .order("scan_time", { ascending: false })
        .limit(100),

      supabase
        .from("point_history")
        .select(
          "id, amount, type, description, created_at, profiles!point_history_user_id_fkey(full_name)",
        )
        .in("user_id", studentIds)
        .order("created_at", { ascending: false })
        .limit(100),
    ]);

    if (attendanceRes.error) {
      console.error("Attendance query error:", attendanceRes.error);
    }
    if (pointsRes.error) {
      console.error("Points query error:", pointsRes.error);
    }

    return {
      attendance: (attendanceRes.data ||
        []) as unknown as PembinaAttendanceLog[],
      points: (pointsRes.data || []) as unknown as PembinaPointLog[],
    };
  } catch (error: any) {
    throw new Error("Gagal memuat riwayat aktivitas: " + error.message);
  }
}
