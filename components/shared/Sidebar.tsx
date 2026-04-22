"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  LayoutDashboard,
  Users,
  GraduationCap,
  Calendar,
  CheckSquare,
  IdCard,
  Package,
  ShoppingCart,
  History,
  LogOut,
  UserCog,
  Gift,
  FileSpreadsheet,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { createClient } from "@/lib/supabase/client";
import toast from "react-hot-toast";
import { useState } from "react";
import type { UserRole } from "@/types";

export const ADMIN_MENU = [
  { name: "Beranda", href: "/admin/dashboard", icon: LayoutDashboard },
  { name: "Manajemen Kelas", href: "/admin/classes", icon: GraduationCap },
  { name: "Data Pengguna", href: "/admin/users", icon: Users },
  { name: "Jadwal Acara", href: "/admin/schedules", icon: Calendar },
  { name: "Log Kehadiran", href: "/admin/attendance", icon: CheckSquare },
  { name: "Daftar Kartu RFID", href: "/admin/cards", icon: IdCard },
  { name: "Katalog Produk", href: "/admin/products", icon: Package },
  { name: "Pesanan Masuk", href: "/admin/orders", icon: ShoppingCart },
  { name: "Rekam Jejak", href: "/admin/logs", icon: History },
  { name: "Laporan & Audit", href: "/admin/reports", icon: FileSpreadsheet },
];

export const PEMBINA_MENU = [
  { name: "Dashboard", href: "/pembina/dashboard", icon: LayoutDashboard },
  { name: "Jadwal Mengajar", href: "/pembina/schedules", icon: Calendar },
  { name: "Manajemen Kelas", href: "/pembina/classes", icon: GraduationCap },
];

export const SISWA_MENU = [
  { name: "Dashboard", href: "/siswa/dashboard", icon: LayoutDashboard },
  { name: "Jadwal SMB", href: "/siswa/schedules", icon: Calendar },
  { name: "Tukar Poin", href: "/siswa/store", icon: Gift },
  { name: "Aktivitas Saya", href: "/siswa/activities", icon: History },
];

interface SidebarProps {
  role: UserRole;
}

export default function Sidebar({ role }: SidebarProps) {
  const pathname = usePathname();
  const router = useRouter();
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const supabase = createClient();

  const menuList =
    role === "admin"
      ? ADMIN_MENU
      : role === "pembina"
        ? PEMBINA_MENU
        : SISWA_MENU;

  const basePath = `/${role}`;

  const handleLogout = async () => {
    setIsLoggingOut(true);
    const tid = toast.loading("Mengakhiri sesi...");
    try {
      await supabase.auth.signOut();
      toast.success("Sampai jumpa lagi!", { id: tid });
      router.push("/login");
      router.refresh();
    } catch (error) {
      toast.error("Gagal logout", { id: tid });
      setIsLoggingOut(false);
    }
  };

  return (
    <aside className="w-64 h-screen bg-white border-r border-slate-200 flex flex-col sticky top-0 overflow-hidden shadow-[4px_0_24px_rgba(0,0,0,0.02)]">
      {/* LOGO SECTION */}
      <div className="p-6 border-b border-slate-50 flex items-center gap-3">
        <div className="w-10 h-10 bg-orange-600 rounded-[0.8rem] flex items-center justify-center shadow-lg shadow-orange-100">
          <GraduationCap className="text-white" size={24} />
        </div>
        <div className="flex flex-col">
          <span className="text-sm font-black text-slate-800 tracking-tight leading-none">
            SUVANNADIPA
          </span>
          <span className="text-[10px] font-bold text-orange-600 uppercase tracking-[0.2em] mt-1">
            {role} Portal
          </span>
        </div>
      </div>

      {/* NAVIGATION SECTION */}
      <nav className="flex-1 overflow-y-auto p-4 space-y-1.5 custom-scrollbar">
        <p className="px-4 text-[10px] font-black text-slate-400 uppercase tracking-[0.15em] mb-3 mt-2">
          Menu Utama
        </p>
        {menuList.map((item) => {
          const isActive = pathname.startsWith(item.href);
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center gap-3.5 px-4 py-3 rounded-[1rem] text-sm font-bold transition-all group border",
                isActive
                  ? "bg-orange-50 text-orange-700 border-orange-100 shadow-sm"
                  : "text-slate-500 hover:bg-slate-50 hover:text-slate-900 border-transparent",
              )}
            >
              <item.icon
                size={18}
                className={cn(
                  "transition-colors",
                  isActive
                    ? "text-orange-600"
                    : "text-slate-400 group-hover:text-slate-600",
                )}
              />
              <span className="tracking-tight">{item.name}</span>
            </Link>
          );
        })}
      </nav>

      {/* FOOTER SECTION (PROFILE & LOGOUT) */}
      <div className="p-4 border-t border-slate-100 bg-slate-50/50 space-y-1.5">
        <p className="px-4 text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-2 mt-1">
          Pengaturan
        </p>
        <Link
          href={`${basePath}/profile`}
          className={cn(
            "flex items-center gap-3.5 px-4 py-3 rounded-[1rem] text-sm font-bold transition-all group border",
            pathname.startsWith(`${basePath}/profile`)
              ? "bg-white text-slate-900 shadow-sm border-slate-200"
              : "text-slate-600 hover:bg-white hover:text-slate-900 hover:shadow-sm border-transparent",
          )}
        >
          <UserCog
            size={18}
            className={
              pathname.startsWith(`${basePath}/profile`)
                ? "text-slate-800"
                : "text-slate-400 group-hover:text-slate-600"
            }
          />
          <span className="tracking-tight">Profil & Akun</span>
        </Link>
        <button
          onClick={handleLogout}
          disabled={isLoggingOut}
          className="flex w-full items-center gap-3.5 px-4 py-3 rounded-[1rem] text-sm font-bold text-red-600 hover:bg-red-50 hover:text-red-700 transition-all border border-transparent"
        >
          <LogOut size={18} />
          <span className="tracking-tight">Keluar Sesi</span>
        </button>
      </div>
    </aside>
  );
}
