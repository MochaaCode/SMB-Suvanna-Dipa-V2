"use client";

export function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="w-full py-5 px-4 md:px-8 bg-slate-900 mt-auto">
      <div className="max-w-7xl mx-auto flex flex-col items-center justify-center">
        <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider text-center">
          © {currentYear} SMB ADMIN SYSTEM. HAK CIPTA DILINDUNGI.
        </p>
      </div>
    </footer>
  );
}
