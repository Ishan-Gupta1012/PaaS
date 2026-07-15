import React, { useMemo } from 'react';
import { GithubRepo } from './types';
import { Code } from 'lucide-react';

interface Props {
  repos: GithubRepo[];
}

const LANGUAGE_COLORS: Record<string, string> = {
  TypeScript: '#3178c6',
  JavaScript: '#f1e05a',
  Python: '#3572A5',
  'C++': '#f34b7d',
  React: '#61dafb',
  'Node.js': '#339933',
  HTML: '#e34c26',
  CSS: '#563d7c',
  Java: '#b07219',
  Go: '#00ADD8',
  Rust: '#dea584',
  Swift: '#F05138',
  Kotlin: '#A97BFF',
  Ruby: '#701516',
  PHP: '#4F5D95',
  'C#': '#178600',
  C: '#555555'
};

export function LanguageChart({ repos }: Props) {
  const languageStats = useMemo(() => {
    const counts: Record<string, number> = {};
    let total = 0;

    repos.forEach(repo => {
      if (repo.language) {
        counts[repo.language] = (counts[repo.language] || 0) + 1;
        total += 1;
      }
    });

    return Object.entries(counts)
      .map(([name, count]) => ({
        name,
        count,
        percentage: (count / total) * 100,
        color: LANGUAGE_COLORS[name] || '#8b949e'
      }))
      .sort((a, b) => b.percentage - a.percentage)
      .slice(0, 5);
  }, [repos]);

  if (languageStats.length === 0) return null;

  return (
    <div className="bg-[#0a0a0a] border border-white/5 rounded-[2rem] p-6 md:p-8 flex flex-col gap-6 relative h-full">
      <div className="flex items-center gap-3 mb-2">
        <div className="p-2 bg-pink-500/10 rounded-xl text-pink-400">
          <Code size={20} />
        </div>
        <h3 className="text-xl font-bold text-white tracking-tight">Languages Used</h3>
      </div>

      <div className="flex flex-col gap-5 flex-1 justify-center">
        {languageStats.map((lang) => (
          <div key={lang.name} className="flex flex-col gap-2">
            <div className="flex items-center justify-between text-sm">
              <span className="font-semibold text-white/80">{lang.name}</span>
              <span className="text-white/40">{lang.percentage.toFixed(1)}%</span>
            </div>
            <div className="w-full h-2 bg-white/5 rounded-full overflow-hidden">
              <div 
                className="h-full rounded-full transition-all duration-1000 ease-out"
                style={{ width: `${lang.percentage}%`, backgroundColor: lang.color }}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
