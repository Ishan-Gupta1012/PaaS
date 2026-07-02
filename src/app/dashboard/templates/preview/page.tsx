'use client';

import React from 'react';
import ModernDeveloperTemplate from '@/components/templates/ModernDeveloper';
import { initialPortfolioData } from '@/types/portfolio';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';

export default function PreviewPage() {
  return (
    <div className="min-h-screen w-full relative">
      <Link 
        href="/dashboard/templates" 
        className="fixed top-6 left-6 z-[100] flex items-center gap-2 bg-surface-container-lowest/50 hover:bg-surface-container-lowest backdrop-blur-md px-4 py-2 rounded-full border border-outline-variant text-on-surface transition-colors shadow-lg"
      >
        <ArrowLeft size={18} />
        <span className="font-semibold text-sm">Back to Templates</span>
      </Link>
      <ModernDeveloperTemplate data={initialPortfolioData} />
    </div>
  );
}
