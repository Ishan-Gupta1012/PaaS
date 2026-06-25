'use client';

import React from 'react';
import { useAuth } from '@/context/AuthContext';
import Link from 'next/link';
import { ArrowLeft, Mail, Shield, MapPin, Building, Globe, ExternalLink } from 'lucide-react';
import { motion } from 'framer-motion';

export default function ProfilePage() {
  const { user } = useAuth();
  
  // Extract info safely
  const { personalInfo, provider: userProvider } = user || {};
  const provider = userProvider ? userProvider.charAt(0).toUpperCase() + userProvider.slice(1) : "Supabase Auth";

  return (
    <div className="min-h-screen bg-background text-on-surface font-body-md selection:bg-primary-container selection:text-on-primary-container">
      {/* Top Navigation Bar */}
      <header className="flex items-center w-full h-16 px-lg sticky top-0 z-50 bg-surface-container-lowest/80 backdrop-blur-md border-b border-outline-variant">
        <div className="flex items-center gap-md">
          <Link href="/dashboard" className="p-2 -ml-2 text-on-surface-variant hover:bg-surface-container-low rounded-full transition-colors flex items-center gap-2">
            <ArrowLeft size={20} />
            <span className="font-semibold text-label-md">Back to Dashboard</span>
          </Link>
        </div>
      </header>

      {/* Main Content */}
      <main className="p-lg md:p-2xl max-w-container-max mx-auto w-full">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: "easeOut" }}
          className="space-y-xl"
        >
          {/* Header Title */}
          <div>
            <h1 className="font-headline-lg text-headline-lg font-bold">My Profile</h1>
            <p className="text-body-md text-on-surface-variant mt-xs">Manage your personal information and authentication settings.</p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-lg">
            {/* Left Column: Avatar & Basic Info */}
            <div className="lg:col-span-1 space-y-lg">
              <div className="bg-surface-container-lowest p-xl rounded-2xl border border-outline-variant shadow-sm flex flex-col items-center text-center">
                <div className="relative mb-md">
                  <img 
                    src={personalInfo?.avatar || "https://api.dicebear.com/7.x/avataaars/svg?seed=fallback"} 
                    alt="Profile Avatar" 
                    className="w-32 h-32 rounded-full border-4 border-surface-container-lowest shadow-md object-cover"
                  />
                  <div className="absolute bottom-0 right-0 w-8 h-8 bg-primary text-on-primary rounded-full flex items-center justify-center shadow-lg border-2 border-surface-container-lowest">
                    <Shield size={14} />
                  </div>
                </div>
                
                <h2 className="font-headline-md text-headline-md font-bold mb-xs">
                  {personalInfo?.name || "Developer"}
                </h2>
                <p className="text-body-md text-on-surface-variant mb-md">
                  {personalInfo?.title || "Software Engineer"}
                </p>

                <div className="w-full flex justify-center gap-sm mt-md">
                  {personalInfo?.github && (
                    <a href={personalInfo.github} target="_blank" rel="noopener noreferrer" className="p-2 bg-surface-container-low text-on-surface hover:bg-primary hover:text-on-primary rounded-full transition-colors flex items-center justify-center">
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4"/><path d="M9 18c-4.51 2-5-2-7-2"/></svg>
                    </a>
                  )}
                  {personalInfo?.linkedin && (
                    <a href={personalInfo.linkedin} target="_blank" rel="noopener noreferrer" className="p-2 bg-surface-container-low text-on-surface hover:bg-[#0077b5] hover:text-white rounded-full transition-colors flex items-center justify-center">
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"/><rect width="4" height="12" x="2" y="9"/><circle cx="4" cy="4" r="2"/></svg>
                    </a>
                  )}
                </div>
              </div>
            </div>

            {/* Right Column: Detailed Information */}
            <div className="lg:col-span-2 space-y-lg">
              {/* Personal Details */}
              <div className="bg-surface-container-lowest p-lg rounded-2xl border border-outline-variant shadow-sm">
                <h3 className="font-headline-sm text-headline-sm font-bold mb-lg pb-sm border-b border-outline-variant">Personal Information</h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-y-lg gap-x-md">
                  <div>
                    <p className="text-label-sm text-on-surface-variant font-bold uppercase mb-1">Full Name</p>
                    <p className="text-body-md font-medium text-on-surface">{personalInfo?.name || "Not provided"}</p>
                  </div>
                  
                  <div>
                    <p className="text-label-sm text-on-surface-variant font-bold uppercase mb-1">Email Address</p>
                    <div className="flex items-center gap-2">
                      <Mail size={16} className="text-primary" />
                      <p className="text-body-md font-medium text-on-surface">{personalInfo?.email || "No email"}</p>
                    </div>
                  </div>

                  <div>
                    <p className="text-label-sm text-on-surface-variant font-bold uppercase mb-1">Location</p>
                    <div className="flex items-center gap-2">
                      <MapPin size={16} className="text-on-surface-variant" />
                      <p className="text-body-md text-on-surface">{personalInfo?.location || "Not specified"}</p>
                    </div>
                  </div>

                  <div>
                    <p className="text-label-sm text-on-surface-variant font-bold uppercase mb-1">Company / University</p>
                    <div className="flex items-center gap-2">
                      <Building size={16} className="text-on-surface-variant" />
                      <p className="text-body-md text-on-surface">{personalInfo?.company || "Not specified"}</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Authentication Status */}
              <div className="bg-surface-container-lowest p-lg rounded-2xl border border-outline-variant shadow-sm">
                <h3 className="font-headline-sm text-headline-sm font-bold mb-lg pb-sm border-b border-outline-variant">Authentication</h3>
                
                <div className="flex items-center justify-between p-md bg-surface-container-low rounded-xl border border-outline-variant">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-primary/10 text-primary rounded-full flex items-center justify-center">
                      <Shield size={24} />
                    </div>
                    <div>
                      <p className="font-bold text-on-surface">Authenticated via {provider}</p>
                      <p className="text-label-sm text-on-surface-variant">Your account is securely managed by Supabase.</p>
                    </div>
                  </div>
                  <span className="px-3 py-1 bg-tertiary/10 text-tertiary text-label-sm font-bold rounded-full uppercase">
                    Verified
                  </span>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </main>
    </div>
  );
}
