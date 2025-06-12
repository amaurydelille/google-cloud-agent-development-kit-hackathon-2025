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