"use client";

export function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="w-full py-5 px-4 md:px-8 border-t border-slate-200/60 bg-white mt-auto">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-3">
        <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
          © {currentYear} SMB ADMIN SYSTEM. HAK CIPTA DILINDUNGI.
        </p>
        <p className="text-[10px] font-black italic text-slate-300 uppercase tracking-[0.2em] flex items-center gap-1.5">
          <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse"></span>
          SISTEM ONLINE
        </p>
      </div>
    </footer>
  );
}
