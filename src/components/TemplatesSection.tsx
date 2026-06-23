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
              Templates that don't look like templates.
            </h2>
            <p className="text-gray-500 max-w-md lg:pb-2 text-sm md:text-base leading-relaxed">
              Each one is hand-coded by us — production-ready Next.js with proper motion, semantic HTML, and accessibility baked in.
            </p>
          </div>
        </div>
        
        <div className="grid md:grid-cols-2 gap-8">
          {/* Template Card 1 (Dark) */}
          <div className="rounded-3xl bg-[#0A0A0A] aspect-[4/3] border border-gray-800 flex items-center justify-center p-8 relative overflow-hidden group cursor-pointer shadow-xl transition-transform hover:-translate-y-2">
            <div className="absolute inset-0 bg-gradient-to-tr from-gray-900 to-[#0A0A0A] opacity-50"></div>
            {/* Template mock UI inside */}
            <div className="relative z-10 w-full max-w-sm">
              <div className="w-16 h-16 bg-white rounded-full mb-6 mx-auto"></div>
              <div className="h-6 w-48 bg-gray-800 rounded mx-auto mb-4"></div>
              <div className="h-4 w-64 bg-gray-800 rounded mx-auto mb-8"></div>
              <div className="flex gap-2 justify-center">
                <div className="w-24 h-10 bg-gray-800 rounded-full"></div>
                <div className="w-24 h-10 bg-gray-800 rounded-full"></div>
              </div>
            </div>
          </div>
          
          {/* Template Card 2 (Blue/Green) - the screenshot cut off but showed a green edge. Let's make it a colorful card */}
          <div className="rounded-3xl bg-[#0F9D58] aspect-[4/3] flex items-center justify-center p-8 relative overflow-hidden group cursor-pointer shadow-xl transition-transform hover:-translate-y-2">
             <div className="absolute inset-0 bg-gradient-to-tr from-green-700 to-[#0F9D58] opacity-80"></div>
             {/* Template mock UI inside */}
             <div className="relative z-10 w-full max-w-sm bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20">
               <div className="flex gap-4 items-center mb-6">
                 <div className="w-12 h-12 bg-white/20 rounded-xl"></div>
                 <div>
                   <div className="h-4 w-32 bg-white/20 rounded mb-2"></div>
                   <div className="h-3 w-24 bg-white/10 rounded"></div>
                 </div>
               </div>
               <div className="space-y-3">
                 <div className="h-20 w-full bg-white/10 rounded-xl"></div>
                 <div className="h-20 w-full bg-white/10 rounded-xl"></div>
               </div>
             </div>
          </div>
        </div>

      </div>
    </section>
  );
}
