import { Metadata } from "next";
import LoginForm from "@/components/auth/LoginForm";

export const metadata: Metadata = { title: "Masuk | SMB Suvanna Dipa" };

// WHY: page.tsx ini murni bertindak sebagai kanvas statis (Server Component).
// HOW: Kita memisahkan background hiasan di sini, agar LoginForm (Client Component) fokus pada logika saja.
export default function LoginPage() {
  return (
    <main className="min-h-screen flex items-center justify-center bg-slate-50 relative overflow-hidden p-6">
      <div className="absolute top-[-10%] left-[-10%] w-125 h-125 bg-orange-200/50 rounded-full blur-[100px] pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-10%] w-125 h-125 bg-blue-200/50 rounded-full blur-[100px] pointer-events-none" />
      <LoginForm />
    </main>
  );
}
