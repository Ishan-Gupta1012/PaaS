/* eslint-disable @next/next/no-img-element */
'use client';

import React, { useState } from 'react';
import Link from 'next/link';


export default function Dashboard() {
  const [activeCategory, setActiveCategory] = useState('All');
  const categories = ['All', 'Your Templates', 'Premium'];

  return (
        <main className="flex-1 p-lg md:p-xl space-y-xl max-w-container-max mx-auto w-full">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
            <div>
              <h2 className="font-headline-lg text-headline-lg font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary to-blue-600">Templates Library</h2>
              <p className="text-on-surface-variant mt-xs text-lg">Select a stunning template to start building your portfolio.</p>
            </div>

            {/* Category Selector */}
            <div className="flex bg-surface-container-low p-1 rounded-2xl border border-outline-variant/50">
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setActiveCategory(cat)}
                  className={`px-6 py-2.5 rounded-xl font-semibold text-sm transition-all duration-300 ${activeCategory === cat
                      ? 'bg-primary text-on-primary shadow-lg shadow-primary/25 scale-105'
                      : 'text-on-surface-variant hover:text-on-surface hover:bg-surface-container-highest'
                    }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-lg">
            {/* Slot 1: Modern Developer */}
            <div className="bg-surface-container-lowest p-5 rounded-3xl border-2 border-outline-variant shadow-xl hover:border-primary/60 hover:shadow-primary/20 hover:-translate-y-2 transition-all duration-300 group block relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              <div className="w-full aspect-video bg-surface-container-low rounded-2xl mb-6 flex items-center justify-center overflow-hidden relative border border-white/5 shadow-inner">
                <img src="https://i.postimg.cc/HkdNLqsM/Screenshot-2026-07-03-at-12-44-13-AM-1.png" alt="Modern Developer" className="w-full h-full object-cover blur-[2px] group-hover:blur-0 group-hover:scale-110 group-hover:rotate-1 transition-all duration-700 ease-out" />
                <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center gap-4 backdrop-blur-sm">
                  <Link href="/dashboard/preview" className="bg-white/10 text-white px-5 py-2.5 rounded-xl font-bold border border-white/20 hover:bg-white/20 transition-all hover:scale-105">
                    Preview
                  </Link>
                  <Link href="/dashboard/builder" className="bg-primary text-on-primary px-5 py-2.5 rounded-xl font-bold hover:scale-105 transition-all shadow-[0_0_20px_rgba(var(--primary),0.4)]">
                    Build Now
                  </Link>
                </div>
              </div>
              <div className="relative z-10 flex justify-between items-start">
                <div>
                  <h3 className="font-headline-sm text-headline-sm font-bold text-on-surface group-hover:text-primary transition-colors">Modern Developer</h3>
                  <p className="text-label-sm text-on-surface-variant mt-2 leading-relaxed">Clean, minimalist glassmorphism design. Perfect for showcasing software engineering projects.</p>
                </div>
                <span className="bg-surface-container-highest text-xs font-bold px-3 py-1 rounded-full text-on-surface-variant border border-outline-variant">Free</span>
              </div>
            </div>

            {/* Slot 2: Developer Pro */}
            <div className="bg-surface-container-lowest p-5 rounded-3xl border-2 border-outline-variant shadow-xl hover:border-primary/60 hover:shadow-primary/20 hover:-translate-y-2 transition-all duration-300 group block relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              <div className="aspect-[16/9] w-full relative overflow-hidden bg-neutral-900 group">
                <img src="https://i.postimg.cc/cLBz4Hd5/Screenshot-2026-07-26-at-5-35-09-PM.png" alt="Developer Pro" className="w-full h-full object-cover blur-[2px] group-hover:blur-0 group-hover:scale-110 group-hover:rotate-1 transition-all duration-700 ease-out" />
                <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center gap-4 backdrop-blur-sm">
                  <Link href="/dashboard/preview?template=software-engineer" className="bg-white/10 text-white px-5 py-2.5 rounded-xl font-bold border border-white/20 hover:bg-white/20 transition-all hover:scale-105">
                    Preview
                  </Link>
                  <Link href="/dashboard/builder?template=software-engineer" className="bg-primary text-on-primary px-5 py-2.5 rounded-xl font-bold hover:scale-105 transition-all shadow-[0_0_20px_rgba(var(--primary),0.4)]">
                    Build Now
                  </Link>
                </div>
              </div>
              <div className="relative z-10 flex justify-between items-start">
                <div>
                  <h3 className="font-headline-sm text-headline-sm font-bold text-on-surface group-hover:text-primary transition-colors">Developer Pro</h3>
                  <p className="text-label-sm text-on-surface-variant mt-2 leading-relaxed">Clean, dark-themed bento design. Perfect for modern software engineers.</p>
                </div>
                <span className="bg-surface-container-highest text-xs font-bold px-3 py-1 rounded-full text-on-surface-variant border border-outline-variant">Free</span>
              </div>
            </div>


          </div>
        </main>
  );
}
