import { z } from "zod";

// Item types for lab catalog
export const LabItemTypeEnum = z.enum([
  "single_test",
  "panel",
  "microbiology",
  "molecular",
  "package",
  "pathology",
  "blood_bank",
]);

export type LabItemType = z.infer<typeof LabItemTypeEnum>;

// Result types
export const ResultTypeEnum = z.enum([
  "numeric",
  "text",
  "categorical",
  "image",
  "file",
  "micro_panel",
]);

export type ResultType = z.infer<typeof ResultTypeEnum>;

// Specimen types
export const SpecimenTypeEnum = z.enum([
  "Serum",
  "Plasma",
  "EDTA whole blood",
  "Citrate plasma",
  "Urine",
  "Stool",
  "Swab",
  "CSF",
  "Sputum",
  "Whole blood",
  "Tissue",
  "Other",
]);

export type SpecimenType = z.infer<typeof SpecimenTypeEnum>;

// Container types
export const ContainerTypeEnum = z.enum([
  "SST (Gold)",
  "EDTA (Lavender)",
  "Citrate (Blue)",
  "Heparin (Green)",
  "Red (Plain)",
  "Grey (Fluoride)",
  "Yellow (ACD)",
  "Urine cup",
  "Stool container",
  "Swab tube",
  "Other",
]);

export type ContainerType = z.infer<typeof ContainerTypeEnum>;

// Department types
export const LabDepartmentEnum = z.enum([
  "Hematology",
  "Coagulation",
  "Urinalysis",
  "Biochemistry",
  "Endocrine",
  "Immunology",
  "Microbiology",
  "Molecular",
  "Blood Bank",
  "Cytology",
  "Histopathology",
]);

export type LabDepartment = z.infer<typeof LabDepartmentEnum>;

// Sub-test definition
export interface SubTest {
  code: string;
  name: string;
  units?: string;
  resultType: ResultType;
  method?: string;
  printOrder: number;
  loinc?: string;
  derived?: boolean;
  formula?: string;
  referenceRanges?: ReferenceRange[];
  criticalValues?: CriticalValues;
}

// Reference range
export interface ReferenceRange {
  ageMin: number;
  ageMax: number;
  sex: "M" | "F" | "Any";
  low: number | null;
  high: number | null;
  unit?: string;
  note?: string;
}

// Critical values
export interface CriticalValues {
  low?: number | null;
  high?: number | null;
}

// Specimen info
export interface SpecimenInfo {
  type: SpecimenType;
  container: ContainerType;
  minVolumeMl?: number;
  preferredVolumeMl?: number;
}

// TAT info
export interface TurnaroundTime {
  routineHours: number;
  statHours?: number;
}

// Full lab test item
export interface LabTestItem {
  code: string;
  type: LabItemType;
  name: string;
  shortName?: string;
  department: LabDepartment;
  category?: string;
  specimen: SpecimenInfo;
  patientPrep?: string;
  rejectionCriteria?: string;
  stability?: string;
  tat: TurnaroundTime;
  
  // For single tests
  resultModel?: {
    resultType: ResultType;
    units?: string;
    precision?: number;
    measuringRange?: { low: number; high: number };
    referenceRanges?: ReferenceRange[];
    criticalValues?: CriticalValues;
  };
  method?: string;
  analyzer?: string;
  
  // For panels
  subTests?: SubTest[];
  pricingMode?: "bundled" | "sum_of_parts";
  
  // For packages
  includedCodes?: string[];
  
  // For microbiology
  cultureType?: string;
  gramStainRequired?: boolean;
  
  // Standards
  loinc?: string;
  snomed?: string;
  
  // Pricing
  mrp: number; // in rupees
  taxCategory: "Exempt" | "GST_5" | "GST_12" | "GST_18";
  
  // Metadata
  visibility: "patient_and_doctor" | "doctor_only" | "internal";
  active: boolean;
  orderable: boolean;
  outsourced?: boolean;
  vendorName?: string;
  
  // Clinical
  clinicalKeywords?: string[];
  synonyms?: string[];
}

// Package definition
export interface HealthPackage {
  code: string;
  name: string;
  description: string;
  includedCodes: string[];
  mrp: number;
  discountPct?: number;
  category: "Basic" | "Comprehensive" | "Executive" | "Specialized";
}
