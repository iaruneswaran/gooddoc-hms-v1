import { ServiceItem } from "@/types/booking/ipAdmission";

// Mock services data
// TODO: Replace with API call GET /services?query=&category=
export const MOCK_SERVICES: ServiceItem[] = [
  { id: 'SRV001', code: 'PROC-APP', name: 'Appendectomy', category: 'Procedure', price: 35000, taxPct: 12 },
  { id: 'SRV002', code: 'PROC-CATH', name: 'Cardiac Catheterization', category: 'Procedure', price: 28000, taxPct: 12 },
  { id: 'SRV003', code: 'NURS-CHG', name: 'Nursing Care (per day)', category: 'Nursing', price: 1200, taxPct: 5 },
  { id: 'SRV004', code: 'ROOM-SEM', name: 'Semi-Private Room (per day)', category: 'Room', price: 2500, taxPct: 12 },
  { id: 'SRV005', code: 'ROOM-PRI', name: 'Private Room (per day)', category: 'Room', price: 5000, taxPct: 12 },
  { id: 'SRV006', code: 'LAB-CBC', name: 'Complete Blood Count (CBC)', category: 'Lab', price: 450, taxPct: 0 },
  { id: 'SRV007', code: 'PROC-DRESS', name: 'Wound Dressing', category: 'Procedure', price: 700, taxPct: 5 },
  { id: 'SRV008', code: 'PHARM-ANTB', name: 'Antibiotic Dose', category: 'Pharmacy', price: 350, taxPct: 5 },
  { id: 'SRV009', code: 'PROC-NEB', name: 'Nebulization', category: 'Procedure', price: 300, taxPct: 5 },
  { id: 'SRV010', code: 'LAB-LFT', name: 'Liver Function Test', category: 'Lab', price: 900, taxPct: 0 },
  { id: 'SRV011', code: 'PROC-SUTURE', name: 'Suturing', category: 'Procedure', price: 1500, taxPct: 5 },
  { id: 'SRV012', code: 'PHARM-PAIN', name: 'Pain Relief Medication', category: 'Pharmacy', price: 250, taxPct: 5 },
  { id: 'SRV013', code: 'LAB-URINE', name: 'Urine Analysis', category: 'Lab', price: 300, taxPct: 0 },
  { id: 'SRV014', code: 'NURS-IV', name: 'IV Monitoring (per day)', category: 'Nursing', price: 800, taxPct: 5 },
  { id: 'SRV015', code: 'ROOM-GEN', name: 'General Room (per day)', category: 'Room', price: 1500, taxPct: 12 },
];

export function searchServices(query: string, categories: string[]): ServiceItem[] {
  const lowerQuery = query.toLowerCase().trim();
  
  return MOCK_SERVICES.filter((service) => {
    const matchesQuery = !lowerQuery || 
      service.name.toLowerCase().includes(lowerQuery) ||
      service.code.toLowerCase().includes(lowerQuery);
    
    const matchesCategory = categories.length === 0 || categories.includes(service.category);
    
    return matchesQuery && matchesCategory;
  });
}
