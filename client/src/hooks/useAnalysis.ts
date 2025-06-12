import { useState, useCallback } from 'react';

export interface AnalysisStage {
  id: string;
  title: string;
  description: string;
}

export interface SimpleAnalysisResults {
  summary: string;
  opportunities: string[];
}

export interface StreamEvent {
  author: string;
  content: string;
  is_final: boolean;
  timestamp: Date;
}

export const useAnalysis = (stages: AnalysisStage[]) => {
  const [businessIdea, setBusinessIdea] = useState<string>('');
  const [analyzing, setAnalyzing] = useState(false);
  const [results, setResults] = useState<SimpleAnalysisResults | null>(null);
  const [progress, setProgress] = useState(0);
  const [currentStage, setCurrentStage] = useState<AnalysisStage | null>(null);
  const [completedStages, setCompletedStages] = useState<string[]>([]);
  const [events, setEvents] = useState<StreamEvent[]>([]);

  const startAnalysis = useCallback(async (idea: string) => {
    setBusinessIdea(idea);
    setAnalyzing(true);
    setResults(null);
    setProgress(0);
    setCurrentStage(stages[0]);
    setCompletedStages([]);
    setEvents([]);

    try {
      const response = await fetch('/api/search', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query: idea })
      });

      const reader = response.body?.getReader();
      if (!reader) throw new Error('No reader available');

      let intermediateResults = '';

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        const text = new TextDecoder().decode(value);
        const eventLines = text.split('\n\n').filter(Boolean);

        for (const eventLine of eventLines) {
          if (eventLine.startsWith('data: ')) {
            const data = JSON.parse(eventLine.slice(6));
            
            if (data.error) {
              let errorMessage = data.error;
              if (typeof data.error === 'object' && data.error.message) {
                errorMessage = data.error.message;
              }
              
              if (errorMessage.includes('overloaded') || errorMessage.includes('503')) {
                setEvents(prev => [...prev, {
                  author: 'system',
                  content: 'The AI model is currently overloaded. Please try again in a few moments.',
                  is_final: true,
                  timestamp: new Date()
                }]);
              } else {
                setEvents(prev => [...prev, {
                  author: 'system',
                  content: `Analysis failed: ${errorMessage}`,
                  is_final: true,
                  timestamp: new Date()
                }]);
              }
              
              setAnalyzing(false);
              return;
            }

            const streamEvent: StreamEvent = {
              author: data.author,
              content: data.content || '',
              is_final: data.is_final || false,
              timestamp: new Date()
            };

            setEvents(prev => [...prev, streamEvent]);

            if (data.author === 'search_agent') {
              setCurrentStage(stages[1]);
              setCompletedStages(prev => [...prev, stages[0].id]);
              setProgress(50);
            } else if (data.author === 'fetch_website_agent') {
              setProgress(100);
              setCompletedStages(prev => [...prev, stages[1].id]);
              intermediateResults += data.content;
              
              if (data.is_final) {
                setResults({
                  summary: intermediateResults,
                  opportunities: []
                });
                setAnalyzing(false);
              }
            }
          }
        }
      }
    } catch (error) {
      console.error('Analysis failed:', error);
      
      const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
      
      setEvents(prev => [...prev, {
        author: 'system',
        content: `Connection error: ${errorMessage}. Please check your internet connection and try again.`,
        is_final: true,
        timestamp: new Date()
      }]);
      
      setAnalyzing(false);
    }
  }, [stages]);

  const resetAnalysis = useCallback(() => {
    setBusinessIdea('');
    setAnalyzing(false);
    setResults(null);
    setProgress(0);
    setCurrentStage(null);
    setCompletedStages([]);
    setEvents([]);
  }, []);

  const generateReport = useCallback(() => {
    if (!results) return;
    // Implement report generation logic here
  }, [results]);

  return {
    businessIdea,
    analyzing,
    results,
    progress,
    currentStage,
    completedStages,
    events,
    startAnalysis,
    resetAnalysis,
    generateReport
  };
}; 