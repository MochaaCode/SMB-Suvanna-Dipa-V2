"use server";

import { createClient } from "@/lib/supabase/server";
import type { OrderStatus, PointHistoryType } from "@/types";

export interface DashboardActiveOrder {
  id: number;
  status: OrderStatus;
  products: { name: string } | null;
  created_at: string;
}

export interface DashboardUpcomingSchedule {
  id: number;
  title: string;
  event_date: string;
  content: string | null;
}

export interface DashboardRecentActivity {
  id: number;
  amount: number;
  type: PointHistoryType;
  description: string;
  created_at: string;
}

export interface DashboardStats {
  studentInfo: {
    id: string;
    fullName: string;
    buddhistName: string | null;
  };
  points: number;
  className: string;
  totalAttendance: number;
  activeOrders: DashboardActiveOrder[];
  upcomingSchedule: DashboardUpcomingSchedule | null;
  recentActivities: DashboardRecentActivity[];
}

export async function getStudentDashboardStats(): Promise<DashboardStats> {
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

    const [profileRes, attRes, ordersRes, scheduleRes, activityRes] =
      await Promise.all([
        supabase
          .from("profiles")
          .select(
            "id, full_name, buddhist_name, points, classes!profiles_class_id_fkey(name)",
          )
          .eq("id", user.id)
          .single(),

        supabase
          .from("attendance_logs")
          .select("id", { count: "exact", head: true })
          .eq("profile_id", user.id)
          .eq("status", "hadir"),

        supabase
          .from("product_orders")
          .select("id, status, products(name), created_at")
          .eq("user_id", user.id)
          .in("status", ["pending", "diproses"])
          .order("created_at", { ascending: false })
          .limit(2),

        supabase
          .from("schedules")
          .select("id, title, event_date, content")
          .eq("is_deleted", false)
          .gte("event_date", startOfDay)
          .order("event_date", { ascending: true })
          .limit(1)
          .maybeSingle(),

        supabase
          .from("point_history")
          .select("id, amount, type, description, created_at")
          .eq("user_id", user.id)
          .order("created_at", { ascending: false })
          .limit(4),
      ]);

    type ProfileWithClass = {
      id: string;
      full_name: string | null;
      buddhist_name: string | null;
      points: number;
      classes: { name: string } | { name: string }[] | null;
    };

    const profileData = profileRes.data as unknown as ProfileWithClass | null;

    const cls = Array.isArray(profileData?.classes)
      ? profileData?.classes[0]
      : profileData?.classes;

    return {
      studentInfo: {
        id: profileData?.id || "",
        fullName: profileData?.full_name || "Siswa",
        buddhistName: profileData?.buddhist_name || null,
      },
      points: profileData?.points || 0,
      className: cls?.name || "Belum Masuk Kelas",
      totalAttendance: attRes.count || 0,
      activeOrders: (ordersRes.data as unknown as DashboardActiveOrder[]) || [],
      upcomingSchedule:
        (scheduleRes.data as unknown as DashboardUpcomingSchedule) || null,
      recentActivities:
        (activityRes.data as unknown as DashboardRecentActivity[]) || [],
    };
  } catch (error: unknown) {
    if (error instanceof Error) {
      throw new Error("Gagal memuat dashboard: " + error.message);
    }
    throw new Error("Gagal memuat dashboard: Kesalahan tidak dikenal.");
  }
}
