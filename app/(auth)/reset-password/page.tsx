import { Metadata } from "next";
import ResetPasswordForm from "@/components/auth/ResetPasswordForm";

export const metadata: Metadata = { title: "Reset Sandi | SMB Suvanna Dipa" };

export default function ResetPasswordPage() {
  return (
    <main className="min-h-screen flex items-center justify-center bg-slate-50 relative overflow-hidden p-6">
      <div className="absolute top-[-10%] left-[-10%] w-125 h-125 bg-orange-200/50 rounded-full blur-[100px] pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-10%] w-125 h-125 bg-blue-200/50 rounded-full blur-[100px] pointer-events-none" />
      <ResetPasswordForm />
    </main>
  );
}
