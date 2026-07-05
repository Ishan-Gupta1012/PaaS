'use client';

import React, { useState, useEffect } from 'react';
import { initialPortfolioData, PortfolioData, Achievement, Project, SocialLink } from '@/types/portfolio';
import ModernDeveloperTemplate from '@/components/templates/ModernDeveloper';
import DeveloperProTemplate from '@/components/templates/DeveloperPro';
import Link from 'next/link';
import { ArrowLeft, Save, Plus, Trash2, User, Briefcase, Code, Mail, Edit3, X, Zap } from 'lucide-react';

interface FormGroupProps {
  label: string;
  children: React.ReactNode;
}

const FormGroup = ({ label, children }: FormGroupProps) => (
  <div className="flex flex-col gap-2.5 w-full">
    <label className="text-[10px] font-bold text-white/40 tracking-wider uppercase">
      {label}
    </label>
    {children}
  </div>
);

interface FormFieldProps extends React.InputHTMLAttributes<HTMLInputElement> {}

const FormField = React.forwardRef<HTMLInputElement, FormFieldProps>((props, ref) => (
  <input
    ref={ref}
    {...props}
    className="w-full bg-[#0D0D10] border border-white/5 rounded-xl px-4 py-4 text-sm focus:border-primary/50 focus:ring-1 focus:ring-primary/20 outline-none transition-all placeholder:text-zinc-500 text-white hover:border-white/10"
  />
));
FormField.displayName = 'FormField';

interface FormTextAreaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {}

const FormTextArea = React.forwardRef<HTMLTextAreaElement, FormTextAreaProps>((props, ref) => (
  <textarea
    ref={ref}
    {...props}
    className="w-full bg-[#0D0D10] border border-white/5 rounded-xl px-4 py-4 text-sm focus:border-primary/50 focus:ring-1 focus:ring-primary/20 outline-none transition-all resize-none placeholder:text-zinc-500 text-white hover:border-white/10 min-h-[120px]"
  />
));
FormTextArea.displayName = 'FormTextArea';

interface FormSelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  children: React.ReactNode;
}

const FormSelect = React.forwardRef<HTMLSelectElement, FormSelectProps>(({ children, ...props }, ref) => (
  <select
    ref={ref}
    {...props}
    className="w-full bg-[#0D0D10] border border-white/5 rounded-xl px-4 py-4 text-sm focus:border-primary/50 outline-none text-white cursor-pointer hover:border-white/10 transition-colors"
  >
    {children}
  </select>
));
FormSelect.displayName = 'FormSelect';

interface FormCardProps {
  children: React.ReactNode;
  className?: string;
  onRemove?: () => void;
  indexLabel?: number;
  titlePlaceholder?: string;
  titleValue?: string;
  onTitleChange?: (val: string) => void;
}

