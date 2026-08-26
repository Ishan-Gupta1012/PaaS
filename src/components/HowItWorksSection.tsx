export default function HowItWorksSection() {
  return (
    <section className="py-20 md:py-32 bg-[#F7F4EF] border-b border-[#111111] text-[#111111] font-sans bg-grid-paper">
      <div className="max-w-7xl mx-auto px-4 sm:px-8">
        
        {/* Header */}
        <div className="mb-16 text-center max-w-2xl mx-auto">
          <div className="font-mono text-xs uppercase tracking-widest text-[#111111]/60 mb-6">
            ✦ Simple Workflow
          </div>
          <h2 className="font-serif text-4xl sm:text-5xl leading-tight tracking-tight mb-4">
            Raw details in. <span className="italic text-stroke font-normal">Premium portfolio out.</span>
          </h2>
          <p className="text-sm md:text-base text-[#111111]/70">
            Four simple steps. No complex layouts to configure. We transform your raw engineering data into a stunning, responsive portfolio.
          </p>
        </div>

        {/* 4-column border-boxed grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 border-t border-l border-[#111111]">
          {/* Step 1 */}
          <div className="p-8 border-r border-b border-[#111111] bg-[#F7F4EF]/50 hover:bg-[#111111]/5 transition-colors flex flex-col justify-between min-h-[220px]">
            <div>
              <div className="font-mono text-xs text-[#111111]/40 mb-6">[01 / INPUT]</div>
              <h3 className="font-serif text-xl font-semibold mb-3">Dump raw details</h3>
              <p className="text-xs text-[#111111]/70 leading-relaxed">
                Paste your resume, share your GitHub link, or draft bullet points. No formatting necessary.
              </p>
            </div>
          </div>
          
          {/* Step 2 */}
          <div className="p-8 border-r border-b border-[#111111] bg-[#F7F4EF]/50 hover:bg-[#111111]/5 transition-colors flex flex-col justify-between min-h-[220px]">
            <div>
              <div className="font-mono text-xs text-[#111111]/40 mb-6">[02 / REWRITE]</div>
              <h3 className="font-serif text-xl font-semibold mb-3">AI formats & polishes</h3>
              <p className="text-xs text-[#111111]/70 leading-relaxed">
                We restructure your projects, calculate metrics, and write descriptions. You maintain complete edit control.
              </p>
            </div>
          </div>
          
          {/* Step 3 */}
          <div className="p-8 border-r border-b border-[#111111] bg-[#F7F4EF]/50 hover:bg-[#111111]/5 transition-colors flex flex-col justify-between min-h-[220px]">
            <div>
              <div className="font-mono text-xs text-[#111111]/40 mb-6">[03 / THEME]</div>
              <h3 className="font-serif text-xl font-semibold mb-3">Select a template</h3>
              <p className="text-xs text-[#111111]/70 leading-relaxed">
                Pick a template built with premium animations (GSAP, Framer Motion) and fully clean code.
              </p>
            </div>
          </div>
          
          {/* Step 4 */}
          <div className="p-8 border-r border-b border-[#111111] bg-[#F7F4EF]/50 hover:bg-[#111111]/5 transition-colors flex flex-col justify-between min-h-[220px]">
            <div>
              <div className="font-mono text-xs text-[#111111]/40 mb-6">[04 / DEPLOY]</div>
              <h3 className="font-serif text-xl font-semibold mb-3">Export or Deploy</h3>
              <p className="text-xs text-[#111111]/70 leading-relaxed">
                Deploy directly to Vercel/Netlify with one click, or export clean code to host anywhere.
              </p>
            </div>
          </div>
        </div>

      </div>
    </section>
  );
}
