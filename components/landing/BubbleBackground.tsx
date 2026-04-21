"use client";

import "./bubble.css";

export default function BubbleBackground() {
  // Kita buat 15 bubble
  const bubbles = Array.from({ length: 15 });

  return (
    // UBAH: absolute jadi fixed agar memenuhi viewport layar penuh
    <div className="fixed inset-0 overflow-hidden pointer-events-none -z-10 bg-soft-bg">
      {bubbles.map((_, i) => (
        <div key={i} className={`bubble bubble-${i + 1}`} />
      ))}
    </div>
  );
}
