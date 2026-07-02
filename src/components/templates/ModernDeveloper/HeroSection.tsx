/* eslint-disable @next/next/no-img-element */
import React from 'react';
import { PortfolioData } from '@/types/portfolio';
import { Globe, Code, Briefcase, Share2, MessageCircle, Video, Code2, Play, FileText } from 'lucide-react';

interface Props {
  data: PortfolioData['hero'];
}

export const HeroSection: React.FC<Props> = ({ data }) => {
  const renderSocialIcon = (platform: string) => {
    switch (platform) {
      case 'github': return <Code size={20} />;
      case 'linkedin': return <Briefcase size={20} />;
      case 'gitlab': return <Share2 size={20} />;
      case 'twitter': return <MessageCircle size={20} />;
      case 'youtube': return <Video size={20} />;
      case 'leetcode': return <Code2 size={20} />;
      case 'codeforces': return <Play size={20} />;
      default: return <Globe size={20} />;
    }
  };

  return (
    <section id="home" className="min-h-screen flex flex-col relative overflow-hidden bg-transparent">
      
      <style>{`
        @keyframes text-shimmer {
          0% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
          100% { background-position: 0% 50%; }
        }
        .animate-text-shimmer {
          animation: text-shimmer 8s ease-in-out infinite;
        }
      `}</style>

      {/* Main Content Centered Layout */}
      <div className="flex-1 flex flex-col items-center justify-center w-full max-w-[1200px] mx-auto px-4 sm:px-6 z-10 relative py-12 md:py-20">
        
        {/* Top Subtitle */}
        <div className="flex items-center justify-center gap-2 mb-6 animate-fade-in-up">
          <span className="text-[#ccff00] font-mono font-bold text-xl">&lt; &gt;</span>
          <span className="text-gray-400 font-semibold tracking-[0.2em] text-xs sm:text-sm uppercase text-center">
            {data.location || 'Builder of Scalable Web Applications & Software Solutions'}
          </span>
        </div>

        {/* Huge Name/Tagline with Gradient */}
        <div className="relative w-full max-w-[1050px] mx-auto">
          <div className="absolute -inset-4 bg-[#ccff00]/10 blur-[100px] rounded-full z-0 pointer-events-none" />
          <h1 className="relative z-10 font-display text-4xl sm:text-6xl md:text-7xl lg:text-[80px] font-black tracking-tighter text-transparent bg-clip-text bg-gradient-to-r from-white via-[#ccff00]/60 to-white bg-[length:200%_auto] animate-text-shimmer mb-10 sm:mb-12 text-center leading-none uppercase drop-shadow-2xl">
            {data.tagline}
          </h1>
        </div>

        {/* Glassmorphism ID Card (Redesigned) */}
        <div className="w-full max-w-[1050px] bg-[#0a0a0a]/60 backdrop-blur-3xl border border-white/10 rounded-3xl overflow-hidden shadow-[0_20px_60px_rgba(0,0,0,0.8)] flex flex-col sm:flex-row items-stretch animate-fade-in-up hover:border-[#ccff00]/40 transition-colors duration-500 group relative" style={{ animationDelay: '200ms' }}>
          
          {/* Subtle Hover Glow on the Card */}
          <div className="absolute inset-0 bg-gradient-to-r from-[#ccff00]/0 via-[#ccff00]/5 to-[#ccff00]/0 opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none" />
          
          {/* Avatar Area with Glow */}
          <div className="w-full sm:w-[45%] bg-[#050505] min-h-[350px] sm:min-h-[400px] relative overflow-hidden">
            {data.avatarUrl ? (
              <img 
                src={data.avatarUrl} 
                alt="Profile" 
                className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
              />
            ) : (
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="text-8xl font-black text-gray-800">{data.logoText ? data.logoText.charAt(0).toUpperCase() : 'U'}</span>
              </div>
            )}
            <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent opacity-60" />
          </div>

          {/* Card Content Area */}
          <div className="w-full sm:w-[55%] p-8 sm:p-10 md:p-16 flex flex-col justify-center text-left relative z-10 bg-gradient-to-br from-white/5 to-transparent">
            <h2 className="text-[#ccff00] font-black text-3xl sm:text-4xl lg:text-5xl tracking-widest uppercase mb-6 drop-shadow-[0_0_10px_rgba(204,255,0,0.3)]">
              {data.title || 'Full-Stack Engineer'}
            </h2>
            
            <p className="text-gray-400 text-base sm:text-lg lg:text-xl leading-relaxed mb-10 flex-1 font-medium">
              {data.bio}
            </p>

            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6 mt-auto">
              <a href="#contact" className="inline-flex items-center justify-center gap-2 bg-transparent border border-white/20 text-white px-8 py-3 rounded-full font-bold text-sm hover:bg-[#ccff00] hover:text-black hover:border-[#ccff00] transition-all duration-300 shadow-[0_0_0_rgba(204,255,0,0)] hover:shadow-[0_0_20px_rgba(204,255,0,0.4)]">
                LET&apos;S BUILD TOGETHER
              </a>
              
              {data.resumeUrl && (
                <a href={data.resumeUrl} target="_blank" rel="noopener noreferrer" className="inline-flex items-center justify-center gap-2 bg-white/5 border border-white/10 text-white px-8 py-3 rounded-full font-bold text-sm hover:bg-white/10 transition-all duration-300">
                  <FileText size={18} />
                  RESUME
                </a>
              )}
              
              {/* Socials */}
              {data.socials && data.socials.length > 0 && (
                <div className="flex gap-3">
                  {data.socials.map((social, index) => (
                    <a 
                      key={index}
                      href={social.url} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="w-10 h-10 flex items-center justify-center rounded-full text-[#ccff00] hover:bg-[#ccff00]/10 transition-colors"
                    >
                      {renderSocialIcon(social.platform)}
                    </a>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
