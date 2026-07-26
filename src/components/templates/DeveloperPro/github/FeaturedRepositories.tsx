import React from 'react';
import { GithubRepo } from './types';
import { Star, GitFork, ExternalLink, GitBranch, ShieldCheck, ShieldAlert, EyeOff, Eye } from 'lucide-react';

interface Props {
  repos: GithubRepo[];
  isEditMode?: boolean;
  hiddenRepos?: number[];
  toggleRepo?: (id: number) => void;
}

export function FeaturedRepositories({ repos, isEditMode, hiddenRepos = [], toggleRepo }: Props) {
  // Sort by recently updated
  let featured = [...repos]
    .sort((a, b) => new Date(b.updated_at).getTime() - new Date(a.updated_at).getTime());
    
  if (!isEditMode) {
     featured = featured.filter(r => !hiddenRepos.includes(r.id)).slice(0, 6);
  } else {
     // In edit mode show top 12 so they can pick which 6 to feature
     featured = featured.slice(0, 12);
  }

  if (featured.length === 0) return null;

  const isHealthy = (dateStr: string) => {
    const days = (new Date().getTime() - new Date(dateStr).getTime()) / (1000 * 3600 * 24);
    return days <= 30; // updated within last 30 days is healthy
  };

  const isInactive = (dateStr: string) => {
    const days = (new Date().getTime() - new Date(dateStr).getTime()) / (1000 * 3600 * 24);
    return days > 180; // no updates in 6 months is inactive
  };

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <h3 className="text-2xl font-bold text-white tracking-tight">Featured Repositories</h3>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {featured.map((repo) => {
          const healthy = isHealthy(repo.updated_at);
          const inactive = isInactive(repo.updated_at);
          const isHidden = hiddenRepos.includes(repo.id);

          return (
            <div 
              key={repo.id} 
              className={`group bg-[#111113] border ${isHidden ? 'border-red-500/30 opacity-50' : 'border-[rgba(255,255,255,0.06)]'} hover:border-[#2DD4BF]/30 rounded-sm p-6 transition-all duration-300 ${!isHidden ? 'hover:-translate-y-1 hover:shadow-xl hover:shadow-[#2DD4BF]/5' : ''} flex flex-col h-full relative overflow-hidden`}
            >
              {/* Edit Mode Toggle Overlay */}
              {isEditMode && (
                <button
                  onClick={() => toggleRepo?.(repo.id)}
                  className={`absolute top-4 right-4 z-20 p-2 rounded-sm transition-all ${isHidden ? 'bg-red-500/20 text-red-400 hover:bg-red-500/40' : 'bg-white/10 text-white/50 hover:bg-white/20 hover:text-white'}`}
                  title={isHidden ? "Show Repository" : "Hide Repository"}
                >
                  {isHidden ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              )}

              <a 
                href={repo.html_url}
                target="_blank"
                rel="noreferrer"
                className={`flex flex-col h-full ${isHidden ? 'pointer-events-none' : ''}`}
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="p-2 bg-[#2DD4BF]/10 rounded-sm text-[#2DD4BF] group-hover:scale-110 transition-transform">
                    <GitBranch size={24} />
                  </div>
                  <div className="flex items-center gap-3 pr-8">
                    {/* Health Indicator */}
                    {healthy && (
                      <div className="flex items-center gap-1.5 px-2 py-1 bg-green-500/10 text-green-400 rounded-lg text-xs font-semibold">
                        <ShieldCheck size={12} /> Healthy
                      </div>
                    )}
                    {inactive && (
                      <div className="flex items-center gap-1.5 px-2 py-1 bg-red-500/10 text-red-400 rounded-lg text-xs font-semibold">
                        <ShieldAlert size={12} /> Inactive
                      </div>
                    )}
                    {!isEditMode && <ExternalLink size={18} className="text-white/20 group-hover:text-white transition-all group-hover:rotate-45" />}
                  </div>
                </div>
                
                <h4 className="text-xl font-bold text-white mb-2 group-hover:text-[#2DD4BF] transition-colors line-clamp-1">
                  {repo.name}
                </h4>
                
                <p className="text-white/50 text-sm mb-6 flex-1 line-clamp-3 leading-relaxed">
                  {repo.description || 'No description provided.'}
                </p>
                
                <div className="flex items-center gap-4 text-xs font-semibold tracking-wider text-white/40 mt-auto pt-4 border-t border-white/5">
                  {repo.language && (
                    <div className="flex items-center gap-1.5">
                      <span className="w-2.5 h-2.5 rounded-full bg-[#2DD4BF]/80"></span>
                      {repo.language}
                    </div>
                  )}
                  <div className="flex items-center gap-1.5 hover:text-white transition-colors">
                    <Star size={14} /> {repo.stargazers_count}
                  </div>
                  <div className="flex items-center gap-1.5 hover:text-white transition-colors">
                    <GitFork size={14} /> {repo.forks_count}
                  </div>
                </div>
              </a>
            </div>
          );
        })}
      </div>
    </div>
  );
}
