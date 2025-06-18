import { AnalysisResults as Results } from '../../types';
import Card from '../ui/Card';
import Button from '../ui/Button';

interface AnalysisResultsProps {
  results: Results;
  onGenerateReport: () => void;
}

const MetricCard = ({ title, value, subtitle, trend, icon }: { 
  title: string; 
  value: string; 
  subtitle?: string; 
  trend?: 'up' | 'down' | 'neutral';
  icon: string;
}) => (
  <div className="group relative bg-gradient-to-br from-neutral-900/40 to-neutral-800/20 backdrop-blur-xl border border-neutral-700/30 rounded-2xl p-6 hover:border-neutral-600/50 transition-all duration-300 hover:shadow-2xl hover:shadow-neutral-900/20">
    <div className="flex items-start justify-between mb-4">
      <div className="flex items-center space-x-3">
        <div className="w-10 h-10 bg-gradient-to-br from-teal-500/20 to-cyan-500/20 rounded-xl flex items-center justify-center border border-teal-500/30">
          <span className="text-teal-400 text-lg">{icon}</span>
        </div>
        <span className="text-neutral-400 text-sm font-medium">{title}</span>
      </div>
      {trend && (
        <div className={`flex items-center space-x-1 px-2 py-1 rounded-lg text-xs font-medium ${
          trend === 'up' ? 'bg-emerald-500/20 text-emerald-400' :
          trend === 'down' ? 'bg-red-500/20 text-red-400' :
          'bg-neutral-500/20 text-neutral-400'
        }`}>
          <span>{trend === 'up' ? '↗' : trend === 'down' ? '↘' : '→'}</span>
        </div>
      )}
    </div>
    <div className="mb-2">
      <span className="text-2xl font-semibold text-neutral-100 tracking-tight">{value}</span>
    </div>
    {subtitle && (
      <p className="text-neutral-400 text-sm leading-relaxed">{subtitle}</p>
    )}
  </div>
);

