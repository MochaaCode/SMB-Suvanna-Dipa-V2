"use server";

import { createClient } from "@/lib/supabase/server";
import type {
  AttendanceLogWithProfile,
  ProductOrderWithRelations,
  PointHistory,
} from "@/types";

export interface ActivityData {
  attendance: AttendanceLogWithProfile[];
  orders: ProductOrderWithRelations[];
  points: PointHistory[];
}

export async function getStudentActivityData(): Promise<ActivityData> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) throw new Error("Sesi berakhir, silakan login kembali.");

  const [attendanceRes, ordersRes, pointsRes] = await Promise.all([
    supabase
      .from("attendance_logs")
      .select(
        `
        *,
        schedules:schedule_id(title)
      `,
      )
      .eq("profile_id", user.id)
      .order("scan_time", { ascending: false }),

    supabase
      .from("product_orders")
      .select(
        `
        *,
        products:product_id(name, image_url)
      `,
      )
      .eq("user_id", user.id)
      .order("created_at", { ascending: false }),

    supabase
      .from("point_history")
      .select("*")
      .eq("user_id", user.id)
      .order("created_at", { ascending: false }),
  ]);

  return {
    attendance: (attendanceRes.data ||
      []) as unknown as AttendanceLogWithProfile[],
    orders: (ordersRes.data || []) as unknown as ProductOrderWithRelations[],
    points: (pointsRes.data || []) as PointHistory[],
  };
}
