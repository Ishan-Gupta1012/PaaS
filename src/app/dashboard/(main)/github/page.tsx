import React from 'react';
import { RefreshCw } from 'lucide-react';

export default function GithubPage() {
  return (
    <div className="p-lg md:p-xl max-w-5xl mx-auto w-full">
      <div className="mb-xl">
        <h1 className="font-display-sm text-2xl font-bold text-on-surface mb-2">GitHub Connection</h1>
        <p className="text-on-surface-variant text-sm">Manage your repository sync, view cached data, and select featured projects.</p>
      </div>

      <div className="bg-surface-container-lowest border border-outline-variant rounded-xl shadow-sm overflow-hidden flex flex-col items-center justify-center py-32">
        <div className="w-16 h-16 bg-surface-container-low rounded-full flex items-center justify-center mb-6 text-on-surface-variant">
          <RefreshCw size={24} />
        </div>
        <h3 className="font-bold text-lg mb-2">GitHub Sync Infrastructure</h3>
        <p className="text-on-surface-variant text-sm text-center w-full max-w-[400px] px-4">
          Ready to plug in GitHub OAuth components, repository selection lists, and sync status logs.
        </p>
      </div>
    </div>
  );
}
