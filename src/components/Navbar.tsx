'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { useState } from 'react';

export default function Navbar() {
  const { user, logout } = useAuth();
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const isActive = (path: string) => {
    if (path === '/') return pathname === '/';
    return pathname.startsWith(path);
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-[#F7F4EF]/90 backdrop-blur-xs border-b border-[#111111]/15 text-[#111111]">
      <div className="max-w-7xl mx-auto px-4 sm:px-8 h-16 flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2 group">
          <div className="border border-[#111111] w-7 h-7 rounded-sm flex items-center justify-center font-serif text-sm font-semibold transition-all group-hover:bg-[#111111] group-hover:text-[#F7F4EF]">
            S
          </div>
          <span className="font-serif font-semibold text-lg tracking-tight">think.design</span>
        </Link>
        
        {/* Navigation */}
        <nav className="hidden md:flex items-center gap-10 font-mono text-[11px] uppercase tracking-widest">
          <Link 
            href="/" 
            className={`transition-colors hover:text-black ${isActive('/') ? 'text-black font-semibold underline underline-offset-4' : 'text-[#111111]/60'}`}
          >
            Home
          </Link>
          <Link 
            href="/about" 
            className={`transition-colors hover:text-black ${isActive('/about') ? 'text-black font-semibold underline underline-offset-4' : 'text-[#111111]/60'}`}
          >
            About
          </Link>
          <Link 
            href="/works" 
            className={`transition-colors hover:text-black ${isActive('/works') ? 'text-black font-semibold underline underline-offset-4' : 'text-[#111111]/60'}`}
          >
            Works
          </Link>
          <Link 
            href="/contact" 
            className={`transition-colors hover:text-black ${isActive('/contact') ? 'text-black font-semibold underline underline-offset-4' : 'text-[#111111]/60'}`}
          >
            Contact
          </Link>
        </nav>
        
        {/* CTA / Auth Actions */}
        <div className="flex items-center gap-4">
          {user ? (
            <div className="flex items-center gap-4 font-mono text-[11px] uppercase">
              <Link 
                href="/dashboard" 
                className="transition-colors hover:text-black flex items-center gap-2 border border-[#111111] px-3 py-1 rounded-sm text-[#111111]"
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                {user.personalInfo?.avatar ? (
                  <img 
                    src={user.personalInfo.avatar} 
                    alt={user.personalInfo.name ?? 'User'} 
                    className="w-4 h-4 rounded-full object-cover border border-[#111111]/20"
                  />
                ) : (
                  <span className="w-1.5 h-1.5 rounded-full bg-[#111111]" />
                )}
                <span>Dashboard</span>
              </Link>
              <button 
                onClick={logout} 
                className="text-[#111111]/60 hover:text-black transition-colors"
              >
                Logout
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-4 font-mono text-[11px] uppercase">
              <Link 
                href="/signin" 
                className="hidden sm:block text-[#111111]/60 hover:text-black transition-colors"
              >
                Sign in
              </Link>
              <Link 
                href="/signin" 
                className="bg-[#111111] text-[#F7F4EF] hover:bg-[#111111]/80 transition-colors px-4 py-2 rounded-sm"
              >
                Get Started
              </Link>
            </div>
          )}

          {/* Mobile Menu Toggle */}
          <button 
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-1 text-[#111111] flex items-center"
          >
            <span className="material-symbols-outlined text-2xl">
              {mobileMenuOpen ? 'close' : 'menu'}
            </span>
          </button>
        </div>
      </div>

      {/* Mobile Navigation overlay */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-[#111111]/15 bg-[#F7F4EF] w-full px-6 py-8 flex flex-col gap-6 font-mono text-sm uppercase tracking-wider">
          <Link 
            href="/" 
            onClick={() => setMobileMenuOpen(false)}
            className={`transition-colors ${isActive('/') ? 'text-black font-semibold' : 'text-[#111111]/60'}`}
          >
            Home
          </Link>
          <Link 
            href="/about" 
            onClick={() => setMobileMenuOpen(false)}
            className={`transition-colors ${isActive('/about') ? 'text-black font-semibold' : 'text-[#111111]/60'}`}
          >
            About
          </Link>
          <Link 
            href="/works" 
            onClick={() => setMobileMenuOpen(false)}
            className={`transition-colors ${isActive('/works') ? 'text-black font-semibold' : 'text-[#111111]/60'}`}
          >
            Works
          </Link>
          <Link 
            href="/contact" 
            onClick={() => setMobileMenuOpen(false)}
            className={`transition-colors ${isActive('/contact') ? 'text-black font-semibold' : 'text-[#111111]/60'}`}
          >
            Contact
          </Link>
        </div>
      )}
    </header>
  );
}
