import React from 'react';
import { PortfolioData } from '@/types/portfolio';
import { Mail, MapPin, ArrowUpRight } from 'lucide-react';

interface Props {
  data: PortfolioData['contact'];
  socials: PortfolioData['hero']['socials'];
}

export const ContactSection: React.FC<Props> = ({ data, socials }) => {
  return (
    <section id="contact" className="py-40 bg-transparent border-b-2 border-[#1a1a1a] text-white flex flex-col relative overflow-hidden">
      
      {/* Brutalist Dot Pattern */}
      <style>{`
        .bg-dots {
          background-image: radial-gradient(#222 1px, transparent 1px);
          background-size: 20px 20px;
        }
      `}</style>
      <div className="absolute inset-0 bg-dots z-0 opacity-50" />
      
      <div className="w-full max-w-[1400px] mx-auto px-6 relative z-10">
        
        {/* Large Header */}
        <div className="mb-32 border-b border-[#222] pb-12 animate-fade-in-up text-center md:text-left">
          <h2 className="text-4xl md:text-6xl lg:text-8xl font-display font-extrabold tracking-tight leading-[1.1]">
            Let&apos;s build <br className="hidden md:block" />
            <span className="text-[#ccff00]">
              extraordinary.
            </span>
          </h2>
        </div>

        {/* Two Column Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-32 items-stretch">
          
          {/* Left Column: Contact Info Card */}
          <div className="md:col-span-1 bg-[#111] border border-[#222] rounded-[40px] p-8 md:p-12 h-full flex flex-col justify-between animate-fade-in-up" style={{ animationDelay: '100ms' }}>
            <div>
              <h2 className="text-2xl font-display font-bold tracking-tight mb-6">
                Contact Info
              </h2>
              <p className="text-gray-400 text-base md:text-lg mb-12 leading-relaxed border-l-4 border-[#ccff00] pl-4 py-1">
                Have an idea that needs to be built? Or just want to discuss tech and AI? My inbox is always open.
              </p>

              <div className="space-y-8 mb-12">
                {/* Email Block */}
                {data.email && (
                  <div>
                    <h4 className="text-gray-600 font-bold tracking-widest uppercase text-[10px] mb-2 flex items-center gap-2"><Mail size={12}/> Email</h4>
                    <a href={`mailto:${data.email}`} className="text-white text-lg md:text-xl font-bold hover:text-[#ccff00] transition-colors break-words">
                      {data.email}
                    </a>
                  </div>
                )}

                {/* Location Block */}
                {data.location && (
                  <div>
                    <h4 className="text-gray-600 font-bold tracking-widest uppercase text-[10px] mb-2 flex items-center gap-2"><MapPin size={12}/> Location</h4>
                    <p className="text-white text-lg md:text-xl font-bold">
                      {data.location}
                    </p>
                  </div>
                )}
              </div>
            </div>

            {/* Social Links */}
            {socials && socials.length > 0 && (
              <div className="pt-8 border-t-2 border-[#222]">
                <h4 className="text-gray-600 font-bold tracking-widest uppercase text-[10px] mb-4">Connect</h4>
                <div className="flex flex-wrap gap-2">
                  {socials.map((social, idx) => (
                    <a 
                      key={idx} 
                      href={social.url} 
                      target="_blank" 
                      rel="noreferrer"
                      className="px-4 py-2 bg-[#1a1a1a] border border-[#333] rounded-full text-gray-300 text-[10px] font-bold tracking-widest uppercase hover:bg-[#ccff00] hover:text-black hover:border-[#ccff00] transition-all"
                    >
                      {social.platform}
                    </a>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Right Column: Contact Form */}
          <div className="md:col-span-2 bg-[#111] border border-[#222] rounded-[40px] p-8 md:p-12 h-full animate-fade-in-up" style={{ animationDelay: '200ms' }}>
            <h2 className="text-2xl font-display font-bold tracking-tight mb-8">
              Send a Message
            </h2>

            <form className="space-y-8" onSubmit={(e) => e.preventDefault()}>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-3">
                  <label className="text-[10px] font-bold tracking-widest uppercase text-[#ccff00]">Name</label>
                  <input 
                    type="text" 
                    placeholder="John Doe" 
                    className="w-full bg-[#0a0a0a] border border-[#333] rounded-2xl px-4 py-4 text-sm text-white placeholder-gray-700 focus:outline-none focus:border-[#ccff00] transition-colors"
                  />
                </div>
                <div className="space-y-3">
                  <label className="text-[10px] font-bold tracking-widest uppercase text-[#ccff00]">Email</label>
                  <input 
                    type="email" 
                    placeholder="john@example.com" 
                    className="w-full bg-[#0a0a0a] border border-[#333] rounded-2xl px-4 py-4 text-sm text-white placeholder-gray-700 focus:outline-none focus:border-[#ccff00] transition-colors"
                  />
                </div>
              </div>

              <div className="space-y-3">
                <label className="text-[10px] font-bold tracking-widest uppercase text-[#ccff00]">Message</label>
                <textarea 
                  rows={5}
                  placeholder="Tell me about your project, timeline, and expectations..." 
                  className="w-full bg-[#0a0a0a] border border-[#333] rounded-2xl px-4 py-4 text-sm text-white placeholder-gray-700 focus:outline-none focus:border-[#ccff00] transition-colors resize-none"
                />
              </div>

              <button type="submit" className="flex items-center justify-center gap-2 w-full md:w-auto bg-[#ccff00] border border-[#ccff00] rounded-full text-black px-8 py-4 font-bold text-sm hover:bg-transparent hover:text-[#ccff00] transition-colors">
                Send Message <ArrowUpRight size={16} />
              </button>
            </form>
          </div>

        </div>

        {/* Footer */}
        <div className="flex flex-col md:flex-row justify-between items-center border-t-2 border-[#222] pt-8 pb-4">
          <div className="text-gray-500 text-[10px] font-bold tracking-widest uppercase mb-4 md:mb-0">
            <p>© {new Date().getFullYear()} {data.email ? data.email.split('@')[0] : 'Portfolio'}. All rights reserved.</p>
          </div>
          
          {socials && socials.length > 0 && (
            <div className="flex gap-4">
              {socials.map((social, idx) => (
                <a key={idx} href={social.url} target="_blank" rel="noreferrer" className="text-gray-500 hover:text-[#ccff00] transition-colors">
                  <span className="sr-only">{social.platform}</span>
                  <div className="w-8 h-8 rounded-full border border-[#333] flex items-center justify-center text-xs font-bold bg-[#111]">
                    {social.platform.charAt(0).toUpperCase()}
                  </div>
                </a>
              ))}
            </div>
          )}
        </div>
        
      </div>
    </section>
  );
};
