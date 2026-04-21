"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { forgotPasswordAction } from "@/actions/auth/password";
import toast from "react-hot-toast";
import { Loader2, ArrowLeft, ShieldAlert } from "lucide-react";
import { motion, Variants } from "framer-motion";

const containerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.1 } },
};
const itemVariants: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" } },
};

export default function ForgotPasswordForm() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [email, setEmail] = useState("");

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return toast.error("Masukkan alamat email Anda.");

    setIsLoading(true);
    const tid = toast.loading("Memproses permintaan...");
    try {
      const result = await forgotPasswordAction(email);
      if (result.success) {
        toast.success("Token 6-digit berhasil dikirim!", { id: tid });
        router.push(`/reset-password?email=${encodeURIComponent(email)}`);
      } else {
        toast.error(result.error as string, { id: tid });
      }
    } catch (error) {
      toast.error("Gagal terhubung ke peladen.", { id: tid });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5 }}
      className="w-full max-w-4xl mx-auto bg-white rounded-[1rem] shadow-2xl overflow-hidden flex flex-col md:flex-row min-h-137.5 border border-slate-100 z-10"
    >
      <div className="w-full md:w-1/2 p-8 md:p-12 flex flex-col justify-center relative">
        <button
          onClick={() => router.push("/login")}
          className="absolute top-8 left-8 flex items-center gap-2 text-slate-400 hover:text-slate-900 transition-colors group"
        >
          <ArrowLeft
            size={18}
            className="group-hover:-translate-x-1 transition-transform"
          />
          <span className="text-xs font-bold uppercase tracking-wider">
            Kembali
          </span>
        </button>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="mt-8 md:mt-0"
        >
          <motion.h1
            variants={itemVariants}
            className="text-3xl font-black text-slate-900 tracking-tight mb-2"
          >
            Pemulihan Akses
          </motion.h1>
          <motion.p
            variants={itemVariants}
            className="text-slate-500 text-sm font-medium mb-8 leading-relaxed"
          >
            Masukkan alamat email terdaftar Anda. Kami akan mengirimkan token
            6-digit rahasia untuk memulihkan akun.
          </motion.p>

          <form onSubmit={onSubmit} className="space-y-6">
            <motion.div variants={itemVariants} className="space-y-2">
              <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                Alamat Email Terdaftar
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                placeholder="contoh@domain.com"
                className="w-full px-4 py-3 rounded-[1rem] border border-slate-200 focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 transition-all bg-slate-50/50 text-sm font-medium"
              />
            </motion.div>

            <motion.button
              variants={itemVariants}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              type="submit"
              disabled={isLoading}
              className="w-full py-3.5 bg-orange-600 hover:bg-orange-700 text-white text-xs font-bold uppercase tracking-widest rounded-[1rem] transition-colors flex items-center justify-center gap-2 disabled:opacity-70"
            >
              {isLoading ? (
                <Loader2 className="animate-spin" size={18} />
              ) : (
                "Kirim Token 6-Digit"
              )}
            </motion.button>
          </form>
        </motion.div>
      </div>

      <div className="hidden md:flex w-1/2 bg-slate-900 p-12 flex-col items-center justify-center relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10 mix-blend-overlay"></div>
        <div className="absolute top-1/4 right-10 w-64 h-64 bg-orange-500/20 rounded-full blur-3xl"></div>
        <ShieldAlert
          size={80}
          strokeWidth={1}
          className="text-orange-500 mb-6 relative z-10"
        />
        <h3 className="text-2xl font-bold text-white tracking-tight text-center relative z-10">
          Protokol Keamanan Berstandar
        </h3>
        <p className="text-slate-400 text-sm text-center mt-4 max-w-xs relative z-10 leading-relaxed">
          Menggunakan verifikasi Token OTP 6-Digit (Time-Based One-Time
          Password) yang kedaluwarsa secara otomatis.
        </p>
      </div>
    </motion.div>
  );
}
