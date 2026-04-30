"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { loginAction } from "@/actions/auth/login";
import { loginSchema, type LoginInput } from "@/lib/validations/auth/login";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import {
  Eye,
  EyeOff,
  Loader2,
  LockKeyhole,
  ShieldCheck,
  ArrowLeft,
} from "lucide-react";
import { motion, Variants } from "framer-motion";

const containerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.1 } },
};
const itemVariants: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" } },
};

export default function LoginForm() {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginInput>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (data: LoginInput) => {
    setIsLoading(true);
    try {
      const result = await loginAction(data);
      if (result.success) {
        toast.success("Autentikasi berhasil. Selamat datang!");
        if (result.role === "admin") router.push("/admin/dashboard");
        else if (result.role === "pembina") router.push("/pembina/dashboard");
        else router.push("/siswa/dashboard");
      } else {
        toast.error(result.error as string);
      }
    } catch (error) {
      toast.error("Terjadi kesalahan sistem internal.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5 }}
      className="w-full max-w-4xl mx-auto bg-white rounded-[1rem] shadow-2xl overflow-hidden flex flex-col md:flex-row min-h-137.5 border border-slate-100 z-10 relative"
    >
      <button
        onClick={() => router.push("/")}
        className="absolute top-8 left-8 flex items-center gap-2 text-slate-400 hover:text-slate-900 transition-colors group z-20"
      >
        <ArrowLeft
          size={18}
          className="group-hover:-translate-x-1 transition-transform"
        />
        <span className="text-xs font-bold uppercase tracking-wider">
          Beranda
        </span>
      </button>

      {/* Left Panel — Login Form */}
      <div className="w-full md:w-1/2 p-8 md:p-12 mt-10 md:mt-0 flex flex-col justify-center">
        <motion.div
          initial={{ opacity: 0, x: -40 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.4, ease: "easeOut" }}
        >
          <motion.div
            variants={itemVariants}
            initial="hidden"
            animate="visible"
            className="flex flex-col items-center md:items-start mb-8 text-center md:text-left"
          >
            <div className="mb-4">
              <Image
                src="/images/logo-smb.png"
                alt="Logo SMB"
                width={80}
                height={80}
                className="object-contain drop-shadow-sm"
              />
            </div>
            <h1 className="text-3xl font-black text-slate-900 tracking-tight">
              Selamat Datang!
            </h1>
            <p className="text-slate-500 text-sm font-medium mt-2">
              Masukkan email dan kata sandi kamu untuk melanjutkan.
            </p>
          </motion.div>

          <motion.form
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            onSubmit={handleSubmit(onSubmit)}
            className="space-y-6"
          >
            <motion.div variants={itemVariants} className="space-y-2">
              <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                Alamat Email
              </label>
              <input
                {...register("email")}
                type="email"
                placeholder="nama@email.com"
                className="w-full px-4 py-3 rounded-[1rem] border border-slate-200 focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 transition-all bg-slate-50/50 text-sm font-medium text-slate-900"
              />
              {errors.email && (
                <p className="text-xs font-semibold text-red-500">
                  {errors.email.message}
                </p>
              )}
            </motion.div>

            <motion.div variants={itemVariants} className="space-y-2">
              <div className="flex justify-between items-center">
                <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                  Kata Sandi
                </label>
                <button
                  type="button"
                  onClick={() => router.push("/forgot-password")}
                  className="text-xs text-orange-600 hover:text-orange-700 font-bold transition-colors"
                >
                  Lupa Sandi?
                </button>
              </div>
              <div className="relative">
                <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">
                  <LockKeyhole size={18} />
                </div>
                <input
                  {...register("password")}
                  type={showPassword ? "text" : "password"}
                  placeholder="••••••••"
                  className="w-full pl-11 pr-12 py-3 rounded-[1rem] border border-slate-200 focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 transition-all bg-slate-50/50 text-sm font-medium text-slate-900"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors"
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
              {errors.password && (
                <p className="text-xs font-semibold text-red-500">
                  {errors.password.message}
                </p>
              )}
            </motion.div>

            <motion.button
              variants={itemVariants}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              type="submit"
              disabled={isLoading}
              className="w-full py-3.5 mt-2 bg-slate-900 hover:bg-orange-600 text-white text-sm font-bold uppercase tracking-widest rounded-[1rem] transition-colors shadow-md flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
            >
              {isLoading ? (
                <Loader2 className="animate-spin" size={18} />
              ) : (
                "Masuk"
              )}
            </motion.button>
          </motion.form>
        </motion.div>
      </div>

      {/* Right Panel — Decorative */}
      <div className="hidden md:flex w-1/2 bg-slate-900 p-12 flex-col items-center justify-center relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10 mix-blend-overlay"></div>
        <div className="absolute bottom-1/4 right-10 w-64 h-64 bg-orange-500/20 rounded-full blur-3xl"></div>
        <ShieldCheck
          size={80}
          strokeWidth={1}
          className="text-orange-500 mb-6 relative z-10"
        />
        <h3 className="text-2xl font-bold text-white tracking-tight text-center relative z-10">
           Sistem SMB Suvanna Dipa
        </h3>
        <p className="text-slate-400 text-sm text-center mt-4 max-w-xs relative z-10 leading-relaxed">
           Sistem pengelolaan kehadiran dan aktivitas siswa
           Sekolah Minggu Buddha Suvanna Dipa.
        </p>
      </div>
    </motion.div>
  );
}

