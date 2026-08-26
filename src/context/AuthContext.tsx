'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { createClient } from '@/utils/supabase/client';
import { isSupabaseConfigured } from '@/utils/supabase/env';

export interface PersonalInfo {
  name: string;
  email?: string;
  title: string;
  location: string;
  isOpenToWork: boolean;
  avatar: string;
}

export interface Project {
  name: string;
  description: string;
  tags: string[];
  githubUrl: string;
  liveUrl: string;
  category: string;
  outcome?: string; // used for blueprint outcome
}

export interface Experience {
  company: string;
  role: string;
  startDate: string;
  endDate: string; // or 'Present'
  achievements: string[];
}

export interface Education {
  institution: string;
  degree: string;
  field: string;
  gradYear: string;
  gpa: string;
}

export interface SocialLinks {
  github: string;
  linkedin: string;
  twitter: string;
  blog: string;
  leetcode: string;
}

export interface ThemeSettings {
  templateName: 'obsidian' | 'blueprint' | 'neon' | 'minimal';
  accentColor: string; // Preset hex
  fontPairing: string; // Preset name
}

export interface StudentNotification {
  id: string;
  title: string;
  description: string;
  time: string;
  unread: boolean;
}

export interface StudentProfile {
  username: string; // for username.portfolioai.dev
  provider: 'google' | 'github' | 'linkedin' | 'email';
  status: 'Published' | 'Draft' | 'Unpublished';
  lastUpdated: string;
  sectionViews: number;
  aiCreditsUsed: number;
  personalInfo: PersonalInfo;
  bio: string;
  skills: string[];
  projects: Project[];
  experience: Experience[];
  education: Education[];
  socialLinks: SocialLinks;
  themeSettings: ThemeSettings;
  notifications: StudentNotification[];
  resumeData?: Record<string, unknown>;
}

interface AuthContextType {
  user: StudentProfile | null;
  isLoading: boolean;
  login: (provider: 'google' | 'github' | 'linkedin' | 'email', email?: string, name?: string) => Promise<void>;
  logout: () => void;
  updateProfile: (newProfile: StudentProfile) => void;
  markNotificationRead: (id: string) => void;
  clearNotifications: () => void;
}

