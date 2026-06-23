export default function HowItWorksSection() {
  return (
    <section className="py-24 bg-gray-50/50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white border border-gray-200 text-xs font-medium text-gray-600 mb-8 shadow-sm">
          <span className="w-1.5 h-1.5 rounded-full bg-primary"></span>
          How it works
        </div>
        
        <h2 className="text-4xl md:text-5xl font-bold tracking-tight text-gray-900 mb-6">
          Raw details in. <span className="text-primary">Premium<br />portfolio out.</span>
        </h2>
        
        <p className="text-lg text-gray-500 mb-20 max-w-2xl mx-auto">
          Four steps. No drag-and-drop. No AI-generated fluff. Just your work, framed properly.
        </p>
        
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 text-left">
          {/* Step 1 */}
          <div className="bg-white border border-gray-100 rounded-3xl p-8 shadow-sm relative pt-12">
            <div className="absolute -top-4 left-8 bg-primary text-white text-xs font-bold px-4 py-1.5 rounded-full shadow-md">
              STEP 01
            </div>
            <div className="text-gray-200 font-bold text-3xl mb-4">01</div>
            <h3 className="text-lg font-bold text-gray-900 mb-3">Dump your raw details</h3>
            <p className="text-gray-500 text-sm leading-relaxed">
              Paste your resume, GitHub username, project notes — anything. No formatting needed.
            </p>
          </div>
          
          {/* Step 2 */}
          <div className="bg-white border border-gray-100 rounded-3xl p-8 shadow-sm relative pt-12">
            <div className="absolute -top-4 left-8 bg-primary text-white text-xs font-bold px-4 py-1.5 rounded-full shadow-md">
              STEP 02
            </div>
            <div className="text-gray-200 font-bold text-3xl mb-4">02</div>
            <h3 className="text-lg font-bold text-gray-900 mb-3">AI polishes the boring parts</h3>
            <p className="text-gray-500 text-sm leading-relaxed">
              We rewrite descriptions, summarize projects, and structure your timeline. You review.
            </p>
          </div>
          
          {/* Step 3 */}
          <div className="bg-white border border-gray-100 rounded-3xl p-8 shadow-sm relative pt-12">
            <div className="absolute -top-4 left-8 bg-primary text-white text-xs font-bold px-4 py-1.5 rounded-full shadow-md">
              STEP 03
            </div>
            <div className="text-gray-200 font-bold text-3xl mb-4">03</div>
            <h3 className="text-lg font-bold text-gray-900 mb-3">Pick a hand-crafted template</h3>
            <p className="text-gray-500 text-sm leading-relaxed">
              Premium templates with GSAP, Framer Motion, and a clean Next.js architecture.
            </p>
          </div>
          
          {/* Step 4 */}
          <div className="bg-white border border-gray-100 rounded-3xl p-8 shadow-sm relative pt-12">
            <div className="absolute -top-4 left-8 bg-primary text-white text-xs font-bold px-4 py-1.5 rounded-full shadow-md">
              STEP 04
            </div>
            <div className="text-gray-200 font-bold text-3xl mb-4">04</div>
            <h3 className="text-lg font-bold text-gray-900 mb-3">Deploy. Or export the code.</h3>
            <p className="text-gray-500 text-sm leading-relaxed">
              One-click to Vercel, or download production-ready source you own forever.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
