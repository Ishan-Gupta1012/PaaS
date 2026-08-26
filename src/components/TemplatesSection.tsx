export default function TemplatesSection() {
  const templates = [
    {
      id: "01",
      name: "Modern Developer",
      desc: "Clean, minimalist layout featuring a side navbar, developer highlights grid, and custom email inquiry widgets.",
      stack: ["TypeScript", "Next.js", "TailwindCSS"],
      link: "/templates/modern-developer"
    },
    {
      id: "02",
      name: "Developer Pro",
      desc: "Curated dark bento-grid layout for software engineers. Integrated work timelines, code repositories sync, and stats.",
      stack: ["React", "TypeScript", "Framer Motion"],
      link: "/templates/software-engineer"
    }
  ];

  return (
    <section className="py-20 md:py-32 bg-[#F7F4EF] border-b border-[#111111] text-[#111111] font-sans bg-grid-paper">
      <div className="max-w-7xl mx-auto px-4 sm:px-8">
        
        {/* Header */}
        <div className="mb-16 border-b border-[#111111] pb-10">
          <div className="font-mono text-xs uppercase tracking-widest text-[#111111]/60 mb-6">
            ✦ Selected Layouts
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-end">
            <div className="lg:col-span-7">
              <h2 className="font-serif text-4xl sm:text-5xl lg:text-6xl leading-[1.0] tracking-tight">
                Templates designed <span className="italic font-normal">to feel bespoke.</span>
              </h2>
            </div>
            <div className="lg:col-span-5">
              <p className="text-sm text-[#111111]/70 leading-relaxed">
                We custom-crafted each template with performance and clean code at the center. Clean motion, structural grids, and fully customizable source layouts.
              </p>
            </div>
          </div>
        </div>

        {/* Templates Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          {templates.map((template) => (
            <div 
              key={template.id} 
              className="border border-[#111111] rounded-sm p-8 bg-[#F7F4EF] flex flex-col justify-between group relative overflow-hidden transition-all duration-300 hover:bg-[#111111]/5 hover:scale-[1.01]"
            >
              <div>
                {/* Index tag */}
                <div className="flex justify-between items-center mb-6 font-mono text-xs text-[#111111]/40 border-b border-[#111111]/10 pb-4">
                  <span>LAYOUT CODE</span>
                  <span>[{template.id} / SLT]</span>
                </div>
                
                {/* Heading */}
                <h3 className="font-serif text-2xl sm:text-3xl font-semibold mb-4 text-[#111111]">
                  {template.name}
                </h3>
                
                {/* Description */}
                <p className="text-xs text-[#111111]/75 leading-relaxed mb-8">
                  {template.desc}
                </p>
              </div>

              {/* Stack & Link */}
              <div>
                <div className="flex flex-wrap gap-2 mb-8">
                  {template.stack.map((s, index) => (
                    <span key={index} className="font-mono text-[9px] uppercase tracking-wider bg-[#111111]/5 text-[#111111] px-2 py-0.5 rounded-xs border border-[#111111]/10">
                      {s}
                    </span>
                  ))}
                </div>
                
                <a 
                  href={template.link}
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="inline-flex items-center gap-2 font-mono text-xs uppercase tracking-widest border border-[#111111] px-4 py-2 hover:bg-[#111111] hover:text-[#F7F4EF] transition-all w-full justify-center"
                >
                  Live Preview 
                  <span className="text-[10px]">↗</span>
                </a>
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}
