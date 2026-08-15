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
    <div className="bg-background text-on-surface font-body-md selection:bg-primary-container selection:text-on-primary-container">
      {/* Sidebar Shell */}
      <aside className="fixed left-0 top-0 h-full flex flex-col py-lg bg-surface-container-lowest w-64 border-r border-outline-variant z-[60] hidden md:flex">
        <div className="px-lg mb-xl">
          <h1 className="font-display-md text-display-md font-bold text-primary">PortfolioOS</h1>
          <p className="font-label-sm text-on-surface-variant uppercase tracking-widest mt-xs">Dashboard</p>
        </div>

        <nav className="flex-1 px-md space-y-1 mt-4">
          {navItems.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.name}
                href={item.href}
                className={`flex items-center gap-md px-md py-[10px] rounded-xl transition-all ${isActive
                    ? 'bg-secondary-container text-on-surface-variant font-semibold'
                    : 'text-on-surface-variant hover:bg-surface-container-low font-medium'
                  }`}
              >
                <item.icon size={20} />
                <span className="font-body-md">{item.name}</span>
              </Link>
            );
          })}
        </nav>


      </aside>

      {/* Main Wrapper */}
      <div className="md:pl-64 min-h-screen flex flex-col">
        {/* Top Navigation */}
        <header className="flex justify-between items-center w-full h-16 px-lg sticky top-0 z-50 bg-surface-container-lowest/80 backdrop-blur-md border-b border-outline-variant">
          <div className="flex items-center gap-xl flex-1">
            {/* Vercel style bredcrumbs or search */}
            <div className="relative w-full max-w-sm hidden sm:block">
              <Search className="absolute left-md top-1/2 -translate-y-1/2 text-on-surface-variant" size={16} />
              <input className="w-full bg-surface-container-low border-none rounded-full pl-10 pr-4 py-1.5 text-body-sm focus:ring-1 focus:ring-primary focus:bg-surface-container-lowest transition-all" placeholder="Search..." type="text" />
            </div>
          </div>

          <div className="flex items-center gap-md">
            <ThemeToggle />
            
            <button className="p-sm text-on-surface-variant hover:bg-surface-container-low rounded-full transition-colors relative">
              <Bell size={18} />
            </button>

            <div className="h-6 w-px bg-outline-variant mx-xs"></div>

            <div className="flex items-center gap-sm relative">
              <span className="hidden sm:inline-flex px-3 py-1 bg-surface-container-low text-on-surface-variant rounded-full text-xs font-semibold border border-outline-variant">
                Draft
              </span>
              <button className="hidden sm:inline-flex px-md py-1.5 bg-primary text-on-primary rounded-lg font-semibold text-sm hover:opacity-90 transition-transform active:scale-95">
                Publish
              </button>

              <button
                className="flex items-center gap-2 hover:bg-surface-container-low p-1 rounded-full transition-colors focus:outline-none"
                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  className="w-7 h-7 rounded-full border border-outline-variant object-cover bg-surface-container-low"
                  src={user?.personalInfo?.avatar || "https://api.dicebear.com/7.x/avataaars/svg?seed=fallback"}
                  alt="Profile"
                />
                <ChevronDown size={14} className={`text-on-surface-variant transition-transform ${isDropdownOpen ? 'rotate-180' : ''}`} />
              </button>

              {/* Profile Dropdown */}
              {isDropdownOpen && (
                <div className="absolute right-0 top-full mt-2 w-48 bg-surface-container-lowest border border-outline-variant rounded-xl shadow-lg py-2 z-[100] animate-in fade-in slide-in-from-top-2 duration-200">
                  <div className="px-4 py-2 border-b border-outline-variant">
                    <p className="font-bold text-on-surface truncate text-sm">{user?.personalInfo?.name || "Developer"}</p>
                    <p className="text-xs text-on-surface-variant truncate">{user?.personalInfo?.email}</p>
                  </div>
                  <div className="py-1">
                    <Link href="/dashboard/profile" className="w-full text-left px-4 py-2 text-sm text-on-surface hover:bg-surface-container-low flex items-center gap-2 transition-colors">
                      <UserCircle size={14} />
                      Profile
                    </Link>
                  </div>
                  <div className="py-1 border-t border-outline-variant">
                    <button
                      onClick={logout}
                      className="w-full text-left px-4 py-2 text-sm text-error hover:bg-error-container/20 flex items-center gap-2 transition-colors"
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
