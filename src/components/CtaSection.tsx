export default function CtaSection() {
  return (
    <section className="py-24 bg-[#050505] text-center px-4 sm:px-6 lg:px-8 border-t border-gray-900">
      <div className="max-w-4xl mx-auto">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-gray-800/50 border border-gray-700 text-xs font-medium text-gray-300 mb-8">
          <span className="w-1.5 h-1.5 rounded-full bg-primary"></span>
          Help me validate
        </div>
        
        <h2 className="text-4xl md:text-5xl font-bold tracking-tight text-white mb-6 leading-tight">
          I&apos;m building this in public.<br />
          Your feedback ships the first<br />
          templates.
        </h2>
        
        <p className="text-gray-400 mb-12 max-w-2xl mx-auto text-sm md:text-base leading-relaxed">
          Drop your email — I&apos;ll send the first preview, ask 3 quick questions, and ship if there&apos;s real demand. No spam, no launch sequences.
        </p>
        
        <form className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto mb-16">
          <input 
            type="email" 
            placeholder="you@domain.dev" 
            className="flex-1 bg-gray-900/50 border border-gray-800 text-white rounded-full px-6 py-3 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-colors text-sm"
            required
          />
          <button type="submit" className="bg-white hover:bg-gray-100 text-gray-900 px-8 py-3 rounded-full font-semibold transition-colors text-sm">
            Join waitlist
          </button>
        </form>
        
        <div className="grid md:grid-cols-3 gap-4 text-left max-w-4xl mx-auto">
          <div className="bg-gray-900/30 border border-gray-800/60 rounded-2xl p-6">
            <div className="text-gray-600 text-[10px] uppercase font-bold tracking-wider mb-2">Q01</div>
            <p className="text-gray-300 text-sm">Is maintaining a portfolio a real pain for you?</p>
          </div>
          <div className="bg-gray-900/30 border border-gray-800/60 rounded-2xl p-6">
            <div className="text-gray-600 text-[10px] uppercase font-bold tracking-wider mb-2">Q02</div>
            <p className="text-gray-300 text-sm">Would AI-polished content + premium UI help?</p>
          </div>
          <div className="bg-gray-900/30 border border-gray-800/60 rounded-2xl p-6">
            <div className="text-gray-600 text-[10px] uppercase font-bold tracking-wider mb-2">Q03</div>
            <p className="text-gray-300 text-sm">What&apos;s the ONE thing your current portfolio lacks?</p>
          </div>
        </div>
      </div>
    </section>
  );
}
