interface HeaderProps {
  onNewSearch?: () => void;
  showNewSearchButton?: boolean;
}

export default function Header({ onNewSearch, showNewSearchButton = false }: HeaderProps) {
  return (
    <header className="relative z-10 backdrop-blur-xl bg-neutral-900/10 border-b border-neutral-700/20">
      <div className="max-w-7xl mx-auto px-6 py-6">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-light text-neutral-100">Business Intelligence</h1>
          <div className="flex items-center space-x-4">
            {showNewSearchButton && onNewSearch && (
              <button 
                onClick={onNewSearch}
                className="px-6 py-3 text-sm text-neutral-300 hover:text-neutral-100 bg-neutral-800/10 hover:bg-neutral-700/20 backdrop-blur-xl border border-neutral-700/20 rounded-xl transition-all duration-300 hover:scale-105"
              >
                New Search
              </button>
            )}
            <span className="text-sm text-neutral-400 bg-neutral-800/10 px-4 py-2 rounded-full backdrop-blur-sm">
              Powered by Google Cloud ADK
            </span>
          </div>
        </div>
      </div>
    </header>
  );
} 