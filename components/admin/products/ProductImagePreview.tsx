"use client";

import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Maximize2, ImageOff } from "lucide-react";
import Image from "next/image";

interface ProductImagePreviewProps {
  src: string | null;
  alt: string;
}

export function ProductImagePreview({ src, alt }: ProductImagePreviewProps) {
  const [hasError, setHasError] = useState(false);
  const [prevSrc, setPrevSrc] = useState(src);

  if (src !== prevSrc) {
    setPrevSrc(src);
    setHasError(false);
  }

  const renderImage = (isThumbnail: boolean) => {
    if (!src || hasError) {
      return (
        <div
          className={`flex flex-col items-center justify-center w-full h-full text-slate-300 bg-slate-50 ${isThumbnail ? "border-b border-slate-100" : ""}`}
        >
          <ImageOff
            size={isThumbnail ? 40 : 64}
            strokeWidth={1.5}
            className="mb-2"
          />
          <span className="text-[10px] font-bold uppercase text-slate-400 tracking-wider">
            Gambar Bermasalah
          </span>
        </div>
      );
    }

    return (
      <Image
        src={src}
        alt={alt}
        fill
        unoptimized
        className={
          isThumbnail
            ? "object-cover group-hover/preview:scale-105 transition-transform duration-500"
            : "object-contain"
        }
        onError={() => setHasError(true)}
      />
    );
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <div className="relative w-full h-full cursor-zoom-in group/preview">
          {renderImage(true)}

          {!hasError && src && (
            <div className="absolute inset-0 bg-black/0 group-hover/preview:bg-black/20 transition-colors flex items-center justify-center opacity-0 group-hover/preview:opacity-100">
              <div className="bg-white/90 p-2 rounded-full shadow-lg transform scale-90 group-hover/preview:scale-100 transition-transform">
                <Maximize2 size={18} className="text-slate-900" />
              </div>
            </div>
          )}
        </div>
      </DialogTrigger>
      <DialogContent className="max-w-3xl p-1 bg-transparent border-none shadow-none outline-none overflow-hidden">
        <div className="relative aspect-square w-full rounded-[1rem] overflow-hidden bg-slate-900/50 backdrop-blur-md">
          {renderImage(false)}
        </div>
        <DialogHeader>
          <DialogTitle className="text-center text-white font-black text-xl mt-3 drop-shadow-md tracking-tight">
            {alt}
          </DialogTitle>
        </DialogHeader>
      </DialogContent>
    </Dialog>
  );
}
