import { Metadata } from "next";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import Sidebar from "@/components/shared/Sidebar";
import { Footer } from "@/components/shared/Footer";
import { Toaster } from "react-hot-toast";
import { MobileNav } from "@/components/shared/MobileNav";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: {
    template: "%s | Admin SMB",
    default: "Dashboard | Admin SMB",
  },
  description: "Panel Kendali Internal SMB Suvanna Dipa",
};

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = await createClient();

  // CEK AUTH USER
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  // CEK ROLE PROFILE (ADMIN ONLY)
  const { data: profile, error } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", user.id)
    .single();

  if (error || !profile || profile.role !== "admin") {
    redirect("/");
  }

  return (
    <div className="flex flex-col md:flex-row min-h-screen bg-slate-50 font-sans text-slate-900">
      {/* =========================================
          MOBILE NAVBAR (HANYA TAMPIL DI HP) 
          ========================================= */}
      <MobileNav role={"admin"} />

      {/* =========================================
          SIDEBAR DESKTOP (SEMBUNYI DI HP) 
          ========================================= */}
      <div className="hidden md:block shrink-0">
        <Sidebar role={"admin"} />
      </div>

      {/* =========================================
          MAIN CONTENT AREA 
          ========================================= */}
      <main className="flex-1 flex flex-col min-w-0 overflow-x-hidden pt-16 md:pt-0 h-screen md:h-auto overflow-y-auto">
        <div className="flex-1 p-4 md:p-6 lg:p-8">
          <div className="max-w-7xl mx-auto space-y-6 md:space-y-8">
            {children}
          </div>
        </div>

        {/* FOOTER */}
        <Footer />
      </main>

      {/* TOASTER (TIDAK BERUBAH) */}
      <Toaster
        position="top-right"
        toastOptions={{
          duration: 4000,
          style: {
            background: "#1e293b",
            color: "#fff",
            borderRadius: "0.75rem",
            fontSize: "12px",
            fontWeight: "bold",
          },
          success: {
            duration: 3000,
            style: {
              background: "#ea580c",
              color: "#fff",
            },
          },
          error: {
            style: {
              background: "#ef4444",
              color: "#fff",
            },
          },
        }}
      />
    </div>
  );
}
