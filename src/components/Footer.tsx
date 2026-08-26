'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

export default function Footer() {
  const [hanoiTime, setHanoiTime] = useState('');

  useEffect(() => {
    const updateHanoiTime = () => {
      const options: Intl.DateTimeFormatOptions = {
        timeZone: 'Asia/Ho_Chi_Minh',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        hour12: false,
      };
      const formatted = new Intl.DateTimeFormat('en-US', options).format(new Date());
      setHanoiTime(formatted);
    };

    updateHanoiTime();
    const interval = setInterval(updateHanoiTime, 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <footer className="bg-[#F7F4EF] border-t border-[#111111] text-[#111111] font-sans">
      <div className="max-w-7xl mx-auto">
        {/* Main Grid */}
        <div className="grid grid-cols-1 md:grid-cols-12 border-b border-[#111111]">
          {/* Brand Col */}
          <div className="md:col-span-6 p-8 md:p-12 border-b md:border-b-0 md:border-r border-[#111111] flex flex-col justify-between">
            <div>
              <div className="flex items-center gap-2 mb-6">
                <div className="border border-[#111111] w-8 h-8 rounded-sm flex items-center justify-center font-serif text-base font-semibold">
                  S
                </div>
                <span className="font-serif font-semibold text-xl tracking-tight">think.design</span>
              </div>
              <p className="font-serif text-2xl md:text-3xl leading-tight italic mb-8 text-[#111111]/85">
                "Thoughtful design, crafted with care and built to last."
              </p>
            </div>
            <div className="font-mono text-xs text-[#111111]/60 mt-8">
              <span className="text-[#111111] font-semibold">HANOI, VN LOCAL TIME:</span> {hanoiTime || '12:00:00'} (GMT+7)
            </div>
          </div>

          {/* Navigation Links Col */}
          <div className="md:col-span-3 p-8 md:p-12 border-b md:border-b-0 md:border-r border-[#111111]">
            <h4 className="font-mono text-xs uppercase tracking-widest text-[#111111]/45 mb-6">Index</h4>
            <ul className="space-y-4 font-mono text-xs uppercase tracking-wider">
              <li><Link href="/" className="hover:text-black hover:underline transition-all">Home</Link></li>
              <li><Link href="/about" className="hover:text-black hover:underline transition-all">About</Link></li>
              <li><Link href="/works" className="hover:text-black hover:underline transition-all">Works</Link></li>
              <li><Link href="/contact" className="hover:text-black hover:underline transition-all">Contact</Link></li>
            </ul>
          </div>

          {/* Social Links Col */}
          <div className="md:col-span-3 p-8 md:p-12">
            <h4 className="font-mono text-xs uppercase tracking-widest text-[#111111]/45 mb-6">Socials</h4>
            <ul className="space-y-4 font-mono text-xs uppercase tracking-wider">
              <li><a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="hover:text-black hover:underline transition-all">Instagram</a></li>
              <li><a href="https://behance.net" target="_blank" rel="noopener noreferrer" className="hover:text-black hover:underline transition-all">Behance</a></li>
              <li><a href="https://dribbble.com" target="_blank" rel="noopener noreferrer" className="hover:text-black hover:underline transition-all">Dribbble</a></li>
              <li><a href="https://twitter.com" target="_blank" rel="noopener noreferrer" className="hover:text-black hover:underline transition-all">Twitter / X</a></li>
            </ul>
          </div>
        </div>

        {/* Footer Sub Bar */}
        <div className="p-8 md:px-12 flex flex-col md:flex-row justify-between items-center gap-4 font-mono text-[10px] text-[#111111]/60 uppercase tracking-widest">
          <div>
            © 2026 Studio Think. All Rights Reserved.
          </div>
          <div className="flex gap-2 items-center">
            <span>Crafted with intent. Shipped with conviction.</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
