import React from 'react';
import { PortfolioData } from '@/types/portfolio';

interface Props {
  data: PortfolioData['achievements'];
}

export const AchievementSection: React.FC<Props> = ({ data }) => {
  if (!data || data.length === 0) return null;

  return (
    <section id="experience" className="py-40 bg-transparent relative overflow-hidden border-b border-[#1a1a1a]">
      
      {/* Decorative Background Elements */}
      <div className="absolute top-0 right-0 w-1/2 h-[600px] bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-white/[0.02] via-transparent to-transparent pointer-events-none" />

      <div className="w-full max-w-[1400px] mx-auto px-6 relative z-10">
        
        {/* Header */}
        <div className="flex flex-col items-center justify-center mb-32 text-center">
          <p className="text-gray-500 text-xs font-semibold tracking-widest uppercase mb-4">My Journey</p>
          <h2 className="font-display text-5xl md:text-7xl font-extrabold tracking-tight text-white mb-6">
            Achievements
          </h2>
          <div className="w-24 h-1 bg-gradient-to-r from-transparent via-[#ccff00] to-transparent rounded-full shadow-[0_0_15px_#ccff00]" />
        </div>

        {/* Central Timeline */}
        <div className="relative max-w-5xl mx-auto">
          
          {/* The Central Line */}
          {/* On mobile it's on the left, on desktop it's perfectly centered */}
          <div className="absolute left-[24px] md:left-1/2 md:-translate-x-1/2 top-4 bottom-4 w-1 bg-gradient-to-b from-[#ccff00]/10 via-[#ccff00]/30 to-transparent" />

          <div className="space-y-16 md:space-y-24">
            {data.map((item, index) => {
              // Even index: Content on Left (Reverse flex)
              // Odd index: Content on Right (Normal flex)
              const isEven = index % 2 === 0; 
              
              return (
                <div 
                  key={item.id} 
                  className={`relative flex flex-col md:flex-row items-center justify-between w-full group ${isEven ? 'md:flex-row-reverse' : ''}`}
                >
                  
                  {/* Timeline Glowing Node */}
                  {/* On mobile it sits on the left line, on desktop it sits exactly on the center line */}
                  <div className="absolute left-[24px] md:left-1/2 -translate-x-1/2 top-8 md:top-1/2 md:-translate-y-1/2 w-4 h-4 rounded-full bg-[#ccff00] border-4 border-[#0a0a0a] box-content z-10 shadow-[0_0_20px_rgba(204,255,0,0.8)] group-hover:scale-150 transition-transform duration-500" />

                  {/* Empty Spacer (Desktop Only) to push content to one side */}
                  <div className="hidden md:block md:w-[45%]" />

                  {/* Content Box */}
                  <div className={`w-full md:w-[45%] pl-16 md:pl-0 ${isEven ? 'md:pr-12 md:text-right' : 'md:pl-12 text-left'}`}>
                    <div className="bg-[#111] p-8 md:p-10 border border-[#222] rounded-[32px] group-hover:border-[#ccff00]/50 transition-all duration-500 hover:-translate-y-2 relative overflow-hidden">
                      
                      {/* Subtle hover gradient */}
                      <div className="absolute inset-0 bg-gradient-to-br from-[#ccff00]/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />

                      <div className={`flex flex-col ${isEven ? 'md:items-end' : 'items-start'} mb-6`}>
                        {item.type !== 'achievement' && (
                          <span className="px-3 py-1 bg-[#1a1a1a] text-[10px] font-bold text-gray-400 rounded-full uppercase tracking-widest mb-4">
                            {item.type}
                          </span>
                        )}
                        <span className="text-[#ccff00] font-bold text-sm tracking-widest uppercase">
                          {item.startDate} {item.endDate && item.endDate !== '' ? `— ${item.endDate}` : ''}
                        </span>
                      </div>

                      <h3 className="font-display text-3xl font-bold tracking-tight text-white mb-2 group-hover:text-[#ccff00] transition-colors">
                        {item.title || item.organization || 'Experience'}
                      </h3>
                      
                      {item.organization && item.title && (
                        <h4 className="text-xl text-gray-400 mb-6 font-medium">
                          {item.organization}
                        </h4>
                      )}
                      
                    </div>
                  </div>

                </div>
              );
            })}
          </div>

          {/* Journey Continues Blinker */}
          <div className="relative mt-16 md:mt-24 w-full h-10 flex items-center justify-start md:justify-center">
            <div className="absolute left-[24px] md:left-1/2 -translate-x-1/2 bg-[#0a0a0a] px-4 py-2 z-10">
              <span className="text-[#ccff00] font-bold text-[10px] md:text-xs tracking-widest uppercase animate-pulse whitespace-nowrap">
                The journey continues...
              </span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
