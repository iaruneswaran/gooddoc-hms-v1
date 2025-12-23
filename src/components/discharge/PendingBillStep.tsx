import { useState } from "react";
import { format } from "date-fns";
import {
  Search,
  Download,
  Receipt,
  CreditCard,
  FileText,
  Printer,
  AlertTriangle,
  CheckCircle2,
  Eye,
} from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Separator } from "@/components/ui/separator";
import { ScrollArea } from "@/components/ui/scroll-area";
import { PendingBill, BillStatus, PayerType, StepStatus } from "@/types/discharge-flow";
import { formatINR } from "@/utils/currency";
import CollectPaymentModal from "./CollectPaymentModal";

interface PendingBillStepProps {
  bills: PendingBill[];
  patientName: string;
  mrn: string;
  encounterId: string;
  stepStatus: StepStatus;
  onBillsUpdated: (bills: PendingBill[]) => void;
  onStepComplete: () => void;
  requireBillingClearance: boolean;
}

const formatCurrency = (amount: number) => formatINR(amount * 100);

const getStatusBadge = (status: BillStatus) => {
  const styles = {
    Pending: "bg-amber-500/10 text-amber-600 border-amber-500/30",
    PartiallyPaid: "bg-blue-500/10 text-blue-600 border-blue-500/30",
    Cleared: "bg-green-500/10 text-green-600 border-green-500/30",
    OnHold: "bg-gray-500/10 text-gray-600 border-gray-500/30",
  };
  const labels = {
    Pending: "Pending",
    PartiallyPaid: "Partial",
    Cleared: "Cleared",
    OnHold: "On Hold",
  };
  return (
    <Badge variant="secondary" className={styles[status]}>
      {labels[status]}
    </Badge>
  );
};

const getPayerBadge = (payerType: PayerType, payerName?: string) => {
  const styles = {
    Self: "bg-slate-500/10 text-slate-600 border-slate-500/30",
    Insurance: "bg-purple-500/10 text-purple-600 border-purple-500/30",
    TPA: "bg-indigo-500/10 text-indigo-600 border-indigo-500/30",
  };
  return (
    <Badge variant="secondary" className={styles[payerType]}>
      {payerType === "Self" ? "Self Pay" : payerName || payerType}
    </Badge>
  );
};

const getOutstandingRiskColor = (amount: number) => {
  if (amount === 0) return "text-green-600";
  if (amount < 10000) return "text-amber-600";
  if (amount < 50000) return "text-orange-600";
  return "text-red-600";
};

