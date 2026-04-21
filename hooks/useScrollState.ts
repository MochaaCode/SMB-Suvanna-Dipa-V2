"use client";

import { useState, useEffect } from "react";

/**
 * WHY: Mendengarkan event 'scroll' langsung di komponen akan memicu ratusan re-render per detik.
 * Ini bikin website lag, terutama di HP kentang.
 * HOW: Hook ini hanya mengubah state (true/false) JIKA melewati batas piksel tertentu (threshold).
 * Jadi re-render hanya terjadi 2 kali: Saat ngelewatin batas bawah, dan saat balik ke atas.
 */
export function useScrollState(threshold: number = 50) {
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      // Cek apakah scroll vertikal sudah melewati threshold
      const scrolled = window.scrollY > threshold;
      if (scrolled !== isScrolled) {
        setIsScrolled(scrolled);
      }
    };

    // Pasang event listener
    window.addEventListener("scroll", handleScroll, { passive: true }); // passive: true bikin scroll tetap mulus karena tidak memblokir thread utama

    // Panggil sekali saat pertama kali render (in case user me-refresh di tengah halaman)
    handleScroll();

    // Cleanup untuk mencegah memory leak
    return () => window.removeEventListener("scroll", handleScroll);
  }, [isScrolled, threshold]);

  return isScrolled;
}
