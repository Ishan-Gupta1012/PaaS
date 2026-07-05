"use client";

import React from "react";

export default function ModernTemplate() {
  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 font-sans p-6 md:p-12">
      <div className="max-w-3xl mx-auto bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
        {/* Header */}
        <header className="px-6 py-6 border-b border-slate-100 flex justify-between items-center">
          <span className="font-bold tracking-tight text-slate-900">Alex Mercer</span>
          <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium bg-emerald-50 text-emerald-700 border border-emerald-100">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
            Open to projects
          </span>
        </header>

        {/* Hero */}
        <section className="px-8 py-16 text-center md:text-left md:py-24 border-b border-slate-100">
          <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Software Engineer</span>
          <h1 className="text-3xl md:text-5xl font-extrabold tracking-tight text-slate-900 mt-2 mb-4">
            Building interfaces that are clean, fast, and intuitive.
          </h1>
          <p className="text-slate-500 text-base md:text-lg max-w-xl leading-relaxed">
            Hi, I&apos;m Alex. A full-stack developer focusing on React, Next.js, Node.js, and TypeScript. I craft high-quality web applications for startups and enterprise clients.
          </p>
          <div className="flex flex-wrap gap-3 justify-center md:justify-start mt-8">
            <button className="bg-slate-900 text-white font-semibold px-6 py-2.5 rounded-lg hover:bg-slate-800 transition-colors shadow-sm text-sm">
              Get in touch
            </button>
            <button className="border border-slate-200 text-slate-600 hover:text-slate-900 hover:bg-slate-50 font-semibold px-6 py-2.5 rounded-lg transition-all text-sm">
              View projects
            </button>
          </div>
        </section>

        {/* Projects */}
        <section className="p-8">
          <h2 className="text-lg font-bold text-slate-900 mb-6 uppercase tracking-wider text-slate-400 text-xs">Featured Work</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="p-5 rounded-xl border border-slate-150 bg-slate-50 hover:border-slate-300 transition-colors">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">SaaS PLATFORM</span>
              <h3 className="font-bold text-slate-900 mt-1 mb-2 text-base">Vanguard Analytics</h3>
              <p className="text-slate-500 text-xs leading-relaxed mb-4">
                Real-time dashboard charting key marketing funnel metrics and server metrics.
              </p>
              <div className="flex gap-2">
                <span className="bg-white border border-slate-200 rounded px-2 py-0.5 text-[10px] text-slate-500 font-medium">React</span>
                <span className="bg-white border border-slate-200 rounded px-2 py-0.5 text-[10px] text-slate-500 font-medium">Tailwind</span>
              </div>
            </div>
            <div className="p-5 rounded-xl border border-slate-150 bg-slate-50 hover:border-slate-300 transition-colors">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">E-COMMERCE</span>
              <h3 className="font-bold text-slate-900 mt-1 mb-2 text-base">Nova Shop</h3>
              <p className="text-slate-500 text-xs leading-relaxed mb-4">
                A high-performance headless store frontend utilizing Next.js and Shopify API.
              </p>
              <div className="flex gap-2">
                <span className="bg-white border border-slate-200 rounded px-2 py-0.5 text-[10px] text-slate-500 font-medium">Next.js</span>
                <span className="bg-white border border-slate-200 rounded px-2 py-0.5 text-[10px] text-slate-500 font-medium">Shopify</span>
              </div>
            </div>
          </div>
        </section>

        {/* Footer */}
        <footer className="px-6 py-6 bg-slate-50 border-t border-slate-100 text-center text-xs text-slate-400 font-medium">
          &copy; {new Date().getFullYear()} Alex Mercer. Crafted with simplicity.
        </footer>
      </div>
    </div>
  );
}
