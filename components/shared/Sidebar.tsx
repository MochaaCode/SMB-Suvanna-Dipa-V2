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
  BookOpen,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { createClient } from "@/lib/supabase/client";
import toast from "react-hot-toast";
import { useState } from "react";
import type { UserRole } from "@/types";

export const ADMIN_MENU = [
  { name: "Dashboard", href: "/admin/dashboard", icon: LayoutDashboard },
  { name: "Manajemen Kelas", href: "/admin/classes", icon: GraduationCap },
  { name: "Manajemen Pengguna", href: "/admin/users", icon: Users },
  { name: "Jadwal Kegiatan", href: "/admin/schedules", icon: Calendar },
  { name: "Log Kehadiran", href: "/admin/attendance", icon: CheckSquare },
  { name: "Daftar Kartu RFID", href: "/admin/cards", icon: IdCard },
  { name: "Katalog Produk", href: "/admin/products", icon: Package },
  { name: "Pesanan Masuk", href: "/admin/orders", icon: ShoppingCart },
  { name: "Riwayat Pengguna", href: "/admin/logs", icon: History },
];

export const PEMBINA_MENU = [
  { name: "Dashboard", href: "/pembina/dashboard", icon: LayoutDashboard },
  { name: "Kelas Saya", href: "/pembina/my-class", icon: GraduationCap },
  { name: "Materi Pembahasan", href: "/pembina/materials", icon: BookOpen },
  { name: "Riwayat Aktivitas", href: "/pembina/logs", icon: History },
];

export const SISWA_MENU = [
  { name: "Dashboard", href: "/siswa/dashboard", icon: LayoutDashboard },
  { name: "Jadwal SMB", href: "/siswa/schedule", icon: Calendar },
  { name: "Tukar Poin", href: "/siswa/store", icon: Gift },
  { name: "Aktivitas Saya", href: "/siswa/activity", icon: History },
];

export const GL_MENU = [
  {
    name: "Monitoring Kelas (GL)",
    href: "/pembina/my-class",
    icon: GraduationCap,
  },
];

interface SidebarProps {
  role: UserRole;
  isAssistant?: boolean;
}

export default function Sidebar({ role, isAssistant = false }: SidebarProps) {
  const pathname = usePathname();
  const router = useRouter();
  const supabase = createClient();
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  const basePath =
    role === "admin" ? "/admin" : role === "pembina" ? "/pembina" : "/siswa";

  const handleLogout = async () => {
    setIsLoggingOut(true);
    const tid = toast.loading("Keluar dari sistem...");
    try {
      await supabase.auth.signOut();
      router.push("/login");
      router.refresh();
      toast.success("Berhasil keluar", { id: tid });
    } catch (error) {
      toast.error("Gagal keluar sistem", { id: tid });
    } finally {
      setIsLoggingOut(false);
    }
  };

  const getActiveMenu = () => {
    if (role === "admin") return ADMIN_MENU;
    if (role === "pembina") return PEMBINA_MENU;
    if (role === "siswa" && isAssistant) {
      return [...SISWA_MENU, ...GL_MENU];
    }

    return SISWA_MENU;
  };

  const menuItems = getActiveMenu();

  return (
    <aside className="w-72 h-screen bg-white border-r border-slate-100 flex flex-col sticky top-0 overflow-hidden">
      <div className="p-8 pb-6">
        <div className="flex items-center gap-3 mb-2">
          <div className="w-10 h-10 bg-orange-600 rounded-2xl flex items-center justify-center shadow-lg shadow-orange-200">
            <GraduationCap className="text-white" size={24} />
          </div>
          <div className="flex flex-col">
            <span className="text-xl font-black text-slate-800 tracking-tighter leading-none">
              SUVANNADIPA
            </span>
            <span className="text-[10px] font-bold text-orange-600 uppercase tracking-[0.2em] mt-1">
              {role} Portal
            </span>
          </div>
        </div>
      </div>

      <nav className="flex-1 px-4 py-4 space-y-1.5 overflow-y-auto custom-scrollbar">
        <p className="px-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-3">
          Menu Utama
        </p>
        {menuItems.map((item) => {
          const isActive = pathname.startsWith(item.href);
          return (
            <Link
              key={item.name}
              href={item.href}
              className={cn(
                "flex items-center gap-3.5 px-4 py-3 rounded-[1rem] text-sm font-bold transition-all group border",
                isActive
                  ? "bg-orange-50 text-orange-700 shadow-sm border-orange-100"
                  : "text-slate-600 hover:bg-slate-50 hover:text-slate-900 border-transparent",
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
              {isActive && (
                <div className="ml-auto w-1.5 h-1.5 rounded-full bg-orange-500 animate-pulse" />
              )}
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
          className="flex w-full items-center gap-3.5 px-4 py-3 rounded-[1rem] text-sm font-bold text-red-500 hover:bg-red-50 transition-all border border-transparent disabled:opacity-50"
        >
          <LogOut size={18} />
          <span className="tracking-tight">Keluar Sistem</span>
        </button>
      </div>
    </aside>
  );
}
