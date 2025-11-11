import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ChevronLeft } from "lucide-react";
import { AppSidebar } from "@/components/AppSidebar";
import { AppHeader } from "@/components/AppHeader";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { PatientChip } from "@/components/patient-insights/PatientChip";
import { KpiTile } from "@/components/patient-insights/KpiTile";
import { ProfileSlideOver } from "@/components/patient-insights/ProfileSlideOver";
import { VisitsList } from "@/components/patient-insights/VisitsList";
import { VisitDetailsTabs } from "@/components/patient-insights/VisitDetailsTabs";
import { Visit } from "@/components/patient-insights/VisitListItem";

const PatientInsights = () => {
  const { patientId } = useParams();
  const navigate = useNavigate();
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("appointments");

  // Mock patient data
  const patient = {
    name: "Harish Kalyan",
    gdid: "001",
    title: "Mr",
    age: 44,
    gender: "Male",
    dob: "10/04/1980",
    mobile: "+91 98765 43210",
    email: "name@example.com",
    nationalId: "9876 5432 1098",
    address: "Anna Nagar",
    pincode: "012 345",
    state: "Tamil Nadu",
    city: "Chennai",
    country: "India",
    outstandingTotal: "6,600",
    advanceAmount: "3,200",
  };

  // Transform mock data into visits format
  const visits: Visit[] = [
    {
      id: "visit-1",
      visitId: "VST-102345",
      datetime: new Date(2025, 7, 5, 17, 30), // Aug 05, 2025, 5:30 PM
      type: "Consultation",
      status: "Completed",
      location: "OPD Clinic 3",
      doctor: "Dr. Meera Nair – Cardiology",
      items: [
        {
          type: "Consultation",
          datetime: "05 Aug 2025 | 05:30 PM",
          doctor: "Dr. Meera Nair – Cardiology",
          visitId: "VST-102345",
          provider: "Dr. Sarah Khan",
          department: "Internal Medicine",
          opdClinic: "OPD Clinic 3",
          prescriptions: [
            "Azithromycin 500 mg OD × 3 days",
            "Paracetamol 500 mg Q6h PRN",
            "Dextromethorphan syrup 10 mL HS × 5 days",
            "Azithromycin 500 mg OD × 3 days",
          ],
          findings: "Patient presents with symptoms suggestive of upper respiratory tract infection. Mild throat congestion and cough noted, with low-grade fever. No signs of respiratory distress or chest involvement. Overall condition stable.",
        },
      ],
    },
    {
      id: "visit-2",
      visitId: "VST-102346",
      datetime: new Date(2025, 7, 5, 14, 15), // Aug 05, 2025, 2:15 PM
      type: "Laboratory",
      status: "Completed",
      location: "Central Diagnostic Lab",
      doctor: "Dr. Ravi Menon – Pathology",
      items: [
        {
          type: "Laboratory",
          datetime: "05 Aug 2025 | 02:15 PM",
          doctor: "Dr. Ravi Menon – Pathology",
          visitId: "VST-102346",
          provider: "Central Diagnostic Lab",
          department: "Laboratory Services",
          testsOrdered: [
            "Complete Blood Count (CBC)",
            "C-Reactive Protein (CRP)",
          ],
          findings: "Blood samples collected for infection markers. CRP levels slightly elevated, consistent with acute infection. WBC count within acceptable range.",
        },
      ],
    },
    {
      id: "visit-3",
      visitId: "VST-102912",
      datetime: new Date(2025, 7, 5, 15, 0), // Aug 05, 2025, 3:00 PM
      type: "Radiology",
      status: "Completed",
      location: "Imaging Suite 2",
      doctor: "Dr. Anjali Verma – Radiology",
      items: [
        {
          type: "Radiology",
          datetime: "05 Aug 2025 | 03:00 PM",
          doctor: "Dr. Anjali Verma – Radiology",
          visitId: "VST-102912",
          provider: "Imaging Suite 2",
          department: "Radiology",
          investigations: [
            "Chest X-ray (PA View)",
            "Ultrasound Abdomen",
          ],
          findings: "Chest X-ray shows clear lung fields with no evidence of consolidation. Ultrasound abdomen reveals mild fatty liver changes. No structural abnormalities detected. Reports shared with referring physician for correlation.",
        },
      ],
    },
    {
      id: "visit-4",
      visitId: "VST-205431",
      datetime: new Date(2025, 7, 7, 11, 0), // Aug 07, 2025, 11:00 AM
      type: "IPD Admission",
      status: "Active",
      location: "Inpatient Wing A",
      doctor: "Dr. Karthik Reddy – General Medicine",
      items: [
        {
          type: "IPD Admission",
          datetime: "07 Aug 2025 | 11:00 AM",
          doctor: "Dr. Karthik Reddy – General Medicine",
          admissionId: "VST-205431",
          admittingDiagnosis: "Acute Gastroenteritis",
          roomType: "Private Room – 204",
          provider: "Inpatient Wing A",
          department: "General Medicine",
          findings: "Patient admitted for IV fluid therapy and symptomatic management. Vital signs stable; mild dehydration noted on admission. Responding well to treatment. Daily monitoring of electrolytes and hydration status advised.",
        },
        {
          type: "Laboratory",
          datetime: "07 Aug 2025 | 01:00 PM",
          doctor: "Dr. Ravi Menon – Pathology",
          visitId: "VST-205431",
          provider: "Central Diagnostic Lab",
          department: "Laboratory Services",
          testsOrdered: [
            "Electrolyte Panel",
            "Kidney Function Test",
          ],
          findings: "Electrolyte levels monitored for IV therapy adjustment. Sodium and potassium levels within normal range.",
        },
        {
          type: "Radiology",
          datetime: "07 Aug 2025 | 02:30 PM",
          doctor: "Dr. Anjali Verma – Radiology",
          visitId: "VST-205431",
          provider: "Imaging Suite 2",
          department: "Radiology",
          investigations: [
            "Abdominal Ultrasound",
          ],
          findings: "Ultrasound shows no signs of acute pathology. Bowel loops appear normal with no obstruction.",
        },
      ],
    },
  ];

  // Sort visits by date (latest first) and select the latest by default
  const sortedVisits = [...visits].sort((a, b) => b.datetime.getTime() - a.datetime.getTime());
  const [selectedVisitId, setSelectedVisitId] = useState<string>(sortedVisits[0]?.id || "");
  const selectedVisit = sortedVisits.find((v) => v.id === selectedVisitId) || null;

  return (
    <div className="flex h-screen bg-background overflow-hidden">
      <AppSidebar />
      
      <div className="flex-1 ml-[196px] flex flex-col overflow-hidden">
        <AppHeader breadcrumbs={["Appointments", "Patient Insights"]} />
        
        {/* Fixed Header with Patient Info and Actions */}
        <div className="bg-background border-b border-border flex-shrink-0">
          <div className="px-6 py-6">
            {/* Back Button */}
            <button
              onClick={() => navigate("/patients")}
              className="flex items-center gap-2 text-sm text-foreground hover:text-primary transition-colors mb-4"
            >
              <ChevronLeft className="h-4 w-4" />
              <span className="font-semibold">Patients</span>
            </button>

            {/* Header Content */}
            <div className="flex items-center justify-between gap-6">
              {/* Left: Patient Chip and Buttons */}
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-3">
                  <PatientChip
                    name={patient.name}
                    gdid={patient.gdid}
                    age={patient.age}
                    gender={patient.gender}
                    onClick={() => setIsProfileOpen(true)}
                  />
                  {selectedVisit && (
                    <div className="flex items-center gap-2 px-3 h-9 bg-muted rounded-md">
                      <span className="text-xs text-muted-foreground">Active Visit:</span>
                      <Badge variant="secondary" className="font-mono">{selectedVisit.visitId}</Badge>
                    </div>
                  )}
                </div>
                
                <div className="flex gap-2">
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => navigate("/book-appointment", { 
                      state: { fromPatientInsights: true, patientId } 
                    })}
                  >
                    Book Appointment
                  </Button>
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => navigate(`/patient-insights/${patientId}/timeline`, {
                      state: { visitId: selectedVisit?.visitId }
                    })}
                  >
                    Timeline
                  </Button>
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => navigate(`/patient-insights/${patientId}/discharge`, {
                      state: { visitId: selectedVisit?.visitId }
                    })}
                  >
                    Discharge
                  </Button>
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => navigate(`/patient-insights/${patientId}/payments`)}
                  >
                    Payments
                  </Button>
                </div>
              </div>

              {/* Right: KPIs */}
              <div className="flex gap-3">
                <KpiTile label="Outstanding Total" amount={patient.outstandingTotal} />
                <KpiTile label="Advance Amount" amount={patient.advanceAmount} />
              </div>
            </div>
          </div>
        </div>

        {/* Two-Pane Layout with Independent Scrolling */}
        <main className="flex-1 flex overflow-hidden min-h-0">
          {/* Left: Visits List (32% width) */}
          <div className="w-[32%] border-r border-border flex flex-col overflow-hidden">
            <VisitsList
              visits={sortedVisits}
              selectedVisitId={selectedVisitId}
              onVisitSelect={setSelectedVisitId}
            />
          </div>

          {/* Right: Details Tabs (68% width) */}
          <div className="flex-1 flex flex-col overflow-hidden">
            <VisitDetailsTabs
              selectedVisit={selectedVisit}
              activeTab={activeTab}
              onTabChange={setActiveTab}
            />
          </div>
        </main>
      </div>

      {/* Profile Slide-over */}
      <ProfileSlideOver
        isOpen={isProfileOpen}
        onClose={() => setIsProfileOpen(false)}
        patient={patient}
        onEdit={() => {
          // Handle edit action
          setIsProfileOpen(false);
        }}
      />
    </div>
  );
};

export default PatientInsights;
