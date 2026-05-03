import type { Metadata } from "next";
import { Plus_Jakarta_Sans } from "next/font/google";
import "./globals.css";
import { cn } from "@/lib/utils";
import { PageTracker } from "@/components/shared/PageTracker";

const plusJakartaSans = Plus_Jakarta_Sans({
  subsets: ["latin"],
  variable: "--font-sans",
});

export const metadata: Metadata = {
  title: "SMB Suvanna Dipa",
  description: "Landing Page Sekolah Minggu Buddha Suvanna Dipa",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="id"
      className={cn(
        "h-full",
        "antialiased",
        plusJakartaSans.variable,
        "font-sans",
        "scroll-smooth scroll-pt-20"
      )}
    >
      <body className="min-h-full flex flex-col bg-slate-50/50 text-slate-900">
        <PageTracker />
        {children}
      </body>
    </html>
  );
}
