'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { ThemeToggle } from '@/components/ThemeToggle';
import { 
  LayoutDashboard, Settings, LayoutTemplate, 
  BarChart3, Download, 
  Search, Bell, ChevronDown, UserCircle, LogOut,
  FileText, Sparkles
} from 'lucide-react';

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const { user, logout } = useAuth();
  const pathname = usePathname();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const navItems = [
    { name: 'Overview', href: '/dashboard', icon: LayoutDashboard },
    { name: 'Templates', href: '/dashboard/templates', icon: LayoutTemplate },


    { name: 'Resume', href: '/dashboard/resume', icon: FileText },
    { name: 'AI Builder', href: '/dashboard/ai-builder', icon: Sparkles },

    { name: 'Analytics', href: '/dashboard/analytics', icon: BarChart3 },
    { name: 'Export', href: '/dashboard/export', icon: Download },
    { name: 'Settings', href: '/dashboard/settings', icon: Settings },
  ];

  return (
    <div className="bg-background text-on-surface font-sans selection:bg-[#111111]/10 select-none">
      {/* Sidebar Shell */}
      <aside className="fixed left-0 top-0 h-full flex flex-col py-6 bg-surface-container-lowest w-64 border-r border-[#111111] z-[60] hidden md:flex">
        <div className="px-6 mb-8">
          <div className="flex items-center gap-2 mb-1">
            <div className="border border-[#111111] w-6 h-6 rounded-sm flex items-center justify-center font-serif text-xs font-semibold">
              S
            </div>
            <span className="font-serif font-semibold text-base tracking-tight">think.design</span>
          </div>
          <p className="font-mono text-[9px] text-[#111111]/45 uppercase tracking-widest">[DASHBOARD / OS]</p>
        </div>

        <nav className="flex-1 px-4 space-y-1.5 mt-4 font-mono text-xs uppercase tracking-wider">
          {navItems.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.name}
                href={item.href}
                className={`flex items-center gap-3 px-4 py-2.5 rounded-xs border transition-all ${isActive
                    ? 'border-[#111111] bg-[#E8E5DF] text-[#111111] font-semibold shadow-sm'
                    : 'border-transparent text-[#111111]/60 hover:bg-[#E8E5DF]/50 hover:text-black font-medium'
                  }`}
              >
                <item.icon size={16} />
                <span>{item.name}</span>
              </Link>
            );
          })}
        </nav>


      </aside>

      {/* Main Wrapper */}
      <div className="md:pl-64 min-h-screen flex flex-col">
        {/* Top Navigation */}
        <header className="flex justify-between items-center w-full h-16 px-8 sticky top-0 z-50 bg-[#F7F4EF]/90 backdrop-blur-xs border-b border-[#111111]">
          <div className="flex items-center gap-6 flex-1">
            {/* Search */}
            <div className="relative w-full max-w-[280px] hidden sm:flex items-center border border-[#111111] rounded-xs bg-[#E8E5DF] px-3 py-1.5">
              <Search className="text-[#111111] mr-2" size={14} />
              <input className="w-full bg-transparent border-none outline-hidden text-xs font-mono text-[#111111] placeholder-[#111111]/45" placeholder="SEARCH OS..." type="text" />
            </div>
          </div>

          <div className="flex items-center gap-4">
            <ThemeToggle />
            
            <button className="p-1.5 text-[#111111] hover:bg-[#E8E5DF] rounded-sm transition-colors relative flex items-center">
              <Bell size={16} />
            </button>

            <div className="h-6 w-px bg-[#111111]/20 mx-1"></div>

            <div className="flex items-center gap-3 relative">
              <span className="hidden sm:inline-flex px-3 py-1 bg-transparent text-[#111111]/70 rounded-xs text-[10px] font-mono uppercase tracking-wider border border-[#111111]/30">
                Draft
              </span>
              <button className="hidden sm:inline-flex px-4 py-1.5 bg-[#111111] text-[#F7F4EF] border border-[#111111] rounded-xs font-mono uppercase tracking-widest text-xs hover:bg-[#111111]/85 transition-colors">
                Publish
              </button>

              <button
                className="flex items-center gap-1.5 hover:bg-[#E8E5DF] p-1 rounded-sm transition-colors focus:outline-none"
                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  className="w-6 h-6 rounded-sm border border-[#111111] object-cover bg-[#E8E5DF]"
                  src={user?.personalInfo?.avatar || "https://api.dicebear.com/7.x/avataaars/svg?seed=fallback"}
                  alt="Profile"
                />
                <ChevronDown size={12} className={`text-[#111111] transition-transform ${isDropdownOpen ? 'rotate-180' : ''}`} />
              </button>

              {/* Profile Dropdown */}
              {isDropdownOpen && (
                <div className="absolute right-0 top-full mt-2 w-48 bg-[#F7F4EF] border border-[#111111] rounded-sm shadow-sm py-2 z-[100] font-mono text-xs uppercase tracking-wider">
                  <div className="px-4 py-2 border-b border-[#111111]/15">
                    <p className="font-bold text-[#111111] truncate">{user?.personalInfo?.name || "Developer"}</p>
                    <p className="text-[10px] text-[#111111]/60 truncate lowercase">{user?.personalInfo?.email}</p>
                  </div>
                  <div className="py-1">
                    <Link href="/dashboard/profile" className="w-full text-left px-4 py-2 text-[#111111] hover:bg-[#E8E5DF] flex items-center gap-2 transition-colors">
                      <UserCircle size={14} />
                      Profile
                    </Link>
                  </div>
                  <div className="py-1 border-t border-[#111111]/15">
                    <button
                      onClick={logout}
                      className="w-full text-left px-4 py-2 text-red-700 hover:bg-red-50 flex items-center gap-2 transition-colors"
                    >
                      <LogOut size={14} />
                      Log out
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </header>

        {/* Main Content Area */}
        <main className="flex-1 w-full bg-background">
          {children}
        </main>
      </div>
    </div>
  );
}
