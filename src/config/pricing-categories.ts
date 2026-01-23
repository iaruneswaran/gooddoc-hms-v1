/**
 * Pricing catalog category configuration
 * Defines categories, department mappings, field rules, and unit defaults
 */

export type PricingCategory =
  | "Lab Test"
  | "Imaging"
  | "Procedure"
  | "Consultation"
  | "Nursing"
  | "Room"
  | "Pharmacy"
  | "Package";

export type PricingUnit = "test" | "study" | "procedure" | "event" | "hour" | "day" | "visit" | "item" | "package" | "dose" | "unit" | "session" | "case" | "trip" | "copy" | "certificate";

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
  "Imaging": {
    label: "Imaging",
    departments: [
      "Radiology",
      "Nuclear Medicine",
      "Dental",
    ],
    defaultUnit: "study",
    codePrefix: "IMG",
    fields: {
      showCpt: true,
      requireCpt: false,
      showModality: true,
      showBodyPart: true,
      showContrast: true,
      showLaterality: true,
    },
    helperText: "CPT = billing code (if applicable)",
  },
  "Procedure": {
    label: "Procedure",
    departments: [
      "Surgery",
      "Orthopaedics",
      "ENT",
      "Obstetrics & Gynaecology",
      "Urology",
      "Ophthalmology",
      "Cardiology",
      "Gastroenterology",
      "Pulmonology",
      "Neurology",
      "Nephrology",
      "Anaesthesia",
      "Dermatology",
      "ICU",
      "Emergency",
      "Physiotherapy",
      "Audiology",
      "Speech Therapy",
      "Dietetics",
      "Vaccination",
      "CSSD",
      "Transport",
      "Home Care",
      "Mortuary",
      "Medical Records",
      "Hospital Services",
      "Administration",
    ],
    defaultUnit: "procedure",
    codePrefix: "PROC",
    fields: {
      showCpt: true,
      requireCpt: false,
      showAnesthesiaType: true,
      showEstimatedDuration: true,
      showLocation: true,
    },
    helperText: "CPT or ICD-10-PCS for procedures",
  },
  "Consultation": {
    label: "Consultation",
    departments: [
      "General Medicine",
      "Cardiology",
      "Endocrinology",
      "Neurology",
      "Dermatology",
      "Gastroenterology",
      "Pulmonology",
      "Nephrology",
      "Rheumatology",
      "Oncology",
      "Anaesthesia",
      "Physiotherapy",
      "Dietetics",
      "Home Care",
    ],
    defaultUnit: "visit",
    codePrefix: "CON",
    fields: {
      showCpt: true,
      showProviderType: true,
      showFollowUpWindow: true,
    },
    helperText: "E&M CPT codes optional",
  },
  "Nursing": {
    label: "Nursing",
    departments: [
      "Nursing",
      "Home Care",
    ],
    defaultUnit: "event",
    codePrefix: "NRS",
    fields: {
      showHcpcs: true,
      showBillingBasis: true,
      showStaffLevel: true,
    },
    helperText: "HCPCS optional if payer requires",
  },
  "Room": {
    label: "Room",
    departments: [
      "Inpatient",
      "ICU",
    ],
    defaultUnit: "day",
    codePrefix: "BED",
    fields: {
      showWardClass: true,
      showMealsIncluded: true,
      showMaxOccupancy: true,
    },
    helperText: "Per-day billing for room charges",
  },
  "Pharmacy": {
    label: "Pharmacy",
    departments: [
      "Pharmacy",
    ],
    defaultUnit: "item",
    codePrefix: "PHA",
    fields: {
      showHcpcs: true,
      showBillingBasis: true,
    },
    helperText: "SKU-based items",
  },
  "Package": {
    label: "Package",
    departments: [
      "Preventive Care",
      "Pre-Op",
      "Maternity",
      "Executive Health Check",
      "Ophthalmology",
      "Dietetics",
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
  { value: "session", label: "Session" },
  { value: "hour", label: "Hour" },
  { value: "day", label: "Day" },
  { value: "visit", label: "Visit" },
  { value: "item", label: "Item" },
  { value: "package", label: "Package" },
  { value: "dose", label: "Dose" },
  { value: "unit", label: "Unit" },
  { value: "case", label: "Case" },
  { value: "trip", label: "Trip" },
  { value: "copy", label: "Copy" },
  { value: "certificate", label: "Certificate" },
];

// All departments (comprehensive list)
export const ALL_DEPARTMENTS = [
  // Administration
  "Administration",
  // Clinical
  "General Medicine",
  "Cardiology",
  "Neurology",
  "Gastroenterology",
  "Pulmonology",
  "Nephrology",
  "Endocrinology",
  "Rheumatology",
  "Oncology",
  "Dermatology",
  // Surgical
  "Surgery",
  "Orthopaedics",
  "ENT",
  "Obstetrics & Gynaecology",
  "Urology",
  "Ophthalmology",
  // Support
  "Anaesthesia",
  "Emergency",
  "ICU",
  "Nursing",
  "Physiotherapy",
  "Speech Therapy",
  "Audiology",
  "Dietetics",
  // Diagnostics
  "Hematology",
  "Biochemistry",
  "Microbiology",
  "Serology",
  "Immunology",
  "Pathology",
  "Radiology",
  "Nuclear Medicine",
  // Services
  "Pharmacy",
  "Blood Bank",
  "Vaccination",
  "CSSD",
  "Transport",
  "Home Care",
  "Mortuary",
  "Medical Records",
  "Hospital Services",
  "Dental",
  // Inpatient
  "Inpatient",
  // Packages
  "Preventive Care",
  "Pre-Op",
  "Maternity",
  "Executive Health Check",
  "Others",
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
  "Doppler",
  "Interventional",
  "CBCT",
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
  "Cath Lab",
  "Endoscopy Suite",
];

// Billing basis for nursing
export const BILLING_BASIS = [
  { value: "event", label: "Per Event" },
  { value: "hour", label: "Per Hour" },
  { value: "day", label: "Per Day" },
  { value: "session", label: "Per Session" },
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
  "ICU",
  "HDU",
  "PICU",
  "NICU",
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

// Code prefixes for internal code generation
export const CODE_PREFIXES: Record<string, string> = {
  // Administration
  "Administration": "ADM",
  // Clinical Consultations
  "General Medicine": "OPD",
  "Cardiology": "CAR",
  "Neurology": "NEU",
  "Gastroenterology": "GAS",
  "Pulmonology": "PUL",
  "Nephrology": "NEP",
  "Endocrinology": "END",
  "Rheumatology": "RHE",
  "Oncology": "ONC",
  "Dermatology": "DER",
  // Surgical
  "Surgery": "OT",
  "Orthopaedics": "ORT",
  "ENT": "ENT",
  "Obstetrics & Gynaecology": "OBS",
  "Urology": "URO",
  "Ophthalmology": "OPH",
  // Support
  "Anaesthesia": "ANE",
  "Emergency": "EMR",
  "ICU": "ICU",
  "Nursing": "NRS",
  "Physiotherapy": "PHY",
  "Speech Therapy": "SPH",
  "Audiology": "AUD",
  "Dietetics": "DIE",
  // Diagnostics - Lab
  "Hematology": "HEM",
  "Biochemistry": "BIO",
  "Microbiology": "MIC",
  "Serology": "SER",
  "Immunology": "IMM",
  "Pathology": "PAT",
  // Diagnostics - Imaging
  "Radiology": "RAD",
  "Nuclear Medicine": "NM",
  "Dental": "DEN",
  // Services
  "Pharmacy": "PHA",
  "Blood Bank": "BBK",
  "Vaccination": "VAC",
  "CSSD": "CSSD",
  "Transport": "AMB",
  "Home Care": "HME",
  "Mortuary": "MOR",
  "Medical Records": "DOC",
  "Hospital Services": "MSC",
  // Inpatient
  "Inpatient": "BED",
  // Packages
  "Preventive Care": "PKG",
  "Pre-Op": "PKG",
  "Maternity": "PKG",
  "Executive Health Check": "PKG",
  "Others": "OTH",
};

/**
 * Get department prefix for internal code generation
 */
export function getDepartmentPrefix(department: string): string {
  return CODE_PREFIXES[department] || department.slice(0, 3).toUpperCase();
}

/**
 * Generate internal code based on category and department
 */
export function generateCategoryCode(category: PricingCategory, department: string): string {
  const deptPrefix = getDepartmentPrefix(department);
  const sequence = Math.floor(Math.random() * 999).toString().padStart(3, "0");
  
  return `${deptPrefix}${sequence}`;
}
