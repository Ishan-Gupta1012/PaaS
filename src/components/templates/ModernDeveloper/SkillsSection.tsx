import React from 'react';
import { PortfolioData } from '@/types/portfolio';
import { Code2, Hexagon, Database, Server, GitBranch, Paintbrush, Cloud, Sparkles, Terminal, Box, Cpu, Layout, Smartphone } from 'lucide-react';

const getSkillIcon = (name: string) => {
  const lower = name.toLowerCase();
  if (lower.includes('react') || lower.includes('next') || lower.includes('vue') || lower.includes('angular') || lower.includes('ui') || lower.includes('frontend')) return { Icon: Layout, color: 'text-cyan-400' };
  if (lower.includes('native') || lower.includes('android') || lower.includes('ios') || lower.includes('mobile')) return { Icon: Smartphone, color: 'text-purple-400' };
  if (lower.includes('sql') || lower.includes('mongo') || lower.includes('db') || lower.includes('database') || lower.includes('supabase') || lower.includes('firebase')) return { Icon: Database, color: 'text-emerald-400' };
  if (lower.includes('node') || lower.includes('express') || lower.includes('backend') || lower.includes('api')) return { Icon: Server, color: 'text-green-500' };
  if (lower.includes('git')) return { Icon: GitBranch, color: 'text-orange-500' };
  if (lower.includes('css') || lower.includes('tailwind') || lower.includes('sass') || lower.includes('design') || lower.includes('figma')) return { Icon: Paintbrush, color: 'text-pink-400' };
  if (lower.includes('aws') || lower.includes('cloud') || lower.includes('vercel') || lower.includes('netlify') || lower.includes('render') || lower.includes('hosting')) return { Icon: Cloud, color: 'text-blue-400' };
  if (lower.includes('three') || lower.includes('gsap') || lower.includes('animation') || lower.includes('motion') || lower.includes('canvas')) return { Icon: Sparkles, color: 'text-yellow-400' };
  if (lower.includes('c++') || lower.includes('java') || lower.includes('python') || lower.includes('ruby') || lower.includes('go') || lower.includes('rust') || lower.includes('c#')) return { Icon: Terminal, color: 'text-indigo-400' };
  if (lower.includes('js') || lower.includes('javascript') || lower.includes('typescript') || lower.includes('html')) return { Icon: Code2, color: 'text-yellow-500' };
  return { Icon: Box, color: 'text-gray-400' };
};

interface Props {
  data: PortfolioData['skills'];
}

export const SkillsSection: React.FC<Props> = ({ data }) => {
  const orbitConfigs = [
    { radius: 140, speed: 40, capacity: 5 },
    { radius: 240, speed: 55, capacity: 9 },
    { radius: 340, speed: 70, capacity: 14 },
    { radius: 440, speed: 85, capacity: 20 },
  ];

  let currentIdx = 0;
  const orbits = orbitConfigs.map((config) => {
    const chunk = data.slice(currentIdx, currentIdx + config.capacity);
    currentIdx += config.capacity;
    return { ...config, chunk };
  }).filter(orbit => orbit.chunk.length > 0);

  return (
    <section id="skills" className="py-40 bg-transparent relative overflow-hidden flex flex-col items-center">
      
      <div className="text-center mb-12 relative z-10">
        <p className="text-gray-500 text-xs font-semibold tracking-widest uppercase mb-4">Built With Precision</p>
        <h2 className="text-4xl md:text-5xl lg:text-6xl font-display font-extrabold tracking-tight text-white uppercase">
          STACK <span className="text-[#ccff00] italic">MASTERY</span>
        </h2>
      </div>

      <div className="w-full relative z-10 flex justify-center items-center min-h-[900px] mt-10">
        
        {/* Core Node */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-28 h-28 md:w-36 md:h-36 bg-[#111] border border-[#ccff00] rounded-full shadow-[0_0_50px_rgba(204,255,0,0.2)] flex flex-col items-center justify-center z-50">
          <Hexagon size={40} className="text-[#ccff00] mb-2" />
          <span className="text-[#ccff00] font-bold text-xs md:text-sm uppercase tracking-widest">Core</span>
        </div>

        {/* Orbits */}
        {orbits.map((orbit, orbitIndex) => (
          <div 
            key={`orbit-${orbitIndex}`}
            className="absolute top-1/2 left-1/2 border border-white/5 rounded-full pointer-events-none"
            style={{ width: `${orbit.radius * 2}px`, height: `${orbit.radius * 2}px`, transform: `translate(-50%, -50%)` }}
          >
            <div 
              className="w-full h-full absolute inset-0 pointer-events-auto"
              style={{ animation: `orbit-spin ${orbit.speed}s linear infinite` }}
            >
              {orbit.chunk.map((skill, index) => {
                const angle = (360 / orbit.chunk.length) * index;
                const isFirst = index === 0 && orbitIndex === 0;
                
                return (
                  <div 
                    key={skill.id}
                    className="absolute top-1/2 left-1/2"
                    style={{ transform: `translate(-50%, -50%) rotate(${angle}deg) translateY(-${orbit.radius}px)` }}
                  >
                    <div style={{ animation: `orbit-spin-reverse ${orbit.speed}s linear infinite` }}>
                      <div 
                        className={`
                          flex flex-col items-center justify-center gap-2 w-24 h-24 md:w-28 md:h-28 rounded-2xl
                          ${isFirst ? 'bg-[#111] border border-[#ccff00] shadow-[0_0_20px_rgba(204,255,0,0.15)]' : 'bg-[#111]/90 backdrop-blur-sm border border-[#222] hover:border-[#ccff00]/50 hover:shadow-[0_4px_20px_rgba(204,255,0,0.1)]'}
                          transition-all duration-300 cursor-pointer group
                        `}
                        style={{ transform: `rotate(-${angle}deg)` }}
                      >
                        {(() => {
                          const { Icon, color } = getSkillIcon(skill.name);
                          return (
                            <div className={`transition-all duration-300 ${color} opacity-60 group-hover:opacity-100 group-hover:scale-110`}>
                              <Icon size={28} />
                            </div>
                          );
                        })()}
                        <span className={`text-[9px] md:text-[10px] font-bold uppercase tracking-widest text-center px-2 transition-colors duration-300 ${isFirst ? 'text-white' : 'text-gray-400 group-hover:text-white'}`}>
                          {skill.name}
                        </span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};