const mockProfiles: Record<string, Omit<StudentProfile, 'provider' | 'username' | 'personalInfo'>> = {
  google: {
    status: 'Draft',
    lastUpdated: '2 hours ago',
    sectionViews: 142,
    aiCreditsUsed: 12,
    bio: 'CS Senior at State University specializing in machine learning pipelines and distributed systems. Passionate about building software architectures that solve complex computational data challenges.',
    skills: ['Python', 'TensorFlow', 'TypeScript', 'Next.js', 'Go', 'Docker', 'Kubernetes', 'AWS'],
    projects: [
      {
        name: 'Neural Net Visualizer',
        description: 'An interactive browser dashboard that simulates real-time backpropagation weights and neural node activations in customizable layers.',
        tags: ['TypeScript', 'CanvasAPI', 'React'],
        githubUrl: 'https://github.com/alexcarter/neural-viz',
        liveUrl: 'https://neural-viz.demo.dev',
        category: 'Creative',
        outcome: 'Reduced network debug time for students by 40% in lab experiments.'
      },
      {
        name: 'Distributed Lock Manager',
        description: 'A fault-tolerant locking engine using the Raft consensus protocol implemented from scratch, featuring dynamic node configuration changes.',
        tags: ['Go', 'Raft', 'gRPC'],
        githubUrl: 'https://github.com/alexcarter/dist-lock',
        liveUrl: 'https://lock-manager.demo.dev',
        category: 'Minimal',
        outcome: 'Achieved sub-10ms lease lock renewals under network partition conditions.'
      }
    ],
    experience: [
      {
        company: 'CloudScale Labs',
        role: 'SRE Intern',
        startDate: 'June 2025',
        endDate: 'August 2025',
        achievements: [
          'Engineered automated shell routines to provision isolated development sandboxes in AWS Kubernetes setups.',
          'Configured Prometheus monitoring dashboards that successfully tracked SRE query latency alerts.',
          'Reduced telemetry dashboard load-times by 30% through optimized PostgreSQL queries.'
        ]
      }
    ],
    education: [
      {
        institution: 'State University',
        degree: 'Bachelor of Science',
        field: 'Computer Science',
        gradYear: '2026',
        gpa: '3.92'
      }
    ],
    socialLinks: {
      github: 'https://github.com/alexcarter',
      linkedin: 'https://linkedin.com/in/alexcarter',
      twitter: 'https://twitter.com/alexcarter_dev',
      blog: 'https://alexcarter.dev/blog',
      leetcode: 'https://leetcode.com/alexcarter'
    },
    themeSettings: {
      templateName: 'obsidian',
      accentColor: '#7C3AED',
      fontPairing: 'Inter + JetBrains Mono'
    },
    notifications: [
      { id: 'n1', title: 'Draft Saved', description: 'Your progress in the SRE Intern section has been auto-saved.', time: '10 mins ago', unread: true },
      { id: 'n2', title: 'AI Recommendation Accepted', description: 'AI suggestion successfully replaced your project descriptions.', time: '2 hours ago', unread: true },
      { id: 'n3', title: 'Welcome to PortfolioAI', description: 'Complete your onboarding checklist to publish your custom subdomain.', time: '1 day ago', unread: false }
    ]
  },
  github: {
    status: 'Published',
    lastUpdated: '1 day ago',
    sectionViews: 382,
    aiCreditsUsed: 28,
    bio: 'Software engineer focused on compiler design, low-level optimizations, and web app security testing. Enthusiastic open-source contributor and command-line interfaces creator.',
    skills: ['Rust', 'C++', 'WebAssembly', 'TypeScript', 'Next.js', 'LLVM', 'Bash', 'Docker'],
    projects: [
      {
        name: 'Wasm Compiler Sandbox',
        description: 'An online environment compiling a subset of C into WebAssembly binaries directly on the client, with live disassembly view.',
        tags: ['TypeScript', 'Rust', 'WebAssembly'],
        githubUrl: 'https://github.com/taylorreese/wasm-sandbox',
        liveUrl: 'https://wasm-sandbox.demo.dev',
        category: 'Dark',
        outcome: 'Compiled standard programs in less than 20ms in the browser.'
      },
      {
        name: 'Rust Security Analyzer',
        description: 'Static analysis parser catching memory leakage vectors in unsafe Rust loops and generating remediation diagnostics.',
        tags: ['Rust', 'AST', 'CLI'],
        githubUrl: 'https://github.com/taylorreese/rust-secure',
        liveUrl: 'https://rust-secure.demo.dev',
        category: 'Bold',
        outcome: 'Flagged 12 vulnerabilities in 3 major open source crates during audits.'
      }
    ],
    experience: [
      {
        company: 'Rust Foundation',
        role: 'Open Source Fellow',
        startDate: 'Jan 2025',
        endDate: 'Present',
        achievements: [
          'Contributed 15 pull requests to compiler diagnostics formatting macros.',
          'Designed modular testing runner script speeding up regression workflows by 20%.',
          'Documented best practice guidelines for unsafe API definitions in system crates.'
        ]
      }
    ],
    education: [
      {
        institution: 'Polytechnic Institute',
        degree: 'Bachelor of Science',
        field: 'Software Engineering',
        gradYear: '2026',
        gpa: '3.87'
      }
    ],
    socialLinks: {
      github: 'https://github.com/taylorreese',
      linkedin: 'https://linkedin.com/in/taylorreese',
      twitter: 'https://twitter.com/taylor_codes',
      blog: 'https://taylorreese.dev/blog',
      leetcode: 'https://leetcode.com/taylorreese'
    },
    themeSettings: {
      templateName: 'neon',
      accentColor: '#39FF14',
      fontPairing: 'Space Grotesk + JetBrains Mono'
    },
    notifications: [
      { id: 'n1', title: 'Portfolio Published', description: 'Your site taylor-reese.portfolioai.dev is live and indexed.', time: '1 day ago', unread: false },
      { id: 'n2', title: 'New Recruiter Visit', description: 'A visitor from Seattle, WA spent 4 minutes reviewing your Wasm Compiler Sandbox project.', time: '12 hours ago', unread: true }
    ]
  },
  linkedin: {
    status: 'Published',
    lastUpdated: 'Just now',
    sectionViews: 512,
    aiCreditsUsed: 42,
    bio: 'Product-focused tech leader bridging the gap between distributed software systems and business models. Experienced in Agile execution, product management, and metrics analysis.',
    skills: ['Python', 'SQL', 'Product Management', 'Agile/Scrum', 'Figma', 'React', 'Jira', 'Mixpanel'],
    projects: [
      {
        name: 'Startup Cap Table Solver',
        description: 'A SaaS financial model simulating series investments, liquidation preferences, and employee option pools with visual graphs.',
        tags: ['React', 'ChartJS', 'SaaS'],
        githubUrl: 'https://github.com/jordanvance/cap-table',
        liveUrl: 'https://cap-solver.demo.dev',
        category: 'Minimal',
        outcome: 'Completed product case study presentation to 5 startup founders for feedback.'
      }
    ],
    experience: [
      {
        company: 'VentureScale S&C',
        role: 'Associate Product Intern',
        startDate: 'May 2025',
        endDate: 'August 2025',
        achievements: [
          'Authored 4 detailed Product Requirement Documents (PRDs) for client dashboard iterations.',
          'Analyzed user onboarding conversion rates using Mixpanel, recommending flow changes that grew signups by 14%.',
          'Coordinated daily sprint planning meetings for a 6-engineer engineering team.'
        ]
      }
    ],
    education: [
      {
        institution: 'University Business School',
        degree: 'Bachelor of Science',
        field: 'Technology Management',
        gradYear: '2026',
        gpa: '3.79'
      }
    ],
    socialLinks: {
      github: 'https://github.com/jordanvance',
      linkedin: 'https://linkedin.com/in/jordanvance',
      twitter: 'https://twitter.com/jordan_pm',
      blog: 'https://jordanvance.com',
      leetcode: 'https://leetcode.com/jordanvance'
    },
    themeSettings: {
      templateName: 'blueprint',
      accentColor: '#3B82F6',
      fontPairing: 'Inter + Inter'
    },
    notifications: [
      { id: 'n1', title: 'Analytics Spike', description: 'Portfolio traffic increased by 45% today after sharing on LinkedIn.', time: '2 hours ago', unread: true },
      { id: 'n2', title: 'Credits Warning', description: 'You have used 42 out of 50 AI credits. Consider upgrading to Pro.', time: '3 hours ago', unread: true }
    ]
  },
  email: {
    status: 'Unpublished',
    lastUpdated: 'Never',
    sectionViews: 0,
    aiCreditsUsed: 0,
    bio: 'Aspiring frontend developer interested in user interfaces, component design systems, and creative web art.',
    skills: ['HTML5', 'CSS3', 'JavaScript', 'React', 'Figma', 'TailwindCSS'],
    projects: [
      {
        name: 'Component Library Mockup',
        description: 'A set of semantic cards and input blocks designed in Figma and coded directly in HTML/CSS.',
        tags: ['HTML', 'CSS', 'Figma'],
        githubUrl: 'https://github.com/samwilson/components',
        liveUrl: 'https://sam-comp.demo.dev',
        category: 'Minimal',
        outcome: 'Tested accessibility contrast ratios complying with WCAG AA guidelines.'
      }
    ],
    experience: [],
    education: [
      {
        institution: 'Design College',
        degree: 'Bachelor of Arts',
        field: 'Creative Media',
        gradYear: '2027',
        gpa: '3.65'
      }
    ],
    socialLinks: {
      github: 'https://github.com/samwilson',
      linkedin: 'https://linkedin.com/in/samwilson',
      twitter: 'https://twitter.com/sam_design',
      blog: '',
      leetcode: ''
    },
    themeSettings: {
      templateName: 'minimal',
      accentColor: '#1A1A1A',
      fontPairing: 'Playfair Display + Inter'
    },
    notifications: [
      { id: 'n1', title: 'Welcome', description: 'Welcome to your PortfolioAI student dashboard! Get started by editing details.', time: '1 hour ago', unread: true }
    ]
  }
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<StudentProfile | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  // Load user from Supabase and LocalStorage
  useEffect(() => {
    if (!isSupabaseConfigured()) {
      const storedUser = localStorage.getItem('student_user');
      if (storedUser) {
        try {
          const parsedUser = JSON.parse(storedUser) as StudentProfile;
          if (parsedUser.personalInfo && parsedUser.themeSettings && parsedUser.skills) {
            // eslint-disable-next-line react-hooks/set-state-in-effect
            setUser(parsedUser);
          }
        } catch {}
      }
      setIsLoading(false);
      return;
    }

    const supabase = createClient();
    
    // Check active session
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session?.user) {
        // If we have a supabase user, check if we have a mocked local profile
        const storedUser = localStorage.getItem('student_user');
        if (storedUser) {
          try {
            const parsedUser = JSON.parse(storedUser) as StudentProfile;
            if (parsedUser.personalInfo && parsedUser.themeSettings && parsedUser.skills) {
              // ALWAYS sync with the real Supabase session data to prevent outdated mock data from showing
              const metadata = session.user.user_metadata;
              const name = metadata?.full_name || metadata?.name || session.user.email?.split('@')[0] || parsedUser.personalInfo.name;
              const avatar = metadata?.avatar_url || parsedUser.personalInfo.avatar || "https://api.dicebear.com/7.x/avataaars/svg?seed=fallback";
              
              parsedUser.personalInfo.name = name;
              parsedUser.personalInfo.email = session.user.email;
              parsedUser.personalInfo.avatar = avatar;
              parsedUser.provider = (session.user.app_metadata.provider as StudentProfile['provider']) || parsedUser.provider;
              
              setUser(parsedUser);
              localStorage.setItem('student_user', JSON.stringify(parsedUser)); // Update local storage with real data
            }
          } catch {}
        } else {
          // Fallback if no local profile but auth exists
          const metadata = session.user.user_metadata;
          const provider = session.user.app_metadata.provider || 'email';
          const name = metadata?.full_name || metadata?.name || session.user.email?.split('@')[0] || 'User';
          const avatar = metadata?.avatar_url || "https://api.dicebear.com/7.x/avataaars/svg?seed=fallback";
          const username = session.user.email?.split('@')[0] || 'user';
          
          setUser({ 
            ...mockProfiles.email, 
            provider: provider as StudentProfile['provider'], 
            username, 
            personalInfo: { 
              name: name, 
              email: session.user.email,
              title: 'Software Developer', 
              location: 'Remote', 
              isOpenToWork: true, 
              avatar: avatar 
            } 
          } as StudentProfile);
        }
      } else {
        setUser(null);
        localStorage.removeItem('student_user');
      }
      setIsLoading(false);
    });

    // Listen for auth changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      if (!session) {
        setUser(null);
        localStorage.removeItem('student_user');
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  const login = async (
    provider: 'google' | 'github' | 'linkedin' | 'email',
    email?: string,
    name?: string
  ): Promise<void> => {
    setIsLoading(true);

    if (provider !== 'email' && isSupabaseConfigured()) {
      const supabase = createClient();

      // Trigger OAuth Login
      const { error } = await supabase.auth.signInWithOAuth({
        provider: provider,
        options: {
          redirectTo: `${window.location.origin}/auth/callback`,
        },
      });
      if (error) {
        console.error('Error logging in:', error.message);
        setIsLoading(false);
        return;
      }
    } else if (provider !== 'email') {
      console.warn('Supabase is not configured. Using local mock profile instead of OAuth.');
    }

    let finalProfile: StudentProfile;

    if (provider === 'email') {
      const emailVal = email || 'student@university.edu';
      const nameVal = name || emailVal.split('@')[0].split('.').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');
      const usernameVal = emailVal.split('@')[0].replace(/[^a-zA-Z0-9]/g, '-');
      
      finalProfile = {
        username: usernameVal,
        provider: 'email',
        ...mockProfiles.email,
        personalInfo: {
          name: nameVal,
          title: 'Student Developer',
          location: 'San Francisco, CA',
          isOpenToWork: true,
          avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&auto=format&fit=crop&q=80'
        }
      };
    } else {
      const baseMock = mockProfiles[provider];
      let providerName = 'Alex Carter';
      let providerUsername = 'alex-carter';
      let providerTitle = 'CS Senior & AI Student';
      let providerLocation = 'Austin, TX';

      if (provider === 'github') {
        providerName = 'Taylor Reese';
        providerUsername = 'taylor-reese';
        providerTitle = 'Software Engineer Fellow';
        providerLocation = 'Boston, MA';
      } else if (provider === 'linkedin') {
        providerName = 'Jordan Vance';
        providerUsername = 'jordan-vance';
        providerTitle = 'Tech Management Student';
        providerLocation = 'New York, NY';
      }

      finalProfile = {
        username: providerUsername,
        provider,
        ...baseMock,
        personalInfo: {
          name: providerName,
          title: providerTitle,
          location: providerLocation,
          isOpenToWork: true,
          avatar: provider === 'github' ? 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80' : 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80'
        }
      };
    }

    setUser(finalProfile);
    localStorage.setItem('student_user', JSON.stringify(finalProfile));
    
    // Clear temporary resume data from sessionStorage on login to isolate users
    if (typeof window !== 'undefined') {
      try {
        const keysToRemove: string[] = [];
        for (let i = 0; i < sessionStorage.length; i++) {
          const key = sessionStorage.key(i);
          if (key && key.startsWith('temp_resume_upload_')) {
            keysToRemove.push(key);
          }
        }
        keysToRemove.forEach(key => sessionStorage.removeItem(key));
      } catch (e) {
        console.error('Failed to clear temporary resume data', e);
      }
    }
    
    setIsLoading(false);
  };

  const logout = async () => {
    if (isSupabaseConfigured()) {
      const supabase = createClient();
      await supabase.auth.signOut();
    }
    setUser(null);
    localStorage.removeItem('student_user');
    
    // Clear temporary resume data from sessionStorage on logout to prevent exposure to other users
    if (typeof window !== 'undefined') {
      try {
        const keysToRemove: string[] = [];
        for (let i = 0; i < sessionStorage.length; i++) {
          const key = sessionStorage.key(i);
          if (key && key.startsWith('temp_resume_upload_')) {
            keysToRemove.push(key);
          }
        }
        keysToRemove.forEach(key => sessionStorage.removeItem(key));
      } catch (e) {
        console.error('Failed to clear temporary resume data', e);
      }
    }
    
    window.location.href = '/';
  };

  const updateProfile = (newProfile: StudentProfile) => {
    setUser(newProfile);
    localStorage.setItem('student_user', JSON.stringify(newProfile));
  };

  const markNotificationRead = (id: string) => {
    if (!user) return;
    const updatedNotifications = user.notifications.map(n => 
      n.id === id ? { ...n, unread: false } : n
    );
    const updatedUser = { ...user, notifications: updatedNotifications };
    setUser(updatedUser);
    localStorage.setItem('student_user', JSON.stringify(updatedUser));
  };

  const clearNotifications = () => {
    if (!user) return;
    const updatedNotifications = user.notifications.map(n => ({ ...n, unread: false }));
    const updatedUser = { ...user, notifications: updatedNotifications };
    setUser(updatedUser);
    localStorage.setItem('student_user', JSON.stringify(updatedUser));
  };

  return (
    <AuthContext.Provider value={{ user, isLoading, login, logout, updateProfile, markNotificationRead, clearNotifications }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
