import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ChevronDown, ChevronUp, ChevronLeft, FileText, Pill, TestTube, Printer } from "lucide-react";
import { PatientChip } from "@/components/patient-insights/PatientChip";
import { Patient, Vitals } from "@/types/patient360";

interface PatientHeaderProps {
  patient: Patient;
  vitals?: Vitals;
}

export function PatientHeader({ patient, vitals }: PatientHeaderProps) {
  const navigate = useNavigate();
  const [expanded, setExpanded] = useState(false);

  const age = Math.floor(
    (new Date().getTime() - new Date(patient.dob).getTime()) / 
    (365.25 * 24 * 60 * 60 * 1000)
  );

  return (
    <div className="bg-background border-b border-border flex-shrink-0">
      <div className="px-6 py-6">
        {/* Back Button */}
        <button
          onClick={() => navigate("/appointments")}
          className="flex items-center gap-2 text-sm text-foreground hover:text-primary transition-colors mb-4"
        >
          <ChevronLeft className="h-4 w-4" />
          <span className="font-semibold">Outpatient</span>
        </button>

        {/* Header Content */}
        <div className="flex items-center justify-between gap-6">
          {/* Left: Patient Info and Action Buttons */}
          <div className="flex items-center gap-3">
            <PatientChip
              name={patient.name}
              gdid={patient.gdid}
              age={age}
              gender={patient.sex}
              onClick={() => setExpanded(!expanded)}
            />
            
            <div className="flex gap-2">
              <Button variant="outline" size="sm">
                <FileText className="w-4 h-4 mr-2" />
                Add Note
              </Button>
              <Button variant="outline" size="sm">
                <Pill className="w-4 h-4 mr-2" />
                eRx
              </Button>
              <Button variant="outline" size="sm">
                <TestTube className="w-4 h-4 mr-2" />
                Order Lab
              </Button>
              <Button variant="outline" size="sm">
                <Printer className="w-4 h-4 mr-2" />
                Print
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setExpanded(!expanded)}
              >
                {expanded ? (
                  <>
                    Less <ChevronUp className="w-4 h-4 ml-1" />
                  </>
                ) : (
                  <>
                    More Details <ChevronDown className="w-4 h-4 ml-1" />
                  </>
                )}
              </Button>
            </div>
          </div>

          {/* Right: Badges for allergies and conditions */}
          <div className="flex flex-wrap gap-2">
            {patient.alerts?.allergies && patient.alerts.allergies.length > 0 && (
              <Badge variant="destructive" className="text-xs">
                Allergies: {patient.alerts.allergies.join(", ")}
              </Badge>
            )}
            {patient.tags?.map((tag) => (
              <Badge key={tag} variant="secondary" className="text-xs">
                {tag}
              </Badge>
            ))}
          </div>
        </div>

        {expanded && (
          <Card className="p-4 bg-muted/50 mt-4">
            <div className="grid grid-cols-2 gap-6">
              <div>
                <h3 className="text-sm font-semibold text-foreground mb-3">
                  Contact Information
                </h3>
                <div className="space-y-2 text-sm">
                  {patient.phone && (
                    <div>
                      <span className="text-muted-foreground">Phone: </span>
                      <span className="text-foreground">{patient.phone}</span>
                    </div>
                  )}
                  {patient.email && (
                    <div>
                      <span className="text-muted-foreground">Email: </span>
                      <span className="text-foreground">{patient.email}</span>
                    </div>
                  )}
                  {patient.whatsapp && (
                    <div>
                      <span className="text-muted-foreground">WhatsApp: </span>
                      <span className="text-foreground">{patient.whatsapp}</span>
                    </div>
                  )}
                  {patient.nationalId && (
                    <div>
                      <span className="text-muted-foreground">National ID: </span>
                      <span className="text-foreground">{patient.nationalId}</span>
                    </div>
                  )}
                </div>
              </div>

              <div>
                <h3 className="text-sm font-semibold text-foreground mb-3">
                  Insurance & Address
                </h3>
                <div className="space-y-2 text-sm">
                  {patient.insurance && (
                    <div>
                      <span className="text-muted-foreground">Insurance: </span>
                      <span className="text-foreground">
                        {patient.insurance.provider} • {patient.insurance.policyNumber}
                      </span>
                      {patient.insurance.validTo && (
                        <span className="text-muted-foreground ml-2">
                          (Valid till {new Date(patient.insurance.validTo).toLocaleDateString()})
                        </span>
                      )}
                    </div>
                  )}
                  {patient.address && (
                    <div>
                      <span className="text-muted-foreground">Address: </span>
                      <span className="text-foreground">
                        {patient.address.street}, {patient.address.city}, {patient.address.state} {patient.address.pincode}, {patient.address.country}
                      </span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </Card>
        )}
      </div>
    </div>
  );
}
