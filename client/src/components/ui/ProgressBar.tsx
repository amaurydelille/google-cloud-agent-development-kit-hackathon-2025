interface ProgressBarProps {
  progress: number;
  className?: string;
}

export default function ProgressBar({ progress, className = '' }: ProgressBarProps) {
  return (
    <div className={`w-full bg-neutral-800/10 rounded-full h-3 backdrop-blur-sm ${className}`}>
      <div 
        className="bg-gradient-to-r from-neutral-600 via-neutral-500 to-neutral-400 h-3 rounded-full transition-all duration-700 ease-out shadow-lg"
        style={{ width: `${progress}%` }}
      ></div>
    </div>
  );
} 