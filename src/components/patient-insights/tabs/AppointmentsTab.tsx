import { Card } from "@/components/ui/card";
import { ChevronDown } from "lucide-react";
import { useState } from "react";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { Visit } from "../VisitListItem";

interface AppointmentsTabProps {
  selectedVisit: Visit | null;
}

export function AppointmentsTab({ selectedVisit }: AppointmentsTabProps) {
  const [expandedItem, setExpandedItem] = useState<number | null>(null);

  if (!selectedVisit) {
    return (
      <div className="p-8 text-center">
        <p className="text-sm text-muted-foreground">
          Select a visit to view appointment details.
        </p>
      </div>
    );
  }

  const items = selectedVisit.items || [];

  if (items.length === 0) {
    return (
      <div className="p-8 text-center">
        <p className="text-sm text-muted-foreground">
          No appointment details available for this visit.
        </p>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-4">
      {items.map((item, idx) => (
        <Collapsible
          key={idx}
          open={expandedItem === idx}
          onOpenChange={(open) => setExpandedItem(open ? idx : null)}
        >
          <Card className="overflow-hidden">
            <CollapsibleTrigger className="w-full">
              <div className="flex items-center justify-between p-4 transition-colors">
                <div className="flex-1 text-left">
                  <p className="font-medium text-foreground mb-1">{item.type}</p>
                  <p className="text-sm text-muted-foreground">
                    Date & Time: {item.datetime}
                  </p>
                </div>
                <ChevronDown
                  className={`h-5 w-5 text-muted-foreground transition-transform ${
                    expandedItem === idx ? "transform rotate-180" : ""
                  }`}
                />
              </div>
            </CollapsibleTrigger>
            <CollapsibleContent>
              <div className="border-t p-4 space-y-4 bg-muted/30">
                <div className="grid grid-cols-2 gap-4">
                  {/* Left Column - Provider Information */}
                  <div className="space-y-3">
                    <h3 className="text-sm font-semibold text-foreground">Provider Information</h3>
                    
                    {item.visitId && (
                      <div>
                        <p className="text-xs text-muted-foreground mb-0.5">Visit ID:</p>
                        <p className="text-sm text-foreground">{item.visitId}</p>
                      </div>
                    )}
                    
                    {item.admissionId && (
                      <div>
                        <p className="text-xs text-muted-foreground mb-0.5">Admission ID:</p>
                        <p className="text-sm text-foreground">{item.admissionId}</p>
                      </div>
                    )}
                    
                    {item.admittingDiagnosis && (
                      <div>
                        <p className="text-xs text-muted-foreground mb-0.5">Admitting Diagnosis:</p>
                        <p className="text-sm text-foreground">{item.admittingDiagnosis}</p>
                      </div>
                    )}
                    
                    {item.roomType && (
                      <div>
                        <p className="text-xs text-muted-foreground mb-0.5">Room Type:</p>
                        <p className="text-sm text-foreground">{item.roomType}</p>
                      </div>
                    )}
                    
                    {item.testsOrdered && (
                      <div>
                        <p className="text-xs text-muted-foreground mb-0.5">Tests Ordered:</p>
                        <ul className="space-y-1 mt-1">
                          {item.testsOrdered.map((test: string, tIdx: number) => (
                            <li key={tIdx} className="text-sm text-foreground flex items-start">
                              <span className="mr-2">•</span>
                              <span>{test}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                    
                    {item.investigations && (
                      <div>
                        <p className="text-xs text-muted-foreground mb-0.5">Investigations:</p>
                        <ul className="space-y-1 mt-1">
                          {item.investigations.map((investigation: string, iIdx: number) => (
                            <li key={iIdx} className="text-sm text-foreground flex items-start">
                              <span className="mr-2">•</span>
                              <span>{investigation}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                    
                    {item.procedure && (
                      <div>
                        <p className="text-xs text-muted-foreground mb-0.5">Procedure:</p>
                        <p className="text-sm text-foreground">{item.procedure}</p>
                      </div>
                    )}
                    
                    {item.provider && (
                      <div>
                        <p className="text-xs text-muted-foreground mb-0.5">Provider:</p>
                        <p className="text-sm text-foreground">{item.provider}</p>
                      </div>
                    )}
                    
                    {item.department && (
                      <div>
                        <p className="text-xs text-muted-foreground mb-0.5">Department:</p>
                        <p className="text-sm text-foreground">{item.department}</p>
                      </div>
                    )}
                    
                    {item.doctor && (
                      <div>
                        <p className="text-xs text-muted-foreground mb-0.5">Doctor:</p>
                        <p className="text-sm text-foreground">{item.doctor}</p>
                      </div>
                    )}
                  </div>
                  
                  {/* Right Column - Prescriptions */}
                  {item.prescriptions && (
                    <div className="space-y-3">
                      <h3 className="text-sm font-semibold text-foreground">Prescriptions</h3>
                      <ul className="space-y-2">
                        {item.prescriptions.map((prescription: string, pIdx: number) => (
                          <li key={pIdx} className="text-sm text-foreground flex items-start">
                            <span className="mr-2">•</span>
                            <span>{prescription}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
                
                {/* Findings Section */}
                {item.findings && (
                  <div>
                    <h3 className="text-sm font-semibold text-foreground mb-2">Findings</h3>
                    <p className="text-sm text-muted-foreground leading-relaxed">
                      {item.findings}
                    </p>
                  </div>
                )}
              </div>
            </CollapsibleContent>
          </Card>
        </Collapsible>
      ))}
    </div>
  );
}
