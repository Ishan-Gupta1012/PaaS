export default function TechMarquee() {
  const technologies = [
    "TypeScript", "Tailwind", "Framer Motion", "GSAP", "Vercel", "Postgres", "tRPC", "Prisma", "Resend", "Next.js",
    "React", "Supabase", "Node.js", "Redis"
  ];

  return (
    <section className="py-12 border-b border-gray-100 bg-white overflow-hidden relative z-20">
      <div className="text-center text-[10px] font-bold tracking-[0.2em] text-gray-400 uppercase mb-8">
        Built on the stack you already love
      </div>
      
      {/* Mask for fading edges */}
      <div className="absolute left-0 top-0 bottom-0 w-32 bg-gradient-to-r from-white to-transparent z-10 pointer-events-none"></div>
      <div className="absolute right-0 top-0 bottom-0 w-32 bg-gradient-to-l from-white to-transparent z-10 pointer-events-none"></div>

      <div className="relative flex max-w-[100vw] overflow-hidden">
        <div className="flex w-max animate-marquee gap-16 pr-16 items-center">
          {[...technologies, ...technologies].map((tech, i) => (
            <span key={i} className="text-xl md:text-2xl font-bold text-gray-300 whitespace-nowrap">
              {tech}
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}
