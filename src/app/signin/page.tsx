'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { Mail, ArrowLeft, Loader2 } from 'lucide-react';

export default function SignIn() {
  const { user, login, isLoading } = useAuth();
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  // Redirect if already logged in
  useEffect(() => {
    if (user && !isLoading) {
      router.push('/dashboard');
    }
  }, [user, isLoading, router]);

  const handleEmailSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) {
      setErrorMsg('Please enter your university email');
      return;
    }
    setErrorMsg('');
    setIsSubmitting(true);
    
    try {
      await login('email', email);
      setTimeout(() => {
        setIsSubmitting(false);
        setErrorMsg('Check your email for the login link!');
      }, 1000);
    } catch {
      setErrorMsg('Failed to send login link. Please try again.');
      setIsSubmitting(false);
    }
  };

  const handleOAuth = async (provider: 'google' | 'github' | 'linkedin') => {
    setErrorMsg('');
    await login(provider);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-neutral-50 flex items-center justify-center">
        <Loader2 className="w-8 h-8 text-neutral-400 animate-spin" />
      </div>
    );
  }

  return (
    <div className="w-full flex-1 min-h-screen bg-neutral-50 text-neutral-700 flex items-center justify-center p-4 relative overflow-hidden bg-grid-pattern">
      
      {/* Decorative Orbs from Landing Page Theme */}
      <div className="absolute top-[-10%] left-[-10%] w-[40rem] h-[40rem] rounded-full bg-brand-600/5 blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[40rem] h-[40rem] rounded-full bg-brand-600/5 blur-[120px] pointer-events-none" />

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
        className="w-full max-w-md min-w-[320px] sm:min-w-[400px] shrink-0 relative z-10"
      >
        
        {/* Back Link */}
        <div className="mb-6">
          <Link 
            href="/" 
            className="inline-flex items-center text-sm text-neutral-500 hover:text-neutral-900 transition-colors gap-2 font-medium group"
          >
            <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
            Back to Home
          </Link>
        </div>

        {/* Main Card */}
        <div className="bg-white border border-neutral-200 rounded-2xl p-8 shadow-sm relative overflow-hidden">
          
          {/* Header */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-brand-100 border border-brand-600/10 text-brand-600 font-bold text-2xl mb-4">
              P
            </div>
            <h1 className="text-2xl font-bold tracking-tight text-neutral-900">
              Sign in to PortfolioAI
            </h1>
            <p className="text-neutral-500 text-sm mt-2">
              Build and deploy your student portfolio with AI
            </p>
          </div>

          <AnimatePresence mode="wait">
            {errorMsg && (
              <motion.div 
                initial={{ opacity: 0, height: 0, y: -10 }}
                animate={{ opacity: 1, height: 'auto', y: 0 }}
                exit={{ opacity: 0, height: 0, y: -10 }}
                className="mb-6 p-4 rounded-xl bg-danger-500/10 border border-danger-500/20 text-danger-500 text-sm flex items-start gap-2.5 overflow-hidden"
              >
                <div className="mt-1 shrink-0 w-1.5 h-1.5 rounded-full bg-danger-500" />
                <span>{errorMsg}</span>
              </motion.div>
            )}
          </AnimatePresence>

          {/* OAuth Buttons */}
          <div className="space-y-3 mb-6">
            <button
              onClick={() => handleOAuth('google')}
              className="w-full h-12 flex items-center justify-center gap-3 bg-white text-neutral-900 hover:bg-neutral-50 font-semibold rounded-lg transition-all duration-200 border border-neutral-200 shadow-sm cursor-pointer text-sm"
            >
              <svg className="w-5 h-5" viewBox="0 0 24 24">
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" />
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" />
              </svg>
              Continue with Google
            </button>

            <button
              onClick={() => handleOAuth('github')}
              className="w-full h-12 flex items-center justify-center gap-3 bg-[#111827] hover:bg-[#1f2937] text-white font-semibold rounded-lg transition-all duration-200 shadow-sm cursor-pointer text-sm"
            >
              <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
                <path fillRule="evenodd" clipRule="evenodd" d="M12 2C6.477 2 2 6.477 2 12c0 4.42 2.865 8.166 6.839 9.489.5.092.682-.217.682-.482 0-.237-.008-.866-.013-1.7-2.782.603-3.369-1.34-3.369-1.34-.454-1.156-1.11-1.464-1.11-1.464-.908-.62.069-.608.069-.608 1.003.07 1.531 1.03 1.531 1.03.892 1.529 2.341 1.087 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.11-4.555-4.943 0-1.091.39-1.984 1.029-2.683-.103-.253-.446-1.27.098-2.647 0 0 .84-.269 2.75 1.025A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.294 2.747-1.025 2.747-1.025.546 1.377.203 2.394.1 2.647.64.699 1.028 1.592 1.028 2.683 0 3.842-2.339 4.687-4.566 4.935.359.309.678.919.678 1.852 0 1.336-.012 2.415-.012 2.743 0 .267.18.579.688.481C19.137 20.164 22 16.418 22 12c0-5.523-4.477-10-10-10z" />
              </svg>
              Continue with GitHub
            </button>

            <button
              onClick={() => handleOAuth('linkedin')}
              className="w-full h-12 flex items-center justify-center gap-3 bg-[#0A66C2] hover:bg-[#0A66C2]/90 text-white font-semibold rounded-lg transition-all duration-200 shadow-sm cursor-pointer text-sm"
            >
              <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
                <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
              </svg>
              Continue with LinkedIn
            </button>
          </div>

          {/* Divider */}
          <div className="flex items-center my-6">
            <div className="flex-grow border-t border-neutral-200" />
            <span className="px-4 text-[10px] font-bold uppercase tracking-wider text-neutral-500">or use email</span>
            <div className="flex-grow border-t border-neutral-200" />
          </div>

          {/* Email form */}
          <form onSubmit={handleEmailSubmit} className="space-y-4">
            <div>
              <label htmlFor="email" className="block text-[11px] font-bold text-neutral-500 uppercase tracking-wider mb-2">
                University Email Address
              </label>
              <div className="relative group">
                <input
                  id="email"
                  type="email"
                  placeholder="name@university.edu"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full h-12 pl-11 pr-4 bg-white border border-neutral-200 focus:border-brand-600 focus:ring-1 focus:ring-brand-600 rounded-lg text-neutral-900 placeholder-neutral-500 outline-none transition-all text-sm font-medium"
                />
                <div className="absolute left-3.5 top-1/2 -translate-y-1/2 text-neutral-400 group-focus-within:text-brand-600 transition-colors">
                  <Mail className="w-5 h-5" />
                </div>
              </div>
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full h-11 bg-brand-600 hover:bg-brand-600/90 disabled:bg-brand-600/50 text-white font-semibold rounded-lg flex items-center justify-center gap-2 transition-all cursor-pointer shadow-sm text-sm"
            >
              {isSubmitting ? (
                <Loader2 className="w-5 h-5 animate-spin" />
              ) : (
                'Send Magic Link'
              )}
            </button>
          </form>

        </div>
        
        {/* Footer info */}
        <p className="text-center text-xs text-neutral-500 mt-6">
          By signing in, you agree to our <a href="#" className="underline hover:text-neutral-700 transition-colors">Terms of Service</a> and <a href="#" className="underline hover:text-neutral-700 transition-colors">Privacy Policy</a>.
        </p>

      </motion.div>
    </div>
  );
}
