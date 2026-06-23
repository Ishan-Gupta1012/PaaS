import Link from 'next/link';

export default function Navbar() {
  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-md border-b border-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="bg-primary text-white w-8 h-8 rounded-lg flex items-center justify-center font-bold text-lg">P</div>
          <span className="font-bold text-xl tracking-tight">Portfol.io</span>
        </div>
        
        <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-gray-500">
          <Link href="#" className="hover:text-black transition-colors">Home</Link>
          <Link href="#" className="hover:text-black transition-colors">Features</Link>
          <Link href="#" className="hover:text-black transition-colors">Vision</Link>
        </nav>
        
        <div className="flex items-center gap-4">
          <Link href="#" className="text-sm font-medium text-gray-500 hover:text-black hidden sm:block">Sign in</Link>
          <Link href="#" className="bg-primary hover:bg-primary-hover text-white text-sm font-medium px-4 py-2 rounded-full transition-colors">
            Join waitlist
          </Link>
        </div>
      </div>
    </header>
  );
}
