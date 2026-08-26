/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import React, { useState, useRef, useEffect } from 'react';
import Image from 'next/image';
import { useAuth } from '@/context/AuthContext';
import { 
  UploadCloud, FileText, CheckCircle2, AlertCircle, 
  ChevronDown, ChevronUp, Copy, Check, Briefcase, 
  GraduationCap, Code, Award, Sparkles, RefreshCw, 
  Globe, ExternalLink, Eye, Trash2, ShieldAlert,
  Database, Terminal
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

import { ResumeData } from '@/lib/resume/pipeline/types';

export default function ResumeUploader() {
  const { user, updateProfile } = useAuth();
  
  // File & Process States
  const [file, setFile] = useState<File | null>(null);
  const [isDragActive, setIsDragActive] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [status, setStatus] = useState<'idle' | 'processing' | 'success' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [progressText, setProgressText] = useState('');
  
  // Results
  const [extractedText, setExtractedText] = useState<string | null>(null);
  const [detectedUrls, setDetectedUrls] = useState<string[]>([]);
  const [detectedSections, setDetectedSections] = useState<string[]>([]);
  const [rawPdfText, setRawPdfText] = useState<string | null>(null);
  const [cleanedText, setCleanedText] = useState<string | null>(null);
  const [sectionTexts, setSectionTexts] = useState<Record<string, string> | null>(null);
  const [llmInputs, setLlmInputs] = useState<Record<string, string> | null>(null);
  const [extractedJson, setExtractedJson] = useState<any>(null);
  const [resumeData, setResumeData] = useState<ResumeData | null>(null);
  const [externalData, setExternalData] = useState<any>(null);
  const [mergedData, setMergedData] = useState<ResumeData | null>(null);
  const [isDemoMode, setIsDemoMode] = useState(false);
  const [demoReason, setDemoReason] = useState<string | null>(null);
  
  // Views
  const [activeTab, setActiveTab] = useState<'resume' | 'external' | 'merged' | 'debug'>('merged');
  const [debugSubTab, setDebugSubTab] = useState<'rawPdf' | 'cleanedText' | 'sections' | 'sectionTexts' | 'llmInputs' | 'extractedJson' | 'finalPortfolio'>('rawPdf');
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);

  // Expandable sections for resume/merged cards
  const [expandedSections, setExpandedSections] = useState<Record<string, boolean>>({
    personal: true,
    education: true,
    experience: true,
    projects: true,
    skills: true,
    achievements: false,
    certifications: false,
    languages: false,
    links: false
  });

  // Collapsible sections for external profiles
  const [expandedProfiles, setExpandedProfiles] = useState<Record<string, boolean>>({
    github: true,
    linkedin: true,
    coding: true,
    portfolio: true,
    other: false
  });

  const fileInputRef = useRef<HTMLInputElement>(null);
  const [fileName, setFileName] = useState<string | null>(null);
  const isInitializedRef = useRef(false);

  // Check if we need to clear temporary session storage (e.g. application start/reload)
  useEffect(() => {
    if (typeof window !== 'undefined') {
      if (!(window as any).__portfolio_resume_initialized) {
        // Clear all temporary resume uploads on fresh application load/start
        const keysToRemove: string[] = [];
        for (let i = 0; i < sessionStorage.length; i++) {
          const key = sessionStorage.key(i);
          if (key && key.startsWith('temp_resume_upload_')) {
            keysToRemove.push(key);
          }
        }
        keysToRemove.forEach(key => sessionStorage.removeItem(key));
        (window as any).__portfolio_resume_initialized = true;
      }
    }
  }, []);

  // handleClear defined early so it can be referenced in useEffect below
  const handleClear = () => {
    setFile(null);
    setFileName(null);
    setExtractedText(null);
    setDetectedUrls([]);
    setDetectedSections([]);
    setRawPdfText(null);
    setCleanedText(null);
    setSectionTexts(null);
    setLlmInputs(null);
    setExtractedJson(null);
    setResumeData(null);
    setExternalData(null);
    setMergedData(null);
    setUploadProgress(0);
    setErrorMessage(null);
    setStatus('idle');
    setActiveTab('merged');

    if (user) {
      const sessionKey = `temp_resume_upload_${user.username}`;
      sessionStorage.removeItem(sessionKey);
    }
  };

  // Load temporary session resume data if present and belongs to the current user
  useEffect(() => {
    if (!user) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      handleClear();
      return;
    }

    if (!isInitializedRef.current) {
      const sessionKey = `temp_resume_upload_${user.username}`;
      const storedTemp = sessionStorage.getItem(sessionKey);
      if (storedTemp) {
        try {
          const parsed = JSON.parse(storedTemp);
          setFileName(parsed.fileName || null);
          setExtractedText(parsed.extractedText || null);
          setDetectedUrls(parsed.detectedUrls || []);
          setDetectedSections(parsed.detectedSections || []);
          setRawPdfText(parsed.rawPdfText || null);
          setCleanedText(parsed.cleanedText || null);
          setSectionTexts(parsed.sectionTexts || null);
          setLlmInputs(parsed.llmInputs || null);
          setExtractedJson(parsed.extractedJson || null);
          setResumeData(parsed.resumeData || null);
          setExternalData(parsed.externalData || null);
          setMergedData(parsed.mergedData || null);
          setIsDemoMode(parsed.isDemo || false);
          setDemoReason(parsed.demoReason || null);
          setStatus(parsed.status || 'idle');
          setActiveTab(parsed.activeTab || 'merged');
        } catch (e) {
          console.error('Failed to parse temporary resume from sessionStorage', e);
        }
      }
      isInitializedRef.current = true;
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user]);

  // Save temporary upload state to sessionStorage whenever it changes
  useEffect(() => {
    if (!user || status === 'idle' || !isInitializedRef.current) return;

    const sessionKey = `temp_resume_upload_${user.username}`;
    const tempData = {
      fileName,
      extractedText,
      detectedUrls,
      detectedSections,
      rawPdfText,
      cleanedText,
      sectionTexts,
      llmInputs,
      extractedJson,
      resumeData,
      externalData,
      mergedData,
      isDemo: isDemoMode,
      demoReason,
      status,
      activeTab,
    };
    sessionStorage.setItem(sessionKey, JSON.stringify(tempData));
  }, [user, fileName, extractedText, detectedUrls, detectedSections, rawPdfText, cleanedText, sectionTexts, llmInputs, extractedJson, resumeData, externalData, mergedData, isDemoMode, demoReason, status, activeTab]);

  const handleLoadFromProfile = () => {
    if (user?.resumeData) {
      setResumeData(user.resumeData as unknown as ResumeData);
      setMergedData(user.resumeData as unknown as ResumeData);
      setExternalData(user.resumeData.externalData || null);
      setFileName('Saved Profile Resume');
      setStatus('success');
      setActiveTab('merged');
      showToast('Loaded saved resume data from profile.');
    }
  };

  // Handle toast timeout
  useEffect(() => {
    if (toast) {
      const timer = setTimeout(() => setToast(null), 3000);
      return () => clearTimeout(timer);
    }
  }, [toast]);

  const showToast = (message: string, type: 'success' | 'error' = 'success') => {
    setToast({ message, type });
  };

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setIsDragActive(true);
    } else if (e.type === "dragleave") {
      setIsDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragActive(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      processFile(e.dataTransfer.files[0]);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      processFile(e.target.files[0]);
    }
  };

  const processFile = async (selectedFile: File) => {
    const fileExtension = selectedFile.name.split('.').pop()?.toLowerCase();
    if (fileExtension !== 'pdf' && fileExtension !== 'docx') {
      setErrorMessage('Unsupported file format. Please upload a PDF or DOCX file.');
      showToast('Unsupported file format.', 'error');
      return;
    }

    setFile(selectedFile);
    setFileName(selectedFile.name);
    setErrorMessage(null);
    setStatus('processing');
    setUploadProgress(15);
    setProgressText('Uploading file to server...');

    // Progress animations
    const progressInterval = setInterval(() => {
      setUploadProgress(prev => {
        if (prev >= 80) {
          clearInterval(progressInterval);
          return 80;
        }
        return prev + 10;
      });
    }, 200);

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 35000);

    try {
      const formData = new FormData();
      formData.append('file', selectedFile);

      setProgressText('Server-side document text parsing...');
      
      const response = await fetch('/api/resume/upload', {
        method: 'POST',
        body: formData,
        signal: controller.signal
      });

      clearTimeout(timeoutId);
      clearInterval(progressInterval);

      if (!response.ok) {
        const errorData = await response.json();
        if (errorData.extractedText || errorData.debugInfo) {
          setExtractedText(errorData.extractedText || null);
          setRawPdfText(errorData.debugInfo?.rawPdfText || errorData.extractedText || null);
          setCleanedText(errorData.debugInfo?.cleanedText || errorData.extractedText || null);
          setSectionTexts(errorData.debugInfo?.sections || null);
          setLlmInputs(errorData.debugInfo?.llmInputs || null);
          setExtractedJson(errorData.debugInfo?.extractedJson || null);
        }
        throw new Error(errorData.error || 'Failed to process document.');
      }

      setUploadProgress(90);
      setProgressText('LLM structured extraction & profile link enrichment...');

      const result = await response.json();

      setUploadProgress(100);
      setTimeout(() => {
        setExtractedText(result.extractedText);
        setDetectedUrls(result.detectedUrls || []);
        setDetectedSections(result.detectedSections || []);
        setRawPdfText(result.debugInfo?.rawPdfText || result.extractedText);
        setCleanedText(result.debugInfo?.cleanedText || result.extractedText);
        setSectionTexts(result.debugInfo?.sections || null);
        setLlmInputs(result.debugInfo?.llmInputs || null);
        setExtractedJson(result.debugInfo?.extractedJson || null);
        setResumeData(result.resumeData);
        setExternalData(result.externalData);
        setMergedData(result.mergedData);
        setIsDemoMode(result.isDemo);
        setDemoReason(result.demoReason || null);
        setStatus('success');
        setActiveTab('merged'); // Jump to the merged tab showing the final portfolio
        
        if (result.isDemo) {
          if (result.demoReason === 'quota_exceeded') {
            showToast('Gemini quota exceeded. Local fallback used.', 'error');
          } else {
            showToast('Parsed using Server Demo Engine');
          }
        } else {
          showToast('AI Resume parsing & enrichment completed!');
        }
      }, 500);

    } catch (err: any) {
      clearTimeout(timeoutId);
      clearInterval(progressInterval);
      setStatus('error');
      const msg = err.name === 'AbortError'
        ? 'The server took too long to respond. Resume parsing timed out.'
        : (err.message || 'An error occurred during server-side document parsing.');
      setErrorMessage(msg);
      showToast(msg, 'error');
    }
  };

  const handleSaveToProfile = () => {
    const dataToSave = mergedData || resumeData;
    if (!dataToSave || !user) return;
    
    updateProfile({
      ...user,
      resumeData: dataToSave as unknown as Record<string, unknown>
    });
    
    showToast('Enriched resume data synced and saved to your profile!');
  };


  const toggleSection = (section: string) => {
    setExpandedSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  };

  const toggleProfileSection = (profile: string) => {
    setExpandedProfiles(prev => ({
      ...prev,
      [profile]: !prev[profile]
    }));
  };


  const triggerFileSelect = () => {
    fileInputRef.current?.click();
  };

  const renderStructuredCards = (rawData: any) => {
    console.log('Rendering structured cards with data:', JSON.stringify(rawData, null, 2));
    
    // Normalize old schema to new schema for backwards compatibility
    const data: ResumeData = {
      personal: rawData.personal || { name: '', email: '', phone: '', location: '' },
      experience: rawData.experience || rawData.workExperience || [],
      education: rawData.education || rawData.educationHistory || [],
      projects: rawData.projects || [],
      achievements: rawData.achievements || rawData.awards || [],
      skills: rawData.skills && !Array.isArray(rawData.skills) ? rawData.skills : {
        languages: Array.isArray(rawData.skills) ? rawData.skills : [],
        frontend: [], backend: [], frameworks: [], databases: [], cloud: [], devops: [], tools: [], others: []
      },
      links: rawData.links || { linkedin: '', github: '', portfolio: '', website: '', leetcode: '', codeforces: '', codechef: '', hackerrank: '', geeksforgeeks: '', medium: '', other: [] },
      certifications: rawData.certifications || [],
      leadership: rawData.leadership || [],
      publications: rawData.publications || [],
      volunteer: rawData.volunteer || [],
      rawText: rawData.rawText || '',
      metadata: rawData.metadata || {}
    };

    console.log("Rendering structured cards with data:", JSON.stringify(data, null, 2));
    return (
      <div className="flex flex-col gap-md">
        {/* 1. PERSONAL CARD */}
        <div className="bg-surface-container-lowest border border-outline-variant rounded-2xl overflow-hidden shadow-sm">
          <button 
            onClick={() => toggleSection('personal')}
            className="w-full flex items-center justify-between p-md border-b border-outline-variant hover:bg-surface-container-low/50 transition-colors"
          >
            <div className="flex items-center gap-md">
              <Eye className="text-primary" size={18} />
              <span className="font-bold text-on-surface text-sm">Personal Information</span>
            </div>
            {expandedSections.personal ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
          </button>
          
          <AnimatePresence initial={false}>
            {expandedSections.personal && (
              <motion.div
                initial={{ height: 0 }}
                animate={{ height: 'auto' }}
                exit={{ height: 0 }}
                className="overflow-hidden"
              >
                <div className="p-md grid grid-cols-1 md:grid-cols-2 gap-md text-sm">
                  <div>
                    <label className="text-xs font-bold text-on-surface-variant uppercase tracking-wider block mb-1">Full Name</label>
                    <p className="font-medium text-on-surface bg-surface-container-low px-md py-[10px] rounded-xl">{data.personal?.name || 'Not provided'}</p>
                  </div>
                  <div>
                    <label className="text-xs font-bold text-on-surface-variant uppercase tracking-wider block mb-1">Headline</label>
                    <p className="font-medium text-on-surface bg-surface-container-low px-md py-[10px] rounded-xl">{data.experience?.[0]?.jobTitle || 'Not provided'}</p>
                  </div>
                  <div>
                    <label className="text-xs font-bold text-on-surface-variant uppercase tracking-wider block mb-1">Email</label>
                    <p className="font-medium text-on-surface bg-surface-container-low px-md py-[10px] rounded-xl">{data.personal?.email || 'Not provided'}</p>
                  </div>
                  <div>
                    <label className="text-xs font-bold text-on-surface-variant uppercase tracking-wider block mb-1">Phone</label>
                    <p className="font-medium text-on-surface bg-surface-container-low px-md py-[10px] rounded-xl">{data.personal?.phone || 'Not provided'}</p>
                  </div>
                  <div className="md:col-span-2">
                    <label className="text-xs font-bold text-on-surface-variant uppercase tracking-wider block mb-1">Location</label>
                    <p className="font-medium text-on-surface bg-surface-container-low px-md py-[10px] rounded-xl">{data.personal?.location || 'Not provided'}</p>
                  </div>
                  <div className="md:col-span-2">
                    <label className="text-xs font-bold text-on-surface-variant uppercase tracking-wider block mb-1">Summary</label>
                    <p className="text-on-surface bg-surface-container-low px-md py-[10px] rounded-xl leading-relaxed">{'Not provided'}</p>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* 2. EDUCATION CARD */}
        <div className="bg-surface-container-lowest border border-outline-variant rounded-2xl overflow-hidden shadow-sm">
          <button 
            onClick={() => toggleSection('education')}
            className="w-full flex items-center justify-between p-md border-b border-outline-variant hover:bg-surface-container-low/50 transition-colors"
          >
            <div className="flex items-center gap-md">
              <GraduationCap className="text-primary" size={18} />
              <span className="font-bold text-on-surface text-sm">Education</span>
            </div>
            {expandedSections.education ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
          </button>
          
          <AnimatePresence initial={false}>
            {expandedSections.education && (
              <motion.div
                initial={{ height: 0 }}
                animate={{ height: 'auto' }}
                exit={{ height: 0 }}
                className="overflow-hidden"
              >
                <div className="p-md flex flex-col gap-md">
                  {data.education?.length > 0 ? (
                    data.education.map((edu, idx) => (
                      <div key={idx} className="bg-surface-container-low p-md rounded-xl border border-outline-variant/30 text-sm">
                        <div className="flex justify-between items-start mb-sm">
                          <h5 className="font-bold text-on-surface">{edu.institute}</h5>
                          <span className="px-sm py-0.5 bg-secondary-container text-on-surface-variant font-semibold text-xs rounded-full">{edu.endDate}</span>
                        </div>
                        <p className="text-on-surface-variant text-sm font-medium">{edu.degree} in {edu.branch}</p>
                        {edu.cgpa && <p className="text-xs text-on-surface-variant mt-xs">GPA: <span className="font-semibold">{edu.cgpa}</span></p>}
                      </div>
                    ))
                  ) : (
                    <p className="text-sm text-on-surface-variant italic p-sm">No education sections detected.</p>
                  )}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* 3. EXPERIENCE CARD */}
        <div className="bg-surface-container-lowest border border-outline-variant rounded-2xl overflow-hidden shadow-sm">
          <button 
            onClick={() => toggleSection('experience')}
            className="w-full flex items-center justify-between p-md border-b border-outline-variant hover:bg-surface-container-low/50 transition-colors"
          >
            <div className="flex items-center gap-md">
              <Briefcase className="text-primary" size={18} />
              <span className="font-bold text-on-surface text-sm">Work Experience</span>
            </div>
            {expandedSections.experience ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
          </button>
          
          <AnimatePresence initial={false}>
            {expandedSections.experience && (
              <motion.div
                initial={{ height: 0 }}
                animate={{ height: 'auto' }}
                exit={{ height: 0 }}
                className="overflow-hidden"
              >
                <div className="p-md flex flex-col gap-sm">
                  {data.experience?.length > 0 ? (
                    data.experience.map((exp, idx) => (
                      <div key={idx} className="bg-surface-container-low px-md py-sm rounded-xl border border-outline-variant/30 flex items-center justify-between gap-md">
                        <div className="flex-1 min-w-0">
                          <h5 className="font-bold text-on-surface text-sm truncate">{exp.jobTitle}</h5>
                          <span className="text-xs text-on-surface-variant">{exp.company}</span>
                          {exp.employmentType && exp.employmentType !== 'Full-time' && (
                            <span className="ml-sm px-1.5 py-0.5 bg-primary/10 text-primary text-[10px] font-bold rounded">{exp.employmentType}</span>
                          )}
                        </div>
                        <span className="shrink-0 px-sm py-0.5 bg-secondary-container text-on-surface-variant font-semibold text-xs rounded-full whitespace-nowrap">
                          {[exp.startDate, exp.endDate].filter(Boolean).join(' – ')}
                        </span>
                      </div>
                    ))
                  ) : (
                    <p className="text-sm text-on-surface-variant italic p-sm">No work experience sections detected.</p>
                  )}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* 4. PROJECTS CARD */}
        <div className="bg-surface-container-lowest border border-outline-variant rounded-2xl overflow-hidden shadow-sm">
          <button 
            onClick={() => toggleSection('projects')}
            className="w-full flex items-center justify-between p-md border-b border-outline-variant hover:bg-surface-container-low/50 transition-colors"
          >
            <div className="flex items-center gap-md">
              <Code className="text-primary" size={18} />
              <span className="font-bold text-on-surface text-sm">Projects</span>
            </div>
            {expandedSections.projects ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
          </button>
          
          <AnimatePresence initial={false}>
            {expandedSections.projects && (
              <motion.div
                initial={{ height: 0 }}
                animate={{ height: 'auto' }}
                exit={{ height: 0 }}
                className="overflow-hidden"
              >
                <div className="p-md flex flex-col gap-lg">
                  {data.projects?.length > 0 ? (
                    data.projects.map((proj, idx) => (
                      <div key={idx} className="bg-surface-container-low p-md rounded-xl border border-outline-variant/30 text-sm">
                        {/* Project header */}
                        <div className="flex justify-between items-start mb-sm">
                          <h5 className="font-bold text-on-surface text-sm">{proj.projectName}</h5>
                          <div className="flex gap-sm shrink-0 ml-sm">
                            {proj.githubRepository && (
                              <a href={proj.githubRepository} target="_blank" rel="noopener noreferrer" className="p-1 hover:bg-surface-container-highest rounded text-on-surface-variant hover:text-primary" title="GitHub">
                                <ExternalLink size={13} />
                              </a>
                            )}
                            {(proj.liveUrl || proj.deploymentUrl) && (
                              <a href={proj.liveUrl || proj.deploymentUrl} target="_blank" rel="noopener noreferrer" className="p-1 hover:bg-surface-container-highest rounded text-on-surface-variant hover:text-primary" title="Live">
                                <ExternalLink size={13} />
                              </a>
                            )}
                          </div>
                        </div>

                        {/* Tech stack chips */}
                        {proj.techStack?.length > 0 && (
                          <div className="flex flex-wrap gap-xs mb-sm">
                            {proj.techStack.map((tag, tIdx) => (
                              <span key={tIdx} className="bg-primary/10 text-primary px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider">{tag}</span>
                            ))}
                          </div>
                        )}

                        {/* Full bullet list */}
                        {proj.bullets?.length > 0 ? (
                          <ul className="space-y-1.5 mt-xs">
                            {proj.bullets.map((b, bIdx) => (
                              <li key={bIdx} className="flex gap-sm text-xs text-on-surface-variant leading-relaxed">
                                <span className="text-primary shrink-0 mt-0.5">•</span>
                                <span>{b}</span>
                              </li>
                            ))}
                          </ul>
                        ) : proj.description ? (
                          <p className="text-xs text-on-surface-variant leading-relaxed">{proj.description}</p>
                        ) : null}
                      </div>
                    ))
                  ) : (
                    <p className="text-sm text-on-surface-variant italic p-sm">No projects detected.</p>
                  )}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* 5. SKILLS CARD */}
        <div className="bg-surface-container-lowest border border-outline-variant rounded-2xl overflow-hidden shadow-sm">
          <button 
            onClick={() => toggleSection('skills')}
            className="w-full flex items-center justify-between p-md border-b border-outline-variant hover:bg-surface-container-low/50 transition-colors"
          >
            <div className="flex items-center gap-md">
              <Sparkles className="text-primary" size={18} />
              <span className="font-bold text-on-surface text-sm">Skills & Technologies</span>
            </div>
            {expandedSections.skills ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
          </button>
          
          <AnimatePresence initial={false}>
            {expandedSections.skills && (
              <motion.div
                initial={{ height: 0 }}
                animate={{ height: 'auto' }}
                exit={{ height: 0 }}
                className="overflow-hidden"
              >
                <div className="p-md flex flex-wrap gap-sm">
                  {Object.values(data.skills || {}).flat().length > 0 ? (
                    Object.values(data.skills || {}).flat().map((skill, idx) => (
                      <span key={idx} className="px-md py-1.5 bg-surface-container-low text-on-surface font-semibold text-xs rounded-full border border-outline-variant/30 shadow-sm">
                        {skill}
                      </span>
                    ))
                  ) : (
                    <p className="text-sm text-on-surface-variant italic p-sm">No skills detected.</p>
                  )}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* 6. ACHIEVEMENTS & CERTIFICATIONS */}
        <div className="bg-surface-container-lowest border border-outline-variant rounded-2xl overflow-hidden shadow-sm">
          <button 
            onClick={() => toggleSection('achievements')}
            className="w-full flex items-center justify-between p-md border-b border-outline-variant hover:bg-surface-container-low/50 transition-colors"
          >
            <div className="flex items-center gap-md">
              <Award className="text-primary" size={18} />
              <span className="font-bold text-on-surface text-sm">Achievements & Certifications</span>
            </div>
            {expandedSections.achievements ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
          </button>
          
          <AnimatePresence initial={false}>
            {expandedSections.achievements && (
              <motion.div
                initial={{ height: 0 }}
                animate={{ height: 'auto' }}
                exit={{ height: 0 }}
                className="overflow-hidden"
              >
                <div className="p-md grid grid-cols-1 md:grid-cols-2 gap-md text-sm">
                  <div>
                    <h5 className="font-bold text-on-surface mb-sm flex items-center gap-sm">
                      <CheckCircle2 size={14} className="text-tertiary" /> Achievements
                    </h5>
                    <ul className="list-disc list-inside space-y-1 text-xs text-on-surface-variant">
                      {data.achievements?.length > 0 ? (
                        data.achievements.map((ach, idx) => <li key={idx} className="leading-relaxed">{ach}</li>)
                      ) : (
                        <li className="italic">None detected</li>
                      )}
                    </ul>
                  </div>
                  <div>
                    <h5 className="font-bold text-on-surface mb-sm flex items-center gap-sm">
                      <CheckCircle2 size={14} className="text-tertiary" /> Certifications
                    </h5>
                    <ul className="list-disc list-inside space-y-1 text-xs text-on-surface-variant">
                      {data.certifications?.length > 0 ? (
                        data.certifications.map((cert, idx) => <li key={idx} className="leading-relaxed">{cert}</li>)
                      ) : (
                        <li className="italic">None detected</li>
                      )}
                    </ul>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* 7. LANGUAGES */}
        <div className="bg-surface-container-lowest border border-outline-variant rounded-2xl overflow-hidden shadow-sm">
          <button 
            onClick={() => toggleSection('languages')}
            className="w-full flex items-center justify-between p-md border-b border-outline-variant hover:bg-surface-container-low/50 transition-colors"
          >
            <div className="flex items-center gap-md">
              <Globe className="text-primary" size={18} />
              <span className="font-bold text-on-surface text-sm">Languages</span>
            </div>
            {expandedSections.languages ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
          </button>
          
          <AnimatePresence initial={false}>
            {expandedSections.languages && (
              <motion.div
                initial={{ height: 0 }}
                animate={{ height: 'auto' }}
                exit={{ height: 0 }}
                className="overflow-hidden"
              >
                <div className="p-md flex flex-wrap gap-xs">
                  {data.skills?.languages?.length > 0 ? (
                    data.skills.languages.map((lang, idx) => (
                      <span key={idx} className="bg-surface-container-low text-on-surface px-md py-1 rounded-lg text-xs font-semibold">{lang}</span>
                    ))
                  ) : (
                    <p className="text-sm text-on-surface-variant italic p-sm">No languages parsed.</p>
                  )}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* 8. SOCIAL LINKS */}
        <div className="bg-surface-container-lowest border border-outline-variant rounded-2xl overflow-hidden shadow-sm">
          <button 
            onClick={() => toggleSection('links')}
            className="w-full flex items-center justify-between p-md border-b border-outline-variant hover:bg-surface-container-low/50 transition-colors"
          >
            <div className="flex items-center gap-md">
              <Globe className="text-primary" size={18} />
              <span className="font-bold text-on-surface text-sm">Social & Coding Profiles</span>
            </div>
            {expandedSections.links ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
          </button>
          
          <AnimatePresence initial={false}>
            {expandedSections.links && (
              <motion.div
                initial={{ height: 0 }}
                animate={{ height: 'auto' }}
                exit={{ height: 0 }}
                className="overflow-hidden"
              >
                <div className="p-md grid grid-cols-1 md:grid-cols-2 gap-sm text-sm">
                  {[
                    { label: 'GitHub', value: data.links?.github },
                    { label: 'LinkedIn', value: data.links?.linkedin },
                    { label: 'Portfolio', value: data.links?.portfolio },
                    { label: 'Leetcode', value: data.links?.leetcode },
                    { label: 'Codeforces', value: data.links?.codeforces },
                    { label: 'Codechef', value: data.links?.codechef },
                    { label: 'HackerRank', value: data.links?.hackerrank }
                  ].map((lnk, idx) => (
                    <div key={idx} className="flex justify-between items-center bg-surface-container-low p-sm rounded-xl border border-outline-variant/20">
                      <div>
                        <span className="text-xs font-bold text-on-surface-variant block">{lnk.label}</span>
                        <span className="text-xs text-on-surface truncate max-w-[200px] block mt-0.5">{lnk.value || 'Not provided'}</span>
                      </div>
                      {lnk.value && (
                        <a href={lnk.value} target="_blank" rel="noopener noreferrer" className="p-1.5 hover:bg-surface-container-highest rounded text-primary transition-colors">
                          <ExternalLink size={14} />
                        </a>
                      )}
                    </div>
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    );
  };

  return (
    <div className="w-full flex flex-col gap-lg">
      {/* Toast Notification */}
      <AnimatePresence>
        {toast && (
          <motion.div 
            initial={{ opacity: 0, y: -50, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -20, scale: 0.9 }}
            className={`fixed top-6 right-6 z-[100] flex items-center gap-md px-md py-sm rounded-xl shadow-lg border text-sm font-semibold transition-all ${
              toast.type === 'success' 
                ? 'bg-tertiary-container/20 text-tertiary border-tertiary/20' 
                : 'bg-error-container/20 text-error border-error/20'
            }`}
          >
            {toast.type === 'success' ? <CheckCircle2 size={16} /> : <AlertCircle size={16} />}
            <span>{toast.message}</span>
          </motion.div>
        )}
      </AnimatePresence>

      {errorMessage && (
        <div className="flex items-center gap-sm p-md bg-error-container/20 border border-error/20 text-error rounded-xl text-sm animate-fade-in">
          <AlertCircle size={18} className="shrink-0" />
          <div className="flex-1">
            <span className="font-bold">Parsing Failure:</span> {errorMessage}
          </div>
          <button 
            onClick={() => setErrorMessage(null)} 
            className="text-xs font-bold uppercase hover:opacity-85 hover:underline"
          >
            Dismiss
          </button>
        </div>
      )}

      <AnimatePresence mode="wait">
        {/* Idle state (Upload Area) */}
        {status === 'idle' && (
          <motion.div
            key="upload-zone"
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            className={`w-full ${user?.resumeData ? 'grid grid-cols-1 lg:grid-cols-3 gap-lg' : 'flex flex-col'}`}
          >
            <div 
              onDragEnter={handleDrag}
              onDragOver={handleDrag}
              onDragLeave={handleDrag}
              onDrop={handleDrop}
              onClick={triggerFileSelect}
              className={`bg-surface-container-lowest border-2 border-dashed rounded-2xl p-xl flex flex-col items-center justify-center text-center cursor-pointer transition-all min-h-[320px] ${
                user?.resumeData ? 'lg:col-span-2' : 'w-full'
              } ${
                isDragActive 
                  ? 'border-primary bg-primary-container/10 scale-[0.99]' 
                  : 'border-outline-variant hover:border-primary/50'
              }`}
            >
              <input 
                type="file" 
                ref={fileInputRef} 
                onChange={handleFileChange} 
                accept=".pdf,.docx" 
                className="hidden" 
              />
              
              <div className="w-16 h-16 bg-surface-container-low rounded-full flex items-center justify-center mb-6 text-on-surface-variant">
                <UploadCloud size={28} className="text-primary" />
              </div>
              
              <h3 className="font-bold text-lg text-on-surface mb-2">Drag & Drop Resume Here</h3>
              <p className="text-on-surface-variant text-sm mb-4">or click to browse local files from your device</p>
              
              <button 
                type="button"
                className="px-md py-sm bg-primary text-on-primary rounded-xl font-semibold text-sm shadow-sm hover:opacity-90 transition-transform active:scale-95"
              >
                Choose File
              </button>

              <p className="text-on-surface-variant text-xs mt-6">Supported formats: PDF, DOCX (Max size 5MB)</p>
            </div>

            {user?.resumeData && (
              <div className="bg-surface-container-lowest border border-outline-variant rounded-2xl p-lg flex flex-col justify-between shadow-sm lg:col-span-1 min-h-[320px]">
                <div>
                  <div className="flex items-center gap-md mb-md pb-md border-b border-outline-variant">
                    <div className="p-2 bg-primary/10 text-primary rounded-xl">
                      <Database size={20} />
                    </div>
                    <div>
                      <h4 className="font-bold text-sm text-on-surface">Saved Resume Data</h4>
                      <p className="text-xs text-on-surface-variant">Available in your profile</p>
                    </div>
                  </div>

                  <div className="space-y-md mb-lg">
                    {(() => { const rd = user.resumeData as any; return (<>
                    {rd?.personal?.name && (
                      <div>
                        <span className="text-[10px] font-bold text-on-surface-variant uppercase tracking-wider block">Candidate</span>
                        <span className="text-sm font-semibold text-on-surface block mt-0.5">{rd.personal.name}</span>
                      </div>
                    )}
                    {rd?.experience?.[0]?.jobTitle && (
                      <div>
                        <span className="text-[10px] font-bold text-on-surface-variant uppercase tracking-wider block">Role / Headline</span>
                        <span className="text-xs text-on-surface-variant block mt-0.5 line-clamp-2">{rd.experience[0].jobTitle}</span>
                      </div>
                    )}
                    {rd?.skills && rd.skills.length > 0 && (
                      <div>
                        <span className="text-[10px] font-bold text-on-surface-variant uppercase tracking-wider block mb-1">Key Skills</span>
                        <div className="flex flex-wrap gap-xs">
                          {rd.skills.slice(0, 4).map((skill: string, index: number) => (
                            <span key={index} className="px-2 py-0.5 bg-surface-container-low text-on-surface text-[10px] rounded-full border border-outline-variant/30">
                              {skill}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}
                    </>); })()}
                  </div>
                </div>

                <div className="pt-md border-t border-outline-variant mt-auto">
                  <p className="text-xs text-on-surface-variant mb-md leading-relaxed">
                    Click below to load your structured profile resume into the interactive editor workspace.
                  </p>
                  <button
                    type="button"
                    onClick={handleLoadFromProfile}
                    className="w-full flex items-center justify-center gap-xs px-md py-sm bg-primary text-on-primary rounded-xl text-sm font-semibold hover:opacity-90 transition-transform active:scale-95 shadow-sm"
                  >
                    <Database size={16} />
                    <span>Load Saved Resume</span>
                  </button>
                </div>
              </div>
            )}
          </motion.div>
        )}

        {/* Processing State */}
        {status === 'processing' && (
          <motion.div
            key="processing"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="bg-surface-container-lowest border border-outline-variant rounded-2xl shadow-sm p-xl flex flex-col items-center justify-center text-center py-20 animate-pulse-soft"
          >
            <div className="relative mb-lg">
              <RefreshCw size={40} className="text-primary animate-spin" />
              <Sparkles size={16} className="text-primary-container absolute -top-1 -right-1" />
            </div>
            
            <h3 className="font-bold text-lg text-on-surface mb-2">{progressText}</h3>
            <p className="text-on-surface-variant text-sm w-full max-w-[400px] px-4 mx-auto mb-6">Executing 8-stage deterministic layout extraction and analysis server-side.</p>

            <div className="w-full max-w-[400px] bg-surface-container-low h-2.5 rounded-full overflow-hidden mb-2">
              <motion.div 
                className="bg-primary h-full rounded-full"
                animate={{ width: `${uploadProgress}%` }}
                transition={{ duration: 0.3 }}
              />
            </div>
            <span className="text-xs font-bold text-primary">{uploadProgress}% Complete</span>
          </motion.div>
        )}

        {/* Error State with reset */}
        {status === 'error' && (
          <motion.div
            key="error-reset"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="bg-surface-container-lowest border border-outline-variant rounded-2xl shadow-sm p-xl flex flex-col items-center justify-center text-center py-16"
          >
            <div className="w-16 h-16 bg-error-container/20 text-error rounded-full flex items-center justify-center mb-6">
              <AlertCircle size={28} />
            </div>
            
            <h3 className="font-bold text-lg text-on-surface mb-2">Resume Parsing Failed</h3>
            <p className="text-on-surface-variant text-sm w-full max-w-[400px] px-4 mx-auto mb-8">
              We encountered an issue during parsing. Ensure the file contains text and all links in the resume are formatted correctly.
            </p>

            <button 
              onClick={handleClear}
              className="px-md py-sm bg-primary text-on-primary rounded-xl font-semibold text-sm shadow-sm hover:opacity-90 transition-transform active:scale-95"
            >
              Try Another File
            </button>
          </motion.div>
        )}

        {/* Success / Result State */}
        {status === 'success' && resumeData && (
          <motion.div
            key="result-view"
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex flex-col gap-lg"
          >
            {/* Header Toolbar */}
            <div className="bg-surface-container-lowest border border-outline-variant p-md rounded-2xl flex flex-wrap gap-md items-center justify-between shadow-sm">
              <div className="flex items-center gap-md">
                <div className="p-2 bg-primary/10 text-primary rounded-xl">
                  <FileText size={20} />
                </div>
                <div>
                  <h4 className="font-bold text-on-surface text-sm truncate max-w-[240px]">
                    {file?.name || fileName || 'Enriched Portfolio Data'}
                  </h4>
                  <p className="text-xs text-on-surface-variant">Server extraction and link-based enrichment complete</p>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center gap-sm">
                <button 
                  onClick={handleClear}
                  className="flex items-center gap-xs px-md py-sm border border-outline-variant rounded-xl text-sm font-semibold hover:bg-surface-container-low text-error hover:border-error/30 transition-colors"
                >
                  <Trash2 size={14} />
                  <span>Replace File</span>
                </button>
                <button 
                  onClick={handleSaveToProfile}
                  className="flex items-center gap-xs px-md py-sm bg-primary text-on-primary rounded-xl text-sm font-semibold hover:opacity-90 shadow-sm transition-transform active:scale-95"
                >
                  <Check size={14} />
                  <span>Save to Profile</span>
                </button>
              </div>
            </div>

            {/* Demo Mode Notice */}
            {isDemoMode && (
              <div className="flex items-start gap-md p-md bg-amber-500/10 border border-amber-500/20 text-amber-800 dark:text-amber-300 rounded-2xl text-sm animate-fade-in">
                <ShieldAlert className="mt-0.5 shrink-0 text-amber-600 dark:text-amber-400" size={18} />
                <div>
                  <span className="font-bold">Demo Fallback Mode Activated</span>
                  <p className="text-xs opacity-90 mt-1">To run live AI extraction, please configure your <code>GEMINI_API_KEY</code> environment variable. Currently parsing details using server regex heuristics and public scraping.</p>
                </div>
              </div>
            )}

            {/* Main Content Layout */}
            <div className="grid grid-cols-1 lg:grid-cols-4 gap-lg">
              {/* Sidebar View Toggle */}
              <div className="lg:col-span-1 flex flex-row lg:flex-col gap-sm bg-surface-container-lowest p-sm rounded-2xl border border-outline-variant h-fit">
                <button 
                  onClick={() => setActiveTab('merged')}
                  className={`flex-1 flex items-center justify-center lg:justify-start gap-md px-md py-[10px] rounded-xl font-semibold text-sm transition-colors ${
                    activeTab === 'merged'
                      ? 'bg-primary text-on-primary'
                      : 'text-on-surface-variant hover:bg-surface-container-low'
                  }`}
                >
                  <Sparkles size={16} />
                  <span>Merged Portfolio</span>
                </button>
                <button 
                  onClick={() => setActiveTab('resume')}
                  className={`flex-1 flex items-center justify-center lg:justify-start gap-md px-md py-[10px] rounded-xl font-semibold text-sm transition-colors ${
                    activeTab === 'resume'
                      ? 'bg-secondary-container text-on-surface-variant'
                      : 'text-on-surface-variant hover:bg-surface-container-low'
                  }`}
                >
                  <FileText size={16} />
                  <span>Resume Data</span>
                </button>
                {externalData && (
                  <button 
                    onClick={() => setActiveTab('external')}
                    className={`flex-1 flex items-center justify-center lg:justify-start gap-md px-md py-[10px] rounded-xl font-semibold text-sm transition-colors ${
                      activeTab === 'external'
                        ? 'bg-secondary-container text-on-surface-variant'
                        : 'text-on-surface-variant hover:bg-surface-container-low'
                    }`}
                  >
                    <Globe size={16} />
                    <span>External Profiles</span>
                  </button>
                )}
                <button 
                  onClick={() => setActiveTab('debug')}
                  className={`flex-1 flex items-center justify-center lg:justify-start gap-md px-md py-[10px] rounded-xl font-semibold text-sm transition-colors ${
                    activeTab === 'debug'
                      ? 'bg-secondary-container text-on-surface-variant font-bold border border-primary/20'
                      : 'text-on-surface-variant hover:bg-surface-container-low'
                  }`}
                >
                  <Terminal size={16} />
                  <span>AI Debug Console</span>
                </button>
              </div>

              {/* Viewer Body */}
              <div className="lg:col-span-3">
                <AnimatePresence mode="wait">
                  {/* TAB 1: Merged Portfolio */}
                  {activeTab === 'merged' && (
                    <motion.div
                      key="merged-tab"
                      initial={{ opacity: 0, x: 10 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -10 }}
                    >
                      {mergedData ? renderStructuredCards(mergedData) : renderStructuredCards(resumeData)}
                    </motion.div>
                  )}

                  {/* TAB 2: Original Resume Data */}
                  {activeTab === 'resume' && (
                    <motion.div
                      key="resume-tab"
                      initial={{ opacity: 0, x: 10 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -10 }}
                    >
                      {renderStructuredCards(resumeData)}
                    </motion.div>
                  )}

                  {/* TAB 3: External Profile Summaries (Collapsible per Source) */}
                  {activeTab === 'external' && externalData && (
                    <motion.div
                      key="external-tab"
                      initial={{ opacity: 0, x: 10 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -10 }}
                      className="flex flex-col gap-md"
                    >
                      {/* GitHub Card */}
                      <div className="bg-surface-container-lowest border border-outline-variant rounded-2xl overflow-hidden shadow-sm">
                        <button 
                          onClick={() => toggleProfileSection('github')}
                          className="w-full flex items-center justify-between p-md border-b border-outline-variant hover:bg-surface-container-low/50 transition-colors"
                        >
                          <div className="flex items-center gap-md">
                            <span className="font-bold text-on-surface text-sm">GitHub Profiles</span>
                            <span className="px-sm py-0.5 text-[10px] font-bold uppercase rounded bg-primary/10 text-primary">
                              {externalData.github?.length > 0 ? `Enriched (${externalData.github.length})` : 'Not Found'}
                            </span>
                          </div>
                          {expandedProfiles.github ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                        </button>

                        <AnimatePresence initial={false}>
                          {expandedProfiles.github && (
                            <motion.div
                              initial={{ height: 0 }}
                              animate={{ height: 'auto' }}
                              exit={{ height: 0 }}
                              className="overflow-hidden"
                            >
                              <div className="p-md flex flex-col gap-md">
                                {externalData.github?.length > 0 ? (
                                  externalData.github.map((gh: any, idx: number) => (
                                    <div key={idx} className="bg-surface-container-low p-md rounded-xl border border-outline-variant/30 text-sm">
                                      <div className="flex items-center gap-md mb-md">
                                        {gh.avatarUrl && (
                                          <Image src={gh.avatarUrl} alt={gh.username} width={48} height={48} className="w-12 h-12 rounded-full border border-outline-variant" />
                                        )}
                                        <div>
                                          <h5 className="font-bold text-on-surface">{gh.name || `@${gh.username}`}</h5>
                                          <a href={`https://github.com/${gh.username}`} target="_blank" rel="noopener noreferrer" className="text-xs text-primary hover:underline flex items-center gap-xs mt-0.5">
                                            <span>github.com/{gh.username}</span>
                                            <ExternalLink size={10} />
                                          </a>
                                        </div>
                                      </div>
                                      {gh.bio && <p className="text-xs text-on-surface-variant italic mb-md">&ldquo;{gh.bio}&rdquo;</p>}

                                      
                                      <div className="grid grid-cols-3 gap-sm text-center mb-md text-xs">
                                        <div className="bg-surface-container-lowest p-sm rounded-lg border border-outline-variant/20">
                                          <span className="text-on-surface-variant block font-medium">Followers</span>
                                          <span className="font-bold text-on-surface mt-0.5 block">{gh.followers ?? 0}</span>
                                        </div>
                                        <div className="bg-surface-container-lowest p-sm rounded-lg border border-outline-variant/20">
                                          <span className="text-on-surface-variant block font-medium">Following</span>
                                          <span className="font-bold text-on-surface mt-0.5 block">{gh.following ?? 0}</span>
                                        </div>
                                        <div className="bg-surface-container-lowest p-sm rounded-lg border border-outline-variant/20">
                                          <span className="text-on-surface-variant block font-medium">Public Repos</span>
                                          <span className="font-bold text-on-surface mt-0.5 block">{gh.publicReposCount ?? 0}</span>
                                        </div>
                                      </div>

                                      {gh.repositories?.length > 0 && (
                                        <div>
                                          <span className="text-[10px] font-bold text-on-surface-variant uppercase tracking-wider block mb-sm">Discovered Repositories</span>
                                          <div className="grid grid-cols-1 md:grid-cols-2 gap-sm">
                                            {gh.repositories.map((repo: any, rIdx: number) => (
                                              <div key={rIdx} className="bg-surface-container-lowest p-sm rounded-lg border border-outline-variant/30 text-xs">
                                                <div className="flex justify-between items-center mb-xs">
                                                  <span className="font-bold text-on-surface truncate max-w-[120px]">{repo.name}</span>
                                                  <span className="px-1.5 py-0.5 bg-secondary-container text-on-surface-variant rounded text-[9px] font-semibold">{repo.language}</span>
                                                </div>
                                                <p className="text-[11px] text-on-surface-variant line-clamp-1 mb-xs">{repo.description || 'No description provided.'}</p>
                                                <span className="text-[10px] font-bold text-tertiary">★ {repo.stars} stars</span>
                                              </div>
                                            ))}
                                          </div>
                                        </div>
                                      )}
                                    </div>
                                  ))
                                ) : (
                                  <p className="text-sm text-on-surface-variant italic p-sm">No GitHub profiles found to enrich.</p>
                                )}
                              </div>
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </div>

                      {/* LinkedIn Card */}
                      <div className="bg-surface-container-lowest border border-outline-variant rounded-2xl overflow-hidden shadow-sm">
                        <button 
                          onClick={() => toggleProfileSection('linkedin')}
                          className="w-full flex items-center justify-between p-md border-b border-outline-variant hover:bg-surface-container-low/50 transition-colors"
                        >
                          <div className="flex items-center gap-md">
                            <span className="font-bold text-on-surface text-sm">LinkedIn Profiles</span>
                            <span className="px-sm py-0.5 text-[10px] font-bold uppercase rounded bg-primary/10 text-primary">
                              {externalData.linkedin?.length > 0 ? `Enriched (${externalData.linkedin.length})` : 'Not Found'}
                            </span>
                          </div>
                          {expandedProfiles.linkedin ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                        </button>

                        <AnimatePresence initial={false}>
                          {expandedProfiles.linkedin && (
                            <motion.div
                              initial={{ height: 0 }}
                              animate={{ height: 'auto' }}
                              exit={{ height: 0 }}
                              className="overflow-hidden"
                            >
                              <div className="p-md flex flex-col gap-md">
                                {externalData.linkedin?.length > 0 ? (
                                  externalData.linkedin.map((li: any, idx: number) => (
                                    <div key={idx} className="bg-surface-container-low p-md rounded-xl border border-outline-variant/30 text-sm">
                                      <div className="flex justify-between items-start mb-sm">
                                        <h5 className="font-bold text-on-surface">{li.name || 'LinkedIn Member'}</h5>
                                        <a href={li.profileUrl} target="_blank" rel="noopener noreferrer" className="text-xs text-primary hover:underline flex items-center gap-xs">
                                          <span>View Profile</span>
                                          <ExternalLink size={10} />
                                        </a>
                                      </div>
                                      <p className="text-xs text-on-surface-variant font-medium mb-sm">{li.headline}</p>
                                      {li.about && (
                                        <div className="bg-surface-container-lowest p-sm rounded-lg border border-outline-variant/20 text-xs text-on-surface-variant leading-relaxed">
                                          {li.about}
                                        </div>
                                      )}
                                    </div>
                                  ))
                                ) : (
                                  <p className="text-sm text-on-surface-variant italic p-sm">No LinkedIn profiles found to enrich.</p>
                                )}
                              </div>
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </div>

                      {/* Coding Profiles Card */}
                      <div className="bg-surface-container-lowest border border-outline-variant rounded-2xl overflow-hidden shadow-sm">
                        <button 
                          onClick={() => toggleProfileSection('coding')}
                          className="w-full flex items-center justify-between p-md border-b border-outline-variant hover:bg-surface-container-low/50 transition-colors"
                        >
                          <div className="flex items-center gap-md">
                            <span className="font-bold text-on-surface text-sm">Coding Stats & Ratings</span>
                            <span className="px-sm py-0.5 text-[10px] font-bold uppercase rounded bg-primary/10 text-primary">
                              {externalData.coding?.length > 0 ? `Enriched (${externalData.coding.length})` : 'Not Found'}
                            </span>
                          </div>
                          {expandedProfiles.coding ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                        </button>

                        <AnimatePresence initial={false}>
                          {expandedProfiles.coding && (
                            <motion.div
                              initial={{ height: 0 }}
                              animate={{ height: 'auto' }}
                              exit={{ height: 0 }}
                              className="overflow-hidden"
                            >
                              <div className="p-md flex flex-col gap-md">
                                {externalData.coding?.length > 0 ? (
                                  <div className="grid grid-cols-1 md:grid-cols-2 gap-md">
                                    {externalData.coding.map((cp: any, idx: number) => (
                                      <div key={idx} className="bg-surface-container-low p-md rounded-xl border border-outline-variant/30 text-sm">
                                        <div className="flex justify-between items-center mb-md">
                                          <span className="font-bold text-on-surface capitalize">{cp.platform}</span>
                                          <span className="text-xs text-on-surface-variant font-mono">@{cp.username}</span>
                                        </div>
                                        
                                        <div className="flex flex-col gap-xs text-xs text-on-surface-variant">
                                          {cp.rating && (
                                            <div className="flex justify-between">
                                              <span>Current Rating:</span>
                                              <span className="font-bold text-on-surface">{cp.rating}</span>
                                            </div>
                                          )}
                                          {cp.maxRating && (
                                            <div className="flex justify-between">
                                              <span>Peak Rating:</span>
                                              <span className="font-bold text-on-surface">{cp.maxRating}</span>
                                            </div>
                                          )}
                                          {cp.rank && (
                                            <div className="flex justify-between">
                                              <span>Platform Rank:</span>
                                              <span className="font-bold text-primary">{cp.rank}</span>
                                            </div>
                                          )}
                                          {cp.solvedCount && (
                                            <div className="flex justify-between">
                                              <span>Solved Problems:</span>
                                              <span className="font-bold text-on-surface">{cp.solvedCount}</span>
                                            </div>
                                          )}
                                          {cp.ranking && (
                                            <div className="flex justify-between">
                                              <span>Global Ranking:</span>
                                              <span className="font-bold text-on-surface">#{cp.ranking}</span>
                                            </div>
                                          )}
                                        </div>
                                      </div>
                                    ))}
                                  </div>
                                ) : (
                                  <p className="text-sm text-on-surface-variant italic p-sm">No competitive coding accounts found.</p>
                                )}
                              </div>
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </div>

                      {/* Portfolio Sites Card */}
                      <div className="bg-surface-container-lowest border border-outline-variant rounded-2xl overflow-hidden shadow-sm">
                        <button 
                          onClick={() => toggleProfileSection('portfolio')}
                          className="w-full flex items-center justify-between p-md border-b border-outline-variant hover:bg-surface-container-low/50 transition-colors"
                        >
                          <div className="flex items-center gap-md">
                            <span className="font-bold text-on-surface text-sm">Personal Websites</span>
                            <span className="px-sm py-0.5 text-[10px] font-bold uppercase rounded bg-primary/10 text-primary">
                              {externalData.portfolio?.length > 0 ? `Enriched (${externalData.portfolio.length})` : 'Not Found'}
                            </span>
                          </div>
                          {expandedProfiles.portfolio ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                        </button>

                        <AnimatePresence initial={false}>
                          {expandedProfiles.portfolio && (
                            <motion.div
                              initial={{ height: 0 }}
                              animate={{ height: 'auto' }}
                              exit={{ height: 0 }}
                              className="overflow-hidden"
                            >
                              <div className="p-md flex flex-col gap-md">
                                {externalData.portfolio?.length > 0 ? (
                                  externalData.portfolio.map((port: any, idx: number) => (
                                    <div key={idx} className="bg-surface-container-low p-md rounded-xl border border-outline-variant/30 text-sm">
                                      <div className="flex justify-between items-start mb-xs">
                                        <h5 className="font-bold text-on-surface">{port.title}</h5>
                                        <a href={port.url} target="_blank" rel="noopener noreferrer" className="p-1 text-primary hover:bg-surface-container-highest rounded">
                                          <ExternalLink size={14} />
                                        </a>
                                      </div>
                                      <p className="text-xs text-on-surface-variant mb-md">{port.description}</p>
                                      
                                      {port.techStack?.length > 0 && (
                                        <div className="mb-md">
                                          <span className="text-[10px] font-bold text-on-surface-variant uppercase tracking-wider block mb-sm">Detected Stack Hint</span>
                                          <div className="flex flex-wrap gap-xs">
                                            {port.techStack.map((tech: string, tIdx: number) => (
                                              <span key={tIdx} className="bg-surface-container-lowest px-2 py-0.5 rounded text-[10px] font-semibold text-on-surface border border-outline-variant/20">{tech}</span>
                                            ))}
                                          </div>
                                        </div>
                                      )}
                                      
                                      {port.socials?.length > 0 && (
                                        <div>
                                          <span className="text-[10px] font-bold text-on-surface-variant uppercase tracking-wider block mb-sm">Found Outgoing Links</span>
                                          <div className="flex flex-wrap gap-xs">
                                            {port.socials.map((linkStr: string, sIdx: number) => {
                                              const label = linkStr.includes('github') ? 'GitHub' : linkStr.includes('linkedin') ? 'LinkedIn' : 'Social';
                                              return (
                                                <a key={sIdx} href={linkStr} target="_blank" rel="noopener noreferrer" className="bg-surface-container-lowest text-primary hover:underline px-2 py-0.5 rounded text-[10px] font-semibold border border-outline-variant/20 flex items-center gap-xs">
                                                  <span>{label}</span>
                                                  <ExternalLink size={8} />
                                                </a>
                                              );
                                            })}
                                          </div>
                                        </div>
                                      )}
                                    </div>
                                  ))
                                ) : (
                                  <p className="text-sm text-on-surface-variant italic p-sm">No personal links found to crawl.</p>
                                )}
                              </div>
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </div>

                      {/* Other Discovery Links Card */}
                      <div className="bg-surface-container-lowest border border-outline-variant rounded-2xl overflow-hidden shadow-sm">
                        <button 
                          onClick={() => toggleProfileSection('other')}
                          className="w-full flex items-center justify-between p-md border-b border-outline-variant hover:bg-surface-container-low/50 transition-colors"
                        >
                          <div className="flex items-center gap-md">
                            <span className="font-bold text-on-surface text-sm">Other Discovery URLs</span>
                            <span className="px-sm py-0.5 text-[10px] font-bold uppercase rounded bg-primary/10 text-primary">
                              {externalData.otherLinks?.length > 0 ? `Discovered (${externalData.otherLinks.length})` : 'Not Found'}
                            </span>
                          </div>
                          {expandedProfiles.other ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                        </button>

                        <AnimatePresence initial={false}>
                          {expandedProfiles.other && (
                            <motion.div
                              initial={{ height: 0 }}
                              animate={{ height: 'auto' }}
                              exit={{ height: 0 }}
                              className="overflow-hidden"
                            >
                              <div className="p-md flex flex-col gap-sm">
                                {externalData.otherLinks?.length > 0 ? (
                                  externalData.otherLinks.map((lnk: string, idx: number) => {
                                    let hostname = 'External Link';
                                    try {
                                      hostname = new URL(lnk).hostname;
                                    } catch {}
                                    return (
                                      <div key={idx} className="flex justify-between items-center bg-surface-container-low p-sm rounded-xl border border-outline-variant/20 text-xs">
                                        <div>
                                          <span className="font-bold text-on-surface block">{hostname}</span>
                                          <span className="text-[11px] text-on-surface-variant truncate max-w-[280px] block">{lnk}</span>
                                        </div>
                                        <a href={lnk} target="_blank" rel="noopener noreferrer" className="p-1 bg-surface-container-highest text-primary rounded">
                                          <ExternalLink size={12} />
                                        </a>
                                      </div>
                                    );
                                  })
                                ) : (
                                  <p className="text-sm text-on-surface-variant italic p-sm">No additional certificates or platform URLs parsed.</p>
                                )}
                              </div>
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </div>
                    </motion.div>
                  )}

                  {/* TAB 4: AI Debug Console */}
                  {activeTab === 'debug' && (
                    <motion.div
                      key="debug-tab"
                      initial={{ opacity: 0, x: 10 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -10 }}
                      className="flex flex-col gap-md"
                    >
                      {/* Sub-tab navigation */}
                      <div className="flex flex-wrap gap-xs border-b border-outline-variant pb-sm">
                        {[
                          { id: 'rawPdf', label: 'Raw PDF Text' },
                          { id: 'cleanedText', label: 'Cleaned Resume Text' },
                          { id: 'sections', label: 'Detected Sections' },
                          { id: 'sectionTexts', label: 'Section Text' },
                          { id: 'llmInputs', label: 'LLM Input' },
                          { id: 'extractedJson', label: 'Extracted JSON' },
                          { id: 'finalPortfolio', label: 'Final Portfolio JSON' },
                        ].map((sub) => (
                          <button
                            key={sub.id}
                            onClick={() => setDebugSubTab(sub.id as any)}
                            className={`px-md py-1.5 rounded-full text-xs font-semibold transition-all ${
                              debugSubTab === sub.id
                                ? 'bg-primary text-on-primary'
                                : 'bg-surface-container-low text-on-surface-variant hover:bg-surface-container-high'
                            }`}
                          >
                            {sub.label}
                          </button>
                        ))}
                      </div>

                      {/* Sub-tab Contents */}
                      <div className="mt-sm">
                        {debugSubTab === 'rawPdf' && (
                          <div className="flex flex-col gap-xs">
                            <label className="text-xs font-bold text-on-surface-variant uppercase tracking-wider block">Raw PDF Text</label>
                            <div className="bg-surface-container-lowest border border-outline-variant rounded-2xl overflow-hidden shadow-sm">
                              <textarea 
                                readOnly 
                                value={rawPdfText || extractedText || 'No text extracted.'} 
                                className="w-full h-96 p-md font-mono text-xs text-on-surface bg-surface-container-lowest border-none outline-none resize-none focus:ring-0" 
                              />
                            </div>
                            <p className="text-xs text-on-surface-variant italic">Direct text extract output from the PDF document.</p>
                          </div>
                        )}

                        {debugSubTab === 'cleanedText' && (
                          <div className="flex flex-col gap-xs">
                            <label className="text-xs font-bold text-on-surface-variant uppercase tracking-wider block">Cleaned Resume Text</label>
                            <div className="bg-surface-container-lowest border border-outline-variant rounded-2xl overflow-hidden shadow-sm">
                              <textarea 
                                readOnly 
                                value={cleanedText || extractedText || 'No text extracted.'} 
                                className="w-full h-96 p-md font-mono text-xs text-on-surface bg-surface-container-lowest border-none outline-none resize-none focus:ring-0" 
                              />
                            </div>
                            <p className="text-xs text-on-surface-variant italic">Layout-preserved clean text block used for section split.</p>
                          </div>
                        )}

                        {debugSubTab === 'sections' && (
                          <div className="flex flex-col gap-xs">
                            <label className="text-xs font-bold text-on-surface-variant uppercase tracking-wider block">Detected Sections</label>
                            <div className="bg-surface-container-lowest border border-outline-variant rounded-2xl p-md shadow-sm">
                              {detectedSections.length > 0 ? (
                                <div className="flex flex-wrap gap-sm">
                                  {detectedSections.map((sec, idx) => (
                                    <span key={idx} className="px-md py-1.5 bg-surface-container-low text-on-surface font-semibold text-xs rounded-full border border-outline-variant/30 capitalize">
                                      {sec}
                                    </span>
                                  ))}
                                </div>
                              ) : (
                                <p className="text-sm text-on-surface-variant italic p-sm text-center">No sections detected in the resume text.</p>
                              )}
                            </div>
                          </div>
                        )}

                        {debugSubTab === 'sectionTexts' && (
                          <div className="flex flex-col gap-xs">
                            <label className="text-xs font-bold text-on-surface-variant uppercase tracking-wider block">Text Assigned to Each Section</label>
                            <div className="space-y-md">
                              {sectionTexts ? (
                                Object.entries(sectionTexts).map(([section, textContent], idx) => (
                                  <div key={idx} className="bg-surface-container-lowest border border-outline-variant rounded-2xl overflow-hidden shadow-sm">
                                    <div className="bg-surface-container-low px-md py-sm border-b border-outline-variant flex justify-between items-center">
                                      <span className="text-xs font-bold capitalize text-primary">{section} Section ({textContent.length} chars)</span>
                                    </div>
                                    <pre className="p-md text-xs font-mono overflow-auto max-h-60 leading-relaxed text-on-surface-variant select-text whitespace-pre-wrap">
                                      <code>{textContent}</code>
                                    </pre>
                                  </div>
                                ))
                              ) : (
                                <p className="text-sm text-on-surface-variant italic p-md text-center bg-surface-container-lowest border border-outline-variant rounded-2xl">No section text recorded.</p>
                              )}
                            </div>
                          </div>
                        )}

                        {debugSubTab === 'llmInputs' && (
                          <div className="flex flex-col gap-xs">
                            <label className="text-xs font-bold text-on-surface-variant uppercase tracking-wider block">LLM Prompts (Section by Section)</label>
                            <div className="space-y-md">
                              {llmInputs ? (
                                Object.entries(llmInputs).map(([section, promptText], idx) => (
                                  <div key={idx} className="bg-surface-container-lowest border border-outline-variant rounded-2xl overflow-hidden shadow-sm">
                                    <div className="bg-surface-container-low px-md py-sm border-b border-outline-variant flex justify-between items-center">
                                      <span className="text-xs font-bold capitalize text-primary">{section} Prompt</span>
                                    </div>
                                    <pre className="p-md text-xs font-mono overflow-auto max-h-60 leading-relaxed text-on-surface-variant select-text">
                                      <code>{promptText}</code>
                                    </pre>
                                  </div>
                                ))
                              ) : (
                                <p className="text-sm text-on-surface-variant italic p-md text-center bg-surface-container-lowest border border-outline-variant rounded-2xl">No LLM inputs recorded.</p>
                              )}
                            </div>
                          </div>
                        )}

                        {debugSubTab === 'extractedJson' && (
                          <div className="bg-[#1e1e2e] text-[#cdd6f4] rounded-2xl border border-outline-variant/30 overflow-hidden shadow-sm relative">
                            <div className="flex justify-between items-center bg-[#181825] px-md py-sm border-b border-[#313244]">
                              <span className="text-xs font-bold font-mono text-[#a6adc8]">extracted_json_responses.json</span>
                              <button 
                                onClick={() => {
                                  navigator.clipboard.writeText(JSON.stringify(extractedJson || resumeData, null, 2));
                                  showToast('Extracted JSON copied!');
                                }}
                                className="flex items-center gap-xs px-sm py-1 bg-[#313244] hover:bg-[#45475a] text-[#cdd6f4] rounded-lg text-xs font-semibold transition-colors"
                              >
                                <Copy size={12} />
                                <span>Copy JSON</span>
                              </button>
                            </div>
                            <pre className="p-md text-xs font-mono overflow-auto max-h-[500px] leading-relaxed select-text selection:bg-[#45475a]">
                              <code>{JSON.stringify(extractedJson || resumeData, null, 2)}</code>
                            </pre>
                          </div>
                        )}

                        {debugSubTab === 'finalPortfolio' && (
                          <div className="bg-[#1e1e2e] text-[#cdd6f4] rounded-2xl border border-outline-variant/30 overflow-hidden shadow-sm relative">
                            <div className="flex justify-between items-center bg-[#181825] px-md py-sm border-b border-[#313244]">
                              <span className="text-xs font-bold font-mono text-[#a6adc8]">final_portfolio.json</span>
                              <button 
                                onClick={() => {
                                  navigator.clipboard.writeText(JSON.stringify(mergedData || resumeData, null, 2));
                                  showToast('Portfolio JSON copied!');
                                }}
                                className="flex items-center gap-xs px-sm py-1 bg-[#313244] hover:bg-[#45475a] text-[#cdd6f4] rounded-lg text-xs font-semibold transition-colors"
                              >
                                <Copy size={12} />
                                <span>Copy JSON</span>
                              </button>
                            </div>
                            <pre className="p-md text-xs font-mono overflow-auto max-h-[500px] leading-relaxed select-text selection:bg-[#45475a]">
                              <code>{JSON.stringify(mergedData || resumeData, null, 2)}</code>
                            </pre>
                          </div>
                        )}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
