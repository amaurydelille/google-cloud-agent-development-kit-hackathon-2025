'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { PageLayout, Header } from '../../components/layout';
import MetricsDisplay from '../../components/analysis/MetricsDisplay';
import { MetricData } from '../../types/analysis';

interface AnalysisResult {
  summary: string;
  bigquery_metrics?: MetricData[];
  statista_insights?: MetricData[];
  timestamp: string;
}

export default function Dashboard() {
  const router = useRouter();
  const [analysisResult, setAnalysisResult] = useState<AnalysisResult | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    try {
      const storedResult = sessionStorage.getItem('analysisResult');
      if (storedResult) {
        const result = JSON.parse(storedResult) as AnalysisResult;
        setAnalysisResult(result);
      }
    } catch (error) {
      console.error('Failed to load analysis result:', error);
    } finally {
      setLoading(false);
    }
  }, []);

  if (loading) {
    return (
      <PageLayout>
        <Header />
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-center">
            <div className="w-8 h-8 border-2 border-white border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-neutral-400">Loading analysis results...</p>
          </div>
        </div>
      </PageLayout>
    );
  }

  if (!analysisResult) {
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
      <div className="max-w-7xl mx-auto px-6 py-8">
        <div className="mb-8">
          <div className="flex items-center justify-between mb-6">
            <h1 className="text-3xl font-bold text-white flex items-center gap-3">
              <span className="text-4xl">📊</span>
              Analysis Dashboard
            </h1>
            <button
              onClick={() => router.push('/')}
              className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors flex items-center gap-2"
            >
              <span className="text-lg">🔍</span>
              New Query
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          <MetricsDisplay
            title="BigQuery Analytics"
            metrics={analysisResult.bigquery_metrics || []}
            icon="📊"
            bgColor="bg-blue-900/20"
          />
          
          <MetricsDisplay
            title="Market Insights"
            metrics={analysisResult.statista_insights || []}
            icon="📈"
            bgColor="bg-green-900/20"
          />
        </div>

        <div className="bg-white/5 backdrop-blur-xl rounded-2xl border border-white/10 p-8">
          <h2 className="text-xl font-semibold text-white mb-4 flex items-center gap-2">
            <span className="text-2xl">🌐</span>
            Google Analysis Summary
          </h2>
          
          <div 
            className="text-neutral-200 leading-relaxed space-y-4"
            dangerouslySetInnerHTML={{ __html: analysisResult.summary }}
          />
          
          <div className="mt-6 pt-4 border-t border-neutral-700/30">
            <p className="text-neutral-400 text-sm">
              Analysis completed: {new Date(analysisResult.timestamp).toLocaleString()}
            </p>
          </div>
        </div>
      </div>
    </PageLayout>
  );
} 