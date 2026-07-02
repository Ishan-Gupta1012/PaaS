/* eslint-disable @next/next/no-img-element */
import React from 'react';
import { PortfolioData } from '@/types/portfolio';
import { ArrowUpRight } from 'lucide-react';

interface Props {
  data: PortfolioData['projects'];
}

export const ProjectsSection: React.FC<Props> = ({ data }) => {
  if (!data || data.length === 0) return null;

  return (
    <section id="projects" className="py-40 bg-transparent relative overflow-hidden">
      
      <div className="w-full max-w-[1400px] mx-auto px-6 relative z-10">
        
        {/* Header */}
        <div className="flex flex-col items-center justify-center mb-32">
          <h2 className="font-display text-5xl md:text-7xl font-extrabold tracking-tight text-white mb-6">
            Selected Works
          </h2>
          <div className="w-24 h-1 bg-gradient-to-r from-transparent via-[#ccff00] to-transparent rounded-full shadow-[0_0_15px_#ccff00]" />
        </div>

        <div className="space-y-40">
          {data.map((project, index) => {
            const isEven = index % 2 === 0;
            return (
              <div 
                key={project.id}
                className={`flex flex-col ${isEven ? 'lg:flex-row' : 'lg:flex-row-reverse'} items-center gap-16 lg:gap-24`}
              >
                {/* Image Side */}
                <div className="w-full lg:w-1/2 relative group">
                  {/* Outer Frame (iPad-like) */}
                  <div className="relative rounded-[40px] border border-[#222] bg-[#0a0a0a] p-4 shadow-2xl overflow-hidden aspect-[4/3] flex items-center justify-center transition-all duration-700 group-hover:border-[#ccff00]/50 group-hover:shadow-[0_0_40px_rgba(204,255,0,0.1)]">
                    
                    {/* Inner Screen */}
                    <div className="w-full h-full rounded-[28px] overflow-hidden bg-black relative">
                      {project.images && project.images.length > 0 && project.images[0] ? (
                        <img 
                          src={project.images[0]} 
                          alt={project.name || 'Project'} 
                          className="w-full h-full object-cover opacity-80 group-hover:opacity-100 group-hover:scale-105 transition-all duration-700" 
                        />
                      ) : (
                        <div className="w-full h-full bg-gradient-to-br from-[#111] to-black" />
                      )}
                    </div>
                  </div>
                  
                  {/* Decorative curved lines behind image (simulated with SVG) */}
                  <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[150%] h-[150%] pointer-events-none -z-10 opacity-20">
                     <svg viewBox="0 0 100 100" className="w-full h-full fill-none stroke-[#ccff00] stroke-[0.2]">
                        <path d="M -20,50 Q 50,0 120,50" />
                        <path d="M -20,60 Q 50,110 120,60" />
                     </svg>
                  </div>
                </div>

                {/* Text Side */}
                <div className="w-full lg:w-1/2 flex flex-col justify-center">
                  <h3 className="font-display text-4xl md:text-5xl font-bold tracking-tight text-white mb-6">
                    {project.name || 'Untitled Project'}
                  </h3>
                  
                  <p className="text-lg md:text-xl text-gray-400 mb-10 leading-relaxed font-light">
                    {project.description}
                  </p>
                  
                  {/* Tech Stack Pills */}
                  <div className="flex flex-wrap gap-3 mb-12">
                    {project.techStack.map((tech, i) => (
                      <span 
                        key={i}
                        className="px-5 py-2 bg-transparent text-gray-300 text-xs font-semibold rounded-full border border-[#333] uppercase tracking-widest"
                      >
                        {tech}
                      </span>
                    ))}
                  </div>

                  {/* Links */}
                  <div className="flex flex-wrap gap-4">
                    {project.liveUrl && (
                      <a 
                        href={project.liveUrl} 
                        target="_blank" 
                        rel="noopener noreferrer" 
                        className="inline-flex items-center gap-3 px-8 py-4 rounded-full border border-white/20 text-white font-medium hover:bg-white hover:text-black transition-all group"
                      >
                        Visit Live Site <ArrowUpRight size={18} className="group-hover:rotate-45 transition-transform" />
                      </a>
                    )}
                    {project.demoVideoUrl && !project.liveUrl && (
                      <a 
                        href={project.demoVideoUrl} 
                        target="_blank" 
                        rel="noopener noreferrer" 
                        className="inline-flex items-center gap-3 px-8 py-4 rounded-full border border-white/20 text-white font-medium hover:bg-white hover:text-black transition-all group"
                      >
                        Demo Video <ArrowUpRight size={18} className="group-hover:rotate-45 transition-transform" />
                      </a>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
