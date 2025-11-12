import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Printer } from "lucide-react";

interface BillingSectionProps {
  visitId: string;
}

export function BillingSection({ visitId }: BillingSectionProps) {
  // This component embeds the existing Billing & Settlement view EXACTLY as-is
  // Reusing the exact structure from the BillingStep in Discharge.tsx
  
  return (
    <div className="space-y-6">
      <p className="text-sm text-muted-foreground">
        Review charges, apply adjustments, and collect payment.
      </p>

      {/* Totals Cards */}
      <div className="grid grid-cols-4 gap-4">
        <Card className="p-4 bg-muted/50">
          <p className="text-xs text-muted-foreground mb-1">Total Estimate</p>
          <p className="text-2xl font-bold text-foreground">₹82,000</p>
        </Card>
        <Card className="p-4 bg-muted/50">
          <p className="text-xs text-muted-foreground mb-1">Insurance Approved</p>
          <p className="text-2xl font-bold text-primary">₹80,000</p>
        </Card>
        <Card className="p-4 bg-muted/50">
          <p className="text-xs text-muted-foreground mb-1">Advance Applied</p>
          <p className="text-2xl font-bold text-foreground">₹0</p>
        </Card>
        <Card className="p-4 bg-muted/50">
          <p className="text-xs text-muted-foreground mb-1">Net Payable</p>
          <p className="text-2xl font-bold text-destructive">₹2,000</p>
        </Card>
      </div>

      {/* Patient Invoice Summary */}
      <div>
        <h3 className="text-base font-semibold mb-3">Patient Invoice Summary</h3>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Category</TableHead>
              <TableHead className="text-right">Amount (₹)</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            <TableRow>
              <TableCell>Room Charges (5 days)</TableCell>
              <TableCell className="text-right">₹25,000</TableCell>
            </TableRow>
            <TableRow>
              <TableCell>Doctor Consultation</TableCell>
              <TableCell className="text-right">₹5,000</TableCell>
            </TableRow>
            <TableRow>
              <TableCell>Medications & Consumables</TableCell>
              <TableCell className="text-right">₹18,000</TableCell>
            </TableRow>
            <TableRow>
              <TableCell>Laboratory Tests</TableCell>
              <TableCell className="text-right">₹12,000</TableCell>
            </TableRow>
            <TableRow>
              <TableCell>Radiology (X-ray, CT)</TableCell>
              <TableCell className="text-right">₹8,000</TableCell>
            </TableRow>
            <TableRow>
              <TableCell>Nursing & Procedures</TableCell>
              <TableCell className="text-right">₹10,000</TableCell>
            </TableRow>
            <TableRow>
              <TableCell>Other Services</TableCell>
              <TableCell className="text-right">₹4,000</TableCell>
            </TableRow>
            <TableRow className="font-semibold border-t-2">
              <TableCell>Total</TableCell>
              <TableCell className="text-right">₹82,000</TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </div>

      {/* Adjustments */}
      <div className="space-y-4">
        <h3 className="text-base font-semibold">Adjustments</h3>
        
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <label className="text-sm font-medium">Apply Advance Payment</label>
            <div className="flex gap-2">
              <Input type="number" placeholder="Amount" className="flex-1" />
              <Button variant="outline">Apply</Button>
            </div>
            <p className="text-xs text-muted-foreground">Available advance: ₹0</p>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Apply Discount</label>
            <div className="flex gap-2">
              <Input type="number" placeholder="Amount or %" className="flex-1" />
              <Button variant="outline">Apply</Button>
            </div>
            <p className="text-xs text-muted-foreground">Requires manager approval for &gt;10%</p>
          </div>
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium">Approved By</label>
          <Input placeholder="Manager name (for discounts)" />
        </div>
      </div>

      {/* Insurance Details */}
      <div className="space-y-4">
        <h3 className="text-base font-semibold">Insurance Details</h3>
        
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div>
            <p className="text-muted-foreground mb-1">Insurance Payer</p>
            <p className="font-medium">Star Health Insurance</p>
          </div>
          <div>
            <p className="text-muted-foreground mb-1">Policy Number</p>
            <p className="font-medium font-mono">POL-789456123</p>
          </div>
          <div>
            <p className="text-muted-foreground mb-1">Pre-Auth Number</p>
            <p className="font-medium font-mono">PRE-20251101-001</p>
          </div>
          <div>
            <p className="text-muted-foreground mb-1">Insurance Approved</p>
            <p className="font-bold text-primary">₹80,000</p>
          </div>
          <div>
            <p className="text-muted-foreground mb-1">Co-pay (Patient Share)</p>
            <p className="font-medium">₹2,000</p>
          </div>
          <div>
            <p className="text-muted-foreground mb-1">Deductible</p>
            <p className="font-medium">₹0</p>
          </div>
        </div>

        <div className="p-4 bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-lg">
          <p className="text-sm text-amber-800 dark:text-amber-400">
            <strong>Note:</strong> Patient is responsible for co-pay amount of ₹2,000.
          </p>
        </div>
      </div>

      {/* Payment Actions */}
      <div className="flex justify-between items-center pt-4 border-t">
        <div className="space-x-2">
          <Button variant="outline">
            <Printer className="w-4 h-4 mr-2" />
            Print Invoice
          </Button>
        </div>
        <div className="space-x-2">
          <Button size="lg">Collect Payment (₹2,000)</Button>
        </div>
      </div>

      <div className="p-4 bg-destructive/10 border border-destructive/20 rounded-lg">
        <p className="text-sm text-destructive font-medium">
          ⚠ Cannot finalize discharge while outstanding balance &gt; 0
        </p>
      </div>
    </div>
  );
}
