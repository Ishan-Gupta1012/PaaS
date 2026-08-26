'use client';

import { useState } from 'react';

export default function CtaSection() {
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('loading');
    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email,
          formName: 'CTA Early Queue Signup',
          subject: `Early Queue Signup: ${email}`
        })
      });
      if (res.ok) {
        setStatus('success');
        setEmail('');
      } else {
        setStatus('error');
      }
    } catch (err) {
      console.error(err);
      setStatus('error');
    }
  };

  return (
    <section className="py-20 md:py-32 bg-[#F7F4EF] border-b border-[#111111] text-[#111111] font-sans bg-grid-paper select-none">
      <div className="max-w-4xl mx-auto px-4 sm:px-8 text-center">
        
        {/* Tag */}
        <div className="font-mono text-xs uppercase tracking-widest text-[#111111]/60 mb-6">
          ✦ Get in Touch
        </div>

        {/* Heading */}
        <h2 className="font-serif text-4xl sm:text-5xl lg:text-6xl leading-[1.1] tracking-tight mb-8">
          Let's build something <span className="italic font-normal">thoughtful together.</span>
        </h2>
        
        {/* Description */}
        <p className="text-sm md:text-base text-[#111111]/70 leading-relaxed mb-12 max-w-[600px] mx-auto">
          We're launching soon. Join our early queue to preview templates, influence the design roadmap, and deploy your custom layout.
        </p>

        {/* Clean Input Form */}
        <div className="max-w-[450px] mx-auto mb-16">
          {status === 'success' ? (
            <div className="border border-[#111111] p-4 bg-[#F7F4EF] font-mono text-xs text-green-600">
              [SUCCESSFULLY JOINED THE QUEUE]
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3 border border-[#111111] p-1.5 bg-[#F7F4EF] rounded-sm">
              <input 
                type="email" 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="enter your email address..." 
                className="flex-1 bg-transparent text-sm text-[#111111] px-4 py-3 outline-hidden font-mono"
                required
                disabled={status === 'loading'}
              />
              <button 
                type="submit" 
                disabled={status === 'loading'}
                className="bg-[#111111] text-[#F7F4EF] hover:bg-[#111111]/85 transition-colors px-6 py-3 font-mono text-xs uppercase tracking-widest rounded-sm disabled:opacity-50"
              >
                {status === 'loading' ? 'Joining...' : 'Join Queue'}
              </button>
            </form>
          )}
          {status === 'error' && (
            <div className="mt-2 font-mono text-xs text-red-600">
              [ERROR: Failed to join queue. Please try again.]
            </div>
          )}
        </div>

        {/* Grid Questions */}
        <div className="grid grid-cols-1 md:grid-cols-3 border-t border-l border-[#111111] text-left">
          <div className="p-6 border-r border-b border-[#111111]">
            <div className="font-mono text-[9px] text-[#111111]/40 mb-3">[QA.01]</div>
            <p className="text-xs text-[#111111]/80 leading-relaxed">
              Is configuring dynamic portfolios a hassle for you?
            </p>
          </div>
          <div className="p-6 border-r border-b border-[#111111]">
            <div className="font-mono text-[9px] text-[#111111]/40 mb-3">[QA.02]</div>
            <p className="text-xs text-[#111111]/80 leading-relaxed">
              Would a hand-crafted premium UI help highlight your code?
            </p>
          </div>
          <div className="p-6 border-r border-b border-[#111111]">
            <div className="font-mono text-[9px] text-[#111111]/40 mb-3">[QA.03]</div>
            <p className="text-xs text-[#111111]/80 leading-relaxed">
              Do you prefer complete control over exported static bundles?
            </p>
          </div>
        </div>

      </div>
    </section>
  );
}
