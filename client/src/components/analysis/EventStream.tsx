interface StreamEvent {
  author: string;
  content: string;
  is_final: boolean;
  timestamp?: Date;
}

interface EventStreamProps {
  events: StreamEvent[];
  isLoading?: boolean;
}

export default function EventStream({ events, isLoading = false }: EventStreamProps) {
  const getAgentIcon = (author: string) => {
    switch (author) {
      case 'search_agent':
        return '🔍';
      case 'fetch_website_agent':
        return '🌐';
      case 'sequential_agent':
        return '⚡';
      default:
        return '🤖';
    }
  };

  const getAgentName = (author: string) => {
    switch (author) {
      case 'search_agent':
        return 'Search Agent';
      case 'fetch_website_agent':
        return 'Content Analyzer';
      case 'sequential_agent':
        return 'Coordinator';
      default:
        return author.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase());
    }
  };

  return (
    <div className="w-full max-w-4xl mx-auto space-y-4">
      <div className="bg-white/5 backdrop-blur-xl rounded-2xl border border-white/10 p-6">
        <h3 className="text-xl font-semibold text-white mb-4 flex items-center gap-2">
          <span className="text-2xl">🧠</span>
          AI Analysis in Progress
        </h3>
        
        <div className="space-y-4 max-h-96 overflow-y-auto">
          {events.map((event, index) => (
            <div
              key={index}
              className={`flex gap-4 p-4 rounded-xl transition-all duration-300 ${
                event.is_final 
                  ? 'bg-green-500/10 border border-green-400/20' 
                  : 'bg-white/5 border border-white/10'
              }`}
            >
              <div className="flex-shrink-0">
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-lg">
                  {getAgentIcon(event.author)}
                </div>
              </div>
              
              <div className="flex-1 space-y-2">
                <div className="flex items-center gap-2">
                  <span className="font-medium text-white">
                    {getAgentName(event.author)}
                  </span>
                  {event.is_final && (
                    <span className="px-2 py-1 text-xs bg-green-500/20 text-green-300 rounded-full">
                      Final
                    </span>
                  )}
                  {event.timestamp && (
                    <span className="text-xs text-neutral-400">
                      {event.timestamp.toLocaleTimeString()}
                    </span>
                  )}
                </div>
                
                {event.content && (
                  <div className="text-neutral-300 leading-relaxed whitespace-pre-wrap">
                    {event.content}
                  </div>
                )}
              </div>
            </div>
          ))}
          
          {isLoading && (
            <div className="flex gap-4 p-4 rounded-xl bg-white/5 border border-white/10">
              <div className="flex-shrink-0">
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                </div>
              </div>
              <div className="flex-1">
                <span className="text-neutral-400">Processing...</span>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
} 