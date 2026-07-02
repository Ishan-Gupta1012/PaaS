/* eslint-disable @next/next/no-img-element */
import React from 'react';
import { PortfolioData } from '@/types/portfolio';
import { Globe, Code, Briefcase, Share2, MessageCircle, Video, Code2, Play, ArrowUpRight } from 'lucide-react';

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
    <section className="min-h-screen flex flex-col relative overflow-hidden bg-transparent border-b border-[#1a1a1a]">
      
      {/* Soft Dot Pattern */}
      <style>{`
        .bg-dots {
          background-image: radial-gradient(rgba(255,255,255,0.05) 1px, transparent 1px);
          background-size: 24px 24px;
        }
      `}</style>
      <div className="absolute inset-0 bg-dots z-0" />
      
      {/* Navbar */}
      <nav className="w-full max-w-[1200px] mx-auto px-6 py-6 flex justify-between items-center z-50">
        <div className="font-display text-xl md:text-2xl font-bold tracking-tight text-white flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-[#ccff00] text-black flex items-center justify-center font-bold">
            {data.logoText ? data.logoText.substring(0, 1).toUpperCase() : 'A'}
          </div>
          <span>{data.logoText ? data.logoText.substring(1) : 'R'}</span>
        </div>
        
        <div className="hidden md:flex items-center gap-8 bg-[#111] px-6 py-3 rounded-full border border-white/5 shadow-lg">
          <a href="#home" className="text-sm font-medium text-white hover:text-[#ccff00] transition-colors">Home</a>
          <a href="#projects" className="text-sm font-medium text-gray-400 hover:text-white transition-colors">Projects</a>
          <a href="#experience" className="text-sm font-medium text-gray-400 hover:text-white transition-colors">Achievements</a>
          <a href="#skills" className="text-sm font-medium text-gray-400 hover:text-white transition-colors">Skills</a>
          <a href="#contact" className="text-sm font-medium text-gray-400 hover:text-white transition-colors">Contact</a>
        </div>
      </nav>

      {/* Main Content Split Layout */}
      <div className="flex-1 flex items-center justify-center w-full max-w-[1200px] mx-auto px-6 z-10 relative py-12">
        <div className="flex flex-col-reverse md:flex-row justify-between gap-12 w-full items-center">
          
          {/* Left Content */}
          <div className="w-full md:w-3/5 flex flex-col items-center md:items-start text-center md:text-left">
            
            {/* Location Badge */}
            {data.location && (
              <div className="flex items-center gap-2 bg-[#111] border border-[#222] px-4 py-2 rounded-full mb-6 animate-fade-in-up">
                <div className="w-2 h-2 rounded-full bg-[#ccff00] animate-pulse" />
                <span className="text-xs font-semibold tracking-wide text-gray-400">{data.location}</span>
              </div>
            )}

            {/* Tagline */}
            <h1 className="font-display text-4xl md:text-6xl lg:text-7xl font-extrabold tracking-tight leading-[1.1] mb-6 animate-fade-in-up" style={{ animationDelay: '100ms' }}>
              <span className="text-white block">{data.tagline}</span>
              <span className="text-[#ccff00] block mt-1">
                {data.taglineHighlight}
              </span>
            </h1>

            {/* Bio */}
            <p className="text-gray-400 text-lg w-full leading-relaxed mb-8 animate-fade-in-up md:border-l-2 md:border-[#222] md:pl-6 md:py-1 whitespace-pre-wrap break-words" style={{ animationDelay: '200ms' }}>
              {data.bio}
            </p>

            {/* Social Links & Action */}
            <div className="flex flex-wrap justify-center md:justify-start items-center gap-4 animate-fade-in-up" style={{ animationDelay: '300ms' }}>
              <a href="#contact" className="flex items-center gap-2 bg-[#ccff00] text-black px-6 py-3 rounded-full font-bold text-sm hover:bg-[#b3e600] transition-colors shadow-[0_0_20px_rgba(204,255,0,0.2)]">
                Let&apos;s Talk <ArrowUpRight size={16} />
              </a>
              {data.socials && data.socials.length > 0 && (
                <div className="flex gap-3 ml-2">
                  {data.socials.map((social, index) => (
                    <a 
                      key={index}
                      href={social.url} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="w-12 h-12 flex items-center justify-center rounded-full bg-[#111] border border-[#222] text-gray-400 hover:text-black hover:bg-[#ccff00] hover:border-[#ccff00] transition-all"
                    >
                      {renderSocialIcon(social.platform)}
                    </a>
                  ))}
                </div>
              )}
            </div>
            
          </div>

          {/* Right Content - Image */}
          <div className="w-full md:w-2/5 flex justify-center animate-fade-in-up" style={{ animationDelay: '400ms' }}>
            <div className="relative w-64 h-64 md:w-80 md:h-80 lg:w-[400px] lg:h-[400px]">
              {/* Soft decorative background element */}
              <div className="absolute inset-0 bg-[#ccff00]/10 rounded-full blur-3xl transform translate-x-4 translate-y-4" />
              
              {/* Avatar Image */}
              <div className="absolute inset-0 bg-[#111] rounded-[40px] border border-[#222] overflow-hidden shadow-2xl transform rotate-3 hover:rotate-0 transition-transform duration-500">
                {data.avatarUrl ? (
                  <img 
                    src={data.avatarUrl} 
                    alt={data.logoText || 'User'} 
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex flex-col items-center justify-center bg-[#111]">
                    <span className="text-6xl font-bold text-gray-800">{data.logoText ? data.logoText.charAt(0).toUpperCase() : 'U'}</span>
                  </div>
                )}
              </div>
            </div>
          </div>
          
        </div>
      </div>
    </section>
  );
};
