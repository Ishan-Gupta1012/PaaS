'use client';

import React, { useState } from 'react';
import { initialPortfolioData, PortfolioData, Achievement, Project, SocialLink } from '@/types/portfolio';
import ModernDeveloperTemplate from '@/components/templates/ModernDeveloper';
import Link from 'next/link';
import { ArrowLeft, Save, LayoutTemplate, Plus, Trash2, Maximize2, Minimize2 } from 'lucide-react';

export default function BuilderPage() {
  const [data, setData] = useState<PortfolioData>(initialPortfolioData);
  const [isPreviewFullscreen, setIsPreviewFullscreen] = useState(false);

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

  return (
    <div className="flex h-screen bg-surface-container-lowest text-on-surface overflow-hidden">
      
      {/* Left Pane: Editor */}
      {!isPreviewFullscreen && (
        <div className="w-1/3 min-w-[400px] max-w-[500px] border-r border-outline-variant bg-surface-container-low flex flex-col h-full overflow-y-auto z-50">
        
        {/* Header */}
        <div className="p-4 border-b border-outline-variant sticky top-0 bg-surface-container-low/90 backdrop-blur z-10 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Link href="/dashboard/templates" className="p-2 hover:bg-surface-container-lowest rounded-full transition-colors">
              <ArrowLeft size={18} />
            </Link>
            <h1 className="font-bold text-lg flex items-center gap-2">
              <LayoutTemplate size={18} className="text-primary" />
              Live Builder
            </h1>
          </div>
          <button className="flex items-center gap-2 bg-primary text-on-primary px-4 py-2 rounded-lg text-sm font-semibold hover:opacity-90 transition-opacity">
            <Save size={16} /> Save
          </button>
        </div>

        {/* Form Content */}
        <div className="p-6 space-y-12 pb-24">
          
          {/* Section: Hero */}
          <div className="space-y-4">
            <h2 className="text-sm font-bold uppercase tracking-widest text-on-surface-variant border-b border-outline-variant pb-2">Hero Section</h2>
            <div className="space-y-1">
              <label className="text-xs font-semibold text-on-surface-variant">Photo Upload</label>
              <input 
                type="file" 
                accept="image/png, image/jpeg, image/webp"
                onChange={handlePhotoUpload} 
                className="w-full bg-surface-container-lowest border border-outline-variant rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-primary outline-none transition-all file:mr-4 file:py-1 file:px-3 file:rounded-md file:border-0 file:text-xs file:font-semibold file:bg-primary/10 file:text-primary hover:file:bg-primary/20 cursor-pointer" 
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="text-xs font-semibold text-on-surface-variant">Name / Logo</label>
                <input type="text" placeholder="e.g. John Doe" value={data.hero.logoText} onChange={(e) => handleHeroChange('logoText', e.target.value)} className="w-full bg-surface-container-lowest border border-outline-variant rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-primary outline-none transition-all" />
              </div>
              <div className="space-y-1">
                <label className="text-xs font-semibold text-on-surface-variant">Location</label>
                <input type="text" placeholder="e.g. New York, USA" value={data.hero.location} onChange={(e) => handleHeroChange('location', e.target.value)} className="w-full bg-surface-container-lowest border border-outline-variant rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-primary outline-none transition-all" />
              </div>
            </div>
            <div className="space-y-1">
              <label className="text-xs font-semibold text-on-surface-variant">Tagline (White text)</label>
              <input type="text" placeholder="e.g. I build" value={data.hero.tagline} onChange={(e) => handleHeroChange('tagline', e.target.value)} className="w-full bg-surface-container-lowest border border-outline-variant rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-primary outline-none transition-all" />
            </div>
            <div className="space-y-1">
              <label className="text-xs font-semibold text-on-surface-variant">Tagline Highlight (Gradient)</label>
              <input type="text" placeholder="e.g. scalable web applications" value={data.hero.taglineHighlight} onChange={(e) => handleHeroChange('taglineHighlight', e.target.value)} className="w-full bg-surface-container-lowest border border-outline-variant rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-primary outline-none transition-all" />
            </div>
            <div className="space-y-1">
              <label className="text-xs font-semibold text-on-surface-variant">Bio</label>
              <textarea rows={4} placeholder="Write a short bio about yourself..." value={data.hero.bio} onChange={(e) => handleHeroChange('bio', e.target.value)} className="w-full bg-surface-container-lowest border border-outline-variant rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-primary outline-none transition-all resize-none" />
            </div>
            
            <div className="pt-4 space-y-3">
              <div className="flex items-center justify-between">
                <label className="text-xs font-semibold text-on-surface-variant">Social Links</label>
                <button onClick={addSocial} className="text-primary hover:bg-primary/10 p-1 rounded transition-colors"><Plus size={16} /></button>
              </div>
              {data.hero.socials.map((social, idx) => (
                <div key={idx} className="flex gap-2 items-center bg-surface-container-lowest p-2 rounded-lg border border-outline-variant">
                  <select 
                    value={social.platform}
                    onChange={(e) => handleSocialChange(idx, 'platform', e.target.value)}
                    className="bg-transparent border-r border-outline-variant pr-2 py-1 text-sm outline-none"
                  >
                    <option value="github">GitHub</option>
                    <option value="linkedin">LinkedIn</option>
                    <option value="twitter">Twitter</option>
                    <option value="youtube">YouTube</option>
                    <option value="codeforces">Codeforces</option>
                    <option value="leetcode">LeetCode</option>
                    <option value="website">Website</option>
                  </select>
                  <input type="text" placeholder="URL" value={social.url} onChange={(e) => handleSocialChange(idx, 'url', e.target.value)} className="flex-1 bg-transparent px-2 text-sm outline-none" />
                  <button onClick={() => removeSocial(idx)} className="text-error hover:bg-error/10 p-1 rounded"><Trash2 size={14} /></button>
                </div>
              ))}
            </div>
          </div>

          {/* Section: Projects */}
          <div className="space-y-4">
            <div className="flex items-center justify-between border-b border-outline-variant pb-2">
              <h2 className="text-sm font-bold uppercase tracking-widest text-on-surface-variant">Projects</h2>
              <button onClick={addProject} className="text-primary hover:bg-primary/10 p-1 rounded transition-colors flex items-center gap-1 text-xs font-semibold"><Plus size={14} /> Add</button>
            </div>
            {data.projects.map((project, index) => (
              <div key={project.id} className="p-4 bg-surface-container-lowest border border-outline-variant rounded-xl space-y-3 relative group">
                <button onClick={() => removeProject(index)} className="absolute top-2 right-2 text-error hover:bg-error/10 p-1 rounded opacity-0 group-hover:opacity-100 transition-opacity"><Trash2 size={14} /></button>
                
                <div className="space-y-1 pr-6">
                  <label className="text-[10px] font-semibold text-on-surface-variant uppercase">Project Name</label>
                  <input type="text" placeholder="e.g. E-Commerce Platform" value={project.name} onChange={(e) => handleProjectChange(index, 'name', e.target.value)} className="w-full bg-surface-container-low border border-outline-variant rounded-lg px-2 py-1.5 text-xs focus:ring-2 focus:ring-primary outline-none" />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-semibold text-on-surface-variant uppercase">Project Image Upload</label>
                  <input 
                    type="file" 
                    accept="image/png, image/jpeg, image/webp"
                    onChange={(e) => handleProjectImageUpload(index, e)} 
                    className="w-full bg-surface-container-low border border-outline-variant rounded-lg px-2 py-1 text-xs focus:ring-2 focus:ring-primary outline-none transition-all file:mr-2 file:py-1 file:px-2 file:rounded-md file:border-0 file:text-[10px] file:font-semibold file:bg-primary/10 file:text-primary hover:file:bg-primary/20 cursor-pointer" 
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-semibold text-on-surface-variant uppercase">Description</label>
                  <textarea rows={2} placeholder="Describe the project..." value={project.description} onChange={(e) => handleProjectChange(index, 'description', e.target.value)} className="w-full bg-surface-container-low border border-outline-variant rounded-lg px-2 py-1.5 text-xs focus:ring-2 focus:ring-primary outline-none resize-none" />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-semibold text-on-surface-variant uppercase">Tech Stack (comma separated)</label>
                  <input 
                    type="text" 
                    placeholder="e.g. Next.js, Tailwind, Prisma"
                    value={project.techStack.join(', ')} 
                    onChange={(e) => handleProjectChange(index, 'techStack', e.target.value.split(',').map(s => s.trim()))} 
                    className="w-full bg-surface-container-low border border-outline-variant rounded-lg px-2 py-1.5 text-xs focus:ring-2 focus:ring-primary outline-none" 
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-semibold text-on-surface-variant uppercase">GitHub URL (Optional)</label>
                  <input type="text" placeholder="https://github.com/..." value={project.githubUrl || ''} onChange={(e) => handleProjectChange(index, 'githubUrl', e.target.value)} className="w-full bg-surface-container-low border border-outline-variant rounded-lg px-2 py-1.5 text-xs focus:ring-2 focus:ring-primary outline-none" />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-semibold text-on-surface-variant uppercase">Live Demo URL (Optional)</label>
                  <input type="text" placeholder="https://..." value={project.liveUrl || ''} onChange={(e) => handleProjectChange(index, 'liveUrl', e.target.value)} className="w-full bg-surface-container-low border border-outline-variant rounded-lg px-2 py-1.5 text-xs focus:ring-2 focus:ring-primary outline-none" />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-semibold text-on-surface-variant uppercase">Demo Video URL (Optional)</label>
                  <input type="text" placeholder="https://youtube.com/..." value={project.demoVideoUrl || ''} onChange={(e) => handleProjectChange(index, 'demoVideoUrl', e.target.value)} className="w-full bg-surface-container-low border border-outline-variant rounded-lg px-2 py-1.5 text-xs focus:ring-2 focus:ring-primary outline-none" />
                </div>
              </div>
            ))}
          </div>

          {/* Section: Achievements */}
          <div className="space-y-4">
            <div className="flex items-center justify-between border-b border-outline-variant pb-2">
              <h2 className="text-sm font-bold uppercase tracking-widest text-on-surface-variant">Achievements</h2>
              <button onClick={addAchievement} className="text-primary hover:bg-primary/10 p-1 rounded transition-colors flex items-center gap-1 text-xs font-semibold"><Plus size={14} /> Add</button>
            </div>
            {data.achievements.map((ach, index) => (
              <div key={ach.id} className="p-4 bg-surface-container-lowest border border-outline-variant rounded-xl space-y-3 relative group">
                <button onClick={() => removeAchievement(index)} className="absolute top-2 right-2 text-error hover:bg-error/10 p-1 rounded opacity-0 group-hover:opacity-100 transition-opacity"><Trash2 size={14} /></button>
                
                <div className="space-y-1 pr-6">
                  <label className="text-[10px] font-semibold text-on-surface-variant uppercase">Type</label>
                  <select value={ach.type} onChange={(e) => handleAchievementChange(index, 'type', e.target.value)} className="w-full bg-surface-container-low border border-outline-variant rounded-lg px-2 py-1.5 text-xs focus:ring-2 focus:ring-primary outline-none">
                    <option value="job">Job</option>
                    <option value="internship">Internship</option>
                    <option value="freelance">Freelance</option>
                    <option value="achievement">General Achievement</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] font-semibold text-on-surface-variant uppercase">Title / Role</label>
                  <input type="text" placeholder="e.g. Senior Developer" value={ach.title} onChange={(e) => handleAchievementChange(index, 'title', e.target.value)} className="w-full bg-surface-container-low border border-outline-variant rounded-lg px-2 py-1.5 text-xs focus:ring-2 focus:ring-primary outline-none" />
                </div>

                {ach.type !== 'achievement' && (
                  <div className="space-y-1">
                    <label className="text-[10px] font-semibold text-on-surface-variant uppercase">Company / Organization</label>
                    <input type="text" placeholder="e.g. Google" value={ach.organization || ''} onChange={(e) => handleAchievementChange(index, 'organization', e.target.value)} className="w-full bg-surface-container-low border border-outline-variant rounded-lg px-2 py-1.5 text-xs focus:ring-2 focus:ring-primary outline-none" />
                  </div>
                )}
                
                {ach.type === 'achievement' && (
                  <div className="space-y-1">
                    <label className="text-[10px] font-semibold text-on-surface-variant uppercase">Issuer (Optional)</label>
                    <input type="text" placeholder="e.g. HackerRank" value={ach.organization || ''} onChange={(e) => handleAchievementChange(index, 'organization', e.target.value)} className="w-full bg-surface-container-low border border-outline-variant rounded-lg px-2 py-1.5 text-xs focus:ring-2 focus:ring-primary outline-none" />
                  </div>
                )}

                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <label className="text-[10px] font-semibold text-on-surface-variant uppercase">Start Date</label>
                    <input type="text" placeholder="e.g. 2021" value={ach.startDate} onChange={(e) => handleAchievementChange(index, 'startDate', e.target.value)} className="w-full bg-surface-container-low border border-outline-variant rounded-lg px-2 py-1.5 text-xs focus:ring-2 focus:ring-primary outline-none" />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] font-semibold text-on-surface-variant uppercase">End Date</label>
                    <input type="text" placeholder="e.g. Present" value={ach.endDate} onChange={(e) => handleAchievementChange(index, 'endDate', e.target.value)} className="w-full bg-surface-container-low border border-outline-variant rounded-lg px-2 py-1.5 text-xs focus:ring-2 focus:ring-primary outline-none" />
                  </div>
                </div>
                
                <div className="space-y-1">
                  <label className="text-[10px] font-semibold text-on-surface-variant uppercase">Description</label>
                  <textarea rows={2} placeholder="Describe what you did..." value={ach.description} onChange={(e) => handleAchievementChange(index, 'description', e.target.value)} className="w-full bg-surface-container-low border border-outline-variant rounded-lg px-2 py-1.5 text-xs focus:ring-2 focus:ring-primary outline-none resize-none" />
                </div>
              </div>
            ))}
          </div>

          {/* Section: Skills */}
          <div className="space-y-4">
            <div className="flex items-center justify-between border-b border-outline-variant pb-2">
              <h2 className="text-sm font-bold uppercase tracking-widest text-on-surface-variant">Skills</h2>
              <button onClick={addSkill} className="text-primary hover:bg-primary/10 p-1 rounded transition-colors flex items-center gap-1 text-xs font-semibold"><Plus size={14} /> Add</button>
            </div>
            <div className="grid grid-cols-2 gap-2">
              {data.skills.map((skill, index) => (
                <div key={skill.id} className="relative group">
                  <input 
                    type="text" 
                    value={skill.name} 
                    onChange={(e) => handleSkillChange(index, e.target.value)} 
                    className="w-full bg-surface-container-lowest border border-outline-variant rounded-lg px-2 py-1.5 text-xs focus:ring-2 focus:ring-primary outline-none"
                    placeholder="e.g. React.js" 
                  />
                  <button onClick={() => removeSkill(index)} className="absolute right-1 top-1 text-error hover:bg-error/10 p-1 rounded opacity-0 group-hover:opacity-100 transition-opacity"><Trash2 size={12} /></button>
                </div>
              ))}
            </div>
          </div>

          {/* Section: Contact */}
          <div className="space-y-4">
            <h2 className="text-sm font-bold uppercase tracking-widest text-on-surface-variant border-b border-outline-variant pb-2">Contact</h2>
            <div className="space-y-1">
              <label className="text-[10px] font-semibold text-on-surface-variant uppercase">Email</label>
              <input type="email" placeholder="e.g. hello@example.com" value={data.contact.email} onChange={(e) => handleContactChange('email', e.target.value)} className="w-full bg-surface-container-lowest border border-outline-variant rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-primary outline-none" />
            </div>
            <div className="space-y-1">
              <label className="text-[10px] font-semibold text-on-surface-variant uppercase">Location Display</label>
              <input type="text" placeholder="e.g. San Francisco, CA" value={data.contact.location} onChange={(e) => handleContactChange('location', e.target.value)} className="w-full bg-surface-container-lowest border border-outline-variant rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-primary outline-none" />
            </div>
          </div>

        </div>
      </div>
      )}

      {/* Right Pane: Live Preview */}
      <div className="flex-1 bg-surface-container-lowest h-full overflow-y-auto relative">
        <button 
          onClick={() => setIsPreviewFullscreen(!isPreviewFullscreen)}
          className="absolute top-4 right-6 z-[100] flex items-center gap-2 bg-black/50 text-white px-4 py-2 rounded-full text-xs font-bold tracking-widest backdrop-blur-md border border-white/20 hover:bg-black/70 transition-colors"
        >
          {isPreviewFullscreen ? <Minimize2 size={14} /> : <Maximize2 size={14} />}
          {isPreviewFullscreen ? 'EXIT FULLSCREEN' : 'FULLSCREEN PREVIEW'}
        </button>
        
        {/* Render Template */}
        <ModernDeveloperTemplate data={data} />
      </div>

    </div>
  );
}
