/* eslint-disable @typescript-eslint/no-explicit-any */
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
  Globe,
  LogOut,
  UserCog,
  TrendingUp,
  Gift,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { createClient } from "@/lib/supabase/client";
import toast from "react-hot-toast";
import { useState } from "react";
import type { UserRole } from "@/types";

export const ADMIN_MENU = [
  { name: "Beranda", href: "/admin/dashboard", icon: LayoutDashboard },
  { name: "Kelas", href: "/admin/classes", icon: GraduationCap },
  { name: "Pengguna", href: "/admin/users", icon: Users },
  { name: "Jadwal", href: "/admin/schedules", icon: Calendar },
  { name: "Kehadiran", href: "/admin/attendance", icon: CheckSquare },
  { name: "Daftar Kartu", href: "/admin/cards", icon: IdCard },
  { name: "Produk", href: "/admin/products", icon: Package },
  { name: "Orderan", href: "/admin/orders", icon: ShoppingCart },
  { name: "Riwayat", href: "/admin/logs", icon: History },
  { name: "Konten Publik", href: "/admin/public-content", icon: Globe },
  { name: "Laporan", href: "/admin/reports", icon: TrendingUp },
];

export const PEMBINA_MENU = [
  { name: "Beranda", href: "/pembina/dashboard", icon: LayoutDashboard },
  { name: "Manajemen Kelas", href: "/pembina/classes", icon: GraduationCap },
  { name: "Jadwal Kegiatan", href: "/pembina/schedules", icon: Calendar },
];

export const SISWA_MENU = [
  { name: "Beranda", href: "/siswa/dashboard", icon: LayoutDashboard },
  { name: "Toko Hadiah", href: "/siswa/rewards", icon: Gift },
  { name: "Presensi", href: "/siswa/attendance", icon: History },
  { name: "Jadwal", href: "/siswa/schedule", icon: Calendar },
];

interface SidebarProps {
  className?: string;
  role: UserRole;
}

export default function Sidebar({ className, role }: SidebarProps) {
  const pathname = usePathname();
  const router = useRouter();
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const supabase = createClient();

  // FILTER MENU DINAMIS 3 ROLE
  const activeMenu =
    role === "admin"
      ? ADMIN_MENU
      : role === "pembina"
        ? PEMBINA_MENU
        : SISWA_MENU;
  const basePath =
    role === "admin" ? "/admin" : role === "pembina" ? "/pembina" : "/siswa";
  const titleLabel =
    role === "admin" ? "Admin" : role === "pembina" ? "Pembina" : "Siswa";

  const handleLogout = async () => {
    setIsLoggingOut(true);
    const tid = toast.loading("Menghancurkan sesi...");
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      toast.success("Berhasil keluar!", { id: tid });
      router.replace("/login");
      router.refresh();
    } catch (error: any) {
      toast.error(error.message || "Gagal keluar", { id: tid });
      setIsLoggingOut(false);
    }
  };

  return (
    <aside
      className={cn(
        "w-64 bg-white flex flex-col h-full border-r border-slate-200 shadow-sm",
        !className && "sticky top-0 h-screen",
        className,
      )}
    >
      <div className="p-6 border-b border-slate-100">
        <h2 className="text-2xl font-bold text-slate-800 tracking-tight leading-none">
          SMB <span className="text-orange-600">{titleLabel}</span>
        </h2>
        <p className="text-[10px] font-semibold text-slate-500 uppercase tracking-widest mt-1.5">
          Portal {titleLabel}
        </p>
      </div>

      <nav className="flex-1 overflow-y-auto p-4 space-y-1.5 custom-scrollbar">
        <p className="px-4 text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-3 mt-2">
          Menu Utama
        </p>
        {activeMenu.map((item) => {
          const isActive = pathname.startsWith(item.href);
          return (
            <Link
              key={item.name}
              href={item.href}
              className={cn(
                "flex items-center gap-3.5 px-4 py-3 rounded-lg text-sm font-semibold transition-all group relative",
                isActive
                  ? "bg-orange-50 text-orange-700 shadow-sm"
                  : "text-slate-600 hover:bg-slate-50 hover:text-slate-900",
              )}
            >
              {isActive && (
                <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-6 bg-orange-600 rounded-r-full" />
              )}
              <item.icon
                size={18}
                strokeWidth={isActive ? 2.5 : 2}
                className={
                  isActive
                    ? "text-orange-600"
                    : "text-slate-400 group-hover:text-slate-600"
                }
              />
              <span className="tracking-wide">{item.name}</span>
            </Link>
          );
        })}
      </nav>

      <div className="p-4 border-t border-slate-100 bg-slate-50/50 space-y-1.5">
        <p className="px-4 text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-2 mt-1">
          Pengaturan
        </p>
        <Link
          href={`${basePath}/profile`}
          className={cn(
            "flex items-center gap-3.5 px-4 py-3 rounded-lg text-sm font-semibold transition-all group",
            pathname.startsWith(`${basePath}/profile`)
              ? "bg-white text-slate-900 shadow-sm border border-slate-200"
              : "text-slate-600 hover:bg-white hover:text-slate-900 hover:shadow-sm border border-transparent",
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
          <span className="tracking-wide">Pengaturan Akun</span>
        </Link>
        <button
          onClick={handleLogout}
          disabled={isLoggingOut}
          className="flex w-full items-center gap-3.5 px-4 py-3 rounded-lg text-sm font-semibold text-red-600 hover:bg-red-50 hover:text-red-700 transition-all disabled:opacity-50"
        >
          <LogOut size={18} strokeWidth={2.5} className="text-red-500" />
          <span className="tracking-wide">
            {isLoggingOut ? "Keluar..." : "Keluar Akun"}
          </span>
        </button>
      </div>
    </aside>
  );
}
