import Link from "next/link";

export default function Footer() {
  return (
    <footer className="bg-white pt-16 pb-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-16">
          
          <div className="md:col-span-2">
            <div className="flex items-center gap-2 mb-6">
              <div className="bg-primary text-white w-8 h-8 rounded-lg flex items-center justify-center font-bold text-lg">P</div>
              <span className="font-bold text-xl tracking-tight text-gray-900">Portfol.io</span>
            </div>
            <p className="text-gray-500 text-sm leading-relaxed max-w-xs">
              Portfolio-as-a-Service for developers. AI handles the boring parts so your engineering shines in a premium, hand-crafted UI.
            </p>
          </div>
          
          <div>
            <h4 className="font-bold text-gray-900 mb-6 text-sm">Product</h4>
            <ul className="space-y-4">
              <li><Link href="#" className="text-gray-500 hover:text-black text-sm transition-colors">Features</Link></li>
              <li><Link href="#" className="text-gray-500 hover:text-black text-sm transition-colors">Vision</Link></li>
              <li><Link href="#" className="text-gray-500 hover:text-black text-sm transition-colors">Templates</Link></li>
            </ul>
          </div>
          
          <div>
            <h4 className="font-bold text-gray-900 mb-6 text-sm">Build in public</h4>
            <ul className="space-y-4">
              <li><Link href="#" className="text-gray-500 hover:text-black text-sm transition-colors">Twitter / X</Link></li>
              <li><Link href="#" className="text-gray-500 hover:text-black text-sm transition-colors">LinkedIn</Link></li>
              <li><Link href="#" className="text-gray-500 hover:text-black text-sm transition-colors">GitHub</Link></li>
            </ul>
          </div>
          
        </div>
        
        <div className="pt-8 border-t border-gray-100 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-gray-400 text-xs">© 2026 Portfol.io — Built in public.</p>
          <p className="text-gray-400 text-xs">Crafted with intent. Shipped with conviction.</p>
        </div>
      </div>
    </footer>
  );
}
