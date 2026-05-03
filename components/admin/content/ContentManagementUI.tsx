/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useState, useTransition } from "react";
import {
  Globe,
  Image as ImageIcon,
  Users,
  Target,
  HeartHandshake,
  Flag,
  MessageSquare,
  MapPin,
} from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { updatePublicContent } from "@/actions/admin/content";
import toast from "react-hot-toast";

import { PageHeader } from "../../shared/PageHeader";
import { AppCard } from "../../shared/AppCard";

import { AboutForm } from "./forms/AboutForm";
import { VisionForm } from "./forms/VisionForm";
import { CoreValuesForm } from "./forms/CoreValuesForm";
import { MilestoneForm } from "./forms/MilestoneForm";
import { TestimonialForm } from "./forms/TestimonialForm";
import { GalleryForm } from "./forms/GalleryForm";
import { ContactForm } from "./forms/ContactForm";

import type { PublicContent } from "@/types";

interface ContentManagementUIProps {
  initialContent: PublicContent[];
}

export function ContentManagementUI({
  initialContent,
}: ContentManagementUIProps) {
  const [activeTab, setActiveTab] = useState("about");
  const [isPending, startTransition] = useTransition();

  const getContent = <T,>(section: string): T =>
    (initialContent.find((c) => c.section === section)?.content ||
      {}) as unknown as T;

  const sectionNames: Record<string, string> = {
    about: "Tentang Kami",
    vision: "Visi & Misi",
    values: "Nilai Inti",
    milestone: "Kegiatan Dharma",
    testimonial: "Testimoni",
    gallery: "Galeri Kegiatan",
    contact: "Kontak & Lokasi",
  };

  const handleSave = (section: string, payload: unknown) => {
    startTransition(async () => {
      const label = sectionNames[section] || section;
      const tid = toast.loading(`Menyimpan ${label}...`);
      try {
        await updatePublicContent(section, payload as Record<string, unknown>);
        toast.success(`${label} berhasil diperbarui!`, { id: tid });
      } catch (error: any) {
        toast.error(error.message, { id: tid });
      }
    });
  };

  const TABS_CONFIG = [
    { id: "about", icon: Users, label: "Tentang Kami" },
    { id: "vision", icon: Target, label: "Visi & Misi" },
    { id: "values", icon: HeartHandshake, label: "Nilai Inti" },
    { id: "milestone", icon: Flag, label: "Kegiatan Dharma" },
    { id: "testimonial", icon: MessageSquare, label: "Testimoni" },
    { id: "gallery", icon: ImageIcon, label: "Galeri Kegiatan" },
    { id: "contact", icon: MapPin, label: "Kontak & Lokasi" },
  ];

  return (
    <div className="space-y-6 animate-in fade-in duration-700">
      <PageHeader
        title="KELOLA KONTEN"
        highlightText="PUBLIK"
        icon={<Globe size={24} />}
        subtitle="Kelola informasi yang ditampilkan pada halaman utama situs web."
        themeColor="orange"
      />

      <AppCard
        noPadding
        className="flex flex-col min-h-150 border-slate-200 shadow-sm"
      >
        <Tabs
          value={activeTab}
          onValueChange={setActiveTab}
          className="w-full flex flex-col flex-1"
        >
          <div className="bg-slate-50 border-b border-slate-200 px-6 py-4 overflow-x-auto custom-scrollbar rounded-t-[1rem]">
            <TabsList className="flex gap-2 w-max bg-transparent p-0 h-auto">
              {TABS_CONFIG.map((tab) => (
                <TabsTrigger
                  key={tab.id}
                  value={tab.id}
                  className="px-4 py-2.5 rounded-lg text-xs font-bold data-[state=active]:bg-orange-600 data-[state=active]:text-white data-[state=active]:shadow-sm transition-all text-slate-600 hover:bg-slate-200 border border-transparent shrink-0 flex items-center"
                >
                  <tab.icon size={16} className="mr-2" /> {tab.label}
                </TabsTrigger>
              ))}
            </TabsList>
          </div>

          <div className="p-6 md:p-8 flex-1 bg-white rounded-b-[1rem]">
            <TabsContent value="about" className="m-0 outline-none">
              <AboutForm
                initialData={getContent("about")}
                onSave={handleSave}
                isPending={isPending}
              />
            </TabsContent>
            <TabsContent value="vision" className="m-0 outline-none">
              <VisionForm
                initialData={getContent("vision")}
                onSave={handleSave}
                isPending={isPending}
              />
            </TabsContent>
            <TabsContent value="values" className="m-0 outline-none">
              <CoreValuesForm
                initialData={getContent("values")}
                onSave={handleSave}
                isPending={isPending}
              />
            </TabsContent>
            <TabsContent value="milestone" className="m-0 outline-none">
              <MilestoneForm
                initialData={getContent("milestone")}
                onSave={handleSave}
                isPending={isPending}
              />
            </TabsContent>
            <TabsContent value="testimonial" className="m-0 outline-none">
              <TestimonialForm
                initialData={getContent("testimonial")}
                onSave={handleSave}
                isPending={isPending}
              />
            </TabsContent>
            <TabsContent value="gallery" className="m-0 outline-none">
              <GalleryForm
                initialData={getContent("gallery")}
                onSave={handleSave}
                isPending={isPending}
              />
            </TabsContent>
            <TabsContent value="contact" className="m-0 outline-none">
              <ContactForm
                initialData={getContent("contact")}
                onSave={handleSave}
                isPending={isPending}
              />
            </TabsContent>
          </div>
        </Tabs>
      </AppCard>
    </div>
  );
}
