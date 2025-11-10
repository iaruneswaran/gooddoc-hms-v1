import { useState } from "react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ChevronDown, ChevronUp, FileText, Pill, TestTube, Printer } from "lucide-react";
import { Patient, Vitals } from "@/types/patient360";

interface PatientHeaderProps {
  patient: Patient;
  vitals?: Vitals;
}

export function PatientHeader({ patient, vitals }: PatientHeaderProps) {
  const [expanded, setExpanded] = useState(false);

  const initials = patient.name
    .split(" ")
    .map((n) => n[0])
    .join("");

  const age = Math.floor(
    (new Date().getTime() - new Date(patient.dob).getTime()) / 
    (365.25 * 24 * 60 * 60 * 1000)
  );

  return (
    <div className="sticky top-0 z-10 bg-card border-b border-border shadow-sm">
      <div className="p-6">
        <div className="flex items-start gap-4 mb-4">
          <Avatar className="h-16 w-16">
            <AvatarFallback className="bg-primary text-primary-foreground text-xl">
              {initials}
            </AvatarFallback>
          </Avatar>

          <div className="flex-1">
            <div className="flex items-center gap-3 mb-2">
              <h1 className="text-2xl font-semibold text-foreground">
                {patient.name}
              </h1>
              <span className="text-sm text-muted-foreground">
                GDID-{patient.gdid} • {age}y | {patient.sex}
              </span>
            </div>

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

          <div className="flex items-center gap-2">
            <Button variant="default" size="sm">
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

        {expanded && (
          <Card className="p-4 bg-muted/50">
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
