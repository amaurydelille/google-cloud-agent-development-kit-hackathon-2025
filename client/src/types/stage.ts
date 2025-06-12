import { ReactNode } from 'react';

export interface AnalysisStage {
  id: string;
  title: string;
  description: string;
  logo: ReactNode;
  duration: number;
} 