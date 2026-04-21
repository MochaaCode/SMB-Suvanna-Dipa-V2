"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription,
} from "@/components/ui/dialog";
import { cn } from "@/lib/utils";
import React from "react";

interface AppModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  description?: React.ReactNode;
  children?: React.ReactNode;
  footer?: React.ReactNode;
  variant?: "orange" | "red" | "blue" | "slate";
  maxWidth?: "sm" | "md" | "lg" | "xl" | "2xl" | "full";
  className?: string;
}

export function AppModal({
  isOpen,
  onClose,
  title,
  description,
  children,
  footer,
  variant = "orange",
  maxWidth = "lg",
  className,
}: AppModalProps) {
  const headerVariants = {
    orange: "bg-orange-600",
    red: "bg-red-600",
    blue: "bg-blue-600",
    slate: "bg-slate-900",
  };

  const maxWidthClasses = {
    sm: "sm:max-w-sm",
    md: "sm:max-w-md",
    lg: "sm:max-w-lg",
    xl: "sm:max-w-xl",
    "2xl": "sm:max-w-2xl",
    full: "sm:max-w-[95vw]",
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent
        className={cn(
          "rounded-[1rem] border border-slate-200 shadow-2xl p-0 flex flex-col max-h-[90vh] overflow-hidden",
          maxWidthClasses[maxWidth],
          className,
        )}
      >
        <div className={cn("p-6 text-white shrink-0", headerVariants[variant])}>
          <DialogHeader>
            <DialogTitle className="text-xl font-bold text-white leading-none">
              {title}
            </DialogTitle>
            {description && (
              <DialogDescription className="text-white/80 text-xs font-medium mt-1.5 leading-relaxed">
                {description}
              </DialogDescription>
            )}
          </DialogHeader>
        </div>

        <div className="flex-1 overflow-y-auto p-6 bg-slate-50/50 custom-scrollbar">
          {children}
        </div>

        {footer && (
          <DialogFooter className="p-5 bg-white border-t border-slate-100 shrink-0 flex items-center gap-3">
            {footer}
          </DialogFooter>
        )}
      </DialogContent>
    </Dialog>
  );
}
