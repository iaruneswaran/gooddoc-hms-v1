import { useMutation, useQuery } from "@tanstack/react-query";
import { PricingItemFormData } from "@/types/pricing-item";
import { LAB_DEPARTMENTS } from "@/data/lab-master-catalog";

// Hospital Item Categories with icons
export const HOSPITAL_CATEGORIES = [
  { value: "Lab Test", label: "Lab Test", description: "Laboratory & diagnostic tests", icon: "flask" },
  { value: "Doctor Fee", label: "Doctor Fee", description: "Consultation & visit charges", icon: "stethoscope" },
  { value: "Procedure", label: "Procedure", description: "Surgical & clinical procedures", icon: "scissors" },
  { value: "Imaging", label: "Imaging", description: "Radiology & diagnostic imaging", icon: "scan" },
  { value: "Room", label: "Room/Bed", description: "Room & bed charges", icon: "bed" },
  { value: "Pharmacy", label: "Pharmacy", description: "Medicines & consumables", icon: "pill" },
  { value: "Package", label: "Package", description: "Bundled health packages", icon: "package" },
];

// Lab Item Types (sub-types for Lab Test category)
export const LAB_ITEM_TYPES = [
  { value: "single_test", label: "Single Test", description: "Individual orderable analyte" },
  { value: "panel", label: "Panel/Profile", description: "Bundle of sub-tests (e.g., LFT, CBC)" },
  { value: "microbiology", label: "Microbiology/Culture", description: "Culture & sensitivity tests" },
  { value: "molecular", label: "Molecular/RT-PCR", description: "PCR and molecular diagnostics" },
  { value: "pathology", label: "Pathology/Cytology", description: "Histopathology and cytology" },
  { value: "blood_bank", label: "Blood Bank", description: "Transfusion services" },
];

// Imaging Item Types
export const IMAGING_ITEM_TYPES = [
  { value: "xray", label: "X-Ray", description: "Plain radiography" },
  { value: "ct", label: "CT Scan", description: "Computed tomography" },
  { value: "mri", label: "MRI", description: "Magnetic resonance imaging" },
  { value: "ultrasound", label: "Ultrasound", description: "Sonography" },
  { value: "nuclear", label: "Nuclear Medicine", description: "PET/SPECT scans" },
  { value: "interventional", label: "Interventional", description: "Image-guided procedures" },
];

// Procedure Types
export const PROCEDURE_TYPES = [
  { value: "minor", label: "Minor Procedure", description: "Outpatient procedures" },
  { value: "major", label: "Major Surgery", description: "Inpatient surgical procedures" },
  { value: "endoscopy", label: "Endoscopy", description: "Diagnostic & therapeutic endoscopy" },
  { value: "cardiac", label: "Cardiac", description: "Cath lab & cardiac procedures" },
  { value: "therapeutic", label: "Therapeutic", description: "Therapies & treatments" },
];

// Room Types
export const ROOM_TYPES = [
  { value: "general", label: "General Ward", description: "Multi-bed ward" },
  { value: "semi_private", label: "Semi-Private", description: "2-3 bed rooms" },
  { value: "private", label: "Private Room", description: "Single occupancy" },
  { value: "deluxe", label: "Deluxe/Suite", description: "Premium rooms" },
  { value: "icu", label: "ICU/CCU", description: "Intensive care units" },
  { value: "ot", label: "OT/Recovery", description: "Operating theatre charges" },
];

// Pharmacy Item Types
export const PHARMACY_ITEM_TYPES = [
  { value: "medicine", label: "Medicine", description: "Tablets, capsules, syrups" },
  { value: "injection", label: "Injection", description: "Injectable medicines" },
  { value: "consumable", label: "Consumable", description: "Disposables & supplies" },
  { value: "surgical", label: "Surgical Items", description: "Implants & devices" },
  { value: "vaccine", label: "Vaccine", description: "Immunizations" },
];

// Departments by category
export const DEPARTMENTS_BY_CATEGORY: Record<string, string[]> = {
  "Lab Test": [...LAB_DEPARTMENTS],
  "Doctor Fee": ["Cardiology", "Orthopedics", "Pediatrics", "General Medicine", "Surgery", "Gynecology", "Dermatology", "ENT", "Ophthalmology", "Neurology", "Psychiatry", "Pulmonology", "Gastroenterology", "Nephrology", "Urology", "Oncology"],
  "Procedure": ["Surgery", "Orthopedics", "Cardiology", "Gastroenterology", "Urology", "Gynecology", "ENT", "Ophthalmology", "Dermatology", "Dental"],
  "Imaging": ["Radiology", "Cardiology", "Nuclear Medicine"],
  "Room": ["Nursing", "ICU", "Surgery", "Pediatrics", "Obstetrics"],
  "Pharmacy": ["Pharmacy"],
  "Package": ["Preventive Care", "Cardiology", "Diabetology", "Gynecology", "Pediatrics", "General Medicine"],
};

