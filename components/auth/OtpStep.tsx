"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { verifyOtpAction, resendOtpAction } from "@/actions/auth/login";
import toast from "react-hot-toast";
import { motion, Variants } from "framer-motion";
import {
  Loader2,
  ShieldCheck,
  Mail,
  RotateCcw,
  ArrowLeft,
} from "lucide-react";

const containerVariants: Variants = {
  hidden: { opacity: 0, x: 40 },
  visible: {
    opacity: 1,
    x: 0,
    transition: { duration: 0.4, ease: "easeOut", staggerChildren: 0.08 },
  },
  exit: {
    opacity: 0,
    x: -40,
    transition: { duration: 0.3, ease: "easeIn" },
  },
};

const itemVariants: Variants = {
  hidden: { opacity: 0, y: 16 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.4, ease: "easeOut" } },
};

interface OtpStepProps {
  email: string;
  maskedEmail: string;
  onVerified: (role: string) => void;
  onBack: () => void;
}

const OTP_LENGTH = 6;
const RESEND_COOLDOWN = 60; // detik

export default function OtpStep({
  email,
  maskedEmail,
  onVerified,
  onBack,
}: OtpStepProps) {
  const [otp, setOtp] = useState<string[]>(Array(OTP_LENGTH).fill(""));
  const [isVerifying, setIsVerifying] = useState(false);
  const [isResending, setIsResending] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [resendCooldown, setResendCooldown] = useState(RESEND_COOLDOWN);
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  // Countdown timer untuk resend
  useEffect(() => {
    if (resendCooldown <= 0) return;
    const timer = setInterval(() => {
      setResendCooldown((prev) => prev - 1);
    }, 1000);
    return () => clearInterval(timer);
  }, [resendCooldown]);

  // Focus input pertama saat mount
  useEffect(() => {
    inputRefs.current[0]?.focus();
  }, []);

  const handleChange = (index: number, value: string) => {
    // Hanya angka
    if (value && !/^\d$/.test(value)) return;

    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);
    setError(null);

    // Auto-focus ke input berikutnya
    if (value && index < OTP_LENGTH - 1) {
      inputRefs.current[index + 1]?.focus();
    }

    // Auto-submit saat semua digit terisi
    if (value && index === OTP_LENGTH - 1) {
      const fullCode = newOtp.join("");
      if (fullCode.length === OTP_LENGTH) {
        handleVerify(fullCode);
      }
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handlePaste = (e: React.ClipboardEvent) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData("text").replace(/\D/g, "").slice(0, OTP_LENGTH);
    if (!pastedData) return;

    const newOtp = [...otp];
    pastedData.split("").forEach((char, i) => {
      newOtp[i] = char;
    });
    setOtp(newOtp);
    setError(null);

    // Focus ke input terakhir yang diisi atau terakhir
    const focusIndex = Math.min(pastedData.length, OTP_LENGTH) - 1;
    inputRefs.current[focusIndex]?.focus();

    // Auto-submit jika penuh
    if (pastedData.length === OTP_LENGTH) {
      handleVerify(pastedData);
    }
  };

  const handleVerify = useCallback(
    async (code: string) => {
      if (isVerifying) return;
      setIsVerifying(true);
      setError(null);

      try {
        const result = await verifyOtpAction(email, code);
        if (result.success) {
          toast.success("Verifikasi berhasil. Selamat datang!");
          onVerified(result.role!);
        } else {
          setError(result.error ?? "Kode verifikasi salah.");
          setOtp(Array(OTP_LENGTH).fill(""));
          inputRefs.current[0]?.focus();
        }
      } catch {
        setError("Terjadi kesalahan sistem.");
        setOtp(Array(OTP_LENGTH).fill(""));
        inputRefs.current[0]?.focus();
      } finally {
        setIsVerifying(false);
      }
    },
    [email, isVerifying, onVerified]
  );

  const handleResend = async () => {
    if (resendCooldown > 0 || isResending) return;
    setIsResending(true);

    try {
      const result = await resendOtpAction(email);
      if (result.success) {
        toast.success("Kode verifikasi baru telah dikirim.");
        setResendCooldown(RESEND_COOLDOWN);
        setOtp(Array(OTP_LENGTH).fill(""));
        setError(null);
        inputRefs.current[0]?.focus();
      } else {
        toast.error(result.error ?? "Gagal mengirim ulang kode.");
      }
    } catch {
      toast.error("Terjadi kesalahan sistem.");
    } finally {
      setIsResending(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const code = otp.join("");
    if (code.length !== OTP_LENGTH) {
      setError("Masukkan 6 digit kode verifikasi.");
      return;
    }
    handleVerify(code);
  };

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      exit="exit"
      className="w-full flex flex-col justify-center"
    >
      {/* Header */}
      <motion.div
        variants={itemVariants}
        className="flex flex-col items-center md:items-start mb-8 text-center md:text-left"
      >
        <div className="w-16 h-16 bg-orange-50 rounded-2xl flex items-center justify-center mb-4">
          <ShieldCheck size={32} className="text-orange-500" />
        </div>
        <h2 className="text-2xl font-black text-slate-900 tracking-tight">
          Verifikasi Identitas
        </h2>
        <div className="flex items-center gap-2 mt-3">
          <Mail size={14} className="text-slate-400" />
          <p className="text-slate-500 text-sm font-medium">
            Kode dikirim ke{" "}
            <span className="text-slate-700 font-semibold">{maskedEmail}</span>
          </p>
        </div>
      </motion.div>

      {/* OTP Form */}
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* OTP Inputs */}
        <motion.div variants={itemVariants} className="space-y-3">
          <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">
            Kode Verifikasi
          </label>
          <div className="flex gap-2 sm:gap-3 justify-center md:justify-start">
            {otp.map((digit, index) => (
              <input
                key={index}
                ref={(el) => {
                  inputRefs.current[index] = el;
                }}
                type="text"
                inputMode="numeric"
                maxLength={1}
                value={digit}
                onChange={(e) => handleChange(index, e.target.value)}
                onKeyDown={(e) => handleKeyDown(index, e)}
                onPaste={index === 0 ? handlePaste : undefined}
                disabled={isVerifying}
                className={`w-11 h-13 sm:w-12 sm:h-14 text-center text-xl font-bold rounded-xl border-2 transition-all duration-200 bg-slate-50/50 text-slate-900 focus:outline-none
                  ${
                    error
                      ? "border-red-300 focus:border-red-500 focus:ring-2 focus:ring-red-500/20"
                      : digit
                        ? "border-orange-400 focus:border-orange-500 focus:ring-2 focus:ring-orange-500/20"
                        : "border-slate-200 focus:border-orange-500 focus:ring-2 focus:ring-orange-500/20"
                  }
                  disabled:opacity-50 disabled:cursor-not-allowed
                `}
                aria-label={`Digit ${index + 1}`}
              />
            ))}
          </div>

          {/* Error message */}
          {error && (
            <motion.p
              initial={{ opacity: 0, y: -4 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-xs font-semibold text-red-500 text-center md:text-left"
            >
              {error}
            </motion.p>
          )}
        </motion.div>

        {/* Submit Button */}
        <motion.button
          variants={itemVariants}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          type="submit"
          disabled={isVerifying || otp.join("").length !== OTP_LENGTH}
          className="w-full py-3.5 bg-slate-900 hover:bg-orange-600 text-white text-sm font-bold uppercase tracking-widest rounded-[1rem] transition-colors shadow-md flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
        >
          {isVerifying ? (
            <>
              <Loader2 className="animate-spin" size={18} />
              <span>Memverifikasi...</span>
            </>
          ) : (
            "Verifikasi Kode"
          )}
        </motion.button>

        {/* Resend & Back */}
        <motion.div
          variants={itemVariants}
          className="flex flex-col sm:flex-row items-center justify-between gap-3"
        >
          <button
            type="button"
            onClick={onBack}
            disabled={isVerifying}
            className="flex items-center gap-1.5 text-xs font-bold text-slate-400 hover:text-slate-700 transition-colors uppercase tracking-wider disabled:opacity-50"
          >
            <ArrowLeft size={14} />
            Kembali
          </button>

          <button
            type="button"
            onClick={handleResend}
            disabled={resendCooldown > 0 || isResending || isVerifying}
            className="flex items-center gap-1.5 text-xs font-bold transition-colors uppercase tracking-wider disabled:opacity-50 disabled:cursor-not-allowed text-orange-600 hover:text-orange-700"
          >
            {isResending ? (
              <Loader2 className="animate-spin" size={14} />
            ) : (
              <RotateCcw size={14} />
            )}
            {resendCooldown > 0
              ? `Kirim ulang (${resendCooldown}s)`
              : "Kirim Ulang Kode"}
          </button>
        </motion.div>
      </form>
    </motion.div>
  );
}