const FormCard = ({ 
  children, 
  className = "", 
  onRemove,
  indexLabel,
  titlePlaceholder,
  titleValue,
  onTitleChange 
}: FormCardProps) => (
  <div className={`bg-[#121214] p-8 rounded-2xl border border-white/5 shadow-inner flex flex-col gap-6 relative group hover:border-white/10 transition-all ${className}`}>
    {onRemove && (
      <button 
        onClick={onRemove} 
        className="absolute top-6 right-6 text-error hover:bg-error/20 bg-black/40 p-2.5 rounded-full opacity-0 group-hover:opacity-100 transition-all shadow-sm z-10"
        title="Remove"
      >
        <Trash2 size={16} />
      </button>
    )}
    
    {indexLabel !== undefined && onTitleChange !== undefined && (
      <div className="flex items-center gap-3 border-b border-white/5 pb-4 pr-10">
        <span className="text-primary font-bold text-xl">{indexLabel}</span>
        <input 
          type="text" 
          placeholder={titlePlaceholder} 
          value={titleValue} 
          onChange={(e) => onTitleChange(e.target.value)} 
          className="flex-1 bg-transparent text-xl font-bold focus:outline-none placeholder:text-white/20 text-white" 
        />
      </div>
    )}
    
    {children}
  </div>
);

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
        setSelectedTemplate(temp);
      }
    }
  }, []);
  
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

  const handleHeroChange = <K extends keyof PortfolioData['hero']>(field: K, value: PortfolioData['hero'][K]) => {
    setData((prev) => ({ ...prev, hero: { ...prev.hero, [field]: value } }));
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
          className={`absolute top-0 left-0 z-50 flex bg-[#16161A]/95 backdrop-blur-3xl border border-white/5 rounded-2xl shadow-2xl transition-opacity duration-300 ease-in-out ${isCollapsed ? 'opacity-0 pointer-events-none' : 'opacity-100'}`}
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
          <div className="w-16 min-w-[64px] border-r border-white/10 flex flex-col items-center py-6 gap-6 bg-black/40 rounded-l-2xl">
            <Link href="/dashboard/templates" className="w-11 h-11 flex justify-center items-center hover:bg-white/5 rounded-xl transition-colors text-white/50 hover:text-white" title="Back to Templates">
              <ArrowLeft size={20} />
            </Link>
            
            <div className="w-full h-px bg-white/5" />
            
            <div className="flex flex-col gap-2.5 w-full px-2.5">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as 'hero' | 'projects' | 'achievements' | 'skills' | 'contact')}
                  title={tab.label}
                  className={`w-11 h-11 rounded-xl flex justify-center items-center transition-all group relative ${
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
              className="h-[72px] min-h-[72px] px-8 border-b border-white/5 flex items-center justify-between bg-white/[0.01] cursor-move"
              onMouseDown={startDragging}
            >
              <h2 className="font-bold text-lg tracking-wide select-none">
                {tabs.find(t => t.id === activeTab)?.label}
              </h2>
              <div className="flex items-center gap-3">
                <button onClick={() => setIsCollapsed(true)} className="p-2 hover:bg-white/5 text-white/40 hover:text-white rounded-full transition-colors" title="Hide Editor">
                  <X size={20} />
                </button>
                <button className="flex items-center gap-2 bg-primary text-white px-5 py-2.5 rounded-full text-sm font-bold hover:bg-primary/95 transition-all shadow-lg shadow-primary/20 hover:scale-[1.02] active:scale-[0.98]">
                  <Save size={16} /> Save
                </button>
              </div>
            </div>
 
            {/* Scrollable Area */}
            <div className="flex-1 overflow-y-auto min-h-0 px-6 md:px-8 pt-6 pb-12 scroll-smooth custom-scrollbar">
              
              {/* HERO TAB */}
              {activeTab === 'hero' && (
                <div className="space-y-8 animate-fade-in-up">
                  <FormCard>
                    <FormGroup label="Profile Photo">
                      <div className="flex items-center gap-4 bg-[#0D0D10] border border-white/5 rounded-xl px-4 py-4">
                        <label className="cursor-pointer bg-[#232328] hover:bg-[#2e2e35] text-white text-xs font-bold px-4 py-2.5 rounded-lg border border-white/5 transition-all">
                          Choose File
                          <input 
                            type="file" 
                            accept="image/png, image/jpeg, image/webp"
                            onChange={handlePhotoUpload} 
                            className="hidden" 
                          />
                        </label>
                        <span className="text-xs text-white/50 truncate">
                          {data.hero.avatarUrl ? "Photo Uploaded" : "No file chosen"}
                        </span>
                      </div>
                    </FormGroup>
 
                    <FormGroup label="Name">
                      <FormField placeholder="John Doe" value={data.hero.logoText} onChange={(e) => handleHeroChange('logoText', e.target.value)} />
                    </FormGroup>

                    <FormGroup label="Job Title">
                      <FormField placeholder="Full-Stack Engineer" value={data.hero.title || ''} onChange={(e) => handleHeroChange('title', e.target.value)} />
                    </FormGroup>

                    <FormGroup label="Resume Link (Optional)">
                      <FormField type="url" placeholder="https://link-to-your-resume.pdf" value={data.hero.resumeUrl || ''} onChange={(e) => handleHeroChange('resumeUrl', e.target.value)} />
                    </FormGroup>
 
                    <FormGroup label="Hero Headline">
                      <FormField placeholder="Building scalable digital experiences." value={data.hero.tagline} onChange={(e) => handleHeroChange('tagline', e.target.value)} />
                    </FormGroup>
 
                    <FormGroup label="Bio">
                      <FormTextArea rows={6} placeholder="Write a short bio..." value={data.hero.bio} onChange={(e) => handleHeroChange('bio', e.target.value)} className="min-h-[160px]" />
                    </FormGroup>
                  </FormCard>
 
                  <FormCard>
                    <div className="flex items-center justify-between border-b border-white/5 pb-4">
                      <h3 className="text-[10px] font-bold text-white/40 tracking-wider uppercase">Social Links</h3>
                    </div>
                    
                    <div className="flex flex-col gap-4">
                      {data.hero.socials.map((social, idx) => (
                        <div key={idx} className="flex gap-3 items-center bg-[#0D0D10] p-4 rounded-xl border border-white/5 focus-within:border-primary/30 transition-colors">
                          <select 
                            value={social.platform}
                            onChange={(e) => handleSocialChange(idx, 'platform', e.target.value)}
                            className="bg-transparent border-r border-white/5 pr-4 py-1 text-sm outline-none font-bold text-white/80 cursor-pointer"
                          >
                            <option value="github" className="bg-[#16161A]">GitHub</option>
                            <option value="linkedin" className="bg-[#16161A]">LinkedIn</option>
                            <option value="twitter" className="bg-[#16161A]">Twitter</option>
                            <option value="youtube" className="bg-[#16161A]">YouTube</option>
                            <option value="website" className="bg-[#16161A]">Website</option>
                            <option value="leetcode" className="bg-[#16161A]">LeetCode</option>
                            <option value="codeforces" className="bg-[#16161A]">Codeforces</option>
                            <option value="codechef" className="bg-[#16161A]">CodeChef</option>
                          </select>
                          <input type="text" placeholder="https://..." value={social.url} onChange={(e) => handleSocialChange(idx, 'url', e.target.value)} className="flex-1 bg-transparent px-2 text-sm outline-none placeholder:text-zinc-500 text-white" />
                          <button onClick={() => removeSocial(idx)} className="text-error hover:bg-error/20 bg-error/10 p-2.5 rounded-lg transition-colors"><Trash2 size={16} /></button>
                        </div>
                      ))}
                      
                      <button onClick={addSocial} className="w-full py-4 border border-dashed border-white/10 hover:border-white/20 rounded-xl text-white/50 hover:text-white font-bold text-xs hover:bg-white/[0.01] transition-all flex items-center justify-center gap-2">
                        <Plus size={14} /> Add Social Link
                      </button>
                    </div>
                  </FormCard>
                </div>
              )}
 
              {/* PROJECTS TAB */}
              {activeTab === 'projects' && (
                <div className="space-y-8 animate-fade-in-up">
                  {data.projects.map((project, index) => (
                    <FormCard
                      key={project.id}
                      indexLabel={index + 1}
                      titlePlaceholder="Project Name"
                      titleValue={project.name}
                      onTitleChange={(val) => handleProjectChange(index, 'name', val)}
                      onRemove={() => removeProject(index)}
                    >
                      <FormGroup label="Thumbnail Image">
                        <div className="flex items-center gap-4 bg-[#0D0D10] border border-white/5 rounded-xl px-4 py-4">
                          <label className="cursor-pointer bg-[#232328] hover:bg-[#2e2e35] text-white text-xs font-bold px-4 py-2.5 rounded-lg border border-white/5 transition-all">
                            Choose File
                            <input 
                              type="file" 
                              accept="image/*"
                              onChange={(e) => handleProjectImageUpload(index, e)} 
                              className="hidden" 
                            />
                          </label>
                          <span className="text-xs text-white/50 truncate">
                            {project.images?.[0] ? "Thumbnail Uploaded" : "No file chosen"}
                          </span>
                        </div>
                      </FormGroup>
 
                      <FormGroup label="Description">
                        <FormTextArea rows={3} placeholder="What does this project do?" value={project.description} onChange={(e) => handleProjectChange(index, 'description', e.target.value)} />
                      </FormGroup>
 
                      <FormGroup label="Tech Stack (comma separated)">
                        <FormField placeholder="React, Node.js, Tailwind..." value={project.techStack.join(', ')} onChange={(e) => handleProjectChange(index, 'techStack', e.target.value.split(',').map(s => s.trim()))} />
                      </FormGroup>
 
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                        <FormGroup label="GitHub URL (Optional)">
                          <FormField placeholder="https://github.com/..." value={project.githubUrl || ''} onChange={(e) => handleProjectChange(index, 'githubUrl', e.target.value)} />
                        </FormGroup>
                        <FormGroup label="Live URL (Optional)">
                          <FormField placeholder="https://..." value={project.liveUrl || ''} onChange={(e) => handleProjectChange(index, 'liveUrl', e.target.value)} />
                        </FormGroup>
                      </div>
                      
                      <FormGroup label="Demo Video URL (Optional)">
                        <FormField placeholder="https://youtube.com/..." value={project.demoVideoUrl || ''} onChange={(e) => handleProjectChange(index, 'demoVideoUrl', e.target.value)} />
                      </FormGroup>
                    </FormCard>
                  ))}
                  
                  <button onClick={addProject} className="w-full py-4 border border-dashed border-white/10 hover:border-white/20 rounded-xl text-white/50 hover:text-white font-bold text-xs hover:bg-white/[0.01] transition-all flex items-center justify-center gap-2">
                    <Plus size={14} /> Add New Project
                  </button>
                </div>
              )}
 
              {/* ACHIEVEMENTS TAB */}
              {activeTab === 'achievements' && (
                <div className="space-y-8 animate-fade-in-up">
                  {data.achievements.map((ach, index) => (
                    <FormCard
                      key={ach.id}
                      indexLabel={index + 1}
                      titlePlaceholder="Role / Title"
                      titleValue={ach.title}
                      onTitleChange={(val) => handleAchievementChange(index, 'title', val)}
                      onRemove={() => removeAchievement(index)}
                    >
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                        <FormGroup label="Company / Organization">
                          <FormField placeholder="Google" value={ach.organization || ''} onChange={(e) => handleAchievementChange(index, 'organization', e.target.value)} />
                        </FormGroup>
                        <FormGroup label="Type">
                          <FormSelect value={ach.type} onChange={(e) => handleAchievementChange(index, 'type', e.target.value)}>
                            <option value="job" className="bg-[#16161A]">Job</option>
                            <option value="internship" className="bg-[#16161A]">Internship</option>
                            <option value="freelance" className="bg-[#16161A]">Freelance</option>
                            <option value="achievement" className="bg-[#16161A]">Achievement</option>
                          </FormSelect>
                        </FormGroup>
                      </div>
 
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                        <FormGroup label="Start Date">
                          <FormField placeholder="Jan 2022" value={ach.startDate} onChange={(e) => handleAchievementChange(index, 'startDate', e.target.value)} />
                        </FormGroup>
                        <FormGroup label="End Date">
                          <FormField placeholder="Present" value={ach.endDate} onChange={(e) => handleAchievementChange(index, 'endDate', e.target.value)} />
                        </FormGroup>
                      </div>
                      
                      <FormGroup label="Description">
                        <FormTextArea rows={4} placeholder="What were your key responsibilities and achievements?" value={ach.description} onChange={(e) => handleAchievementChange(index, 'description', e.target.value)} />
                      </FormGroup>
                    </FormCard>
                  ))}
                  
                  <button onClick={addAchievement} className="w-full py-4 border border-dashed border-white/10 hover:border-white/20 rounded-xl text-white/50 hover:text-white font-bold text-xs hover:bg-white/[0.01] transition-all flex items-center justify-center gap-2">
                    <Plus size={14} /> Add Experience / Achievement
                  </button>
                </div>
              )}
 
              {/* SKILLS TAB */}
              {activeTab === 'skills' && (
                <div className="space-y-8 animate-fade-in-up">
                  <FormCard>
                    <div className="flex items-center justify-between border-b border-white/5 pb-4">
                      <h3 className="text-[10px] font-bold text-white/40 tracking-wider uppercase">Core Skills</h3>
                    </div>
                    
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      {data.skills.map((skill, index) => (
                        <div key={skill.id} className="relative group">
                          <FormField 
                            value={skill.name} 
                            onChange={(e) => handleSkillChange(index, e.target.value)} 
                            placeholder="e.g. React.js" 
                          />
                          <button onClick={() => removeSkill(index)} className="absolute right-3 top-1/2 -translate-y-1/2 text-error hover:bg-error/20 bg-white/5 p-2 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity"><Trash2 size={14} /></button>
                        </div>
                      ))}
                    </div>
                    
                    <button onClick={addSkill} className="w-full py-4 border border-dashed border-white/10 hover:border-white/20 rounded-xl text-white/50 hover:text-white font-bold text-xs hover:bg-white/[0.01] transition-all flex items-center justify-center gap-2">
                      <Plus size={14} /> Add Skill
                    </button>
                    
                    {data.skills.length === 0 && (
                      <div className="text-center py-10 text-white/20 text-sm font-bold border border-dashed border-white/5 rounded-xl">
                        No skills added yet. Click the Add Skill button to add one.
                      </div>
                    )}
                  </FormCard>
                </div>
              )}
 
              {/* CONTACT TAB */}
              {activeTab === 'contact' && (
                <div className="space-y-8 animate-fade-in-up">
                  <FormCard>
                    <FormGroup label="Public Email Address">
                      <FormField type="email" placeholder="hello@example.com" value={data.contact.email} onChange={(e) => handleContactChange('email', e.target.value)} />
                    </FormGroup>
                    <FormGroup label="Location Display">
                      <FormField type="text" placeholder="San Francisco, CA" value={data.contact.location} onChange={(e) => handleContactChange('location', e.target.value)} />
                    </FormGroup>
                  </FormCard>
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
