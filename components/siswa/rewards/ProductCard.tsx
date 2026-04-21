"use client";

import { useState } from "react";
import Image from "next/image";
import { Package, ShoppingCart, ImageOff } from "lucide-react";
import { AppCard } from "@/components/shared/AppCard";
import { AppButton } from "@/components/shared/AppButton";
import { Product } from "@/types";

interface ProductCardProps {
  product: Product;
  onRedeem: (product: Product) => void;
  isPending: boolean;
  userPoints: number;
}

export function ProductCard({
  product,
  onRedeem,
  isPending,
  userPoints,
}: ProductCardProps) {
  const canAfford = userPoints >= product.price;
  // STATE BARU: Untuk melacak apakah gambar gagal dimuat oleh Next.js
  const [imgError, setImgError] = useState(false);

  return (
    <AppCard
      noPadding
      className="group overflow-hidden flex flex-col h-full border-slate-200 hover:border-orange-300 transition-all"
    >
      {/* IMAGE SECTION DENGAN FALLBACK SYSTEM */}
      <div className="relative h-48 w-full bg-slate-50 overflow-hidden flex flex-col items-center justify-center">
        {product.image_url && !imgError ? (
          <Image
            src={product.image_url}
            alt={product.name}
            fill
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            className="object-cover transition-transform group-hover:scale-110 duration-500"
            onError={() => setImgError(true)}
            unoptimized
          />
        ) : (
          <div className="flex flex-col items-center justify-center text-slate-300 space-y-2 relative z-0">
            {imgError ? <ImageOff size={40} /> : <Package size={40} />}
            <span className="text-[10px] font-bold uppercase tracking-widest opacity-70">
              {imgError ? "Gagal Memuat" : "Tanpa Gambar"}
            </span>
          </div>
        )}

        {/* Badge Stok */}
        <div className="absolute top-3 right-3 bg-white/90 backdrop-blur px-3 py-1.5 rounded-full shadow-sm z-10 border border-slate-100">
          <p className="text-[10px] font-black text-slate-600 uppercase tracking-wider">
            Stok: {product.stock}
          </p>
        </div>
      </div>

      {/* CONTENT SECTION */}
      <div className="p-5 flex flex-col flex-1 space-y-4">
        <div className="space-y-1">
          <h3 className="font-bold text-slate-800 leading-tight line-clamp-1">
            {product.name}
          </h3>
          <p className="text-xs text-slate-500 line-clamp-2 min-h-8">
            {product.description || "Tidak ada deskripsi hadiah."}
          </p>
        </div>

        <div className="pt-4 mt-auto border-t border-slate-100 flex items-center justify-between">
          <div>
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest leading-none mb-1">
              Harga Poin
            </p>
            <p className="text-xl font-black text-orange-600 tracking-tight leading-none">
              {product.price}
            </p>
          </div>

          <AppButton
            onClick={() => onRedeem(product)}
            disabled={!canAfford || isPending || product.stock < 1}
            variant={canAfford && product.stock > 0 ? "orange" : "outline"}
            size="sm"
            className="h-10 px-5 rounded-xl shadow-md"
            leftIcon={<ShoppingCart size={16} />}
          >
            {product.stock < 1 ? "Habis" : "Tukar"}
          </AppButton>
        </div>
      </div>
    </AppCard>
  );
}
