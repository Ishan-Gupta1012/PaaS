'use client';
// Trigger Tailwind rebuild

import React, { useState, useEffect } from 'react';
import { initialPortfolioData, PortfolioData, Achievement, Project, SocialLink } from '@/types/portfolio';
import ModernDeveloperTemplate from '@/components/templates/ModernDeveloper';
import DeveloperProTemplate from '@/components/templates/DeveloperPro';
import Link from 'next/link';
import { ArrowLeft, Save, Plus, Trash2, User, Briefcase, Code, Mail, Edit3, X, Zap, GitBranch, Loader2 } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { createClient } from '@/utils/supabase/client';

export default function BuilderPage() {
  const [data, setData] = useState<PortfolioData>(initialPortfolioData);
  const [isPreviewFullscreen] = useState(false);
  const [activeTab, setActiveTab] = useState<'hero' | 'projects' | 'achievements' | 'skills' | 'contact'>('hero');
  const [selectedTemplate, setSelectedTemplate] = useState<string>('modern-developer');

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search);
      const temp = params.get('template');
      if (temp) {
        setTimeout(() => setSelectedTemplate(temp), 0);
      }
    }
  }, []);

  const { user } = useAuth();
  const [isConnectingGithub, setIsConnectingGithub] = useState(false);
  const [githubConnected, setGithubConnected] = useState(false);
  const [githubHandle, setGithubHandle] = useState<string | null>(null);

  const handleHeroChange = <K extends keyof PortfolioData['hero']>(field: K, value: PortfolioData['hero'][K]) => {
    setData((prev) => ({ ...prev, hero: { ...prev.hero, [field]: value } }));
  };

  useEffect(() => {
    const checkGitHubIdentity = async () => {
      let usernameToSet = null;

      if (user?.provider === 'github' && user.username) {
        usernameToSet = user.username;
        setGithubConnected(true);
        setGithubHandle(usernameToSet);
      } else {
        const supabase = createClient();
        const { data: { session } } = await supabase.auth.getSession();
        const githubIdentity = session?.user?.identities?.find(id => id.provider === 'github');
        
        if (githubIdentity && githubIdentity.identity_data?.user_name) {
          usernameToSet = githubIdentity.identity_data.user_name;
          setGithubConnected(true);
          setGithubHandle(usernameToSet);
        }
      }

      if (usernameToSet && !data.hero.githubUsername) {
        handleHeroChange('githubUsername', usernameToSet);
      }
    };
    
    checkGitHubIdentity();
  }, [user, data.hero.githubUsername]);

  const handleConnectGithub = async () => {
    setIsConnectingGithub(true);
    // User requested to automatically save. Ideally we call the save API here.
    // For now, we trigger the redirect.
    const supabase = createClient();
    await supabase.auth.linkIdentity({
      provider: 'github',
      options: {
        redirectTo: window.location.href,
      }
    });
  };
  
  // Resizing and Dragging State
  const [panelWidth, setPanelWidth] = useState(500);
  const [panelPos, setPanelPos] = useState({ x: 16, y: 16 });
  const [isResizing, setIsResizing] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [isCollapsed, setIsCollapsed] = useState(false);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (isResizing) {
        const newWidth = Math.max(400, Math.min(800, e.clientX - panelPos.x));
        setPanelWidth(newWidth);
      }
      if (isDragging) {
        const newX = Math.max(0, Math.min(window.innerWidth - panelWidth, e.clientX - dragStart.x));
        const newY = Math.max(0, Math.min(window.innerHeight - 100, e.clientY - dragStart.y));
        setPanelPos({ x: newX, y: newY });
      }
    };

    const handleMouseUp = () => {
      setIsResizing(false);
      setIsDragging(false);
    };

    if (isResizing || isDragging) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
      document.body.style.userSelect = 'none';
      if (isResizing) document.body.style.cursor = 'col-resize';
      if (isDragging) document.body.style.cursor = 'move';
    } else {
      document.body.style.cursor = '';
      document.body.style.userSelect = '';
    }

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isResizing, isDragging, dragStart, panelWidth, panelPos.x]);

  const startResizing = (e: React.MouseEvent) => {
    setIsResizing(true);
    e.preventDefault();
  };

  const startDragging = (e: React.MouseEvent) => {
    if ((e.target as HTMLElement).closest('button')) return;
    setIsDragging(true);
    setDragStart({ x: e.clientX - panelPos.x, y: e.clientY - panelPos.y });
  };


  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        handleHeroChange('avatarUrl', reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSocialChange = (index: number, field: keyof SocialLink, value: string) => {
    const newSocials = [...data.hero.socials];
    newSocials[index] = { ...newSocials[index], [field]: value };
    handleHeroChange('socials', newSocials);
  };

  const addSocial = () => {
    handleHeroChange('socials', [...data.hero.socials, { platform: 'github', url: '' }]);
  };

  const removeSocial = (index: number) => {
    handleHeroChange('socials', data.hero.socials.filter((_, i) => i !== index));
  };

  const handleContactChange = (field: keyof PortfolioData['contact'], value: string) => {
    setData((prev) => ({ ...prev, contact: { ...prev.contact, [field]: value } }));
  };

  const handleAchievementChange = (index: number, field: keyof Achievement, value: string) => {
    const newAch = [...data.achievements];
    newAch[index] = { ...newAch[index], [field]: value };
    setData((prev) => ({ ...prev, achievements: newAch }));
  };

  const addAchievement = () => {
    const newAch: Achievement = {
      id: Date.now().toString(),
      type: 'job',
      title: '',
      organization: '',
      startDate: '',
      endDate: '',
      description: ''
    };
    setData((prev) => ({ ...prev, achievements: [...prev.achievements, newAch] }));
  };

  const removeAchievement = (index: number) => {
    setData((prev) => ({ ...prev, achievements: prev.achievements.filter((_, i) => i !== index) }));
  };

  const handleSkillChange = (index: number, value: string) => {
    const newSkills = [...data.skills];
    newSkills[index] = { ...newSkills[index], name: value };
    setData((prev) => ({ ...prev, skills: newSkills }));
  };

  const addSkill = () => {
    setData((prev) => ({ ...prev, skills: [...prev.skills, { id: Date.now().toString(), name: '' }] }));
  };

  const removeSkill = (index: number) => {
    setData((prev) => ({ ...prev, skills: prev.skills.filter((_, i) => i !== index) }));
  };

  const handleProjectChange = (index: number, field: keyof Project, value: string | string[]) => {
    const newProjects = [...data.projects];
    newProjects[index] = { ...newProjects[index], [field]: value };
    setData((prev) => ({ ...prev, projects: newProjects }));
  };

  const handleProjectImageUpload = (index: number, e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const newProjects = [...data.projects];
        newProjects[index] = { ...newProjects[index], images: [reader.result as string] };
        setData((prev) => ({ ...prev, projects: newProjects }));
      };
      reader.readAsDataURL(file);
    }
  };

  const addProject = () => {
    const newProject: Project = {
      id: Date.now().toString(),
      name: '',
      description: '',
      highlights: [''],
      techStack: [],
      images: [],
      githubUrl: '',
      liveUrl: '',
      demoVideoUrl: ''
    };
    setData((prev) => ({ ...prev, projects: [...prev.projects, newProject] }));
  };

  const removeProject = (index: number) => {
    setData((prev) => ({ ...prev, projects: prev.projects.filter((_, i) => i !== index) }));
  };

  const tabs = [
    { id: 'hero', label: 'Basic Info', icon: <User size={20} /> },
    { id: 'projects', label: 'Projects', icon: <Code size={20} /> },
    { id: 'achievements', label: 'Experience', icon: <Briefcase size={20} /> },
    { id: 'skills', label: 'Skills', icon: <Zap size={20} /> },
    { id: 'contact', label: 'Contact', icon: <Mail size={20} /> }
  ];

  return (
    <div className="relative flex h-screen w-screen bg-[#050505] text-white overflow-hidden font-sans">
      
      {/* Live Preview (Base Layer) */}
      <div className="absolute inset-0 z-0 h-full w-full overflow-y-auto overflow-x-hidden custom-scrollbar">
        {/* Render Template */}
        {selectedTemplate === 'software-engineer' ? (
          <DeveloperProTemplate data={data} />
        ) : (
          <ModernDeveloperTemplate data={data} />
        )}
      </div>

      {/* Floating Editor Panel */}
      {!isPreviewFullscreen && (
        <div 
          className={`absolute top-0 left-0 z-50 flex bg-[#121212]/95 backdrop-blur-3xl border border-white/10 rounded-2xl shadow-2xl transition-opacity duration-300 ease-in-out ${isCollapsed ? 'opacity-0 pointer-events-none' : 'opacity-100'}`}
          style={{ 
            width: `${panelWidth}px`, 
            height: 'calc(100vh - 32px)',
            transform: `translate(${panelPos.x}px, ${panelPos.y}px)` 
          }}
        >
          {/* Resize Handle */}
          <div 
            className="absolute top-0 -right-2 w-4 h-full cursor-col-resize z-[60] flex items-center justify-center group"
            onMouseDown={startResizing}
          >
            <div className={`w-1 h-16 rounded-full transition-colors ${isResizing ? 'bg-primary' : 'bg-white/10 group-hover:bg-primary/50'}`} />
          </div>

          {/* Left Icon Sidebar */}
          <div className="w-[72px] min-w-[72px] border-r border-white/10 flex flex-col items-center py-6 gap-6 bg-black/40 rounded-l-2xl">
            <Link href="/dashboard/templates" className="p-3 hover:bg-white/10 rounded-xl transition-colors text-white/70 hover:text-white" title="Back to Templates">
              <ArrowLeft size={20} />
            </Link>
            
            <div className="w-full h-px bg-white/10" />
            
            <div className="flex flex-col gap-2 w-full px-2">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as 'hero' | 'projects' | 'achievements' | 'skills' | 'contact')}
                  title={tab.label}
                  className={`p-3 rounded-xl flex justify-center items-center transition-all group relative ${
                    activeTab === tab.id 
                      ? 'bg-primary text-white shadow-lg shadow-primary/20' 
                      : 'text-white/50 hover:bg-white/5 hover:text-white'
                  }`}
                >
                  {tab.icon}
                  {/* Tooltip */}
                  <div className="absolute left-full ml-3 px-2 py-1 bg-black text-white text-xs font-bold rounded opacity-0 pointer-events-none group-hover:opacity-100 transition-opacity whitespace-nowrap z-50">
                    {tab.label}
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Main Form Content Wrapper */}
          <div className="flex-1 flex flex-col min-w-0 h-full">
            
            {/* Header */}
            <div 
              className="h-[72px] min-h-[72px] px-6 border-b border-white/10 flex items-center justify-between bg-white/[0.02] cursor-move"
              onMouseDown={startDragging}
            >
              <h2 className="font-bold text-lg tracking-wide select-none">
                {tabs.find(t => t.id === activeTab)?.label}
              </h2>
              <div className="flex items-center gap-3">
                <button onClick={() => setIsCollapsed(true)} className="p-2 hover:bg-white/10 text-white/50 hover:text-white rounded-full transition-colors" title="Hide Editor">
                  <X size={20} />
                </button>
                <button className="flex items-center gap-2 bg-primary text-white px-4 py-2 rounded-full text-sm font-bold hover:bg-primary/90 transition-colors shadow-lg shadow-primary/20">
                  <Save size={16} /> Save
                </button>
              </div>
            </div>

            {/* Scrollable Area */}
            <div className="flex-1 overflow-y-auto min-h-0 p-6 scroll-smooth custom-scrollbar">
              
              {/* HERO TAB */}
              {activeTab === 'hero' && (
                <div className="flex flex-col gap-6 animate-fade-in-up">
                  <div className="flex flex-col gap-5 bg-white/5 p-5 rounded-2xl border border-white/5">
                    
                    <div className="flex flex-col gap-2">
                      <label className="text-xs font-bold text-white/60 uppercase tracking-wider">Profile Photo</label>
                      <input 
                        type="file" 
                        accept="image/png, image/jpeg, image/webp"
                        onChange={handlePhotoUpload} 
                        className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-primary outline-none transition-all file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-xs file:font-bold file:bg-primary file:text-white hover:file:opacity-90 cursor-pointer text-white/80" 
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div className="flex flex-col gap-2">
                        <label className="text-xs font-bold text-white/60 uppercase tracking-wider">Name</label>
                        <input type="text" placeholder="John Doe" value={data.hero.logoText} onChange={(e) => handleHeroChange('logoText', e.target.value)} className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-sm focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all placeholder:text-white/30 text-white" />
                      </div>
                      <div className="flex flex-col gap-2">
                        <label className="text-xs font-bold text-white/60 uppercase tracking-wider">Job Title</label>
                        <input type="text" placeholder="Full-Stack Engineer" value={data.hero.title || ''} onChange={(e) => handleHeroChange('title', e.target.value)} className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-sm focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all placeholder:text-white/30 text-white" />
                      </div>
                    </div>

                    <div className="flex flex-col gap-2">
                      <label className="text-xs font-bold text-white/60 uppercase tracking-wider">Resume Link (Optional)</label>
                      <input type="url" placeholder="https://link-to-your-resume.pdf" value={data.hero.resumeUrl || ''} onChange={(e) => handleHeroChange('resumeUrl', e.target.value)} className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-sm focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all placeholder:text-white/30 text-white" />
                    </div>

                    <div className="flex flex-col gap-2 p-4 bg-[#111827] border border-white/10 rounded-xl">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <GitBranch className="w-5 h-5 text-white" />
                          <label className="text-xs font-bold text-white uppercase tracking-wider">GitHub Integration</label>
                        </div>
                      </div>
                      
                      {githubConnected ? (
                        <div className="mt-2 flex items-center gap-2 px-3 py-2 bg-green-500/10 border border-green-500/20 text-green-400 rounded-lg text-sm font-semibold">
                          <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                          Connected as @{githubHandle}
                        </div>
                      ) : (
                        <div className="mt-2">
                          <p className="text-xs text-white/50 mb-3">Connect your GitHub to automatically display your repositories and commit graph.</p>
                          <button 
                            onClick={handleConnectGithub}
                            disabled={isConnectingGithub}
                            className="w-full h-10 bg-white text-black hover:bg-neutral-200 disabled:opacity-50 text-sm font-bold rounded-lg transition-colors flex items-center justify-center gap-2"
                          >
                            {isConnectingGithub ? (
                              <Loader2 className="w-4 h-4 animate-spin" />
                            ) : (
                              'Connect GitHub Account'
                            )}
                          </button>
                        </div>
                      )}
                    </div>

                    <div className="flex flex-col gap-2">
                      <label className="text-xs font-bold text-white/60 uppercase tracking-wider">Hero Headline</label>
                      <input type="text" placeholder="Building scalable digital experiences." value={data.hero.tagline} onChange={(e) => handleHeroChange('tagline', e.target.value)} className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-sm focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all placeholder:text-white/30 text-white" />
                    </div>

                    <div className="flex flex-col gap-2">
                      <label className="text-xs font-bold text-white/60 uppercase tracking-wider">Bio</label>
                      <textarea rows={5} placeholder="Write a short bio..." value={data.hero.bio} onChange={(e) => handleHeroChange('bio', e.target.value)} className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-sm focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all resize-none placeholder:text-white/30 text-white" />
                    </div>
                  </div>

                  <div className="flex flex-col gap-4 bg-white/5 p-5 rounded-2xl border border-white/5">
                    <div className="flex items-center justify-between">
                      <h3 className="text-xs font-bold text-white/60 uppercase tracking-wider">Social Links</h3>
                      <button onClick={addSocial} className="text-primary hover:bg-primary/20 bg-primary/10 p-2 rounded-full transition-colors"><Plus size={16} /></button>
                    </div>
                    
                    <div className="flex flex-col gap-3">
                      {data.hero.socials.map((social, idx) => (
                        <div key={idx} className="flex gap-3 items-center bg-black/40 p-3 rounded-xl border border-white/5 focus-within:border-primary/50 transition-colors">
                          <select 
                            value={social.platform}
                            onChange={(e) => handleSocialChange(idx, 'platform', e.target.value)}
                            className="bg-transparent border-r border-white/10 pr-3 py-1 text-sm outline-none font-bold text-white/80 cursor-pointer"
                          >
                            <option value="github" className="bg-[#121212]">GitHub</option>
                            <option value="linkedin" className="bg-[#121212]">LinkedIn</option>
                            <option value="twitter" className="bg-[#121212]">Twitter</option>
                            <option value="youtube" className="bg-[#121212]">YouTube</option>
                            <option value="website" className="bg-[#121212]">Website</option>
                            <option value="leetcode" className="bg-[#121212]">LeetCode</option>
                            <option value="codeforces" className="bg-[#121212]">Codeforces</option>
                            <option value="codechef" className="bg-[#121212]">CodeChef</option>
                          </select>
                          <input type="text" placeholder="https://..." value={social.url} onChange={(e) => handleSocialChange(idx, 'url', e.target.value)} className="flex-1 bg-transparent px-2 text-sm outline-none placeholder:text-white/30 text-white" />
                          <button onClick={() => removeSocial(idx)} className="text-error hover:bg-error/20 bg-error/10 p-2 rounded-lg transition-colors"><Trash2 size={16} /></button>
                        </div>
                      ))}
                      {data.hero.socials.length === 0 && (
                        <div className="text-center py-6 text-white/30 text-sm font-semibold border-2 border-dashed border-white/10 rounded-xl">
                          No social links added.
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              )}

              {/* PROJECTS TAB */}
              {activeTab === 'projects' && (
                <div className="flex flex-col gap-6 animate-fade-in-up">
                  {data.projects.map((project, index) => (
                    <div key={project.id} className="bg-white/5 p-5 rounded-2xl border border-white/5 flex flex-col gap-5 relative group hover:border-primary/30 transition-all">
                      <button onClick={() => removeProject(index)} className="absolute top-4 right-4 text-error hover:bg-error/20 bg-black/40 p-2 rounded-full opacity-0 group-hover:opacity-100 transition-all shadow-sm"><Trash2 size={16} /></button>
                      
                      <div className="flex items-center gap-3 border-b border-white/10 pb-4 pr-10">
                        <div className="w-8 h-8 rounded-full bg-primary/20 text-primary flex items-center justify-center font-bold text-xs">{index + 1}</div>
                        <input type="text" placeholder="Project Name" value={project.name} onChange={(e) => handleProjectChange(index, 'name', e.target.value)} className="flex-1 bg-transparent text-xl font-bold focus:outline-none placeholder:text-white/30 text-white" />
                      </div>

                      <div className="flex flex-col gap-2">
                        <label className="text-xs font-bold text-white/60 uppercase tracking-wider">Thumbnail Image</label>
                        <input 
                          type="file" 
                          accept="image/*"
                          onChange={(e) => handleProjectImageUpload(index, e)} 
                          className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-sm focus:border-primary outline-none transition-all file:mr-4 file:py-1.5 file:px-4 file:rounded-full file:border-0 file:text-xs file:font-bold file:bg-white/10 file:text-white hover:file:bg-white/20 cursor-pointer text-white/80" 
                        />
                      </div>

                      <div className="flex flex-col gap-2">
                        <label className="text-xs font-bold text-white/60 uppercase tracking-wider">Description</label>
                        <textarea rows={3} placeholder="What does this project do?" value={project.description} onChange={(e) => handleProjectChange(index, 'description', e.target.value)} className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-sm focus:border-primary focus:ring-1 focus:ring-primary outline-none resize-none placeholder:text-white/30 text-white" />
                      </div>

                      <div className="flex flex-col gap-2">
                        <label className="text-xs font-bold text-white/60 uppercase tracking-wider">Tech Stack (comma separated)</label>
                        <input 
                          type="text" 
                          placeholder="React, Node.js, Tailwind..."
                          value={project.techStack.join(', ')} 
                          onChange={(e) => handleProjectChange(index, 'techStack', e.target.value.split(',').map(s => s.trim()))} 
                          className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-sm focus:border-primary focus:ring-1 focus:ring-primary outline-none placeholder:text-white/30 text-white" 
                        />
                      </div>

                      <div className="flex flex-col gap-4">
                        <div className="flex flex-col gap-2">
                          <label className="text-xs font-bold text-white/60 uppercase tracking-wider">GitHub URL (Optional)</label>
                          <input type="text" placeholder="https://github.com/..." value={project.githubUrl || ''} onChange={(e) => handleProjectChange(index, 'githubUrl', e.target.value)} className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-sm focus:border-primary focus:ring-1 focus:ring-primary outline-none placeholder:text-white/30 text-white" />
                        </div>
                        <div className="flex flex-col gap-2">
                          <label className="text-xs font-bold text-white/60 uppercase tracking-wider">Live URL (Optional)</label>
                          <input type="text" placeholder="https://..." value={project.liveUrl || ''} onChange={(e) => handleProjectChange(index, 'liveUrl', e.target.value)} className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-sm focus:border-primary focus:ring-1 focus:ring-primary outline-none placeholder:text-white/30 text-white" />
                        </div>
                        <div className="flex flex-col gap-2">
                          <label className="text-xs font-bold text-white/60 uppercase tracking-wider">Demo Video URL (Optional)</label>
                          <input type="text" placeholder="https://youtube.com/..." value={project.demoVideoUrl || ''} onChange={(e) => handleProjectChange(index, 'demoVideoUrl', e.target.value)} className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-sm focus:border-primary focus:ring-1 focus:ring-primary outline-none placeholder:text-white/30 text-white" />
                        </div>
                      </div>
                    </div>
                  ))}
                  
                  <button onClick={addProject} className="w-full py-5 border-2 border-dashed border-white/20 rounded-2xl text-white font-bold hover:bg-white/5 hover:border-white/40 transition-all flex items-center justify-center gap-2">
                    <Plus size={18} /> Add New Project
                  </button>
                </div>
              )}

              {/* ACHIEVEMENTS TAB */}
              {activeTab === 'achievements' && (
                <div className="flex flex-col gap-6 animate-fade-in-up">
                  {data.achievements.map((ach, index) => (
                    <div key={ach.id} className="bg-white/5 p-5 rounded-2xl border border-white/5 flex flex-col gap-5 relative group hover:border-primary/30 transition-all">
                      <button onClick={() => removeAchievement(index)} className="absolute top-4 right-4 text-error hover:bg-error/20 bg-black/40 p-2 rounded-full opacity-0 group-hover:opacity-100 transition-all shadow-sm"><Trash2 size={16} /></button>
                      
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pb-2 border-b border-white/10">
                        <div className="flex flex-col gap-2">
                          <label className="text-xs font-bold text-white/60 uppercase tracking-wider">Role / Title</label>
                          <input type="text" placeholder="Senior Developer" value={ach.title} onChange={(e) => handleAchievementChange(index, 'title', e.target.value)} className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-sm focus:border-primary focus:ring-1 focus:ring-primary outline-none font-bold text-white placeholder:text-white/30" />
                        </div>
                        <div className="flex flex-col gap-2">
                          <label className="text-xs font-bold text-white/60 uppercase tracking-wider">Type</label>
                          <select value={ach.type} onChange={(e) => handleAchievementChange(index, 'type', e.target.value)} className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-sm focus:border-primary focus:ring-1 focus:ring-primary outline-none text-white cursor-pointer">
                            <option value="job" className="bg-[#121212]">Job</option>
                            <option value="internship" className="bg-[#121212]">Internship</option>
                            <option value="freelance" className="bg-[#121212]">Freelance</option>
                            <option value="achievement" className="bg-[#121212]">Achievement</option>
                          </select>
                        </div>
                      </div>

                      <div className="flex flex-col gap-2">
                        <label className="text-xs font-bold text-white/60 uppercase tracking-wider">Company / Organization</label>
                        <input type="text" placeholder="Google" value={ach.organization || ''} onChange={(e) => handleAchievementChange(index, 'organization', e.target.value)} className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-sm focus:border-primary focus:ring-1 focus:ring-primary outline-none text-white placeholder:text-white/30" />
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <div className="flex flex-col gap-2">
                          <label className="text-xs font-bold text-white/60 uppercase tracking-wider">Start Date</label>
                          <input type="text" placeholder="Jan 2022" value={ach.startDate} onChange={(e) => handleAchievementChange(index, 'startDate', e.target.value)} className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-sm focus:border-primary focus:ring-1 focus:ring-primary outline-none text-white placeholder:text-white/30" />
                        </div>
                        <div className="flex flex-col gap-2">
                          <label className="text-xs font-bold text-white/60 uppercase tracking-wider">End Date</label>
                          <input type="text" placeholder="Present" value={ach.endDate} onChange={(e) => handleAchievementChange(index, 'endDate', e.target.value)} className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-sm focus:border-primary focus:ring-1 focus:ring-primary outline-none text-white placeholder:text-white/30" />
                        </div>
                      </div>
                      
                      <div className="flex flex-col gap-2 pt-2">
                        <label className="text-xs font-bold text-white/60 uppercase tracking-wider">Description</label>
                        <textarea rows={4} placeholder="What were your key responsibilities and achievements?" value={ach.description} onChange={(e) => handleAchievementChange(index, 'description', e.target.value)} className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-sm focus:border-primary focus:ring-1 focus:ring-primary outline-none resize-none text-white placeholder:text-white/30" />
                      </div>
                    </div>
                  ))}
                  
                  <button onClick={addAchievement} className="w-full py-5 border-2 border-dashed border-white/20 rounded-2xl text-white font-bold hover:bg-white/5 hover:border-white/40 transition-all flex items-center justify-center gap-2">
                    <Plus size={18} /> Add Experience / Achievement
                  </button>
                </div>
              )}

              {/* SKILLS TAB */}
              {activeTab === 'skills' && (
                <div className="flex flex-col gap-6 animate-fade-in-up bg-white/5 p-6 rounded-2xl border border-white/5">
                  <div className="flex items-center justify-between">
                    <h3 className="text-xs font-bold text-white/60 uppercase tracking-wider">Core Skills</h3>
                    <button onClick={addSkill} className="text-primary hover:bg-primary/20 bg-primary/10 p-2 rounded-full transition-colors"><Plus size={16} /></button>
                  </div>
                  
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-4">
                    {data.skills.map((skill, index) => (
                      <div key={skill.id} className="relative group">
                        <input 
                          type="text" 
                          value={skill.name} 
                          onChange={(e) => handleSkillChange(index, e.target.value)} 
                          className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-sm font-bold focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-colors text-white placeholder:text-white/30"
                          placeholder="e.g. React.js" 
                        />
                        <button onClick={() => removeSkill(index)} className="absolute right-2 top-1/2 -translate-y-1/2 text-error hover:bg-error/20 bg-white/5 p-1.5 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity"><Trash2 size={14} /></button>
                      </div>
                    ))}
                  </div>
                  
                  {data.skills.length === 0 && (
                    <div className="text-center py-10 text-white/30 text-sm font-bold border-2 border-dashed border-white/10 rounded-xl mt-4">
                      No skills added yet. Click the + button to add one.
                    </div>
                  )}
                </div>
              )}

              {/* CONTACT TAB */}
              {activeTab === 'contact' && (
                <div className="flex flex-col gap-6 animate-fade-in-up bg-white/5 p-6 rounded-2xl border border-white/5">
                  
                  <div className="flex flex-col gap-5 pt-2">
                    <div className="flex flex-col gap-2">
                      <label className="text-xs font-bold text-white/60 uppercase tracking-wider">Public Email Address</label>
                      <input type="email" placeholder="hello@example.com" value={data.contact.email} onChange={(e) => handleContactChange('email', e.target.value)} className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-sm focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all text-white placeholder:text-white/30" />
                    </div>
                    <div className="flex flex-col gap-2">
                      <label className="text-xs font-bold text-white/60 uppercase tracking-wider">Location Display</label>
                      <input type="text" placeholder="San Francisco, CA" value={data.contact.location} onChange={(e) => handleContactChange('location', e.target.value)} className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-sm focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all text-white placeholder:text-white/30" />
                    </div>
                  </div>
                </div>
              )}

            </div>
          </div>
        </div>
      )}

      {/* Re-Open Toggle Button when collapsed */}
      {!isPreviewFullscreen && isCollapsed && (
        <button 
          onClick={() => setIsCollapsed(false)}
          className="absolute top-6 left-6 z-50 bg-[#121212]/95 text-white p-4 rounded-full shadow-2xl border border-white/10 backdrop-blur-md hover:bg-white/10 hover:scale-105 transition-all flex items-center gap-2 group animate-fade-in-up"
        >
          <Edit3 size={20} className="text-primary" />
          <span className="font-bold text-sm tracking-wider pr-2">EDIT PORTFOLIO</span>
        </button>
      )}

      {/* Overlay to block pointer events on preview when resizing to avoid iframe catching mouse events */}
      {isResizing && <div className="absolute inset-0 z-40 cursor-col-resize" />}
      
      {/* Scrollbar CSS */}
      <style dangerouslySetInnerHTML={{__html: `
        .custom-scrollbar::-webkit-scrollbar {
          width: 6px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: transparent;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background-color: rgba(255, 255, 255, 0.1);
          border-radius: 10px;
        }
        .custom-scrollbar:hover::-webkit-scrollbar-thumb {
          background-color: rgba(255, 255, 255, 0.2);
        }
      `}} />
    </div>
  );
}
