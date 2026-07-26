export interface SocialLink {
  platform: 'github' | 'gitlab' | 'linkedin' | 'twitter' | 'website' | 'leetcode' | 'codeforces' | 'youtube' | 'codechef';
  url: string;
}

export type AchievementType = 'job' | 'internship' | 'freelance' | 'achievement';

export interface Achievement {
  id: string;
  type: AchievementType;
  title: string;
  organization?: string;
  startDate: string;
  endDate: string | 'Now';
  description: string;
}

export interface Skill {
  id: string;
  name: string;
  category?: string;
  icon?: string;
}

export interface Project {
  id: string;
  name: string;
  description: string;
  highlights: string[];
  techStack: string[];
  images: string[];
  githubUrl?: string;
  liveUrl?: string;
  demoVideoUrl?: string;
}

export interface Contact {
  email: string;
  location: string;
}

export interface PortfolioData {
  hero: {
    name: string;
    tagline: string;
    bio: string;
    title?: string;
    resumeUrl?: string;
    location: string;
    avatarUrl: string;
    logoText: string;
    githubUsername?: string;
    showGithub?: boolean;
    socials: SocialLink[];
  };
  achievements: Achievement[];
  skills: Skill[];
  projects: Project[];
  contact: Contact;
}

export const initialPortfolioData: PortfolioData = {
  hero: {
    name: "",
    tagline: "",
    bio: "",
    title: "",
    resumeUrl: "",
    location: "",
    avatarUrl: "",
    logoText: "",
    githubUsername: "",
    showGithub: true,
    socials: []
  },
  achievements: [
    {
      id: "1",
      type: "job",
      title: "",
      organization: "",
      startDate: "",
      endDate: "",
      description: ""
    }
  ],
  skills: [
    { id: "1", name: "" }
  ],
  projects: [
    {
      id: "1",
      name: "",
      description: "",
      highlights: [""],
      techStack: [],
      images: [],
      githubUrl: "",
      liveUrl: "",
      demoVideoUrl: ""
    }
  ],
  contact: {
    email: "",
    location: ""
  }
};
