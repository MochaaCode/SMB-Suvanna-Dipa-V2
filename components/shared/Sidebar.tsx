"use client";

import Link from "next/link";
import Image from "next/image";
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
  FileText,
  Globe,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { createClient } from "@/lib/supabase/client";
import toast from "react-hot-toast";
import { useState } from "react";
import type { UserRole } from "@/types";

export const ADMIN_MENU = [
  { name: "Dasbor", href: "/admin/dashboard", icon: LayoutDashboard },
  { name: "Kelola Kelas", href: "/admin/classes", icon: GraduationCap },
  { name: "Kelola Pengguna", href: "/admin/users", icon: Users },
  { name: "Kelola Jadwal", href: "/admin/schedules", icon: Calendar },
  { name: "Kelola Presensi", href: "/admin/attendance", icon: CheckSquare },
  { name: "Kelola Kartu RFID", href: "/admin/cards", icon: IdCard },
  { name: "Kelola Hadiah", href: "/admin/products", icon: Package },
  { name: "Penukaran Poin", href: "/admin/orders", icon: ShoppingCart },
  { name: "Kelola Konten Publik", href: "/admin/public-content", icon: Globe },
  { name: "Log Aktivitas", href: "/admin/logs", icon: History },
  { name: "Laporan", href: "/admin/reports", icon: FileText },
];

export const PEMBINA_MENU = [
  { name: "Dasbor", href: "/pembina/dashboard", icon: LayoutDashboard },
  { name: "Kelas Saya", href: "/pembina/my-class", icon: GraduationCap },
  { name: "Materi", href: "/pembina/materials", icon: BookOpen },
  { name: "Riwayat", href: "/pembina/logs", icon: History },
];

export const SISWA_MENU = [
  { name: "Dasbor", href: "/siswa/dashboard", icon: LayoutDashboard },
  { name: "Jadwal", href: "/siswa/schedule", icon: Calendar },
  { name: "Tukar Poin", href: "/siswa/store", icon: Gift },
  { name: "Aktivitas", href: "/siswa/activity", icon: History },
];

export const GL_MENU = [
  {
    name: "Pantau Kelas",
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
          <div className="w-10 h-10 rounded-2xl flex items-center justify-center overflow-hidden border border-orange-300">
            <Image
              src="/images/logo-smb.png"
              alt="Logo SMB"
              width={40}
              height={40}
              className="object-contain"
            />
          </div>
          <div className="flex flex-col">
            <span className="text-xl font-black text-slate-800 tracking-tighter leading-none">
              Suvanna Dipa
            </span>
            <span className="text-[10px] font-bold text-orange-600 uppercase tracking-[0.2em] mt-1">
              {role.charAt(0).toUpperCase() + role.slice(1)}
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