const TagList = ({ tags, variant = 'default' }: { tags: string[]; variant?: 'default' | 'highlight' }) => (
  <div className="flex flex-wrap gap-2">
    {tags.map((tag, index) => (
      <span 
        key={index} 
        className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all duration-200 hover:scale-105 ${
          variant === 'highlight' 
            ? 'bg-gradient-to-r from-teal-500/20 to-cyan-500/20 text-teal-300 border border-teal-500/30 hover:border-teal-400/50' 
            : 'bg-neutral-800/40 text-neutral-300 border border-neutral-700/40 hover:border-neutral-600/60'
        }`}
      >
        {tag}
      </span>
    ))}
  </div>
);

const SectionCard = ({ title, icon, children, className = '' }: {
  title: string;
  icon: string;
  children: React.ReactNode;
  className?: string;
}) => (
  <Card variant="glass" className={`p-8 hover:border-neutral-600/40 transition-all duration-300 ${className}`}>
    <div className="flex items-center space-x-3 mb-6">
      <div className="w-12 h-12 bg-gradient-to-br from-neutral-800/60 to-neutral-700/40 rounded-2xl flex items-center justify-center border border-neutral-600/40">
        <span className="text-neutral-300 text-xl">{icon}</span>
      </div>
      <h3 className="text-xl font-semibold text-neutral-100 tracking-tight">{title}</h3>
    </div>
    {children}
  </Card>
);

export default function AnalysisResults({ results, onGenerateReport }: AnalysisResultsProps) {
  return (
    <div className="relative z-10 max-w-7xl mx-auto px-6 py-12">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold bg-gradient-to-r from-neutral-100 to-neutral-300 bg-clip-text text-transparent mb-4">
          Business Analysis Results
        </h1>
        <p className="text-neutral-400 text-lg max-w-2xl mx-auto leading-relaxed">
          Comprehensive insights derived from market intelligence and data analysis
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
        <MetricCard
          title="Industry Classification"
          value={results.parsing.industry}
          icon="🏢"
          trend="neutral"
        />
        <MetricCard
          title="Business Model"
          value={results.parsing.businessModel}
          icon="💼"
          trend="neutral"
        />
        <MetricCard
          title="Growth Rate"
          value={`+${results.market.growthRate}%`}
          subtitle="Annual market growth"
          icon="📈"
          trend="up"
        />
        <MetricCard
          title="Confidence Score"
          value={`${results.parsing.confidence}%`}
          subtitle="Analysis accuracy"
          icon="🎯"
          trend={results.parsing.confidence > 80 ? 'up' : 'neutral'}
        />
      </div>

      <div className="grid lg:grid-cols-2 gap-8 mb-12">
        <SectionCard title="Market Intelligence" icon="🌍">
          <div className="space-y-6">
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-neutral-900/30 rounded-xl p-4 border border-neutral-700/30">
                <span className="text-neutral-400 text-sm block mb-1">Market Size</span>
                <span className="text-neutral-100 font-semibold text-lg">{results.market.marketSize}</span>
              </div>
              <div className="bg-neutral-900/30 rounded-xl p-4 border border-neutral-700/30">
                <span className="text-neutral-400 text-sm block mb-1">Competition Level</span>
                <span className="text-neutral-100 font-semibold text-lg">{results.market.competition}</span>
              </div>
            </div>
            <div>
              <h4 className="text-neutral-300 font-medium mb-3">Market Trends</h4>
              <TagList tags={results.market.trends} variant="highlight" />
            </div>
          </div>
        </SectionCard>

        <SectionCard title="Audience Insights" icon="👥">
          <div className="space-y-6">
            <div className="bg-gradient-to-r from-neutral-900/40 to-neutral-800/20 rounded-xl p-4 border border-neutral-700/30">
              <h4 className="text-neutral-300 font-medium mb-2">Demographics</h4>
              <p className="text-neutral-200 text-sm leading-relaxed">{results.audience.demographics}</p>
            </div>
            <div>
              <h4 className="text-neutral-300 font-medium mb-3">Key Behaviors</h4>
              <div className="space-y-2">
                {results.audience.behaviors.map((behavior, index) => (
                  <div key={index} className="flex items-start space-x-3 p-3 rounded-xl bg-neutral-900/20 border border-neutral-700/20">
                    <div className="w-2 h-2 bg-teal-400 rounded-full mt-2 flex-shrink-0"></div>
                    <span className="text-neutral-300 text-sm leading-relaxed">{behavior}</span>
                  </div>
                ))}
              </div>
            </div>
            <div>
              <h4 className="text-neutral-300 font-medium mb-3">Audience Segments</h4>
              <TagList tags={results.audience.segments} />
            </div>
          </div>
        </SectionCard>
      </div>

      <SectionCard title="Risk Assessment" icon="⚠️" className="mb-12">
        <div className="grid md:grid-cols-2 gap-8">
          <div>
            <div className="mb-6">
                             <div className={`inline-flex items-center px-4 py-2 rounded-xl text-sm font-medium ${
                 results.risks.level === 'Low' ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30' :
                 results.risks.level === 'Medium' ? 'bg-yellow-500/20 text-yellow-400 border border-yellow-500/30' :
                 'bg-red-500/20 text-red-400 border border-red-500/30'
               }`}>
                 <span className={`w-2 h-2 rounded-full mr-2 ${
                   results.risks.level === 'Low' ? 'bg-emerald-400' :
                   results.risks.level === 'Medium' ? 'bg-yellow-400' :
                   'bg-red-400'
                 }`}></span>
                {results.risks.level} Risk Level
              </div>
            </div>
            <div>
              <h4 className="text-neutral-300 font-medium mb-4">Risk Factors</h4>
              <div className="space-y-3">
                {results.risks.factors.map((factor, index) => (
                  <div key={index} className="flex items-start space-x-3 p-3 rounded-xl bg-red-500/5 border border-red-500/20">
                    <div className="w-2 h-2 bg-red-400 rounded-full mt-2 flex-shrink-0"></div>
                    <span className="text-neutral-300 text-sm leading-relaxed">{factor}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
          <div>
            <h4 className="text-neutral-300 font-medium mb-4">Mitigation Strategies</h4>
            <div className="space-y-3">
              {results.risks.mitigations.map((mitigation, index) => (
                <div key={index} className="flex items-start space-x-3 p-3 rounded-xl bg-emerald-500/5 border border-emerald-500/20">
                  <div className="w-2 h-2 bg-emerald-400 rounded-full mt-2 flex-shrink-0"></div>
                  <span className="text-neutral-300 text-sm leading-relaxed">{mitigation}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </SectionCard>

      <div className="text-center">
        <Button
          onClick={onGenerateReport}
          size="lg"
          className="px-12 py-4 bg-gradient-to-r from-teal-500 to-cyan-500 hover:from-teal-600 hover:to-cyan-600 text-white font-semibold rounded-2xl shadow-2xl hover:shadow-teal-500/25 transition-all duration-300 transform hover:scale-105"
        >
          Generate Full Report
        </Button>
      </div>
    </div>
  );
} 