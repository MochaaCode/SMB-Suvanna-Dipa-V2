"use client";

import * as React from "react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Loader2 } from "lucide-react";

interface AppButtonProps extends React.ComponentProps<"button"> {
  variant?:
    | "default"
    | "outline"
    | "orange"
    | "red"
    | "slate"
    | "ghost"
    | "secondary";
  size?: "default" | "sm" | "lg" | "xs" | "icon";
  isLoading?: boolean;
  leftIcon?: React.ReactNode;
}

export function AppButton({
  children,
  className,
  isLoading,
  variant = "default",
  leftIcon,
  ...props
}: AppButtonProps) {
  const baseStyles =
    "rounded-lg font-semibold text-sm h-10 px-5 shadow-sm transition-all active:scale-95 border-none disabled:opacity-50 flex items-center justify-center";

  const customVariants = {
    default:
      "bg-orange-600 hover:bg-orange-700 text-white shadow-orange-200/50",
    outline:
      "bg-white border border-slate-200 text-slate-700 hover:bg-orange-50 hover:text-orange-600 hover:border-orange-200 shadow-none",
    secondary:
      "bg-slate-100 text-slate-700 hover:bg-orange-100 hover:text-orange-700 shadow-none",
    ghost:
      "bg-transparent hover:bg-orange-50 text-slate-600 hover:text-orange-600 shadow-none",
    orange: "bg-orange-600 hover:bg-orange-700 text-white shadow-orange-200/50",
    red: "bg-red-600 hover:bg-red-700 text-white shadow-red-200/50",
    slate: "bg-slate-900 hover:bg-slate-800 text-white shadow-slate-200/50",
  };

  return (
    <Button
      className={cn(
        baseStyles,
        customVariants[variant as keyof typeof customVariants] ||
          customVariants.default,
        className,
      )}
      disabled={isLoading || props.disabled}
      {...props}
    >
      {isLoading ? (
        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
      ) : (
        leftIcon && <span className="mr-2">{leftIcon}</span>
      )}
      {children}
    </Button>
  );
}
