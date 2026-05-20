export type PESTELData = {
  id: string;
  category: 'Political' | 'Economic' | 'Social' | 'Technological' | 'Environmental' | 'Legal';
  description: string;
  impact: string;
  probability: string;
  potential: string;
};

export type McKinsey7SData = Record<string, Record<string, string>>;

export type VRIOAnalysisData = {
  id: string;
  resource: string;
  type: string;
  detail: string;
  v: string;
  r: string;
  i: string;
  o: string;
};

export type TOWSMatrixData = {
  opportunities: string[];
  threats: string[];
  strengths: string[];
  weaknesses: string[];
  scores: Record<string, number | string>; // key: "rowType-rowIndex-colType-colIndex"
  notes: Record<string, string>; // key: "rowType-rowIndex-colType-colIndex"
};

export type PortersForceData = {
  analysis: string;
  impact: 'Low' | 'Medium' | 'High';
  scorecard: Record<number, boolean | null>;
  further: Array<{ col1: string; col2: string; col3: string; col4?: string }>;
};

export type PortersFiveForcesData = {
  newEntrants: PortersForceData;
  buyers: PortersForceData;
  suppliers: PortersForceData;
  substitutes: PortersForceData;
  rivalry: PortersForceData;
};

export type MetaData = {
  module: string;
  cohort: string;
  date: string;
  companyName: string;
  participants: string[];
  group: string;
};
