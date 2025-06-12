'use client';

import { PageLayout, Header, Footer } from '../components/layout';
import { AnalysisForm, EventStream } from '../components/analysis';
import { useAnalysis } from '../hooks/useAnalysis';
import { analysisStages } from '../data/analysisStages';

export default function Home() {
  const {
    analyzing,
    events,
    startAnalysis,
    resetAnalysis
  } = useAnalysis(analysisStages);

  if (analyzing || events.length > 0) {
    return (
      <PageLayout>
        <Header onNewSearch={resetAnalysis} showNewSearchButton />
        
        <div className="space-y-8 p-6">
          <EventStream events={events} isLoading={analyzing} />
        </div>
      </PageLayout>
    );
  }

  return (
    <PageLayout>
      <div className="min-h-screen flex flex-col">
        <Header />
        <AnalysisForm onAnalyze={startAnalysis} />
        <Footer />
      </div>
    </PageLayout>
  );
}
