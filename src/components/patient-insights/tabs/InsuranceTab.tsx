import { Download, Printer } from "lucide-react";
import { Visit } from "../VisitListItem";

interface InsuranceTabProps {
  selectedVisit: Visit | null;
}

const mockClaims = [
  // V25-004 claims (Active visit - Cardiology follow-up)
  {
    id: "CLM-2025-041",
    date: "20 Dec 2025",
    visitId: "V25-004",
    service: "Cardiology Consultation",
    billed: "2,500",
    paid: "0",
    status: "Submitted",
  },
  {
    id: "CLM-2025-042",
    date: "20 Dec 2025",
    visitId: "V25-004",
    service: "ECG Test",
    billed: "800",
    paid: "0",
    status: "Submitted",
  },
  // V25-002 claims (General Medicine checkup)
  {
    id: "CLM-2025-021",
    date: "15 Dec 2025",
    visitId: "V25-002",
    service: "General Consultation",
    billed: "1,500",
    paid: "1,200",
    status: "Paid",
  },
  {
    id: "CLM-2025-022",
    date: "15 Dec 2025",
    visitId: "V25-002",
    service: "Laboratory Tests",
    billed: "2,000",
    paid: "1,600",
    status: "Paid",
  },
  // V25-001 claims (Cardiology - Chest pain)
  {
    id: "CLM-2025-011",
    date: "01 Dec 2025",
    visitId: "V25-001",
    service: "Cardiology Consultation",
    billed: "2,500",
    paid: "2,000",
    status: "Paid",
  },
  {
    id: "CLM-2025-012",
    date: "01 Dec 2025",
    visitId: "V25-001",
    service: "ECG Test",
    billed: "800",
    paid: "640",
    status: "Paid",
  },
  {
    id: "CLM-2025-013",
    date: "01 Dec 2025",
    visitId: "V25-001",
    service: "Chest X-Ray",
    billed: "1,500",
    paid: "0",
    status: "In Review",
  },
  // V24-089 claims (Orthopedics - Back pain)
  {
    id: "CLM-2024-891",
    date: "15 Nov 2025",
    visitId: "V24-089",
    service: "Orthopedics Consultation",
    billed: "2,000",
    paid: "1,600",
    status: "Paid",
  },
  {
    id: "CLM-2024-892",
    date: "15 Nov 2025",
    visitId: "V24-089",
    service: "MRI Spine",
    billed: "8,500",
    paid: "6,800",
    status: "Paid",
  },
  {
    id: "CLM-2024-893",
    date: "16 Nov 2025",
    visitId: "V24-089",
    service: "Physiotherapy",
    billed: "1,000",
    paid: "0",
    status: "Rejected",
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
