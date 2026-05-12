export type ToothNotation = 'Universal' | 'FDI' | 'Palmer';

export type Surface = 'buccal' | 'lingual' | 'mesial' | 'distal' | 'occlusal' | 'incisal';

export type ToothCondition = 
  | 'healthy'
  | 'caries'
  | 'filled'
  | 'crown'
  | 'missing'
  | 'implant'
  | 'root-canal'
  | 'extraction-planned';

// --- Periodontal Charting Types ---

export type SiteKey = 'MB' | 'B' | 'DB' | 'ML' | 'L' | 'DL';

export interface PerioSite {
  pd: number | null;          // Pocket Depth (mm)
  gm: number | null;          // Gingival Margin (signed mm, positive = recession)
  bop: boolean;               // Bleeding on Probing
  sup: boolean;               // Suppuration (yellow)
  plaque: boolean;            // Plaque present (blue)
  cal?: number | null;        // Clinical Attachment Loss (computed: pd + gm)
  note?: string;
}

export interface FurcationGrade {
  buccal?: 0 | 1 | 2 | 3;
  lingual?: 0 | 1 | 2 | 3;
  mesial?: 0 | 1 | 2 | 3;
  distal?: 0 | 1 | 2 | 3;
}

export interface ToothPerio {
  toothNumber: string;        // '1'..'32' or FDI '11'..'48'
  sites: Record<SiteKey, PerioSite>;
  mobility?: 0 | 1 | 2 | 3;
  furcation?: FurcationGrade;
  missing?: boolean;
  implant?: boolean;
  note?: string;
}

export interface PerioExam {
  examId: string;
  patientId: string;
  providerId: string;
  numberingSystem: ToothNotation;
  date: string;               // ISO format
  teeth: Record<string, ToothPerio>; // Key is toothNumber
  metadata?: {
    createdAt: string;
    updatedAt: string;
    device?: string;
  };
}

// --- General Consultation Types ---

export interface ToothData {
  id: number;
  condition: ToothCondition[];
  surfaces: Partial<Record<Surface, ToothCondition>>;
  notes?: string;
  images?: string[];
}

export interface Diagnosis {
  id: string;
  title: string;
  code: string;
  teeth: number[];
  status: 'Active' | 'Resolved';
  onset: string;
  cariesRisk?: 'Low' | 'Moderate' | 'High';
  perioStage?: string;
}

export interface TreatmentPlanItem {
  id: string;
  phase: 'Emergency' | 'Phase I' | 'Phase II' | 'Maintenance';
  code: string;
  description: string;
  teeth: number[];
  surface?: Surface[];
  fee: number;
  chairTime: number;
  provider: string;
  priority: 'High' | 'Medium' | 'Low';
  status: 'Proposed' | 'Accepted' | 'Declined' | 'Completed';
  insurancePreauth?: boolean;
}

export interface VitalSigns {
  bp: string;
  hr: string;
  temp: string;
  spo2: string;
}

export interface SOAPNote {
  subjective: {
    complaint: string;
    hpi: string;
    painScale: number;
    historyReviewed: boolean;
  };
  objective: {
    vitals: VitalSigns;
    examFindings: string;
  };
  assessment: {
    summary: string;
    diagnoses: string[]; // IDs
  };
  plan: {
    proposed: string;
    education: string;
    consentSigned: boolean;
    followUp: string;
  };
}

export interface ImagingStudy {
  id: string;
  date: string;
  type: 'BW' | 'PA' | 'Pan' | 'Ceph' | 'IO' | 'CBCT';
  teeth: number[];
  images: {
    id: string;
    url: string;
    annotations: string[];
  }[];
  notes: string;
}
