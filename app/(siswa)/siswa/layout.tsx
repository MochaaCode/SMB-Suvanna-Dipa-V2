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
    template: "%s | Portal Siswa",
    default: "Dashboard | Portal Siswa",
  },
  description: "Portal Mandiri Siswa SMB Suvanna Dipa",
};

export default async function SiswaLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect("/login");

  const { data: profile, error } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", user.id)
    .single();

  if (error || !profile || profile.role !== "siswa") {
    redirect("/");
  }

  return (
    <div className="flex flex-col md:flex-row min-h-screen bg-slate-50 font-sans text-slate-900">
      <MobileNav role="siswa" />

      <div className="hidden md:block shrink-0">
        <Sidebar role="siswa" />
      </div>

      <main className="flex-1 flex flex-col min-w-0 overflow-x-hidden pt-16 md:pt-0 h-screen md:h-auto overflow-y-auto">
        <div className="flex-1 p-4 md:p-6 lg:p-8">
          <div className="max-w-7xl mx-auto space-y-6 md:space-y-8">
            {children}
          </div>
        </div>
        <Footer />
      </main>

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
          success: { style: { background: "#ea580c", color: "#fff" } },
          error: { style: { background: "#ef4444", color: "#fff" } },
        }}
      />
    </div>
  );
}
