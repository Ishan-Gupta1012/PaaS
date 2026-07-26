import React from 'react';
import { CalculatedStats, GithubProfile, GithubRepo } from './types';
import { Target, Check, X, Clock } from 'lucide-react';

interface Props {
  stats: CalculatedStats;
  profile: GithubProfile;
  repos: GithubRepo[];
}

export function PortfolioCoach({ stats, profile, repos }: Props) {
  const issues: string[] = [];

  // Bio check
  if (!profile.bio) {
    issues.push('Missing GitHub bio');
  }

  // Descriptions check
  const reposWithoutDesc = repos.filter(r => !r.description).length;
  if (reposWithoutDesc > 0) {
    issues.push(`${reposWithoutDesc} repositories missing descriptions`);
  }

  // Activity check
  if (stats.daysSinceLastContribution > 30) {
    issues.push(`Inactive: No contributions in ${stats.daysSinceLastContribution} days`);
  }

  // Consistency check
  if (stats.averageWeeklyContributions < 1) {
    issues.push('Low contribution frequency');
  }

  // Determine top recommendation based on issues
  let recommendation = 'Keep building and pushing code consistently!';
  let estimatedTime = 'Ongoing';

  if (!profile.bio) {
    recommendation = 'Add a professional bio to your GitHub profile to help recruiters understand your background.';
    estimatedTime = '2 minutes';
  } else if (reposWithoutDesc > 0) {
    recommendation = 'Update repository descriptions to improve recruiter experience and boost visibility.';
    estimatedTime = '5 minutes';
  } else if (stats.daysSinceLastContribution > 30) {
    recommendation = 'Push a new commit or open a pull request to show you are currently active.';
    estimatedTime = '15 minutes';
  }

  return (
    <div className="bg-gradient-to-br from-primary/5 via-[#0a0a0a] to-black border border-white/5 rounded-[2rem] p-8 md:p-10 flex flex-col gap-8 shadow-2xl relative h-full">
      <div className="absolute top-0 right-0 w-64 h-64 bg-primary/10 blur-[100px] rounded-full pointer-events-none" />
      
      <div className="flex flex-col md:flex-row md:items-start justify-between gap-6 relative z-10">
        <div className="flex flex-col gap-2">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-primary/20 rounded-xl text-primary shadow-lg shadow-primary/20">
              <Target size={24} />
            </div>
            <h3 className="text-2xl font-bold text-white tracking-tight">Portfolio Coach</h3>
          </div>
          <p className="text-white/50 text-sm pl-14">AI-driven insights to elevate your profile.</p>
        </div>
        
        <div className="flex flex-col items-start md:items-end bg-white/5 md:bg-transparent p-4 md:p-0 rounded-2xl md:rounded-none">
          <span className="text-[10px] font-bold uppercase tracking-widest text-white/40 mb-1">Portfolio Score</span>
          <div className="flex items-baseline gap-1">
            <span className={`text-5xl font-black tracking-tighter ${stats.portfolioScore >= 80 ? 'text-green-400' : stats.portfolioScore >= 50 ? 'text-yellow-400' : 'text-red-400'}`}>
              {stats.portfolioScore}
            </span>
            <span className="text-xl text-white/30 font-bold">/100</span>
          </div>
        </div>
      </div>

      <div className="flex flex-col gap-4 flex-1 relative z-10">
        <h4 className="text-sm font-bold text-white/80 tracking-wide">Top Issues</h4>
        {issues.length > 0 ? (
          issues.slice(0, 3).map((issue, idx) => (
            <div key={idx} className="flex items-start gap-3 bg-red-500/5 border border-red-500/10 p-3 rounded-xl">
              <X size={18} className="text-red-500 shrink-0 mt-0.5" />
              <span className="text-sm text-red-200/80 font-medium">
                {issue}
              </span>
            </div>
          ))
        ) : (
          <div className="flex items-start gap-3 bg-green-500/5 border border-green-500/10 p-3 rounded-xl">
            <Check size={18} className="text-green-500 shrink-0 mt-0.5" />
            <span className="text-sm text-green-200/80 font-medium">
              Your profile looks incredible. No major issues found!
            </span>
          </div>
        )}
      </div>

      <div className="mt-4 pt-6 border-t border-white/5 relative z-10 bg-white/[0.02] -mx-8 -mb-8 p-8 rounded-b-[2rem]">
        <span className="text-[10px] font-bold uppercase tracking-wider text-primary mb-3 block flex items-center gap-2">
          Recommended Action
        </span>
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 group/action">
          <p className="text-base text-white/90 leading-relaxed font-medium md:max-w-[70%]">
            {recommendation}
          </p>
          <div className="flex items-center gap-4 shrink-0">
            <div className="flex items-center gap-1.5 text-xs font-bold text-white/40 bg-white/5 px-3 py-1.5 rounded-full">
              <Clock size={14} /> {estimatedTime}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
