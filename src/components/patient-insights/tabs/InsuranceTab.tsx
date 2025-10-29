import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Download, Printer } from "lucide-react";
import { Visit } from "../VisitListItem";

interface InsuranceTabProps {
  selectedVisit: Visit | null;
}

const mockClaims = [
  {
    id: "CLM-2025-789",
    date: "15 Jun 2025",
    service: "Consultation",
    billed: "3,000",
    paid: "1,500",
    status: "Paid",
  },
  {
    id: "CLM-2025-790",
    date: "20 May 2025",
    service: "Laboratory",
    billed: "2,000",
    paid: "650",
    status: "Paid",
  },
  {
    id: "CLM-2025-791",
    date: "10 Apr 2025",
    service: "Imaging",
    billed: "2,200",
    paid: "1,200",
    status: "In Review",
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

  return (
    <div className="p-6 space-y-6">
      {/* Insurance Card */}
      <Card className="p-6">
        <div className="flex items-start justify-between mb-4">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="text-sm font-semibold text-foreground">
                Star Health Insurance
              </span>
              <Badge className="bg-green-100 text-green-800">Active</Badge>
            </div>
            <p className="text-sm text-muted-foreground mb-3">Family Health Optima Plan</p>
            <div className="space-y-1 text-sm text-muted-foreground">
              <p>Member ID: SH123456789</p>
              <p>Group: GRP-2025-456</p>
              <p>Effective: Jan 01, 2025 – Dec 31, 2025</p>
            </div>
          </div>
        </div>
        <div className="flex gap-2">
          <Button className="bg-primary">Verify Eligibility</Button>
          <Button variant="outline">Update</Button>
          <Button variant="outline">Replace</Button>
          <Button variant="outline">View coverage</Button>
        </div>
      </Card>

      {/* Claims Table */}
      <div>
        <h3 className="text-lg font-semibold text-primary mb-4">Insurance Claims</h3>
        <div className="border rounded-lg overflow-hidden">
          <table className="w-full">
            <thead className="bg-muted/50">
              <tr>
                <th className="text-left text-sm font-medium text-muted-foreground p-4">Claim No</th>
                <th className="text-left text-sm font-medium text-muted-foreground p-4">Date</th>
                <th className="text-left text-sm font-medium text-muted-foreground p-4">Service</th>
                <th className="text-left text-sm font-medium text-muted-foreground p-4">Billed Amount</th>
                <th className="text-left text-sm font-medium text-muted-foreground p-4">Insurance paid</th>
                <th className="text-left text-sm font-medium text-muted-foreground p-4">Status</th>
                <th className="text-left text-sm font-medium text-muted-foreground p-4">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-background">
              {mockClaims.map((claim) => (
                <tr key={claim.id} className="border-t">
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
                          : "text-orange-600"
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
