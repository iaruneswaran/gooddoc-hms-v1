/**
 * Format an invoice ID in the standard format: INV + 3 digits
 * @param sequence - The sequence number (1-999)
 * @returns Formatted invoice ID string (e.g., "INV123")
 */
export function formatInvoiceId(sequence: number): string {
  const seq = String(sequence).padStart(3, '0');
  return `INV${seq}`;
}

/**
 * Format a receipt ID in the standard format: RCP + 3 digits
 * @param sequence - The sequence number (1-999)
 * @returns Formatted receipt ID string (e.g., "RCP456")
 */
export function formatReceiptId(sequence: number): string {
  const seq = String(sequence).padStart(3, '0');
  return `RCP${seq}`;
}

/**
 * Format a bill ID in the standard format: BIL + 3 digits
 * @param sequence - The sequence number (1-999)
 * @returns Formatted bill ID string (e.g., "BIL789")
 */
export function formatBillId(sequence: number): string {
  const seq = String(sequence).padStart(3, '0');
  return `BIL${seq}`;
}

/**
 * Generate a random invoice ID
 * @returns Generated invoice ID string (e.g., "INV847")
 */
export function generateInvoiceId(): string {
  const sequence = Math.floor(1 + Math.random() * 999);
  return formatInvoiceId(sequence);
}

/**
 * Generate a random receipt ID
 * @returns Generated receipt ID string (e.g., "RCP234")
 */
export function generateReceiptId(): string {
  const sequence = Math.floor(1 + Math.random() * 999);
  return formatReceiptId(sequence);
}

/**
 * Generate a random bill ID
 * @returns Generated bill ID string (e.g., "BIL567")
 */
export function generateBillId(): string {
  const sequence = Math.floor(1 + Math.random() * 999);
  return formatBillId(sequence);
}

/**
 * Parse an invoice ID string into its sequence number
 * @param invoiceId - The invoice ID string (e.g., "INV123")
 * @returns The sequence number, or null if invalid
 */
export function parseInvoiceId(invoiceId: string): number | null {
  const match = invoiceId.match(/^INV(\d{3})$/);
  if (!match) return null;
  return parseInt(match[1], 10);
}

/**
 * Parse a receipt ID string into its sequence number
 * @param receiptId - The receipt ID string (e.g., "RCP456")
 * @returns The sequence number, or null if invalid
 */
export function parseReceiptId(receiptId: string): number | null {
  const match = receiptId.match(/^RCP(\d{3})$/);
  if (!match) return null;
  return parseInt(match[1], 10);
}
