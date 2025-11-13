import { useState } from "react";
import { ChevronDown, ChevronRight, Circle, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";

interface Section {
  id: string;
  title: string;
  completed: boolean;
}

export function ClinicalNotesEditor() {
  const [openSections, setOpenSections] = useState<string[]>(["chief-complaint"]);
  const [sections, setSections] = useState<Section[]>([
    { id: "chief-complaint", title: "Chief Complaint", completed: false },
    { id: "hpi", title: "History of Present Illness (HPI)", completed: false },
    { id: "ros", title: "Review of Systems (ROS)", completed: false },
    { id: "physical-exam", title: "Physical Examination", completed: false },
    { id: "assessment-plan", title: "Assessment & Plan", completed: false },
  ]);

  const toggleSection = (id: string) => {
    setOpenSections((prev) =>
      prev.includes(id) ? prev.filter((s) => s !== id) : [...prev, id]
    );
  };

  const rosItems = [
    "Constitutional",
    "Cardiovascular",
    "Respiratory",
    "Gastrointestinal",
    "Neurological",
    "Musculoskeletal",
    "Genitourinary",
    "Psychiatric",
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold text-foreground">Clinical Notes</h2>
        <div className="flex items-center gap-3">
          <Button variant="ghost" size="sm">
            Skip, Fill later
          </Button>
          <Button size="sm">Save & Continue</Button>
        </div>
      </div>

      <div className="space-y-4">
        {sections.map((section) => {
          const isOpen = openSections.includes(section.id);

          return (
            <div
              key={section.id}
              className="rounded-xl border bg-card overflow-hidden"
              style={{
                boxShadow: "0 1px 3px 0 rgb(0 0 0 / 0.1)",
              }}
            >
              {/* Section Header */}
              <button
                onClick={() => toggleSection(section.id)}
                className="w-full flex items-center gap-3 p-4 text-left hover:bg-accent/50 transition-colors"
              >
                <div className="flex items-center gap-3 flex-1">
                  {section.completed ? (
                    <CheckCircle2 className="w-5 h-5 text-primary" />
                  ) : (
                    <Circle className="w-5 h-5 text-muted-foreground" />
                  )}
                  <span className="font-semibold text-foreground">{section.title}</span>
                </div>
                {isOpen ? (
                  <ChevronDown className="w-5 h-5 text-muted-foreground" />
                ) : (
                  <ChevronRight className="w-5 h-5 text-muted-foreground" />
                )}
              </button>

              {/* Section Content */}
              {isOpen && (
                <div className="p-6 pt-0 border-t">
                  {section.id === "chief-complaint" && (
                    <Input placeholder="Enter chief complaint" className="mt-4" />
                  )}

                  {section.id === "hpi" && (
                    <Textarea
                      placeholder="Describe the history of present illness"
                      className="mt-4 min-h-[120px]"
                    />
                  )}

                  {section.id === "ros" && (
                    <div className="mt-4 grid grid-cols-2 gap-4">
                      {rosItems.map((item) => (
                        <div key={item} className="flex items-center gap-2">
                          <Checkbox id={item} />
                          <Label htmlFor={item} className="text-sm font-normal cursor-pointer">
                            {item}
                          </Label>
                        </div>
                      ))}
                    </div>
                  )}

                  {section.id === "physical-exam" && (
                    <Textarea
                      placeholder="Document physical examination findings"
                      className="mt-4 min-h-[120px]"
                    />
                  )}

                  {section.id === "assessment-plan" && (
                    <Textarea
                      placeholder="Enter assessment and plan"
                      className="mt-4 min-h-[120px]"
                    />
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>

      <div className="flex items-center justify-end gap-3 pt-4">
        <span className="text-xs text-muted-foreground">Last saved: Just now</span>
      </div>
    </div>
  );
}
