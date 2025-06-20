interface SentimentDisplayProps {
  sentimentScore: number;
  sentimentMagnitude: number;
}

const getSentimentLabel = (score: number): string => {
  if (score >= 0.6) return 'Very Positive';
  if (score >= 0.4) return 'Positive';
  if (score >= 0.0) return 'Neutral';
  if (score >= -0.5) return 'Negative';
  return 'Very Negative';
};

const getSentimentColor = (score: number): string => {
  if (score >= 0.6) return 'from-emerald-500 to-green-600';
  if (score >= 0.4) return 'from-emerald-400 to-emerald-500';
  if (score >= 0.0) return 'from-gray-400 to-gray-500';
  if (score >= -0.5) return 'from-orange-400 to-orange-500';
  return 'from-red-500 to-red-600';
};

const getSentimentTextColor = (score: number): string => {
  if (score >= 0.6) return 'text-emerald-400';
  if (score >= 0.4) return 'text-emerald-300';
  if (score >= 0.0) return 'text-gray-300';
  if (score >= -0.5) return 'text-orange-300';
  return 'text-red-300';
};

const getMagnitudeLabel = (magnitude: number): string => {
  if (magnitude >= 0.6) return 'High Intensity';
  if (magnitude >= 0.3) return 'Medium Intensity';
  return 'Low Intensity';
};

const getSentimentIcon = (score: number): string => {
  if (score >= 0.6) return '😊';
  if (score >= 0.4) return '🙂';
  if (score >= 0.0) return '😐';
  if (score >= -0.5) return '🙁';
  return '😞';
};

const getSentimentInterpretation = (score: number): string => {
  if (score >= 0.6) return 'This suggests generally positive market reception and opportunities.';
  if (score >= 0.4) return 'This indicates potential challenges or negative market conditions to consider.';
  if (score >= 0.0) return 'This represents a balanced or neutral market perspective.';
  if (score >= -0.5) return 'This indicates potential challenges or negative market conditions to consider.';
  return 'This suggests generally positive market reception and opportunities.';
};

export default function SentimentDisplay({ sentimentScore, sentimentMagnitude }: SentimentDisplayProps) {
  const sentimentLabel = getSentimentLabel(sentimentScore);
  const sentimentColor = getSentimentColor(sentimentScore);
  const sentimentTextColor = getSentimentTextColor(sentimentScore);
  const magnitudeLabel = getMagnitudeLabel(sentimentMagnitude);
  const sentimentIcon = getSentimentIcon(sentimentScore);

  return (
    <div className="bg-slate-800/50 backdrop-blur-sm rounded-2xl border border-slate-700/40 p-6 mb-6">
      <div className="flex items-center gap-3 mb-4">
        <div className={`w-10 h-10 rounded-lg bg-gradient-to-br ${sentimentColor} flex items-center justify-center`}>
          <span className="text-lg">{sentimentIcon}</span>
        </div>
        <div>
          <h3 className="text-lg font-semibold text-white">Content Sentiment Analysis</h3>
          <p className="text-slate-400 text-sm">AI-powered emotional tone assessment</p>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="bg-slate-900/40 rounded-xl p-4 border border-slate-700/30">
          <div className="flex items-center justify-between mb-2">
            <span className="text-slate-400 text-sm font-medium">Overall Sentiment</span>
            <span className={`text-xs px-2 py-1 rounded-lg bg-slate-800/60 ${sentimentTextColor}`}>
              {sentimentScore >= 0 ? '+' : ''}{sentimentScore.toFixed(3)}
            </span>
          </div>
          <div className="flex items-center gap-2">
            <span className={`text-lg font-semibold ${sentimentTextColor}`}>
              {sentimentLabel}
            </span>
            {/* <div className="flex-1 bg-slate-700/40 rounded-full h-2 ml-2">
              <div 
                className={`h-full rounded-full bg-gradient-to-r ${sentimentColor} transition-all duration-500`}
                style={{ 
                  width: `${Math.abs(sentimentScore) * 100}%`,
                  marginLeft: sentimentScore < 0 ? `${(1 - Math.abs(sentimentScore)) * 100}%` : '0'
                }}
              />
            </div> */}
          </div>
        </div>
        
        {/* <div className="bg-slate-900/40 rounded-xl p-4 border border-slate-700/30">
          <div className="flex items-center justify-between mb-2">
            <span className="text-slate-400 text-sm font-medium">Confidence Level</span>
            <span className="text-xs px-2 py-1 rounded-lg bg-slate-800/60 text-blue-300">
              {sentimentMagnitude.toFixed(3)}
            </span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-lg font-semibold text-blue-300">
              {magnitudeLabel}
            </span>
            <div className="flex-1 bg-slate-700/40 rounded-full h-2 ml-2">
              <div 
                className="h-full rounded-full bg-gradient-to-r from-blue-400 to-blue-500 transition-all duration-500"
                style={{ width: `${sentimentMagnitude * 100}%` }}
              />
            </div>
          </div>
        </div> */}
      </div>
      
      <div className="mt-4 p-3 bg-slate-900/30 rounded-lg border border-slate-700/20">
        <p className="text-slate-300 text-sm leading-relaxed">
          <span className="font-medium">Interpretation:</span>{' '}
          The content has a <span className={sentimentTextColor}>{sentimentLabel.toLowerCase()}</span> tone
          {' '}with <span className="text-blue-300">{magnitudeLabel.toLowerCase()}</span>. 
          {' '}{getSentimentInterpretation(sentimentScore)}
        </p>
      </div>
    </div>
  );
} 