'use client';

import React, { useState, useRef } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Sparkles, ArrowRight, CheckCircle2, FileText, LayoutTemplate, Wand2, UploadCloud, RefreshCw } from 'lucide-react';
import { PortfolioData, Project, Achievement } from '@/types/portfolio';

const generateId = () => Date.now().toString() + Math.random().toString(36).substring(2, 6);

export default function AIBuilderPage() {
  const { user, updateProfile } = useAuth();
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [selectedTemplate, setSelectedTemplate] = useState<string>('software-engineer');
  const [isEnhancing, setIsEnhancing] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);

  // Use Object.keys with a cast or specific check because resumeData is Record<string, unknown>
  const hasResume = !!user?.resumeData && Object.keys(user.resumeData as object).length > 0;

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    setUploadError(null);

    try {
      const formData = new FormData();
      formData.append('file', file);
      
      const response = await fetch('/api/resume/upload', {
        method: 'POST',
        body: formData,
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error || 'Failed to process resume');
      }
      
      if (user) {
        updateProfile({ ...user, resumeData: data.mergedData });
      }
      // Automatically advance to template selection
      setStep(2);
    } catch (err: unknown) {
      console.error('Upload error:', err);
      setUploadError(err instanceof Error ? err.message : 'An error occurred uploading the resume.');
    } finally {
      setIsUploading(false);
    }
  };

  const handleNext = () => {
    if (step === 1 && hasResume) setStep(2);
    else if (step === 2) setStep(3);
  };

  const handleBack = () => {
    if (step === 2) setStep(1);
    else if (step === 3) setStep(2);
  };

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const mapResumeToPortfolio = (resume: any): PortfolioData => {
    const hero = {
      name: resume?.personal?.name || 'Developer',
      location: resume?.personal?.location || '',
      logoText: resume?.personal?.name || 'Developer',
      title: resume?.personal?.title || '',
      tagline: resume?.summary ? resume.summary.substring(0, 80) + '...' : 'Building scalable digital experiences.',
      bio: resume?.summary || '',
      avatarUrl: user?.personalInfo?.avatar || 'https://api.dicebear.com/7.x/avataaars/svg?seed=fallback',
      resumeUrl: '',
      socials: [] as { platform: 'github' | 'linkedin'; url: string }[],
      githubUsername: '',
      showGithub: true
    };

    if (resume?.links?.github) {
      hero.socials.push({ platform: 'github', url: resume.links.github });
      try {
        const url = new URL(resume.links.github);
        const parts = url.pathname.split('/').filter(Boolean);
        if (parts.length > 0) hero.githubUsername = parts[0];
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (e) {
        // ignore
      }
    }
    if (resume?.links?.linkedin) {
      hero.socials.push({ platform: 'linkedin', url: resume.links.linkedin });
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const projects: Project[] = (resume?.projects || []).map((p: any) => ({
      id: generateId(),
      name: p.name || 'Untitled Project',
      description: p.description || '',
      highlights: p.bullets || [],
      techStack: p.technologies || [],
      images: [],
      githubUrl: p.link || '',
      liveUrl: '',
      demoVideoUrl: ''
    }));

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const achievements: Achievement[] = (resume?.experience || []).map((e: any) => ({
      id: generateId(),
      type: 'job',
      title: e.jobTitle || e.role || e.title || e.position || '',
      organization: e.company || e.organization || e.employer || '',
      startDate: e.startDate || (e.duration || e.date)?.split('-')[0]?.trim() || '',
      endDate: e.endDate || (e.duration || e.date)?.split('-')[1]?.trim() || '',
      description: [e.description, ...(e.bullets || [])].filter(Boolean).join('\n')
    }));

    const skillsArr: { id: string; name: string }[] = [];
    if (resume?.skills) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      Object.values(resume.skills).forEach((arr: any) => {
        if (Array.isArray(arr)) {
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          arr.forEach((s: any) => skillsArr.push({ id: generateId(), name: String(s) }));
        }
      });
    }

    const contact = {
      email: resume?.personal?.email || user?.personalInfo?.email || '',
      location: resume?.personal?.location || '',
      phone: resume?.personal?.phone || ''
    };

    return { hero, projects, achievements, skills: skillsArr, contact };
  };

  const handleSkip = () => {
    if (!user?.resumeData) return;
    const portfolioDraft = mapResumeToPortfolio(user.resumeData);
    sessionStorage.setItem('portfolio_draft_data', JSON.stringify(portfolioDraft));
    router.push(`/dashboard/builder?template=${selectedTemplate}`);
  };

  const handleGenerate = async () => {
    if (!user?.resumeData) return;
    
    setIsEnhancing(true);
    setErrorMsg(null);
    try {
      // 1. Map current resume data to Portfolio structure
      const portfolioDraft = mapResumeToPortfolio(user.resumeData);
      
      // 2. Enhance descriptions with Gemini API
      const res = await fetch('/api/portfolio/enhance', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ resumeData: { 
          experience: portfolioDraft.achievements,
          projects: portfolioDraft.projects
        } })
      });
      
      const data = await res.json();
      
      if (!res.ok) {
        throw new Error(data.error || 'Failed to enhance portfolio data.');
      }
      
      // 3. Merge enhanced data safely (ONLY descriptions and highlights)
      const finalDraft = { ...portfolioDraft };
      if (data.enhancedData) {
        if (Array.isArray(data.enhancedData.experience)) {
          finalDraft.achievements = finalDraft.achievements.map((ach, i) => {
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            const aiItem = data.enhancedData.experience[i] || data.enhancedData.experience.find((e: any) => e.id === ach.id);
            if (aiItem && aiItem.description) {
              return { ...ach, description: aiItem.description };
            }
            return ach;
          });
        }
        if (Array.isArray(data.enhancedData.projects)) {
          finalDraft.projects = finalDraft.projects.map((proj, i) => {
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            const aiItem = data.enhancedData.projects[i] || data.enhancedData.projects.find((p: any) => p.id === proj.id);
            if (aiItem) {
              return { 
                ...proj, 
                description: aiItem.description || proj.description,
                highlights: aiItem.highlights || aiItem.bullets || proj.highlights
              };
            }
            return proj;
          });
        }
      }

      // 4. Save to sessionStorage
      sessionStorage.setItem('portfolio_draft_data', JSON.stringify(finalDraft));
      
      // 5. Navigate
      router.push(`/dashboard/builder?template=${selectedTemplate}`);

    } catch (err: unknown) {
      console.error(err);
      setErrorMsg(err instanceof Error ? err.message : 'An error occurred during generation.');
    } finally {
      setIsEnhancing(false);
    }
  };

  return (
    <div className="flex flex-col flex-1 p-lg md:p-xl max-w-[56rem] mx-auto w-full">
      <div className="mb-xl text-center">
        <div className="inline-flex items-center justify-center p-3 bg-primary/10 text-primary rounded-2xl mb-4">
          <Sparkles size={32} className="animate-pulse" />
        </div>
        <h1 className="text-display-sm font-display font-bold text-on-surface mb-2">AI Portfolio Builder</h1>
        <p className="text-on-surface-variant text-lg max-w-[42rem] mx-auto">
          Transform your static resume into a stunning, interactive portfolio in seconds. 
        </p>
      </div>

      {/* Stepper */}
      <div className="flex items-start justify-center mb-xl w-full max-w-[42rem] mx-auto">
        {[
          { num: 1, label: 'Resume Source', icon: FileText },
          { num: 2, label: 'Choose Template', icon: LayoutTemplate },
          { num: 3, label: 'AI Generation', icon: Wand2 }
        ].map((s, i) => (
          <React.Fragment key={s.num}>
            <div className="flex flex-col items-center gap-2 relative w-32">
              <div className={`w-12 h-12 mx-auto rounded-full flex items-center justify-center font-bold text-lg transition-all relative z-10 ${
                step >= s.num 
                  ? 'bg-primary text-on-primary shadow-lg shadow-primary/20 scale-110' 
                  : 'bg-surface-container-highest text-on-surface-variant'
              }`}>
                {step > s.num ? <CheckCircle2 size={24} /> : <s.icon size={20} />}
              </div>
              <span className={`text-xs font-bold uppercase tracking-wider text-center mt-2 ${step >= s.num ? 'text-primary' : 'text-on-surface-variant'}`}>
                {s.label}
              </span>
            </div>
            {i < 2 && (
              <div className={`flex-1 h-1 mt-6 -mx-4 rounded-full transition-colors relative z-0 ${
                step > s.num ? 'bg-primary' : 'bg-surface-container-highest'
              }`} />
            )}
          </React.Fragment>
        ))}
      </div>

      {/* Steps Content */}
      <div className="bg-surface-container-lowest border border-outline-variant rounded-3xl p-xl shadow-xl flex-1 relative overflow-hidden w-full" style={{ width: '100%' }}>
        
        {step === 1 && (
          <div className="w-full animate-fade-in-up block">
            <div className="w-20 h-20 bg-secondary-container text-on-secondary-container rounded-3xl flex items-center justify-center mb-6 shadow-inner mx-auto">
              <FileText size={40} />
            </div>
            <h2 className="text-headline-sm font-bold text-on-surface mb-2 text-center w-full">Resume Data</h2>
            
            {hasResume ? (
              <>
                <p className="text-on-surface-variant mb-8 w-full text-center mx-auto" style={{ maxWidth: '28rem' }}>
                  We found your recently parsed resume data. We&apos;ll use this to automatically build your portfolio.
                </p>
                <div className="w-full p-4 bg-surface-container-low rounded-xl border border-outline-variant mb-8 flex flex-col items-center justify-center text-center mx-auto" style={{ maxWidth: '28rem' }}>
                  <div className="flex items-center gap-3 mb-2">
                    <CheckCircle2 className="text-primary" size={24} />
                    {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
                    <h3 className="font-bold text-on-surface">{(user?.resumeData as Record<string, unknown>)?.personal && (user.resumeData as any).personal.name ? (user.resumeData as any).personal.name : 'Your Resume'}</h3>
                  </div>
                  <p className="text-sm text-on-surface-variant text-primary mb-4">Parsed successfully • Ready to use</p>
                  
                  <div className="flex gap-2 w-full">
                    <button 
                      onClick={() => fileInputRef.current?.click()}
                      className="flex-1 py-2 text-sm border border-outline-variant rounded-lg font-bold hover:bg-surface-container transition-colors"
                    >
                      Upload Different
                    </button>
                    <button 
                      onClick={handleNext}
                      className="flex-1 bg-primary text-on-primary py-2 rounded-lg font-bold hover:opacity-90 transition-opacity"
                    >
                      Continue
                    </button>
                  </div>
                  <input 
                    type="file" 
                    accept=".pdf" 
                    className="hidden" 
                    ref={fileInputRef}
                    onChange={handleFileUpload}
                  />
                </div>
                {uploadError && <p className="text-error text-sm mb-4 text-center">{uploadError}</p>}
                {isUploading && (
                  <div className="flex items-center justify-center gap-2 text-primary font-bold animate-pulse mb-4">
                    <RefreshCw size={18} className="animate-spin" />
                    Parsing Resume...
                  </div>
                )}
              </>
            ) : (
              <>
                <p className="text-on-surface-variant mb-8 w-full text-center mx-auto" style={{ maxWidth: '28rem' }}>
                  It looks like you haven&apos;t uploaded a resume yet. Upload your PDF resume here to extract your details instantly.
                </p>
                
                <div 
                  className={`w-full p-8 border-2 border-dashed rounded-3xl flex flex-col items-center justify-center transition-all cursor-pointer mx-auto ${
                    isUploading ? 'border-primary bg-primary/5' : 'border-outline hover:border-primary hover:bg-surface-container-low'
                  }`}
                  style={{ maxWidth: '28rem' }}
                  onClick={() => !isUploading && fileInputRef.current?.click()}
                >
                  <input 
                    type="file" 
                    accept=".pdf" 
                    className="hidden" 
                    ref={fileInputRef}
                    onChange={handleFileUpload}
                  />
                  {isUploading ? (
                    <>
                      <RefreshCw size={40} className="text-primary animate-spin mb-4" />
                      <h3 className="text-lg font-bold text-on-surface mb-2 animate-pulse">Extracting Details...</h3>
                      <p className="text-sm text-on-surface-variant text-center max-w-[20rem]">
                        Reading your PDF and mapping your experiences, projects, and skills.
                      </p>
                    </>
                  ) : (
                    <>
                      <UploadCloud size={40} className="text-primary mb-4" />
                      <h3 className="text-lg font-bold text-on-surface mb-2">Upload Resume (PDF)</h3>
                      <p className="text-sm text-on-surface-variant text-center max-w-[20rem] mb-4">
                        We will automatically extract your details to populate your portfolio templates.
                      </p>
                      <button className="px-6 py-2 bg-primary text-on-primary rounded-xl font-bold hover:scale-105 transition-transform text-sm">
                        Select File
                      </button>
                    </>
                  )}
                </div>
                {uploadError && <p className="text-error text-sm mt-4 text-center">{uploadError}</p>}
              </>
            )}
          </div>
        )}

        {step === 2 && (
          <div className="w-full animate-fade-in-up block">
            <h2 className="text-headline-sm font-bold text-on-surface mb-2 text-center w-full">Select a Template</h2>
            <p className="text-on-surface-variant mb-8 text-center w-full mx-auto" style={{ maxWidth: '28rem' }}>
              Choose a design that fits your personal brand.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8 w-full">
              {[
                { id: 'modern-developer', name: 'Modern Developer', img: 'https://i.postimg.cc/HkdNLqsM/Screenshot-2026-07-03-at-12-44-13-AM-1.png' },
                { id: 'software-engineer', name: 'Developer Pro', img: 'https://i.postimg.cc/cLBz4Hd5/Screenshot-2026-07-26-at-5-35-09-PM.png' }
              ].map(tpl => (
                <div 
                  key={tpl.id}
                  onClick={() => setSelectedTemplate(tpl.id)}
                  className={`cursor-pointer rounded-2xl overflow-hidden border-2 transition-all duration-300 relative group ${
                    selectedTemplate === tpl.id 
                      ? 'border-primary shadow-xl shadow-primary/20 ring-4 ring-primary/20' 
                      : 'border-outline-variant hover:border-primary/50'
                  }`}
                >
                  {selectedTemplate === tpl.id && (
                    <div className="absolute top-4 right-4 z-10 bg-primary text-on-primary rounded-full p-1 shadow-md">
                      <CheckCircle2 size={20} />
                    </div>
                  )}
                  <div className="aspect-video relative overflow-hidden bg-surface-container-highest">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={tpl.img} alt={tpl.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                  </div>
                  <div className="p-4 bg-surface-container-lowest">
                    <h3 className="font-bold text-on-surface">{tpl.name}</h3>
                  </div>
                </div>
              ))}
            </div>

            <div className="flex items-center justify-between mt-auto">
              <button 
                onClick={handleBack}
                className="px-6 py-3 text-on-surface-variant hover:bg-surface-container-highest rounded-xl font-bold transition-colors"
              >
                Back
              </button>
              <button 
                onClick={handleNext}
                className="bg-primary text-on-primary px-8 py-3 rounded-xl font-bold flex items-center gap-2 hover:scale-105 hover:shadow-lg hover:shadow-primary/25 transition-all"
              >
                Next Step <ArrowRight size={20} />
              </button>
            </div>
          </div>
        )}

        {step === 3 && (
          <div className="w-full animate-fade-in-up block text-center">
            
            {isEnhancing ? (
              <>
                <div className="relative mb-8">
                  <div className="absolute inset-0 bg-primary/20 blur-2xl rounded-full animate-pulse" />
                  <div className="w-24 h-24 bg-surface-container-highest rounded-full flex items-center justify-center relative z-10 border-2 border-primary border-t-transparent animate-spin mx-auto">
                    <div className="w-20 h-20 bg-surface-container-lowest rounded-full flex items-center justify-center">
                      <Sparkles size={32} className="text-primary animate-pulse" />
                    </div>
                  </div>
                </div>
                <h2 className="text-headline-md font-bold text-on-surface mb-3 bg-clip-text text-transparent bg-gradient-to-r from-primary to-blue-500 animate-pulse text-center w-full">
                  Enhancing your portfolio...
                </h2>
                <p className="text-on-surface-variant w-full text-center mx-auto" style={{ maxWidth: '24rem' }}>
                  Gemini AI is analyzing your resume and crafting impressive, punchy copy for your projects and experience.
                </p>
              </>
            ) : (
              <>
                <div className="w-24 h-24 mx-auto bg-primary/10 text-primary rounded-full flex items-center justify-center mb-6 relative">
                  <Wand2 size={40} className="relative z-10" />
                  <div className="absolute inset-0 border-4 border-primary/20 rounded-full animate-ping" />
                </div>
                <h2 className="text-headline-md font-bold text-on-surface mb-3 text-center w-full">Enhance Descriptions?</h2>
                <p className="text-on-surface-variant w-full text-center mx-auto mb-8" style={{ maxWidth: '24rem' }}>
                  Your basic portfolio structure is ready. Would you like Gemini to rewrite your experience & project descriptions to be more punchy, or skip this step?
                </p>
                <div className="flex flex-col sm:flex-row items-center justify-center gap-4 w-full mt-6">
                  <button 
                    onClick={handleBack}
                    className="px-6 py-3 text-on-surface-variant hover:bg-surface-container-highest rounded-xl font-bold transition-colors"
                  >
                    Back
                  </button>
                  <button 
                    onClick={handleSkip}
                    className="bg-surface-container-high text-on-surface px-8 py-3 rounded-xl font-bold hover:bg-surface-container-highest transition-all w-full sm:w-auto"
                  >
                    Skip AI (Use Original)
                  </button>
                  <button 
                    onClick={handleGenerate}
                    className="bg-primary text-on-primary px-8 py-3 rounded-xl font-bold flex items-center justify-center gap-2 hover:scale-105 hover:shadow-lg hover:shadow-primary/25 transition-all w-full sm:w-auto relative overflow-hidden group"
                  >
                    <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300 ease-in-out" />
                    <Wand2 size={20} className="relative z-10" /> 
                    <span className="relative z-10">Enhance with AI</span>
                  </button>
                </div>
                {errorMsg && (
                  <p className="text-error text-sm mt-4">{errorMsg}</p>
                )}
              </>
            )}

          </div>
        )}

      </div>
    </div>
  );
}
