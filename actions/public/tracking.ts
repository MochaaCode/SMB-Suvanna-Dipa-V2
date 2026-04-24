"use server";

import { createAdminClient } from "@/lib/supabase/admin";

export async function recordPageView(pathname: string) {
  try {
    const supabaseAdmin = createAdminClient();
    const today = new Date().toLocaleDateString("en-CA", {
      timeZone: "Asia/Jakarta",
    });

    const pageName = pathname === "/" ? "Landing Page" : pathname;
    await supabaseAdmin.from("page_views").insert({
      page_path: pathname,
      page_name: pageName,
    });

    const { data: stat } = await supabaseAdmin
      .from("daily_visitor_stats")
      .select("id, views")
      .eq("date", today)
      .single();

    if (stat) {
      await supabaseAdmin
        .from("daily_visitor_stats")
        .update({ views: stat.views + 1 })
        .eq("id", stat.id);
    } else {
      await supabaseAdmin
        .from("daily_visitor_stats")
        .insert({ date: today, views: 1 });
    }
  } catch (error) {
    console.error("Gagal merekam tracker:", error);
  }
}
