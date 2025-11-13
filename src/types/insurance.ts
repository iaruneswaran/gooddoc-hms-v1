export type ClaimStatus = 
  | "Draft" 
  | "Submitted" 
  | "In Review" 
  | "Paid" 
  | "Denied" 
  | "Partially Paid" 
  | "Rejected" 
  | "Needs Info";

export type ServiceType = 
  | "Consultation" 
  | "Laboratory" 
  | "Imaging" 
  | "Procedure" 
  | "Pharmacy" 
  | "Other";

export type ClaimType = "Cashless" | "Reimbursement";
export type CareSetting = "OPD" | "IPD" | "Day Care";
export type Network = "In-Network" | "Out-of-Network";
export type PaymentType = "Insurance" | "Patient" | "Adjustment";
export type PaymentMode = "NEFT" | "RTGS" | "IMPS" | "Cheque" | "Cash" | "UPI";
export type DocumentTag = 
  | "Bill/Invoice" 
  | "Prescription" 
  | "Lab Report" 
  | "Imaging Report" 
  | "Discharge Summary" 
  | "E-card" 
  | "KYC" 
  | "Preauth letter" 
  | "Others";

export interface Patient {
  id: string;
  name: string;
  phone: string;
}

export interface Payer {
  id: string;
  name: string;
}

export interface Policy {
  policyNo: string;
  subscriberName: string;
  relationship: "Self" | "Spouse" | "Child" | "Parent";
  tpa?: string;
  validFrom: string;
  validTo: string;
  network: Network;
}

export interface Encounter {
  careSetting: CareSetting;
  dateOfService?: string;
  admissionDate?: string;
  dischargeDate?: string;
  facility: string;
  doctor: string;
  preauthNo?: string;
  diagnosis: string;
  notes?: string;
}

export interface ServiceLine {
  id: string;
  type: ServiceType;
  description: string;
  code?: string;
  units: number;
  unitCost: number; // in paise
  tax: number; // in paise
  discount: number; // in paise
  total: number; // in paise
}

export interface ClaimDocument {
  id: string;
  name: string;
  tag: DocumentTag;
  url: string;
  uploadedAt: string;
}

export interface Payment {
  id: string;
  type: PaymentType;
  amount: number; // in paise
  date: string;
  mode: PaymentMode;
  reference: string;
}

export interface BankDetails {
  accountHolder: string;
  bank: string;
  accountNo: string;
  ifsc: string;
  upi?: string;
}

export interface Note {
  id: string;
  author: string;
  visibility: "internal" | "external";
  text: string;
  createdAt: string;
}

export interface HistoryEntry {
  at: string;
  by: string;
  action: string;
}

export interface ClaimAmounts {
  billed: number; // in paise
  insurancePaid: number; // in paise
  adjustments: number; // in paise
  balance: number; // in paise
}

export interface Claim {
  id: string;
  claimNo: string;
  status: ClaimStatus;
  patient?: Patient;
  payer?: Payer;
  policy?: Policy;
  claimType?: ClaimType;
  encounter?: Encounter;
  services: ServiceLine[];
  amounts: ClaimAmounts;
  documents: ClaimDocument[];
  payments: Payment[];
  notes: Note[];
  bankDetails?: BankDetails;
  createdAt: string;
  updatedAt: string;
  history: HistoryEntry[];
}
