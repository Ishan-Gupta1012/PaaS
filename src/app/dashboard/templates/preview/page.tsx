'use client';

import React, { useState, useEffect } from 'react';
import ModernDeveloperTemplate from '@/components/templates/ModernDeveloper';
import DeveloperProTemplate from '@/components/templates/DeveloperPro';
import { initialPortfolioData } from '@/types/portfolio';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';

export default function PreviewPage() {
  const [selectedTemplate, setSelectedTemplate] = useState<string>('modern-developer');

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search);
      const temp = params.get('template');
      if (temp) {
        setSelectedTemplate(temp);
      }
    }
  }, []);

  return (
    <div className="min-h-screen w-full relative">
      <Link 
        href="/dashboard/templates" 
        className="fixed top-6 left-6 z-[100] flex items-center gap-2 bg-surface-container-lowest/50 hover:bg-surface-container-lowest backdrop-blur-md px-4 py-2 rounded-full border border-outline-variant text-on-surface transition-colors shadow-lg"
      >
        <ArrowLeft size={18} />
        <span className="font-semibold text-sm">Back to Templates</span>
      </Link>
      {selectedTemplate === 'software-engineer' ? (
        <DeveloperProTemplate data={initialPortfolioData} />
      ) : (
        <ModernDeveloperTemplate data={initialPortfolioData} />
      )}
    </div>
  );
}
