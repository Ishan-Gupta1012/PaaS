'use client';

import React, { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth, StudentProfile, Project, Experience } from '@/context/AuthContext';
import Link from 'next/link';

export default function StudentDashboard() {
  const { user, isLoading, logout, updateProfile, markNotificationRead, clearNotifications } = useAuth();
  const router = useRouter();
  
  // Navigation states
  const [activeTab, setActiveTab] = useState<'portfolio' | 'templates' | 'editor' | 'settings' | 'help'>('portfolio');
  const [showNotifications, setShowNotifications] = useState(false);
  const [showOnboarding, setShowOnboarding] = useState(true);
  const [activeTemplateFilter, setActiveTemplateFilter] = useState<'All' | 'Dark' | 'Minimal' | 'Bold' | 'Creative'>('All');
  
  // Publish flow states
  const [showPublishModal, setShowPublishModal] = useState(false);
  const [isPublishing, setIsPublishing] = useState(false);
  const [publishSuccess, setPublishSuccess] = useState(false);
  
  // AI Polish states
  const [aiPolishState, setAiPolishState] = useState<'idle' | 'loading' | 'diff' | 'error'>('idle');
  const [originalBio, setOriginalBio] = useState('');
  const [polishedBio, setPolishedBio] = useState('');
  
  // Editor temporary states
  const [newSkill, setNewSkill] = useState('');
  const [editorSaveState, setEditorSaveState] = useState<'saved' | 'saving' | 'dirty'>('saved');
  const autoSaveTimerRef = useRef<NodeJS.Timeout | null>(null);

  // Sparkline stats cache
  const [viewsSparkline] = useState(() => 
    Array.from({ length: 12 }).map(() => Math.floor(Math.random() * 40) + 10)
  );

  // Route Guard
  useEffect(() => {
    if (!isLoading && !user) {
      router.push('/signin');
    }
  }, [user, isLoading, router]);

  // Simulate auto-save when user editing
  const markDirty = () => {
    setEditorSaveState('dirty');
    if (autoSaveTimerRef.current) clearTimeout(autoSaveTimerRef.current);
    autoSaveTimerRef.current = setTimeout(() => {
      setEditorSaveState('saving');
      setTimeout(() => {
        setEditorSaveState('saved');
      }, 800);
    }, 2000);
  };

  useEffect(() => {
    return () => {
      if (autoSaveTimerRef.current) clearTimeout(autoSaveTimerRef.current);
    };
  }, []);

  if (isLoading || !user) {
    return (
      <div className="min-h-screen bg-neutral-50 flex flex-col items-center justify-center">
        <div className="w-10 h-10 border-4 border-brand-600/20 border-t-brand-600 rounded-full animate-spin mb-4" />
        <p className="text-neutral-500 font-medium text-sm">Loading PortfolioAI Student Workspace...</p>
      </div>
    );
  }

  // Count unread notifications
  const unreadCount = user.notifications.filter(n => n.unread).length;

  // Profiles and custom templates presets list
  const templatesList = [
    { id: 'obsidian', name: 'Obsidian', tags: ['Dark', 'Cinematic', 'Free'], type: 'Dark', desc: 'A dark, terminal-inspired canvas with vivid purple accents and smooth glows.', isPro: false },
    { id: 'blueprint', name: 'Blueprint', tags: ['Professional', 'Light', 'Free'], type: 'Minimal', desc: 'A clean corporate layout with blue structural lines, ideal for case studies.', isPro: true },
    { id: 'neon', name: 'Neon Craft', tags: ['Creative', 'Dark', 'Free'], type: 'Creative', desc: 'A striking true-black template with bright lime gradients and asymmetrical headers.', isPro: false },
    { id: 'minimal', name: 'Minimal Arc', tags: ['Minimal', 'Light', 'Free'], type: 'Minimal', desc: 'Warm off-white background with playfair serif typography, focusing purely on work.', isPro: false }
  ];

  // Accent presets
  const accentPresets = [
    { name: 'Obsidian Purple', hex: '#7C3AED' },
    { name: 'Blueprint Blue', hex: '#3B82F6' },
    { name: 'Neon Lime', hex: '#39FF14' },
    { name: 'Swiss Black', hex: '#1A1A1A' },
    { name: 'Hot Pink', hex: '#FF2D78' },
    { name: 'Electric Cyan', hex: '#00D4FF' }
  ];

  const fontPresets = [
    'Inter + JetBrains Mono',
    'Space Grotesk + JetBrains Mono',
    'Playfair Display + Inter',
    'Inter + Inter'
  ];

  const avatarOptions = [
    'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=150&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&auto=format&fit=crop&q=80'
  ];

  // Helper updater
  const handleUpdate = (updater: (draft: StudentProfile) => void) => {
    const draft = JSON.parse(JSON.stringify(user)) as StudentProfile;
    updater(draft);
    updateProfile(draft);
    markDirty();
  };

  // AI Polish simulation
  const handleAiPolish = () => {
    if (!user.bio) return;
    setOriginalBio(user.bio);
    setAiPolishState('loading');
    setTimeout(() => {
      // Create a polished version
      const improved = `As an ambitious ${user.personalInfo.title || 'developer'}, I specialize in building highly scalable, optimized systems and creating intuitive user interfaces. Currently located in ${user.personalInfo.location || 'USA'}, I combine my technical skills in ${user.skills.slice(0, 3).join(', ') || 'programming'} with agile problem-solving to deliver production-ready software components.`;
      setPolishedBio(improved);
      setAiPolishState('diff');
    }, 1500);
  };

  const acceptAiPolish = () => {
    handleUpdate(draft => {
      draft.bio = polishedBio;
      draft.aiCreditsUsed = Math.min(50, draft.aiCreditsUsed + 1);
    });
    setAiPolishState('idle');
  };

  const revertAiPolish = () => {
    handleUpdate(draft => {
      draft.bio = originalBio;
    });
    setAiPolishState('idle');
  };

  // Tag Input add/remove
  const handleAddSkill = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newSkill.trim() || user.skills.includes(newSkill.trim())) return;
    handleUpdate(draft => {
      draft.skills.push(newSkill.trim());
    });
    setNewSkill('');
  };

  const handleRemoveSkill = (skillToRemove: string) => {
    handleUpdate(draft => {
      draft.skills = draft.skills.filter(s => s !== skillToRemove);
    });
  };

  // Project List add/remove/edit
  const handleProjectChange = (index: number, field: keyof Project, val: string | string[]) => {
    handleUpdate(draft => {
      if (draft.projects[index]) {
        if (field === 'tags') {
          draft.projects[index].tags = (val as string).split(',').map(s => s.trim());
        } else {
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          (draft.projects[index] as any)[field] = val;
        }
      }
    });
  };

  const addProject = () => {
    handleUpdate(draft => {
      draft.projects.push({
        name: 'New Project',
        description: 'Describe the problem you solved.',
        tags: ['React', 'CSS'],
        githubUrl: '',
        liveUrl: '',
        category: 'Minimal',
        outcome: 'Completed implementation.'
      });
    });
  };

  const removeProject = (index: number) => {
    handleUpdate(draft => {
      draft.projects = draft.projects.filter((_, i) => i !== index);
    });
  };

  // Experience list add/remove/edit
  const handleExperienceChange = (index: number, field: keyof Experience, val: string | string[]) => {
    handleUpdate(draft => {
      if (draft.experience[index]) {
        if (field === 'achievements') {
          draft.experience[index].achievements = (val as string).split('\n').filter(s => s.trim() !== '');
        } else {
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          (draft.experience[index] as any)[field] = val;
        }
      }
    });
  };

  const addExperience = () => {
    handleUpdate(draft => {
      draft.experience.push({
        company: 'New Company',
        role: 'Intern',
        startDate: 'June 2026',
        endDate: 'Present',
        achievements: ['Contributed to product delivery.']
      });
    });
  };

  const removeExperience = (index: number) => {
    handleUpdate(draft => {
      draft.experience = draft.experience.filter((_, i) => i !== index);
    });
  };

  // Custom Confetti Canvas drawing
  const launchConfetti = () => {
    const canvas = document.getElementById('confetti-canvas') as HTMLCanvasElement;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    const colors = ['#4F46E5', '#10B981', '#F59E0B', '#EF4444', '#00D4FF', '#FF2D78'];
    const particles = Array.from({ length: 150 }).map(() => ({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height - canvas.height,
      r: Math.random() * 5 + 3,
      d: Math.random() * canvas.height,
      color: colors[Math.floor(Math.random() * colors.length)],
      tilt: Math.random() * 10 - 5,
      tiltAngleIncremental: Math.random() * 0.07 + 0.02,
      tiltAngle: 0
    }));

    let animationFrameId: ReturnType<typeof requestAnimationFrame>;
    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      particles.forEach((p, idx) => {
        p.tiltAngle += p.tiltAngleIncremental;
        p.y += (Math.cos(p.d) + 3 + p.r / 2) / 2;
        p.x += Math.sin(p.tiltAngle);
        p.tilt = Math.sin(p.tiltAngle - idx / 3) * 15;

        ctx.beginPath();
        ctx.lineWidth = p.r;
        ctx.strokeStyle = p.color;
        ctx.moveTo(p.x + p.tilt + p.r / 2, p.y);
        ctx.lineTo(p.x + p.tilt, p.y + p.tilt + p.r / 2);
        ctx.stroke();
      });

      const active = particles.some(p => p.y < canvas.height);
      if (active) {
        animationFrameId = requestAnimationFrame(draw);
        void animationFrameId;
      } else {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
      }
    };
    draw();
  };

  const publishPortfolio = () => {
    setIsPublishing(true);
    setTimeout(() => {
      setIsPublishing(false);
      setPublishSuccess(true);
      setShowPublishModal(false);
      handleUpdate(draft => {
        draft.status = 'Published';
        draft.lastUpdated = 'Just now';
      });
      setTimeout(() => {
        launchConfetti();
      }, 200);
      setTimeout(() => setPublishSuccess(false), 5000);
    }, 2000);
  };

  return (
    <div className="min-h-screen bg-neutral-50 text-neutral-700 font-sans flex flex-col antialiased">
      {/* Confetti overlay canvas */}
      <canvas id="confetti-canvas" className="fixed inset-0 pointer-events-none z-50 w-full h-full" />

      {/* Global Wrapper */}
      <div className="flex-1 flex flex-col lg:flex-row min-h-screen">

        {/* Persistent Left Sidebar - Desktop */}
        <aside className="w-full lg:w-[240px] bg-white border-b lg:border-b-0 lg:border-r border-neutral-200 shrink-0 flex flex-col justify-between">
          <div>
            {/* Logo Area */}
            <div className="h-16 flex items-center gap-2.5 px-6 border-b border-neutral-200">
              <div className="w-8 h-8 rounded-lg bg-brand-600 flex items-center justify-center text-white font-extrabold text-lg">P</div>
              <span className="font-extrabold text-lg text-neutral-900 tracking-tight">PortfolioAI</span>
            </div>

            {/* Nav items */}
            <nav className="p-4 space-y-1">
              <button
                onClick={() => setActiveTab('portfolio')}
                className={`w-full h-11 px-3.5 rounded-lg flex items-center gap-3 text-sm font-semibold transition-all cursor-pointer ${
                  activeTab === 'portfolio'
                    ? 'bg-brand-100 text-brand-600'
                    : 'text-neutral-500 hover:text-neutral-900 hover:bg-brand-100/50'
                }`}
              >
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" /></svg>
                My Portfolio
              </button>

              <button
                onClick={() => setActiveTab('templates')}
                className={`w-full h-11 px-3.5 rounded-lg flex items-center gap-3 text-sm font-semibold transition-all cursor-pointer ${
                  activeTab === 'templates'
                    ? 'bg-brand-100 text-brand-600'
                    : 'text-neutral-500 hover:text-neutral-900 hover:bg-brand-100/50'
                }`}
              >
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M4 5a1 1 0 011-1h14a1 1 0 011 1v2a1 1 0 01-1 1H5a1 1 0 01-1-1V5zm0 8a1 1 0 011-1h14a1 1 0 011 1v2a1 1 0 01-1 1H5a1 1 0 01-1-1v-2zm0 8a1 1 0 011-1h14a1 1 0 011 1v2a1 1 0 01-1 1H5a1 1 0 01-1-1v-2z" /></svg>
                Templates
              </button>

              <button
                onClick={() => setActiveTab('editor')}
                className={`w-full h-11 px-3.5 rounded-lg flex items-center gap-3 text-sm font-semibold transition-all cursor-pointer ${
                  activeTab === 'editor'
                    ? 'bg-brand-100 text-brand-600'
                    : 'text-neutral-500 hover:text-neutral-900 hover:bg-brand-100/50'
                }`}
              >
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" /></svg>
                AI Editor
              </button>

              <button
                onClick={() => setActiveTab('settings')}
                className={`w-full h-11 px-3.5 rounded-lg flex items-center gap-3 text-sm font-semibold transition-all cursor-pointer ${
                  activeTab === 'settings'
                    ? 'bg-brand-100 text-brand-600'
                    : 'text-neutral-500 hover:text-neutral-900 hover:bg-brand-100/50'
                }`}
              >
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" /><circle cx="12" cy="12" r="3" /></svg>
                Settings
              </button>

              <button
                onClick={() => setActiveTab('help')}
                className={`w-full h-11 px-3.5 rounded-lg flex items-center gap-3 text-sm font-semibold transition-all cursor-pointer ${
                  activeTab === 'help'
                    ? 'bg-brand-100 text-brand-600'
                    : 'text-neutral-500 hover:text-neutral-900 hover:bg-brand-100/50'
                }`}
              >
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M18.364 5.636l-3.536 3.536m0 5.656l3.536 3.536M9.172 9.172L5.636 5.636m3.536 9.192l-3.536 3.536M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-5 0a4 4 0 11-8 0 4 4 0 018 0z" /></svg>
                Help & Docs
              </button>
            </nav>
          </div>

          {/* User Card - Bottom */}
          <div className="p-4 border-t border-neutral-200">
            <div className="flex items-center gap-3 mb-3">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={user.personalInfo.avatar}
                alt={user.personalInfo.name}
                className="w-8 h-8 rounded-full border border-brand-600/20 object-cover"
              />
              <div className="text-left shrink-0 max-w-[120px]">
                <p className="text-xs font-bold text-neutral-900 truncate">{user.personalInfo.name}</p>
                <span className="text-[9px] bg-brand-100 text-brand-600 font-bold px-1.5 py-0.5 rounded-full uppercase tracking-wider">
                  Free Student
                </span>
              </div>
            </div>
            <button
              onClick={logout}
              className="w-full py-1.5 border border-neutral-200 hover:border-neutral-300 text-neutral-500 hover:text-neutral-900 text-xs font-semibold rounded transition-colors cursor-pointer"
            >
              Sign Out
            </button>
          </div>
        </aside>

        {/* Main Work Area */}
        <div className="flex-1 flex flex-col bg-white">
          
          {/* Top Bar */}
          <header className="h-16 bg-white border-b border-neutral-200 px-6 flex items-center justify-between z-30 shrink-0">
            <div>
              <h1 className="text-xl font-bold text-neutral-900 flex items-center gap-2">
                {activeTab === 'portfolio' && 'My Portfolio'}
                {activeTab === 'templates' && 'Choose Your Template'}
                {activeTab === 'editor' && 'AI Portfolio Editor'}
                {activeTab === 'settings' && 'Settings'}
                {activeTab === 'help' && 'Help & Documentation'}
              </h1>
              <div className="text-[10px] text-neutral-400 font-semibold tracking-wider uppercase mt-0.5">
                Dashboard &gt; {activeTab}
              </div>
            </div>

            {/* Right section widgets */}
            <div className="flex items-center gap-4">
              {/* AI usage meter */}
              <div className="hidden sm:flex items-center gap-2.5 bg-neutral-50 border border-neutral-200 px-3 py-1.5 rounded-full text-xs text-neutral-500 font-medium">
                <span>{user.aiCreditsUsed} / 50 AI credits</span>
                <div className="w-16 bg-neutral-200 h-1.5 rounded-full overflow-hidden">
                  <div className="bg-brand-600 h-full" style={{ width: `${(user.aiCreditsUsed/50)*100}%` }} />
                </div>
              </div>

              {/* Notification bell */}
              <div className="relative">
                <button
                  onClick={() => setShowNotifications(!showNotifications)}
                  className="w-9 h-9 border border-neutral-200 hover:border-neutral-300 rounded-lg flex items-center justify-center text-neutral-500 hover:text-neutral-950 transition-all cursor-pointer relative"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9"/><path d="M10.3 21a1.94 1.94 0 0 0 3.4 0"/></svg>
                  {unreadCount > 0 && (
                    <span className="absolute -top-1 -right-1 w-4 h-4 bg-danger-500 text-[9px] font-bold text-white rounded-full flex items-center justify-center border border-white">
                      {unreadCount}
                    </span>
                  )}
                </button>

                {/* Notifications drawer */}
                {showNotifications && (
                  <div className="absolute right-0 mt-2.5 w-80 bg-white border border-neutral-200 rounded-xl shadow-xl p-4 z-50 text-sm">
                    <div className="flex justify-between items-center mb-3 pb-2 border-b border-neutral-100">
                      <h4 className="font-bold text-neutral-900">Notifications</h4>
                      {unreadCount > 0 && (
                        <button
                          onClick={clearNotifications}
                          className="text-xs text-brand-600 hover:underline font-semibold"
                        >
                          Clear all
                        </button>
                      )}
                    </div>
                    <div className="space-y-3.5 max-h-60 overflow-y-auto pr-1">
                      {user.notifications.map((n) => (
                        <div
                          key={n.id}
                          onClick={() => markNotificationRead(n.id)}
                          className={`p-2.5 rounded-lg border text-left cursor-pointer transition-colors ${
                            n.unread
                              ? 'bg-brand-100/30 border-brand-600/10'
                              : 'bg-neutral-50 border-neutral-100 text-neutral-400'
                          }`}
                        >
                          <div className="flex justify-between text-xs font-bold text-neutral-800">
                            <span>{n.title}</span>
                            <span className="text-[9px] text-neutral-400 font-normal shrink-0">{n.time}</span>
                          </div>
                          <p className="text-xs mt-1 text-neutral-500">{n.description}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Avatar indicator */}
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={user.personalInfo.avatar}
                alt={user.personalInfo.name}
                className="w-8 h-8 rounded-full border border-neutral-200 object-cover"
              />
            </div>
          </header>

          {/* Sub-panels container */}
          <div className="flex-1 overflow-y-auto p-6 sm:p-8">

            {/* TAB: MY PORTFOLIO */}
            {activeTab === 'portfolio' && (
              <div className="space-y-8 max-w-5xl animate-fade-in">

                {/* Onboarding checklist banner */}
                {showOnboarding && (
                  <div className="bg-brand-600 rounded-xl p-6 text-white relative overflow-hidden shadow-sm">
                    <button
                      onClick={() => setShowOnboarding(false)}
                      className="absolute top-4 right-4 text-white/70 hover:text-white cursor-pointer"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="18" x2="6" y1="6" y2="18"/><line x1="6" x2="18" y1="6" y2="18"/></svg>
                    </button>
                    <div className="max-w-2xl relative z-10">
                      <h3 className="text-xl font-bold">Build your portfolio in 3 steps</h3>
                      
                      {/* Onboarding steps inline row */}
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 my-6">
                        <div className="flex items-center gap-3">
                          <span className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center font-bold text-sm shrink-0">1</span>
                          <span className="text-sm font-semibold">Fill profile details</span>
                        </div>
                        <div className="flex items-center gap-3">
                          <span className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center font-bold text-sm shrink-0">2</span>
                          <span className="text-sm font-semibold">Pick design template</span>
                        </div>
                        <div className="flex items-center gap-3">
                          <span className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center font-bold text-sm shrink-0">3</span>
                          <span className="text-sm font-semibold">Publish live subdomain</span>
                        </div>
                      </div>

                      <button
                        onClick={() => setActiveTab('editor')}
                        className="h-11 px-6 bg-white hover:bg-neutral-50 text-brand-600 font-bold rounded-lg text-sm transition-all cursor-pointer"
                      >
                        Start Building
                      </button>
                    </div>
                  </div>
                )}

                {/* Publish success banner */}
                {publishSuccess && (
                  <div className="p-4 bg-success-500/10 border border-success-500/20 text-success-500 rounded-xl text-xs font-semibold flex items-center gap-3 shadow-sm animate-fade-in">
                    <svg className="w-5 h-5 text-success-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                    <div>
                      Your developer portfolio card is updated and live at: 
                      <a href={`https://${user.username}.portfolioai.dev`} target="_blank" className="underline font-bold ml-1 hover:text-success-600 transition-colors">
                        {user.username}.portfolioai.dev
                      </a>
                    </div>
                  </div>
                )}

                {/* Portfolio Status Card */}
                <div className="bg-white border border-neutral-200 rounded-xl p-6 flex flex-col md:flex-row justify-between items-start md:items-center gap-6 shadow-sm">
                  <div className="space-y-2">
                    <div className="flex items-center gap-3">
                      <span className="text-xs text-neutral-400 font-bold uppercase tracking-wider">Status:</span>
                      <span className={`px-3 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wide ${
                        user.status === 'Published'
                          ? 'bg-success-500/10 text-success-500'
                          : user.status === 'Draft'
                          ? 'bg-warning-400/10 text-warning-400'
                          : 'bg-neutral-200 text-neutral-500'
                      }`}>
                        {user.status}
                      </span>
                    </div>

                    <h2 className="text-lg font-bold text-neutral-900 font-mono">
                      https://{user.username}.portfolioai.dev
                    </h2>

                    <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-neutral-400">
                      <span>Last updated: <strong>{user.lastUpdated}</strong></span>
                      <span className="w-1.5 h-1.5 rounded-full bg-neutral-300" />
                      <span>Views: <strong>{user.sectionViews} hits</strong></span>
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-3">
                    <button
                      onClick={() => setActiveTab('editor')}
                      className="h-10 px-5 bg-brand-600 hover:bg-brand-600/90 text-white font-bold rounded-lg text-xs transition-colors cursor-pointer"
                    >
                      Edit Portfolio
                    </button>
                    
                    <button
                      onClick={() => {
                        alert(`Opening live mockup at https://${user.username}.portfolioai.dev`);
                      }}
                      className="h-10 px-5 border border-neutral-200 hover:border-neutral-300 text-neutral-700 font-bold rounded-lg text-xs transition-colors cursor-pointer"
                    >
                      Preview Link
                    </button>

                    <button
                      onClick={() => {
                        navigator.clipboard.writeText(`https://${user.username}.portfolioai.dev`);
                        alert('Portfolio URL copied to clipboard!');
                      }}
                      title="Copy URL"
                      className="h-10 w-10 border border-neutral-200 hover:border-neutral-300 rounded-lg flex items-center justify-center text-neutral-500 hover:text-neutral-900 transition-colors cursor-pointer"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><rect width="14" height="14" x="8" y="8" rx="2" ry="2"/><path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2"/></svg>
                    </button>
                  </div>
                </div>

                {/* Stats Row (3 cards) */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  
                  {/* Views Card */}
                  <div className="bg-white border border-neutral-200 p-6 rounded-xl shadow-sm space-y-4">
                    <div className="flex justify-between items-center text-xs font-bold text-neutral-400 uppercase tracking-wider">
                      <span>Profile Views</span>
                      <span className="bg-success-500/10 text-success-500 px-2 py-0.5 rounded text-[9px] tracking-wide">
                        &uarr; 12% this week
                      </span>
                    </div>
                    <div className="flex items-baseline gap-2">
                      <span className="text-3xl font-extrabold text-neutral-900">{user.sectionViews}</span>
                      <span className="text-xs text-neutral-500 font-medium">total visitors</span>
                    </div>
                    {/* Sparkline chart visualization */}
                    <div className="w-full h-12 flex items-end gap-1 pt-2">
                      {viewsSparkline.map((val, i) => (
                        <div
                          key={i}
                          className="flex-1 bg-brand-100 hover:bg-brand-600 transition-colors rounded-t"
                          style={{ height: `${(val / 50) * 100}%` }}
                          title={`${val} views`}
                        />
                      ))}
                    </div>
                  </div>

                  {/* Completion Card */}
                  <div className="bg-white border border-neutral-200 p-6 rounded-xl shadow-sm space-y-4">
                    <div className="flex justify-between items-center text-xs font-bold text-neutral-400 uppercase tracking-wider">
                      <span>Completion Score</span>
                      <span className="text-brand-600 text-[10px] font-bold">Progress</span>
                    </div>
                    <div className="flex items-center gap-4">
                      {/* Circular Progress Ring */}
                      <div className="relative w-16 h-16 flex items-center justify-center shrink-0">
                        <svg className="w-full h-full transform -rotate-90" viewBox="0 0 36 36">
                          <path className="text-neutral-100" strokeWidth="3" stroke="currentColor" fill="none" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" />
                          <path className="text-brand-600" strokeWidth="3" strokeDasharray="85, 100" strokeLinecap="round" stroke="currentColor" fill="none" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" />
                        </svg>
                        <span className="absolute text-sm font-extrabold text-neutral-900">85%</span>
                      </div>
                      <div>
                        <h4 className="text-xs font-bold text-neutral-800">Almost complete!</h4>
                        <p className="text-[10px] text-neutral-500 mt-1 leading-normal">
                          Add your education details to reach 100% and unlock job filters.
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* AI Credits Card */}
                  <div className="bg-white border border-neutral-200 p-6 rounded-xl shadow-sm space-y-4">
                    <div className="flex justify-between items-center text-xs font-bold text-neutral-400 uppercase tracking-wider">
                      <span>AI Engine Credits</span>
                      <span className="text-amber-500 text-[10px] font-bold uppercase tracking-wider">Quota</span>
                    </div>
                    <div className="space-y-2">
                      <div className="flex justify-between items-baseline">
                        <h4 className="text-2xl font-extrabold text-neutral-900">{50 - user.aiCreditsUsed}</h4>
                        <span className="text-xs text-neutral-400">credits left of 50</span>
                      </div>
                      <div className="w-full bg-neutral-100 h-2 rounded-full overflow-hidden">
                        <div className="bg-brand-600 h-full rounded-full" style={{ width: `${(user.aiCreditsUsed/50)*100}%` }} />
                      </div>
                    </div>
                    <div className="pt-1.5 flex justify-between items-center text-[11px]">
                      <span className="text-neutral-400">Resets monthly</span>
                      <Link href="#pro" className="text-brand-600 hover:text-brand-600/90 font-bold transition-all">
                        Upgrade for unlimited &rarr;
                      </Link>
                    </div>
                  </div>

                </div>
              </div>
            )}

            {/* TAB: TEMPLATES */}
            {activeTab === 'templates' && (
              <div className="space-y-7 animate-fade-in">

                {/* Page Header */}
                <div>
                  <h2 className="text-2xl font-extrabold text-neutral-900 tracking-tight">Choose your template</h2>
                  <p className="text-neutral-500 text-sm mt-1">Pick a design that reflects your style. You can switch anytime.</p>
                </div>

                {/* Filter bar */}
                <div className="flex flex-wrap gap-2">
                  {(['All', 'Dark', 'Light', 'Minimal', 'Creative'] as const).map((type) => (
                    <button
                      key={type}
                      onClick={() => setActiveTemplateFilter(type === 'Light' ? 'Minimal' : type as 'All' | 'Dark' | 'Minimal' | 'Bold' | 'Creative')}
                      className={`px-5 py-2 rounded-lg text-sm font-semibold cursor-pointer border-2 transition-all ${
                        (type === 'Light' && activeTemplateFilter === 'Minimal') || activeTemplateFilter === type
                          ? 'bg-neutral-900 text-white border-neutral-900'
                          : 'bg-white border-neutral-200 text-neutral-600 hover:border-neutral-400 hover:text-neutral-900'
                      }`}
                    >
                      {type}
                    </button>
                  ))}
                </div>

                {/* Templates Grid — 2 cols */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {templatesList
                    .filter(t => activeTemplateFilter === 'All' || t.type === activeTemplateFilter || (activeTemplateFilter === 'Bold' && t.id === 'neon'))
                    .map((tpl) => {
                      const isSelected = user.themeSettings.templateName === tpl.id;
                      const initials = user.personalInfo.name.split(' ').map((w: string) => w[0]).join('').slice(0, 2).toUpperCase();
                      const firstName = user.personalInfo.name.split(' ')[0];
                      const lastName = user.personalInfo.name.split(' ').slice(1).join(' ');

                      return (
                        <div
                          key={tpl.id}
                          className={`rounded-2xl overflow-hidden border-2 transition-all duration-300 cursor-pointer group ${
                            isSelected
                              ? 'border-brand-600 shadow-[0_0_0_4px_rgba(79,70,229,0.15)]'
                              : 'border-neutral-200 hover:border-neutral-400 hover:shadow-lg'
                          }`}
                          onClick={() => {
                            if (!tpl.isPro) {
                              handleUpdate(draft => { draft.themeSettings.templateName = tpl.id as 'obsidian' | 'blueprint' | 'neon' | 'minimal'; });
                            }
                          }}
                        >
                          {/* Miniature Preview — varies by template */}
                          <div className="relative overflow-hidden h-[280px] select-none">
                            {/* PRO badge */}
                            {tpl.isPro && (
                              <div className="absolute top-3 right-3 z-20 bg-amber-400 text-neutral-900 text-[10px] font-extrabold px-2.5 py-0.5 rounded-full uppercase tracking-wider">
                                Pro
                              </div>
                            )}
                            {/* ACTIVE checkmark */}
                            {isSelected && (
                              <div className="absolute top-3 left-3 z-20 w-6 h-6 rounded-full bg-brand-600 text-white flex items-center justify-center shadow">
                                <svg xmlns="http://www.w3.org/2000/svg" width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
                              </div>
                            )}

                            {/* ===== OBSIDIAN PREVIEW ===== */}
                            {tpl.id === 'obsidian' && (
                              <div className="w-full h-full bg-[#0D0B1E] p-4 flex flex-col gap-4 font-mono text-white">
                                {/* Nav */}
                                <div className="flex justify-between items-center text-[10px]">
                                  <span className="text-violet-400 font-bold tracking-wider">&lt;{initials}/&gt;</span>
                                  <div className="flex gap-3 text-neutral-400">
                                    <span>About</span><span>Projects</span><span>Contact</span>
                                    <span className="bg-violet-600 text-white px-2 py-0.5 rounded text-[9px] font-bold">Hire Me</span>
                                  </div>
                                </div>
                                {/* Hero */}
                                <div className="flex flex-col items-center gap-2 pt-2">
                                  <div className="w-12 h-12 rounded-full bg-gradient-to-br from-violet-600 to-violet-900 border-2 border-violet-500 flex items-center justify-center text-white text-sm font-bold">{initials}</div>
                                  <div className="text-center">
                                    <div className="text-white font-bold text-sm">{user.personalInfo.name}</div>
                                    <div className="text-violet-400 text-[10px] mt-0.5">{user.personalInfo.title || 'Software Engineer'}_</div>
                                  </div>
                                  <div className="flex gap-2 mt-1">
                                    <span className="bg-violet-600/30 border border-violet-600/40 text-violet-300 text-[9px] px-2 py-0.5 rounded font-bold">View Projects</span>
                                    <span className="border border-neutral-600 text-neutral-400 text-[9px] px-2 py-0.5 rounded">GitHub</span>
                                  </div>
                                </div>
                                {/* Stats bar */}
                                <div className="flex justify-around border-t border-neutral-700 pt-3 text-center">
                                  <div><div className="text-violet-400 font-extrabold text-sm">{user.projects.length}+</div><div className="text-neutral-500 text-[9px]">Projects</div></div>
                                  <div><div className="text-violet-400 font-extrabold text-sm">{user.experience.length}yr</div><div className="text-neutral-500 text-[9px]">Experience</div></div>
                                  <div><div className="text-violet-400 font-extrabold text-sm">{user.skills.length}k+</div><div className="text-neutral-500 text-[9px]">Commits</div></div>
                                </div>
                              </div>
                            )}

                            {/* ===== BLUEPRINT PREVIEW ===== */}
                            {tpl.id === 'blueprint' && (
                              <div className="w-full h-full bg-white p-4 flex flex-col gap-3 font-sans text-slate-900">
                                {/* Nav */}
                                <div className="flex justify-between items-center border-b border-slate-200 pb-2">
                                  <span className="font-extrabold text-sm tracking-widest text-slate-900">{firstName[0]}.{lastName.toUpperCase()}</span>
                                  <div className="flex gap-3 text-[10px] text-slate-500 items-center">
                                    <span>Work</span><span>About</span><span>Skills</span>
                                    <span className="border border-slate-700 text-slate-700 px-2 py-0.5 rounded text-[9px] font-bold">Download CV</span>
                                  </div>
                                </div>
                                {/* Hero */}
                                <div className="flex gap-3 items-start pt-1">
                                  <div className="flex-1">
                                    <div className="flex items-center gap-1.5 mb-1">
                                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 inline-block" />
                                      <span className="text-emerald-600 text-[9px] font-semibold">Open to work</span>
                                    </div>
                                    <div className="font-extrabold text-base text-slate-900">{user.personalInfo.name}</div>
                                    <div className="text-[10px] text-slate-500 mt-0.5">{user.personalInfo.title || 'Full Stack Engineer'} · {user.experience.length} yr exp</div>
                                    <div className="flex gap-1.5 mt-2">
                                      <span className="border border-slate-800 text-slate-800 text-[9px] px-2 py-0.5 rounded font-bold">View Work</span>
                                      <span className="border border-slate-300 text-slate-500 text-[9px] px-2 py-0.5 rounded">LinkedIn</span>
                                    </div>
                                  </div>
                                  <div className="w-14 h-14 rounded border-2 border-slate-200 bg-slate-50 flex items-center justify-center text-slate-300">
                                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" viewBox="0 0 24 24"><path d="M12 12c2.7 0 4.8-2.1 4.8-4.8S14.7 2.4 12 2.4 7.2 4.5 7.2 7.2 9.3 12 12 12zm0 2.4c-3.2 0-9.6 1.6-9.6 4.8v2.4h19.2v-2.4c0-3.2-6.4-4.8-9.6-4.8z"/></svg>
                                  </div>
                                </div>
                                {/* Stats bar */}
                                <div className="flex justify-around bg-slate-900 text-white rounded p-2 text-center mt-auto">
                                  <div><div className="font-extrabold text-sm">{user.projects.length}</div><div className="text-[8px] text-slate-400 uppercase tracking-wider">Projects</div></div>
                                  <div className="border-l border-slate-700" />
                                  <div><div className="font-extrabold text-sm">{user.experience.length}</div><div className="text-[8px] text-slate-400 uppercase tracking-wider">Internships</div></div>
                                  <div className="border-l border-slate-700" />
                                  <div><div className="font-extrabold text-sm">{user.skills.length}</div><div className="text-[8px] text-slate-400 uppercase tracking-wider">Technologies</div></div>
                                </div>
                              </div>
                            )}

                            {/* ===== NEON CRAFT PREVIEW ===== */}
                            {tpl.id === 'neon' && (
                              <div className="w-full h-full bg-black p-4 flex flex-col gap-3 font-mono text-white">
                                {/* Nav */}
                                <div className="flex justify-between items-center text-[10px] border-b border-neutral-800 pb-2">
                                  <span className="text-lime-400 font-extrabold tracking-widest">{user.personalInfo.name.toUpperCase()}</span>
                                  <div className="flex gap-3 text-neutral-500">
                                    <span>Work</span><span>Stack</span><span>Contact</span>
                                  </div>
                                </div>
                                {/* Hero */}
                                <div className="pt-2 space-y-2">
                                  <div className="text-2xl font-extrabold bg-gradient-to-r from-lime-400 to-cyan-400 bg-clip-text text-transparent leading-tight">
                                    {user.personalInfo.name}
                                  </div>
                                  <div className="text-lime-400 text-[10px] font-bold">{'// ROLE: '}{user.personalInfo.title || 'DEVELOPER'}</div>
                                  <div className="text-neutral-500 text-[10px]">{'// LOCATION: '}{user.personalInfo.location}</div>
                                </div>
                                {/* Skills */}
                                <div className="flex flex-wrap gap-1 mt-auto">
                                  {user.skills.slice(0, 5).map(s => (
                                    <span key={s} className="bg-neutral-900 border border-lime-500/30 text-lime-400 text-[9px] px-1.5 py-0.5 rounded">{s}</span>
                                  ))}
                                </div>
                              </div>
                            )}

                            {/* ===== MINIMAL ARC PREVIEW ===== */}
                            {tpl.id === 'minimal' && (
                              <div className="w-full h-full bg-[#FAFAF8] p-4 flex flex-col gap-3 font-sans text-slate-900">
                                {/* Nav */}
                                <div className="flex justify-between items-center border-b border-slate-200 pb-2 text-[10px]">
                                  <span className="font-bold text-slate-900 tracking-wide">{user.personalInfo.name}</span>
                                  <div className="flex gap-3 text-slate-400">
                                    <span>Work</span><span>Writing</span><span>Contact</span>
                                  </div>
                                </div>
                                {/* Hero */}
                                <div className="pt-2 space-y-2">
                                  <div className="text-xl font-bold text-slate-900 leading-snug" style={{ fontFamily: 'Georgia, serif' }}>
                                    {user.personalInfo.name}
                                  </div>
                                  <div className="text-slate-500 text-[10px] leading-relaxed">{user.personalInfo.title || 'Designer & Developer'}</div>
                                  <div className="text-slate-400 text-[10px] line-clamp-2 leading-relaxed">{user.bio.slice(0, 80)}…</div>
                                </div>
                                <div className="flex gap-2 mt-auto">
                                  {user.skills.slice(0, 4).map(s => (
                                    <span key={s} className="bg-slate-100 text-slate-500 text-[9px] px-2 py-0.5 rounded-full">{s}</span>
                                  ))}
                                </div>
                              </div>
                            )}

                            {/* Pro blur overlay */}
                            {tpl.isPro && (
                              <div className="absolute inset-0 bg-neutral-900/50 backdrop-blur-[2px] flex flex-col items-center justify-center gap-2 z-10 opacity-0 group-hover:opacity-100 transition-opacity">
                                <svg xmlns="http://www.w3.org/2000/svg" width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="text-amber-400"><rect width="18" height="11" x="3" y="11" rx="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>
                                <span className="text-white font-bold text-sm">Pro Template</span>
                                <span className="text-white/70 text-[10px]">Upgrade to unlock</span>
                              </div>
                            )}
                          </div>

                          {/* Card footer */}
                          <div className="bg-white px-5 py-4 flex items-center justify-between border-t border-neutral-100">
                            <div className="space-y-1.5">
                              <div className="flex items-center gap-2">
                                <h3 className="font-bold text-neutral-900 text-sm">{tpl.name}</h3>
                                {isSelected && <span className="text-[9px] bg-brand-600 text-white font-bold px-2 py-0.5 rounded-full uppercase">Active</span>}
                              </div>
                              <div className="flex flex-wrap gap-1">
                                {tpl.tags.map((tag, i) => (
                                  <span key={i} className={`text-[9px] font-bold px-2 py-0.5 rounded-full border ${
                                    i === 0 ? 'bg-neutral-900 text-white border-transparent' :
                                    i === 1 ? 'bg-white text-neutral-600 border-neutral-300' :
                                    tag === 'Free' ? 'bg-emerald-50 text-emerald-600 border-emerald-200' :
                                    'bg-amber-50 text-amber-600 border-amber-200'
                                  }`}>{tag}</span>
                                ))}
                              </div>
                            </div>
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                if (tpl.isPro) {
                                  alert('Upgrade to PortfolioAI Pro to use this template.');
                                } else {
                                  handleUpdate(draft => { draft.themeSettings.templateName = tpl.id as 'obsidian' | 'blueprint' | 'neon' | 'minimal'; });
                                }
                              }}
                              className={`ml-4 shrink-0 h-9 px-4 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                                isSelected
                                  ? 'bg-neutral-100 text-neutral-500 border border-neutral-200'
                                  : tpl.isPro
                                  ? 'bg-amber-400 hover:bg-amber-500 text-neutral-900'
                                  : 'bg-brand-600 hover:bg-brand-700 text-white shadow-sm'
                              }`}
                            >
                              {isSelected ? 'Current' : tpl.isPro ? 'Upgrade' : 'Use'}
                            </button>
                          </div>
                        </div>
                      );
                    })}
                </div>
              </div>
            )}


            {/* TAB: WORKSPACE EDITOR */}
            {activeTab === 'editor' && (
              <div className="h-full flex flex-col xl:flex-row gap-8 items-start animate-fade-in">
                
                {/* Left Panel Form (50%) */}
                <div className="w-full xl:w-1/2 bg-white border border-neutral-200 rounded-xl p-6 shadow-sm space-y-8 max-h-[85vh] overflow-y-auto">
                  
                  {/* Header save indicators */}
                  <div className="flex justify-between items-center pb-4 border-b border-neutral-100">
                    <div>
                      <h2 className="text-base font-bold text-neutral-900">Portfolio Data Fields</h2>
                      <p className="text-[11px] text-neutral-400 mt-0.5">Input details below. Preview refreshes automatically.</p>
                    </div>
                    
                    {/* Auto-save indicator */}
                    <div className="flex items-center gap-2 text-xs font-semibold">
                      {editorSaveState === 'saved' && (
                        <span className="text-success-500 flex items-center gap-1.5">
                          <span className="w-1.5 h-1.5 rounded-full bg-success-500" />
                          Saved
                        </span>
                      )}
                      {editorSaveState === 'saving' && (
                        <span className="text-brand-600 flex items-center gap-1.5">
                          <span className="w-1.5 h-1.5 border border-brand-600 border-t-transparent rounded-full animate-spin" />
                          Auto-saving...
                        </span>
                      )}
                      {editorSaveState === 'dirty' && (
                        <span className="text-neutral-400 flex items-center gap-1.5">
                          <span className="w-1.5 h-1.5 rounded-full bg-neutral-400 animate-pulse" />
                          Pending changes
                        </span>
                      )}
                    </div>
                  </div>

                  {/* FORM 1: PERSONAL INFO */}
                  <div className="space-y-4">
                    <h3 className="text-sm font-bold text-brand-600 uppercase tracking-wider">Personal Info</h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-semibold text-neutral-600 mb-1">Full Name</label>
                        <input
                          type="text"
                          value={user.personalInfo.name}
                          onChange={(e) => handleUpdate(draft => { draft.personalInfo.name = e.target.value; })}
                          className="w-full h-10 px-3 border border-neutral-200 focus:border-brand-600 focus:ring-1 focus:ring-brand-600 rounded-lg text-xs font-medium outline-none bg-white"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-semibold text-neutral-600 mb-1">Professional Title</label>
                        <input
                          type="text"
                          value={user.personalInfo.title}
                          onChange={(e) => handleUpdate(draft => { draft.personalInfo.title = e.target.value; })}
                          className="w-full h-10 px-3 border border-neutral-200 focus:border-brand-600 focus:ring-1 focus:ring-brand-600 rounded-lg text-xs font-medium outline-none bg-white"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-semibold text-neutral-600 mb-1">Location</label>
                        <input
                          type="text"
                          value={user.personalInfo.location}
                          onChange={(e) => handleUpdate(draft => { draft.personalInfo.location = e.target.value; })}
                          className="w-full h-10 px-3 border border-neutral-200 focus:border-brand-600 focus:ring-1 focus:ring-brand-600 rounded-lg text-xs font-medium outline-none bg-white"
                        />
                      </div>
                      <div className="flex flex-col justify-center">
                        <label className="block text-xs font-semibold text-neutral-600 mb-1">Status Options</label>
                        <div className="flex items-center gap-2 mt-2">
                          <input
                            type="checkbox"
                            checked={user.personalInfo.isOpenToWork}
                            onChange={(e) => handleUpdate(draft => { draft.personalInfo.isOpenToWork = e.target.checked; })}
                            className="w-4 h-4 rounded text-brand-600 focus:ring-brand-600"
                          />
                          <span className="text-xs text-neutral-700 font-medium">Open to Work badge visible</span>
                        </div>
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-neutral-600 mb-2">Select Avatar</label>
                      <div className="flex gap-4">
                        {avatarOptions.map((avatar, idx) => (
                          <button
                            key={idx}
                            onClick={() => handleUpdate(draft => { draft.personalInfo.avatar = avatar; })}
                            className={`w-12 h-12 rounded-full overflow-hidden border cursor-pointer ${
                              user.personalInfo.avatar === avatar ? 'ring-2 ring-brand-600 border-transparent' : 'border-neutral-200 hover:border-neutral-350'
                            }`}
                          >
                            {/* eslint-disable-next-line @next/next/no-img-element */}
                            <img src={avatar} alt={`av-${idx}`} className="w-full h-full object-cover" />
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* FORM 2: BIO WITH AI POLISH */}
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <h3 className="text-sm font-bold text-brand-600 uppercase tracking-wider">Biography</h3>
                      <button
                        onClick={handleAiPolish}
                        disabled={aiPolishState === 'loading' || !user.bio}
                        className="h-8 px-3 border border-brand-600 hover:bg-brand-100 text-brand-600 text-[11px] font-bold rounded-lg transition-all flex items-center gap-1.5 cursor-pointer disabled:opacity-40"
                      >
                        {aiPolishState === 'loading' ? (
                          <>
                            <span className="w-3.5 h-3.5 border-2 border-brand-600 border-t-transparent rounded-full animate-spin" />
                            Polishing...
                          </>
                        ) : (
                          <>
                            <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24"><path d="M9 21c0 .55.45 1 1 1h4c.55 0 1-.45 1-1v-1H9v1zm3-19C8.14 2 5 5.14 5 9c0 2.38 1.19 4.47 3 5.74V17c0 .55.45 1 1 1h6c.55 0 1-.45 1-1v-2.26c1.81-1.27 3-3.36 3-5.74 0-3.86-3.14-7-7-7zm2.85 11.1c-.03.04-.06.08-.09.12a.96.96 0 0 0-.21.61V16H9.45v-1.17c0-.22-.07-.44-.21-.61-.03-.04-.06-.08-.09-.12A5.02 5.02 0 0 1 7 9c0-2.76 2.24-5 5-5s5 2.24 5 5c0 1.63-.78 3.07-2 3.9c0 .4-.54 1.1-.15 1.2z" /></svg>
                            Polish with AI
                          </>
                        )}
                      </button>
                    </div>

                    <textarea
                      value={user.bio}
                      disabled={aiPolishState === 'loading'}
                      onChange={(e) => handleUpdate(draft => { draft.bio = e.target.value; })}
                      rows={4}
                      className="w-full p-3 border border-neutral-200 focus:border-brand-600 focus:ring-1 focus:ring-brand-600 rounded-lg text-xs font-medium outline-none bg-white leading-normal"
                      placeholder="Write a brief profile intro..."
                    />

                    {/* AI Polish Diff Acceptance State */}
                    {aiPolishState === 'diff' && (
                      <div className="p-4 bg-brand-100/50 border border-brand-600/20 rounded-xl space-y-3 animate-fade-in text-xs">
                        <div className="font-bold text-neutral-900">AI Improved Suggestion:</div>
                        <p className="text-neutral-700 leading-normal italic">
                          {polishedBio}
                        </p>
                        <div className="flex gap-2">
                          <button
                            onClick={acceptAiPolish}
                            className="px-3.5 py-1.5 bg-brand-600 hover:bg-brand-600/90 text-white rounded font-bold cursor-pointer"
                          >
                            Accept Suggestion
                          </button>
                          <button
                            onClick={revertAiPolish}
                            className="px-3.5 py-1.5 border border-neutral-250 hover:bg-white text-neutral-600 rounded font-semibold cursor-pointer"
                          >
                            Revert
                          </button>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* FORM 3: SKILLS TAG INPUT */}
                  <div className="space-y-4">
                    <h3 className="text-sm font-bold text-brand-600 uppercase tracking-wider">Skills & Technologies</h3>
                    <form onSubmit={handleAddSkill} className="flex gap-2">
                      <input
                        type="text"
                        placeholder="Add skill (e.g. Next.js) and press Enter"
                        value={newSkill}
                        onChange={(e) => setNewSkill(e.target.value)}
                        className="flex-1 h-10 px-3 border border-neutral-200 focus:border-brand-600 focus:ring-1 focus:ring-brand-600 rounded-lg text-xs font-medium outline-none bg-white"
                      />
                      <button
                        type="submit"
                        className="h-10 px-4 bg-brand-600 hover:bg-brand-600/90 text-white font-bold rounded-lg text-xs cursor-pointer"
                      >
                        Add
                      </button>
                    </form>

                    <div className="flex flex-wrap gap-1.5 pt-1">
                      {user.skills.map((skill) => (
                        <span
                          key={skill}
                          className="bg-brand-100 text-brand-600 text-xs font-bold pl-3 pr-2 py-1 rounded-full flex items-center gap-1.5"
                        >
                          {skill}
                          <button
                            type="button"
                            onClick={() => handleRemoveSkill(skill)}
                            className="w-4 h-4 rounded-full hover:bg-brand-600 hover:text-white flex items-center justify-center text-[10px] cursor-pointer"
                          >
                            &times;
                          </button>
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* FORM 4: PROJECTS (REPEATABLE) */}
                  <div className="space-y-6">
                    <div className="flex justify-between items-center">
                      <h3 className="text-sm font-bold text-brand-600 uppercase tracking-wider">Projects Showcase</h3>
                      <button
                        onClick={addProject}
                        className="h-8 px-3 border border-brand-600 hover:bg-brand-100 text-brand-600 text-xs font-bold rounded-lg transition-all cursor-pointer"
                      >
                        + Add Project
                      </button>
                    </div>

                    <div className="space-y-6">
                      {user.projects.map((proj, idx) => (
                        <div key={idx} className="p-4 border border-neutral-200 rounded-xl relative space-y-3 bg-neutral-50/50">
                          <button
                            onClick={() => removeProject(idx)}
                            className="absolute top-4 right-4 w-6 h-6 border border-neutral-200 hover:border-danger-500 rounded-lg flex items-center justify-center text-neutral-400 hover:text-danger-500 transition-colors cursor-pointer"
                            title="Remove Project"
                          >
                            &times;
                          </button>

                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                            <div>
                              <label className="block text-[10px] font-bold text-neutral-500 uppercase">Project Name</label>
                              <input
                                type="text"
                                value={proj.name}
                                onChange={(e) => handleProjectChange(idx, 'name', e.target.value)}
                                className="w-full h-9 px-2.5 border border-neutral-200 focus:border-brand-600 rounded-lg text-xs font-medium outline-none bg-white mt-1"
                              />
                            </div>
                            <div>
                              <label className="block text-[10px] font-bold text-neutral-500 uppercase">Category</label>
                              <select
                                value={proj.category}
                                onChange={(e) => handleProjectChange(idx, 'category', e.target.value)}
                                className="w-full h-9 px-2.5 border border-neutral-200 focus:border-brand-600 rounded-lg text-xs font-medium outline-none bg-white mt-1"
                              >
                                <option value="Dark">Dark theme visual</option>
                                <option value="Minimal">Minimalist showcase</option>
                                <option value="Bold">Bold highlight</option>
                                <option value="Creative">Creative portfolio</option>
                              </select>
                            </div>
                          </div>

                          <div>
                            <label className="block text-[10px] font-bold text-neutral-500 uppercase">Problem & Description</label>
                            <textarea
                              value={proj.description}
                              onChange={(e) => handleProjectChange(idx, 'description', e.target.value)}
                              rows={2}
                              className="w-full p-2.5 border border-neutral-200 focus:border-brand-600 rounded-lg text-xs font-medium outline-none bg-white mt-1 leading-normal"
                            />
                          </div>

                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                            <div>
                              <label className="block text-[10px] font-bold text-neutral-500 uppercase">GitHub Repo Link</label>
                              <input
                                type="text"
                                value={proj.githubUrl}
                                onChange={(e) => handleProjectChange(idx, 'githubUrl', e.target.value)}
                                className="w-full h-9 px-2.5 border border-neutral-200 focus:border-brand-600 rounded-lg text-xs font-medium outline-none bg-white mt-1"
                              />
                            </div>
                            <div>
                              <label className="block text-[10px] font-bold text-neutral-500 uppercase">Live URL</label>
                              <input
                                type="text"
                                value={proj.liveUrl}
                                onChange={(e) => handleProjectChange(idx, 'liveUrl', e.target.value)}
                                className="w-full h-9 px-2.5 border border-neutral-200 focus:border-brand-600 rounded-lg text-xs font-medium outline-none bg-white mt-1"
                              />
                            </div>
                          </div>

                          <div>
                            <label className="block text-[10px] font-bold text-neutral-500 uppercase">Outcome / Project Impact</label>
                            <input
                              type="text"
                              value={proj.outcome || ''}
                              onChange={(e) => handleProjectChange(idx, 'outcome', e.target.value)}
                              className="w-full h-9 px-2.5 border border-neutral-200 focus:border-brand-600 rounded-lg text-xs font-medium outline-none bg-white mt-1"
                              placeholder="e.g. Achieved sub-10ms lock renewals under latency."
                            />
                          </div>

                          <div>
                            <label className="block text-[10px] font-bold text-neutral-500 uppercase">Tech Stack (comma separated)</label>
                            <input
                              type="text"
                              value={proj.tags.join(', ')}
                              onChange={(e) => handleProjectChange(idx, 'tags', e.target.value)}
                              className="w-full h-9 px-2.5 border border-neutral-200 focus:border-brand-600 rounded-lg text-xs font-mono outline-none bg-white mt-1"
                            />
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* FORM 5: EXPERIENCE (REPEATABLE) */}
                  <div className="space-y-6">
                    <div className="flex justify-between items-center">
                      <h3 className="text-sm font-bold text-brand-600 uppercase tracking-wider">Professional Timeline</h3>
                      <button
                        onClick={addExperience}
                        className="h-8 px-3 border border-brand-600 hover:bg-brand-100 text-brand-600 text-xs font-bold rounded-lg transition-all cursor-pointer"
                      >
                        + Add Experience
                      </button>
                    </div>

                    <div className="space-y-6">
                      {user.experience.map((exp, idx) => (
                        <div key={idx} className="p-4 border border-neutral-200 rounded-xl relative space-y-3 bg-neutral-50/50">
                          <button
                            onClick={() => removeExperience(idx)}
                            className="absolute top-4 right-4 w-6 h-6 border border-neutral-200 hover:border-danger-500 rounded-lg flex items-center justify-center text-neutral-400 hover:text-danger-500 transition-colors cursor-pointer"
                          >
                            &times;
                          </button>

                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                            <div>
                              <label className="block text-[10px] font-bold text-neutral-500 uppercase">Company Name</label>
                              <input
                                type="text"
                                value={exp.company}
                                onChange={(e) => handleExperienceChange(idx, 'company', e.target.value)}
                                className="w-full h-9 px-2.5 border border-neutral-200 focus:border-brand-600 rounded-lg text-xs font-medium outline-none bg-white mt-1"
                              />
                            </div>
                            <div>
                              <label className="block text-[10px] font-bold text-neutral-500 uppercase">Role / Job Title</label>
                              <input
                                type="text"
                                value={exp.role}
                                onChange={(e) => handleExperienceChange(idx, 'role', e.target.value)}
                                className="w-full h-9 px-2.5 border border-neutral-200 focus:border-brand-600 rounded-lg text-xs font-medium outline-none bg-white mt-1"
                              />
                            </div>
                          </div>

                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                            <div>
                              <label className="block text-[10px] font-bold text-neutral-500 uppercase">Start Date</label>
                              <input
                                type="text"
                                value={exp.startDate}
                                onChange={(e) => handleExperienceChange(idx, 'startDate', e.target.value)}
                                className="w-full h-9 px-2.5 border border-neutral-200 focus:border-brand-600 rounded-lg text-xs font-medium outline-none bg-white mt-1"
                              />
                            </div>
                            <div>
                              <label className="block text-[10px] font-bold text-neutral-500 uppercase">End Date</label>
                              <input
                                type="text"
                                value={exp.endDate}
                                onChange={(e) => handleExperienceChange(idx, 'endDate', e.target.value)}
                                className="w-full h-9 px-2.5 border border-neutral-200 focus:border-brand-600 rounded-lg text-xs font-medium outline-none bg-white mt-1"
                              />
                            </div>
                          </div>

                          <div>
                            <label className="block text-[10px] font-bold text-neutral-500 uppercase">Achievements (one bullet per line)</label>
                            <textarea
                              value={exp.achievements.join('\n')}
                              onChange={(e) => handleExperienceChange(idx, 'achievements', e.target.value)}
                              rows={3}
                              className="w-full p-2.5 border border-neutral-200 focus:border-brand-600 rounded-lg text-xs font-medium outline-none bg-white mt-1 leading-normal"
                              placeholder="Fleshed out SRE telemetry dashboards..."
                            />
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* FORM 6: THEME PRESETS */}
                  <div className="space-y-4 border-t border-neutral-100 pt-6">
                    <h3 className="text-sm font-bold text-brand-600 uppercase tracking-wider">Styling Parameters</h3>
                    
                    <div className="space-y-3">
                      <label className="block text-xs font-semibold text-neutral-600">Active Template</label>
                      <div className="grid grid-cols-4 gap-2">
                        {['obsidian', 'blueprint', 'neon', 'minimal'].map((tName) => {
                          const isActive = user.themeSettings.templateName === tName;
                          return (
                            <button
                              key={tName}
                              type="button"
                              onClick={() => handleUpdate(draft => { draft.themeSettings.templateName = tName as 'obsidian' | 'blueprint' | 'neon' | 'minimal'; })}
                              className={`h-9 capitalize rounded-lg text-xs font-bold border transition-colors cursor-pointer ${
                                isActive
                                  ? 'bg-brand-600 text-white border-transparent'
                                  : 'bg-white border-neutral-200 hover:bg-neutral-50 text-neutral-600'
                              }`}
                            >
                              {tName}
                            </button>
                          );
                        })}
                      </div>
                    </div>

                    <div className="space-y-3">
                      <label className="block text-xs font-semibold text-neutral-600">Accent Colour Preset</label>
                      <div className="flex flex-wrap gap-2">
                        {accentPresets.map((ac) => {
                          const isSel = user.themeSettings.accentColor === ac.hex;
                          return (
                            <button
                              key={ac.hex}
                              type="button"
                              onClick={() => handleUpdate(draft => { draft.themeSettings.accentColor = ac.hex; })}
                              className="w-8 h-8 rounded-full border border-neutral-200 flex items-center justify-center cursor-pointer transition-transform hover:scale-105"
                              style={{ backgroundColor: ac.hex }}
                              title={ac.name}
                            >
                              {isSel && (
                                <span className={`w-2 h-2 rounded-full ${ac.hex === '#1A1A1A' || ac.hex === '#7C3AED' ? 'bg-white' : 'bg-neutral-900'}`} />
                              )}
                            </button>
                          );
                        })}
                      </div>
                    </div>

                    <div className="space-y-3">
                      <label className="block text-xs font-semibold text-neutral-600">Font Pairing Preset</label>
                      <select
                        value={user.themeSettings.fontPairing}
                        onChange={(e) => handleUpdate(draft => { draft.themeSettings.fontPairing = e.target.value; })}
                        className="w-full h-10 px-2.5 border border-neutral-200 focus:border-brand-600 rounded-lg text-xs font-medium outline-none bg-white"
                      >
                        {fontPresets.map(f => <option key={f} value={f}>{f}</option>)}
                      </select>
                    </div>
                  </div>

                  {/* BOTTOM CTAs */}
                  <div className="border-t border-neutral-100 pt-6">
                    <button
                      onClick={() => setShowPublishModal(true)}
                      className="w-full h-12 bg-brand-600 hover:bg-brand-600/90 text-white font-bold rounded-lg text-sm flex items-center justify-center gap-2 transition-all cursor-pointer shadow-sm"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" x2="12" y1="3" y2="15"/></svg>
                      Publish Portfolio
                    </button>
                  </div>

                </div>

                {/* Right Panel Preview (50%) */}
                <div className="w-full xl:w-1/2 bg-neutral-100 border border-neutral-200 rounded-xl p-4 shadow-sm xl:sticky xl:top-[80px] flex flex-col items-center">
                  
                  {/* Safari/Browser header frame */}
                  <div className="w-full bg-white rounded-t-xl border-x border-t border-neutral-200 px-4 py-2 flex items-center gap-4 justify-between shrink-0">
                    <div className="flex gap-1.5">
                      <span className="w-2.5 h-2.5 rounded-full bg-red-400" />
                      <span className="w-2.5 h-2.5 rounded-full bg-yellow-400" />
                      <span className="w-2.5 h-2.5 rounded-full bg-green-400" />
                    </div>

                    <div className="flex-1 max-w-sm mx-4 bg-neutral-50 border border-neutral-200 px-3 py-1 rounded text-[9px] font-mono text-center text-neutral-400 select-none truncate">
                      https://{user.username}.portfolioai.dev
                    </div>

                    <div className="text-neutral-300">
                      <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21.5 2v6h-6M21.34 15.57a10 10 0 1 1-.57-8.38l5.67-5.67"/></svg>
                    </div>
                  </div>

                  {/* Browser contents box - scaled down representation of the selected template */}
                  <div className="w-full bg-white border-x border-b border-neutral-200 rounded-b-xl overflow-hidden aspect-[4/3] relative">
                    
                    {/* Interactive scaled viewport container */}
                    <div className="absolute inset-0 overflow-y-auto p-6 scroll-smooth select-none text-[13px] leading-normal">
                      
                      {/* TEMPLATE 1: OBSIDIAN */}
                      {user.themeSettings.templateName === 'obsidian' && (
                        <div className="min-h-full bg-[#0A0A0F] text-[#F8FAFC] p-6 space-y-8 font-sans">
                          {/* Navigation bar */}
                          <div className="flex justify-between items-center border-b border-[#1E1E2E] pb-3 text-[10px]">
                            <span className="font-bold tracking-tight text-white flex items-center gap-1">
                              <span className="w-2 h-2 rounded bg-purple-500" />
                              {user.personalInfo.name.split(' ')[0]}
                            </span>
                            <div className="flex gap-3 text-slate-400">
                              <span>Work</span>
                              <span>About</span>
                              <span>Contact</span>
                            </div>
                          </div>

                          {/* Hero banner */}
                          <div className="text-center py-6 space-y-4">
                            <div className="relative inline-block">
                              {/* eslint-disable-next-line @next/next/no-img-element */}
                              <img
                                src={user.personalInfo.avatar}
                                alt="avatar"
                                className="w-16 h-16 rounded-full mx-auto object-cover border-2"
                                style={{ borderColor: user.themeSettings.accentColor }}
                              />
                              <div className="absolute inset-0 rounded-full blur-[10px] opacity-30 bg-purple-500 pointer-events-none" />
                            </div>
                            <div className="space-y-1">
                              <h2 className="text-2xl font-bold tracking-tight text-white">{user.personalInfo.name}</h2>
                              <p className="text-[10px] font-mono" style={{ color: user.themeSettings.accentColor }}>
                                &gt; {user.personalInfo.title || 'Student Developer'}
                              </p>
                              {user.personalInfo.isOpenToWork && (
                                <span className="inline-block bg-emerald-500/10 text-emerald-400 text-[8px] font-bold px-2 py-0.5 rounded-full border border-emerald-500/20">
                                  Open to Work
                                </span>
                              )}
                            </div>
                          </div>

                          {/* Biography */}
                          <div className="space-y-2">
                            <h3 className="text-xs font-bold text-white uppercase tracking-wider">Bio</h3>
                            <p className="text-slate-400 text-[11px] leading-relaxed">
                              {user.bio || 'Provide a brief bio to showcase here.'}
                            </p>
                          </div>

                          {/* Skill list */}
                          <div className="space-y-2">
                            <h3 className="text-xs font-bold text-white uppercase tracking-wider">Skills</h3>
                            <div className="flex flex-wrap gap-1">
                              {user.skills.map(s => (
                                <span key={s} className="bg-[#13131A] border border-[#1E1E2E] text-slate-300 text-[9px] px-2 py-0.5 rounded">
                                  {s}
                                </span>
                              ))}
                            </div>
                          </div>

                          {/* Projects Grid */}
                          <div className="space-y-3">
                            <h3 className="text-xs font-bold text-white uppercase tracking-wider">Selected Works</h3>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                              {user.projects.map((p, i) => (
                                <div key={i} className="bg-[#13131A] border border-[#1E1E2E] p-3 rounded-lg space-y-2">
                                  <div className="flex justify-between items-center">
                                    <span className="font-bold text-white text-xs">{p.name}</span>
                                    <span className="text-[9px] text-purple-400 font-mono">/ {p.category}</span>
                                  </div>
                                  <p className="text-[10px] text-slate-400 leading-normal line-clamp-2">{p.description}</p>
                                  <div className="flex flex-wrap gap-1">
                                    {p.tags.map(t => (
                                      <span key={t} className="text-[8px] bg-slate-900 px-1 py-0.2 rounded text-slate-400">{t}</span>
                                    ))}
                                  </div>
                                </div>
                              ))}
                            </div>
                          </div>
                        </div>
                      )}

                      {/* TEMPLATE 2: BLUEPRINT */}
                      {user.themeSettings.templateName === 'blueprint' && (
                        <div className="min-h-full bg-white text-slate-900 p-6 space-y-8 font-sans border-t-[3px] border-blue-500">
                          {/* Navigation bar */}
                          <div className="flex justify-between items-center border-b border-slate-200 pb-3 text-[10px]">
                            <span className="font-extrabold tracking-widest text-slate-900 uppercase">
                              {user.personalInfo.name.toUpperCase()}
                            </span>
                            <div className="flex gap-3 text-slate-600 font-bold uppercase">
                              <span>Details</span>
                              <span>Case Studies</span>
                            </div>
                          </div>

                          {/* Hero banner */}
                          <div className="grid grid-cols-3 gap-4 items-center">
                            <div className="col-span-2 space-y-3">
                              <div className="inline-block bg-blue-50 text-blue-600 text-[9px] font-bold px-2 py-0.5 rounded border border-blue-200">
                                {'ACTIVE PORTFOLIO // AVAILABILITY: '}{user.personalInfo.isOpenToWork ? 'OPEN' : 'BUSY'}
                              </div>
                              <h2 className="text-xl font-extrabold text-slate-900 leading-tight">
                                {user.personalInfo.name}
                              </h2>
                              <p className="text-xs text-slate-600 font-semibold">{user.personalInfo.title}</p>
                              <p className="text-[10px] text-slate-400 font-mono">Location: {user.personalInfo.location}</p>
                            </div>
                            <div className="col-span-1">
                              {/* eslint-disable-next-line @next/next/no-img-element */}
                              <img
                                src={user.personalInfo.avatar}
                                alt="avatar"
                                className="w-16 h-16 rounded border border-slate-350 object-cover"
                              />
                            </div>
                          </div>

                          {/* Biography */}
                          <div className="border-l-[3px] border-blue-500 pl-3">
                            <p className="text-slate-600 text-xs italic leading-relaxed">
                              &ldquo;{user.bio || 'Explain your engineering philosophy.'}&rdquo;
                            </p>
                          </div>

                          {/* Project case studies (Blueprint stacked layout) */}
                          <div className="space-y-4">
                            <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider border-b border-slate-200 pb-1">
                              Engineering Case Studies
                            </h3>
                            <div className="space-y-4">
                              {user.projects.map((p, i) => (
                                <div key={i} className="p-3 bg-slate-50 border border-slate-200 rounded space-y-2">
                                  <div className="flex justify-between items-center text-[10px]">
                                    <span className="font-extrabold text-slate-900">{p.name}</span>
                                    <span className="text-blue-500 font-mono uppercase font-bold">{p.category}</span>
                                  </div>
                                  <p className="text-[10px] text-slate-600">{p.description}</p>
                                  {p.outcome && (
                                    <div className="text-[9px] text-slate-500 border-l-2 border-slate-300 pl-2">
                                      <strong>OUTCOME:</strong> {p.outcome}
                                    </div>
                                  )}
                                </div>
                              ))}
                            </div>
                          </div>
                        </div>
                      )}

                      {/* TEMPLATE 3: NEON CRAFT */}
                      {user.themeSettings.templateName === 'neon' && (
                        <div className="min-h-full bg-neutral-950 text-white p-6 space-y-8 font-mono">
                          {/* Navigation bar */}
                          <div className="flex justify-between items-center border-b border-neutral-800 pb-3 text-[10px]">
                            <span className="font-extrabold text-lime-400">[PORTFOLIO_CRAFT]</span>
                            <div className="flex gap-3 text-neutral-400">
                              <span>WORK://</span>
                              <span>MANIFESTO://</span>
                            </div>
                          </div>

                          {/* Hero banner */}
                          <div className="text-left space-y-4">
                            <h2 className="text-3xl font-extrabold tracking-tight bg-gradient-to-r from-lime-400 to-cyan-400 bg-clip-text text-transparent">
                              {user.personalInfo.name.toUpperCase()}
                            </h2>
                            <div className="space-y-1.5 text-[11px] text-lime-400">
                              <p className="font-bold">{'// ROLE: '}{user.personalInfo.title || 'DEVELOPER'}</p>
                              <p className="text-neutral-500">{'// LOCATION: '}{user.personalInfo.location}</p>
                            </div>
                          </div>

                          {/* Biography */}
                          <div className="p-3 border border-neutral-800 bg-neutral-900 rounded-lg">
                            <p className="text-neutral-300 text-[10px] leading-relaxed">
                              {user.bio || 'Explain your engineering philosophy.'}
                            </p>
                          </div>

                          {/* Skill list */}
                          <div className="space-y-2">
                            <span className="text-xs font-bold text-lime-400 tracking-wide">{'// CORE_TECH'}</span>
                            <div className="flex flex-wrap gap-1.5">
                              {user.skills.map(s => (
                                <span key={s} className="bg-neutral-900 border border-lime-500/20 text-neutral-300 text-[9px] px-2 py-0.5 rounded">
                                  {s}
                                </span>
                              ))}
                            </div>
                          </div>

                          {/* Projects Bento layout */}
                          <div className="space-y-3">
                            <span className="text-xs font-bold text-lime-400 tracking-wide">{'// BENTO_GRID'}</span>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                              {user.projects.map((p, i) => (
                                <div key={i} className="border border-neutral-800 bg-neutral-900/60 p-3 rounded space-y-2 hover:border-lime-400 transition-colors">
                                  <h4 className="font-extrabold text-xs text-white uppercase">{p.name}</h4>
                                  <p className="text-[9px] text-neutral-400 line-clamp-3 leading-normal">{p.description}</p>
                                </div>
                              ))}
                            </div>
                          </div>
                        </div>
                      )}

                      {/* TEMPLATE 4: MINIMAL ARC */}
                      {user.themeSettings.templateName === 'minimal' && (
                        <div className="min-h-full bg-[#FAFAFA] text-neutral-850 p-6 space-y-8 font-serif">
                          {/* Navigation bar */}
                          <div className="flex justify-between items-center border-b border-neutral-200 pb-3 text-[11px] italic">
                            <span>{user.personalInfo.name}</span>
                            <span className="font-sans text-[9px] tracking-widest uppercase text-neutral-400">INDEX 2026</span>
                          </div>

                          {/* Hero banner */}
                          <div className="max-w-md space-y-4">
                            <h2 className="text-2xl font-bold tracking-tight text-neutral-900 font-serif leading-tight">
                              {user.personalInfo.name}
                            </h2>
                            <p className="text-xs text-neutral-500 font-sans tracking-wide uppercase">
                              {user.personalInfo.title} &middot; {user.personalInfo.location}
                            </p>
                          </div>

                          {/* Biography */}
                          <div className="max-w-sm">
                            <p className="text-neutral-700 text-xs font-serif leading-relaxed">
                              {user.bio || 'Explain your engineering philosophy.'}
                            </p>
                          </div>

                          {/* Projects list */}
                          <div className="space-y-3 pt-4 border-t border-neutral-200">
                            <h3 className="text-xs font-bold text-neutral-400 uppercase tracking-widest font-sans">
                              Selected Work
                            </h3>
                            <div className="divide-y divide-neutral-200">
                              {user.projects.map((p, i) => (
                                <div key={i} className="py-2.5 flex justify-between items-center gap-4 text-xs">
                                  <span className="font-mono text-[10px] text-neutral-400">0{i+1}</span>
                                  <span className="font-bold text-neutral-950 flex-1 truncate">{p.name}</span>
                                  <span className="text-[10px] text-neutral-500 font-sans shrink-0">{p.tags.slice(0,2).join(', ')}</span>
                                </div>
                              ))}
                            </div>
                          </div>
                        </div>
                      )}

                    </div>
                  </div>

                  {/* Visual card summary overlay */}
                  <div className="w-full text-center mt-3 text-[10px] text-neutral-400 font-semibold tracking-wider uppercase">
                    Preview Mode: Scaled Browser Frame
                  </div>
                </div>

              </div>
            )}

            {/* TAB: SETTINGS */}
            {activeTab === 'settings' && (
              <div className="bg-white border border-neutral-200 p-6 rounded-xl space-y-6 max-w-2xl animate-fade-in shadow-sm">
                <div>
                  <h2 className="text-lg font-bold text-neutral-900">Student Account Settings</h2>
                  <p className="text-neutral-500 text-xs mt-1">Manage notification toggles, privacy permissions, and verification parameters</p>
                </div>

                <div className="space-y-4">
                  <div className="flex items-center justify-between p-3.5 bg-neutral-50 border border-neutral-200 rounded-lg">
                    <div>
                      <h4 className="text-xs font-bold text-neutral-800">Share GPA Status</h4>
                      <p className="text-[10px] text-neutral-500 mt-0.5">Allow portfolio view keyholders to inspect verified academic GPA</p>
                    </div>
                    <input
                      type="checkbox"
                      defaultChecked
                      className="w-4 h-4 rounded text-brand-600 focus:ring-brand-600"
                    />
                  </div>

                  <div className="flex items-center justify-between p-3.5 bg-neutral-50 border border-neutral-200 rounded-lg">
                    <div>
                      <h4 className="text-xs font-bold text-neutral-800">Public Student Directory</h4>
                      <p className="text-[10px] text-neutral-500 mt-0.5">List your student portfolio page inside university discovery registry</p>
                    </div>
                    <input
                      type="checkbox"
                      className="w-4 h-4 rounded text-brand-600 focus:ring-brand-600"
                    />
                  </div>

                  <div className="flex items-center justify-between p-3.5 bg-neutral-50 border border-neutral-200 rounded-lg">
                    <div>
                      <h4 className="text-xs font-bold text-neutral-800">AI Alerts</h4>
                      <p className="text-[10px] text-neutral-500 mt-0.5">Receive immediate notifications on grades posting or advisor updates</p>
                    </div>
                    <input
                      type="checkbox"
                      defaultChecked
                      className="w-4 h-4 rounded text-brand-600 focus:ring-brand-600"
                    />
                  </div>
                </div>

                <div className="border-t border-neutral-200 pt-5">
                  <button
                    onClick={() => alert('Settings saved successfully!')}
                    className="bg-brand-600 hover:bg-brand-600/90 text-white text-xs font-bold px-5 py-2.5 rounded-lg transition-colors cursor-pointer shadow-sm"
                  >
                    Save Settings
                  </button>
                </div>
              </div>
            )}

            {/* TAB: HELP */}
            {activeTab === 'help' && (
              <div className="bg-white border border-neutral-200 p-6 rounded-xl space-y-6 max-w-3xl animate-fade-in shadow-sm">
                <div>
                  <h2 className="text-lg font-bold text-neutral-900">PortfolioAI Help Center & Documentation</h2>
                  <p className="text-neutral-500 text-xs mt-1">Get tutorials, design tips, and advice on showcasing your development history.</p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="p-4 bg-neutral-50 border border-neutral-200 rounded-lg space-y-2">
                    <h3 className="text-xs font-bold text-neutral-900 uppercase tracking-wider">AI Polish Best Practices</h3>
                    <p className="text-[11px] text-neutral-600 leading-normal">
                      Type raw bulleted details of your SRE metrics or consensus logs, and click &ldquo;Polish with AI&rdquo;. The engine formats it in passive-active voice optimized for technical recruiter scanning.
                    </p>
                  </div>
                  <div className="p-4 bg-neutral-50 border border-neutral-200 rounded-lg space-y-2">
                    <h3 className="text-xs font-bold text-neutral-900 uppercase tracking-wider">Pro Subdomains Setup</h3>
                    <p className="text-[11px] text-neutral-600 leading-normal">
                      Students on the free tier get a `username.portfolioai.dev` subdomain. Pro subscriptions unlock custom domain routing (`yourname.com`) and direct DNS name server setups.
                    </p>
                  </div>
                </div>
              </div>
            )}

          </div>
        </div>

      </div>

      {/* Publish Modal Overlay */}
      {showPublishModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-neutral-900/60 backdrop-blur-sm animate-fade-in">
          <div className="w-full max-w-md bg-white rounded-xl shadow-xl border border-neutral-200 p-6 flex flex-col justify-between transform scale-100 transition-all duration-300">
            <div className="space-y-4">
              <h3 className="text-lg font-bold text-neutral-900">Your portfolio is going live!</h3>
              <p className="text-xs text-neutral-500 leading-relaxed">
                Confirming will publish your updated credentials and synchronize projects to your live student subdomain:
              </p>
              
              <div className="bg-neutral-50 border border-neutral-200 p-3 rounded-lg font-mono text-xs font-bold text-center text-brand-600 select-all">
                https://{user.username}.portfolioai.dev
              </div>
            </div>

            <div className="flex gap-3 pt-6">
              <button
                onClick={() => setShowPublishModal(false)}
                disabled={isPublishing}
                className="flex-1 h-10 border border-neutral-200 text-neutral-500 hover:bg-neutral-50 font-bold rounded-lg transition-colors cursor-pointer text-xs"
              >
                Go Back
              </button>
              <button
                onClick={publishPortfolio}
                disabled={isPublishing}
                className="flex-1 h-10 bg-brand-600 hover:bg-brand-600/90 disabled:bg-brand-600/50 text-white font-bold rounded-lg transition-colors cursor-pointer text-xs shadow-sm flex items-center justify-center gap-1.5"
              >
                {isPublishing ? (
                  <>
                    <span className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    Publishing...
                  </>
                ) : (
                  'Confirm & Publish'
                )}
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
