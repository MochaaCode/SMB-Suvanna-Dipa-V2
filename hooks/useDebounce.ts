"use client";

import { useState, useEffect } from "react";

/**
 * WHY: Mencegah fungsi (seperti pencarian) tereksekusi setiap kali ada perubahan karakter (keystroke).
 * HOW: Menyimpan nilai sementara, dan hanya akan mengembalikan nilai tersebut
 * jika tidak ada ketikan baru selama durasi (delay) yang ditentukan.
 */
export function useDebounce<T>(value: T, delay: number): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debouncedValue;
}
