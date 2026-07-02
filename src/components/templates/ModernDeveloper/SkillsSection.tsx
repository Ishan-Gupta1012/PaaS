import React from 'react';
import { PortfolioData } from '@/types/portfolio';
import { Code2, Hexagon } from 'lucide-react';

interface Props {
  data: PortfolioData['skills'];
}

export const SkillsSection: React.FC<Props> = ({ data }) => {
  return (
    <section id="skills" className="py-40 bg-transparent relative overflow-hidden flex flex-col items-center border-b border-[#1a1a1a]">
      
      <style>{`
        .bg-tech-grid {
          background-image: 
            linear-gradient(rgba(204, 255, 0, 0.05) 1px, transparent 1px),
            linear-gradient(90deg, rgba(204, 255, 0, 0.05) 1px, transparent 1px);
          background-size: 60px 60px;
          background-position: center center;
          mask-image: radial-gradient(circle at center, black 30%, transparent 80%);
          -webkit-mask-image: radial-gradient(circle at center, black 30%, transparent 80%);
        }
        @keyframes scanline {
          0% { transform: translateY(-100vh); }
          100% { transform: translateY(100vh); }
        }
        .animate-scan {
          animation: scanline 10s linear infinite;
        }
      `}</style>
      
      {/* Stack Mastery Specific Pattern */}
      <div className="absolute inset-0 z-0 pointer-events-none flex items-center justify-center opacity-80">
        <div className="absolute inset-0 bg-tech-grid" />
        <div className="absolute top-0 left-0 w-full h-[1px] bg-[#ccff00] opacity-30 animate-scan shadow-[0_0_15px_#ccff00]" />
        <div className="absolute w-[600px] h-[600px] bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-[#ccff00]/5 via-[#ccff00]/2 to-transparent blur-[80px] rounded-full animate-pulse" style={{ animationDuration: '6s' }} />
      </div>

      <div className="text-center mb-24 relative z-10">
        <p className="text-gray-500 text-xs font-semibold tracking-widest uppercase mb-4">Built With Precision</p>
        <h2 className="text-4xl md:text-5xl lg:text-6xl font-display font-extrabold tracking-tight text-white uppercase">
          STACK <span className="text-[#ccff00] italic">MASTERY</span>
        </h2>
      </div>

      <div className="w-full max-w-4xl mx-auto px-6 relative z-10">
        <div className="flex flex-wrap justify-center gap-4 md:gap-6">
          {data.map((skill, index) => {
            const isFirst = index === 0;
            return (
              <div 
                key={skill.id} 
                className={`
                  flex flex-col items-center justify-center gap-3 w-24 h-24 md:w-28 md:h-28 rounded-2xl
                  ${isFirst ? 'bg-[#111] border border-[#ccff00] shadow-[0_0_20px_rgba(204,255,0,0.15)]' : 'bg-[#111] border border-[#222] hover:border-[#ccff00]/50'}
                  transition-all cursor-pointer group
                `}
              >
                <div className={`${isFirst ? 'text-[#ccff00]' : 'text-gray-500 group-hover:text-[#ccff00]'} transition-colors`}>
                  {isFirst ? <Hexagon size={28} /> : <Code2 size={28} />}
                </div>
                <span className={`text-[9px] md:text-[10px] font-bold uppercase tracking-widest text-center px-2 ${isFirst ? 'text-white' : 'text-gray-500 group-hover:text-white'} transition-colors`}>
                  {skill.name}
                </span>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
