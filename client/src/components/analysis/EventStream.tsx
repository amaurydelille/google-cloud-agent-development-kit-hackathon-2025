import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Loader from '../ui/Loader';

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

interface SequentialUrlsProps {
  urls: string[];
  eventIndex: number;
}

function SequentialUrls({ urls, eventIndex }: SequentialUrlsProps) {
  const [visibleCount, setVisibleCount] = useState(0);

  useEffect(() => {
    setVisibleCount(0);
    
    urls.forEach((_, index) => {
      setTimeout(() => {
        setVisibleCount(index + 1);
      }, index * 500);
    });
  }, [urls, eventIndex]);

  return (
    <ul className="space-y-2">
      {urls.slice(0, visibleCount).map((url) => (
        <li 
          key={url} 
          className="text-white text-sm italic fade-in-out animate-pulse transition-opacity duration-300"
        >
          <a href={url} target="_blank" rel="noopener noreferrer" className="hover:text-blue-400">
            {url}
          </a>
        </li>
      ))}
    </ul>
  );
}

export default function EventStream({ events, isLoading = false }: EventStreamProps) {
  const router = useRouter();

  useEffect(() => {
    const lastGoogleEvent = events
      .filter(event => event.author === 'fetch_website_agent' && event.is_final)
      .pop();

    if (lastGoogleEvent && !isLoading) {
      const formattedSummary = lastGoogleEvent.content
        .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
        .replace(/\*(.*?)\*/g, '<em>$1</em>');
      
      const searchParams = new URLSearchParams({
        summary: encodeURIComponent(formattedSummary)
      });
      
      router.push(`/dashboard?${searchParams.toString()}`);
    }
  }, [events, isLoading, router]);

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
        return 'Google Search Agent';
      case 'fetch_website_agent':
        return 'Google Analyzer Agent';
      case 'sequential_agent':
        return 'Coordinator';
      default:
        return author.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase());
    }
  };

  const displayContent = (event: StreamEvent, eventIndex: number) => {
    try {
      const regex = /```json\s*([\s\S]*?)\s*```/;
      const match = event.content.match(regex);
      const content = event.content;

      switch (event.author) {
        case 'search_agent':
          try {
            if (match && match[1]) {
              const jsonContent = JSON.parse(match[1].trim());
              if (jsonContent && Array.isArray(jsonContent.urls)) {
                return (
                  <div className="flex flex-col gap-2">
                    <div className="flex flex-row gap-2 items-center">
                      <p>Searching for information at</p>
                      <Loader size={4} />
                    </div>
                    <SequentialUrls urls={jsonContent.urls} eventIndex={eventIndex} />
                  </div>
                );
              }
            }
          } catch {
          }
          break;
                  case 'fetch_website_agent':
            return (
              <div className="flex flex-row gap-2 items-center">
                <p>Summarizing</p>
                <Loader size={4} />
              </div>
            )
        case 'sequential_agent':
          break;
      }

      return content;
    } catch {
      return event.content;
    }
  };

  return (
    <div className="w-full max-w-4xl mx-auto space-y-4">
      <div className="bg-white/5 backdrop-blur-xl rounded-2xl border border-white/10 p-6">
        <h3 className="text-xl font-semibold text-white mb-4 flex items-center gap-2">
          <span className="text-2xl">🧠</span>
          Analysis in Progress
        </h3>
        
        <div className="space-y-4 max-h-96 overflow-y-auto">
          {events.filter(event => event.is_final).map((event, index) => (
            <div
              key={index}
              className={`flex gap-4 p-4 rounded-xl transition-all duration-300 bg-neutral-900`}
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
                  {event.timestamp && (
                    <span className="text-xs text-neutral-400">
                      {event.timestamp.toLocaleTimeString()}
                    </span>
                  )}
                </div>
                
                {event.content && (
                  <div className="text-neutral-300 leading-relaxed whitespace-pre-wrap">
                    {displayContent(event, index)}
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