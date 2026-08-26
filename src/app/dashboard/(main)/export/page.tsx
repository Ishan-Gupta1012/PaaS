import React from 'react';
import { Download } from 'lucide-react';

export default function ExportPage() {
  return (
    <div className="p-lg md:p-xl max-w-5xl mx-auto w-full">
      <div className="mb-xl">
        <h1 className="font-display-sm text-2xl font-bold text-on-surface mb-2">Export Portfolio</h1>
        <p className="text-on-surface-variant text-sm">Download your portfolio as a static HTML bundle or a resume PDF.</p>
      </div>

      <div className="bg-surface-container-lowest border border-outline-variant rounded-xl shadow-sm overflow-hidden flex flex-col items-center justify-center py-32">
        <div className="w-16 h-16 bg-surface-container-low rounded-full flex items-center justify-center mb-6 text-on-surface-variant">
          <Download size={24} />
        </div>
        <h3 className="font-bold text-lg mb-2">Export Infrastructure</h3>
        <p className="text-on-surface-variant text-sm text-center w-full max-w-[400px] px-4">
          Ready to hook into static site generation triggers or PDF rendering services.
        </p>
      </div>
    </div>
  );
}
