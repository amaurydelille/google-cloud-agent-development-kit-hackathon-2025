import { MetricData } from '../../types/analysis';

interface MetricsDisplayProps {
  title: string;
  metrics: MetricData[];
  icon: string;
  bgColor: string;
}

export default function MetricsDisplay({ title, metrics, icon, bgColor }: MetricsDisplayProps) {
  if (!metrics || metrics.length === 0) {
    return (
      <div className={`${bgColor} rounded-xl p-6 border border-neutral-700/30`}>
        <h3 className="text-xl font-semibold text-white mb-4 flex items-center gap-2">
          <span className="text-2xl">{icon}</span>
          {title}
        </h3>
        <p className="text-neutral-400">No data available</p>
      </div>
    );
  }

  return (
    <div className={`${bgColor} rounded-xl p-6 border border-neutral-700/30`}>
      <h3 className="text-xl font-semibold text-white mb-4 flex items-center gap-2">
        <span className="text-2xl">{icon}</span>
        {title}
      </h3>
      
      <div className="space-y-4">
        {metrics.map((metric, index) => (
          <div key={index} className="bg-black/20 rounded-lg p-4">
            <div className="flex justify-between items-start mb-2">
              <h4 className="font-medium text-white">{metric.metric_name}</h4>
              <span className="text-neutral-400 text-sm">{metric.source_dataset}</span>
            </div>
            
            <div className="flex items-baseline gap-2 mb-3">
              <span className="text-2xl font-bold text-white">
                {typeof metric.value === 'number' ? metric.value.toLocaleString() : metric.value}
              </span>
              {metric.unit && (
                <span className="text-neutral-400 text-sm">{metric.unit}</span>
              )}
            </div>
            
            <p className="text-neutral-300 text-sm leading-relaxed">
              {metric.insight_summary}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
} 