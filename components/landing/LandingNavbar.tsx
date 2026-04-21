"use client";

import Image from "next/image";
import Link from "next/link";
import { useScrollState } from "@/hooks/useScrollState";

export default function LandingNavbar() {
  const isScrolled = useScrollState(50);

  return (
    <header
      className={`fixed top-0 w-full z-50 transition-all duration-500 ${isScrolled ? "bg-white/90 backdrop-blur-md border-b border-slate-200 shadow-sm py-2" : "bg-transparent py-4"}`}
    >
      <nav className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Image
            src="/images/logo-smb.png"
            alt="Logo SMB"
            width={isScrolled ? 100 : 120}
            height={isScrolled ? 100 : 120}
            className="object-contain transition-all duration-300"
          />
        </div>
        <div className="hidden md:flex items-center gap-8 text-sm font-medium">
          <Link
            href="#about"
            className="text-slate-700 hover:text-orange-500 transition-colors"
          >
            Tentang Kami
          </Link>
          <Link
            href="#activity"
            className="text-slate-700 hover:text-orange-500 transition-colors"
          >
            Aktivitas Kami
          </Link>
          <Link
            href="#contact"
            className="text-slate-700 hover:text-orange-500 transition-colors"
          >
            Hubungi Kami
          </Link>
        </div>
        <Link
          href="/login"
          className="px-6 py-2.5 bg-orange-500 text-white rounded-[1rem] font-semibold text-sm hover:bg-orange-600 hover:shadow-lg hover:shadow-orange-200 transition-all active:scale-95"
        >
          Masuk Ke Portal
        </Link>
      </nav>
    </header>
  );
}
