import React from 'react';
import { GithubEvent } from './types';
import { GitPullRequest, GitCommit, GitBranch, Star, Clock } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';

interface Props {
  events: GithubEvent[];
}

export function Timeline({ events }: Props) {
  // Filter for meaningful events and take top 5
  const meaningfulEvents = events
    .filter(e => 
      e.type === 'PushEvent' || 
      e.type === 'PullRequestEvent' || 
      e.type === 'CreateEvent' ||
      e.type === 'WatchEvent'
    )
    .slice(0, 5);

  if (meaningfulEvents.length === 0) return null;

  const renderEventDetails = (event: GithubEvent) => {
    switch (event.type) {
      case 'PushEvent':
        const commits = event.payload.commits?.length || 0;
        return (
          <div className="flex flex-col gap-1">
            <span className="text-white font-medium">Pushed {commits} commit{commits !== 1 ? 's' : ''}</span>
            <span className="text-xs text-white/40 font-mono truncate max-w-[200px]">
              {event.repo.name}
            </span>
          </div>
        );
      case 'PullRequestEvent':
        return (
          <div className="flex flex-col gap-1">
            <span className="text-white font-medium">{event.payload.action === 'opened' ? 'Opened' : 'Merged'} Pull Request</span>
            <span className="text-xs text-white/40 font-mono truncate max-w-[200px]">
              {event.repo.name}
            </span>
          </div>
        );
      case 'CreateEvent':
        return (
          <div className="flex flex-col gap-1">
            <span className="text-white font-medium">Created repository</span>
            <span className="text-xs text-white/40 font-mono truncate max-w-[200px]">
              {event.repo.name}
            </span>
          </div>
        );
      case 'WatchEvent':
        return (
          <div className="flex flex-col gap-1">
            <span className="text-white font-medium">Starred repository</span>
            <span className="text-xs text-white/40 font-mono truncate max-w-[200px]">
              {event.repo.name}
            </span>
          </div>
        );
      default:
        return null;
    }
  };

  const getEventIcon = (type: string) => {
    switch (type) {
      case 'PushEvent': return <GitCommit size={14} />;
      case 'PullRequestEvent': return <GitPullRequest size={14} />;
      case 'CreateEvent': return <GitBranch size={14} />;
      case 'WatchEvent': return <Star size={14} />;
      default: return <Clock size={14} />;
    }
  };

  return (
    <div className="bg-[#0a0a0a] border border-white/5 rounded-[2rem] p-6 md:p-8 flex flex-col gap-6 relative h-full">
      <div className="flex items-center gap-3 mb-4">
        <div className="p-2 bg-emerald-500/10 rounded-xl text-emerald-400">
          <Clock size={20} />
        </div>
        <h3 className="text-xl font-bold text-white tracking-tight">Recent Activity</h3>
      </div>

      <div className="flex flex-col relative before:absolute before:inset-0 before:ml-5 before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-0.5 before:bg-gradient-to-b before:from-transparent before:via-white/10 before:to-transparent">
        {meaningfulEvents.map((event) => (
          <div key={event.id} className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group/item is-active mb-6 last:mb-0">
            <div className="flex items-center justify-center w-10 h-10 rounded-full border-4 border-[#0a0a0a] bg-white/5 text-white/40 group-hover/item:text-emerald-400 group-hover/item:bg-emerald-500/10 transition-colors shrink-0 md:order-1 md:group-odd/item:-translate-x-1/2 md:group-even/item:translate-x-1/2 shadow-xl z-10">
              {getEventIcon(event.type)}
            </div>
            
            <div className="w-[calc(100%-4rem)] md:w-[calc(50%-2.5rem)] p-4 rounded-2xl bg-white/[0.02] border border-white/5 group-hover/item:border-white/10 transition-colors flex flex-col gap-2">
              <div className="flex items-center justify-between mb-1">
                <span className="text-[10px] font-bold uppercase tracking-wider text-white/30">
                  {formatDistanceToNow(new Date(event.created_at), { addSuffix: true })}
                </span>
              </div>
              {renderEventDetails(event)}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
