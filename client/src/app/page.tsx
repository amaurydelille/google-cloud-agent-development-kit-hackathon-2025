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

export default function Home() {
  const [businessIdea, setBusinessIdea] = useState('');
  const [analyzing, setAnalyzing] = useState(false);
  const [results, setResults] = useState<AnalysisResults | null>(null);
  const [activeTab, setActiveTab] = useState('input');
  const [progress, setProgress] = useState(0);

  const handleAnalyze = async () => {
    if (!businessIdea.trim()) return;
    
    setAnalyzing(true);
    setProgress(0);
    setActiveTab('analysis');
    
    const progressInterval = setInterval(() => {
      setProgress(prev => {
        if (prev >= 90) {
          clearInterval(progressInterval);
          return 90;
        }
        return prev + 10;
      });
    }, 300);

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
      setActiveTab('results');
      clearInterval(progressInterval);
    }, 3000);
  };

  const generateReport = () => {
    alert('Generating comprehensive PDF report...');
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100">
      <div className="absolute inset-0 bg-gradient-to-br from-slate-900 via-slate-950 to-slate-900"></div>
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(56,189,248,0.03),transparent_50%)]"></div>
      
      <header className="relative border-b border-slate-800/50 bg-slate-950/80 backdrop-blur-xl">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="flex justify-between items-center h-20">
            <div className="flex items-center space-x-4">
              <div className="w-10 h-10 bg-gradient-to-br from-cyan-400 to-blue-600 rounded-lg flex items-center justify-center shadow-lg shadow-cyan-500/20">
                <div className="w-6 h-6 border-2 border-white rounded transform rotate-45"></div>
              </div>
              <div>
                <h1 className="text-2xl font-bold tracking-tight text-slate-100">Business Intelligence Platform</h1>
                <p className="text-xs text-slate-400 uppercase tracking-wider">AI-Powered Analysis Engine</p>
              </div>
            </div>
            <div className="flex items-center space-x-6">
              <div className="px-3 py-1 bg-slate-800/50 border border-slate-700/50 rounded-full">
                <span className="text-xs text-slate-300 uppercase tracking-wider">Google Cloud ADK</span>
              </div>
            </div>
          </div>
        </div>
      </header>

      <main className="relative max-w-7xl mx-auto px-6 lg:px-8 py-12">
        <div className="mb-12">
          <nav className="flex space-x-2 bg-slate-900/50 p-2 rounded-xl border border-slate-800/50 backdrop-blur-sm">
            {[
              { id: 'input', label: 'Input Analysis', sublabel: 'Business Idea Processing' },
              { id: 'analysis', label: 'Processing', sublabel: 'Agent Execution' },
              { id: 'results', label: 'Intelligence', sublabel: 'Strategic Insights' }
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex-1 px-6 py-4 rounded-lg font-medium transition-all duration-200 ${
                  activeTab === tab.id
                    ? 'bg-slate-800 text-slate-100 border border-slate-700/50 shadow-lg'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/30'
                }`}
              >
                <div className="text-left">
                  <div className="text-sm font-semibold">{tab.label}</div>
                  <div className="text-xs text-slate-500 mt-1">{tab.sublabel}</div>
                </div>
              </button>
            ))}
          </nav>
        </div>

        {activeTab === 'input' && (
          <div className="max-w-5xl mx-auto space-y-12">
            <div className="text-center space-y-6">
              <h2 className="text-4xl font-bold text-slate-100 tracking-tight">
                Enterprise Business Validation
              </h2>
              <p className="text-xl text-slate-400 max-w-3xl mx-auto leading-relaxed">
                Advanced AI-driven market intelligence and strategic analysis for data-driven business decisions
              </p>
            </div>

            <div className="bg-slate-900/50 border border-slate-800/50 rounded-2xl p-8 backdrop-blur-sm">
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-semibold text-slate-300 mb-3 uppercase tracking-wider">
                    Business Concept Description
                  </label>
                  <textarea
                    value={businessIdea}
                    onChange={(e) => setBusinessIdea(e.target.value)}
                    placeholder="Provide a comprehensive description of your business concept, including target market, value proposition, business model, and competitive advantages..."
                    className="w-full h-40 px-6 py-4 bg-slate-800/50 border border-slate-700/50 rounded-xl text-slate-100 placeholder-slate-500 focus:ring-2 focus:ring-cyan-500/50 focus:border-cyan-500/50 resize-none transition-all backdrop-blur-sm"
                    rows={8}
                  />
                </div>

                <div className="flex flex-col sm:flex-row gap-4">
                  <button
                    onClick={handleAnalyze}
                    disabled={!businessIdea.trim() || analyzing}
                    className="flex-1 bg-gradient-to-r from-cyan-600 to-blue-600 text-white py-4 px-8 rounded-xl font-semibold hover:from-cyan-700 hover:to-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 shadow-lg shadow-cyan-500/20 uppercase tracking-wider text-sm"
                  >
                    {analyzing ? 'Executing Analysis...' : 'Initialize Analysis Protocol'}
                  </button>
                  <button className="px-8 py-4 border border-slate-700/50 rounded-xl text-slate-300 hover:bg-slate-800/50 transition-all duration-200 uppercase tracking-wider text-sm">
                    Load Template
                  </button>
                </div>
              </div>
            </div>

            <div className="grid lg:grid-cols-3 gap-8">
              <div className="bg-slate-900/30 border border-slate-800/30 p-8 rounded-2xl backdrop-blur-sm">
                <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-lg mb-6 flex items-center justify-center">
                  <div className="w-6 h-6 border-2 border-white rounded-sm"></div>
                </div>
                <h3 className="font-bold text-slate-100 mb-3 text-lg">Market Intelligence</h3>
                <p className="text-slate-400 text-sm leading-relaxed">Advanced market analysis with competitive landscape mapping and growth trajectory modeling</p>
              </div>
              <div className="bg-slate-900/30 border border-slate-800/30 p-8 rounded-2xl backdrop-blur-sm">
                <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-blue-500 rounded-lg mb-6 flex items-center justify-center">
                  <div className="w-6 h-6 border-2 border-white rounded-full"></div>
                </div>
                <h3 className="font-bold text-slate-100 mb-3 text-lg">Audience Analytics</h3>
                <p className="text-slate-400 text-sm leading-relaxed">Precision customer segmentation with behavioral profiling and demographic intelligence</p>
              </div>
              <div className="bg-slate-900/30 border border-slate-800/30 p-8 rounded-2xl backdrop-blur-sm">
                <div className="w-12 h-12 bg-gradient-to-br from-amber-500 to-orange-500 rounded-lg mb-6 flex items-center justify-center">
                  <div className="w-6 h-6 border-2 border-white rounded transform rotate-45"></div>
                </div>
                <h3 className="font-bold text-slate-100 mb-3 text-lg">Risk Assessment</h3>
                <p className="text-slate-400 text-sm leading-relaxed">Comprehensive risk evaluation with mitigation strategies and contingency planning</p>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'analysis' && (
          <div className="max-w-5xl mx-auto">
            <div className="bg-slate-900/50 border border-slate-800/50 rounded-2xl p-12 backdrop-blur-sm">
              <div className="text-center space-y-8 mb-12">
                <h2 className="text-3xl font-bold text-slate-100">
                  Analysis Protocol Executing
                </h2>
                <p className="text-slate-400 text-lg">
                  Multi-agent AI system processing strategic intelligence
                </p>
              </div>

              <div className="space-y-8">
                <div className="space-y-3">
                  <div className="flex justify-between text-sm text-slate-400 uppercase tracking-wider">
                    <span>System Progress</span>
                    <span>{progress}% Complete</span>
                  </div>
                  <div className="w-full h-1 bg-slate-800 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-gradient-to-r from-cyan-500 to-blue-500 transition-all duration-300 ease-out rounded-full"
                      style={{ width: `${progress}%` }}
                    ></div>
                  </div>
                </div>

                <div className="grid lg:grid-cols-2 gap-6">
                  {[
                    { agent: 'Parsing Protocol', status: progress > 20 ? 'complete' : 'active', task: 'Structuring business intelligence data' },
                    { agent: 'Market Analysis Engine', status: progress > 40 ? 'complete' : progress > 20 ? 'active' : 'standby', task: 'Processing market dynamics and competitive analysis' },
                    { agent: 'Audience Intelligence', status: progress > 60 ? 'complete' : progress > 40 ? 'active' : 'standby', task: 'Generating customer behavioral profiles' },
                    { agent: 'Risk Evaluation System', status: progress > 80 ? 'complete' : progress > 60 ? 'active' : 'standby', task: 'Calculating risk factors and mitigation protocols' }
                  ].map((agent, index) => (
                    <div key={index} className="flex items-center space-x-6 p-6 rounded-xl border border-slate-800/30 bg-slate-800/20">
                      <div className={`w-4 h-4 rounded-full border-2 flex items-center justify-center ${
                        agent.status === 'complete' ? 'border-green-500 bg-green-500' :
                        agent.status === 'active' ? 'border-cyan-500 bg-cyan-500 animate-pulse' : 'border-slate-600'
                      }`}>
                        {agent.status === 'complete' && <div className="w-2 h-2 bg-white rounded-full"></div>}
                      </div>
                      <div className="flex-1">
                        <p className="font-semibold text-slate-200 text-sm uppercase tracking-wider">{agent.agent}</p>
                        <p className="text-xs text-slate-400 mt-1">{agent.task}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'results' && results && (
          <div className="space-y-12">
            <div className="text-center space-y-6">
              <h2 className="text-4xl font-bold text-slate-100">
                Strategic Intelligence Report
              </h2>
              <p className="text-slate-400 text-lg mb-8">
                Comprehensive business analysis with actionable insights
              </p>
              <button
                onClick={generateReport}
                className="bg-gradient-to-r from-emerald-600 to-cyan-600 text-white px-8 py-4 rounded-xl font-semibold hover:from-emerald-700 hover:to-cyan-700 transition-all duration-200 shadow-lg shadow-emerald-500/20 uppercase tracking-wider text-sm"
              >
                Export Intelligence Report
              </button>
            </div>

            <div className="grid lg:grid-cols-2 gap-8">
              <div className="bg-slate-900/50 border border-slate-800/50 rounded-2xl p-8 backdrop-blur-sm">
                <h3 className="text-2xl font-bold text-slate-100 mb-6 flex items-center">
                  <div className="w-2 h-8 bg-gradient-to-b from-cyan-500 to-blue-500 rounded-full mr-4"></div>
                  Business Intelligence
                </h3>
                <div className="space-y-4">
                  {[
                    { label: 'Industry Classification', value: results.parsing.industry, color: 'text-slate-300' },
                    { label: 'Target Market', value: results.parsing.targetAudience, color: 'text-slate-300' },
                    { label: 'Business Architecture', value: results.parsing.businessModel, color: 'text-slate-300' },
                    { label: 'Confidence Index', value: `${results.parsing.confidence}%`, color: 'text-emerald-400' }
                  ].map((item, index) => (
                    <div key={index} className="flex justify-between items-center p-4 bg-slate-800/30 rounded-lg border border-slate-700/30">
                      <span className="text-slate-400 text-sm uppercase tracking-wider">{item.label}</span>
                      <span className={`font-semibold ${item.color}`}>{item.value}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="bg-slate-900/50 border border-slate-800/50 rounded-2xl p-8 backdrop-blur-sm">
                <h3 className="text-2xl font-bold text-slate-100 mb-6 flex items-center">
                  <div className="w-2 h-8 bg-gradient-to-b from-blue-500 to-purple-500 rounded-full mr-4"></div>
                  Market Analytics
                </h3>
                <div className="space-y-4">
                  <div className="flex justify-between items-center p-4 bg-blue-900/20 rounded-lg border border-blue-800/30">
                    <span className="text-slate-400 text-sm uppercase tracking-wider">Growth Projection</span>
                    <span className="font-semibold text-blue-400">+{results.market.growthRate}%</span>
                  </div>
                  <div className="flex justify-between items-center p-4 bg-slate-800/30 rounded-lg border border-slate-700/30">
                    <span className="text-slate-400 text-sm uppercase tracking-wider">Market Valuation</span>
                    <span className="font-semibold text-slate-300">{results.market.marketSize}</span>
                  </div>
                  <div className="flex justify-between items-center p-4 bg-slate-800/30 rounded-lg border border-slate-700/30">
                    <span className="text-slate-400 text-sm uppercase tracking-wider">Competition Density</span>
                    <span className="font-semibold text-slate-300">{results.market.competition}</span>
                  </div>
                  <div className="p-4 bg-slate-800/30 rounded-lg border border-slate-700/30">
                    <p className="text-slate-400 text-sm uppercase tracking-wider mb-3">Market Trends</p>
                    <div className="flex flex-wrap gap-2">
                      {results.market.trends.map((trend, index) => (
                        <span key={index} className="px-3 py-1 bg-blue-900/30 border border-blue-800/30 text-blue-300 text-xs rounded-lg uppercase tracking-wider">
                          {trend}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-slate-900/50 border border-slate-800/50 rounded-2xl p-8 backdrop-blur-sm">
                <h3 className="text-2xl font-bold text-slate-100 mb-6 flex items-center">
                  <div className="w-2 h-8 bg-gradient-to-b from-purple-500 to-pink-500 rounded-full mr-4"></div>
                  Audience Intelligence
                </h3>
                <div className="space-y-4">
                  <div className="p-4 bg-slate-800/30 rounded-lg border border-slate-700/30">
                    <p className="text-slate-400 text-sm uppercase tracking-wider mb-3">Demographics</p>
                    <p className="text-slate-300 text-sm">{results.audience.demographics}</p>
                  </div>
                  <div className="p-4 bg-slate-800/30 rounded-lg border border-slate-700/30">
                    <p className="text-slate-400 text-sm uppercase tracking-wider mb-3">Behavioral Patterns</p>
                    <div className="space-y-2">
                      {results.audience.behaviors.map((behavior, index) => (
                        <p key={index} className="text-slate-300 text-sm flex items-center">
                          <span className="w-1 h-1 bg-slate-500 rounded-full mr-3"></span>
                          {behavior}
                        </p>
                      ))}
                    </div>
                  </div>
                  <div className="p-4 bg-slate-800/30 rounded-lg border border-slate-700/30">
                    <p className="text-slate-400 text-sm uppercase tracking-wider mb-3">Market Segments</p>
                    <div className="flex flex-wrap gap-2">
                      {results.audience.segments.map((segment, index) => (
                        <span key={index} className="px-3 py-1 bg-purple-900/30 border border-purple-800/30 text-purple-300 text-xs rounded-lg uppercase tracking-wider">
                          {segment}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-slate-900/50 border border-slate-800/50 rounded-2xl p-8 backdrop-blur-sm">
                <h3 className="text-2xl font-bold text-slate-100 mb-6 flex items-center">
                  <div className="w-2 h-8 bg-gradient-to-b from-amber-500 to-red-500 rounded-full mr-4"></div>
                  Risk Assessment
                </h3>
                <div className="space-y-4">
                  <div className="flex justify-between items-center p-4 bg-amber-900/20 rounded-lg border border-amber-800/30">
                    <span className="text-slate-400 text-sm uppercase tracking-wider">Risk Classification</span>
                    <span className="font-semibold text-amber-400">{results.risks.level}</span>
                  </div>
                  <div className="p-4 bg-slate-800/30 rounded-lg border border-slate-700/30">
                    <p className="text-slate-400 text-sm uppercase tracking-wider mb-3">Risk Factors</p>
                    <div className="space-y-2">
                      {results.risks.factors.map((factor, index) => (
                        <p key={index} className="text-slate-300 text-sm flex items-center">
                          <span className="w-1 h-1 bg-red-500 rounded-full mr-3"></span>
                          {factor}
                        </p>
                      ))}
                    </div>
                  </div>
                  <div className="p-4 bg-emerald-900/20 rounded-lg border border-emerald-800/30">
                    <p className="text-slate-400 text-sm uppercase tracking-wider mb-3">Mitigation Protocols</p>
                    <div className="space-y-2">
                      {results.risks.mitigations.map((mitigation, index) => (
                        <p key={index} className="text-emerald-300 text-sm flex items-center">
                          <span className="w-1 h-1 bg-emerald-500 rounded-full mr-3"></span>
                          {mitigation}
                        </p>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </main>

      <footer className="relative border-t border-slate-800/50 bg-slate-950/80 backdrop-blur-xl mt-20">
        <div className="max-w-7xl mx-auto px-6 lg:px-8 py-12">
          <div className="text-center text-slate-400">
            <p className="text-sm uppercase tracking-wider">
              Enterprise Business Intelligence Platform • Google Cloud ADK • Advanced AI Architecture
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
