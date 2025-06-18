import { MetricData } from '../../types/analysis';

interface MetricsDisplayProps {
  title: string;
  subtitle: string;
  metrics: MetricData[];
  type: 'analytics' | 'insights';
  isAccordion?: boolean;
}

export default function MetricsDisplay({ title, subtitle, metrics, type, isAccordion = false }: MetricsDisplayProps) {
  const getTypeConfig = (type: 'analytics' | 'insights') => {
    switch (type) {
      case 'analytics':
        return {
          icon: (
            <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
            </svg>
          ),
          gradient: 'from-blue-500 to-cyan-600',
          bgGradient: 'from-blue-500/10 to-cyan-600/10',
          border: 'border-blue-500/20'
        };
      case 'insights':
        return {
          icon: (
            <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
            </svg>
          ),
          gradient: 'from-emerald-500 to-green-600',
          bgGradient: 'from-emerald-500/10 to-green-600/10',
          border: 'border-emerald-500/20'
        };
    }
  };

  const config = getTypeConfig(type);

  if (!metrics || metrics.length === 0) {
    if (isAccordion) {
      return (
        <div className="flex items-center justify-center h-24 text-slate-400">
          <div className="text-center">
            <svg className="w-8 h-8 mx-auto mb-2 opacity-50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
            </svg>
            <p className="text-sm">No data available</p>
          </div>
        </div>
      );
    }

    return (
      <div className={`bg-gradient-to-br ${config.bgGradient} backdrop-blur-xl rounded-2xl border ${config.border} overflow-hidden`}>
        <div className="bg-gradient-to-r from-slate-800/50 to-slate-700/30 px-6 py-4 border-b border-slate-700/30">
          <div className="flex items-center gap-3">
            <div className={`w-8 h-8 rounded-lg bg-gradient-to-br ${config.gradient} flex items-center justify-center`}>
              {config.icon}
            </div>
            <div>
              <h3 className="text-lg font-semibold text-white">{title}</h3>
              <p className="text-slate-400 text-sm">{subtitle}</p>
            </div>
          </div>
        </div>
        
        <div className="p-6">
          <div className="flex items-center justify-center h-24 text-slate-400">
            <div className="text-center">
              <svg className="w-8 h-8 mx-auto mb-2 opacity-50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
              </svg>
              <p className="text-sm">No data available</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (isAccordion) {
    return (
      <div className="space-y-4">
        {metrics.map((metric, index) => (
          <div key={index} className="bg-slate-800/40 rounded-xl p-3 border border-slate-700/30 hover:border-slate-600/50 transition-all duration-200">
            <div className="flex justify-between items-start mb-3">
              <h4 className="font-medium text-neutral-200 text-base">{metric.metric_name}</h4>
              <span className="text-slate-400 text-xs px-2 py-1 bg-slate-700/50 rounded-md">{metric.source_dataset}</span>
            </div>
            
            <div className="flex items-baseline gap-2 mb-4">
              <span className="text-3xl font-bold text-white">
                {typeof metric.value === 'number' ? metric.value.toLocaleString() : metric.value}
              </span>
              {metric.unit && (
                <span className="text-slate-400 text-sm font-medium">{metric.unit}</span>
              )}
            </div>
            
            <p className="text-slate-300 text-sm leading-relaxed">
              {metric.insight_summary}
            </p>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className={`bg-gradient-to-br ${config.bgGradient} backdrop-blur-xl rounded-2xl border ${config.border} overflow-hidden`}>
      <div className="bg-gradient-to-r from-slate-800/50 to-slate-700/30 px-6 py-4 border-b border-slate-700/30">
        <div className="flex items-center gap-3">
          <div className={`w-8 h-8 rounded-lg bg-gradient-to-br ${config.gradient} flex items-center justify-center`}>
            {config.icon}
          </div>
          <div>
            <h3 className="text-lg font-semibold text-white">{title}</h3>
            <p className="text-slate-400 text-sm">{subtitle}</p>
          </div>
        </div>
      </div>
      
      <div className="p-6 space-y-4">
        {metrics.map((metric, index) => (
          <div key={index} className="bg-slate-800/40 rounded-xl p-5 border border-slate-700/30 hover:border-slate-600/50 transition-all duration-200">
            <div className="flex justify-between items-start mb-3">
              <h4 className="font-medium text-white text-base">{metric.metric_name}</h4>
              <span className="text-slate-400 text-xs px-2 py-1 bg-slate-700/50 rounded-md">{metric.source_dataset}</span>
            </div>
            
            <div className="flex items-baseline gap-2 mb-4">
              <span className="text-2xl font-bold text-white">
                {typeof metric.value === 'number' ? metric.value.toLocaleString() : metric.value}
              </span>
              {metric.unit && (
                <span className="text-slate-400 text-sm font-medium">{metric.unit}</span>
              )}
            </div>
            
            <p className="text-slate-300 text-sm leading-relaxed">
              {metric.insight_summary}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
} 