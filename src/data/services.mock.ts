import { ServiceItem } from "@/types/booking/ipAdmission";
import { MOCK_PRICING_ITEMS } from "@/data/pricing-catalog.mock";

// Transform pricing catalog items to ServiceItem format
export const MOCK_SERVICES: ServiceItem[] = MOCK_PRICING_ITEMS.map((item) => ({
  id: item.id,
  code: item.codes.internal,
  name: item.name,
  category: item.category as ServiceItem['category'],
  subCategory: item.department,
  price: item.pricing.netPrice / 100, // Convert from paise to rupees
  taxPct: item.pricing.taxPct,
  description: item.description,
}));

export const SERVICE_CATEGORIES = [
  { id: 'Procedure', name: 'Procedures', icon: 'stethoscope', color: 'bg-blue-500' },
  { id: 'Lab Test', name: 'Laboratory', icon: 'flask', color: 'bg-purple-500' },
  { id: 'Imaging', name: 'Radiology', icon: 'scan', color: 'bg-amber-500' },
  { id: 'Pharmacy', name: 'Pharmacy', icon: 'pill', color: 'bg-green-500' },
  { id: 'Nursing', name: 'Nursing', icon: 'heart-pulse', color: 'bg-pink-500' },
  { id: 'Room', name: 'Room & Bed', icon: 'bed', color: 'bg-cyan-500' },
  { id: 'Consultation', name: 'Consultation', icon: 'user-round', color: 'bg-indigo-500' },
  { id: 'Package', name: 'Packages', icon: 'package', color: 'bg-orange-500' },
];

export function searchServices(query: string, categories?: string[]): ServiceItem[] {
  const lowerQuery = query.toLowerCase().trim();
  
  let filtered = MOCK_SERVICES;
  
  // Filter by categories if provided
  if (categories && categories.length > 0) {
    filtered = filtered.filter((service) => categories.includes(service.category));
  }
  
  // Filter by search query
  if (lowerQuery) {
    filtered = filtered.filter((service) => {
      return service.name.toLowerCase().includes(lowerQuery) ||
        service.code.toLowerCase().includes(lowerQuery) ||
        (service.description?.toLowerCase().includes(lowerQuery));
    });
  }
  
  return filtered.slice(0, 50); // Limit results to 50
}

export function getServicesByCategory(category: string): ServiceItem[] {
  return MOCK_SERVICES.filter(s => s.category === category);
}

export function getSubCategories(category: string): string[] {
  const services = getServicesByCategory(category);
  return [...new Set(services.map(s => s.subCategory).filter(Boolean) as string[])];
}
