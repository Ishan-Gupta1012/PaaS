export interface GithubProfile {
  login: string;
  avatar_url: string;
  name: string;
  bio: string;
  public_repos: number;
  followers: number;
  following: number;
  html_url: string;
}

export interface GithubRepo {
  id: number;
  name: string;
  full_name: string;
  description: string;
  html_url: string;
  stargazers_count: number;
  forks_count: number;
  language: string;
  updated_at: string;
  pushed_at: string;
}

export interface GithubEvent {
  id: string;
  type: string;
  actor: { login: string };
  repo: { name: string; url: string };
  payload: Record<string, unknown>;
  created_at: string;
}

export interface ContributionDay {
  date: string;
  contributionCount: number;
  color: string;
  contributionLevel: string;
}

export interface ContributionsData {
  totalContributions: number;
  weeks: { contributionDays: ContributionDay[] }[];
}

export interface CalculatedStats {
  totalContributions: number;
  currentStreak: number;
  longestStreak: number;
  mostActiveMonth: string;
  mostActiveLanguage: string;
  averageWeeklyContributions: number;
  averageCommits: number;
  lastContributionDate: Date | null;
  daysSinceLastContribution: number;
  portfolioScore: number;
}
