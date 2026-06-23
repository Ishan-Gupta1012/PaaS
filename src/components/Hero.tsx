import { ArrowRight } from "lucide-react";

export default function Hero() {
  return (
    <section className="relative pt-32 pb-0 lg:pt-40 lg:pb-0 overflow-hidden bg-grid-pattern">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white border border-gray-200 text-xs font-medium text-gray-500 mb-8 shadow-sm">
          <span className="w-1.5 h-1.5 rounded-full bg-primary"></span>
          Building in public - Validating the idea
        </div>
        
        <h1 className="text-5xl md:text-[5rem] font-bold tracking-tight text-gray-900 mb-6 leading-[1.1]">
          Why are developer<br />portfolios still <span className="text-primary">stuck in<br />2020?</span>
        </h1>
        
        <p className="text-lg md:text-xl text-gray-500 mb-10 max-w-2xl mx-auto leading-relaxed">
          Between internships and DSA grinds, nobody has time to wire up GSAP,
          Framer Motion, and a clean Next.js architecture from scratch. We do it
          for you — without the AI fluff.
        </p>
        
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-12">
          <button className="w-full sm:w-auto bg-primary hover:bg-primary-hover text-white px-6 py-3 rounded-full font-medium flex items-center justify-center gap-2 transition-all shadow-lg shadow-primary/20">
            Join the waitlist <ArrowRight className="w-4 h-4" />
          </button>
          <button className="w-full sm:w-auto bg-white hover:bg-gray-50 text-gray-900 px-6 py-3 rounded-full font-medium border border-gray-200 transition-all shadow-sm">
            See how it works
          </button>
        </div>
        
        <div className="flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-xs md:text-sm text-gray-500 font-medium">
          <div className="flex items-center gap-1.5">
            <div className="w-1.5 h-1.5 rounded-full bg-gray-400"></div>
            Production-ready Next.js
          </div>
          <div className="flex items-center gap-1.5">
            <div className="w-1.5 h-1.5 rounded-full bg-gray-400"></div>
            Framer Motion + GSAP
          </div>
          <div className="flex items-center gap-1.5">
            <div className="w-1.5 h-1.5 rounded-full bg-gray-400"></div>
            Hand-crafted templates
          </div>
        </div>
      </div>

      {/* Mock Template Preview */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 mt-16 relative">
        <div className="absolute top-0 right-8 w-24 h-24 sm:w-32 sm:h-32 bg-primary rounded-[1.5rem] sm:rounded-[2rem] -rotate-12 translate-x-4 -translate-y-6 z-0"></div>
        <div className="bg-[#0A0A0A] rounded-t-3xl p-8 md:p-12 border-t border-x border-gray-800 shadow-2xl overflow-hidden relative z-10 h-80">
          <div className="text-gray-500 text-xs font-semibold tracking-[0.2em] uppercase mb-4">Live Template Preview</div>
          <h2 className="text-4xl md:text-5xl font-semibold text-white mb-2">Aarav Mehta</h2>
          <p className="text-gray-400 text-sm md:text-base mb-8">Full-stack engineer · ex-Razorpay intern · building developer tools</p>
          
          <div className="flex flex-wrap gap-3 mb-10">
            <span className="px-4 py-1.5 rounded-full bg-gray-900/80 border border-gray-800 text-gray-300 text-xs font-medium">TypeScript</span>
            <span className="px-4 py-1.5 rounded-full bg-gray-900/80 border border-gray-800 text-gray-300 text-xs font-medium">Next.js</span>
            <span className="px-4 py-1.5 rounded-full bg-gray-900/80 border border-gray-800 text-gray-300 text-xs font-medium">Postgres</span>
            <span className="px-4 py-1.5 rounded-full bg-gray-900/80 border border-gray-800 text-gray-300 text-xs font-medium">Rust</span>
          </div>

          <div className="flex gap-4">
            <div className="bg-[#111111] border border-gray-800 rounded-2xl p-4 flex flex-col items-center justify-center w-28 sm:w-32 shadow-inner">
              <span className="text-2xl md:text-3xl font-bold text-white">23</span>
              <span className="text-[9px] text-gray-500 uppercase tracking-widest mt-1">Projects</span>
            </div>
            <div className="bg-[#111111] border border-gray-800 rounded-2xl p-4 flex flex-col items-center justify-center w-28 sm:w-32 shadow-inner">
              <span className="text-2xl md:text-3xl font-bold text-white flex items-center gap-1">4<span className="text-lg">★</span></span>
              <span className="text-[9px] text-gray-500 uppercase tracking-widest mt-1">GH Stars 1.2k</span>
            </div>
            <div className="bg-[#111111] border border-gray-800 rounded-2xl p-4 flex flex-col items-center justify-center w-28 sm:w-32 shadow-inner">
              <span className="text-2xl md:text-3xl font-bold text-white">3</span>
              <span className="text-[9px] text-gray-500 uppercase tracking-widest mt-1">Internships</span>
            </div>
          </div>
          
          {/* Fading bottom gradient */}
          <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-[#0A0A0A] to-transparent"></div>
        </div>
      </div>
    </section>
  );
}
