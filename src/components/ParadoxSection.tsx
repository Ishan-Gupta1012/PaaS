export default function ParadoxSection() {
  return (
    <section className="py-24 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col lg:flex-row gap-16 items-start">
          
          <div className="lg:w-1/2 sticky top-32">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 border border-blue-100 text-xs font-medium text-gray-600 mb-8">
              <span className="w-1.5 h-1.5 rounded-full bg-primary"></span>
              The paradox
            </div>
            
            <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight text-gray-900 leading-[1.1]">
              We all want<br />the perfect<br />portfolio. Few<br />of us ship one.
            </h2>
          </div>

          <div className="lg:w-1/2 flex flex-col gap-6 w-full">
            {/* Card 1 */}
            <div className="bg-white border border-gray-100 rounded-3xl p-8 shadow-sm hover:shadow-md transition-shadow">
              <div className="text-primary font-bold text-sm tracking-widest mb-4">01</div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">Time is the bottleneck</h3>
              <p className="text-gray-500 leading-relaxed text-sm md:text-base">
                You know how to ship. Between interviews, DSA, and your day job, a polished portfolio keeps slipping.
              </p>
            </div>
            
            {/* Card 2 */}
            <div className="bg-white border border-gray-100 rounded-3xl p-8 shadow-sm hover:shadow-md transition-shadow">
              <div className="text-primary font-bold text-sm tracking-widest mb-4">02</div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">Writing about yourself is hard</h3>
              <p className="text-gray-500 leading-relaxed text-sm md:text-base">
                Translating raw work into clean, recruiter-ready copy is a different muscle than writing code.
              </p>
            </div>
            
            {/* Card 3 */}
            <div className="bg-white border border-gray-100 rounded-3xl p-8 shadow-sm hover:shadow-md transition-shadow">
              <div className="text-primary font-bold text-sm tracking-widest mb-4">03</div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">Generators feel generic</h3>
              <p className="text-gray-500 leading-relaxed text-sm md:text-base">
                Drag-and-drop builders scream template. You want code you'd actually be proud to push.
              </p>
            </div>
          </div>
          
        </div>
      </div>
    </section>
  );
}
