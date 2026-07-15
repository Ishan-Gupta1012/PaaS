import React from 'react';
import { GitHubCalendar } from 'react-github-calendar';
import { Activity, ExternalLink } from 'lucide-react';
import { CalculatedStats } from './types';

interface Props {
  username: string;
  stats: CalculatedStats;
}

export function ContributionGraph({ username, stats }: Props) {
  return (
    <div className="bg-[#0a0a0a] border border-white/5 rounded-[2rem] p-6 md:p-8 overflow-x-auto relative h-full">
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-2 text-white/80 font-bold tracking-wide">
          <Activity size={18} className="text-primary" /> GitHub Activity
        </div>
        <a 
          href={`https://github.com/${username}`} 
          target="_blank" 
          rel="noreferrer"
          className="text-white/40 hover:text-white transition-colors flex items-center gap-2 text-sm font-semibold group-hover:text-primary"
        >
          @{username} <ExternalLink size={16} className="group-hover:rotate-45 transition-transform" />
        </a>
      </div>
      
      <div className="min-w-[800px] pb-4">
        <GitHubCalendar 
          username={username} 
          colorScheme="dark"
          blockSize={14}
          blockMargin={5}
          fontSize={14}
        />
      </div>

      <div className="mt-6 pt-6 border-t border-white/10 grid grid-cols-3 gap-4">
        <div className="flex flex-col gap-1">
          <span className="text-xs font-bold uppercase tracking-wider text-white/40">Most Active Month</span>
          <span className="text-lg font-bold text-white">{stats.mostActiveMonth || 'N/A'}</span>
        </div>
        <div className="flex flex-col gap-1">
          <span className="text-xs font-bold uppercase tracking-wider text-white/40">Avg Weekly</span>
          <span className="text-lg font-bold text-white">{stats.averageWeeklyContributions.toFixed(1)} contributions</span>
        </div>
        <div className="flex flex-col gap-1">
          <span className="text-xs font-bold uppercase tracking-wider text-white/40">Total Commits</span>
          <span className="text-lg font-bold text-white">{stats.totalContributions} this year</span>
        </div>
      </div>
    </div>
  );
}
