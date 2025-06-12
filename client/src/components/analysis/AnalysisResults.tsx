import { AnalysisResults as Results } from '../../types';
import Card from '../ui/Card';
import Button from '../ui/Button';

interface AnalysisResultsProps {
  results: Results;
  onGenerateReport: () => void;
}

export default function AnalysisResults({ results, onGenerateReport }: AnalysisResultsProps) {
  return (
    <div className="relative z-10 max-w-6xl mx-auto px-6 py-8">
      <Card>
        <h2 className="text-2xl font-light text-neutral-100 mb-8">Business Analysis Results</h2>
        
        <div className="grid lg:grid-cols-2 gap-8">
          <div className="space-y-6">
            <Card variant="glass" className="p-6">
              <h3 className="font-medium text-neutral-100 text-lg mb-4 flex items-center">
                <div className="w-2 h-2 bg-neutral-400 rounded-full mr-3"></div>
                Business Intelligence
              </h3>
              <div className="space-y-3 text-sm">
                <div className="flex justify-between items-center">
                  <span className="text-neutral-300">Industry:</span>
                  <span className="text-neutral-100 font-medium">{results.parsing.industry}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-neutral-300">Target Audience:</span>
                  <span className="text-neutral-100 font-medium">{results.parsing.targetAudience}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-neutral-300">Business Model:</span>
                  <span className="text-neutral-100 font-medium">{results.parsing.businessModel}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-neutral-300">Confidence:</span>
                  <span className="text-neutral-200 font-semibold">{results.parsing.confidence}%</span>
                </div>
              </div>
            </Card>

            <Card variant="glass" className="p-6">
              <h3 className="font-medium text-neutral-100 text-lg mb-4 flex items-center">
                <div className="w-2 h-2 bg-neutral-400 rounded-full mr-3"></div>
                Market Analytics
              </h3>
              <div className="space-y-3 text-sm">
                <div className="flex justify-between items-center">
                  <span className="text-neutral-300">Growth Rate:</span>
                  <span className="text-neutral-200 font-semibold">+{results.market.growthRate}%</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-neutral-300">Market Size:</span>
                  <span className="text-neutral-100 font-medium">{results.market.marketSize}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-neutral-300">Competition:</span>
                  <span className="text-neutral-100 font-medium">{results.market.competition}</span>
                </div>
              </div>
              <div className="mt-4">
                <span className="text-neutral-300 text-sm">Trends:</span>
                <div className="flex flex-wrap gap-2 mt-2">
                  {results.market.trends.map((trend, index) => (
                    <span key={index} className="px-3 py-1 bg-neutral-700/20 text-neutral-300 text-xs rounded-full backdrop-blur-sm border border-neutral-600/30">
                      {trend}
                    </span>
                  ))}
                </div>
              </div>
            </Card>
          </div>

          <div className="space-y-6">
            <Card variant="glass" className="p-6">
              <h3 className="font-medium text-neutral-100 text-lg mb-4 flex items-center">
                <div className="w-2 h-2 bg-neutral-400 rounded-full mr-3"></div>
                Audience Intelligence
              </h3>
              <div className="text-sm text-neutral-200 mb-4">{results.audience.demographics}</div>
              <div className="space-y-2">
                {results.audience.behaviors.map((behavior, index) => (
                  <div key={index} className="text-sm text-neutral-300 flex items-center">
                    <span className="w-1.5 h-1.5 bg-neutral-400 rounded-full mr-3"></span>
                    {behavior}
                  </div>
                ))}
              </div>
              <div className="mt-4">
                <span className="text-neutral-300 text-sm">Segments:</span>
                <div className="flex flex-wrap gap-2 mt-2">
                  {results.audience.segments.map((segment, index) => (
                    <span key={index} className="px-3 py-1 bg-neutral-700/20 text-neutral-300 text-xs rounded-full backdrop-blur-sm border border-neutral-600/30">
                      {segment}
                    </span>
                  ))}
                </div>
              </div>
            </Card>

            <Card variant="glass" className="p-6">
              <h3 className="font-medium text-neutral-100 text-lg mb-4 flex items-center">
                <div className="w-2 h-2 bg-neutral-400 rounded-full mr-3"></div>
                Risk Assessment
              </h3>
              <div className="text-sm mb-4">
                <span className="text-neutral-300">Risk Level: </span>
                <span className="text-neutral-200 font-semibold">{results.risks.level}</span>
              </div>
              <div className="space-y-3">
                <div>
                  <span className="text-neutral-300 text-sm">Risk Factors:</span>
                  <div className="space-y-2 mt-2">
                    {results.risks.factors.map((factor, index) => (
                      <div key={index} className="text-sm text-neutral-300 flex items-center">
                        <span className="w-1.5 h-1.5 bg-neutral-500 rounded-full mr-3"></span>
                        {factor}
                      </div>
                    ))}
                  </div>
                </div>
                <div>
                  <span className="text-neutral-300 text-sm">Mitigations:</span>
                  <div className="space-y-2 mt-2">
                    {results.risks.mitigations.map((mitigation, index) => (
                      <div key={index} className="text-sm text-neutral-300 flex items-center">
                        <span className="w-1.5 h-1.5 bg-neutral-300 rounded-full mr-3"></span>
                        {mitigation}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </Card>
          </div>
        </div>

        <Button
          onClick={onGenerateReport}
          size="lg"
          fullWidth
          className="mt-8"
        >
          Generate Full Report
        </Button>
      </Card>
    </div>
  );
} 