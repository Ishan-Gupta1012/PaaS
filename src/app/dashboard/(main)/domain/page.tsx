import React from 'react';
import { Globe } from 'lucide-react';

export default function DomainPage() {
  return (
    <div className="p-lg md:p-xl max-w-5xl mx-auto w-full">
      <div className="mb-xl">
        <h1 className="font-display-sm text-2xl font-bold text-on-surface mb-2">Custom Domain</h1>
        <p className="text-on-surface-variant text-sm">Connect a custom URL (e.g. yourname.com) to your PortfolioOS instance.</p>
      </div>

      <div className="bg-surface-container-lowest border border-outline-variant rounded-xl shadow-sm overflow-hidden flex flex-col items-center justify-center py-32">
        <div className="w-16 h-16 bg-surface-container-low rounded-full flex items-center justify-center mb-6 text-on-surface-variant">
          <Globe size={24} />
        </div>
        <h3 className="font-bold text-lg mb-2">Domain Settings Infrastructure</h3>
        <p className="text-on-surface-variant text-sm text-center max-w-md">
          Ready to integrate with Vercel Domains API or custom DNS verification records.
        </p>
      </div>
    </div>
  );
}
