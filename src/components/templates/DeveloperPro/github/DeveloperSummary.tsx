import React from 'react';
import { GithubProfile, CalculatedStats } from './types';
import { ExternalLink, Users, BookOpen, Activity } from 'lucide-react';

interface Props {
  profile: GithubProfile;
  stats: CalculatedStats;
}

export function DeveloperSummary({ profile, stats }: Props) {
  return (
    <div className="bg-[#111113] md:bg-[#111113] rounded-sm p-6 md:p-0 relative group">
      <div className="relative z-10 flex flex-col md:flex-row gap-8 items-start md:items-center">
        {/* Left: Avatar & Info */}
        <div className="flex gap-6 items-center flex-1">
          <div className="relative shrink-0">
            <div className="w-24 h-24 rounded-full overflow-hidden border border-white/10">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img 
                src={profile.avatar_url} 
                alt={profile.name || profile.login} 
                className="w-full h-full rounded-full object-cover"
              />
            </div>
            <div className="absolute -bottom-2 -right-2 bg-black border border-white/10 rounded-full p-2">
              <div className={`w-3 h-3 rounded-full ${stats.daysSinceLastContribution <= 14 ? 'bg-green-500 shadow-[0_0_10px_rgba(34,197,94,0.5)]' : stats.daysSinceLastContribution <= 30 ? 'bg-yellow-500' : 'bg-red-500'}`} />
            </div>
          </div>
          
          <div className="flex flex-col">
            <h3 className="text-2xl md:text-3xl font-bold text-white tracking-tight flex items-center gap-3">
              {profile.name || profile.login}
              <a 
                href={profile.html_url} 
                target="_blank" 
                rel="noreferrer"
                className="text-white/30 hover:text-white transition-colors"
              >
                <ExternalLink size={18} />
              </a>
            </h3>
            <p className="text-white/50 text-sm font-medium mb-2">@{profile.login}</p>
            {profile.bio && (
              <p className="text-white/70 text-sm max-w-md leading-relaxed line-clamp-2">
                {profile.bio}
              </p>
            )}
          </div>
        </div>

        {/* Right: Stats Highlights */}
        <div className="flex flex-wrap md:flex-nowrap gap-6 w-full md:w-auto shrink-0 mt-4 md:mt-0">
          <div className="flex flex-col gap-1">
            <div className="flex items-center gap-2 text-white/40 mb-1">
              <Users size={14} />
              <span className="text-xs font-bold uppercase tracking-wider">Followers</span>
            </div>
            <span className="text-2xl font-bold text-white tracking-tight">{profile.followers}</span>
          </div>
          
          <div className="flex flex-col gap-1">
            <div className="flex items-center gap-2 text-white/40 mb-1">
              <BookOpen size={14} />
              <span className="text-xs font-bold uppercase tracking-wider">Repositories</span>
            </div>
            <span className="text-2xl font-bold text-white tracking-tight">{profile.public_repos}</span>
          </div>

          <div className="flex flex-col gap-1">
            <div className="flex items-center gap-2 text-[#2DD4BF]/60 mb-1">
              <Activity size={14} />
              <span className="text-xs font-bold uppercase tracking-wider text-[#2DD4BF]">Contributions</span>
            </div>
            <span className="text-2xl font-bold text-[#2DD4BF] tracking-tight">{stats.totalContributions}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
