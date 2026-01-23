import { PricingItem } from "@/types/pricing-catalog";
import { LAB_MASTER_CATALOG, HEALTH_PACKAGES } from "./lab-master-catalog";
import { ALL_HOSPITAL_SERVICES, HospitalService } from "./hospital-services-catalog";

// Map hospital service categories to pricing categories
const mapCategoryToPricingCategory = (category: string): "Lab Test" | "Doctor Fee" | "Procedure" | "Imaging" | "Room" | "Pharmacy" | "Package" => {
  switch (category) {
    case "Lab Test":
      return "Lab Test";
    case "Consultation":
      return "Doctor Fee";
    case "Room":
      return "Room";
    case "Pharmacy":
      return "Pharmacy";
    case "Package":
      return "Package";
    case "Imaging":
      return "Imaging";
    default:
      return "Procedure";
  }
};

// Convert lab catalog to pricing items
const labPricingItems: PricingItem[] = LAB_MASTER_CATALOG.map((test) => ({
  id: `price-${test.code}`,
  name: test.name,
  category: "Lab Test" as const,
  department: test.department,
  codes: {
    internal: test.code,
    cpt: test.loinc || "",
    icd: "",
  },
  description: `${test.shortName ? `(${test.shortName}) ` : ""}${test.patientPrep || ""} ${test.subTests ? `Includes ${test.subTests.length} parameters` : ""}`.trim(),
  unit: "test",
  visibility: test.visibility === "patient_and_doctor" ? "portal" : "staff",
  pricing: {
    currency: "INR" as const,
    cost: Math.round(test.mrp * 0.4 * 100),
    basePrice: test.mrp * 100,
    markupPct: 0,
    discountPct: 0,
    taxPct: 0,
    netPrice: test.mrp * 100,
    tiers: {
      cash: test.mrp * 100,
      insurance: Math.round(test.mrp * 0.9 * 100),
      corporate: Math.round(test.mrp * 0.95 * 100),
    },
    effectiveFrom: "2025-01-01",
    effectiveTo: null,
  },
  branchOverrides: [],
  status: "Published" as const,
  tags: [test.department.toLowerCase(), test.type, ...(test.clinicalKeywords || [])],
  turnaroundTime: `${test.tat.routineHours}h${test.tat.statHours ? ` (STAT: ${test.tat.statHours}h)` : ""}`,
  requiresDoctorOrder: test.type === "microbiology" || test.type === "pathology",
  availability: "In Stock" as const,
  createdBy: "system",
  createdAt: "2025-01-01T00:00:00Z",
  updatedBy: "system",
  updatedAt: "2025-01-01T00:00:00Z",
  version: 1,
  audit: [],
}));

// Convert packages to pricing items
const packagePricingItems: PricingItem[] = HEALTH_PACKAGES.map((pkg) => ({
  id: `price-${pkg.code}`,
  name: pkg.name,
  category: "Package" as const,
  department: "Preventive Care",
  codes: {
    internal: pkg.code,
    cpt: "",
    icd: "",
  },
  description: pkg.description,
  unit: "package",
  visibility: "portal",
  pricing: {
    currency: "INR" as const,
    cost: Math.round(pkg.mrp * 0.5 * 100),
    basePrice: pkg.mrp * 100,
    markupPct: 0,
    discountPct: pkg.discountPct || 0,
    taxPct: 0,
    netPrice: Math.round(pkg.mrp * (1 - (pkg.discountPct || 0) / 100) * 100),
    tiers: {
      cash: Math.round(pkg.mrp * (1 - (pkg.discountPct || 0) / 100) * 100),
      insurance: Math.round(pkg.mrp * 0.85 * 100),
      corporate: Math.round(pkg.mrp * 0.9 * 100),
    },
    effectiveFrom: "2025-01-01",
    effectiveTo: null,
  },
  branchOverrides: [],
  status: "Published" as const,
  tags: ["package", pkg.category.toLowerCase(), "health check"],
  turnaroundTime: "48 hours",
  requiresDoctorOrder: false,
  availability: "In Stock" as const,
  slaNote: `Includes ${pkg.includedCodes.length} tests`,
  createdBy: "system",
  createdAt: "2025-01-01T00:00:00Z",
  updatedBy: "system",
  updatedAt: "2025-01-01T00:00:00Z",
  version: 1,
  audit: [],
}));

// Convert hospital services to pricing items
const hospitalServicePricingItems: PricingItem[] = ALL_HOSPITAL_SERVICES.map((service: HospitalService) => ({
  id: `price-${service.code}`,
  name: service.name,
  category: mapCategoryToPricingCategory(service.category),
  department: service.department,
  codes: {
    internal: service.code,
    cpt: "",
    icd: "",
  },
  description: `${service.name} - ${service.unit}`,
  unit: service.unit,
  visibility: "staff" as const,
  pricing: {
    currency: "INR" as const,
    cost: Math.round(service.mrp * 0.4 * 100),
    basePrice: service.mrp * 100,
    markupPct: 0,
    discountPct: 0,
    taxPct: 0,
    netPrice: service.mrp * 100,
    tiers: {
      cash: service.mrp * 100,
      insurance: Math.round(service.mrp * 0.9 * 100),
      corporate: Math.round(service.mrp * 0.95 * 100),
    },
    effectiveFrom: "2025-01-01",
    effectiveTo: null,
  },
  branchOverrides: [],
  status: "Published" as const,
  tags: [service.department.toLowerCase(), service.category.toLowerCase()],
  requiresDoctorOrder: false,
  availability: "In Stock" as const,
  createdBy: "system",
  createdAt: "2025-01-01T00:00:00Z",
  updatedBy: "system",
  updatedAt: "2025-01-01T00:00:00Z",
  version: 1,
  audit: [],
}));

export const MOCK_PRICING_ITEMS: PricingItem[] = [
  ...labPricingItems,
  ...packagePricingItems,
  ...hospitalServicePricingItems,
];
