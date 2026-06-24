'use client';

import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';

export default function Navbar() {
  const { user, logout } = useAuth();

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-md border-b border-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Link href="/" className="flex items-center gap-2">
            <div className="bg-primary text-white w-8 h-8 rounded-lg flex items-center justify-center font-bold text-lg">P</div>
            <span className="font-bold text-xl tracking-tight text-black">Portfol.io</span>
          </Link>
        </div>
        
        <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-gray-500">
          <Link href="/" className="hover:text-black transition-colors">Home</Link>
          <Link href="#features" className="hover:text-black transition-colors">Features</Link>
          <Link href="#vision" className="hover:text-black transition-colors">Vision</Link>
        </nav>
        
        <div className="flex items-center gap-4">
          {user ? (
            <div className="flex items-center gap-4">
              <Link 
                href="/dashboard" 
                className="text-sm font-semibold text-primary hover:text-primary-hover transition-colors flex items-center gap-2"
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img 
                  src={user.personalInfo?.avatar ?? ''} 
                  alt={user.personalInfo?.name ?? 'User'} 
                  className="w-7 h-7 rounded-full border border-primary/20 object-cover"
                />
                <span className="hidden sm:inline">Dashboard</span>
              </Link>
              <button 
                onClick={logout} 
                className="text-xs text-gray-500 hover:text-black transition-colors border border-gray-200 hover:border-gray-400 rounded-full px-3 py-1"
              >
                Log out
              </button>
            </div>
          ) : (
            <>
              <Link href="/signin" className="text-sm font-medium text-gray-500 hover:text-black hidden sm:block transition-colors">
                Sign in
              </Link>
              <Link href="/signin" className="bg-primary hover:bg-primary-hover text-white text-sm font-medium px-4 py-2 rounded-full transition-colors">
                Get Started
              </Link>
            </>
          )}
        </div>
      </div>
    </header>
  );
}
