"use client";

import { useState, useEffect } from "react";

export function useScrollState(threshold: number = 50) {
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const scrolled = window.scrollY > threshold;
      if (scrolled !== isScrolled) {
        setIsScrolled(scrolled);
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true }); 
    handleScroll();

    return () => window.removeEventListener("scroll", handleScroll);
  }, [isScrolled, threshold]);

  return isScrolled;
}
