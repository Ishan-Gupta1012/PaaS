'use client';

import React from 'react';
import ModernDeveloperTemplate from '@/components/templates/ModernDeveloper';
import { initialPortfolioData } from '@/types/portfolio';

export default function ModernDeveloperPage() {
  return <ModernDeveloperTemplate data={initialPortfolioData} />;
}
