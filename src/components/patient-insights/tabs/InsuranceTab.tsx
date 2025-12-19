import { Download, Printer } from "lucide-react";
import { Visit } from "../VisitListItem";

interface InsuranceTabProps {
  selectedVisit: Visit | null;
}

const mockClaims = [
  {
    id: "CLM-2025-001",
    date: "05 Aug 2025",
    visitId: "V25-001",
    service: "Consultation",
    billed: "3,000",
    paid: "1,500",
    status: "Paid",
  },
  {
    id: "CLM-2025-002",
    date: "05 Aug 2025",
    visitId: "V25-002",
    service: "Laboratory",
    billed: "2,000",
    paid: "650",
    status: "Paid",
  },
  {
    id: "CLM-2025-003",
    date: "05 Aug 2025",
    visitId: "V25-003",
    service: "Radiology",
    billed: "2,200",
    paid: "1,200",
    status: "In Review",
  },
  {
    id: "CLM-2025-004",
    date: "07 Aug 2025",
    visitId: "V25-004",
    service: "IPD Admission",
    billed: "58,000",
    paid: "0",
    status: "Pending",
  },
];

export function InsuranceTab({ selectedVisit }: InsuranceTabProps) {
  if (!selectedVisit) {
    return (
      <div className="p-8 text-center">
        <p className="text-sm text-muted-foreground">
          Select a visit to view insurance information.
        </p>
      </div>
    );
  }

  // Filter claims for selected visit
  const visitClaims = mockClaims.filter(
    (claim) => claim.visitId === selectedVisit.visitId
  );

  if (visitClaims.length === 0) {
    return (
      <div className="p-8 text-center">
        <p className="text-sm text-muted-foreground">
          No insurance claims found for this visit.
        </p>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      {/* Claims Table */}
      <div>
        <h3 className="text-[14px] font-semibold text-foreground mb-4">Insurance Claims</h3>
        <div className="border rounded-lg overflow-hidden bg-white dark:bg-card">
          <table className="w-full">
            <thead className="bg-muted/30">
              <tr>
                <th className="text-left text-sm font-medium text-muted-foreground p-4">Visit ID</th>
                <th className="text-left text-sm font-medium text-muted-foreground p-4">Claim No</th>
                <th className="text-left text-sm font-medium text-muted-foreground p-4">Date</th>
                <th className="text-left text-sm font-medium text-muted-foreground p-4">Service</th>
                <th className="text-left text-sm font-medium text-muted-foreground p-4">Billed Amount</th>
                <th className="text-left text-sm font-medium text-muted-foreground p-4">Insurance paid</th>
                <th className="text-left text-sm font-medium text-muted-foreground p-4">Status</th>
                <th className="text-left text-sm font-medium text-muted-foreground p-4">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white dark:bg-card">
              {visitClaims.map((claim) => (
                <tr key={claim.id} className="border-t">
                  <td className="p-4">
                    <p className="text-sm font-mono font-medium text-foreground">{claim.visitId}</p>
                  </td>
                  <td className="p-4 text-sm">{claim.id}</td>
                  <td className="p-4 text-sm">{claim.date}</td>
                  <td className="p-4 text-sm">{claim.service}</td>
                  <td className="p-4 text-sm">₹{claim.billed}</td>
                  <td className="p-4 text-sm">₹{claim.paid}</td>
                  <td className="p-4 text-sm">
                    <span
                      className={`font-medium ${
                        claim.status === "Paid"
                          ? "text-green-600"
                          : claim.status === "In Review"
                          ? "text-orange-600"
                          : "text-amber-600"
                      }`}
                    >
                      {claim.status}
                    </span>
                  </td>
                  <td className="p-4 text-sm">
                    <div className="flex gap-2">
                      <button className="text-muted-foreground hover:text-foreground">
                        <Download className="h-4 w-4" />
                      </button>
                      <button className="text-muted-foreground hover:text-foreground">
                        <Printer className="h-4 w-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
