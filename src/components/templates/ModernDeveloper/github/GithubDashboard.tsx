/* eslint-disable */
import React, { useEffect, useState } from 'react';
import {
  GithubProfile, GithubRepo, GithubEvent,
  CalculatedStats, ContributionDay
} from './types';
import { DeveloperSummary } from './DeveloperSummary';
import { ContributionGraph } from './ContributionGraph';
import { DeveloperInsights } from './DeveloperInsights';
import { LanguageChart } from './LanguageChart';
import { FeaturedRepositories } from './FeaturedRepositories';
import { Timeline } from './Timeline';
import { PortfolioCoach } from './PortfolioCoach';
import { WidgetWrapper } from './WidgetWrapper';

import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent
} from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  rectSortingStrategy
} from '@dnd-kit/sortable';

import { GitBranch, Loader2, Settings2, Plus } from 'lucide-react';

interface Props {
  username?: string;
}

const DEFAULT_LAYOUT = ['summary', 'graph', 'languages'];

const WIDGET_NAMES: Record<string, string> = {
  summary: 'Developer Profile',
  graph: 'GitHub Activity',
  languages: 'Language Distribution',
};

export default function GithubDashboard({ username }: Props) {
  const [profile, setProfile] = useState<GithubProfile | null>(null);
  const [repos, setRepos] = useState<GithubRepo[]>([]);
  const [events, setEvents] = useState<GithubEvent[]>([]);
  const [stats, setStats] = useState<CalculatedStats | null>(null);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Dashboard Layout State
  const [isEditMode, setIsEditMode] = useState(false);
  const [layout, setLayout] = useState<string[]>(DEFAULT_LAYOUT);
  const [hiddenWidgets, setHiddenWidgets] = useState<string[]>([]);
  const [hiddenRepos, setHiddenRepos] = useState<number[]>([]);
  const [customLanguages, setCustomLanguages] = useState<string[]>([]);

  // Load layout from localStorage
  useEffect(() => {
    try {
      const savedLayout = localStorage.getItem('portfolio_os_github_layout');
      const savedHidden = localStorage.getItem('portfolio_os_github_hidden');
      const savedHiddenRepos = localStorage.getItem('portfolio_os_github_hidden_repos');
      const savedCustomLanguages = localStorage.getItem('portfolio_os_github_custom_languages');
      if (savedLayout) {
        const parsedLayout = JSON.parse(savedLayout).filter((id: string) => DEFAULT_LAYOUT.includes(id));
        setLayout(parsedLayout);
      }
      if (savedHidden) {
        const parsedHidden = JSON.parse(savedHidden).filter((id: string) => DEFAULT_LAYOUT.includes(id));
        setHiddenWidgets(parsedHidden);
      }
      if (savedHiddenRepos) setHiddenRepos(JSON.parse(savedHiddenRepos));
      if (savedCustomLanguages) setCustomLanguages(JSON.parse(savedCustomLanguages));
    } catch {
      // safe fallback
    }
  }, []);

  // Save preferences when they change
  useEffect(() => {
    localStorage.setItem('portfolio_os_github_layout', JSON.stringify(layout));
    localStorage.setItem('portfolio_os_github_hidden', JSON.stringify(hiddenWidgets));
    localStorage.setItem('portfolio_os_github_hidden_repos', JSON.stringify(hiddenRepos));
    localStorage.setItem('portfolio_os_github_custom_languages', JSON.stringify(customLanguages));
  }, [layout, hiddenWidgets, hiddenRepos, customLanguages]);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8, // Require 8px drag before activating
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const calculateStats = (contributionsData: { contributions: ContributionDay[][] }, reposData: GithubRepo[]): CalculatedStats => {
    let totalContributions = 0;
    let currentStreak = 0;
    let longestStreak = 0;
    let tempStreak = 0;
    let lastContributionDate: Date | null = null;
    const monthCounts: Record<string, number> = {};

    const days: ContributionDay[] = contributionsData.contributions.flat();

    for (let i = days.length - 1; i >= 0; i--) {
      const day = days[i];
      totalContributions += day.contributionCount;

      if (day.contributionCount > 0) {
        if (!lastContributionDate) lastContributionDate = new Date(day.date);
        tempStreak++;
        longestStreak = Math.max(longestStreak, tempStreak);
      } else {
        if (i < days.length - 1) {
          if (currentStreak === 0 && tempStreak > 0) currentStreak = tempStreak;
          tempStreak = 0;
        }
      }

      const date = new Date(day.date);
      const monthYear = date.toLocaleString('default', { month: 'long', year: 'numeric' });
      monthCounts[monthYear] = (monthCounts[monthYear] || 0) + day.contributionCount;
    }

    if (currentStreak === 0) currentStreak = tempStreak;

    let mostActiveMonth = '';
    let maxMonthCount = 0;
    Object.entries(monthCounts).forEach(([month, count]) => {
      if (count > maxMonthCount) {
        maxMonthCount = count;
        mostActiveMonth = month.split(' ')[0];
      }
    });

    let mostActiveLanguage = '';
    const langCounts: Record<string, number> = {};
    reposData.forEach(repo => {
      if (repo.language) {
        langCounts[repo.language] = (langCounts[repo.language] || 0) + 1;
      }
    });

    let maxLang = 0;
    Object.entries(langCounts).forEach(([lang, count]) => {
      if (count > maxLang) {
        maxLang = count;
        mostActiveLanguage = lang;
      }
    });

    const averageWeeklyContributions = totalContributions / 52;
    const averageCommits = Math.round(totalContributions / 12);

    const daysSinceLastContribution = lastContributionDate
      ? Math.floor((new Date().getTime() - lastContributionDate.getTime()) / (1000 * 3600 * 24))
      : 999;

    let score = 50;
    if (reposData.filter(r => r.description).length > 2) score += 15;
    if (daysSinceLastContribution <= 14) score += 20;
    if (currentStreak > 3) score += 15;
    score = Math.min(100, score);

    return {
      totalContributions,
      currentStreak,
      longestStreak,
      mostActiveMonth,
      mostActiveLanguage,
      averageWeeklyContributions,
      averageCommits,
      lastContributionDate,
      daysSinceLastContribution,
      portfolioScore: score
    };
  };

  useEffect(() => {
    if (!username) return;

    const fetchAllData = async () => {
      setLoading(true);
      setError('');
      try {
        const [profileRes, reposRes, eventsRes, contributionsRes] = await Promise.all([
          fetch(`https://api.github.com/users/${username}`),
          fetch(`https://api.github.com/users/${username}/repos?sort=updated&per_page=100`),
          fetch(`https://api.github.com/users/${username}/events/public`),
          fetch(`/api/github/contributions?username=${username}`)
        ]);

        if (!profileRes.ok) throw new Error('Failed to fetch profile');

        const profileData = await profileRes.json();
        const reposData = reposRes.ok ? await reposRes.json() : [];
        const eventsData = eventsRes.ok ? await eventsRes.json() : [];
        const contributionsData: { contributions: ContributionDay[][] } = contributionsRes.ok ? await contributionsRes.json() : { contributions: [] };

        setProfile(profileData);
        setRepos(reposData);
        setEvents(eventsData);
        setStats(calculateStats(contributionsData, reposData));

      } catch (err: unknown) {
        if (err instanceof Error) {
          setError(err.message || 'An error occurred while fetching GitHub data');
        } else {
          setError('An error occurred while fetching GitHub data');
        }
      } finally {
        setLoading(false);
      }
    };

    fetchAllData();
  }, [username]);



  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (over && active.id !== over.id) {
      setLayout((items) => {
        const oldIndex = items.indexOf(active.id as string);
        const newIndex = items.indexOf(over.id as string);
        return arrayMove(items, oldIndex, newIndex);
      });
    }
  };

  const hideWidget = (id: string) => {
    if (!hiddenWidgets.includes(id)) {
      setHiddenWidgets([...hiddenWidgets, id]);
    }
  };

  const showWidget = (id: string) => {
    setHiddenWidgets(hiddenWidgets.filter(w => w !== id));
  };

  const renderWidget = (id: string) => {
    if (!profile || !stats) return null;

    switch (id) {
      case 'summary':
        return <DeveloperSummary profile={profile} stats={stats} />;
      case 'graph':
        return <ContributionGraph username={username!} stats={stats} />;

      case 'languages':
        return (
          <LanguageChart 
            repos={repos} 
            customLanguages={customLanguages}
            setCustomLanguages={setCustomLanguages}
            isEditMode={isEditMode}
          />
        );
      default:
        return null;
    }
  };

  const getWidgetClass = (id: string) => {
    switch (id) {
      case 'summary': return 'md:col-span-12 xl:col-span-12';
      case 'graph': return 'md:col-span-12 xl:col-span-12';
      case 'languages': return 'md:col-span-12 xl:col-span-12';
      default: return 'md:col-span-12';
    }
  };

  if (!username) return null;

  const visibleWidgets = layout.filter(id => !hiddenWidgets.includes(id));

  return (
    <section id="github" className="py-24 relative bg-transparent selection:bg-primary/30 min-h-screen">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-white/[0.03] via-transparent to-transparent pointer-events-none" />
      <div 
        className="absolute inset-0 bg-black/40 backdrop-blur-xl pointer-events-none" 
        style={{ 
          maskImage: 'linear-gradient(to bottom, transparent, black 15%, black 85%, transparent)',
          WebkitMaskImage: 'linear-gradient(to bottom, transparent, black 15%, black 85%, transparent)' 
        }} 
      />

      {/* Sidebar for Edit Mode */}
      <div className={`fixed inset-y-0 right-0 w-80 bg-black/40 backdrop-blur-2xl border-l border-white/10 z-[100] transform transition-transform duration-500 ease-in-out ${isEditMode ? 'translate-x-0 shadow-[0_0_50px_rgba(0,0,0,0.5)]' : 'translate-x-full'}`}>
        <div className="p-6 h-full flex flex-col">
          <div className="flex items-center justify-between mb-8">
            <h3 className="text-xl font-bold text-white tracking-tight flex items-center gap-2">
              <Settings2 size={20} className="text-primary" />
              Customize
            </h3>
            <button
              onClick={() => setIsEditMode(false)}
              className="text-sm font-bold bg-primary text-black px-4 py-2 rounded-full hover:bg-primary/90 transition-colors"
            >
              Done
            </button>
          </div>

          <div className="flex-1 overflow-y-auto">
            <h4 className="text-xs font-bold text-white/50 uppercase tracking-widest mb-4">Hidden Widgets</h4>
            <div className="flex flex-col gap-3">
              {hiddenWidgets.length === 0 ? (
                <div className="text-sm text-white/40 italic p-4 bg-white/5 rounded-xl border border-white/5">
                  All widgets are currently visible on your dashboard.
                </div>
              ) : (
                hiddenWidgets.map(id => (
                  <div key={id} className="flex items-center justify-between p-4 bg-white/5 hover:bg-white/10 border border-white/5 rounded-xl transition-colors group">
                    <span className="text-sm font-medium text-white/80">{WIDGET_NAMES[id]}</span>
                    <button
                      onClick={() => showWidget(id)}
                      className="p-1.5 bg-primary/20 text-primary rounded-md opacity-0 group-hover:opacity-100 transition-all hover:bg-primary hover:text-black"
                    >
                      <Plus size={16} />
                    </button>
                  </div>
                ))
              )}
            </div>

            <h4 className="text-xs font-bold text-white/50 uppercase tracking-widest mt-8 mb-4">Tips</h4>
            <p className="text-sm text-white/40 leading-relaxed bg-white/5 p-4 rounded-xl border border-white/5">
              Drag and drop widgets on your dashboard to reorder them. Click the × icon to hide a widget. Your preferences are saved automatically!
            </p>
          </div>
        </div>
      </div>

      <div className={`max-w-6xl mx-auto px-6 relative z-10 transition-all duration-500 ease-in-out ${isEditMode ? 'md:pr-80' : ''}`}>
        <div className="mb-16 flex flex-col md:flex-row md:items-start justify-between gap-6">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 text-white/60 text-sm font-medium mb-6">
              <GitBranch size={16} />
              <span>Developer OS</span>
            </div>
            <h2 className="text-4xl md:text-5xl font-bold tracking-tight text-white mb-6">
              Developer Activity
            </h2>
            <p className="text-white/60 text-lg max-w-2xl">
              Track your GitHub activity, repositories and development insights automatically.
            </p>
          </div>

          <button
            onClick={() => setIsEditMode(!isEditMode)}
            className={`flex items-center gap-2 px-5 py-2.5 rounded-full font-bold text-sm transition-all border shadow-lg ${isEditMode ? 'bg-primary border-primary text-black' : 'bg-white/5 border-white/10 text-white hover:bg-white/10 hover:border-white/20'}`}
          >
            <Settings2 size={16} className={isEditMode ? 'animate-spin-slow' : ''} />
            {isEditMode ? 'Exit Edit Mode' : 'Customize Dashboard'}
          </button>
        </div>

        {loading ? (
          <div className="flex flex-col items-center justify-center py-24 text-white/40 gap-4">
            <Loader2 className="w-8 h-8 animate-spin text-primary" />
            <p>Syncing Developer Dashboard...</p>
          </div>
        ) : error ? (
          <div className="bg-red-500/10 border border-red-500/20 text-red-400 p-6 rounded-2xl text-center">
            {error}
          </div>
        ) : profile && stats ? (

          <DndContext
            sensors={sensors}
            collisionDetection={closestCenter}
            onDragEnd={handleDragEnd}
          >
            <SortableContext
              items={visibleWidgets}
              strategy={rectSortingStrategy}
            >
              <div className="grid grid-cols-1 md:grid-cols-12 gap-8 relative pb-24">
                {visibleWidgets.map((id) => (
                  <WidgetWrapper
                    key={id}
                    id={id}
                    isEditMode={isEditMode}
                    onHide={hideWidget}
                    className={getWidgetClass(id)}
                  >
                    {renderWidget(id)}
                  </WidgetWrapper>
                ))}
              </div>
            </SortableContext>
          </DndContext>

        ) : (
          <div className="bg-white/5 border border-white/10 text-white/50 p-12 rounded-3xl text-center font-medium tracking-wide">
            Start building. PortfolioOS will automatically track your developer journey.
          </div>
        )}
      </div>
    </section>
  );
}
