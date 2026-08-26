import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import TechMarquee from "@/components/TechMarquee";
import ParadoxSection from "@/components/ParadoxSection";
import HowItWorksSection from "@/components/HowItWorksSection";
import TemplatesSection from "@/components/TemplatesSection";
import CtaSection from "@/components/CtaSection";
import Footer from "@/components/Footer";

export default function Home() {
  return (
    <div className="bg-[#F7F4EF] text-[#111111] min-h-screen flex flex-col custom-cursor font-sans">
      <Navbar />
      <main className="flex-1 flex flex-col w-full">
        <Hero />
        <TechMarquee />
        <ParadoxSection />
        <HowItWorksSection />
        <TemplatesSection />
        <CtaSection />
      </main>
      <Footer />
    </div>
  );
}
