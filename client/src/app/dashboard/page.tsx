'use client';

import { useSearchParams } from 'next/navigation';
import { PageLayout, Header } from '../../components/layout';

export default function Dashboard() {
  const searchParams = useSearchParams();
  const encodedSummary = searchParams.get('summary');
  
  const summary = encodedSummary ? decodeURIComponent(encodedSummary) : null;

  if (!summary) {
    return (
      <PageLayout>
        <Header />
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-center">
            <h1 className="text-2xl font-semibold text-white mb-4">No Analysis Results</h1>
            <p className="text-neutral-400">No summary data available.</p>
          </div>
        </div>
      </PageLayout>
    );
  }

  return (
    <PageLayout>
      <Header />
      <div className="max-w-6xl mx-auto px-6 py-8">
        <div className="bg-white/5 backdrop-blur-xl rounded-2xl border border-white/10 p-8">
          <h1 className="text-3xl font-bold text-white mb-6 flex items-center gap-3">
            <span className="text-4xl">📊</span>
            Analysis Dashboard
          </h1>
          
          <div className="bg-neutral-900/50 rounded-xl p-6 border border-neutral-700/30">
            <h2 className="text-xl font-semibold text-white mb-4 flex items-center gap-2">
              <span className="text-2xl">🌐</span>
              Google Analysis Summary
            </h2>
            
            <div 
              className="text-neutral-200 leading-relaxed space-y-4"
              dangerouslySetInnerHTML={{ __html: summary }}
            />
          </div>
        </div>
      </div>
    </PageLayout>
  );
} 