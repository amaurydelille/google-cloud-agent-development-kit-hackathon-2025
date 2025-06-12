import { AnalysisStage } from '../../types';
import Card from '../ui/Card';
import ProgressBar from '../ui/ProgressBar';
import AnalysisStageItem from './AnalysisStageItem';

interface AnalysisProgressProps {
  businessIdea: string;
  stages: AnalysisStage[];
  progress: number;
  currentStage: number;
  completedStages: string[];
}

export default function AnalysisProgress({ 
  businessIdea, 
  stages, 
  progress, 
  currentStage, 
  completedStages 
}: AnalysisProgressProps) {
  return (
    <div className="relative z-10 max-w-6xl mx-auto px-6 py-8">
      <Card>
        <div className="mb-8">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-2xl font-bold text-neutral-100">Analyzing Your Business Idea</h3>
            <div className="text-sm text-neutral-300 bg-neutral-800/10 px-4 py-2 rounded-full backdrop-blur-sm">
              {Math.round(progress)}% Complete
            </div>
          </div>
          <ProgressBar progress={progress} className="mb-8" />
        </div>

        <div className="space-y-4">
          {stages.map((stage, index) => {
            const isActive = index === currentStage;
            const isCompleted = completedStages.includes(stage.id);
            const isPending = index > currentStage;

            return (
              <AnalysisStageItem
                key={stage.id}
                stage={{
                  ...stage,
                  description: stage.id === 'google' 
                    ? `Searching "${businessIdea.slice(0, 30)}${businessIdea.length > 30 ? '...' : ''}" on Google`
                    : stage.description
                }}
                isActive={isActive}
                isCompleted={isCompleted}
                isPending={isPending}
              />
            );
          })}
        </div>

        {currentStage === stages.length - 1 && progress < 100 && (
          <div className="mt-8 p-6 bg-gradient-to-r from-neutral-700/20 to-neutral-600/20 backdrop-blur-xl border border-neutral-600/30 rounded-2xl">
            <div className="flex items-center space-x-4">
              <div className="w-10 h-10 border-3 border-neutral-500 border-t-transparent rounded-full animate-spin"></div>
              <div>
                <div className="font-medium text-neutral-200 text-lg">Finalizing Analysis</div>
                <div className="text-sm text-neutral-400">Generating comprehensive business insights...</div>
              </div>
            </div>
          </div>
        )}
      </Card>
    </div>
  );
} 