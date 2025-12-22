import { useState } from "react";
import { AlertTriangle, CheckCircle2, Receipt, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
// Format currency for display
const formatCurrency = (amount: number) => {
  return `₹${amount.toLocaleString('en-IN', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`;
};

interface PendingBill {
  department: string;
  amount: number;
  items: number;
}

interface PendingBillsCheckProps {
  patientName: string;
  mrn: string;
  admissionId: string;
  onProceedToDischarge: () => void;
  onCollectPayment?: () => void;
  allBillsPaid?: boolean;
}

const PendingBillsCheck = ({
  patientName,
  mrn,
  admissionId,
  onProceedToDischarge,
  onCollectPayment,
  allBillsPaid = false,
}: PendingBillsCheckProps) => {
  const [isLoading, setIsLoading] = useState(false);

  // Mock data - In real app, this would come from an API
  const pendingBills: PendingBill[] = [
    { department: "Laboratory", amount: 3675, items: 4 },
    { department: "Radiology", amount: 7297.5, items: 2 },
    { department: "Pharmacy", amount: 1207.5, items: 2 },
    { department: "Procedures", amount: 22260, items: 3 },
  ];

  const totalPending = pendingBills.reduce((sum, bill) => sum + bill.amount, 0);

  const handleProceed = () => {
    setIsLoading(true);
    // Simulate loading
    setTimeout(() => {
      setIsLoading(false);
      onProceedToDischarge();
    }, 1500);
  };

  if (allBillsPaid) {
    return (
      <Card className="p-8">
        <div className="text-center space-y-6">
          <div className="w-16 h-16 rounded-full bg-green-500/10 flex items-center justify-center mx-auto">
            <CheckCircle2 className="w-8 h-8 text-green-500" />
          </div>
          <div>
            <h2 className="text-xl font-semibold text-foreground mb-2">All Bills Cleared</h2>
            <p className="text-muted-foreground">
              All outstanding bills for this admission have been settled. You can proceed to discharge.
            </p>
          </div>
          <div className="bg-muted/30 rounded-lg p-4 text-sm">
            <div className="flex justify-between mb-2">
              <span className="text-muted-foreground">Patient</span>
              <span className="font-medium">{patientName}</span>
            </div>
            <div className="flex justify-between mb-2">
              <span className="text-muted-foreground">MRN</span>
              <span className="font-medium">{mrn}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Admission ID</span>
              <span className="font-medium">{admissionId}</span>
            </div>
          </div>
          <Button 
            onClick={handleProceed} 
            className="w-full"
            disabled={isLoading}
          >
            {isLoading ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Loading Discharge Summary...
              </>
            ) : (
              "Proceed to Discharge"
            )}
          </Button>
        </div>
      </Card>
    );
  }

  return (
    <Card className="p-8">
      <div className="text-center space-y-6">
        <div className="w-16 h-16 rounded-full bg-amber-500/10 flex items-center justify-center mx-auto">
          <AlertTriangle className="w-8 h-8 text-amber-500" />
        </div>
        <div>
          <h2 className="text-xl font-semibold text-foreground mb-2">Pending Bills</h2>
          <p className="text-muted-foreground">
            There are outstanding bills that need to be cleared before proceeding with discharge.
          </p>
        </div>

        {/* Patient Info */}
        <div className="bg-muted/30 rounded-lg p-4 text-sm text-left">
          <div className="flex justify-between mb-2">
            <span className="text-muted-foreground">Patient</span>
            <span className="font-medium">{patientName}</span>
          </div>
          <div className="flex justify-between mb-2">
            <span className="text-muted-foreground">MRN</span>
            <span className="font-medium">{mrn}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">Admission ID</span>
            <span className="font-medium">{admissionId}</span>
          </div>
        </div>

        {/* Pending Bills Summary */}
        <div className="border border-border rounded-lg overflow-hidden">
          <div className="bg-muted/50 px-4 py-3 flex items-center gap-2 border-b border-border">
            <Receipt className="w-4 h-4 text-primary" />
            <span className="font-medium text-sm">Outstanding Bills</span>
          </div>
          <div className="divide-y divide-border">
            {pendingBills.map((bill, index) => (
              <div key={index} className="px-4 py-3 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <span className="text-sm font-medium">{bill.department}</span>
                  <Badge variant="secondary" className="text-xs">
                    {bill.items} items
                  </Badge>
                </div>
                <span className="font-semibold text-foreground">
                  {formatCurrency(bill.amount)}
                </span>
              </div>
            ))}
          </div>
          <div className="bg-primary/5 px-4 py-3 flex items-center justify-between border-t border-border">
            <span className="font-semibold text-foreground">Total Outstanding</span>
            <span className="font-bold text-lg text-primary">
              {formatCurrency(totalPending)}
            </span>
          </div>
        </div>

        {/* Warning Message */}
        <div className="bg-amber-500/10 border border-amber-500/20 rounded-lg p-4 text-left">
          <p className="text-sm text-amber-700 dark:text-amber-400">
            <strong>Note:</strong> Please clear all pending bills before proceeding with the discharge process. 
            You can collect payments from the patient or process insurance claims.
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-3">
          <Button variant="outline" className="flex-1" onClick={onCollectPayment}>
            Collect Payment
          </Button>
          <Button variant="secondary" className="flex-1" disabled>
            Proceed to Discharge
          </Button>
        </div>
      </div>
    </Card>
  );
};

export default PendingBillsCheck;
