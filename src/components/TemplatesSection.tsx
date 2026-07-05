export default function TemplatesSection() {
  return (
    <section className="py-24 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        <div className="mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 border border-blue-100 text-xs font-medium text-gray-600 mb-8">
            <span className="w-1.5 h-1.5 rounded-full bg-primary"></span>
            Templates
          </div>
          <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-8">
            <h2 className="text-4xl md:text-5xl font-bold tracking-tight text-gray-900 max-w-xl leading-tight">
              Templates that don&apos;t look like templates.
            </h2>
            <p className="text-gray-500 max-w-md lg:pb-2 text-sm md:text-base leading-relaxed">
              Each one is hand-coded by us &mdash; production-ready Next.js with proper motion, semantic HTML, and accessibility baked in.
            </p>
          </div>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">

          {/* Card 1 - Creative Edge (Purple/Pink) */}
          <div className="rounded-3xl bg-[#060814] aspect-[4/3] border border-purple-900/40 flex flex-col p-8 relative overflow-hidden group shadow-xl transition-all duration-300 hover:border-purple-500/50 hover:-translate-y-2">
            <div className="absolute top-0 left-0 w-64 h-64 bg-purple-600/15 rounded-full blur-[80px] pointer-events-none" />
            <div className="absolute bottom-0 right-0 w-64 h-64 bg-pink-600/15 rounded-full blur-[80px] pointer-events-none" />
            <div className="relative z-10 flex-1 flex flex-col justify-center">
              <span className="text-[10px] font-bold tracking-widest text-purple-400 uppercase mb-2">SLOT 1 &bull; CREATIVE DARK</span>
              <h3 className="text-2xl font-bold text-white mb-2">Creative Edge</h3>
              <p className="text-purple-200/60 text-xs leading-relaxed max-w-xs mb-6">
                Vibrant purple-pink gradient portfolio for creative technologists and digital artists. Animated hero, 6-project grid, and process timeline.
              </p>
              <div className="flex gap-2 flex-wrap">
                <span className="rounded bg-purple-500/10 border border-purple-500/20 px-2.5 py-1 text-[10px] text-purple-400 font-medium">Next.js</span>
                <span className="rounded bg-pink-500/10 border border-pink-500/20 px-2.5 py-1 text-[10px] text-pink-400 font-medium">WebGL</span>
                <span className="rounded bg-orange-500/10 border border-orange-500/20 px-2.5 py-1 text-[10px] text-orange-400 font-medium">GSAP</span>
              </div>
            </div>
            <div className="absolute inset-0 bg-black/85 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center gap-4 z-20">
              <span className="text-white font-bold text-lg">Creative Edge</span>
              <a
                href="/templates/creative-edge"
                target="_blank"
                rel="noopener noreferrer"
                className="bg-gradient-to-r from-purple-600 to-pink-500 text-white px-5 py-2.5 rounded-xl font-semibold text-sm hover:opacity-90 transition-all flex items-center gap-2"
              >
                Live Preview
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-4 h-4">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 6H5.25A2.25 2.25 0 0 0 3 8.25v10.5A2.25 2.25 0 0 0 5.25 21h10.5A2.25 2.25 0 0 0 18 18.75V10.5m-10.5 6L21 3m0 0h-5.25M21 3v5.25" />
                </svg>
              </a>
            </div>
          </div>

          {/* Card 2 - Modern Developer (Dark) */}
          <div className="rounded-3xl bg-[#0A0A0A] aspect-[4/3] border border-gray-800 flex flex-col p-8 relative overflow-hidden group shadow-xl transition-all duration-300 hover:border-blue-500/50 hover:-translate-y-2">
            <div className="absolute inset-0 bg-gradient-to-tr from-gray-950 to-[#0A0A0A] opacity-90" />
            <div className="relative z-10 flex-1 flex flex-col justify-center">
              <span className="text-[10px] font-bold tracking-widest text-blue-400 uppercase mb-2">SLOT 2 &bull; DARK THEME</span>
              <h3 className="text-2xl font-bold text-white mb-2">Modern Developer</h3>
              <p className="text-gray-400 text-xs leading-relaxed max-w-xs mb-6">
                Premium dark-slate layout for software engineers. Features a work experience timeline, bento toolkit, and interactive email copy widgets.
              </p>
              <div className="flex gap-2 flex-wrap">
                <span className="rounded bg-[#090a0f] border border-gray-800 px-2.5 py-1 text-[10px] text-gray-400 font-medium">Next.js</span>
                <span className="rounded bg-[#090a0f] border border-gray-800 px-2.5 py-1 text-[10px] text-gray-400 font-medium">TypeScript</span>
                <span className="rounded bg-[#090a0f] border border-gray-800 px-2.5 py-1 text-[10px] text-gray-400 font-medium">Tailwind</span>
              </div>
            </div>
            <div className="absolute inset-0 bg-black/85 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center gap-4 z-20">
              <span className="text-white font-bold text-lg">Modern Developer</span>
              <a
                href="/templates/software-engineer"
                target="_blank"
                rel="noopener noreferrer"
                className="bg-white text-black px-5 py-2.5 rounded-xl font-semibold text-sm hover:bg-zinc-200 transition-colors flex items-center gap-2"
              >
                Live Preview
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-4 h-4">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 6H5.25A2.25 2.25 0 0 0 3 8.25v10.5A2.25 2.25 0 0 0 5.25 21h10.5A2.25 2.25 0 0 0 18 18.75V10.5m-10.5 6L21 3m0 0h-5.25M21 3v5.25" />
                </svg>
              </a>
            </div>
          </div>

          {/* Card 3 - Modern Clean (Light) */}
          <div className="rounded-3xl bg-slate-50 aspect-[4/3] border border-slate-200 flex flex-col p-8 relative overflow-hidden group shadow-xl transition-all duration-300 hover:border-emerald-400/60 hover:-translate-y-2">
            <div className="relative z-10 flex-1 flex flex-col justify-center">
              <span className="text-[10px] font-bold tracking-widest text-emerald-600 uppercase mb-2">SLOT 3 &bull; LIGHT CLEAN</span>
              <h3 className="text-2xl font-bold text-slate-900 mb-2">Modern Clean</h3>
              <p className="text-slate-500 text-xs leading-relaxed max-w-xs mb-6">
                A minimalist white-card layout for full-stack developers. Clean typography, soft shadows, and a structured project grid.
              </p>
              <div className="flex gap-2 flex-wrap">
                <span className="rounded bg-white border border-slate-200 px-2.5 py-1 text-[10px] text-slate-600 font-medium shadow-sm">React</span>
                <span className="rounded bg-white border border-slate-200 px-2.5 py-1 text-[10px] text-slate-600 font-medium shadow-sm">TypeScript</span>
                <span className="rounded bg-white border border-slate-200 px-2.5 py-1 text-[10px] text-slate-600 font-medium shadow-sm">Minimalist</span>
              </div>
            </div>
            <div className="absolute inset-0 bg-slate-900/90 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center gap-4 z-20">
              <span className="text-white font-bold text-lg">Modern Clean</span>
              <a
                href="/templates/modern"
                target="_blank"
                rel="noopener noreferrer"
                className="bg-white text-slate-900 px-5 py-2.5 rounded-xl font-semibold text-sm hover:bg-slate-100 transition-colors flex items-center gap-2"
              >
                Live Preview
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-4 h-4">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 6H5.25A2.25 2.25 0 0 0 3 8.25v10.5A2.25 2.25 0 0 0 5.25 21h10.5A2.25 2.25 0 0 0 18 18.75V10.5m-10.5 6L21 3m0 0h-5.25M21 3v5.25" />
                </svg>
              </a>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
