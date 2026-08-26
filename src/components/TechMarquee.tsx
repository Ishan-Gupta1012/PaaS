export default function TechMarquee() {
  const items = [
    "TypeScript", "TailwindCSS", "Framer Motion", "GSAP Animations", "PostgreSQL", "Next.js Framework",
    "React Native", "Supabase DB", "NodeJS Backend", "Vercel Deployments", "Rust Core", "GitHub API"
  ];

  return (
    <section className="py-6 border-b border-[#111111] bg-[#F7F4EF] overflow-hidden relative z-20">
      <div className="relative flex max-w-[100vw] overflow-hidden">
        <div className="flex w-max animate-marquee gap-8 pr-8 items-center font-mono text-xs uppercase tracking-widest text-[#111111]/70">
          {[...items, ...items, ...items].map((item, i) => (
            <div key={i} className="flex items-center gap-8 whitespace-nowrap">
              <span>{item}</span>
              <span className="text-[#111111]/30">✦</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
