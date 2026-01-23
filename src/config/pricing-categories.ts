/**
 * Pricing catalog category configuration
 * Defines categories, department mappings, field rules, and unit defaults
 */

export type PricingCategory =
  | "Lab Test"
  | "Radiology/Imaging"
  | "Procedure/OT"
  | "Nursing Service"
  | "Room/Bed"
  | "Consultation"
  | "Service/Consumable"
  | "Package";

export type PricingUnit = "test" | "study" | "procedure" | "event" | "hour" | "day" | "visit" | "item" | "package";

export interface CategoryConfig {
  label: string;
  departments: string[];
  defaultUnit: PricingUnit;
  codePrefix: string;
  fields: {
    // Standard code fields
    showLoinc?: boolean;
    showCpt?: boolean;
    requireCpt?: boolean;
    showIcd?: boolean;
    showHcpcs?: boolean;
    // Category-specific fields
    showSpecimenType?: boolean;
    showFastingRequired?: boolean;
    showTat?: boolean;
    showMethod?: boolean;
    showModality?: boolean;
    showBodyPart?: boolean;
    showContrast?: boolean;
    showLaterality?: boolean;
    showAnesthesiaType?: boolean;
    showEstimatedDuration?: boolean;
    showLocation?: boolean;
    showBillingBasis?: boolean;
    showStaffLevel?: boolean;
    showWardClass?: boolean;
    showMealsIncluded?: boolean;
    showMaxOccupancy?: boolean;
    showProviderType?: boolean;
    showFollowUpWindow?: boolean;
    showPackageBuilder?: boolean;
    showPackageType?: boolean;
    showPriceMode?: boolean;
    showMultiVisit?: boolean;
    showSampleSessions?: boolean;
  };
  helperText?: string;
}

export const CATEGORY_CONFIG: Record<PricingCategory, CategoryConfig> = {
  "Lab Test": {
    label: "Lab Test",
    departments: [
      "Hematology",
      "Biochemistry",
      "Microbiology",
      "Serology",
      "Immunology",
      "Pathology",
      "Blood Bank",
    ],
    defaultUnit: "test",
    codePrefix: "LAB",
    fields: {
      showLoinc: true,
      showCpt: true,
      showSpecimenType: true,
      showFastingRequired: true,
      showTat: true,
      showMethod: true,
    },
    helperText: "LOINC = standard lab test code (optional)",
  },
  "Radiology/Imaging": {
    label: "Radiology/Imaging",
    departments: [
      "X-ray",
      "CT",
      "MRI",
      "Ultrasound",
      "Mammography",
      "Nuclear Medicine",
    ],
    defaultUnit: "study",
    codePrefix: "RAD",
    fields: {
      showCpt: true,
      requireCpt: false,
      showModality: true,
      showBodyPart: true,
      showContrast: true,
      showLaterality: true,
    },
    helperText: "CPT = billing code (if applicable in your country)",
  },
  "Procedure/OT": {
    label: "Procedure/OT",
    departments: [
      "General Surgery",
      "Orthopedics",
      "ENT",
      "Gynecology",
      "Urology",
      "Ophthalmology",
      "Dental",
    ],
    defaultUnit: "procedure",
    codePrefix: "PROC",
    fields: {
      showCpt: true,
      requireCpt: true,
      showAnesthesiaType: true,
      showEstimatedDuration: true,
      showLocation: true,
    },
    helperText: "CPT or ICD-10-PCS required for procedures",
  },
  "Nursing Service": {
    label: "Nursing Service",
    departments: ["Nursing", "Day Care"],
    defaultUnit: "event",
    codePrefix: "NRS",
    fields: {
      showHcpcs: true,
      showBillingBasis: true,
      showStaffLevel: true,
    },
    helperText: "HCPCS optional if payer requires",
  },
  "Room/Bed": {
    label: "Room/Bed",
    departments: [
      "General Ward",
      "Semi-Private",
      "Private",
      "ICU",
      "NICU",
      "PICU",
    ],
    defaultUnit: "day",
    codePrefix: "ROOM",
    fields: {
      showWardClass: true,
      showMealsIncluded: true,
      showMaxOccupancy: true,
    },
    helperText: "Per-day billing for room charges",
  },
  "Consultation": {
    label: "Consultation",
    departments: [
      "OPD",
      "Cardiology",
      "Endocrinology",
      "Neurology",
      "Dermatology",
      "Gastroenterology",
      "Pulmonology",
      "Nephrology",
      "Rheumatology",
      "Oncology",
    ],
    defaultUnit: "visit",
    codePrefix: "CONS",
    fields: {
      showCpt: true,
      showProviderType: true,
      showFollowUpWindow: true,
    },
    helperText: "E&M CPT codes optional",
  },
  "Service/Consumable": {
    label: "Service/Consumable",
    departments: ["Pharmacy/Stores", "Physiotherapy", "Equipment Use"],
    defaultUnit: "item",
    codePrefix: "SRV",
    fields: {
      showHcpcs: true,
      showBillingBasis: true,
      showEstimatedDuration: true,
    },
    helperText: "HCPCS if billable supply",
  },
  "Package": {
    label: "Package",
    departments: [
      "Preventive Care",
      "Pre-Op",
      "Maternity",
      "Executive Health Check",
      "Others",
    ],
    defaultUnit: "package",
    codePrefix: "PKG",
    fields: {
      showFastingRequired: true,
      showPackageBuilder: true,
      showPackageType: true,
      showPriceMode: true,
      showMultiVisit: true,
      showSampleSessions: true,
    },
    helperText: "Bundle multiple services into a package",
  },
};

