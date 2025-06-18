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

interface AccordionState {
  analytics: boolean;
  insights: boolean;
  summary: boolean;
}

const formatSummary = (text: string): string => {
  let formatted = text;
  
  formatted = formatted.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
  
  const lines = formatted.split('\n');
  const processedLines: string[] = [];
  let inList = false;
  
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i].trim();
    
    if (line.startsWith('* ')) {
      if (!inList) {
        processedLines.push('<ul class="list-disc list-inside space-y-2 ml-4">');
        inList = true;
      }
      processedLines.push(`<li class="text-slate-200">${line.substring(2)}</li>`);
    } else {
      if (inList) {
        processedLines.push('</ul>');
        inList = false;
      }
      if (line) {
        processedLines.push(`<p class="text-slate-200">${line}</p>`);
      }
    }
  }
  
  if (inList) {
    processedLines.push('</ul>');
  }
  
  return processedLines.join('\n');
};

export default function Dashboard() {
  const router = useRouter();
  const [analysisResult, setAnalysisResult] = useState<AnalysisResult | null>(null);
  const [loading, setLoading] = useState(true);
  const [accordionState, setAccordionState] = useState<AccordionState>({
    analytics: true,
    insights: true,
    summary: true
  });

  const toggleAccordion = (section: keyof AccordionState) => {
    setAccordionState(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  };

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
        <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
          <div className="flex items-center justify-center min-h-screen">
            <div className="text-center">
              <div className="relative">
                <div className="w-12 h-12 rounded-full border-2 border-slate-300/20 border-t-blue-500 animate-spin mx-auto mb-6"></div>
                <div className="absolute inset-0 w-12 h-12 rounded-full border-2 border-transparent border-t-blue-400/40 animate-spin mx-auto" style={{ animationDuration: '3s', animationDirection: 'reverse' }}></div>
              </div>
              <h2 className="text-xl font-medium text-slate-200 mb-2">Loading Analysis</h2>
              <p className="text-slate-400 text-sm">Processing your results...</p>
            </div>
          </div>
        </div>
      </PageLayout>
    );
  }

  if (!analysisResult) {
    return (
      <PageLayout>
        <Header />
        <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
          <div className="flex items-center justify-center min-h-screen">
            <div className="text-center max-w-md">
              <div className="w-16 h-16 rounded-full bg-slate-800/50 border border-slate-700/50 flex items-center justify-center mx-auto mb-6">
                <svg className="w-8 h-8 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
              <h1 className="text-2xl font-semibold text-slate-200 mb-3">No Analysis Results</h1>
              <p className="text-slate-400 mb-6">Start a new analysis to see insights and data visualizations here.</p>
              <button
                onClick={() => router.push('/')}
                className="inline-flex items-center gap-2 px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-all duration-200 hover:scale-105"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
                Start New Analysis
              </button>
            </div>
          </div>
        </div>
      </PageLayout>
    );
  }

  return (
    <PageLayout>
      <Header />
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
        <div className="max-w-5xl mx-auto px-6 py-8">
          
          <div className="mb-8">
            <div className="flex items-center justify-between mb-2">
              <div>
                <h1 className="text-3xl font-bold text-white mb-2">Analysis Dashboard</h1>
                <p className="text-slate-400">Comprehensive insights from your market research</p>
              </div>
              <button
                onClick={() => router.push('/')}
                className="inline-flex items-center gap-2 px-6 py-3 bg-slate-800 hover:bg-slate-700 text-white font-medium rounded-lg transition-all duration-200 border border-slate-700/50 hover:border-slate-600/50"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
                New Analysis
              </button>
            </div>
            <div className="h-px bg-gradient-to-r from-blue-500/20 via-purple-500/20 to-transparent"></div>
          </div>

          <div className="space-y-6">
            
            <div className="bg-slate-800/30 backdrop-blur-xl rounded-2xl border border-slate-700/30 overflow-hidden">
              <button
                onClick={() => toggleAccordion('analytics')}
                className="w-full bg-gradient-to-r from-slate-800/50 to-slate-700/30 px-8 py-6 border-b border-slate-700/30 hover:from-slate-800/70 hover:to-slate-700/50 transition-all duration-200"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-blue-500 to-cyan-600 flex items-center justify-center">
                      <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                      </svg>
                    </div>
                    <div className="text-left">
                      <h2 className="text-xl font-semibold text-white">BigQuery Analytics</h2>
                      <p className="text-slate-400 text-sm">Data-driven market insights</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-slate-400 text-sm">
                      {(analysisResult.bigquery_metrics || []).length} metrics
                    </span>
                    <svg 
                      className={`w-5 h-5 text-slate-400 transition-transform duration-200 ${accordionState.analytics ? 'rotate-180' : ''}`} 
                      fill="none" 
                      stroke="currentColor" 
                      viewBox="0 0 24 24"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </div>
                </div>
              </button>
              
              <div className={`transition-all duration-300 ease-in-out ${accordionState.analytics ? 'max-h-[2000px] opacity-100' : 'max-h-0 opacity-0 overflow-hidden'}`}>
                <div className="p-6">
                  <MetricsDisplay
                    title="BigQuery Analytics"
                    subtitle="Data-driven market insights"
                    metrics={analysisResult.bigquery_metrics || []}
                    type="analytics"
                    isAccordion={true}
                  />
                </div>
              </div>
            </div>

            <div className="bg-slate-800/30 backdrop-blur-xl rounded-2xl border border-slate-700/30 overflow-hidden">
              <button
                onClick={() => toggleAccordion('insights')}
                className="w-full bg-gradient-to-r from-slate-800/50 to-slate-700/30 px-8 py-6 border-b border-slate-700/30 hover:from-slate-800/70 hover:to-slate-700/50 transition-all duration-200"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-emerald-500 to-green-600 flex items-center justify-center">
                      <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                      </svg>
                    </div>
                    <div className="text-left">
                      <h2 className="text-xl font-semibold text-white">Market Intelligence</h2>
                      <p className="text-slate-400 text-sm">Strategic market analysis</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-slate-400 text-sm">
                      {(analysisResult.statista_insights || []).length} insights
                    </span>
                    <svg 
                      className={`w-5 h-5 text-slate-400 transition-transform duration-200 ${accordionState.insights ? 'rotate-180' : ''}`} 
                      fill="none" 
                      stroke="currentColor" 
                      viewBox="0 0 24 24"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </div>
                </div>
              </button>
              
              <div className={`transition-all duration-300 ease-in-out ${accordionState.insights ? 'max-h-[2000px] opacity-100' : 'max-h-0 opacity-0 overflow-hidden'}`}>
                <div className="p-6">
                  <MetricsDisplay
                    title="Market Intelligence"
                    subtitle="Strategic market analysis"
                    metrics={analysisResult.statista_insights || []}
                    type="insights"
                    isAccordion={true}
                  />
                </div>
              </div>
            </div>

            <div className="bg-slate-800/30 backdrop-blur-xl rounded-2xl border border-slate-700/30 overflow-hidden">
              <button
                onClick={() => toggleAccordion('summary')}
                className="w-full bg-gradient-to-r from-slate-800/50 to-slate-700/30 px-8 py-6 border-b border-slate-700/30 hover:from-slate-800/70 hover:to-slate-700/50 transition-all duration-200"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-purple-500 to-indigo-600 flex items-center justify-center">
                      <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                      </svg>
                    </div>
                    <div className="text-left">
                      <h2 className="text-xl font-semibold text-white">AI Analysis Summary</h2>
                      <p className="text-slate-400 text-sm">Comprehensive market research findings</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-slate-400 text-sm">Complete analysis</span>
                    <svg 
                      className={`w-5 h-5 text-slate-400 transition-transform duration-200 ${accordionState.summary ? 'rotate-180' : ''}`} 
                      fill="none" 
                      stroke="currentColor" 
                      viewBox="0 0 24 24"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </div>
                </div>
              </button>
              
              <div className={`transition-all duration-300 ease-in-out ${accordionState.summary ? 'max-h-[3000px] opacity-100' : 'max-h-0 opacity-0 overflow-hidden'}`}>
                <div className="p-8">
                  <div 
                    className="leading-relaxed space-y-4"
                    dangerouslySetInnerHTML={{ __html: formatSummary(analysisResult.summary) }}
                  />
                  
                  <div className="mt-8 pt-6 border-t border-slate-700/30 flex items-center justify-between">
                    <div className="flex items-center gap-2 text-slate-400 text-sm">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      Analysis completed: {new Date(analysisResult.timestamp).toLocaleString()}
                    </div>
                    <div className="flex items-center gap-1">
                      <div className="w-2 h-2 rounded-full bg-green-500"></div>
                      <span className="text-green-400 text-sm font-medium">Complete</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </PageLayout>
  );
} 