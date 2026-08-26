'use client';

import { useState } from 'react';
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import Link from 'next/link';

const templates = [
  {
    id: '01',
    name: 'Modern Developer',
    creator: 'Ishan Gupta',
    creatorKey: 'ISHAN GUPTA',
    desc: 'Clean, minimalist layout featuring a side navbar, developer highlights grid, and custom email inquiry widgets.',
    stack: ['TypeScript', 'Next.js', 'TailwindCSS'],
    imgUrl: 'https://i.postimg.cc/HkdNLqsM/Screenshot-2026-07-03-at-12-44-13-AM-1.png',
    previewLink: '/templates/modern-developer',
    badge: 'Free',
  },
  {
    id: '02',
    name: 'Developer Pro',
    creator: 'Aparna Jha',
    creatorKey: 'APARNA JHA',
    desc: 'Curated dark bento-grid layout for software engineers. Integrated work timelines, code repositories sync, and stats.',
    stack: ['React', 'TypeScript', 'Framer Motion'],
    imgUrl: 'https://i.postimg.cc/cLBz4Hd5/Screenshot-2026-07-26-at-5-35-09-PM.png',
    previewLink: '/templates/software-engineer',
    badge: 'Free',
  },
];

export default function WorksPage() {
  const [filter, setFilter] = useState('ALL');

  const categories = ['ALL', 'APARNA JHA', 'ISHAN GUPTA'];

  const filtered = filter === 'ALL'
    ? templates
    : templates.filter(t => t.creatorKey === filter);

  return (
    <div className="bg-[#F7F4EF] text-[#111111] min-h-screen flex flex-col custom-cursor font-sans">
      <Navbar />

      <main className="flex-1 pt-24 md:pt-32">

        {/* Header */}
        <section className="py-12 md:py-20 border-b border-[#111111] bg-grid-paper">
          <div className="max-w-7xl mx-auto px-4 sm:px-8">
            <div className="font-mono text-xs uppercase tracking-widest text-[#111111]/60 mb-6">
              ✦ Selected Layouts / Portfolio Templates
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-end">
              <div className="lg:col-span-8">
                <h1 className="font-serif text-5xl sm:text-7xl lg:text-8xl leading-[0.9] tracking-tight">
                  Templates designed <span className="italic font-normal text-stroke">to feel bespoke.</span>
                </h1>
              </div>
              <div className="lg:col-span-4 lg:pl-6 pt-2">
                <p className="text-sm md:text-base text-[#111111]/80 leading-relaxed">
                  Each layout is handcrafted for developers who care about first impressions. Browse by creator or explore both.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Filter Navigation */}
        <section className="border-b border-[#111111] bg-[#F7F4EF] sticky top-16 z-30">
          <div className="max-w-7xl mx-auto px-4 sm:px-8 py-4 flex flex-wrap gap-2 md:gap-6 items-center">
            <span className="font-mono text-[10px] text-[#111111]/45 uppercase tracking-widest mr-2">Filter By:</span>
            {categories.map(cat => (
              <button
                key={cat}
                onClick={() => setFilter(cat)}
                className={`font-mono text-[10px] md:text-xs uppercase tracking-wider px-3 py-1 border transition-all ${
                  filter === cat
                    ? 'bg-[#111111] text-[#F7F4EF] border-[#111111]'
                    : 'bg-transparent text-[#111111]/60 border-transparent hover:border-[#111111]/30 hover:text-black'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </section>

        {/* Template Tiles Grid */}
        <section className="py-12 md:py-20 bg-grid-paper">
          <div className="max-w-7xl mx-auto px-4 sm:px-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-12 max-w-5xl mx-auto">
              {filtered.map((template, idx) => (
                <div
                  key={template.id}
                  className="group flex flex-col border border-[#111111] rounded-sm bg-[#F7F4EF] overflow-hidden transition-all duration-300 hover:scale-[1.01]"
                >
                  {/* Template Screenshot */}
                  <div className="aspect-[16/10] border-b border-[#111111] overflow-hidden relative bg-[#111111]/5">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={template.imgUrl}
                      alt={template.name}
                      className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                    />
                    {/* Creator badge */}
                    <div className="absolute top-4 left-4 font-mono text-[9px] uppercase tracking-widest bg-[#F7F4EF] text-[#111111] px-2 py-0.5 border border-[#111111] rounded-xs shadow-sm">
                      {template.creator}
                    </div>
                    {/* Badge */}
                    <div className="absolute top-4 right-4 font-mono text-[9px] uppercase tracking-widest bg-[#111111] text-[#F7F4EF] px-2 py-0.5 rounded-xs">
                      {template.badge}
                    </div>
                    {/* Hover overlay */}
                    <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center backdrop-blur-[2px]">
                      <Link
                        href={template.previewLink}
                        className="bg-[#F7F4EF] text-[#111111] px-6 py-2.5 font-mono text-xs uppercase tracking-widest border border-[#111111] hover:bg-[#111111] hover:text-[#F7F4EF] transition-all"
                      >
                        Live Preview ↗
                      </Link>
                    </div>
                  </div>

                  {/* Body */}
                  <div className="p-8 flex-1 flex flex-col justify-between">
                    <div>
                      <div className="flex justify-between items-center mb-4 font-mono text-[9px] text-[#111111]/40">
                        <span>TEMPLATE {String(idx + 1).padStart(2, '0')}</span>
                        <span>[LAYOUT / SLT]</span>
                      </div>
                      <h3 className="font-serif text-2xl md:text-3xl font-semibold mb-3 group-hover:underline">
                        {template.name}
                      </h3>
                      <p className="text-xs md:text-sm text-[#111111]/75 leading-relaxed mb-6">
                        {template.desc}
                      </p>
                    </div>

                    <div>
                      <div className="flex flex-wrap gap-1.5 mb-6">
                        {template.stack.map((tag, tIdx) => (
                          <span key={tIdx} className="font-mono text-[9px] uppercase tracking-wider bg-[#111111]/5 text-[#111111]/80 px-2 py-0.5 rounded-xs border border-[#111111]/10">
                            {tag}
                          </span>
                        ))}
                      </div>
                      <Link
                        href={template.previewLink}
                        className="inline-flex items-center gap-2 font-mono text-xs uppercase tracking-widest border border-[#111111] px-4 py-2 hover:bg-[#111111] hover:text-[#F7F4EF] transition-all w-full justify-center"
                      >
                        Live Preview
                        <span className="text-[10px]">↗</span>
                      </Link>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

      </main>

      <Footer />
    </div>
  );
}
