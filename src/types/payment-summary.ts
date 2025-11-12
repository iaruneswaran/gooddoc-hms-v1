export type PaymentMethod = 'upi' | 'card' | 'cash' | 'insurance' | 'outstanding' | 'advance';

export interface SummaryItem {
  id: PaymentMethod;
  title: string;
  amountInPaise: number;
  transactionCount?: number;
  statusBreakdown?: {
    approved?: number;
    pending?: number;
    rejected?: number;
  };
  delta?: {
    pct: number;
    direction: 'up' | 'down' | 'flat';
  };
  updatedAt: string;
}

export interface SummaryResponse {
  period: {
    from: string;
    to: string;
    compareFrom?: string;
    compareTo?: string;
  };
  items: SummaryItem[];
  totals: {
    collected: number;
    outstanding: number;
    advance: number;
    insuranceApproved: number;
  };
}
