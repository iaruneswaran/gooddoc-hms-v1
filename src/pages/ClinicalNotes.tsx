import { PatientSnapshot } from "@/components/clinical-notes/PatientSnapshot";
import { PrescriptionQuickAdd } from "@/components/clinical-notes/PrescriptionQuickAdd";
import { ActivityOverview } from "@/components/clinical-notes/ActivityOverview";
import { ClinicalNotesEditor } from "@/components/clinical-notes/ClinicalNotesEditor";

export default function ClinicalNotes() {
  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <div className="border-b bg-card">
        <div className="max-w-[1600px] mx-auto px-6 py-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Left: Patient Snapshot + Vitals + Allergies (2/3 width) */}
            <div className="lg:col-span-2">
              <PatientSnapshot />
            </div>

            {/* Right: Prescription Quick-Add (1/3 width, sticky) */}
            <div className="lg:sticky lg:top-24 lg:self-start">
              <PrescriptionQuickAdd />
            </div>
          </div>
        </div>
      </div>

      {/* Activity Overview Strip */}
      <div className="border-b bg-muted/30">
        <div className="max-w-[1600px] mx-auto px-6 py-6">
          <ActivityOverview />
        </div>
      </div>

      {/* Clinical Notes Editor */}
      <div className="max-w-[1600px] mx-auto px-6 py-8">
        <ClinicalNotesEditor />
      </div>
    </div>
  );
}
