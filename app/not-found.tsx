import { MapPinOff, ArrowLeft } from "lucide-react";
import { AppButton } from "@/components/shared/AppButton";
import Link from "next/link";

export default function NotFound() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-slate-50 p-6">
      <div className="bg-white p-8 md:p-12 rounded-[2rem] border border-slate-100 shadow-xl max-w-lg w-full text-center space-y-6 animate-in fade-in slide-in-from-bottom-8 duration-700">
        <h1 className="text-[8rem] font-black text-slate-100 leading-none select-none">
          404
        </h1>

        <div className="absolute top-12 left-1/2 -translate-x-1/2 w-24 h-24 bg-orange-50 rounded-full flex items-center justify-center border-8 border-orange-100/50 mt-12 md:mt-16">
          <MapPinOff size={40} className="text-orange-500" />
        </div>

        <div className="space-y-2 relative z-10 pt-4">
          <h2 className="text-2xl font-black text-slate-800 tracking-tight">
            Halaman Tidak Ditemukan
          </h2>
          <p className="text-slate-500 font-medium text-sm">
            Waduh, sepertinya alamat URL yang kamu tuju salah atau halaman ini
            sudah dipindahkan.
          </p>
        </div>

        <div className="pt-4 flex justify-center relative z-10">
          <Link href="/">
            <AppButton variant="default" leftIcon={<ArrowLeft size={18} />}>
              Kembali ke Jalan yang Benar
            </AppButton>
          </Link>
        </div>
      </div>
    </div>
  );
}
