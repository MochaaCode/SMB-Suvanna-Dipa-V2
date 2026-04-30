"use client";

import Image from "next/image";
import Link from "next/link";
import { useScrollState } from "@/hooks/useScrollState";

export default function LandingNavbar() {
  const isScrolled = useScrollState(50);

  return (
    <header
      className={`fixed top-0 w-full z-50 transition-all duration-500 ${isScrolled ? "bg-white/90 backdrop-blur-md border-b border-orange-300 shadow-[0_4px_6px_-1px_rgba(249,115,22,0.3)] py-2" : "bg-transparent py-4"}`}
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
        <div className="hidden md:flex items-center gap-8 text-sm font-bold">
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
          className="px-6 py-2.5 bg-orange-500 text-white rounded-[1rem] font-bold text-sm hover:bg-orange-600 hover:-translate-y-1 hover:scale-105 hover:shadow-xl hover:shadow-orange-500/30 transition-all duration-300 ease-out active:scale-95"
        >
          Masuk
        </Link>
      </nav>
    </header>
  );
}
