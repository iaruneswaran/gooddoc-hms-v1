import { useMutation, useQuery } from "@tanstack/react-query";
import { PricingItemFormData, PricingCategory } from "@/types/pricing-item";
import { CATEGORY_CONFIG, PricingCategory as ConfigCategory } from "@/config/pricing-categories";

// Mock data - now derived from category config
const MOCK_BRANCHES = [
  { id: "branch-001", name: "Main Hospital" },
  { id: "branch-002", name: "Branch A" },
  { id: "branch-003", name: "Branch B" },
];

// Store used codes in memory
const usedInternalCodes = new Set(["LAB-HEM-001", "RAD-CT-001", "PKG-001"]);

// Mock catalog items for package component selection
export interface CatalogItem {
  id: string;
  name: string;
  category: string;
  department: string;
  internalCode: string;
  unitPrice: number;
}

const MOCK_CATALOG_ITEMS: CatalogItem[] = [
  { id: "item-001", name: "Complete Blood Count (CBC)", category: "Lab Test", department: "Hematology", internalCode: "LAB-HEM-001", unitPrice: 350 },
  { id: "item-002", name: "Blood Group & Rh Typing", category: "Lab Test", department: "Blood Bank", internalCode: "LAB-BBK-001", unitPrice: 200 },
  { id: "item-003", name: "HIV 1 & 2 Antibody", category: "Lab Test", department: "Serology", internalCode: "LAB-SER-001", unitPrice: 450 },
  { id: "item-004", name: "HBsAg (Hepatitis B)", category: "Lab Test", department: "Serology", internalCode: "LAB-SER-002", unitPrice: 400 },
  { id: "item-005", name: "VDRL", category: "Lab Test", department: "Serology", internalCode: "LAB-SER-003", unitPrice: 250 },
  { id: "item-006", name: "TSH (Thyroid)", category: "Lab Test", department: "Biochemistry", internalCode: "LAB-BIO-001", unitPrice: 380 },
  { id: "item-007", name: "Urine Routine", category: "Lab Test", department: "Pathology", internalCode: "LAB-PAT-001", unitPrice: 150 },
  { id: "item-008", name: "Blood Sugar Fasting", category: "Lab Test", department: "Biochemistry", internalCode: "LAB-BIO-002", unitPrice: 120 },
  { id: "item-009", name: "Lipid Profile", category: "Lab Test", department: "Biochemistry", internalCode: "LAB-BIO-003", unitPrice: 650 },
  { id: "item-010", name: "Liver Function Test", category: "Lab Test", department: "Biochemistry", internalCode: "LAB-BIO-004", unitPrice: 750 },
  { id: "item-011", name: "Kidney Function Test", category: "Lab Test", department: "Biochemistry", internalCode: "LAB-BIO-005", unitPrice: 600 },
  { id: "item-012", name: "Chest X-Ray", category: "Radiology/Imaging", department: "X-ray", internalCode: "RAD-XR-001", unitPrice: 500 },
  { id: "item-013", name: "ECG", category: "Procedure/OT", department: "General Surgery", internalCode: "PROC-GS-001", unitPrice: 300 },
  { id: "item-014", name: "Ultrasound Abdomen", category: "Radiology/Imaging", department: "Ultrasound", internalCode: "RAD-US-001", unitPrice: 1200 },
  { id: "item-015", name: "CT Scan Brain", category: "Radiology/Imaging", department: "CT", internalCode: "RAD-CT-001", unitPrice: 3500 },
  { id: "item-016", name: "Doctor Consultation", category: "Consultation", department: "OPD", internalCode: "CONS-OPD-001", unitPrice: 500 },
];

/**
 * Get list of categories
 */
export function useCategories() {
  return useQuery({
    queryKey: ["categories"],
    queryFn: async () => {
      await new Promise((resolve) => setTimeout(resolve, 200));
      return Object.keys(CATEGORY_CONFIG) as ConfigCategory[];
    },
  });
}

/**
 * Get departments filtered by category
 */
export function useDepartments(category?: PricingCategory) {
  return useQuery({
    queryKey: ["departments", category],
    queryFn: async () => {
      await new Promise((resolve) => setTimeout(resolve, 300));
      
      if (category && CATEGORY_CONFIG[category as ConfigCategory]) {
        return CATEGORY_CONFIG[category as ConfigCategory].departments;
      }
      
      // Return all departments if no category selected
      const allDepartments = Object.values(CATEGORY_CONFIG).flatMap(c => c.departments);
      return [...new Set(allDepartments)];
    },
    enabled: true,
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
 * Check if internal code is unique
 */
export async function checkInternalCodeUnique(code: string): Promise<{ unique: boolean }> {
  await new Promise((resolve) => setTimeout(resolve, 500));
  
  const upperCode = code.toUpperCase().trim();
  const isUnique = !usedInternalCodes.has(upperCode);
  
  return { unique: isUnique };
}

/**
 * Search catalog items for package builder
 */
export function useCatalogSearch(query: string, categoryFilter?: string) {
  return useQuery({
    queryKey: ["catalogSearch", query, categoryFilter],
    queryFn: async () => {
      await new Promise((resolve) => setTimeout(resolve, 300));
      
      let filtered = MOCK_CATALOG_ITEMS;
      
      if (categoryFilter && categoryFilter !== "All") {
        filtered = filtered.filter(item => item.category === categoryFilter);
      }
      
      if (query) {
        const lowerQuery = query.toLowerCase();
        filtered = filtered.filter(
          item =>
            item.name.toLowerCase().includes(lowerQuery) ||
            item.internalCode.toLowerCase().includes(lowerQuery) ||
            item.department.toLowerCase().includes(lowerQuery)
        );
      }
      
      return filtered;
    },
    enabled: true,
  });
}

/**
 * Get all catalog items (for package builder)
 */
export function useCatalogItems() {
  return useQuery({
    queryKey: ["catalogItems"],
    queryFn: async () => {
      await new Promise((resolve) => setTimeout(resolve, 300));
      return MOCK_CATALOG_ITEMS;
    },
  });
}

/**
 * Create new pricing item
 */
export function useCreatePricingItem() {
  return useMutation({
    mutationFn: async (data: PricingItemFormData): Promise<PricingItemFormData & { id: string }> => {
      await new Promise((resolve) => setTimeout(resolve, 800));
      
      // Add the internal code to used codes
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
