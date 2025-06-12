import { AnalysisStage } from '../../types';

interface AnalysisStageItemProps {
  stage: AnalysisStage;
  isActive: boolean;
  isCompleted: boolean;
  isPending: boolean;
}

export default function AnalysisStageItem({ stage, isActive, isCompleted, isPending }: AnalysisStageItemProps) {
  return (
    <div
      className={`flex items-center space-x-6 p-6 rounded-2xl transition-all duration-500 backdrop-blur-sm ${
        isActive 
          ? 'bg-neutral-700/20 border border-neutral-600/30 shadow-xl scale-105' 
          : isCompleted 
          ? 'bg-neutral-600/20 border border-neutral-500/30' 
          : 'bg-neutral-800/5 border border-neutral-700/10'
      }`}
    >
      <div className={`flex items-center justify-center w-14 h-14 rounded-2xl transition-all duration-300 ${
        isActive 
          ? 'bg-neutral-600/30 shadow-lg animate-pulse backdrop-blur-sm' 
          : isCompleted 
          ? 'bg-neutral-500/30 backdrop-blur-sm' 
          : 'bg-neutral-800/10 backdrop-blur-sm'
      }`}>
        {isCompleted ? (
          <svg className="w-7 h-7 text-neutral-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
          </svg>
        ) : (
          stage.logo
        )}
      </div>
      
      <div className="flex-1">
        <div className={`font-medium text-lg transition-colors ${
          isActive ? 'text-neutral-200' : isCompleted ? 'text-neutral-300' : 'text-neutral-100'
        }`}>
          {stage.title}
        </div>
        <div className={`text-sm transition-colors ${
          isActive ? 'text-neutral-400' : isCompleted ? 'text-neutral-400' : 'text-neutral-400'
        }`}>
          {stage.description}
        </div>
      </div>

      <div className="flex items-center">
        {isActive && (
          <div className="flex space-x-2">
            <div className="w-3 h-3 bg-neutral-400 rounded-full animate-bounce"></div>
            <div className="w-3 h-3 bg-neutral-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
            <div className="w-3 h-3 bg-neutral-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
          </div>
        )}
        {isCompleted && (
          <div className="w-8 h-8 bg-neutral-500/30 backdrop-blur-sm rounded-xl flex items-center justify-center border border-neutral-500/30">
            <svg className="w-5 h-5 text-neutral-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
        )}
        {isPending && (
          <div className="w-8 h-8 bg-neutral-800/10 backdrop-blur-sm rounded-xl flex items-center justify-center border border-neutral-700/20">
            <div className="w-3 h-3 bg-neutral-500 rounded-full"></div>
          </div>
        )}
      </div>
    </div>
  );
} 