import React from 'react';
import { PortfolioData } from '@/types/portfolio';
import { HeroSection } from './HeroSection';
import { AchievementSection } from './AchievementSection';
import { SkillsSection } from './SkillsSection';
import { ProjectsSection } from './ProjectsSection';
import { ContactSection } from './ContactSection';
import GithubDashboard from './github/GithubDashboard';
import { ThreeBackground } from './ThreeBackground';

interface Props {
  data: PortfolioData;
}

export default function ModernDeveloperTemplate({ data }: Props) {
  return (
    <div className="min-h-screen bg-[#050505] text-white selection:bg-[#ccff00]/30 font-sans relative">
      <style>{`
        @keyframes float-slow {
          0%, 100% { transform: translate(0, 0) rotate(0deg); }
          25% { transform: translate(2%, 4%) rotate(2deg); }
          50% { transform: translate(-1%, 2%) rotate(-1deg); }
          75% { transform: translate(3%, -2%) rotate(1deg); }
        }
        @keyframes spin-slow {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        .animate-float-slow { animation: float-slow 20s ease-in-out infinite; }
        .animate-spin-slow { animation: spin-slow 40s linear infinite; }
        .animate-spin-slow-reverse { animation: spin-slow 50s linear infinite reverse; }
      `}</style>
      
      {/* Global Floating Background */}
      <div className="fixed inset-0 z-0 pointer-events-none overflow-hidden">
        <ThreeBackground />
        
        {/* Soft Glowing Orbs */}
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-[#ccff00]/5 blur-[120px] animate-float-slow" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] rounded-full bg-[#ccff00]/5 blur-[150px] animate-float-slow" style={{ animationDelay: '-10s' }} />
        <div className="absolute top-[40%] left-[60%] w-[30%] h-[30%] rounded-full bg-blue-500/5 blur-[100px] animate-float-slow" style={{ animationDelay: '-5s' }} />
        
        {/* Sweeping Abstract Curves */}
        <div className="absolute top-[-20%] left-[-10%] w-[120vw] h-[120vw] border-[2px] border-white/20 rounded-[45%_55%_40%_60%] animate-spin-slow-reverse" />
        <div className="absolute bottom-[-30%] right-[-10%] w-[140vw] h-[140vw] border-[2px] border-[#ccff00]/30 rounded-[55%_45%_60%_40%] animate-spin-slow" style={{ animationDuration: '30s' }} />
        <div className="absolute top-[20%] right-[-20%] w-[100vw] h-[100vw] border-[2px] border-white/10 rounded-[50%_50%_40%_60%] animate-spin-slow-reverse" style={{ animationDuration: '40s' }} />
      </div>

      <main className="relative z-10">
        <div className="sticky top-0 z-50 w-full bg-transparent">
          <nav className="w-full max-w-[1200px] mx-auto px-6 py-6 flex justify-between items-center">
            <div className="font-display text-xl md:text-2xl font-bold tracking-tight text-white flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-[#ccff00] text-black flex items-center justify-center font-bold">
                {data.hero.logoText ? data.hero.logoText.substring(0, 1).toUpperCase() : 'A'}
              </div>
              <span>{data.hero.logoText ? data.hero.logoText.substring(1) : 'R'}</span>
            </div>
            
            <div className="hidden md:flex items-center gap-8 bg-[#111] px-6 py-3 rounded-full border border-white/5 shadow-lg">
              <button onClick={() => document.getElementById('home')?.scrollIntoView({ behavior: 'smooth' })} className="text-sm font-medium text-white hover:text-[#ccff00] transition-colors">Home</button>
              <button onClick={() => document.getElementById('projects')?.scrollIntoView({ behavior: 'smooth' })} className="text-sm font-medium text-gray-400 hover:text-white transition-colors">Projects</button>
              <button onClick={() => document.getElementById('experience')?.scrollIntoView({ behavior: 'smooth' })} className="text-sm font-medium text-gray-400 hover:text-white transition-colors">Achievements</button>
              <button onClick={() => document.getElementById('skills')?.scrollIntoView({ behavior: 'smooth' })} className="text-sm font-medium text-gray-400 hover:text-white transition-colors">Skills</button>
              <button onClick={() => document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' })} className="text-sm font-medium text-gray-400 hover:text-white transition-colors">Contact</button>
            </div>
          </nav>
        </div>
        <HeroSection data={data.hero} />
        {data.projects && data.projects.length > 0 && <ProjectsSection data={data.projects} />}
        {data.achievements && data.achievements.length > 0 && <AchievementSection data={data.achievements} />}
        {data.skills && data.skills.length > 0 && <SkillsSection data={data.skills} />}
        {data.hero.githubUsername && data.hero.showGithub !== false && <GithubDashboard username={data.hero.githubUsername} />}
      </main>
      <ContactSection data={data.contact} socials={data.hero.socials} />
    </div>
  );
}
