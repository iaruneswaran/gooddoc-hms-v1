import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { format } from "date-fns";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatNumber(value: number): string {
  return value.toLocaleString('en-IN');
}

export function formatCurrency(value: number): string {
  return `₹${value.toLocaleString('en-IN')}`;
}

/**
 * Generate a Visit ID in the format VDDMMYY
 * @param date - The date for the visit (defaults to current date)
 * @returns Visit ID string (e.g., V171225 for December 17, 2025)
 */
export function generateVisitId(date: Date = new Date()): string {
  return `V${format(date, "ddMMyy")}`;
}

/**
 * Generate a unique Visit ID with sequence number: VDDMMYY-XXX
 * @param date - The date for the visit
 * @param sequence - Optional sequence number for multiple visits on same day
 * @returns Visit ID string (e.g., V171225-001)
 */
export function generateVisitIdWithSequence(date: Date = new Date(), sequence?: number): string {
  const baseId = generateVisitId(date);
  if (sequence !== undefined) {
    return `${baseId}-${String(sequence).padStart(3, "0")}`;
  }
  return baseId;
}
