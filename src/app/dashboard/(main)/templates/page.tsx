/* eslint-disable @next/next/no-img-element */
'use client';

import React, { useState } from 'react';
import Link from 'next/link';

export default function Dashboard() {
  const [activeCategory, setActiveCategory] = useState('All');
  const categories = ['All', 'Your Templates', 'Premium'];

  return (
    <main className="flex-1 p-6 md:p-8 space-y-8 max-w-7xl mx-auto w-full select-none text-[#111111] font-sans">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-[#111111] pb-6">
        <div>
          <div className="font-mono text-[9px] uppercase tracking-widest text-[#111111]/45 mb-2">[WORKSPACE / TEMPLATES]</div>
          <h2 className="font-serif text-3xl md:text-4xl font-semibold">Templates Library</h2>
          <p className="text-xs sm:text-sm text-[#111111]/70 mt-1">Select a layout to configure your public developer presence.</p>
        </div>

        {/* Category Selector */}
        <div className="flex bg-[#E8E5DF] p-1 border border-[#111111] rounded-xs font-mono text-xs uppercase">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`px-4 py-2 rounded-xs font-semibold tracking-wider transition-all duration-150 ${activeCategory === cat
                  ? 'bg-[#111111] text-[#F7F4EF]'
                  : 'text-[#111111]/60 hover:text-black'
                }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Grid of templates */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        
        {/* Slot 1: Modern Developer */}
        <div className="bg-[#F7F4EF] p-6 border border-[#111111] rounded-sm transition-all hover:bg-[#111111]/5 flex flex-col justify-between relative group overflow-hidden">
          <div>
            <div className="w-full aspect-video bg-[#E8E5DF] rounded-xs mb-6 overflow-hidden relative border border-[#111111] shadow-inner">
              <img 
                src="https://i.postimg.cc/HkdNLqsM/Screenshot-2026-07-03-at-12-44-13-AM-1.png" 
                alt="Modern Developer" 
                className="w-full h-full object-cover blur-[1px] group-hover:blur-0 group-hover:scale-102 transition-all duration-500 ease-out" 
              />
              <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center gap-4 backdrop-blur-xs">
                <Link 
                  href="/dashboard/preview?template=modern-developer" 
                  className="bg-[#F7F4EF] text-[#111111] px-4 py-2 rounded-xs font-mono text-xs uppercase tracking-widest border border-[#111111] hover:bg-[#111111] hover:text-[#F7F4EF] transition-all"
                >
                  Preview
                </Link>
                <Link 
                  href="/dashboard/builder?template=modern-developer" 
                  className="bg-[#111111] text-[#F7F4EF] px-4 py-2 rounded-xs font-mono text-xs uppercase tracking-widest border border-[#111111] hover:bg-[#111111]/85 transition-all"
                >
                  Build Now
                </Link>
              </div>
            </div>
            
            <div className="flex justify-between items-start mb-4">
              <div>
                <h3 className="font-serif text-xl sm:text-2xl font-semibold text-[#111111] group-hover:underline">
                  Modern Developer
                </h3>
                <p className="text-xs text-[#111111]/75 mt-2 leading-relaxed max-w-[360px]">
                  Clean, minimalist layout featuring a side navbar, developer highlights grid, and custom email inquiry widgets.
                </p>
              </div>
              <span className="font-mono text-[9px] uppercase tracking-wider bg-[#111111]/5 text-[#111111] px-2 py-0.5 rounded-xs border border-[#111111]/15">
                Free
              </span>
            </div>
          </div>
        </div>

        {/* Slot 2: Developer Pro */}
        <div className="bg-[#F7F4EF] p-6 border border-[#111111] rounded-sm transition-all hover:bg-[#111111]/5 flex flex-col justify-between relative group overflow-hidden">
          <div>
            <div className="w-full aspect-video bg-[#E8E5DF] rounded-xs mb-6 overflow-hidden relative border border-[#111111] shadow-inner">
              <img 
                src="https://i.postimg.cc/cLBz4Hd5/Screenshot-2026-07-26-at-5-35-09-PM.png" 
                alt="Developer Pro" 
                className="w-full h-full object-cover blur-[1px] group-hover:blur-0 group-hover:scale-102 transition-all duration-500 ease-out" 
              />
              <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center gap-4 backdrop-blur-xs">
                <Link 
                  href="/dashboard/preview?template=software-engineer" 
                  className="bg-[#F7F4EF] text-[#111111] px-4 py-2 rounded-xs font-mono text-xs uppercase tracking-widest border border-[#111111] hover:bg-[#111111] hover:text-[#F7F4EF] transition-all"
                >
                  Preview
                </Link>
                <Link 
                  href="/dashboard/builder?template=software-engineer" 
                  className="bg-[#111111] text-[#F7F4EF] px-4 py-2 rounded-xs font-mono text-xs uppercase tracking-widest border border-[#111111] hover:bg-[#111111]/85 transition-all"
                >
                  Build Now
                </Link>
              </div>
            </div>
            
            <div className="flex justify-between items-start mb-4">
              <div>
                <h3 className="font-serif text-xl sm:text-2xl font-semibold text-[#111111] group-hover:underline">
                  Developer Pro
                </h3>
                <p className="text-xs text-[#111111]/75 mt-2 leading-relaxed max-w-[360px]">
                  Curated dark bento-grid layout for software engineers. Integrated work timelines, code repositories sync, and stats.
                </p>
              </div>
              <span className="font-mono text-[9px] uppercase tracking-wider bg-[#111111]/5 text-[#111111] px-2 py-0.5 rounded-xs border border-[#111111]/15">
                Free
              </span>
            </div>
          </div>
        </div>

      </div>
    </main>
  );
}
