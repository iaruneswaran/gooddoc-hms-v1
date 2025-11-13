import { Card } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Plus, Search } from "lucide-react";

interface ClaimStepPatientPolicyProps {
  data: any;
  onChange: (data: any) => void;
  errors: string[];
}

export function ClaimStepPatientPolicy({ data, onChange, errors }: ClaimStepPatientPolicyProps) {
  return (
    <Card className="p-6">
      <h2 className="text-lg font-semibold mb-6">Patient & Policy Information</h2>
      
      <div className="space-y-6">
        {/* Patient Search */}
        <div>
          <Label htmlFor="patient">Patient *</Label>
          <div className="flex gap-2 mt-2">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                id="patient"
                placeholder="Search patient by name or ID (min 2 chars)"
                className="pl-10"
                value={data.patient?.name || ""}
                onChange={(e) => {
                  if (e.target.value.length >= 2) {
                    // Mock patient selection
                    onChange({
                      ...data,
                      patient: {
                        id: "p1",
                        name: e.target.value,
                        phone: "+91 98765 43210"
                      }
                    });
                  }
                }}
              />
            </div>
            <Button variant="outline" size="icon">
              <Plus className="h-4 w-4" />
            </Button>
          </div>
          {data.patient && (
            <div className="mt-2 p-3 bg-muted rounded-md">
              <div className="font-medium">{data.patient.name}</div>
              <div className="text-sm text-muted-foreground">{data.patient.phone}</div>
            </div>
          )}
        </div>

        {/* Claim Type */}
        <div>
          <Label htmlFor="claimType">Claim Type *</Label>
          <Select
            value={data.claimType}
            onValueChange={(value) => onChange({ ...data, claimType: value })}
          >
            <SelectTrigger id="claimType" className="mt-2">
              <SelectValue placeholder="Select claim type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Cashless">Cashless</SelectItem>
              <SelectItem value="Reimbursement">Reimbursement</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Policy Selector */}
        <div>
          <Label htmlFor="policy">Policy Number</Label>
          <div className="flex gap-2 mt-2">
            <Select
              value={data.policy?.policyNo}
              onValueChange={(value) => {
                // Mock policy data
                onChange({
                  ...data,
                  policy: {
                    policyNo: value,
                    subscriberName: data.patient?.name || "",
                    relationship: "Self",
                    network: "In-Network",
                    validFrom: "2025-01-01",
                    validTo: "2025-12-31"
                  },
                  payer: {
                    id: "payer1",
                    name: "Star Health Insurance"
                  }
                });
              }}
            >
              <SelectTrigger id="policy" className="flex-1">
                <SelectValue placeholder="Select policy" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="SH-1234567890">SH-1234567890 - Star Health</SelectItem>
                <SelectItem value="HDFC-99887766">HDFC-99887766 - HDFC ERGO</SelectItem>
              </SelectContent>
            </Select>
            <Button variant="outline" size="icon">
              <Plus className="h-4 w-4" />
            </Button>
          </div>
          {data.policy && (
            <div className="mt-2 p-3 bg-muted rounded-md space-y-1">
              <div className="font-medium">{data.policy.policyNo}</div>
              <div className="text-sm text-muted-foreground">
                Valid: {new Date(data.policy.validFrom).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })} - {new Date(data.policy.validTo).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })}
              </div>
              <div className="text-sm text-muted-foreground">Network: {data.policy.network}</div>
            </div>
          )}
        </div>

        {/* Payer (if no policy) */}
        {!data.policy && (
          <div>
            <Label htmlFor="payer">Payer/Insurer *</Label>
            <Select
              value={data.payer?.id}
              onValueChange={(value) => {
                onChange({
                  ...data,
                  payer: {
                    id: value,
                    name: value === "payer1" ? "Star Health Insurance" : "HDFC ERGO"
                  }
                });
              }}
            >
              <SelectTrigger id="payer" className="mt-2">
                <SelectValue placeholder="Select payer" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="payer1">Star Health Insurance</SelectItem>
                <SelectItem value="payer2">HDFC ERGO</SelectItem>
                <SelectItem value="payer3">MediAssist TPA</SelectItem>
              </SelectContent>
            </Select>
          </div>
        )}
      </div>
    </Card>
  );
}
