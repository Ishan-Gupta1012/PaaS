'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import Link from 'next/link';

export default function SignIn() {
  const { user, login, isLoading } = useAuth();
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [showOtp, setShowOtp] = useState(false);
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [activeSimulator, setActiveSimulator] = useState<'google' | 'github' | 'linkedin' | null>(null);
  const [simulatorStep, setSimulatorStep] = useState(1);
  const [errorMsg, setErrorMsg] = useState('');

  // Redirect if already logged in
  useEffect(() => {
    if (user && !isLoading) {
      router.push('/dashboard');
    }
  }, [user, isLoading, router]);

  const handleEmailSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) {
      setErrorMsg('Please enter your university email');
      return;
    }
    setErrorMsg('');
    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      setShowOtp(true);
    }, 1200);
  };

  const handleOtpChange = (index: number, value: string) => {
    if (isNaN(Number(value))) return;
    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    // Auto-focus next input
    if (value !== '' && index < 5) {
      const nextInput = document.getElementById(`otp-${index + 1}`);
      nextInput?.focus();
    }
  };

  const handleOtpKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Backspace' && otp[index] === '' && index > 0) {
      const prevInput = document.getElementById(`otp-${index - 1}`);
      prevInput?.focus();
    }
  };

  const verifyOtp = async () => {
    const code = otp.join('');
    if (code.length < 6) {
      setErrorMsg('Please enter the full 6-digit code');
      return;
    }
    setErrorMsg('');
    setIsSubmitting(true);
    try {
      await login('email', email);
      router.push('/dashboard');
    } catch {
      setErrorMsg('Invalid code, please try again.');
      setIsSubmitting(false);
    }
  };

  const triggerOAuth = (provider: 'google' | 'github' | 'linkedin') => {
    setActiveSimulator(provider);
    setSimulatorStep(1);
  };

  const completeOAuth = async () => {
    setSimulatorStep(3); // Loading step inside simulator
    setTimeout(async () => {
      try {
        await login(activeSimulator!);
        setActiveSimulator(null);
        router.push('/dashboard');
      } catch {
        setErrorMsg('Authentication failed.');
        setActiveSimulator(null);
      }
    }, 1500);
  };

  return (
    <div className="min-h-screen bg-neutral-50 text-neutral-700 flex items-center justify-center p-4 relative overflow-hidden bg-grid-pattern">
      {/* Decorative Orbs */}
      <div className="absolute top-[-10%] left-[-10%] w-[40rem] h-[40rem] rounded-full bg-brand-600/5 blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[40rem] h-[40rem] rounded-full bg-brand-600/5 blur-[120px] pointer-events-none" />

      {/* Main card */}
      <div className="w-full max-w-md bg-white border border-neutral-200 rounded-2xl p-8 shadow-sm relative z-10">
        
        {/* Back Link */}
        <div className="mb-6">
          <Link href="/" className="inline-flex items-center text-sm text-neutral-500 hover:text-neutral-900 transition-colors gap-2 font-medium">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="m15 18-6-6 6-6"/></svg>
            Back to Home
          </Link>
        </div>

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

        {errorMsg && (
          <div className="mb-6 p-4 rounded-xl bg-danger-500/10 border border-danger-500/20 text-danger-500 text-sm flex items-start gap-2.5">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mt-0.5"><circle cx="12" cy="12" r="10"/><line x1="12" x2="12" y1="8" y2="12"/><line x1="12" x2="12" y1="16" y2="16"/></svg>
            <span>{errorMsg}</span>
          </div>
        )}

        {/* OAuth Buttons */}
        {!showOtp && (
          <div className="space-y-3 mb-6">
            <button
              onClick={() => triggerOAuth('google')}
              disabled={isLoading || isSubmitting}
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
              onClick={() => triggerOAuth('github')}
              disabled={isLoading || isSubmitting}
              className="w-full h-12 flex items-center justify-center gap-3 bg-[#111827] hover:bg-[#1f2937] text-white font-semibold rounded-lg transition-all duration-200 shadow-sm cursor-pointer text-sm"
            >
              <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
                <path fillRule="evenodd" clipRule="evenodd" d="M12 2C6.477 2 2 6.477 2 12c0 4.42 2.865 8.166 6.839 9.489.5.092.682-.217.682-.482 0-.237-.008-.866-.013-1.7-2.782.603-3.369-1.34-3.369-1.34-.454-1.156-1.11-1.464-1.11-1.464-.908-.62.069-.608.069-.608 1.003.07 1.531 1.03 1.531 1.03.892 1.529 2.341 1.087 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.11-4.555-4.943 0-1.091.39-1.984 1.029-2.683-.103-.253-.446-1.27.098-2.647 0 0 .84-.269 2.75 1.025A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.294 2.747-1.025 2.747-1.025.546 1.377.203 2.394.1 2.647.64.699 1.028 1.592 1.028 2.683 0 3.842-2.339 4.687-4.566 4.935.359.309.678.919.678 1.852 0 1.336-.012 2.415-.012 2.743 0 .267.18.579.688.481C19.137 20.164 22 16.418 22 12c0-5.523-4.477-10-10-10z" />
              </svg>
              Continue with GitHub
            </button>

            <button
              onClick={() => triggerOAuth('linkedin')}
              disabled={isLoading || isSubmitting}
              className="w-full h-12 flex items-center justify-center gap-3 bg-[#0A66C2] hover:bg-[#0A66C2]/90 text-white font-semibold rounded-lg transition-all duration-200 shadow-sm cursor-pointer text-sm"
            >
              <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
                <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
              </svg>
              Continue with LinkedIn
            </button>
          </div>
        )}

        {/* Divider */}
        {!showOtp && (
          <div className="flex items-center my-6">
            <div className="flex-grow border-t border-neutral-200" />
            <span className="px-4 text-[10px] font-bold uppercase tracking-wider text-neutral-500">or use email</span>
            <div className="flex-grow border-t border-neutral-200" />
          </div>
        )}

        {/* Email form */}
        {!showOtp ? (
          <form onSubmit={handleEmailSubmit} className="space-y-4">
            <div>
              <label htmlFor="email" className="block text-[11px] font-bold text-neutral-500 uppercase tracking-wider mb-2">
                University Email Address
              </label>
              <div className="relative">
                <input
                  id="email"
                  type="email"
                  placeholder="name@university.edu"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full h-12 pl-10 pr-4 bg-white border border-neutral-200 focus:border-brand-600 focus:ring-1 focus:ring-brand-600 rounded-lg text-neutral-900 placeholder-neutral-500 outline-none transition-all text-sm font-medium"
                />
                <div className="absolute left-3.5 top-1/2 -translate-y-1/2 text-neutral-400">
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><rect width="20" height="16" x="2" y="4" rx="2"/><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/></svg>
                </div>
              </div>
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full h-11 bg-brand-600 hover:bg-brand-600/90 disabled:bg-brand-600/50 text-white font-semibold rounded-lg flex items-center justify-center gap-2 transition-all cursor-pointer shadow-sm text-sm"
            >
              {isSubmitting ? (
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <>
                  Send Magic Code
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="5" x2="19" y1="12" y2="12"/><polyline points="12 5 19 12 12 19"/></svg>
                </>
              )}
            </button>
          </form>
        ) : (
          /* OTP Screen */
          <div className="space-y-6">
            <div className="text-center">
              <h2 className="font-semibold text-lg text-neutral-900">Verify your Email</h2>
              <p className="text-neutral-500 text-xs mt-1">
                We sent a 6-digit code to <span className="text-brand-600 font-semibold">{email}</span>
              </p>
            </div>

            <div className="flex justify-between gap-2 max-w-xs mx-auto">
              {otp.map((digit, i) => (
                <input
                  key={i}
                  id={`otp-${i}`}
                  type="text"
                  maxLength={1}
                  value={digit}
                  onChange={(e) => handleOtpChange(i, e.target.value)}
                  onKeyDown={(e) => handleOtpKeyDown(i, e)}
                  className="w-12 h-14 bg-white text-center text-xl font-bold border border-neutral-200 focus:border-brand-600 rounded-lg outline-none text-brand-600 transition-all focus:ring-1 focus:ring-brand-600"
                />
              ))}
            </div>

            <div className="space-y-3">
              <button
                onClick={verifyOtp}
                disabled={isSubmitting}
                className="w-full h-11 bg-brand-600 hover:bg-brand-600/90 disabled:bg-brand-600/50 text-white font-semibold rounded-lg flex items-center justify-center gap-2 transition-all cursor-pointer shadow-sm text-sm"
              >
                {isSubmitting ? (
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                ) : (
                  'Verify and Continue'
                )}
              </button>

              <button
                onClick={() => { setShowOtp(false); setOtp(['', '', '', '', '', '']); }}
                className="w-full h-10 border border-neutral-200 text-neutral-500 hover:bg-neutral-50 rounded-lg text-xs font-semibold transition-colors cursor-pointer"
              >
                Go Back
              </button>
            </div>
          </div>
        )}
      </div>

      {/* High-Fidelity Interactive Simulator Modal */}
      {activeSimulator && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-neutral-900/60 backdrop-blur-sm animate-fade-in">
          <div className="w-full max-w-md bg-white text-neutral-700 rounded-xl shadow-xl overflow-hidden border border-neutral-200 flex flex-col transform scale-100 transition-all duration-300">
            {/* Pop-up header mimicking native OS browser chrome */}
            <div className="bg-neutral-50 px-4 py-2 flex items-center justify-between border-b border-neutral-200 text-xs text-neutral-500">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-red-400" />
                <span className="w-2.5 h-2.5 rounded-full bg-yellow-400" />
                <span className="w-2.5 h-2.5 rounded-full bg-green-400" />
                <span className="ml-2 font-medium tracking-tight font-mono text-[10px]">
                  {activeSimulator === 'google' && 'accounts.google.com/o/oauth2/auth'}
                  {activeSimulator === 'github' && 'github.com/login/oauth/authorize'}
                  {activeSimulator === 'linkedin' && 'linkedin.com/oauth/v2/authorization'}
                </span>
              </div>
              <button onClick={() => setActiveSimulator(null)} className="text-neutral-400 hover:text-neutral-700">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="18" x2="6" y1="6" y2="18"/><line x1="6" x2="18" y1="6" y2="18"/></svg>
              </button>
            </div>

            {/* Simulated Content */}
            <div className="p-6 flex-1 flex flex-col">
              {activeSimulator === 'google' && (
                <>
                  {simulatorStep === 1 && (
                    <div className="space-y-6">
                      <div className="text-center">
                        <svg className="w-8 h-8 mx-auto mb-2" viewBox="0 0 24 24">
                          <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                          <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                          <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" />
                          <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" />
                        </svg>
                        <h3 className="text-lg font-bold text-neutral-900">Sign in with Google</h3>
                        <p className="text-xs text-neutral-500 mt-1">to continue to <span className="font-semibold text-brand-600">PortfolioAI</span></p>
                      </div>

                      <div className="border border-neutral-200 rounded-lg divide-y divide-neutral-100 overflow-hidden">
                        <button
                          onClick={completeOAuth}
                          className="w-full px-4 py-3 flex items-center gap-3 hover:bg-neutral-50 text-left transition-colors cursor-pointer"
                        >
                          <img
                            src="https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=80&auto=format&fit=crop&q=80"
                            alt="Alex"
                            className="w-8 h-8 rounded-full object-cover"
                          />
                          <div>
                            <p className="text-xs font-bold text-neutral-900">Alex Carter</p>
                            <p className="text-[10px] text-neutral-500">alex.carter@university.edu</p>
                          </div>
                        </button>

                        <button
                          onClick={() => setSimulatorStep(2)}
                          className="w-full px-4 py-3 flex items-center gap-3 hover:bg-neutral-50 text-left transition-colors text-neutral-600 text-xs font-semibold cursor-pointer"
                        >
                          <div className="w-8 h-8 rounded-full bg-neutral-100 flex items-center justify-center text-neutral-400">
                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><line x1="12" x2="12" y1="8" y2="16"/><line x1="8" x2="16" y1="12" y2="12"/></svg>
                          </div>
                          Use another account
                        </button>
                      </div>

                      <p className="text-[10px] text-neutral-400 leading-relaxed text-center">
                        To continue, Google will share your name, email address, language preference, and profile picture with PortfolioAI.
                      </p>
                    </div>
                  )}

                  {simulatorStep === 2 && (
                    <div className="space-y-4">
                      <div>
                        <h3 className="text-base font-bold text-neutral-900">Sign in</h3>
                        <p className="text-xs text-neutral-500 mt-1">Use your Google Account</p>
                      </div>
                      <input
                        type="email"
                        placeholder="Email or phone"
                        defaultValue="alex.carter@university.edu"
                        className="w-full h-11 px-3 border border-neutral-300 focus:border-brand-600 rounded outline-none text-neutral-900 text-sm"
                      />
                      <div className="flex justify-between items-center pt-2">
                        <button onClick={() => setSimulatorStep(1)} className="text-xs font-semibold text-brand-600 hover:text-brand-600/90">Back</button>
                        <button onClick={completeOAuth} className="h-9 px-5 bg-brand-600 hover:bg-brand-600/90 text-white text-xs font-semibold rounded-lg cursor-pointer">Next</button>
                      </div>
                    </div>
                  )}
                </>
              )}

              {activeSimulator === 'github' && (
                <div className="space-y-6 text-sm text-neutral-700">
                  <div className="flex items-center justify-center gap-4">
                    <div className="w-10 h-10 bg-brand-600 text-white rounded-lg flex items-center justify-center font-bold text-lg">P</div>
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="text-neutral-400"><path d="M16 3H1v13h15V3z"/><path d="M23 7v10h-7M23 12h-7"/></svg>
                    <svg className="w-10 h-10 fill-current text-neutral-900" viewBox="0 0 24 24">
                      <path d="M12 2C6.477 2 2 6.477 2 12c0 4.42 2.865 8.166 6.839 9.489.5.092.682-.217.682-.482 0-.237-.008-.866-.013-1.7-2.782.603-3.369-1.34-3.369-1.34-.454-1.156-1.11-1.464-1.11-1.464-.908-.62.069-.608.069-.608 1.003.07 1.531 1.03 1.531 1.03.892 1.529 2.341 1.087 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.11-4.555-4.943 0-1.091.39-1.984 1.029-2.683-.103-.253-.446-1.27.098-2.647 0 0 .84-.269 2.75 1.025A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.294 2.747-1.025 2.747-1.025.546 1.377.203 2.394.1 2.647.64.699 1.028 1.592 1.028 2.683 0 3.842-2.339 4.687-4.566 4.935.359.309.678.919.678 1.852 0 1.336-.012 2.415-.012 2.743 0 .267.18.579.688.481C19.137 20.164 22 16.418 22 12c0-5.523-4.477-10-10-10z" />
                    </svg>
                  </div>

                  <div className="text-center">
                    <h3 className="text-base font-bold text-neutral-900">Authorize PortfolioAI</h3>
                    <p className="text-xs text-neutral-500 mt-1">wants to access your <span className="font-semibold text-neutral-900">taylor-reese</span> GitHub account</p>
                  </div>

                  <div className="bg-neutral-50 border border-neutral-200 rounded-lg p-4 space-y-3">
                    <div className="flex items-start gap-3 text-xs text-neutral-600">
                      <svg className="w-5 h-5 text-success-500 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                      <div>
                        <p className="font-semibold text-neutral-800">Personal user data</p>
                        <p className="text-neutral-500 text-[10px]">Read access to profile email and public info</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3 text-xs text-neutral-600">
                      <svg className="w-5 h-5 text-success-500 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                      <div>
                        <p className="font-semibold text-neutral-800">Repositories</p>
                        <p className="text-neutral-500 text-[10px]">Read access to metadata of public repositories</p>
                      </div>
                    </div>
                  </div>

                  <div className="flex gap-3 pt-2">
                    <button onClick={() => setActiveSimulator(null)} className="flex-1 h-10 border border-neutral-200 text-neutral-500 hover:bg-neutral-50 font-semibold rounded-lg transition-colors cursor-pointer text-xs">
                      Cancel
                    </button>
                    <button onClick={completeOAuth} className="flex-1 h-10 bg-brand-600 hover:bg-brand-600/90 text-white font-semibold rounded-lg transition-colors cursor-pointer text-xs shadow-sm">
                      Authorize PortfolioAI
                    </button>
                  </div>
                </div>
              )}

              {activeSimulator === 'linkedin' && (
                <div className="space-y-5">
                  <div className="text-center">
                    <svg className="w-10 h-10 mx-auto text-[#0A66C2] fill-current" viewBox="0 0 24 24">
                      <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.779-1.75-1.75s.784-1.75 1.75-1.75 1.75.779 1.75 1.75-.784 1.75-1.75 1.75zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/>
                    </svg>
                    <h3 className="text-base font-bold text-neutral-900 mt-2">Sign in to LinkedIn</h3>
                    <p className="text-xs text-neutral-500 mt-0.5">Use your LinkedIn credentials to continue</p>
                  </div>

                  <div className="space-y-3">
                    <input
                      type="email"
                      placeholder="Email or Phone"
                      defaultValue="jordan.vance@linkedin.com"
                      className="w-full h-11 px-3 border border-neutral-300 focus:border-brand-600 rounded-lg outline-none text-neutral-900 text-sm"
                    />
                    <input
                      type="password"
                      placeholder="Password"
                      defaultValue="••••••••••••"
                      className="w-full h-11 px-3 border border-neutral-300 focus:border-brand-600 rounded-lg outline-none text-neutral-900 text-sm"
                    />
                  </div>

                  <button
                    onClick={completeOAuth}
                    className="w-full h-11 bg-[#0A66C2] hover:bg-[#0A66C2]/90 text-white font-bold rounded-lg transition-colors cursor-pointer text-sm"
                  >
                    Sign In
                  </button>

                  <div className="text-center">
                    <button onClick={() => setActiveSimulator(null)} className="text-xs text-neutral-500 hover:text-neutral-800 transition-colors">
                      Cancel
                    </button>
                  </div>
                </div>
              )}

              {/* Loader step inside simulator */}
              {simulatorStep === 3 && (
                <div className="absolute inset-0 bg-white/95 flex flex-col items-center justify-center p-6 text-center animate-fade-in z-20">
                  <div className="w-10 h-10 border-2 border-brand-600/20 border-t-brand-600 rounded-full animate-spin mb-4" />
                  <p className="text-sm font-semibold text-neutral-800">Verifying authorization credentials...</p>
                  <p className="text-xs text-neutral-400 mt-1">Establishing secure session with PortfolioAI</p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
