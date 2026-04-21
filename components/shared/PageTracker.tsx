"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";
import { recordPageView } from "@/actions/public/tracking";

/**
 * WHY: Kita perlu tahu halaman apa saja yang diakses user untuk mengisi Chart di Dashboard Admin.
 * HOW: Komponen ini diletakkan di RootLayout. Setiap kali pathname berubah,
 * dia akan menembak Server Action 'recordPageView' secara asynchronous.
 */
export function PageTracker() {
  const pathname = usePathname();

  useEffect(() => {
    recordPageView(pathname);
  }, [pathname]);

  return null;
}
