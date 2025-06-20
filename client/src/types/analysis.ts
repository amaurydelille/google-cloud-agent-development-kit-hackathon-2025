export interface AnalysisResults {
  parsing: {
    industry: string;
    targetAudience: string;
    businessModel: string;
    confidence: number;
  };
  market: {
    growthRate: number;
    marketSize: string;
    competition: string;
    trends: string[];
  };
  audience: {
    demographics: string;
    behaviors: string[];
    segments: string[];
  };
  risks: {
    level: string;
    factors: string[];
    mitigations: string[];
  };
}

export interface MetricData {
  metric_name: string;
  value: number | string;
  unit: string;
  source_dataset: string;
  insight_summary: string;
}

export interface SummaryWithSentiment {
  summary: string;
  sentiment_score: number;
  sentiment_magnitude: number;
}

export interface StructuredAnalysisResult {
  summary: SummaryWithSentiment | string;
  bigquery_metrics: MetricData[];
  statista_insights: MetricData[];
  timestamp: number;
}

export interface AnalysisEvent {
  author: string;
  content: string;
  is_final: boolean;
  structured_data?: StructuredAnalysisResult;
  error?: {
    message: string;
    type?: string;
  };
} 