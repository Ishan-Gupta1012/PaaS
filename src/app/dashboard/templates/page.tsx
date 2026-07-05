/* eslint-disable @next/next/no-img-element */
'use client';

import React, { useState } from 'react';
import { Plus, LayoutDashboard, PenTool, LayoutTemplate, RefreshCw, Eye, BarChart3, Code2, Rocket, Settings, Search, Bell, UserCircle, LogOut, ChevronDown } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import Link from 'next/link';


export default function Dashboard() {
  const { user, logout } = useAuth();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [activeCategory, setActiveCategory] = useState('All');
  const categories = ['All', 'Your Templates', 'Premium', 'Community'];

  return (
    <div className="bg-background text-on-surface font-body-md selection:bg-primary-container selection:text-on-primary-container">
      {/* Sidebar Shell */}
      <aside className="fixed left-0 top-0 h-full flex flex-col py-lg bg-surface-container-lowest w-64 border-r border-outline-variant z-[60] hidden md:flex">
        <div className="px-lg mb-xl">
          <h1 className="font-display-md text-display-md font-bold text-primary">PortfolioOS</h1>
          <p className="font-label-sm text-on-surface-variant uppercase tracking-widest mt-xs">Enterprise Tier</p>
        </div>
        <nav className="flex-1 px-md space-y-2 mt-4">
          {/* Dashboard Tab */}
          <Link className="flex items-center gap-md px-md py-[10px] text-on-surface-variant hover:bg-surface-container-low rounded-xl transition-all" href="/dashboard">
            <LayoutDashboard size={20} />
            <span className="font-body-md font-medium">Dashboard</span>
          </Link>

          <Link className="flex items-center gap-md px-md py-[10px] bg-secondary-container text-on-surface-variant font-semibold rounded-xl transition-all duration-200" href="/dashboard/templates">
            <LayoutTemplate size={20} />
            <span className="font-body-md font-semibold">Templates</span>
          </Link>
          <a className="flex items-center gap-md px-md py-[10px] text-on-surface-variant hover:bg-surface-container-low rounded-xl transition-all" href="#">
            <RefreshCw size={20} />
            <span className="font-body-md font-medium">GitHub Sync</span>
          </a>
          <a className="flex items-center gap-md px-md py-[10px] text-on-surface-variant hover:bg-surface-container-low rounded-xl transition-all" href="#">
            <Eye size={20} />
            <span className="font-body-md font-medium">Live Preview</span>
          </a>
          <a className="flex items-center gap-md px-md py-[10px] text-on-surface-variant hover:bg-surface-container-low rounded-xl transition-all" href="#">
            <BarChart3 size={20} />
            <span className="font-body-md font-medium">Analytics</span>
          </a>
          <a className="flex items-center gap-md px-md py-[10px] text-on-surface-variant hover:bg-surface-container-low rounded-xl transition-all" href="#">
            <Code2 size={20} />
            <span className="font-body-md font-medium">Generated Code</span>
          </a>
          <a className="flex items-center gap-md px-md py-[10px] text-on-surface-variant hover:bg-surface-container-low rounded-xl transition-all" href="#">
            <Rocket size={20} />
            <span className="font-body-md font-medium">Deployment</span>
          </a>
          <a className="flex items-center gap-md px-md py-[10px] text-on-surface-variant hover:bg-surface-container-low rounded-xl transition-all" href="#">
            <Settings size={20} />
            <span className="font-body-md font-medium">Settings</span>
          </a>
        </nav>
        <div className="px-md mt-auto pt-lg">
          <button className="w-full py-md bg-primary text-on-primary rounded-xl font-semibold shadow-sm hover:opacity-90 transition-opacity">
            Upgrade Plan
          </button>
        </div>
      </aside>

      {/* Main Wrapper */}
      <div className="md:pl-64 min-h-screen flex flex-col">
        {/* Top Navigation */}
        <header className="flex justify-between items-center w-full h-16 px-lg sticky top-0 z-50 bg-surface-container-lowest/80 backdrop-blur-md border-b border-outline-variant">
          <div className="flex items-center gap-xl flex-1">
            <div className="relative w-full max-w-md group">
              <Search className="absolute left-md top-1/2 -translate-y-1/2 text-on-surface-variant" size={20} />
              <input className="w-full bg-surface-container-low border-none rounded-full pl-xl pr-md py-xs text-body-sm focus:ring-2 focus:ring-primary focus:bg-surface-container-lowest transition-all" placeholder="Search projects..." type="text" />
            </div>
          </div>
          <div className="flex items-center gap-md">
            <button className="p-sm text-on-surface-variant hover:bg-surface-container-low rounded-full transition-colors relative">
              <Bell size={20} />
              <span className="absolute top-sm right-sm w-2 h-2 bg-error rounded-full border-2 border-surface-container-lowest"></span>
            </button>
            <div className="h-8 w-px bg-outline-variant mx-xs"></div>
            <div className="flex items-center gap-sm relative">
              <button className="px-md py-sm text-primary font-bold border-b-2 border-primary text-label-md">Active</button>
              <button className="px-md py-sm bg-primary text-on-primary rounded-lg font-semibold text-label-md hover:opacity-90 transition-transform active:scale-95">Publish</button>
              <button 
                className="flex items-center gap-2 hover:bg-surface-container-low p-1 rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-primary"
                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
              >
                <img 
                  className="w-8 h-8 rounded-full border border-outline-variant object-cover" 
                  src={user?.personalInfo?.avatar || "https://api.dicebear.com/7.x/avataaars/svg?seed=fallback"} 
                  alt="Profile" 
                />
                <ChevronDown size={16} className={`text-on-surface-variant transition-transform ${isDropdownOpen ? 'rotate-180' : ''}`} />
              </button>

              {/* Profile Dropdown */}
              {isDropdownOpen && (
                <div className="absolute right-0 top-full mt-2 w-48 bg-surface-container-lowest border border-outline-variant rounded-xl shadow-lg py-2 z-[100] animate-in fade-in slide-in-from-top-2 duration-200">
                  <div className="px-4 py-2 border-b border-outline-variant">
                    <p className="font-bold text-on-surface truncate">{user?.personalInfo?.name || "Developer"}</p>
                    <p className="text-label-sm text-on-surface-variant truncate">{user?.personalInfo?.email}</p>
                  </div>
                  <div className="py-1">
                    <Link href="/dashboard/profile" className="w-full text-left px-4 py-2 text-body-sm text-on-surface hover:bg-surface-container-low flex items-center gap-2 transition-colors">
                      <UserCircle size={16} />
                      Profile
                    </Link>
                  </div>
                  <div className="py-1 border-t border-outline-variant">
                    <button 
                      onClick={logout}
                      className="w-full text-left px-4 py-2 text-body-sm text-error hover:bg-error-container/20 flex items-center gap-2 transition-colors"
                    >
                      <LogOut size={16} />
                      Log out
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </header>

        {/* Main Content */}
        {/* Main Content */}
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
                  className={`px-6 py-2.5 rounded-xl font-semibold text-sm transition-all duration-300 ${
                    activeCategory === cat 
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
            {/* Slot 1 — Developer Pro */}
            <div className="bg-surface-container-lowest p-md rounded-xl border border-outline-variant shadow-sm hover:border-primary/50 transition-colors group flex flex-col justify-between">
              <div>
                <Link href="/templates/software-engineer" className="block w-full aspect-video bg-surface-container-low rounded-lg mb-md overflow-hidden relative">
                  <LayoutTemplate size={48} className="absolute inset-0 m-auto text-on-surface-variant group-hover:text-primary transition-colors" />
                  <div className="absolute inset-0 bg-primary/10 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                    <span className="bg-primary text-on-primary px-md py-sm rounded-lg font-semibold">Preview Template</span>
                  </div>
                </Link>
                <h3 className="font-headline-sm text-headline-sm font-bold">Developer Pro</h3>
                <p className="text-label-sm text-on-surface-variant mt-xs mb-4">Clean, dark-themed bento design for modern software engineers.</p>
              </div>
              <Link
                href="/templates/software-engineer"
                className="w-full text-center py-2 border border-outline-variant text-primary hover:bg-surface-container-low rounded-lg font-semibold text-label-md flex items-center justify-center gap-2 transition-all hover:border-primary/30"
              >
                Live Preview
                <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M13.5 6H5.25A2.25 2.25 0 003 8.25v10.5A2.25 2.25 0 005.25 21h10.5A2.25 2.25 0 0018 18.75V10.5m-10.5 6L21 3m0 0h-5.25M21 3v5.25" /></svg>
              </Link>
            </div>
            
            {/* Slot 2 — Creative Edge */}
            <div className="bg-surface-container-lowest p-md rounded-xl border border-outline-variant shadow-sm hover:border-primary/50 transition-colors group flex flex-col justify-between">
              <div>
                <Link href="/templates/creative-edge" className="block w-full aspect-video bg-[#060814] rounded-lg mb-md overflow-hidden relative">
                  <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-tr from-purple-600/20 to-pink-500/10 pointer-events-none" />
                  <Code2 size={48} className="absolute inset-0 m-auto text-purple-400 group-hover:text-pink-400 transition-colors relative z-10" />
                  <div className="absolute inset-0 bg-black/70 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center z-20">
                    <span className="bg-gradient-to-r from-purple-600 to-pink-500 text-white px-md py-sm rounded-lg font-semibold text-label-sm">Preview Template</span>
                  </div>
                </Link>
                <h3 className="font-headline-sm text-headline-sm font-bold">Creative Edge</h3>
                <p className="text-label-sm text-on-surface-variant mt-xs mb-4">Vibrant purple-pink portfolio for creative technologists and digital artists.</p>
              </div>
              <Link
                href="/templates/creative-edge"
                className="w-full text-center py-2 border border-outline-variant text-primary hover:bg-surface-container-low rounded-lg font-semibold text-label-md flex items-center justify-center gap-2 transition-all hover:border-primary/30"
              >
                Live Preview
                <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M13.5 6H5.25A2.25 2.25 0 003 8.25v10.5A2.25 2.25 0 005.25 21h10.5A2.25 2.25 0 0018 18.75V10.5m-10.5 6L21 3m0 0h-5.25M21 3v5.25" /></svg>
              </Link>
            </div>

            {/* Slot 3 — Modern Clean */}
            <div className="bg-surface-container-lowest p-md rounded-xl border border-outline-variant shadow-sm hover:border-primary/50 transition-colors group flex flex-col justify-between">
              <div>
                <Link href="/templates/modern" className="block w-full aspect-video bg-slate-50 rounded-lg mb-md overflow-hidden relative border border-slate-200">
                  <Rocket size={48} className="absolute inset-0 m-auto text-emerald-500 group-hover:text-emerald-600 transition-colors" />
                  <div className="absolute inset-0 bg-slate-900/70 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                    <span className="bg-white text-slate-900 px-md py-sm rounded-lg font-semibold text-label-sm">Preview Template</span>
                  </div>
                </Link>
                <h3 className="font-headline-sm text-headline-sm font-bold">Modern Clean</h3>
                <p className="text-label-sm text-on-surface-variant mt-xs mb-4">Minimalist white-card layout for full-stack developers and consultants.</p>
              </div>
              <Link
                href="/templates/modern"
                className="w-full text-center py-2 border border-outline-variant text-primary hover:bg-surface-container-low rounded-lg font-semibold text-label-md flex items-center justify-center gap-2 transition-all hover:border-primary/30"
              >
                Live Preview
                <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M13.5 6H5.25A2.25 2.25 0 003 8.25v10.5A2.25 2.25 0 005.25 21h10.5A2.25 2.25 0 0018 18.75V10.5m-10.5 6L21 3m0 0h-5.25M21 3v5.25" /></svg>
              </Link>
            </div>
          </div>
        </main>
      </div>

      {/* Mobile Navigation Shell (Suppressed on desktop) */}
      <nav className="fixed bottom-0 left-0 right-0 h-16 bg-surface-container-lowest border-t border-outline-variant flex items-center justify-around px-md md:hidden z-[100]">
        <button className="flex flex-col items-center text-primary">
          <LayoutDashboard size={20} />
          <span className="text-[10px] font-bold">Home</span>
        </button>
        <button className="flex flex-col items-center text-on-surface-variant">
          <PenTool size={20} />
          <span className="text-[10px] font-bold">Build</span>
        </button>
        <button className="flex flex-col items-center text-on-surface-variant">
          <RefreshCw size={20} />
          <span className="text-[10px] font-bold">Sync</span>
        </button>
        <button className="flex flex-col items-center text-on-surface-variant">
          <BarChart3 size={20} />
          <span className="text-[10px] font-bold">Stats</span>
        </button>
        <button className="flex flex-col items-center text-on-surface-variant">
          <Settings size={20} />
          <span className="text-[10px] font-bold">Settings</span>
        </button>
      </nav>

      {/* Contextual FAB */}
      <button className="fixed bottom-20 right-lg w-14 h-14 bg-primary text-on-primary rounded-full shadow-2xl flex items-center justify-center hover:scale-110 active:scale-95 transition-transform md:bottom-lg z-[90]">
        <span className="text-[28px]"><Plus /></span>
      </button>
    </div>
  );
}
