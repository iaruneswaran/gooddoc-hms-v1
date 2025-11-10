import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Edit, Printer } from "lucide-react";
import { Patient, Vitals } from "@/types/patient360";

interface PatientDetailsPanelProps {
  patient: Patient;
  vitals?: Vitals;
}

export function PatientDetailsPanel({ patient, vitals }: PatientDetailsPanelProps) {
  const age = Math.floor(
    (new Date().getTime() - new Date(patient.dob).getTime()) / 
    (365.25 * 24 * 60 * 60 * 1000)
  );

  return (
    <div className="space-y-6">
      <Card className="p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-foreground">Patient Information</h2>
          <div className="flex gap-2">
            <Button variant="outline" size="sm">
              <Edit className="w-4 h-4 mr-2" />
              Edit
            </Button>
            <Button variant="outline" size="sm">
              <Printer className="w-4 h-4 mr-2" />
              Print Patient Sheet
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-6">
          <div className="space-y-3">
            <div>
              <span className="text-sm text-muted-foreground">GDID</span>
              <p className="text-sm text-foreground font-medium">GDID-{patient.gdid}</p>
            </div>
            <div>
              <span className="text-sm text-muted-foreground">Full Name</span>
              <p className="text-sm text-foreground font-medium">{patient.name}</p>
            </div>
            <div>
              <span className="text-sm text-muted-foreground">Gender</span>
              <p className="text-sm text-foreground font-medium">
                {patient.sex === "M" ? "Male" : patient.sex === "F" ? "Female" : "Other"}
              </p>
            </div>
            <div>
              <span className="text-sm text-muted-foreground">Date of Birth</span>
              <p className="text-sm text-foreground font-medium">
                {new Date(patient.dob).toLocaleDateString("en-IN", {
                  day: "2-digit",
                  month: "2-digit",
                  year: "numeric"
                })}{" "}
                ({age} years)
              </p>
            </div>
          </div>

          <div className="space-y-3">
            <div>
              <span className="text-sm text-muted-foreground">Phone</span>
              <p className="text-sm text-foreground font-medium">{patient.phone || "—"}</p>
            </div>
            <div>
              <span className="text-sm text-muted-foreground">Email</span>
              <p className="text-sm text-foreground font-medium">{patient.email || "—"}</p>
            </div>
            <div>
              <span className="text-sm text-muted-foreground">WhatsApp</span>
              <p className="text-sm text-foreground font-medium">{patient.whatsapp || "—"}</p>
            </div>
            <div>
              <span className="text-sm text-muted-foreground">National ID</span>
              <p className="text-sm text-foreground font-medium">{patient.nationalId || "—"}</p>
            </div>
          </div>
        </div>

        {patient.insurance && (
          <div className="mt-6 pt-6 border-t border-border">
            <h3 className="text-sm font-semibold text-foreground mb-3">Insurance</h3>
            <div className="grid grid-cols-3 gap-4">
              <div>
                <span className="text-sm text-muted-foreground">Provider</span>
                <p className="text-sm text-foreground font-medium">{patient.insurance.provider}</p>
              </div>
              <div>
                <span className="text-sm text-muted-foreground">Policy Number</span>
                <p className="text-sm text-foreground font-medium">
                  {patient.insurance.policyNumber}
                </p>
              </div>
              {patient.insurance.validTo && (
                <div>
                  <span className="text-sm text-muted-foreground">Valid Till</span>
                  <p className="text-sm text-foreground font-medium">
                    {new Date(patient.insurance.validTo).toLocaleDateString("en-IN", {
                      day: "2-digit",
                      month: "2-digit",
                      year: "numeric"
                    })}
                  </p>
                </div>
              )}
            </div>
          </div>
        )}

        {patient.address && (
          <div className="mt-6 pt-6 border-t border-border">
            <h3 className="text-sm font-semibold text-foreground mb-3">Address</h3>
            <p className="text-sm text-foreground">
              {patient.address.street && `${patient.address.street}, `}
              {patient.address.city && `${patient.address.city}, `}
              {patient.address.state} {patient.address.pincode}
              {patient.address.country && `, ${patient.address.country}`}
            </p>
          </div>
        )}
      </Card>

      <Card className="p-6">
        <h2 className="text-lg font-semibold text-foreground mb-4">Clinical Information</h2>
        
        {patient.alerts?.allergies && patient.alerts.allergies.length > 0 && (
          <div className="mb-4">
            <h3 className="text-sm font-semibold text-foreground mb-2">Allergies</h3>
            <div className="flex flex-wrap gap-2">
              {patient.alerts.allergies.map((allergy) => (
                <Badge key={allergy} variant="destructive">
                  {allergy}
                </Badge>
              ))}
            </div>
          </div>
        )}

        {patient.tags && patient.tags.length > 0 && (
          <div className="mb-4">
            <h3 className="text-sm font-semibold text-foreground mb-2">Active Problems</h3>
            <div className="flex flex-wrap gap-2">
              {patient.tags.map((tag) => (
                <Badge key={tag} variant="secondary">
                  {tag}
                </Badge>
              ))}
            </div>
          </div>
        )}

        <div className="mt-6 pt-6 border-t border-border">
          <h3 className="text-sm font-semibold text-foreground mb-2">Latest Clinician Notes</h3>
          <p className="text-sm text-muted-foreground leading-relaxed">
            Patient reported mild dizziness in the morning, advised to monitor BP twice daily.
            Weight stable compared to last visit, continue with current diet plan. Slightly
            elevated blood pressure post lunch, recommend salt intake reduction.
          </p>
        </div>
      </Card>
    </div>
  );
}
