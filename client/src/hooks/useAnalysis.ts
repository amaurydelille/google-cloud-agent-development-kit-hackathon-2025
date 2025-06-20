import { useState, useCallback, useEffect } from 'react';
import { AnalysisEvent } from '../types/analysis';

export interface AnalysisStage {
  id: string;
  title: string;
  description: string;
}

export interface SimpleAnalysisResults {
  summary: string;
  opportunities: string[];
}

export const useAnalysis = (stages: AnalysisStage[]) => {
  const [businessIdea, setBusinessIdea] = useState<string>('');
  const [analyzing, setAnalyzing] = useState(false);
  const [results, setResults] = useState<SimpleAnalysisResults | null>(null);
  const [progress, setProgress] = useState(0);
  const [currentStage, setCurrentStage] = useState<AnalysisStage | null>(null);
  const [completedStages, setCompletedStages] = useState<string[]>([]);
  const [events, setEvents] = useState<AnalysisEvent[]>([]);

  // Load persisted state on mount
  useEffect(() => {
    try {
      const storedProgress = sessionStorage.getItem('analysisProgress');
      if (storedProgress) {
        const { progress: savedProgress, currentStage: savedCurrentStage, completedStages: savedCompletedStages } = JSON.parse(storedProgress);
        setProgress(savedProgress);
        setCurrentStage(savedCurrentStage);
        setCompletedStages(savedCompletedStages);
      }
    } catch (error) {
      console.error('Failed to load persisted progress:', error);
    }
  }, []);

  // Save state to sessionStorage whenever it changes
  useEffect(() => {
    if (progress > 0 || currentStage !== null || completedStages.length > 0) {
      sessionStorage.setItem('analysisProgress', JSON.stringify({
        progress,
        currentStage,
        completedStages
      }));
    }
  }, [progress, currentStage, completedStages]);

  const startAnalysis = useCallback(async (idea: string) => {
    setBusinessIdea(idea);
    setAnalyzing(true);
    setResults(null);
    
    // Don't reset progress states here - they will persist from the previous run
    // Only reset if explicitly requested via resetAnalysis

    try {
      const response = await fetch('/api/search', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query: idea })
      });

      const reader = response.body?.getReader();
      if (!reader) throw new Error('No reader available');

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
                  is_final: true
                }]);
              } else {
                setEvents(prev => [...prev, {
                  author: 'system',
                  content: `Analysis failed: ${errorMessage}`,
                  is_final: true
                }]);
              }
              
              setAnalyzing(false);
              return;
            }

            const analysisEvent: AnalysisEvent = {
              author: data.author,
              content: data.content || '',
              is_final: data.is_final || false,
              structured_data: data.structured_data,
              error: data.structured_data?.errors?.[data.author] ? {
                message: data.structured_data.errors[data.author],
                type: 'agent_error'
              } : undefined
            };

            setEvents(prev => [...prev, analysisEvent]);

            if (data.author === 'search_agent' && data.is_final) {
              setCurrentStage(stages[1]);
              setCompletedStages(prev => [...prev, stages[0].id]);
              setProgress(25);
            } else if (data.author === 'fetch_website_agent' && data.is_final) {
              setProgress(50);
              setCompletedStages(prev => [...prev, stages[1].id]);
            } else if (data.author === 'bigquery_agent' && data.is_final) {
              setProgress(75);
              // Continue even if BigQuery fails
              if (data.structured_data?.errors?.bigquery_agent) {
                setEvents(prev => [...prev, {
                  author: 'system',
                  content: 'BigQuery analysis completed with limited data due to authentication error. Proceeding with available information.',
                  is_final: true,
                  error: {
                    message: 'BigQuery authentication failed',
                    type: 'auth_error'
                  }
                }]);
              }
            } else if (data.author === 'statista_agent' && data.is_final) {
              setProgress(90);
            } else if (data.author === 'final_results' && data.structured_data) {
              setProgress(100);
              setAnalyzing(false);
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
        is_final: true
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
    // Clear persisted progress
    sessionStorage.removeItem('analysisProgress');
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