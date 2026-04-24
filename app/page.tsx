import BubbleBackground from "@/components/landing/BubbleBackground";
import ActivityShowcase from "@/components/landing/ActivityShowcase";
import { getPublishedContent } from "@/actions/public/content";

import LandingNavbar from "@/components/landing/LandingNavbar";
import HeroSection from "@/components/landing/HeroSection";
import AboutSection from "@/components/landing/AboutSection";
import MilestoneSection from "@/components/landing/MilestoneSection";
import ContactFooterSection from "@/components/landing/ContactFooterSection";

export default async function Home() {
  const rawContent = await getPublishedContent();
  const getContent = (section: string) =>
    rawContent.find((c) => c.section === section)?.content || {};

  const about = getContent("about");
  const vision = getContent("vision");
  const values = getContent("values");
  const milestone = getContent("milestone");
  const testimonial = getContent("testimonial");
  const gallery = getContent("gallery");
  const contact = getContent("contact");
  
  return (
    <div className="relative flex flex-col min-h-screen font-sans text-slate-800 overflow-x-hidden selection:bg-orange-200 selection:text-orange-900">
      <BubbleBackground />
      <LandingNavbar />

      <main className="relative z-10">
        <HeroSection />
        <AboutSection about={about} vision={vision} values={values} />
        <MilestoneSection milestone={milestone} testimonial={testimonial} />
        <ActivityShowcase images={gallery.items || []} />
        <ContactFooterSection contact={contact} />
      </main>
    </div>
  );
}
