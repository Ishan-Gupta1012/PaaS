export interface PdfDocument {
  numPages: number;
  getPage: (pageNumber: number) => Promise<any>;
}

export interface TextItem {
  str: string;
  dir: string;
  width: number;
  height: number;
  transform: number[];
  fontName: string;
  hasEOL: boolean;
  x: number;
  y: number;
  fontSize: number;
  page: number;
}

export interface Annotation {
  url?: string;
  dest?: string;
  rect: number[];
}

export interface TextBlock {
  text: string;
  x: number;
  y: number;
  width: number;
  height: number;
  fontSize: number;
  isBold: boolean;
  page: number;
  annotations: Annotation[];
}

export interface Section {
  title: string;
  blocks: TextBlock[];
}

export interface ResumeData {
  personal: {
    name: string;
    email: string;
    phone: string;
    location: string;
  };
  education: {
    institute: string;
    degree: string;
    branch: string;
    major: string;
    minor: string;
    cgpa: string;
    percentage: string;
    location: string;
    startDate: string;
    endDate: string;
    currentStatus: string;
    coursework: string[];
  }[];
  experience: {
    company: string;
    jobTitle: string;
    employmentType: string;
    location: string;
    startDate: string;
    endDate: string;
    duration: string;
    currentJob: boolean;
    description: string;
    bullets: string[];
    technologies: string[];
  }[];
  projects: {
    projectName: string;
    subtitle: string;
    techStack: string[];
    description: string;
    bullets: string[];
    githubRepository?: string;
    liveUrl?: string;
    deploymentUrl?: string;
    demoLink?: string;
    appStoreLink?: string;
    playStoreLink?: string;
    duration: string;
    role: string;
    features: string[];
    aiFeatures: string[];
    performanceImprovements: string[];
    metrics: string[];
    userNumbers: string;
    downloads: string;
    awards: string[];
    technologies: string[];
  }[];
  achievements: string[];
  certifications: string[];
  leadership: {
    organization: string;
    role: string;
    description: string[];
  }[];
  publications: string[];
  volunteer: {
    organization: string;
    role: string;
    description: string[];
  }[];
  skills: {
    languages: string[];
    frontend: string[];
    backend: string[];
    frameworks: string[];
    databases: string[];
    cloud: string[];
    devops: string[];
    tools: string[];
    others: string[];
  };
  links: {
    linkedin?: string;
    github?: string;
    portfolio?: string;
    website?: string;
    leetcode?: string;
    codeforces?: string;
    codechef?: string;
    hackerrank?: string;
    geeksforgeeks?: string;
    medium?: string;
    email?: string;
    other: string[];
  };
  rawText: string;
  metadata: any;
}
