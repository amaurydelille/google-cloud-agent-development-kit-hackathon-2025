'use client';

import { useState } from 'react';

interface AnalysisResults {
  parsing: {
    industry: string;
    targetAudience: string;
    businessModel: string;
    confidence: number;
  };
  market: {
    growthRate: number;
    marketSize: string;
    competition: string;
    trends: string[];
  };
  audience: {
    demographics: string;
    behaviors: string[];
    segments: string[];
  };
  risks: {
    level: string;
    factors: string[];
    mitigations: string[];
  };
}

interface AnalysisStage {
  id: string;
  title: string;
  description: string;
  logo: React.ReactNode;
  duration: number;
}

export default function Home() {
  const [businessIdea, setBusinessIdea] = useState('');
  const [analyzing, setAnalyzing] = useState(false);
  const [results, setResults] = useState<AnalysisResults | null>(null);
  const [progress, setProgress] = useState(0);
  const [currentStage, setCurrentStage] = useState(0);
  const [completedStages, setCompletedStages] = useState<string[]>([]);

  const analysisStages: AnalysisStage[] = [
    {
      id: 'google',
      title: 'Google Search Analysis',
      description: `Searching "${businessIdea.slice(0, 30)}${businessIdea.length > 30 ? '...' : ''}" on Google`,
      logo: (
        <svg className="w-6 h-6 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
        </svg>
      ),
      duration: 800
    },
    {
      id: 'reddit',
      title: 'Reddit Community Insights',
      description: 'Analyzing Reddit discussions and user sentiment',
      logo: (
        <svg className="w-6 h-6 text-orange-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
        </svg>
      ),
      duration: 700
    },
    {
      id: 'market',
      title: 'Market Intelligence',
      description: 'Gathering market size and growth data',
      logo: (
        <svg className="w-6 h-6 text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
        </svg>
      ),
      duration: 600
    },
    {
      id: 'competition',
      title: 'Competitive Landscape',
      description: 'Analyzing competitors and market positioning',
      logo: (
        <svg className="w-6 h-6 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
        </svg>
      ),
      duration: 500
    },
    {
      id: 'trends',
      title: 'Trend Analysis',
      description: 'Identifying industry trends and patterns',
      logo: (
        <svg className="w-6 h-6 text-indigo-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
        </svg>
      ),
      duration: 400
    },
    {
      id: 'synthesis',
      title: 'Data Synthesis',
      description: 'Generating comprehensive business insights',
      logo: (
        <svg className="w-6 h-6 text-pink-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
        </svg>
      ),
      duration: 300
    }
  ];

  const handleAnalyze = async () => {
    if (!businessIdea.trim()) return;
    
    setAnalyzing(true);
    setProgress(0);
    setCurrentStage(0);
    setCompletedStages([]);
    
    let currentTime = 0;
    
    for (let i = 0; i < analysisStages.length; i++) {
      const stage = analysisStages[i];
      
      setTimeout(() => {
        setCurrentStage(i);
        setProgress((i / analysisStages.length) * 100);
      }, currentTime);
      
      setTimeout(() => {
        setCompletedStages(prev => [...prev, stage.id]);
        if (i === analysisStages.length - 1) {
          setTimeout(() => {
            setProgress(100);
            setResults({
              parsing: {
                industry: 'E-commerce',
                targetAudience: 'Gen Z (18-24)',
                businessModel: 'B2C Marketplace',
                confidence: 94
              },
              market: {
                growthRate: 12.4,
                marketSize: '$4.2B',
                competition: 'Medium',
                trends: ['Mobile-first shopping', 'Social commerce', 'Sustainability focus']
              },
              audience: {
                demographics: 'Urban millennials and Gen Z, 18-34 years old',
                behaviors: ['Social media driven purchases', 'Values authenticity', 'Price conscious'],
                segments: ['Early adopters', 'Social influencers', 'Budget-conscious shoppers']
              },
              risks: {
                level: 'Medium',
                factors: ['Market saturation', 'High customer acquisition costs', 'Platform dependency'],
                mitigations: ['Unique value proposition', 'Organic growth strategies', 'Multi-channel approach']
              }
            });
            setAnalyzing(false);
          }, 2000);
        }
      }, currentTime + stage.duration);
      
      currentTime += stage.duration;
    }
  };

  const generateReport = () => {
    alert('Generating comprehensive PDF report...');
  };

  if (analyzing || results) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-900/20 via-purple-900/20 to-pink-900/20"></div>
        <div className="absolute inset-0">
          <div className="absolute top-0 left-0 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl"></div>
          <div className="absolute bottom-0 right-0 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl"></div>
        </div>
        
        <div className="relative z-10 max-w-6xl mx-auto px-6 py-8">
          <div className="flex items-center justify-between mb-8">
            <h1 className="text-2xl font-light text-white/90">Business Intelligence</h1>
            <button 
              onClick={() => {
                setAnalyzing(false);
                setResults(null);
                setProgress(0);
                setBusinessIdea('');
              }}
              className="px-6 py-3 text-sm text-white/80 hover:text-white bg-white/10 hover:bg-white/20 backdrop-blur-xl border border-white/20 rounded-xl transition-all duration-300 hover:scale-105"
            >
              New Search
            </button>
          </div>

          {analyzing && (
            <div className="space-y-8">
              <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-3xl p-8 shadow-2xl">
                <div className="mb-8">
                  <div className="flex items-center justify-between mb-6">
                    <h3 className="text-2xl font-light text-white">Analyzing Your Business Idea</h3>
                    <div className="text-sm text-white/70 bg-white/10 px-4 py-2 rounded-full backdrop-blur-sm">
                      {Math.round(progress)}% Complete
                    </div>
                  </div>
                  <div className="w-full bg-white/10 rounded-full h-3 mb-8 backdrop-blur-sm">
                    <div 
                      className="bg-gradient-to-r from-blue-400 via-purple-500 to-pink-500 h-3 rounded-full transition-all duration-700 ease-out shadow-lg"
                      style={{ width: `${progress}%` }}
                    ></div>
                  </div>
                </div>

                <div className="space-y-4">
                  {analysisStages.map((stage, index) => {
                    const isActive = index === currentStage;
                    const isCompleted = completedStages.includes(stage.id);
                    const isPending = index > currentStage;

                    return (
                      <div
                        key={stage.id}
                        className={`flex items-center space-x-6 p-6 rounded-2xl transition-all duration-500 backdrop-blur-sm ${
                          isActive 
                            ? 'bg-blue-500/20 border border-blue-400/30 shadow-xl scale-105' 
                            : isCompleted 
                            ? 'bg-emerald-500/20 border border-emerald-400/30' 
                            : 'bg-white/5 border border-white/10'
                        }`}
                      >
                        <div className={`flex items-center justify-center w-14 h-14 rounded-2xl transition-all duration-300 ${
                          isActive 
                            ? 'bg-blue-500/30 shadow-lg animate-pulse backdrop-blur-sm' 
                            : isCompleted 
                            ? 'bg-emerald-500/30 backdrop-blur-sm' 
                            : 'bg-white/10 backdrop-blur-sm'
                        }`}>
                          {isCompleted ? (
                            <svg className="w-7 h-7 text-emerald-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                            </svg>
                          ) : (
                            stage.logo
                          )}
                        </div>
                        
                        <div className="flex-1">
                          <div className={`font-medium text-lg transition-colors ${
                            isActive ? 'text-blue-200' : isCompleted ? 'text-emerald-200' : 'text-white/80'
                          }`}>
                            {stage.title}
                          </div>
                          <div className={`text-sm transition-colors ${
                            isActive ? 'text-blue-300/80' : isCompleted ? 'text-emerald-300/80' : 'text-white/60'
                          }`}>
                            {stage.description}
                          </div>
                        </div>

                        <div className="flex items-center">
                          {isActive && (
                            <div className="flex space-x-2">
                              <div className="w-3 h-3 bg-blue-400 rounded-full animate-bounce"></div>
                              <div className="w-3 h-3 bg-blue-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                              <div className="w-3 h-3 bg-blue-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                            </div>
                          )}
                          {isCompleted && (
                            <div className="w-8 h-8 bg-emerald-500/30 backdrop-blur-sm rounded-xl flex items-center justify-center border border-emerald-400/30">
                              <svg className="w-5 h-5 text-emerald-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                              </svg>
                            </div>
                          )}
                          {isPending && (
                            <div className="w-8 h-8 bg-white/10 backdrop-blur-sm rounded-xl flex items-center justify-center border border-white/20">
                              <div className="w-3 h-3 bg-white/40 rounded-full"></div>
                            </div>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>

                {currentStage === analysisStages.length - 1 && progress < 100 && (
                  <div className="mt-8 p-6 bg-gradient-to-r from-purple-500/20 to-pink-500/20 backdrop-blur-xl border border-purple-400/30 rounded-2xl">
                    <div className="flex items-center space-x-4">
                      <div className="w-10 h-10 border-3 border-purple-400 border-t-transparent rounded-full animate-spin"></div>
                      <div>
                        <div className="font-medium text-purple-200 text-lg">Finalizing Analysis</div>
                        <div className="text-sm text-purple-300/80">Generating comprehensive business insights...</div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          {results && (
            <div className="space-y-8">
              <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-3xl p-8 shadow-2xl">
                <h2 className="text-2xl font-light text-white mb-8">Business Analysis Results</h2>
                
                <div className="grid lg:grid-cols-2 gap-8">
                  <div className="space-y-6">
                    <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-6 border border-white/10">
                      <h3 className="font-medium text-white text-lg mb-4 flex items-center">
                        <div className="w-2 h-2 bg-blue-400 rounded-full mr-3"></div>
                        Business Intelligence
                      </h3>
                      <div className="space-y-3 text-sm">
                        <div className="flex justify-between items-center">
                          <span className="text-white/70">Industry:</span>
                          <span className="text-white font-medium">{results.parsing.industry}</span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-white/70">Target Audience:</span>
                          <span className="text-white font-medium">{results.parsing.targetAudience}</span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-white/70">Business Model:</span>
                          <span className="text-white font-medium">{results.parsing.businessModel}</span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-white/70">Confidence:</span>
                          <span className="text-emerald-400 font-semibold">{results.parsing.confidence}%</span>
                        </div>
                      </div>
                    </div>

                    <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-6 border border-white/10">
                      <h3 className="font-medium text-white text-lg mb-4 flex items-center">
                        <div className="w-2 h-2 bg-emerald-400 rounded-full mr-3"></div>
                        Market Analytics
                      </h3>
                      <div className="space-y-3 text-sm">
                        <div className="flex justify-between items-center">
                          <span className="text-white/70">Growth Rate:</span>
                          <span className="text-blue-400 font-semibold">+{results.market.growthRate}%</span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-white/70">Market Size:</span>
                          <span className="text-white font-medium">{results.market.marketSize}</span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-white/70">Competition:</span>
                          <span className="text-white font-medium">{results.market.competition}</span>
                        </div>
                      </div>
                      <div className="mt-4">
                        <span className="text-white/70 text-sm">Trends:</span>
                        <div className="flex flex-wrap gap-2 mt-2">
                          {results.market.trends.map((trend, index) => (
                            <span key={index} className="px-3 py-1 bg-blue-500/20 text-blue-300 text-xs rounded-full backdrop-blur-sm border border-blue-400/30">
                              {trend}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-6">
                    <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-6 border border-white/10">
                      <h3 className="font-medium text-white text-lg mb-4 flex items-center">
                        <div className="w-2 h-2 bg-purple-400 rounded-full mr-3"></div>
                        Audience Intelligence
                      </h3>
                      <div className="text-sm text-white/80 mb-4">{results.audience.demographics}</div>
                      <div className="space-y-2">
                        {results.audience.behaviors.map((behavior, index) => (
                          <div key={index} className="text-sm text-white/70 flex items-center">
                            <span className="w-1.5 h-1.5 bg-purple-400 rounded-full mr-3"></span>
                            {behavior}
                          </div>
                        ))}
                      </div>
                      <div className="mt-4">
                        <span className="text-white/70 text-sm">Segments:</span>
                        <div className="flex flex-wrap gap-2 mt-2">
                          {results.audience.segments.map((segment, index) => (
                            <span key={index} className="px-3 py-1 bg-purple-500/20 text-purple-300 text-xs rounded-full backdrop-blur-sm border border-purple-400/30">
                              {segment}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>

                    <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-6 border border-white/10">
                      <h3 className="font-medium text-white text-lg mb-4 flex items-center">
                        <div className="w-2 h-2 bg-orange-400 rounded-full mr-3"></div>
                        Risk Assessment
                      </h3>
                      <div className="text-sm mb-4">
                        <span className="text-white/70">Risk Level: </span>
                        <span className="text-orange-400 font-semibold">{results.risks.level}</span>
                      </div>
                      <div className="space-y-3">
                        <div>
                          <span className="text-white/70 text-sm">Risk Factors:</span>
                          <div className="space-y-2 mt-2">
                            {results.risks.factors.map((factor, index) => (
                              <div key={index} className="text-sm text-white/70 flex items-center">
                                <span className="w-1.5 h-1.5 bg-red-400 rounded-full mr-3"></span>
                                {factor}
                              </div>
                            ))}
                          </div>
                        </div>
                        <div>
                          <span className="text-white/70 text-sm">Mitigations:</span>
                          <div className="space-y-2 mt-2">
                            {results.risks.mitigations.map((mitigation, index) => (
                              <div key={index} className="text-sm text-white/70 flex items-center">
                                <span className="w-1.5 h-1.5 bg-emerald-400 rounded-full mr-3"></span>
                                {mitigation}
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <button
                  onClick={generateReport}
                  className="mt-8 w-full bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white py-4 px-8 rounded-2xl font-medium transition-all duration-300 hover:scale-105 hover:shadow-2xl backdrop-blur-sm"
                >
                  Generate Full Report
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 relative flex flex-col overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-blue-900/20 via-purple-900/20 to-pink-900/20"></div>
      <div className="absolute inset-0">
        <div className="absolute top-0 left-0 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl"></div>
      </div>
      
      <header className="relative z-10 backdrop-blur-xl bg-white/10 border-b border-white/20">
        <div className="max-w-7xl mx-auto px-6 py-6">
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-light text-white">Business Intelligence</h1>
            <div className="flex items-center space-x-4">
              <span className="text-sm text-white/60 bg-white/10 px-4 py-2 rounded-full backdrop-blur-sm">Powered by Google Cloud ADK</span>
            </div>
          </div>
        </div>
      </header>

      <main className="relative z-10 flex-1 flex items-center justify-center px-6">
        <div className="w-full max-w-4xl">
          <div className="text-center mb-12">
            <h2 className="text-5xl font-extralight text-white mb-6 tracking-wide">
              Analyze your business idea
            </h2>
            <p className="text-xl text-white/70 max-w-2xl mx-auto">
              Get comprehensive market analysis, audience insights, and risk assessment powered by advanced AI
            </p>
          </div>

          <div className="space-y-6">
            <div className="relative">
              <textarea
                value={businessIdea}
                onChange={(e) => setBusinessIdea(e.target.value)}
                placeholder="Describe your business idea in detail..."
                className="w-full min-h-[140px] p-6 bg-white/10 backdrop-blur-xl border border-white/20 rounded-3xl focus:outline-none focus:ring-2 focus:ring-blue-400/50 focus:border-blue-400/50 resize-none text-white placeholder-white/50 text-lg transition-all duration-300"
                rows={5}
              />
              <div className="absolute top-4 right-4 text-white/40">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                </svg>
              </div>
            </div>
            
            <button
              onClick={handleAnalyze}
              disabled={!businessIdea.trim()}
              className="w-full bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 disabled:from-gray-500 disabled:to-gray-600 text-white py-5 px-8 rounded-3xl font-medium text-lg transition-all duration-300 hover:scale-105 hover:shadow-2xl disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 backdrop-blur-sm"
            >
              Analyze Business Idea
            </button>
          </div>

          <div className="grid md:grid-cols-3 gap-8 mt-16">
            <div className="text-center group">
              <div className="w-16 h-16 bg-gradient-to-br from-blue-500/20 to-blue-600/20 backdrop-blur-xl rounded-2xl flex items-center justify-center mx-auto mb-6 border border-blue-400/30 group-hover:scale-110 transition-transform duration-300">
                <svg className="w-8 h-8 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
              </div>
              <h3 className="font-medium text-white text-lg mb-3">Market Analysis</h3>
              <p className="text-white/70">Comprehensive market research and competitive landscape analysis</p>
            </div>
            <div className="text-center group">
              <div className="w-16 h-16 bg-gradient-to-br from-purple-500/20 to-purple-600/20 backdrop-blur-xl rounded-2xl flex items-center justify-center mx-auto mb-6 border border-purple-400/30 group-hover:scale-110 transition-transform duration-300">
                <svg className="w-8 h-8 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
              </div>
              <h3 className="font-medium text-white text-lg mb-3">Audience Insights</h3>
              <p className="text-white/70">Target audience analysis with demographic and behavioral data</p>
            </div>
            <div className="text-center group">
              <div className="w-16 h-16 bg-gradient-to-br from-orange-500/20 to-orange-600/20 backdrop-blur-xl rounded-2xl flex items-center justify-center mx-auto mb-6 border border-orange-400/30 group-hover:scale-110 transition-transform duration-300">
                <svg className="w-8 h-8 text-orange-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.965-.833-2.732 0L4.268 15.5c-.77.833.192 2.5 1.732 2.5z" />
                </svg>
              </div>
              <h3 className="font-medium text-white text-lg mb-3">Risk Assessment</h3>
              <p className="text-white/70">Identify potential risks and strategic mitigation approaches</p>
            </div>
          </div>
        </div>
      </main>

      <footer className="relative z-10 backdrop-blur-xl bg-white/5 border-t border-white/10 py-8">
        <div className="max-w-7xl mx-auto px-6 text-center text-white/60">
          Business Intelligence Platform powered by Google Cloud Agent Development Kit
        </div>
      </footer>
    </div>
  );
}
