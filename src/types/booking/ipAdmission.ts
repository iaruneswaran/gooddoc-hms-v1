// IP Admission and Services types

export type AdmissionTab = 'Admission' | 'Services';

export interface IPAdmission {
  department?: string;
  doctor?: string;
  ward?: string;
  bed?: string;
  bedType?: 'General' | 'Semi-Private' | 'Private';
  reason?: string;
  notes?: string;
  baseCharge?: number; // derived from bedType
}

export type ServiceCategory = 'Procedure' | 'Nursing' | 'Pharmacy' | 'Lab' | 'Room' | 'Radiology' | 'Consultation';

export interface ServiceItem {
  id: string;
  code: string;
  name: string;
  category: ServiceCategory;
  subCategory?: string;
  price: number;
  taxPct: number;
  description?: string;
}

export interface CartItem {
  itemId: string;
  code: string;
  name: string;
  category: ServiceCategory;
  subCategory?: string;
  unitPrice: number;
  taxPct: number;
  qty: number;
  discountPct?: number; // 0–100
  description?: string;
}

export interface Totals {
  subtotal: number;
  discountTotal: number;
  taxTotal: number;
  netPayable: number;
}
