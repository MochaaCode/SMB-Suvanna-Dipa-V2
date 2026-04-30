"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import {
  verifyOtpAndResetPassword,
  forgotPasswordAction,
} from "@/actions/auth/password";
import toast from "react-hot-toast";
import { Loader2, KeyRound, Eye, EyeOff } from "lucide-react";
import { motion, Variants } from "framer-motion";

const containerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.1 } },
};
const itemVariants: Variants = {
  hidden: { opacity: 0, x: 20 },
  visible: { opacity: 1, x: 0, transition: { duration: 0.5, ease: "easeOut" } },
};

export default function ResetPasswordForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const targetEmail = searchParams.get("email");

  const [isLoading, setIsLoading] = useState(false);
  const [isResending, setIsResending] = useState(false);
  const [showPass, setShowPass] = useState(false);
  const [showConfirmPass, setShowConfirmPass] = useState(false);

  const [token, setToken] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  useEffect(() => {
    if (!targetEmail) {
      toast.error("Akses ditolak. Silakan ajukan permintaan terlebih dahulu.");
      router.replace("/forgot-password");
    }
  }, [targetEmail, router]);

  const handleResendToken = async () => {
    if (!targetEmail) return;
    setIsResending(true);
    const tid = toast.loading("Mengirim ulang token...");
    try {
      const res = await forgotPasswordAction(targetEmail);
      if (res.success)
        toast.success("Token baru berhasil dikirim!", { id: tid });
      else toast.error(res.error as string, { id: tid });
    } catch {
      toast.error("Gagal mengirim ulang token.", { id: tid });
    } finally {
      setIsResending(false);
    }
  };

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!targetEmail) return;
    if (token.length !== 8) return toast.error("Token harus 8 digit angka.");
    if (newPassword.length < 6) return toast.error("Sandi minimal 6 karakter.");
    if (newPassword !== confirmPassword)
      return toast.error("Konfirmasi sandi tidak cocok.");

    setIsLoading(true);
    const tid = toast.loading("Memvalidasi token & memperbarui sandi...");
    try {
      const result = await verifyOtpAndResetPassword({
        email: targetEmail,
        token: token,
        newPass: newPassword,
      });

      if (result.success) {
        toast.success("Kata sandi berhasil diubah! Silakan masuk kembali.", {
          id: tid,
        });
        router.push("/login");
      } else {
        toast.error(result.error as string, { id: tid });
      }
    } catch (error) {
      toast.error("Terjadi kesalahan sistem.", { id: tid });
    } finally {
      setIsLoading(false);
    }
  };

  if (!targetEmail) return null;

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5 }}
      className="w-full max-w-4xl mx-auto bg-white rounded-[1rem] shadow-2xl overflow-hidden flex flex-col md:flex-row min-h-137.5 border border-slate-100 z-10"
    >
      <div className="hidden md:flex w-1/2 bg-slate-900 p-12 flex-col items-center justify-center relative overflow-hidden order-2 md:order-1">
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10 mix-blend-overlay"></div>
        <div className="absolute bottom-1/4 left-10 w-64 h-64 bg-orange-500/20 rounded-full blur-3xl"></div>
        <KeyRound
          size={80}
          strokeWidth={1}
          className="text-orange-500 mb-6 relative z-10"
        />
        <h3 className="text-2xl font-bold text-white tracking-tight text-center relative z-10">
          Atur Ulang Kata Sandi
        </h3>
        <p className="text-slate-400 text-sm text-center mt-4 max-w-xs relative z-10 leading-relaxed">
           Masukkan kode 8-digit yang telah dikirim ke{" "}
           <strong>{targetEmail}</strong> beserta kata sandi baru
           kamu.
        </p>
      </div>

      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="w-full md:w-1/2 p-8 md:p-12 flex flex-col justify-center relative order-1 md:order-2"
      >
        <motion.h1
          variants={itemVariants}
          className="text-3xl font-black text-slate-900 tracking-tight mb-2"
        >
           Atur Ulang Kata Sandi
        </motion.h1>
        <motion.p
          variants={itemVariants}
          className="text-slate-500 text-sm font-medium mb-6 leading-relaxed flex flex-col items-start"
        >
           <span>Kode verifikasi telah dikirim ke email kamu.</span>
          <button
            type="button"
            onClick={handleResendToken}
            disabled={isResending}
            className="text-xs text-orange-600 hover:text-orange-700 font-bold mt-1 disabled:opacity-50"
          >
            {isResending
              ? "Mengirim ulang..."
              : "Belum mendapat token? Kirim ulang."}
          </button>
        </motion.p>

        <form onSubmit={onSubmit} className="space-y-5">
          <motion.div variants={itemVariants} className="space-y-2">
            <label className="text-xs font-bold uppercase tracking-wider text-orange-600">
               Kode Verifikasi 8-Digit
            </label>
            <input
              type="text"
              maxLength={8}
              value={token}
              onChange={(e) => setToken(e.target.value.replace(/[^0-9]/g, ""))}
              placeholder="00000000"
              required
              className="w-full px-4 py-3 rounded-[1rem] border border-orange-200 focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 transition-all bg-orange-50/30 text-lg font-black tracking-[1em] text-center text-slate-900"
            />
          </motion.div>

          <motion.div variants={itemVariants} className="space-y-2">
            <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">
              Kata Sandi Baru
            </label>
            <div className="relative">
              <input
                type={showPass ? "text" : "password"}
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                placeholder="Minimal 6 karakter"
                required
                className="w-full px-4 py-3 rounded-[1rem] border border-slate-200 focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 transition-all bg-slate-50/50 text-sm font-medium"
              />
              <button
                type="button"
                onClick={() => setShowPass(!showPass)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors"
              >
                {showPass ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </motion.div>

          <motion.div variants={itemVariants} className="space-y-2">
            <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">
              Konfirmasi Kata Sandi
            </label>
            <div className="relative">
              <input
                type={showConfirmPass ? "text" : "password"}
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Ketik ulang kata sandi"
                required
                className="w-full px-4 py-3 rounded-[1rem] border border-slate-200 focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 transition-all bg-slate-50/50 text-sm font-medium"
              />
              <button
                type="button"
                onClick={() => setShowConfirmPass(!showConfirmPass)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors"
              >
                {showConfirmPass ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </motion.div>

          <motion.button
            variants={itemVariants}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            type="submit"
            disabled={
              isLoading ||
              token.length !== 8 ||
              newPassword.length < 6 ||
              newPassword !== confirmPassword
            }
            className="w-full py-3.5 mt-4 bg-orange-600 hover:bg-orange-700 text-white text-xs font-bold uppercase tracking-widest rounded-[1rem] transition-all flex items-center justify-center gap-2 disabled:opacity-70 disabled:bg-slate-400"
          >
            {isLoading ? (
              <Loader2 className="animate-spin" size={18} />
            ) : (
              "Validasi & Simpan"
            )}
          </motion.button>
        </form>
      </motion.div>
    </motion.div>
  );
}
