import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import Link from 'next/link';
import { notFound } from 'next/navigation';

interface ProjectData {
  slug: string;
  title: string;
  category: string;
  subtitle: string;
  story: string;
  challenge: string;
  outcome: string;
  colors: { name: string; hex: string }[];
  typography: string[];
  tags: string[];
  imgUrls: string[];
  nextSlug: string;
  nextTitle: string;
}

const projects: Record<string, ProjectData> = {
  "kaito-tea-co": {
    slug: "kaito-tea-co",
    title: "Kaito Tea Co.",
    category: "BRAND IDENTITY",
    subtitle: "Brand identity, packaging design and bespoke storefront.",
    story: "Kaito Tea Co. is an artisanal tea merchant based in Kyoto, sourcing directly from organic micro-lots. The project required a brand identity that respects centuries of tea traditions while appealing to a modern global audience.",
    challenge: "Developing a visual system that feels both ancient and contemporary. Traditional Japanese tea houses use minimalist wooden plaques, whereas digital-first platforms require high-contrast, scalable graphic elements.",
    outcome: "We designed a logo based on traditional family crests (kamon), using structured geometry. The packaging uses textured natural washi paper overlays with modern monospace serial numbers. We also designed their online shop.",
    colors: [
      { name: "Kyoto Forest", hex: "#1A3323" },
      { name: "Washi Cream", hex: "#E8E5DF" },
      { name: "Organic Ochre", hex: "#C4A47C" },
      { name: "Sumy Charcoal", hex: "#111111" }
    ],
    typography: ["Cormorant Garamond (Serif)", "Inter (Sans-Serif)"],
    tags: ["Brand Identity", "Packaging", "Art Direction", "Web Design"],
    imgUrls: [
      "https://images.unsplash.com/photo-1597481499750-3e6b22637e12?q=80&w=800&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1564890369478-c89ca6d9cde9?q=80&w=800&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1576092768241-dec231879fc3?q=80&w=800&auto=format&fit=crop"
    ],
    nextSlug: "paper-bloom-issue-no-02",
    nextTitle: "Paper & Bloom — Issue No. 02"
  },
  "paper-bloom-issue-no-02": {
    slug: "paper-bloom-issue-no-02",
    title: "Paper & Bloom — Issue No. 02",
    category: "PRINT DESIGN",
    subtitle: "Bespoke botanical publication layout and design.",
    story: "Paper & Bloom is an independent botanical journal published twice a year. The second issue explores micro-landscapes, indoor ferns, and sustainable soil practices. The print run features raw recycled paper stocks and textured typography layout grids.",
    challenge: "Fitting a vast array of high-detail photography, scientific diagrams, and essays into a cohesive, readable format that feels tactile rather than clinical.",
    outcome: "A grid-based editorial system featuring large margins, asymmetry, and prominent serif headlines. We selected three distinct recycled paper stocks to vary the texture across sections (essays, showcase, indices).",
    colors: [
      { name: "Sage leaf", hex: "#3C4E3D" },
      { name: "Raw Gray", hex: "#F2ECE4" },
      { name: "Natural Cork", hex: "#BFA48A" },
      { name: "Typo Ink", hex: "#111111" }
    ],
    typography: ["Cormorant Garamond (Serif)", "Courier Prime (Mono)"],
    tags: ["Print Design", "Typography", "Editorial", "Layout Grid"],
    imgUrls: [
      "https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?q=80&w=800&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1512820790803-83ca734da794?q=80&w=800&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1476275466078-4007374efbbe?q=80&w=800&auto=format&fit=crop"
    ],
    nextSlug: "sitelines-annual-design-report",
    nextTitle: "SiteLines — Annual Design Report"
  },
  "sitelines-annual-design-report": {
    slug: "sitelines-annual-design-report",
    title: "SiteLines — Annual Design Report",
    category: "EDITORIAL DESIGN",
    subtitle: "Editorial direction and visual data graphics.",
    story: "SiteLines compiles visual essays and data analytics on architectural sustainability. The annual report serves as a benchmark for designers and urban planners, combining strict data visuals with editorial space.",
    challenge: "Rendering dense mathematical tables and engineering charts in a way that aligns with the visual narrative of structural design and layout architecture.",
    outcome: "A double-page grid alignment where charts occupy a strict layout column. Data labels are fully styled in monospaced typography, contrasted by clean photography layout pages.",
    colors: [
      { name: "Blueprint Blue", hex: "#0C3E61" },
      { name: "Warm Clay", hex: "#DDA15E" },
      { name: "Draft Paper", hex: "#F7F4EF" },
      { name: "Lead Black", hex: "#111111" }
    ],
    typography: ["Cormorant Garamond (Serif)", "JetBrains Mono (Mono)"],
    tags: ["Editorial", "Data Graphics", "Report Design", "TailwindCSS"],
    imgUrls: [
      "https://images.unsplash.com/photo-1586075010923-2dd45e9b2d4f?q=80&w=800&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1551288049-bebda4e38f71?q=80&w=800&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1460925895917-afdab827c52f?q=80&w=800&auto=format&fit=crop"
    ],
    nextSlug: "crafted-objects-exhibition",
    nextTitle: "Crafted Objects Exhibition"
  },
  "crafted-objects-exhibition": {
    slug: "crafted-objects-exhibition",
    title: "Crafted Objects Exhibition",
    category: "BRAND IDENTITY",
    subtitle: "Exhibition identity, layout catalogs, and physical graphics.",
    story: "An exhibition celebrating local ceramicists and woodworkers in Hanoi. We designed the complete visual framework, from the gallery entrance murals to the printed catalogs and the digital index website.",
    challenge: "Ensuring the visual assets don't compete with the raw wood and clay objects themselves, but rather provide a quiet, framing outline.",
    outcome: "A highly restrained identity using concrete gray and terracotta clay tones. Thin lines divide text blocks, echoing the precise joints of woodworking.",
    colors: [
      { name: "Terracotta Clay", hex: "#7C4E35" },
      { name: "Concrete Gray", hex: "#5E5D5A" },
      { name: "Rough Ceramic", hex: "#F6EFEB" },
      { name: "Outline Black", hex: "#111111" }
    ],
    typography: ["Cormorant Garamond (Serif)", "Inter (Sans-Serif)"],
    tags: ["Brand Identity", "Environmental Design", "Catalogue", "Hanoi Layout"],
    imgUrls: [
      "https://images.unsplash.com/photo-1513519245088-0e12902e5a38?q=80&w=800&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1578749556568-bc2c40e68b61?q=80&w=800&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?q=80&w=800&auto=format&fit=crop"
    ],
    nextSlug: "kaito-tea-co",
    nextTitle: "Kaito Tea Co."
  }
};

