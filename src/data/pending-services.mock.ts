import { ServiceItem } from "@/types/booking/ipAdmission";
import { MOCK_SERVICES } from "./services.mock";

export interface PendingService {
  id: string;
  serviceId: string;
  service: ServiceItem;
  performedAt: string;
  performedBy: string;
  quantity: number;
  notes?: string;
  status: 'pending' | 'billed';
}

// Helper to safely find a service - returns a fallback if not found
const findService = (code: string): ServiceItem => {
  const found = MOCK_SERVICES.find(s => s.code === code);
  if (found) return found;
  
  // Return first available service as fallback
  return MOCK_SERVICES[0] || {
    id: 'fallback',
    code: code,
    name: 'Unknown Service',
    category: 'Nursing',
    price: 0,
    taxPct: 0,
  };
};

// Mock pending services performed by nurses for the patient
// Using actual codes from the hospital services catalog
export const MOCK_PENDING_SERVICES: PendingService[] = [
  {
    id: 'PS001',
    serviceId: 'svc-NRS003',
    service: findService('NRS003'), // IV cannulation
    performedAt: '2025-12-22T09:30:00',
    performedBy: 'Nurse Priya Sharma',
    quantity: 1,
    notes: 'IV line inserted successfully',
    status: 'pending'
  },
  {
    id: 'PS002',
    serviceId: 'svc-NRS002',
    service: findService('NRS002'), // Injection IV push
    performedAt: '2025-12-22T08:15:00',
    performedBy: 'Nurse Priya Sharma',
    quantity: 1,
    notes: 'IV medication administered',
    status: 'pending'
  },
  {
    id: 'PS003',
    serviceId: 'svc-NRS005',
    service: findService('NRS005'), // Nebulisation
    performedAt: '2025-12-22T10:00:00',
    performedBy: 'Nurse Anil Kumar',
    quantity: 2,
    notes: 'Morning nebulisation completed',
    status: 'pending'
  },
  {
    id: 'PS004',
    serviceId: 'svc-NRS007',
    service: findService('NRS007'), // Wound dressing – large/complex
    performedAt: '2025-12-22T11:30:00',
    performedBy: 'Nurse Priya Sharma',
    quantity: 1,
    notes: 'Post-surgery wound dressing',
    status: 'pending'
  },
  {
    id: 'PS005',
    serviceId: 'svc-GAS001',
    service: findService('GAS001'), // Oxygen therapy
    performedAt: '2025-12-22T07:00:00',
    performedBy: 'Nurse Anil Kumar',
    quantity: 4,
    notes: 'Oxygen therapy 4 hours',
    status: 'pending'
  },
];

export function getPendingServicesForPatient(patientId: string): PendingService[] {
  // In real app, filter by patientId
  return MOCK_PENDING_SERVICES.filter(s => s.status === 'pending');
}
