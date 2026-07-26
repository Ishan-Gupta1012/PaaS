/* eslint-disable */
import React, { useMemo } from 'react';
import { GithubRepo } from './types';
import { Code } from 'lucide-react';

interface Props {
  repos: GithubRepo[];
  customLanguages?: string[];
  setCustomLanguages?: React.Dispatch<React.SetStateAction<string[]>>;
  isEditMode?: boolean;
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

export function LanguageChart({ repos, customLanguages = [], setCustomLanguages, isEditMode }: Props) {
  const [newLanguage, setNewLanguage] = React.useState('');

  const languageStats = useMemo(() => {
    const counts: Record<string, number> = {};
    
    // Add custom languages first
    customLanguages.forEach(lang => {
      counts[lang] = 999; // Ensure custom languages always show up at the top
    });

    repos.forEach(repo => {
      if (repo.language) {
        counts[repo.language] = (counts[repo.language] || 0) + 1;
      }
    });

    return Object.entries(counts)
      .map(([name, count]) => ({
        name,
        count,
        color: LANGUAGE_COLORS[name] || '#8b949e'
      }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 10);
  }, [repos]);

  if (languageStats.length === 0) return null;

  return (
    <div className="bg-[#111113] border border-[rgba(255,255,255,0.06)] rounded-sm p-6 flex flex-col gap-4 relative h-fit">
      <div className="flex items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-[#2DD4BF]/10 rounded-sm text-[#2DD4BF]">
            <Code size={18} />
          </div>
          <h3 className="text-lg font-bold text-white tracking-tight">Languages</h3>
        </div>
      </div>

      <div className="flex flex-wrap gap-2">
        {languageStats.map((lang) => (
          <div 
            key={lang.name} 
            className="flex items-center gap-2 px-3 py-1.5 rounded-sm border border-[rgba(255,255,255,0.06)] bg-[#16161A] text-sm font-medium text-white/80"
          >
            <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: lang.color }} />
            {lang.name}
            {isEditMode && customLanguages.includes(lang.name) && (
              <button 
                onClick={() => setCustomLanguages?.(prev => prev.filter(l => l !== lang.name))}
                className="ml-1 text-white/40 hover:text-red-400"
              >×</button>
            )}
          </div>
        ))}
      </div>

      {isEditMode && setCustomLanguages && (
        <form 
          onSubmit={(e) => {
            e.preventDefault();
            if (newLanguage.trim() && !customLanguages.includes(newLanguage.trim())) {
              setCustomLanguages(prev => [...prev, newLanguage.trim()]);
              setNewLanguage('');
            }
          }}
          className="flex gap-2 mt-2"
        >
          <input 
            type="text" 
            value={newLanguage}
            onChange={(e) => setNewLanguage(e.target.value)}
            placeholder="Add language..."
            className="flex-1 bg-[#16161A] border border-[rgba(255,255,255,0.06)] rounded-sm px-3 py-1.5 text-sm text-white placeholder-white/30 focus:outline-none focus:border-[#2DD4BF]/50"
          />
          <button type="submit" className="px-3 py-1.5 bg-[#2DD4BF] text-black rounded-sm text-sm font-bold hover:bg-[#2DD4BF]/90">
            Add
          </button>
        </form>
      )}
    </div>
  );
}
