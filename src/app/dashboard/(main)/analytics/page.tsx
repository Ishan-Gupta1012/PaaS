import React from 'react';
import { BarChart3 } from 'lucide-react';

export default function AnalyticsPage() {
  return (
    <div className="p-lg md:p-xl max-w-5xl mx-auto w-full">
      <div className="mb-xl">
        <h1 className="font-display-sm text-2xl font-bold text-on-surface mb-2">Portfolio Analytics</h1>
        <p className="text-on-surface-variant text-sm">View basic traffic metrics, resume downloads, and visitor insights.</p>
      </div>

      <div className="bg-surface-container-lowest border border-outline-variant rounded-xl shadow-sm overflow-hidden flex flex-col items-center justify-center py-32">
        <div className="w-16 h-16 bg-surface-container-low rounded-full flex items-center justify-center mb-6 text-on-surface-variant">
          <BarChart3 size={24} />
        </div>
        <h3 className="font-bold text-lg mb-2">Analytics Infrastructure</h3>
        <p className="text-on-surface-variant text-sm text-center max-w-md">
          Basic telemetry tracking can be hooked into this dashboard view in the future.
        </p>
      </div>
    </div>
  );
}