interface PageProps {
  params: Promise<{ slug: string }>;
}

export default async function ProjectPage({ params }: PageProps) {
  const { slug } = await params;
  const project = projects[slug];

  if (!project) {
    notFound();
  }

  return (
    <div className="bg-[#F7F4EF] text-[#111111] min-h-screen flex flex-col custom-cursor font-sans">
      <Navbar />

      <main className="flex-1 pt-24 md:pt-32">
        {/* Breadcrumb & Navigation */}
        <section className="py-6 border-b border-[#111111]">
          <div className="max-w-7xl mx-auto px-4 sm:px-8 flex justify-between items-center font-mono text-[10px] uppercase tracking-widest text-[#111111]/60">
            <div className="flex gap-2 items-center">
              <Link href="/" className="hover:text-black transition-colors">Home</Link>
              <span>/</span>
              <Link href="/works" className="hover:text-black transition-colors">Works</Link>
              <span>/</span>
              <span className="text-black font-semibold">{project.title}</span>
            </div>
            <div>[STATUS: ARCHIVED]</div>
          </div>
        </section>

        {/* Hero Title block */}
        <section className="py-16 md:py-24 border-b border-[#111111] bg-grid-paper">
          <div className="max-w-7xl mx-auto px-4 sm:px-8">
            <div className="font-mono text-xs uppercase tracking-widest text-[#111111]/50 mb-6">
              ✦ Case Study / {project.category}
            </div>
            <h1 className="font-serif text-5xl sm:text-7xl lg:text-8xl leading-[0.9] tracking-tight mb-6">
              {project.title}
            </h1>
            <p className="font-serif text-xl sm:text-2xl lg:text-3xl max-w-3xl text-[#111111]/85 italic font-light leading-relaxed">
              {project.subtitle}
            </p>
          </div>
        </section>

        {/* Project Metadata Grid */}
        <section className="border-b border-[#111111] bg-[#F7F4EF] grid grid-cols-1 md:grid-cols-4 divide-y md:divide-y-0 md:divide-x divide-[#111111]">
          <div className="p-8">
            <h4 className="font-mono text-[10px] uppercase tracking-widest text-[#111111]/45 mb-4">Focus</h4>
            <div className="font-mono text-xs uppercase tracking-wider">{project.category}</div>
          </div>
          <div className="p-8">
            <h4 className="font-mono text-[10px] uppercase tracking-widest text-[#111111]/45 mb-4">Typography</h4>
            <ul className="space-y-1 text-xs">
              {project.typography.map((t, i) => (
                <li key={i} className="font-serif">{t}</li>
              ))}
            </ul>
          </div>
          <div className="p-8">
            <h4 className="font-mono text-[10px] uppercase tracking-widest text-[#111111]/45 mb-4">Color Palette</h4>
            <div className="flex gap-2">
              {project.colors.map((c, i) => (
                <div 
                  key={i} 
                  className="w-6 h-6 border border-[#111111]/25 rounded-xs" 
                  style={{ backgroundColor: c.hex }} 
                  title={`${c.name}: ${c.hex}`} 
                />
              ))}
            </div>
          </div>
          <div className="p-8">
            <h4 className="font-mono text-[10px] uppercase tracking-widest text-[#111111]/45 mb-4">Tags</h4>
            <div className="flex flex-wrap gap-1.5">
              {project.tags.map((t, i) => (
                <span key={i} className="font-mono text-[9px] uppercase tracking-wider bg-[#111111]/5 px-2 py-0.5 border border-[#111111]/10 rounded-xs">
                  {t}
                </span>
              ))}
            </div>
          </div>
        </section>

        {/* Core Case Study Narrative */}
        <section className="py-20 bg-grid-paper border-b border-[#111111]">
          <div className="max-w-7xl mx-auto px-4 sm:px-8">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
              
              <div className="lg:col-span-4 lg:sticky lg:top-28">
                <div className="font-mono text-xs uppercase tracking-widest text-[#111111]/60 mb-6">
                  ✦ Narrative
                </div>
                <h3 className="font-serif text-3xl font-semibold leading-tight">
                  Brief, challenges, and architectural outcomes.
                </h3>
              </div>

              <div className="lg:col-span-8 flex flex-col gap-10 font-sans text-sm md:text-base leading-relaxed text-[#111111]/85">
                <div>
                  <h4 className="font-mono text-[10px] uppercase tracking-widest text-[#111111]/40 mb-3">[01 / CONTEXT]</h4>
                  <p>{project.story}</p>
                </div>
                <div>
                  <h4 className="font-mono text-[10px] uppercase tracking-widest text-[#111111]/40 mb-3">[02 / THE CHALLENGE]</h4>
                  <p>{project.challenge}</p>
                </div>
                <div>
                  <h4 className="font-mono text-[10px] uppercase tracking-widest text-[#111111]/40 mb-3">[03 / THE OUTCOME]</h4>
                  <p>{project.outcome}</p>
                </div>
              </div>

            </div>
          </div>
        </section>

        {/* Image Gallery */}
        <section className="py-12 md:py-20 border-b border-[#111111] bg-[#F7F4EF]">
          <div className="max-w-7xl mx-auto px-4 sm:px-8 flex flex-col gap-12">
            <div className="font-mono text-xs uppercase tracking-widest text-[#111111]/60">
              ✦ Gallery / Showcase Elements
            </div>
            
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
              {/* Image 1 - Large */}
              <div className="lg:col-span-12 border border-[#111111] rounded-sm overflow-hidden aspect-[21/9] bg-[#111111]/5">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img 
                  src={project.imgUrls[0]} 
                  alt={`${project.title} - Main Layout`} 
                  className="w-full h-full object-cover"
                />
              </div>

              {/* Image 2 & 3 - Side by Side */}
              <div className="lg:col-span-6 border border-[#111111] rounded-sm overflow-hidden aspect-[4/3] bg-[#111111]/5">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img 
                  src={project.imgUrls[1]} 
                  alt={`${project.title} - Detail Left`} 
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="lg:col-span-6 border border-[#111111] rounded-sm overflow-hidden aspect-[4/3] bg-[#111111]/5">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img 
                  src={project.imgUrls[2]} 
                  alt={`${project.title} - Detail Right`} 
                  className="w-full h-full object-cover"
                />
              </div>
            </div>
          </div>
        </section>

        {/* Next project suggest banner */}
        <section className="py-24 bg-grid-paper border-b border-[#111111] hover:bg-[#111111]/5 transition-colors">
          <div className="max-w-7xl mx-auto px-4 sm:px-8 text-center">
            <div className="font-mono text-[9px] uppercase tracking-widest text-[#111111]/45 mb-4">
              [NEXT PROJECT]
            </div>
            <Link href={`/works/${project.nextSlug}`} className="group inline-flex flex-col items-center">
              <h2 className="font-serif text-4xl sm:text-6xl font-bold tracking-tight mb-4 group-hover:underline">
                {project.nextTitle}
              </h2>
              <span className="font-mono text-xs uppercase tracking-widest border border-[#111111] px-4 py-2 hover:bg-[#111111] hover:text-[#F7F4EF] transition-all">
                View Project ↗
              </span>
            </Link>
          </div>
        </section>

      </main>

      <Footer />
    </div>
  );
}