// All available units
export const ALL_UNITS: { value: PricingUnit; label: string }[] = [
  { value: "test", label: "Test" },
  { value: "study", label: "Study" },
  { value: "procedure", label: "Procedure" },
  { value: "event", label: "Event" },
  { value: "hour", label: "Hour" },
  { value: "day", label: "Day" },
  { value: "visit", label: "Visit" },
  { value: "item", label: "Item" },
  { value: "package", label: "Package" },
];

// Package types
export const PACKAGE_TYPES = [
  "Preventive Care",
  "Pre-Op Assessment",
  "Maternity Care",
  "Executive Health Check",
  "Specialty Package",
  "Custom Bundle",
];

// Specimen types for lab tests
export const SPECIMEN_TYPES = [
  "Whole Blood (EDTA)",
  "Serum",
  "Plasma",
  "Urine",
  "Stool",
  "CSF",
  "Sputum",
  "Swab",
  "Tissue",
  "Other",
];

// Modalities for radiology
export const MODALITIES = [
  "X-Ray",
  "CT Scan",
  "MRI",
  "Ultrasound",
  "Fluoroscopy",
  "Mammography",
  "PET Scan",
  "Nuclear Medicine",
];

// Anesthesia types
export const ANESTHESIA_TYPES = [
  "Local",
  "Regional",
  "General",
  "Sedation",
  "None",
];

// Procedure locations
export const PROCEDURE_LOCATIONS = [
  "Operating Theatre",
  "Day Care",
  "Procedure Room",
  "Bedside",
];

// Billing basis for nursing
export const BILLING_BASIS = [
  { value: "event", label: "Per Event" },
  { value: "hour", label: "Per Hour" },
];

// Provider types for consultation
export const PROVIDER_TYPES = [
  "General Practitioner",
  "Specialist",
  "Super Specialist",
  "Consultant",
];

// Ward classes
export const WARD_CLASSES = [
  "General",
  "Semi-Private",
  "Private",
  "Deluxe",
  "Suite",
];

// Price modes for packages
export const PRICE_MODES = [
  { value: "bundled", label: "Bundled (Single package price)" },
  { value: "itemized", label: "Itemized (Sum of components)" },
];

// Laterality options
export const LATERALITY_OPTIONS = [
  "Left",
  "Right",
  "Bilateral",
  "N/A",
];

/**
 * Get department prefix for internal code generation
 */
export function getDepartmentPrefix(department: string): string {
  const prefixMap: Record<string, string> = {
    // Lab
    "Hematology": "HEM",
    "Biochemistry": "BIO",
    "Microbiology": "MIC",
    "Serology": "SER",
    "Immunology": "IMM",
    "Pathology": "PAT",
    "Blood Bank": "BBK",
    // Radiology
    "X-ray": "XR",
    "CT": "CT",
    "MRI": "MRI",
    "Ultrasound": "US",
    "Mammography": "MAM",
    "Nuclear Medicine": "NUC",
    // Procedure
    "General Surgery": "GS",
    "Orthopedics": "ORT",
    "ENT": "ENT",
    "Gynecology": "GYN",
    "Urology": "URO",
    "Ophthalmology": "OPH",
    "Dental": "DEN",
    // Nursing
    "Nursing": "NRS",
    "Day Care": "DC",
    // Room
    "General Ward": "GW",
    "Semi-Private": "SP",
    "Private": "PVT",
    "ICU": "ICU",
    "NICU": "NICU",
    "PICU": "PICU",
    // Consultation
    "OPD": "OPD",
    "Cardiology": "CAR",
    "Endocrinology": "END",
    "Neurology": "NEU",
    "Dermatology": "DER",
    "Gastroenterology": "GAS",
    "Pulmonology": "PUL",
    "Nephrology": "NEP",
    "Rheumatology": "RHE",
    "Oncology": "ONC",
    // Service
    "Pharmacy/Stores": "PHR",
    "Physiotherapy": "PHY",
    "Equipment Use": "EQP",
    // Package
    "Preventive Care": "PVN",
    "Pre-Op": "PRE",
    "Maternity": "MAT",
    "Executive Health Check": "EXE",
    "Others": "OTH",
  };
  
  return prefixMap[department] || department.slice(0, 3).toUpperCase();
}

/**
 * Generate internal code based on category and department
 */
export function generateCategoryCode(category: PricingCategory, department: string): string {
  const config = CATEGORY_CONFIG[category];
  const deptPrefix = getDepartmentPrefix(department);
  const sequence = Math.floor(Math.random() * 999).toString().padStart(3, "0");
  
  return `${config.codePrefix}-${deptPrefix}-${sequence}`;
}
