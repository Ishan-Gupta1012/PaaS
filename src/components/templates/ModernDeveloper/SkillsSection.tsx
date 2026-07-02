import React from 'react';
import { PortfolioData } from '@/types/portfolio';
import { Code2, Hexagon } from 'lucide-react';

interface Props {
  data: PortfolioData['skills'];
}

export const SkillsSection: React.FC<Props> = ({ data }) => {
  return (
    <section id="skills" className="py-40 bg-transparent relative overflow-hidden flex flex-col items-center">
      
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
