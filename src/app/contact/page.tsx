'use client';

import { useState } from 'react';
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

export default function ContactPage() {
  const [formSubmitted, setFormSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    projectType: 'portfolio',
    details: ''
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();
      if (response.ok && data.success) {
        setFormSubmitted(true);
      } else {
        setError(data.error || 'Failed to send request. Please try again.');
      }
    } catch (err: any) {
      console.error(err);
      setError('An error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };


  return (
    <div className="bg-[#F7F4EF] text-[#111111] min-h-screen flex flex-col custom-cursor font-sans">
      <Navbar />

      <main className="flex-1 pt-24 md:pt-32">
        {/* Header */}
        <section className="py-12 md:py-20 border-b border-[#111111] bg-grid-paper">
          <div className="max-w-4xl mx-auto px-4 sm:px-8">
            <div className="font-mono text-xs uppercase tracking-widest text-[#111111]/60 mb-6">
              ✦ Project Inquiry / Contact Form
            </div>
            
            <h1 className="font-serif text-5xl sm:text-7xl leading-[0.9] tracking-tight mb-6">
              Start a project, <span className="italic font-normal text-stroke">shape the vision.</span>
            </h1>
            <p className="text-sm md:text-base text-[#111111]/80 max-w-[600px] leading-relaxed">
              Have an idea? Fill out the questionnaire below. We read every inquiry and respond with a structured outline within 24 hours.
            </p>
          </div>
        </section>

        {/* Contact Form Section */}
        <section className="py-16 md:py-24 bg-[#F7F4EF] bg-grid-paper flex-1">
          <div className="max-w-2xl mx-auto px-4 sm:px-8">
            
            {formSubmitted ? (
              <div className="border border-[#111111] p-8 md:p-12 text-center bg-[#F7F4EF]">
                <div className="font-mono text-xs text-green-600 mb-4">[SUBMITTED SUCCESSFULLY]</div>
                <h2 className="font-serif text-3xl font-semibold mb-4">Thank you, {formData.name}.</h2>
                <p className="text-sm text-[#111111]/80 leading-relaxed mb-6">
                  Your inquiry regarding a custom <span className="font-mono font-semibold text-xs uppercase bg-[#111111]/5 px-1.5 py-0.5 rounded-xs border border-[#111111]/10">{formData.projectType}</span> layout has been received. Our team will review it and reply at <span className="underline">{formData.email}</span> shortly.
                </p>
                <button 
                  onClick={() => setFormSubmitted(false)}
                  className="font-mono text-xs uppercase tracking-widest border border-[#111111] px-6 py-3 hover:bg-[#111111] hover:text-[#F7F4EF] transition-all"
                >
                  Send another message
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="flex flex-col gap-10">
                
                {/* Name */}
                <div className="flex flex-col gap-2">
                  <label htmlFor="name" className="font-mono text-[10px] uppercase tracking-widest text-[#111111]/65">
                    [01] What is your name? *
                  </label>
                  <input 
                    type="text" 
                    id="name"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="Enter your full name..."
                    className="w-full bg-transparent border-b border-[#111111]/30 py-3 text-sm md:text-base outline-hidden focus:border-[#111111] transition-colors"
                    required
                  />
                </div>

                {/* Email */}
                <div className="flex flex-col gap-2">
                  <label htmlFor="email" className="font-mono text-[10px] uppercase tracking-widest text-[#111111]/65">
                    [02] What is your email address? *
                  </label>
                  <input 
                    type="email" 
                    id="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    placeholder="Enter your email address..."
                    className="w-full bg-transparent border-b border-[#111111]/30 py-3 text-sm md:text-base outline-hidden focus:border-[#111111] transition-colors"
                    required
                  />
                </div>

                {/* Project Type */}
                <div className="flex flex-col gap-2">
                  <label htmlFor="projectType" className="font-mono text-[10px] uppercase tracking-widest text-[#111111]/65">
                    [03] What are we building? *
                  </label>
                  <div className="relative border-b border-[#111111]/30 py-1">
                    <select 
                      id="projectType"
                      value={formData.projectType}
                      onChange={(e) => setFormData({ ...formData, projectType: e.target.value })}
                      className="w-full bg-transparent py-2 text-sm md:text-base outline-hidden appearance-none pr-8 cursor-pointer font-mono uppercase tracking-wide"
                      required
                    >
                      <option value="portfolio" className="bg-[#F7F4EF]">Developer Portfolio</option>
                      <option value="brand" className="bg-[#F7F4EF]">Brand Identity & Packaging</option>
                      <option value="webApp" className="bg-[#F7F4EF]">Complex Next.js Web App</option>
                      <option value="other" className="bg-[#F7F4EF]">Other Creative Project</option>
                    </select>
                    <div className="absolute right-0 top-1/2 -translate-y-1/2 pointer-events-none text-xs">
                      ▼
                    </div>
                  </div>
                </div>

                {/* Project Details */}
                <div className="flex flex-col gap-2">
                  <label htmlFor="details" className="font-mono text-[10px] uppercase tracking-widest text-[#111111]/65">
                    [04] Project details & context
                  </label>
                  <textarea 
                    id="details"
                    rows={4}
                    value={formData.details}
                    onChange={(e) => setFormData({ ...formData, details: e.target.value })}
                    placeholder="Describe your goals, tech stack, and timeline..."
                    className="w-full bg-transparent border-b border-[#111111]/30 py-3 text-sm md:text-base outline-hidden resize-none focus:border-[#111111] transition-colors"
                  />
                </div>

                {error && (
                  <div className="font-mono text-xs text-red-600 border border-red-600 p-4 bg-red-50 rounded-sm">
                    [ERROR: {error}]
                  </div>
                )}

                {/* Submit button */}
                <div className="mt-4">
                  <button 
                    type="submit" 
                    disabled={loading}
                    className="w-full bg-[#111111] text-[#F7F4EF] hover:bg-[#111111]/85 border border-[#111111] py-4 font-mono text-xs uppercase tracking-widest transition-all rounded-sm disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {loading ? 'Submitting...' : 'Submit Questionnaire'}
                  </button>
                </div>

              </form>
            )}

          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