export default function PendingBillStep({
  bills,
  patientName,
  mrn,
  encounterId,
  stepStatus,
  onBillsUpdated,
  onStepComplete,
  requireBillingClearance,
}: PendingBillStepProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [payerFilter, setPayerFilter] = useState<string>("all");
  const [selectedBills, setSelectedBills] = useState<string[]>([]);
  const [selectedBillDetail, setSelectedBillDetail] = useState<PendingBill | null>(null);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [billToCollect, setBillToCollect] = useState<PendingBill | null>(null);

  // Calculate totals
  const totalAmount = bills.reduce((sum, b) => sum + b.totalAmount, 0);
  const totalPaid = bills.reduce((sum, b) => sum + b.paidAmount, 0);
  const totalOutstanding = bills.reduce((sum, b) => sum + b.outstandingAmount, 0);
  const allCleared = totalOutstanding === 0;

  // Filter bills - exclude cleared bills by default
  const pendingAndPartialBills = bills.filter(bill => bill.status !== "Cleared");
  
  const filteredBills = pendingAndPartialBills.filter((bill) => {
    const matchesSearch =
      bill.billNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
      patientName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      mrn.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === "all" || bill.status === statusFilter;
    const matchesPayer = payerFilter === "all" || bill.payerType === payerFilter;
    return matchesSearch && matchesStatus && matchesPayer;
  });

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedBills(filteredBills.map((b) => b.billNumber));
    } else {
      setSelectedBills([]);
    }
  };

  const handleSelectBill = (billNumber: string, checked: boolean) => {
    if (checked) {
      setSelectedBills([...selectedBills, billNumber]);
    } else {
      setSelectedBills(selectedBills.filter((b) => b !== billNumber));
    }
  };

  const handleCollectPayment = (bill: PendingBill) => {
    setBillToCollect(bill);
    setShowPaymentModal(true);
  };

  const handlePaymentComplete = (billNumber: string, amount: number) => {
    const updatedBills = bills.map((bill) => {
      if (bill.billNumber === billNumber) {
        const newPaid = bill.paidAmount + amount;
        const newOutstanding = bill.totalAmount - newPaid;
        return {
          ...bill,
          paidAmount: newPaid,
          outstandingAmount: newOutstanding,
          status: (newOutstanding === 0 ? "Cleared" : "PartiallyPaid") as BillStatus,
          lastPaymentAt: new Date().toISOString(),
          payments: [
            ...bill.payments,
            {
              date: new Date().toISOString(),
              method: "cash" as const,
              amount,
              remarks: "Payment collected",
            },
          ],
        };
      }
      return bill;
    });
    onBillsUpdated(updatedBills);
    setShowPaymentModal(false);
    setBillToCollect(null);
  };

  return (
    <div className="space-y-6">
      {/* Summary Cards */}
      <div className="grid grid-cols-4 gap-4">
        <Card className="p-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
              <Receipt className="w-5 h-5 text-primary" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Total Bill</p>
              <p className="text-lg font-semibold">{formatCurrency(totalAmount)}</p>
            </div>
          </div>
        </Card>
        <Card className="p-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-green-500/10 flex items-center justify-center">
              <CreditCard className="w-5 h-5 text-green-600" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Total Paid</p>
              <p className="text-lg font-semibold text-green-600">{formatCurrency(totalPaid)}</p>
            </div>
          </div>
        </Card>
        <Card className="p-4">
          <div className="flex items-center gap-3">
            <div className={`w-10 h-10 rounded-lg ${allCleared ? 'bg-green-500/10' : 'bg-amber-500/10'} flex items-center justify-center`}>
              {allCleared ? (
                <CheckCircle2 className="w-5 h-5 text-green-600" />
              ) : (
                <AlertTriangle className="w-5 h-5 text-amber-600" />
              )}
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Outstanding</p>
              <p className={`text-lg font-semibold ${getOutstandingRiskColor(totalOutstanding)}`}>
                {formatCurrency(totalOutstanding)}
              </p>
            </div>
          </div>
        </Card>
        <Card className="p-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-blue-500/10 flex items-center justify-center">
              <FileText className="w-5 h-5 text-blue-600" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Bills</p>
              <p className="text-lg font-semibold">{bills.length}</p>
            </div>
          </div>
        </Card>
      </div>

      {/* Controls */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-[150px]">
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value="Pending">Pending</SelectItem>
              <SelectItem value="PartiallyPaid">Partially Paid</SelectItem>
            </SelectContent>
          </Select>
          <Select value={payerFilter} onValueChange={setPayerFilter}>
            <SelectTrigger className="w-[150px]">
              <SelectValue placeholder="Payer" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Payers</SelectItem>
              <SelectItem value="Self">Self Pay</SelectItem>
              <SelectItem value="Insurance">Insurance</SelectItem>
              <SelectItem value="TPA">TPA</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="relative w-80">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="Search by bill no, patient, MRN..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>
      </div>

      {/* Bills Table */}
      <Card>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Bill No.</TableHead>
              <TableHead>Service / Doctor</TableHead>
              <TableHead>Service Dates</TableHead>
              <TableHead className="text-right">Total</TableHead>
              <TableHead className="text-right">Paid</TableHead>
              <TableHead className="text-right">Outstanding</TableHead>
              <TableHead>Last Payment</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredBills.length === 0 ? (
              <TableRow>
                <TableCell colSpan={9} className="text-center py-12">
                  <p className="text-muted-foreground">No pending bills for this encounter.</p>
                </TableCell>
              </TableRow>
            ) : (
              filteredBills.map((bill) => (
                <TableRow
                  key={bill.billNumber}
                  className="hover:bg-muted/50"
                >
                  <TableCell>
                    <span className="font-medium text-foreground">{bill.billNumber}</span>
                  </TableCell>
                  <TableCell>
                    <div className="flex flex-col">
                      <span className="font-medium text-foreground">{bill.serviceName || "General Services"}</span>
                      <span className="text-xs text-muted-foreground">
                        {bill.doctorName} • {bill.department}
                      </span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex flex-col text-sm">
                      <span>{format(new Date(bill.serviceDateFrom), "dd MMM yyyy")}</span>
                      {bill.serviceDateFrom !== bill.serviceDateTo && (
                        <span className="text-muted-foreground text-xs">
                          to {format(new Date(bill.serviceDateTo), "dd MMM yyyy")}
                        </span>
                      )}
                    </div>
                  </TableCell>
                  <TableCell className="text-right font-medium">{formatCurrency(bill.totalAmount)}</TableCell>
                  <TableCell className="text-right text-muted-foreground">
                    {bill.paidAmount > 0 ? formatCurrency(bill.paidAmount) : "—"}
                  </TableCell>
                  <TableCell className={`text-right font-semibold ${getOutstandingRiskColor(bill.outstandingAmount)}`}>
                    {formatCurrency(bill.outstandingAmount)}
                  </TableCell>
                  <TableCell>
                    {bill.lastPaymentAt ? (
                      <div className="flex flex-col text-sm">
                        <span>{format(new Date(bill.lastPaymentAt), "dd MMM yyyy")}</span>
                        <span className="text-muted-foreground text-xs">
                          {format(new Date(bill.lastPaymentAt), "hh:mm a")}
                        </span>
                      </div>
                    ) : (
                      <span className="text-muted-foreground">—</span>
                    )}
                  </TableCell>
                  <TableCell>{getStatusBadge(bill.status)}</TableCell>
                  <TableCell className="text-right">
                    <div className="flex items-center justify-end gap-2">
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 text-muted-foreground hover:text-foreground"
                        onClick={() => setSelectedBillDetail(bill)}
                        title="View Details"
                      >
                        <Eye className="w-4 h-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 text-muted-foreground hover:text-foreground"
                        onClick={() => {}}
                        title="Download"
                      >
                        <Download className="w-4 h-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 text-muted-foreground hover:text-foreground"
                        onClick={() => {}}
                        title="Print"
                      >
                        <Printer className="w-4 h-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
            {/* Total Row */}
            {filteredBills.length > 0 && (
              <TableRow className="border-t-2 bg-muted/30">
                <TableCell colSpan={3} className="text-right font-medium text-muted-foreground">
                  Total:
                </TableCell>
                <TableCell className="text-right font-semibold">
                  {formatCurrency(filteredBills.reduce((sum, b) => sum + b.totalAmount, 0))}
                </TableCell>
                <TableCell className="text-right text-muted-foreground font-medium">
                  {formatCurrency(filteredBills.reduce((sum, b) => sum + b.paidAmount, 0))}
                </TableCell>
                <TableCell className={`text-right font-semibold ${getOutstandingRiskColor(filteredBills.reduce((sum, b) => sum + b.outstandingAmount, 0))}`}>
                  {formatCurrency(filteredBills.reduce((sum, b) => sum + b.outstandingAmount, 0))}
                </TableCell>
                <TableCell colSpan={3}></TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </Card>

      {/* Billing Clearance Warning */}
      {requireBillingClearance && totalOutstanding > 0 && (
        <Card className="p-4 bg-amber-500/10 border-amber-500/30">
          <div className="flex items-start gap-3">
            <AlertTriangle className="w-5 h-5 text-amber-600 mt-0.5" />
            <div>
              <p className="font-medium text-amber-800 dark:text-amber-200">Billing Clearance Required</p>
              <p className="text-sm text-amber-700 dark:text-amber-300 mt-1">
                Outstanding balance of {formatCurrency(totalOutstanding)} must be cleared before discharge can be finalized.
                Collect payment or request admin override to proceed.
              </p>
            </div>
          </div>
        </Card>
      )}

      {/* All Cleared Message */}
      {allCleared && (
        <Card className="p-4 bg-green-500/10 border-green-500/30">
          <div className="flex items-start gap-3">
            <CheckCircle2 className="w-5 h-5 text-green-600 mt-0.5" />
            <div>
              <p className="font-medium text-green-800 dark:text-green-200">All Bills Cleared</p>
              <p className="text-sm text-green-700 dark:text-green-300 mt-1">
                All outstanding bills have been settled. You can proceed to the next step.
              </p>
            </div>
          </div>
        </Card>
      )}

      {/* Bill Detail Drawer */}
      <Sheet open={!!selectedBillDetail} onOpenChange={() => setSelectedBillDetail(null)}>
        <SheetContent className="w-[600px] sm:max-w-[600px] overflow-hidden flex flex-col">
          <SheetHeader className="pb-4 border-b">
            <div className="flex items-center justify-between">
              <SheetTitle className="flex items-center gap-3">
                <span>{selectedBillDetail?.billNumber}</span>
                {selectedBillDetail && getStatusBadge(selectedBillDetail.status)}
              </SheetTitle>
            </div>
            {selectedBillDetail && (
              <p className={`text-2xl font-bold ${getOutstandingRiskColor(selectedBillDetail.outstandingAmount)}`}>
                {formatCurrency(selectedBillDetail.outstandingAmount)} Outstanding
              </p>
            )}
          </SheetHeader>

          <ScrollArea className="flex-1 -mx-6 px-6">
            {selectedBillDetail && (
              <div className="py-6 space-y-6">
                {/* Patient & Encounter */}
                <div>
                  <h4 className="text-sm font-medium text-muted-foreground mb-3">Patient & Encounter</h4>
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <p className="text-muted-foreground">Patient</p>
                      <p className="font-medium">{patientName}</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">MRN</p>
                      <p className="font-medium">{mrn}</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">Encounter ID</p>
                      <p className="font-medium">{encounterId}</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">Service Period</p>
                      <p className="font-medium">
                        {format(new Date(selectedBillDetail.serviceDateFrom), "dd MMM")} -{" "}
                        {format(new Date(selectedBillDetail.serviceDateTo), "dd MMM yyyy")}
                      </p>
                    </div>
                  </div>
                </div>

                <Separator />

                {/* Line Items */}
                <div>
                  <h4 className="text-sm font-medium text-muted-foreground mb-3">Line Items</h4>
                  <div className="border rounded-lg overflow-hidden">
                    <Table>
                      <TableHeader>
                        <TableRow className="bg-muted/50">
                          <TableHead>Description</TableHead>
                          <TableHead className="text-right">Qty</TableHead>
                          <TableHead className="text-right">Rate</TableHead>
                          <TableHead className="text-right">Net</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {selectedBillDetail.lineItems.map((item, idx) => (
                          <TableRow key={idx}>
                            <TableCell>
                              <div>
                                <p className="font-medium">{item.description}</p>
                                <p className="text-xs text-muted-foreground">{item.code}</p>
                                {item.clinician && (
                                  <p className="text-xs text-muted-foreground">{item.clinician}</p>
                                )}
                              </div>
                            </TableCell>
                            <TableCell className="text-right">{item.quantity}</TableCell>
                            <TableCell className="text-right">{formatCurrency(item.unitCost)}</TableCell>
                            <TableCell className="text-right font-medium">{formatCurrency(item.net)}</TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                    <div className="bg-muted/30 px-4 py-3 border-t">
                      <div className="flex justify-between text-sm">
                        <span>Subtotal</span>
                        <span>{formatCurrency(selectedBillDetail.lineItems.reduce((s, i) => s + i.unitCost * i.quantity, 0))}</span>
                      </div>
                      <div className="flex justify-between text-sm text-muted-foreground">
                        <span>Tax</span>
                        <span>{formatCurrency(selectedBillDetail.lineItems.reduce((s, i) => s + i.tax, 0))}</span>
                      </div>
                      <div className="flex justify-between text-sm text-muted-foreground">
                        <span>Discount</span>
                        <span>-{formatCurrency(selectedBillDetail.lineItems.reduce((s, i) => s + i.discount, 0))}</span>
                      </div>
                      <Separator className="my-2" />
                      <div className="flex justify-between font-semibold">
                        <span>Total</span>
                        <span>{formatCurrency(selectedBillDetail.totalAmount)}</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Insurance/TPA */}
                {selectedBillDetail.insurance && (
                  <>
                    <Separator />
                    <div>
                      <h4 className="text-sm font-medium text-muted-foreground mb-3">Insurance / TPA</h4>
                      <div className="grid grid-cols-2 gap-4 text-sm">
                        <div>
                          <p className="text-muted-foreground">Policy No.</p>
                          <p className="font-medium">{selectedBillDetail.insurance.policyNumber}</p>
                        </div>
                        <div>
                          <p className="text-muted-foreground">Coverage</p>
                          <p className="font-medium">{selectedBillDetail.insurance.coveragePercent}%</p>
                        </div>
                        <div>
                          <p className="text-muted-foreground">Preauth No.</p>
                          <p className="font-medium">{selectedBillDetail.insurance.preauthNumber}</p>
                        </div>
                        <div>
                          <p className="text-muted-foreground">Approved Amount</p>
                          <p className="font-medium text-green-600">
                            {formatCurrency(selectedBillDetail.insurance.approvedAmount || 0)}
                          </p>
                        </div>
                        {selectedBillDetail.insurance.tpaRemarks && (
                          <div className="col-span-2">
                            <p className="text-muted-foreground">TPA Remarks</p>
                            <p className="font-medium">{selectedBillDetail.insurance.tpaRemarks}</p>
                          </div>
                        )}
                      </div>
                    </div>
                  </>
                )}

                {/* Payments */}
                {selectedBillDetail.payments.length > 0 && (
                  <>
                    <Separator />
                    <div>
                      <h4 className="text-sm font-medium text-muted-foreground mb-3">Payment History</h4>
                      <div className="space-y-2">
                        {selectedBillDetail.payments.map((payment, idx) => (
                          <div key={idx} className="flex items-center justify-between p-3 bg-muted/30 rounded-lg">
                            <div className="flex items-center gap-3">
                              <div className="w-8 h-8 rounded-full bg-green-500/10 flex items-center justify-center">
                                <CreditCard className="w-4 h-4 text-green-600" />
                              </div>
                              <div>
                                <p className="font-medium text-sm">{payment.method.toUpperCase()}</p>
                                <p className="text-xs text-muted-foreground">
                                  {format(new Date(payment.date), "dd MMM yyyy, hh:mm a")}
                                </p>
                              </div>
                            </div>
                            <div className="text-right">
                              <p className="font-semibold text-green-600">{formatCurrency(payment.amount)}</p>
                              {payment.reference && (
                                <p className="text-xs text-muted-foreground">{payment.reference}</p>
                              )}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </>
                )}

                {/* Notes */}
                {selectedBillDetail.notes && (
                  <>
                    <Separator />
                    <div>
                      <h4 className="text-sm font-medium text-muted-foreground mb-2">Notes</h4>
                      <p className="text-sm bg-muted/30 p-3 rounded-lg">{selectedBillDetail.notes}</p>
                    </div>
                  </>
                )}
              </div>
            )}
          </ScrollArea>

          {/* Actions */}
          {selectedBillDetail && (
            <div className="pt-4 border-t flex gap-2">
              {selectedBillDetail.outstandingAmount > 0 && (
                <Button
                  className="flex-1"
                  onClick={() => {
                    handleCollectPayment(selectedBillDetail);
                    setSelectedBillDetail(null);
                  }}
                >
                  <CreditCard className="w-4 h-4 mr-2" />
                  Collect Payment
                </Button>
              )}
              <Button variant="outline" className="gap-2">
                <FileText className="w-4 h-4" />
                Proforma
              </Button>
              <Button variant="outline" className="gap-2">
                <Printer className="w-4 h-4" />
                Print
              </Button>
              <Button variant="outline" className="gap-2">
                <Download className="w-4 h-4" />
                PDF
              </Button>
            </div>
          )}
        </SheetContent>
      </Sheet>

      {/* Collect Payment Modal */}
      {showPaymentModal && billToCollect && (
        <CollectPaymentModal
          bill={billToCollect}
          onClose={() => {
            setShowPaymentModal(false);
            setBillToCollect(null);
          }}
          onPaymentComplete={handlePaymentComplete}
        />
      )}
    </div>
  );
}