// Specimen Types
export const SPECIMEN_TYPES = [
  "Serum",
  "Plasma-EDTA",
  "Whole Blood-EDTA",
  "Citrate Plasma",
  "Urine",
  "Stool",
  "Sputum",
  "Swab",
  "CSF",
  "Tissue",
  "Fluid",
];

// Container Types
export const CONTAINER_TYPES = [
  { value: "SST (Gold)", label: "SST (Gold/Red)" },
  { value: "EDTA (Lavender)", label: "EDTA (Lavender)" },
  { value: "Citrate (Blue)", label: "Citrate (Blue)" },
  { value: "Fluoride (Gray)", label: "Fluoride (Gray)" },
  { value: "Heparin (Green)", label: "Heparin (Green)" },
  { value: "Urine Cup", label: "Urine Cup" },
  { value: "Stool Container", label: "Stool Container" },
  { value: "Swab", label: "Swab" },
  { value: "Sterile Container", label: "Sterile Container" },
];

// Consultation Types
export const CONSULTATION_TYPES = [
  { value: "new", label: "New Consultation", description: "First-time visit" },
  { value: "followup", label: "Follow-up", description: "Review visit" },
  { value: "teleconsult", label: "Teleconsultation", description: "Video/phone consult" },
  { value: "emergency", label: "Emergency", description: "Emergency consultation" },
  { value: "home", label: "Home Visit", description: "Doctor home visit" },
];

// Units by category
export const UNITS_BY_CATEGORY: Record<string, { value: string; label: string }[]> = {
  "Lab Test": [{ value: "test", label: "Per Test" }],
  "Doctor Fee": [
    { value: "each", label: "Per Visit" },
    { value: "session", label: "Per Session" },
  ],
  "Procedure": [
    { value: "procedure", label: "Per Procedure" },
    { value: "session", label: "Per Session" },
  ],
  "Imaging": [{ value: "each", label: "Per Study" }],
  "Room": [
    { value: "day", label: "Per Day" },
    { value: "each", label: "Per Hour" },
  ],
  "Pharmacy": [
    { value: "each", label: "Per Unit" },
    { value: "package", label: "Per Pack" },
  ],
  "Package": [{ value: "package", label: "Per Package" }],
};

// Mock data
const MOCK_DEPARTMENTS = [
  ...LAB_DEPARTMENTS,
  "Cardiology", "Orthopedics", "Pediatrics", "General Medicine", "Surgery", 
  "Gynecology", "Dermatology", "ENT", "Ophthalmology", "Neurology",
  "Radiology", "Nursing", "ICU", "Pharmacy", "Preventive Care"
];

const MOCK_BRANCHES = [
  { id: "branch-001", name: "Main Hospital" },
  { id: "branch-002", name: "Branch A" },
  { id: "branch-003", name: "Branch B" },
];

const MOCK_CATEGORIES = [
  "Lab Test",
  "Doctor Fee",
  "Procedure",
  "Imaging",
  "Room",
  "Pharmacy",
  "Package",
];

// Store used codes in memory
const usedInternalCodes = new Set(["LAB-0001", "DOC-0001", "PROC-0001"]);

/**
 * Get list of departments
 */
export function useDepartments() {
  return useQuery({
    queryKey: ["departments"],
    queryFn: async () => {
      await new Promise((resolve) => setTimeout(resolve, 300));
      return MOCK_DEPARTMENTS;
    },
  });
}

/**
 * Get list of branches
 */
export function useBranches() {
  return useQuery({
    queryKey: ["branches"],
    queryFn: async () => {
      await new Promise((resolve) => setTimeout(resolve, 300));
      return MOCK_BRANCHES;
    },
  });
}

/**
 * Get list of categories
 */
export function useCategories() {
  return useQuery({
    queryKey: ["categories"],
    queryFn: async () => {
      await new Promise((resolve) => setTimeout(resolve, 200));
      return MOCK_CATEGORIES;
    },
  });
}

/**
 * Check if internal code is unique
 */
export async function checkInternalCodeUnique(code: string): Promise<{ unique: boolean }> {
  await new Promise((resolve) => setTimeout(resolve, 500));
  
  const upperCode = code.toUpperCase().trim();
  const isUnique = !usedInternalCodes.has(upperCode);
  
  return { unique: isUnique };
}

/**
 * Create new pricing item
 */
export function useCreatePricingItem() {
  return useMutation({
    mutationFn: async (data: PricingItemFormData): Promise<PricingItemFormData & { id: string }> => {
      await new Promise((resolve) => setTimeout(resolve, 800));
      
      usedInternalCodes.add(data.codes.internal);
      
      return {
        ...data,
        id: `price-${Date.now()}`,
      };
    },
  });
}

/**
 * Update existing pricing item
 */
export function useUpdatePricingItem() {
  return useMutation({
    mutationFn: async ({
      id,
      data,
    }: {
      id: string;
      data: PricingItemFormData;
    }): Promise<PricingItemFormData & { id: string }> => {
      await new Promise((resolve) => setTimeout(resolve, 800));
      
      return {
        ...data,
        id,
      };
    },
  });
}
