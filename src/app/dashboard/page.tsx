/* eslint-disable @next/next/no-img-element */
'use client';

import React, { useState } from 'react';
import { Plus, Copy, LayoutDashboard, PenTool, LayoutTemplate, RefreshCw, Eye, BarChart3, Code2, Rocket, Settings, Search, Bell, CheckCircle2, Check, Lightbulb, Monitor, Tablet, Smartphone, UserCircle, Sparkles, User, Terminal, Briefcase, GraduationCap, ShieldCheck, Share2, ArrowRight, Globe, LogOut, ChevronDown } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import Link from 'next/link';


export default function Dashboard() {
  const { user, logout } = useAuth();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [previewUrl, setPreviewUrl] = useState("/templates/software-engineer");
  const [viewport, setViewport] = useState<"monitor" | "tablet" | "smartphone">("monitor");

  return (
    <div className="bg-background text-on-surface font-body-md selection:bg-primary-container selection:text-on-primary-container">
      {/* Sidebar Shell */}
      <aside className="fixed left-0 top-0 h-full flex flex-col py-lg bg-surface-container-lowest w-64 border-r border-outline-variant z-[60] hidden md:flex">
        <div className="px-lg mb-xl">
          <h1 className="font-display-md text-display-md font-bold text-primary">PortfolioOS</h1>
          <p className="font-label-sm text-on-surface-variant uppercase tracking-widest mt-xs">Enterprise Tier</p>
        </div>
        <nav className="flex-1 px-md space-y-2 mt-4">
          {/* Active Tab: Dashboard */}
          <Link className="flex items-center gap-md px-md py-[10px] bg-secondary-container text-on-surface-variant font-semibold rounded-xl transition-all duration-200" href="/dashboard">
            <LayoutDashboard size={20} />
            <span className="font-body-md font-semibold">Dashboard</span>
          </Link>

          <Link className="flex items-center gap-md px-md py-[10px] text-on-surface-variant hover:bg-surface-container-low rounded-xl transition-all" href="/dashboard/templates">
            <LayoutTemplate size={20} />
            <span className="font-body-md font-medium">Templates</span>
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
        <main className="flex-1 p-lg md:p-xl space-y-xl max-w-container-max mx-auto w-full">
          {/* SECTION 1: OVERVIEW HERO */}
          <section className="grid grid-cols-1 lg:grid-cols-3 gap-lg">
            {/* Welcome Card */}
            <div className="lg:col-span-2 bg-surface-container-lowest p-xl rounded-xl border border-outline-variant shadow-sm flex flex-col justify-between relative overflow-hidden group">
              <div className="absolute -top-12 -right-12 w-48 h-48 bg-primary/5 rounded-full blur-3xl group-hover:bg-primary/10 transition-colors"></div>
              <div>
                <div className="flex justify-between items-start mb-md">
                  <div>
                    <h2 className="font-headline-lg text-headline-lg text-on-surface">Welcome back, {user?.personalInfo?.name?.split(' ')[0] || 'Developer'}</h2>
                    <p className="text-on-surface-variant mt-xs">Template: <span className="text-primary font-semibold">Modern Dev</span> • Last synced: 2 minutes ago</p>
                  </div>
                  <div className="flex gap-sm">
                    <button className="px-md py-sm border border-outline-variant rounded-lg text-label-md font-semibold hover:bg-surface-container-low transition-colors">Edit Bio</button>
                    <button className="px-md py-sm bg-primary text-on-primary rounded-lg text-label-md font-semibold hover:shadow-lg transition-shadow">Add Project</button>
                  </div>
                </div>
                <div className="mt-xl">
                  <div className="flex justify-between items-center mb-xs">
                    <span className="font-label-md text-on-surface-variant">Profile Completion</span>
                    <span className="font-label-md text-primary font-bold">85%</span>
                  </div>
                  <div className="w-full bg-surface-container-low h-2 rounded-full overflow-hidden">
                    <div className="bg-primary h-full rounded-full transition-all duration-1000" style={{ width: "85%" }}></div>
                  </div>
                </div>
              </div>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-2 gap-md">
              <div className="bg-surface-container-lowest p-md rounded-xl border border-outline-variant hover:border-primary/30 transition-colors flex flex-col items-center justify-center text-center">
                <span className="text-display-md font-bold text-on-surface">1.2k</span>
                <span className="text-label-sm text-on-surface-variant uppercase">Views</span>
              </div>
              <div className="bg-surface-container-lowest p-md rounded-xl border border-outline-variant hover:border-primary/30 transition-colors flex flex-col items-center justify-center text-center">
                <span className="text-display-md font-bold text-on-surface">42</span>
                <span className="text-label-sm text-on-surface-variant uppercase">Repos</span>
              </div>
              <div className="bg-surface-container-lowest p-md rounded-xl border border-outline-variant hover:border-primary/30 transition-colors flex flex-col items-center justify-center text-center">
                <span className="text-display-md font-bold text-on-surface">156</span>
                <span className="text-label-sm text-on-surface-variant uppercase">Downloads</span>
              </div>
              <div className="bg-surface-container-lowest p-md rounded-xl border border-outline-variant hover:border-primary/30 transition-colors flex flex-col items-center justify-center text-center">
                <span className="text-display-md font-bold text-primary">86</span>
                <span className="text-label-sm text-on-surface-variant uppercase">Health</span>
              </div>
            </div>
          </section>

          {/* SECTION 2 & 4: HEALTH & LIVE PREVIEW */}
          <section className="grid grid-cols-1 lg:grid-cols-4 gap-lg">
            {/* Portfolio Health Sidebar (1/4 width) */}
            <div className="lg:col-span-1 space-y-lg">
              <div className="bg-surface-container-lowest p-lg rounded-xl border border-outline-variant shadow-sm h-fit">
                <div className="flex items-center justify-between mb-lg">
                  <h3 className="font-headline-md text-headline-md">Health Score</h3>
                  <CheckCircle2 className="text-tertiary" size={20} />
                </div>
                <div className="flex justify-center mb-lg">
                  <div className="relative w-32 h-32 flex items-center justify-center">
                    <svg className="w-full h-full -rotate-90">
                      <circle className="text-surface-container-low" cx="64" cy="64" fill="transparent" r="58" stroke="currentColor" strokeWidth="8"></circle>
                      <circle className="text-primary transition-all duration-1000" cx="64" cy="64" fill="transparent" r="58" stroke="currentColor" strokeDasharray="364.4" strokeDashoffset="51" strokeWidth="8"></circle>
                    </svg>
                    <span className="absolute font-display-md text-display-md">86</span>
                  </div>
                </div>
                <div className="space-y-md">
                  <div>
                    <h4 className="text-label-sm text-on-surface-variant font-bold uppercase mb-sm">Completed</h4>
                    <ul className="space-y-sm">
                      <li className="flex items-center gap-sm text-body-sm text-on-surface">
                        <Check className="text-[16px] text-tertiary" size={20} />
                        GitHub Connected
                      </li>
                      <li className="flex items-center gap-sm text-body-sm text-on-surface">
                        <Check className="text-[16px] text-tertiary" size={20} />
                        Resume Uploaded
                      </li>
                    </ul>
                  </div>
                  <div className="pt-sm border-t border-outline-variant">
                    <h4 className="text-label-sm text-on-surface-variant font-bold uppercase mb-sm">Suggestions</h4>
                    <ul className="space-y-sm">
                      <li className="flex items-start gap-sm text-body-sm text-on-surface hover:text-primary cursor-pointer group">
                        <Lightbulb className="text-[16px] mt-0.5 text-on-surface-variant group-hover:text-primary" size={20} />
                        Add Project Descriptions
                      </li>
                      <li className="flex items-start gap-sm text-body-sm text-on-surface hover:text-primary cursor-pointer group">
                        <Lightbulb className="text-[16px] mt-0.5 text-on-surface-variant group-hover:text-primary" size={20} />
                        Improve About Section
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>

            {/* Live Preview (3/4 width) */}
            <div className="lg:col-span-3 bg-surface-container-lowest rounded-xl border border-outline-variant shadow-sm overflow-hidden flex flex-col">
              <div className="px-lg py-md border-b border-outline-variant flex items-center justify-between">
                <div className="flex items-center gap-md">
                  <span className="font-headline-md text-headline-md">Live Preview</span>
                  <span className="px-md py-xs bg-tertiary-container/10 text-tertiary font-label-sm rounded-full flex items-center gap-xs">
                    <span className="w-1.5 h-1.5 bg-tertiary rounded-full animate-pulse-soft"></span>
                    Real-Time Changes
                  </span>
                </div>
                <div className="flex items-center gap-sm">
                  <div className="flex bg-surface-container-low p-xs rounded-lg">
                    <button className="p-xs hover:bg-surface-container-lowest rounded transition-colors text-primary">
                      <Monitor size={20} />
                    </button>
                    <button className="p-xs hover:bg-surface-container-lowest rounded transition-colors text-on-surface-variant">
                      <Tablet size={20} />
                    </button>
                    <button className="p-xs hover:bg-surface-container-lowest rounded transition-colors text-on-surface-variant">
                      <Smartphone size={20} />
                    </button>
                  </div>
                  <button className="flex items-center gap-xs px-md py-sm border border-outline-variant rounded-lg text-label-md font-semibold hover:bg-surface-container-low transition-colors">
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M13.5 6H5.25A2.25 2.25 0 003 8.25v10.5A2.25 2.25 0 005.25 21h10.5A2.25 2.25 0 0018 18.75V10.5m-10.5 6L21 3m0 0h-5.25M21 3v5.25" /></svg>
                    Open Full Preview
                  </button>
                </div>
              </div>
              <div className="flex-1 bg-surface-container-low p-lg flex justify-center">
                <div className="w-full h-full min-h-[400px] bg-surface-container-lowest rounded-lg shadow-2xl border border-outline-variant overflow-hidden relative">
                  {/* Portfolio Mockup Content */}
                  <div className="p-xl space-y-lg">
                    <div className="flex justify-between items-center opacity-40">
                      <div className="w-24 h-4 bg-outline-variant rounded"></div>
                      <div className="flex gap-md">
                        <div className="w-12 h-3 bg-outline-variant rounded"></div>
                        <div className="w-12 h-3 bg-outline-variant rounded"></div>
                      </div>
                    </div>
                    <div className="space-y-md py-xl text-center">
                      <div className="w-48 h-8 bg-primary/20 mx-auto rounded-lg"></div>
                      <div className="w-full max-w-md h-4 bg-surface-container-highest mx-auto rounded"></div>
                      <div className="w-3/4 max-w-sm h-4 bg-surface-container-highest mx-auto rounded"></div>
                    </div>
                    <div className="grid grid-cols-3 gap-md opacity-60">
                      <div className="aspect-video bg-surface-container-highest rounded-lg border border-outline-variant"></div>
                      <div className="aspect-video bg-surface-container-highest rounded-lg border border-outline-variant"></div>
                      <div className="aspect-video bg-surface-container-highest rounded-lg border border-outline-variant"></div>
                    </div>
                  </div>
                  {/* Interaction Layer */}
                  <div className="absolute inset-0 bg-primary/5 cursor-crosshair group flex items-center justify-center">
                    <button className="bg-primary text-on-primary px-xl py-md rounded-full shadow-lg opacity-0 group-hover:opacity-100 transition-opacity font-bold scale-90 group-hover:scale-100 duration-300">
                      Enter Visual Editor
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* SECTION 3: PORTFOLIO BUILDER */}
          <section className="space-y-lg">
            <div className="flex items-center justify-between">
              <h2 className="font-headline-lg text-headline-lg">Portfolio Builder</h2>
              <span className="text-body-sm text-on-surface-variant">Manage your data sources</span>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-lg">
              {/* Builder Cards */}
              <div className="bg-surface-container-lowest p-lg rounded-xl border border-outline-variant shadow-sm hover:border-primary transition-all group">
                <div className="flex justify-between items-start mb-md">
                  <UserCircle className="text-primary text-[32px]" size={20} />
                  <span className="px-sm py-xs bg-error-container/20 text-error font-label-sm rounded uppercase">Incomplete</span>
                </div>
                <h4 className="font-headline-md text-headline-md mb-xs">Personal Info</h4>
                <p className="text-body-sm text-on-surface-variant mb-lg">Name, location, and social profiles.</p>
                <div className="flex gap-sm">
                  <button className="flex-1 py-sm bg-surface-container-low text-on-surface font-semibold rounded-lg hover:bg-surface-container-high transition-colors">Edit</button>
                  <button className="p-sm border border-outline-variant rounded-lg text-primary hover:bg-primary-container/10 transition-colors" title="AI Polish">
                    <Sparkles className="text-[20px]" size={20} />
                  </button>
                </div>
              </div>
              <div className="bg-surface-container-lowest p-lg rounded-xl border border-outline-variant shadow-sm hover:border-primary transition-all group">
                <div className="flex justify-between items-start mb-md">
                  <User className="text-primary text-[32px]" size={20} />
                  <span className="px-sm py-xs bg-tertiary-container/20 text-tertiary font-label-sm rounded uppercase">Complete</span>
                </div>
                <h4 className="font-headline-md text-headline-md mb-xs">About Me</h4>
                <p className="text-body-sm text-on-surface-variant mb-lg">Your professional summary and story.</p>
                <div className="flex gap-sm">
                  <button className="flex-1 py-sm bg-surface-container-low text-on-surface font-semibold rounded-lg hover:bg-surface-container-high transition-colors">Edit</button>
                  <button className="p-sm border border-outline-variant rounded-lg text-primary hover:bg-primary-container/10 transition-colors" title="AI Polish">
                    <Sparkles className="text-[20px]" size={20} />
                  </button>
                </div>
              </div>
              <div className="bg-surface-container-lowest p-lg rounded-xl border border-outline-variant shadow-sm hover:border-primary transition-all group">
                <div className="flex justify-between items-start mb-md">
                  <Terminal className="text-primary text-[32px]" size={20} />
                  <span className="px-sm py-xs bg-tertiary-container/20 text-tertiary font-label-sm rounded uppercase">Complete</span>
                </div>
                <h4 className="font-headline-md text-headline-md mb-xs">Skills</h4>
                <p className="text-body-sm text-on-surface-variant mb-lg">Technologies, tools, and expertise.</p>
                <div className="flex gap-sm">
                  <button className="flex-1 py-sm bg-surface-container-low text-on-surface font-semibold rounded-lg hover:bg-surface-container-high transition-colors">Edit</button>
                  <button className="p-sm border border-outline-variant rounded-lg text-primary hover:bg-primary-container/10 transition-colors" title="AI Polish">
                    <Sparkles className="text-[20px]" size={20} />
                  </button>
                </div>
              </div>
              <div className="bg-surface-container-lowest p-lg rounded-xl border border-outline-variant shadow-sm hover:border-primary transition-all group">
                <div className="flex justify-between items-start mb-md">
                  <Briefcase className="text-primary text-[32px]" size={20} />
                  <span className="px-sm py-xs bg-error-container/20 text-error font-label-sm rounded uppercase">Incomplete</span>
                </div>
                <h4 className="font-headline-md text-headline-md mb-xs">Experience</h4>
                <p className="text-body-sm text-on-surface-variant mb-lg">Work history and past roles.</p>
                <div className="flex gap-sm">
                  <button className="flex-1 py-sm bg-surface-container-low text-on-surface font-semibold rounded-lg hover:bg-surface-container-high transition-colors">Edit</button>
                  <button className="p-sm border border-outline-variant rounded-lg text-primary hover:bg-primary-container/10 transition-colors" title="AI Polish">
                    <Sparkles className="text-[20px]" size={20} />
                  </button>
                </div>
              </div>
              {/* Row 2 */}
              <div className="bg-surface-container-lowest p-lg rounded-xl border border-outline-variant shadow-sm hover:border-primary transition-all group">
                <div className="flex justify-between items-start mb-md">
                  <Rocket className="text-primary text-[32px]" size={20} />
                  <span className="px-sm py-xs bg-tertiary-container/20 text-tertiary font-label-sm rounded uppercase">Complete</span>
                </div>
                <h4 className="font-headline-md text-headline-md mb-xs">Projects</h4>
                <p className="text-body-sm text-on-surface-variant mb-lg">Showcase your best work and repos.</p>
                <div className="flex gap-sm">
                  <button className="flex-1 py-sm bg-surface-container-low text-on-surface font-semibold rounded-lg hover:bg-surface-container-high transition-colors">Edit</button>
                  <button className="p-sm border border-outline-variant rounded-lg text-primary hover:bg-primary-container/10 transition-colors" title="AI Polish">
                    <Sparkles className="text-[20px]" size={20} />
                  </button>
                </div>
              </div>
              <div className="bg-surface-container-lowest p-lg rounded-xl border border-outline-variant shadow-sm hover:border-primary transition-all group">
                <div className="flex justify-between items-start mb-md">
                  <GraduationCap className="text-primary text-[32px]" size={20} />
                  <span className="px-sm py-xs bg-error-container/20 text-error font-label-sm rounded uppercase">Incomplete</span>
                </div>
                <h4 className="font-headline-md text-headline-md mb-xs">Education</h4>
                <p className="text-body-sm text-on-surface-variant mb-lg">Academic background and degrees.</p>
                <div className="flex gap-sm">
                  <button className="flex-1 py-sm bg-surface-container-low text-on-surface font-semibold rounded-lg hover:bg-surface-container-high transition-colors">Edit</button>
                  <button className="p-sm border border-outline-variant rounded-lg text-primary hover:bg-primary-container/10 transition-colors" title="AI Polish">
                    <Sparkles className="text-[20px]" size={20} />
                  </button>
                </div>
              </div>
              <div className="bg-surface-container-lowest p-lg rounded-xl border border-outline-variant shadow-sm hover:border-primary transition-all group">
                <div className="flex justify-between items-start mb-md">
                  <ShieldCheck className="text-primary text-[32px]" size={20} />
                  <span className="px-sm py-xs bg-error-container/20 text-error font-label-sm rounded uppercase">Incomplete</span>
                </div>
                <h4 className="font-headline-md text-headline-md mb-xs">Certifications</h4>
                <p className="text-body-sm text-on-surface-variant mb-lg">Professional certificates and awards.</p>
                <div className="flex gap-sm">
                  <button className="flex-1 py-sm bg-surface-container-low text-on-surface font-semibold rounded-lg hover:bg-surface-container-high transition-colors">Edit</button>
                  <button className="p-sm border border-outline-variant rounded-lg text-primary hover:bg-primary-container/10 transition-colors" title="AI Polish">
                    <Sparkles className="text-[20px]" size={20} />
                  </button>
                </div>
              </div>
              <div className="bg-surface-container-lowest p-lg rounded-xl border border-outline-variant shadow-sm hover:border-primary transition-all group">
                <div className="flex justify-between items-start mb-md">
                  <Share2 className="text-primary text-[32px]" size={20} />
                  <span className="px-sm py-xs bg-tertiary-container/20 text-tertiary font-label-sm rounded uppercase">Complete</span>
                </div>
                <h4 className="font-headline-md text-headline-md mb-xs">Social Links</h4>
                <p className="text-body-sm text-on-surface-variant mb-lg">Connect GitHub, LinkedIn, and more.</p>
                <div className="flex gap-sm">
                  <button className="flex-1 py-sm bg-surface-container-low text-on-surface font-semibold rounded-lg hover:bg-surface-container-high transition-colors">Edit</button>
                  <button className="p-sm border border-outline-variant rounded-lg text-primary hover:bg-primary-container/10 transition-colors" title="AI Polish">
                    <Sparkles className="text-[20px]" size={20} />
                  </button>
                </div>
              </div>
            </div>
          </section>

          {/* SECTION 5: GITHUB SYNC CENTER */}
          <section className="grid grid-cols-1 lg:grid-cols-3 gap-lg">
            <div className="lg:col-span-1 bg-surface-container-lowest p-lg rounded-xl border border-outline-variant shadow-sm flex flex-col justify-between">
              <div>
                <div className="flex items-center gap-md mb-lg">
                  <div className="p-sm bg-on-background text-white rounded-lg">
                    <svg className="w-6 h-6 fill-current" viewBox="0 0 24 24"><path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.43.372.823 1.102.823 2.222 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12"></path></svg>
                  </div>
                  <h3 className="font-headline-md text-headline-md">GitHub Sync</h3>
                </div>
                <div className="flex items-center gap-sm mb-lg">
                  <img className="w-10 h-10 rounded-full border border-outline-variant" data-alt="A small circular avatar of a developer named alex-dev, featuring a vibrant, artistic background with high contrast." src="https://lh3.googleusercontent.com/aida-public/AB6AXuAr01NHyhxgz42GLpFVR2pfDHP1_UgWheukaIEuJdjC04FO_Ws8LLSdjtKsZP9rKmKe73sycMoC5MfKYKNqAOf_jxDiqQbVXqzYYfMeWgB0W-BXlInN-q9GQh3QI8IU5yDWHG65BwmxAuUL94mvDBX94NgUGbWVRSOPpiodXGvZM5pVOEolDEs-EA1Z7Ej6fmyHtn35hy-4tTCojtZCU2v-0IeseYU1eKsa4wmqxwJoQ3kotJoUbrcFnWlWl1eoB-qAjN8NxnJUhycO" alt="avatar" />
                  <div>
                    <p className="font-semibold text-on-surface">alex-dev</p>
                    <p className="text-label-sm text-on-surface-variant">Connected</p>
                  </div>
                </div>
                <div className="flex items-center justify-between p-md bg-surface-container-low rounded-lg mb-lg">
                  <span className="font-label-md">Auto-Sync</span>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input defaultChecked className="sr-only peer" type="checkbox" />
                    <div className="w-11 h-6 bg-outline-variant peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
                  </label>
                </div>
              </div>
              <button className="w-full py-md bg-on-background text-white rounded-xl font-semibold flex items-center justify-center gap-sm hover:opacity-90 transition-opacity">
                <RefreshCw size={20} />
                Sync Now
              </button>
            </div>
            <div className="lg:col-span-2 bg-surface-container-lowest p-lg rounded-xl border border-outline-variant shadow-sm">
              <h3 className="font-headline-md text-headline-md mb-lg">Recent Repository Activity</h3>
              <div className="space-y-sm">
                <div className="flex items-center justify-between p-md hover:bg-surface-container-low rounded-lg transition-colors border border-transparent hover:border-outline-variant">
                  <div className="flex items-center gap-md">
                    <div className="w-2 h-2 bg-primary rounded-full"></div>
                    <div>
                      <p className="font-semibold">portfolio-os-core</p>
                      <p className="text-label-sm text-on-surface-variant">Pushed to main • 12m ago</p>
                    </div>
                  </div>
                  <span className="text-label-sm font-mono text-on-surface-variant">#a2f91b</span>
                </div>
                <div className="flex items-center justify-between p-md hover:bg-surface-container-low rounded-lg transition-colors border border-transparent hover:border-outline-variant">
                  <div className="flex items-center gap-md">
                    <div className="w-2 h-2 bg-tertiary rounded-full"></div>
                    <div>
                      <p className="font-semibold">awesome-ui-components</p>
                      <p className="text-label-sm text-on-surface-variant">Created release v1.0.4 • 2h ago</p>
                    </div>
                  </div>
                  <span className="text-label-sm font-mono text-on-surface-variant">#8c2eef</span>
                </div>
                <div className="flex items-center justify-between p-md hover:bg-surface-container-low rounded-lg transition-colors border border-transparent hover:border-outline-variant">
                  <div className="flex items-center gap-md">
                    <div className="w-2 h-2 bg-error rounded-full"></div>
                    <div>
                      <p className="font-semibold">legacy-app-old</p>
                      <p className="text-label-sm text-on-surface-variant">Synced 12 projects • Yesterday</p>
                    </div>
                  </div>
                  <span className="text-label-sm font-mono text-on-surface-variant">#f02d1a</span>
                </div>
              </div>
            </div>
          </section>

          {/* SECTION 6: TEMPLATE MARKETPLACE */}
          <section className="space-y-lg">
            <div className="flex items-center justify-between">
              <h2 className="font-headline-lg text-headline-lg">Template Marketplace</h2>
              <Link href="/dashboard/templates" className="text-primary font-semibold flex items-center gap-xs hover:underline">
                View All
                <ArrowRight className="text-[18px]" size={20} />
              </Link>
            </div>
            <div className="flex overflow-x-auto gap-lg pb-md no-scrollbar snap-x">
              {/* Developer Pro — links to preview */}
              <div className="min-w-[320px] bg-surface-container-lowest rounded-xl border border-outline-variant shadow-sm overflow-hidden snap-start group">
                <Link href="/templates/software-engineer" className="block h-40 relative">
                  <img className="w-full h-full object-cover" src="https://lh3.googleusercontent.com/aida-public/AB6AXuDSLLADsqXlADz4oz1nmlWaooa1bW1LrWhW59n3PPgAsAtloqA1xMz8tQNl32KQadAzYcKrgoXZBQvFpr9YH6xLaRLG9aDLAt7RFJXWb_TOQPbbmfTnfwiUKvH-HA4B9SGps4w9pv67yQmiVfIMmmGjZ6xGuGjiDY-h5oL7Z2Vd8VjsPf1neVyGtMA0lKsVbbEwovenPM7IIgQjhb6k8ywbjAPZPwdb86wXg6Jj74AM0SyOZT_0QhHynhBqlB9HTSBH1LbbizAzCSY6" alt="Developer Pro template" />
                  <div className="absolute inset-0 bg-primary/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                    <span className="bg-surface-container-lowest text-on-surface px-md py-sm rounded-lg font-bold shadow-xl">Preview</span>
                  </div>
                </Link>
                <div className="p-md flex justify-between items-center">
                  <div>
                    <h4 className="font-bold">Developer Pro</h4>
                    <p className="text-label-sm text-on-surface-variant">Dark Mode • IDE Layout</p>
                  </div>
                  <Link href="/templates/software-engineer" className="px-md py-sm bg-primary text-on-primary rounded-lg font-semibold text-label-sm hover:opacity-90">Select</Link>
                </div>
              </div>
              {/* Modern — active */}
              <div className="min-w-[320px] bg-surface-container-lowest rounded-xl border border-outline-variant shadow-sm overflow-hidden snap-start group border-primary ring-2 ring-primary ring-opacity-20">
                <Link href="/templates/modern" className="block h-40 relative">
                  <img className="w-full h-full object-cover" src="https://lh3.googleusercontent.com/aida-public/AB6AXuCb5Ph4hVNHzkKfHfBaxriRVGW6ZENZLbupKHPZOGBuGtOWgX_77MFe1oxNA9g_PvtPO-aHZkjOhehHoVKQC0lDXZPmz1_t_kkRAZHXRUmsMcUV9kGdbbCvjTZBNgKcygrbgq3X7yV3RUquLM1M3oBs5VtNmBgFd_CVwKBm9WOZbLLbSnh7XtvoE7AXmnS6ncf72GsWlAVyvETIO0VRJHzwIXQ06sFm9fE7lEoa9P6RXwENBxMLdEmGDg8XyPH4veOZYghcY7w76nRZ" alt="Modern Clean template" />
                  <div className="absolute inset-0 bg-primary/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                    <span className="bg-surface-container-lowest text-on-surface px-md py-sm rounded-lg font-bold shadow-xl">Preview</span>
                  </div>
                </Link>
                <div className="p-md flex justify-between items-center">
                  <div>
                    <h4 className="font-bold">Modern</h4>
                    <p className="text-label-sm text-on-surface-variant">Light Mode • Minimalist</p>
                  </div>
                  <div className="flex items-center gap-sm">
                    <span className="px-xs py-xs bg-tertiary-container text-on-tertiary-container text-[10px] rounded font-bold uppercase">Active</span>
                    <button className="px-md py-sm bg-surface-container-low text-on-surface-variant rounded-lg font-semibold text-label-sm cursor-default">Selected</button>
                  </div>
                </div>
              </div>
              {/* Creative Edge */}
              <div className="min-w-[320px] bg-surface-container-lowest rounded-xl border border-outline-variant shadow-sm overflow-hidden snap-start group">
                <Link href="/templates/creative-edge" className="block h-40 relative">
                  <img className="w-full h-full object-cover" src="https://lh3.googleusercontent.com/aida-public/AB6AXuDOvfJaZT5MJh6Hy8qm9f1so-_6fBlE4Z3XSz3ZbQkd1pzFc1_5gmmBIj0EAx_9bBIkVOS46P7ZlROMYvlNm-N00A4pCvy7fRw6qC94LMS-au8Ss1Hx51U8Nqdkr4ewIhvAtg732ElXQBd51LHWc6PpiHpK_wvjJVudgSo2424OPApq2coKlzOdRk2VfreRt0Qvr8triaz0fl-C_PSRscpWzfBqg3PrQ8ezwkUvh-l4BIv2oYAfjQx8Oh3JcuJAhKwXO9K6WVzljl18" alt="Creative Edge template" />
                  <div className="absolute inset-0 bg-primary/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                    <span className="bg-surface-container-lowest text-on-surface px-md py-sm rounded-lg font-bold shadow-xl">Preview</span>
                  </div>
                </Link>
                <div className="p-md flex justify-between items-center">
                  <div>
                    <h4 className="font-bold">Creative Edge</h4>
                    <p className="text-label-sm text-on-surface-variant">Dynamic • Gradients</p>
                  </div>
                  <Link href="/templates/creative-edge" className="px-md py-sm bg-primary text-on-primary rounded-lg font-semibold text-label-sm hover:opacity-90">Select</Link>
                </div>
              </div>
            </div>
          </section>

          {/* SECTION 7: ANALYTICS & DEPLOYMENT */}
          <section className="grid grid-cols-1 lg:grid-cols-2 gap-lg pb-xl">
            {/* Mini Charts */}
            <div className="bg-surface-container-lowest p-lg rounded-xl border border-outline-variant shadow-sm">
              <div className="flex items-center justify-between mb-lg">
                <h3 className="font-headline-md text-headline-md">Visitor Analytics</h3>
                <div className="flex gap-sm">
                  <button className="px-sm py-xs bg-surface-container-low rounded text-label-sm font-semibold">7d</button>
                  <button className="px-sm py-xs hover:bg-surface-container-low rounded text-label-sm font-semibold transition-colors">30d</button>
                </div>
              </div>
              <div className="h-48 flex items-end gap-sm px-xs pt-md">
                <div className="flex-1 bg-primary/10 hover:bg-primary/30 rounded-t h-1/4 transition-all" title="Mon"></div>
                <div className="flex-1 bg-primary/10 hover:bg-primary/30 rounded-t h-2/4 transition-all" title="Tue"></div>
                <div className="flex-1 bg-primary/10 hover:bg-primary/30 rounded-t h-1/3 transition-all" title="Wed"></div>
                <div className="flex-1 bg-primary/20 hover:bg-primary/40 rounded-t h-3/4 transition-all" title="Thu"></div>
                <div className="flex-1 bg-primary/30 hover:bg-primary/50 rounded-t h-full transition-all" title="Fri"></div>
                <div className="flex-1 bg-primary/15 hover:bg-primary/35 rounded-t h-1/2 transition-all" title="Sat"></div>
                <div className="flex-1 bg-primary/10 hover:bg-primary/30 rounded-t h-1/4 transition-all" title="Sun"></div>
              </div>
              <div className="flex justify-between mt-sm text-label-sm text-on-surface-variant uppercase px-xs">
                <span>Mon</span><span>Tue</span><span>Wed</span><span>Thu</span><span>Fri</span><span>Sat</span><span>Sun</span>
              </div>
            </div>

            {/* Deployment Status */}
            <div className="bg-surface-container-lowest p-lg rounded-xl border border-outline-variant shadow-sm flex flex-col justify-between">
              <div>
                <h3 className="font-headline-md text-headline-md mb-lg">Deployment Status</h3>
                <div className="flex items-center gap-md p-md bg-surface-container-low rounded-xl">
                  <div className="relative">
                    <div className="w-4 h-4 bg-tertiary rounded-full"></div>
                    <div className="absolute inset-0 w-4 h-4 bg-tertiary rounded-full animate-ping opacity-25"></div>
                  </div>
                  <div>
                    <p className="font-bold text-on-surface">Active & Healthy</p>
                    <p className="text-label-sm text-on-surface-variant">Last deployed: 14 mins ago via GitHub Action</p>
                  </div>
                </div>
              </div>
              <div className="mt-lg">
                <p className="text-label-sm text-on-surface-variant font-bold uppercase mb-xs">Primary Domain</p>
                <div className="flex items-center justify-between gap-md p-md border border-outline-variant rounded-xl group hover:border-primary transition-colors">
                  <div className="flex items-center gap-sm">
                    <Globe className="text-primary" size={20} />
                    <span className="font-mono text-body-md">alex.portfolio-os.com</span>
                  </div>
                  <button className="text-on-surface-variant hover:text-primary transition-colors"><Copy size={20} /></button>
                </div>
              </div>
              <div className="mt-lg flex gap-sm">
                <button className="flex-1 py-md bg-primary text-on-primary rounded-xl font-semibold shadow-sm hover:opacity-90 transition-opacity">Redeploy Now</button>
                <button className="px-md py-md border border-outline-variant rounded-xl text-on-surface font-semibold hover:bg-surface-container-low transition-colors">Domain Settings</button>
              </div>
            </div>
          </section>
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
