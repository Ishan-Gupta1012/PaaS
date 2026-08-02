import { ResumeData } from './types';

// The expected frontend Portfolio Object
export interface PortfolioObject {
  personal: {
    name: string;
    email: string;
    phone: string;
    role: string;
    location: string;
    bio: string;
    github?: string;
    linkedin?: string;
    portfolio?: string;
    // New optional granular fields for future UI updates
    leetcode?: string;
    codeforces?: string;
    codechef?: string;
    hackerrank?: string;
    geeksforgeeks?: string;
    medium?: string;
    kaggle?: string;
    behance?: string;
    dribbble?: string;
    stackoverflow?: string;
    twitter?: string;
    website?: string;
  };
  experience: {
    id: string;
    role: string;
    company: string;
    duration: string;
    description: string;
    achievements: string[];
    technologies: string[];
    // New optional granular fields
    employmentType?: string;
    location?: string;
    startDate?: string;
    endDate?: string;
    currentJob?: boolean;
  }[];
  education: {
    id: string;
    degree: string;
    institution: string;
    year: string;
    gpa?: string;
    // New optional granular fields
    branch?: string;
    major?: string;
    minor?: string;
    percentage?: string;
    location?: string;
    startDate?: string;
    endDate?: string;
    currentStatus?: string;
    coursework?: string[];
  }[];
  skills: {
    category: string;
    items: string[];
  }[];
  projects: {
    id: string;
    title: string;
    description: string;
    technologies: string[];
    link?: string;
    github?: string;
    // New optional granular fields
    subtitle?: string;
    techStack?: string[];
    deploymentUrl?: string;
    demoLink?: string;
    appStoreLink?: string;
    playStoreLink?: string;
    duration?: string;
    role?: string;
    features?: string[];
    aiFeatures?: string[];
    performanceImprovements?: string[];
    metrics?: string[];
    userNumbers?: string;
    downloads?: string;
    awards?: string[];
  }[];
}

export function buildFinalJson(data: ResumeData): PortfolioObject {
  // Combine all experience-like data
  const allExperience = [
    ...data.experience,
    ...data.volunteer.map(v => ({
      company: v.organization,
      jobTitle: v.role,
      employmentType: 'Volunteer',
      location: '',
      startDate: '',
      endDate: '',
      duration: '',
      currentJob: false,
      description: v.description.join(' '),
      bullets: v.description,
      technologies: []
    })),
    ...data.leadership.map(l => ({
      company: l.organization,
      jobTitle: l.role,
      employmentType: 'Leadership',
      location: '',
      startDate: '',
      endDate: '',
      duration: '',
      currentJob: false,
      description: l.description.join(' '),
      bullets: l.description,
      technologies: []
    }))
  ];

  // Combine all project-like data
  const allProjects = [
    ...data.projects
  ];

  const skillCategories = [
    { category: 'Languages', items: data.skills.languages },
    { category: 'Frontend', items: data.skills.frontend },
    { category: 'Backend', items: data.skills.backend },
    { category: 'Frameworks', items: data.skills.frameworks },
    { category: 'Databases', items: data.skills.databases },
    { category: 'Cloud', items: data.skills.cloud },
    { category: 'DevOps', items: data.skills.devops },
    { category: 'Tools', items: data.skills.tools },
    { category: 'Others', items: data.skills.others }
  ].filter(s => s.items.length > 0);

  if (data.achievements && data.achievements.length > 0) {
    skillCategories.push({ category: 'Achievements & Awards', items: data.achievements });
  }
  if (data.certifications && data.certifications.length > 0) {
    skillCategories.push({ category: 'Certifications', items: data.certifications });
  }
  if (data.publications && data.publications.length > 0) {
    skillCategories.push({ category: 'Publications', items: data.publications });
  }

  return {
    personal: {
      name: data.personal.name,
      email: data.personal.email,
      phone: data.personal.phone,
      role: data.experience?.[0]?.jobTitle || 'Professional',
      location: data.personal.location || 'Earth',
      bio: `I am ${data.personal.name}.`,
      github: data.links?.github,
      linkedin: data.links?.linkedin,
      portfolio: data.links?.portfolio,
      leetcode: data.links?.leetcode,
      codeforces: data.links?.codeforces,
      codechef: data.links?.codechef,
      hackerrank: data.links?.hackerrank,
      geeksforgeeks: data.links?.geeksforgeeks,
      medium: data.links?.medium,
      kaggle: data.links?.other?.find(o => o.includes('kaggle')) || undefined,
      behance: data.links?.other?.find(o => o.includes('behance')) || undefined,
      dribbble: data.links?.other?.find(o => o.includes('dribbble')) || undefined,
      stackoverflow: data.links?.other?.find(o => o.includes('stackoverflow')) || undefined,
      twitter: data.links?.other?.find(o => o.includes('twitter') || o.includes('x.com')) || undefined,
      website: data.links?.website
    },
    experience: allExperience.map((exp, i) => ({
      id: `exp_${i}`,
      role: exp.jobTitle,
      company: exp.company,
      duration: exp.duration || `${exp.startDate} - ${exp.endDate}`,
      description: exp.description,
      achievements: exp.bullets,
      technologies: exp.technologies,
      employmentType: exp.employmentType,
      location: exp.location,
      startDate: exp.startDate,
      endDate: exp.endDate,
      currentJob: exp.currentJob
    })),
    education: data.education.map((edu, i) => ({
      id: `edu_${i}`,
      degree: edu.degree,
      institution: edu.institute,
      year: `${edu.startDate} - ${edu.endDate}`,
      gpa: edu.cgpa,
      branch: edu.branch,
      major: edu.major,
      minor: edu.minor,
      percentage: edu.percentage,
      location: edu.location,
      startDate: edu.startDate,
      endDate: edu.endDate,
      currentStatus: edu.currentStatus,
      coursework: edu.coursework
    })),
    projects: allProjects.map((proj, i) => ({
      id: `proj_${i}`,
      title: proj.projectName,
      subtitle: proj.subtitle,
      techStack: proj.techStack,
      description: proj.description,
      technologies: proj.technologies,
      link: proj.liveUrl || proj.deploymentUrl || proj.demoLink,
      github: proj.githubRepository,
      demoLink: proj.demoLink,
      deploymentUrl: proj.deploymentUrl,
      appStoreLink: proj.appStoreLink,
      playStoreLink: proj.playStoreLink,
      duration: proj.duration,
      role: proj.role,
      features: proj.features,
      aiFeatures: proj.aiFeatures,
      performanceImprovements: proj.performanceImprovements,
      metrics: proj.metrics,
      userNumbers: proj.userNumbers,
      downloads: proj.downloads,
      awards: proj.awards
    })),
    skills: skillCategories
  };
}
