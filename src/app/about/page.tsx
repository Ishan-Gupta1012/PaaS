import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

export default function AboutPage() {
  const team = [
    { name: "Ishan Gupta", role: "Founder & Core Architect", tag: "[ARCHITECT]" },
    { name: "Aparna Jha", role: "Product Design Lead", tag: "[DESIGNER]" },
    { name: "Gemini", role: "AI Refinement Engine", tag: "[INTELLIGENCE]" },
    { name: "Vercel", role: "Deployment Infrastructure", tag: "[OPS]" }
  ];

  const superpowers = [
    { title: "High Performance", desc: "Our static site generation guarantees 100/100 Lighthouse performance metrics right out of the box." },
    { title: "GitHub Syncing", desc: "Keep your contributions, repositories, and stars up-to-date in real-time with our hooks." },
    { title: "Tailwind Core", desc: "No complex styling engines. Clean, production-ready Tailwind configuration that you fully own." },
    { title: "Monospace Detailing", desc: "Editorial, technical layout details that fit engineering portfolios perfectly." },
    { title: "Micro-animations", desc: "Subtle, premium physics-based animations that make your work feel interactive and alive." },
    { title: "Complete Ownership", desc: "Export raw Next.js codebase at any time. No proprietary locks, no platform lock-in." }
  ];

  return (
    <div className="bg-[#F7F4EF] text-[#111111] min-h-screen flex flex-col custom-cursor font-sans">
      <Navbar />
      
      <main className="flex-1 pt-24 md:pt-32">
        {/* Hero */}
        <section className="py-12 md:py-20 border-b border-[#111111] bg-grid-paper">
          <div className="max-w-7xl mx-auto px-4 sm:px-8">
            <div className="font-mono text-xs uppercase tracking-widest text-[#111111]/60 mb-6">
              ✦ About / Studio Philosophy
            </div>
            
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
              <div className="lg:col-span-8">
                <h1 className="font-serif text-5xl sm:text-7xl lg:text-8xl leading-[0.9] tracking-tight mb-8">
                  We turn developer code <span className="italic font-normal text-stroke">into visual brands.</span>
                </h1>
              </div>
              <div className="lg:col-span-4 lg:pl-6 pt-2">
                <p className="text-sm md:text-base text-[#111111]/80 leading-relaxed">
                  Portfol.io is a creative platform focused on developer portfolios. We believe that software engineering is a creative discipline. Every codebase deserves a premium, bespoke frame that highlights clean architecture, smart design, and technical depth.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Statistics Grid */}
        <section className="border-b border-[#111111] bg-[#F7F4EF]">
          <div className="max-w-7xl mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 divide-y sm:divide-y-0 sm:divide-x divide-[#111111]">
            <div className="p-8 md:p-12">
              <div className="font-mono text-xs text-[#111111]/45 mb-4">[METRIC 01]</div>
              <div className="font-serif text-4xl md:text-5xl font-bold mb-2">10k+</div>
              <div className="font-mono text-[10px] uppercase tracking-wider text-[#111111]/70">Portfolios Deployed</div>
            </div>
            <div className="p-8 md:p-12">
              <div className="font-mono text-xs text-[#111111]/45 mb-4">[METRIC 02]</div>
              <div className="font-serif text-4xl md:text-5xl font-bold mb-2">500k+</div>
              <div className="font-mono text-[10px] uppercase tracking-wider text-[#111111]/70">Github Repos Synced</div>
            </div>
            <div className="p-8 md:p-12">
              <div className="font-mono text-xs text-[#111111]/45 mb-4">[METRIC 03]</div>
              <div className="font-serif text-4xl md:text-5xl font-bold mb-2">3</div>
              <div className="font-mono text-[10px] uppercase tracking-wider text-[#111111]/70">Core Premium Layouts</div>
            </div>
            <div className="p-8 md:p-12">
              <div className="font-mono text-xs text-[#111111]/45 mb-4">[METRIC 04]</div>
              <div className="font-serif text-4xl md:text-5xl font-bold mb-2">99.9%</div>
              <div className="font-mono text-[10px] uppercase tracking-wider text-[#111111]/70">Server Uptime</div>
            </div>
          </div>
        </section>

        {/* Our Superpowers */}
        <section className="py-20 md:py-32 border-b border-[#111111] bg-grid-paper">
          <div className="max-w-7xl mx-auto px-4 sm:px-8">
            <div className="mb-16 border-b border-[#111111] pb-10">
              <div className="font-mono text-xs uppercase tracking-widest text-[#111111]/60 mb-6">
                ✦ Our Capabilities
              </div>
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-end">
                <div className="lg:col-span-7">
                  <h2 className="font-serif text-4xl sm:text-5xl lg:text-6xl leading-[1.0] tracking-tight">
                    Engineering skills <span className="italic font-normal text-stroke">refined by design.</span>
                  </h2>
                </div>
                <div className="lg:col-span-5">
                  <p className="text-sm text-[#111111]/70 leading-relaxed">
                    Our capabilities represent our core philosophy. We construct highly optimized portfolio skeletons that sync natively with your GitHub commits.
                  </p>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {superpowers.map((power, idx) => (
                <div key={idx} className="border border-[#111111] p-8 rounded-sm bg-[#F7F4EF] transition-all hover:bg-[#111111]/5">
                  <div className="font-mono text-[9px] text-[#111111]/40 mb-4">[{String(idx + 1).padStart(2, '0')} / PWR]</div>
                  <h3 className="font-serif text-xl sm:text-2xl font-semibold mb-3">{power.title}</h3>
                  <p className="text-xs text-[#111111]/75 leading-relaxed">{power.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Team Grid */}
        <section className="py-20 md:py-32 bg-[#F7F4EF] border-b border-[#111111]">
          <div className="max-w-7xl mx-auto px-4 sm:px-8">
            <div className="mb-16 border-b border-[#111111] pb-10">
              <div className="font-mono text-xs uppercase tracking-widest text-[#111111]/60 mb-6">
                ✦ Core Contributors
              </div>
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-end">
                <div className="lg:col-span-7">
                  <h2 className="font-serif text-4xl sm:text-5xl lg:text-6xl leading-[1.0] tracking-tight">
                    The minds <span className="italic font-normal">shaping the tool.</span>
                  </h2>
                </div>
                <div className="lg:col-span-5">
                  <p className="text-sm text-[#111111]/70 leading-relaxed">
                    Meet the engineers and designers building Portfol.io. We design systems to make developer portfolios clean, robust, and fast.
                  </p>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
              {team.map((member, idx) => (
                <div key={idx} className="border border-[#111111] p-6 bg-[#F7F4EF] rounded-sm group relative overflow-hidden transition-all duration-300 hover:scale-[1.02]">
                  <div className="flex justify-between items-center mb-10 font-mono text-[9px] text-[#111111]/40 border-b border-[#111111]/10 pb-3">
                    <span>TEAM MEMBER</span>
                    <span>{member.tag}</span>
                  </div>
                  <h3 className="font-serif text-2xl font-semibold mb-1 text-[#111111] group-hover:underline">
                    {member.name}
                  </h3>
                  <p className="font-mono text-[10px] text-[#111111]/65 uppercase tracking-wider">
                    {member.role}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

      </main>

      <Footer />
    </div>
  );
}
