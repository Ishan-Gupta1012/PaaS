import React from 'react';
import { CalculatedStats, GithubRepo } from './types';
import { Sparkles, CheckCircle2, AlertTriangle, Lightbulb } from 'lucide-react';

interface Props {
  stats: CalculatedStats;
  repos: GithubRepo[];
}

export function DeveloperInsights({ stats, repos }: Props) {
  const insights = [];

  // Insight 1: Consistency (Check if streak is good or activity is high)
  if (stats.currentStreak > 5 || stats.averageWeeklyContributions > 3) {
    insights.push({
      type: 'success',
      icon: <CheckCircle2 size={18} className="text-green-500 mt-0.5 shrink-0" />,
      text: 'Strong GitHub consistency and activity level.'
    });
  } else if (stats.daysSinceLastContribution > 14) {
    insights.push({
      type: 'warning',
      icon: <AlertTriangle size={18} className="text-yellow-500 mt-0.5 shrink-0" />,
      text: `Activity has slowed. Last contribution was ${stats.daysSinceLastContribution} days ago.`
    });
  }

  // Insight 2: Descriptions
  const reposWithoutDesc = repos.filter(r => !r.description).length;
  if (reposWithoutDesc > 0) {
    insights.push({
      type: 'warning',
      icon: <AlertTriangle size={18} className="text-yellow-500 mt-0.5 shrink-0" />,
      text: `${reposWithoutDesc} repositories are missing descriptions.`
    });
  }

  // Insight 3: Popularity/Growth
  const highStarRepos = repos.filter(r => r.stargazers_count > 50);
  if (highStarRepos.length > 0) {
    insights.push({
      type: 'success',
      icon: <CheckCircle2 size={18} className="text-green-500 mt-0.5 shrink-0" />,
      text: `You have ${highStarRepos.length} highly starred repositor${highStarRepos.length > 1 ? 'ies' : 'y'}.`
    });
  }

  return (
    <div className="bg-[#0a0a0a] border border-white/5 rounded-3xl p-6 md:p-8 flex flex-col gap-6 relative h-full">
      <div className="flex items-center gap-3 mb-2 relative z-10">
        <div className="p-2 bg-purple-500/10 rounded-xl text-purple-400">
          <Sparkles size={20} />
        </div>
        <h3 className="text-xl font-bold text-white tracking-tight">Developer Insights</h3>
      </div>

      <div className="flex flex-col gap-4 relative z-10 flex-1">
        {insights.map((insight, idx) => (
          <div key={idx} className="flex items-start gap-3">
            {insight.icon}
            <span className="text-sm font-medium text-white/80 leading-relaxed">
              {insight.text}
            </span>
          </div>
        ))}
      </div>

      <div className="mt-4 pt-4 border-t border-white/5 relative z-10">
        <div className="flex items-start gap-3 bg-white/5 p-4 rounded-xl">
          <Lightbulb size={18} className="text-white mt-0.5 shrink-0" />
          <div className="flex flex-col gap-1">
            <span className="text-xs font-bold uppercase tracking-wider text-white/50">Recommendation</span>
            <span className="text-sm text-white/90 leading-relaxed">
              Maintain a steady contribution graph and ensure all public repositories have concise descriptions.
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
