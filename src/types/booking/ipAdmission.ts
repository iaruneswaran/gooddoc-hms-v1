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

export type ServiceCategory = 'Procedure' | 'Nursing' | 'Pharmacy' | 'Lab' | 'Room';

export interface ServiceItem {
  id: string;
  code: string;
  name: string;
  category: ServiceCategory;
  price: number;
  taxPct: number;
}

export interface CartItem {
  itemId: string;
  code: string;
  name: string;
  category: ServiceCategory;
  unitPrice: number;
  taxPct: number;
  qty: number;
  discountPct?: number; // 0–100
}

export interface Totals {
  subtotal: number;
  discountTotal: number;
  taxTotal: number;
  netPayable: number;
}
