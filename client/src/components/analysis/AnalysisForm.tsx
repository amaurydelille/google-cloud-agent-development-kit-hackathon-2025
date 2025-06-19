import { useState } from 'react';
import { Besley } from 'next/font/google';

const besley = Besley({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

interface AnalysisFormProps {
  onAnalyze: (businessIdea: string) => void;
}

export default function AnalysisForm({ onAnalyze }: AnalysisFormProps) {
  const [businessIdea, setBusinessIdea] = useState('');

  const handleSubmit = () => {
    if (businessIdea.trim()) {
      onAnalyze(businessIdea);
    }
  };

  return (
    <div className="relative z-10 flex-1 flex items-center justify-center px-6">
      <div className="w-full max-w-4xl">
        <div className="text-center mb-5">
          <h2 className={`text-5xl font-medium text-neutral-100 mb-2 tracking-wide ${besley.className}`}>
            VentureScope
          </h2>
          <p className="text-md font-light text-neutral-300 max-w-2xl mx-auto">
            Get comprehensive market analysis, audience insights, and risk assessment powered by advanced AI
          </p>
        </div>

        <div className="flex flex-row gap-4 w-full items-center">
          <div className="relative flex-1">
            <textarea
              value={businessIdea}
              spellCheck={false}
              onChange={(e) => setBusinessIdea(e.target.value)}
              placeholder="Describe your business idea in detail..."
              className="w-full p-6 bg-neutral-800 border border-neutral-700/20 rounded-4xl focus:outline-none focus:ring-1 focus:ring-neutral-500/50 focus:border-neutral-500/50 resize-none text-neutral-100 placeholder-neutral-400 text-lg transition-all duration-300"
              rows={1}
            />
          </div>
          
          <button
            onClick={handleSubmit}
            disabled={!businessIdea.trim()}
            className="cursor-pointer px-8 py-6 bg-teal-600 hover:bg-teal-700 text-white font-medium rounded-3xl transition-all duration-300 hover:shadow-2xl disabled:opacity-50 disabled:cursor-not-allowed whitespace-nowrap"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </div>

        <div className="grid md:grid-cols-3 gap-8 mt-16">
          <div className="text-center group">
            <div className="w-16 h-16 bg-gradient-to-br from-neutral-700/20 to-neutral-800/20 backdrop-blur-xl rounded-2xl flex items-center justify-center mx-auto mb-6 border border-neutral-600/30 group-hover:scale-110 transition-transform duration-300">
              <svg className="w-8 h-8 text-neutral-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
            </div>
            <h3 className="font-medium text-neutral-100 text-lg mb-3">Market Analysis</h3>
            <p className="text-neutral-300">Comprehensive market research and competitive landscape analysis</p>
          </div>
          <div className="text-center group">
            <div className="w-16 h-16 bg-gradient-to-br from-neutral-700/20 to-neutral-800/20 backdrop-blur-xl rounded-2xl flex items-center justify-center mx-auto mb-6 border border-neutral-600/30 group-hover:scale-110 transition-transform duration-300">
              <svg className="w-8 h-8 text-neutral-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
            </div>
            <h3 className="font-medium text-neutral-100 text-lg mb-3">Audience Insights</h3>
            <p className="text-neutral-300">Target audience analysis with demographic and behavioral data</p>
          </div>
          <div className="text-center group">
            <div className="w-16 h-16 bg-gradient-to-br from-neutral-700/20 to-neutral-800/20 backdrop-blur-xl rounded-2xl flex items-center justify-center mx-auto mb-6 border border-neutral-600/30 group-hover:scale-110 transition-transform duration-300">
              <svg className="w-8 h-8 text-neutral-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.965-.833-2.732 0L4.268 15.5c-.77.833.192 2.5 1.732 2.5z" />
              </svg>
            </div>
            <h3 className="font-medium text-neutral-100 text-lg mb-3">Risk Assessment</h3>
            <p className="text-neutral-300">Identify potential risks and strategic mitigation approaches</p>
          </div>
        </div>
      </div>
    </div>
  );
} 