"use client";

import { useState } from "react";
import Image from "next/image";
import { Package, ShoppingCart, ImageOff } from "lucide-react";
import { AppCard } from "@/components/shared/AppCard";
import { AppButton } from "@/components/shared/AppButton";
import { cn } from "@/lib/utils";
import type { Product } from "@/types";

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
  const [imgError, setImgError] = useState(false);

  return (
    <AppCard
      noPadding
      className="group overflow-hidden flex flex-col h-full border-slate-200 hover:border-orange-300 hover:shadow-lg transition-all rounded-[1.5rem] bg-white"
    >
      <div className="relative h-44 w-full bg-slate-100 overflow-hidden flex flex-col items-center justify-center border-b border-slate-100">
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
          <div className="flex flex-col items-center justify-center text-slate-400 space-y-2 relative z-0">
            {imgError ? <ImageOff size={36} /> : <Package size={36} />}
            <span className="text-[9px] font-black uppercase tracking-widest opacity-60">
              {imgError ? "Gagal Memuat" : "Tanpa Gambar"}
            </span>
          </div>
        )}

        <div className="absolute top-3 right-3 bg-white/95 backdrop-blur-sm px-2.5 py-1 rounded-lg shadow-sm z-10 border border-slate-200">
          <p className="text-[9px] font-black text-slate-700 uppercase tracking-widest">
            Sisa: {product.stock}
          </p>
        </div>
      </div>

      <div className="p-4 flex flex-col flex-1">
        <div className="space-y-1.5 mb-4">
          <h3 className="text-sm font-black text-slate-800 leading-tight line-clamp-2 group-hover:text-orange-600 transition-colors">
            {product.name}
          </h3>
          <p className="text-[11px] font-medium text-slate-500 line-clamp-2">
            {product.description ||
              "Tidak ada deskripsi detail mengenai produk ini."}
          </p>
        </div>

        <div className="mt-auto flex items-center justify-between pt-3 border-t border-slate-100">
          <div className="flex flex-col">
            <span className="text-[8px] font-black uppercase tracking-widest text-slate-400">
              Harga
            </span>
            <span
              className={cn(
                "text-lg font-black tracking-tight leading-none",
                canAfford ? "text-orange-600" : "text-red-500",
              )}
            >
              {product.price} <span className="text-[10px] uppercase">Pts</span>
            </span>
          </div>

          <AppButton
            onClick={() => onRedeem(product)}
            disabled={!canAfford || isPending || product.stock < 1}
            variant={canAfford && product.stock > 0 ? "orange" : "outline"}
            className={cn(
              "h-9 px-4 rounded-xl text-xs font-bold shadow-sm",
              !canAfford && "bg-slate-50 text-slate-400 border-transparent",
            )}
            leftIcon={<ShoppingCart size={14} />}
          >
            {product.stock < 1 ? "Habis" : canAfford ? "Tukar" : "Kurang"}
          </AppButton>
        </div>
      </div>
    </AppCard>
  );
}
