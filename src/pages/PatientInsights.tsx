import { useState, useEffect } from "react";
import { useParams, useNavigate, useSearchParams } from "react-router-dom";
import { ChevronLeft } from "lucide-react";
import { AppSidebar } from "@/components/AppSidebar";
import { AppHeader } from "@/components/AppHeader";
import { PageContent } from "@/components/PageContent";
import { Button } from "@/components/ui/button";
import { PatientChip } from "@/components/patient-insights/PatientChip";
import { KpiTile } from "@/components/patient-insights/KpiTile";
import { VisitDetailsTabs } from "@/components/patient-insights/VisitDetailsTabs";
import { VisitSelector } from "@/components/patient-insights/VisitSelector";
import { VisitProvider, useVisit, VisitOption } from "@/contexts/VisitContext";
import { Visit } from "@/components/patient-insights/VisitListItem";

// Mock visits data
const mockVisits: Visit[] = [
  {
    id: "visit-1",
    visitId: "V25-001",
    datetime: new Date(2025, 7, 5, 17, 30),
    type: "Consultation",
    status: "Completed",
    location: "OPD Clinic 3",
    doctor: "Dr. Meera Nair – Cardiology",
    items: [
      {
        type: "Consultation",
        datetime: "05 Aug 2025 | 05:30 PM",
        doctor: "Dr. Meera Nair – Cardiology",
        visitId: "V25-001",
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
    visitId: "V25-002",
    datetime: new Date(2025, 7, 5, 14, 15),
    type: "Laboratory",
    status: "Completed",
    location: "Central Diagnostic Lab",
    doctor: "Dr. Ravi Menon – Pathology",
    items: [
      {
        type: "Laboratory",
        datetime: "05 Aug 2025 | 02:15 PM",
        doctor: "Dr. Ravi Menon – Pathology",
        visitId: "V25-002",
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
    visitId: "V25-003",
    datetime: new Date(2025, 7, 5, 15, 0),
    type: "Radiology",
    status: "Completed",
    location: "Imaging Suite 2",
    doctor: "Dr. Anjali Verma – Radiology",
    items: [
      {
        type: "Radiology",
        datetime: "05 Aug 2025 | 03:00 PM",
        doctor: "Dr. Anjali Verma – Radiology",
        visitId: "V25-003",
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
    visitId: "V25-004",
    datetime: new Date(2025, 7, 7, 11, 0),
    type: "IPD Admission",
    status: "Active",
    location: "Inpatient Wing A",
    doctor: "Dr. Karthik Reddy – General Medicine",
    emergencyContact: "+91 98765 12345",
    items: [
      {
        type: "IPD Admission",
        datetime: "07 Aug 2025 | 11:00 AM",
        doctor: "Dr. Karthik Reddy – General Medicine",
        admissionId: "V25-004",
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
        visitId: "V25-004",
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
        visitId: "V25-004",
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

// Convert Visit to VisitOption for context
function toVisitOption(visit: Visit): VisitOption {
  return {
    id: visit.id,
    visitId: visit.visitId,
    datetime: visit.datetime,
    doctor: visit.doctor,
    status: visit.status,
    type: visit.type,
    isActive: visit.status === "Active",
  };
}

const PatientInsightsContent = () => {
  const { patientId } = useParams();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const fromPage = searchParams.get("from");
  const [activeTab, setActiveTab] = useState("appointments");
  
  const { setVisits, selectedVisit: selectedVisitOption, setIsLoading } = useVisit();

  // Mapping for breadcrumb navigation based on source page
  const breadcrumbConfig: Record<string, { label: string; path: string }> = {
    "patients": { label: "Patients", path: "/patients" },
    "appointments": { label: "Appointments", path: "/" },
    "op-patients": { label: "OP Patients", path: "/patients/op" },
    "ip-patients": { label: "IP Patients", path: "/patients/ip" },
    "discharged": { label: "Discharged", path: "/discharged" },
    "emergency": { label: "Emergency Cases", path: "/emergency" },
    "surgeries": { label: "Surgeries", path: "/surgeries" },
    "pharmacy": { label: "Medicine Orders", path: "/pharmacy" },
    "transfers": { label: "Transfers", path: "/transfers" },
  };

  const currentBreadcrumb = breadcrumbConfig[fromPage || ""] || { label: "Appointments", path: "/" };

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
    bloodGroup: "O+",
    address: "Anna Nagar",
    pincode: "012 345",
    state: "Tamil Nadu",
    city: "Chennai",
    country: "India",
    outstandingTotal: "6,600",
    advanceAmount: "3,200",
    billsAmount: "9,800",
    balanceAmount: "3,400",
  };

  // Load visits into context on mount
  useEffect(() => {
    setIsLoading(true);
    // Simulate API call
    setTimeout(() => {
      const visitOptions = mockVisits.map(toVisitOption);
      setVisits(visitOptions);
      setIsLoading(false);
    }, 100);
  }, [setVisits, setIsLoading]);

  // Find the full visit object for the selected visit
  const selectedVisit = selectedVisitOption 
    ? mockVisits.find(v => v.visitId === selectedVisitOption.visitId) || null
    : null;

  return (
    <div className="flex h-screen bg-background overflow-hidden">
      <AppSidebar />
      
      <PageContent className="flex flex-col overflow-hidden">
        <AppHeader breadcrumbs={[
          { 
            label: currentBreadcrumb.label, 
            onClick: () => navigate(currentBreadcrumb.path) 
          }, 
          "Patient Insight"
        ]} />
        
        {/* Fixed Header with Patient Info and Actions */}
        <div className="bg-background border-b border-border flex-shrink-0">
          <div className="px-6 py-6">
            {/* Top Row: Back Button + KPIs */}
            <div className="flex items-start justify-between mb-4">
              {/* Back Button */}
              <button
                onClick={() => navigate(currentBreadcrumb.path)}
                className="flex items-center gap-2 text-sm text-foreground hover:text-primary transition-colors"
              >
                <ChevronLeft className="h-4 w-4" />
                <span className="font-semibold">{currentBreadcrumb.label}</span>
              </button>

              {/* Right: KPIs */}
              <div className="flex gap-3">
                <KpiTile label="Outstanding Total" amount={patient.outstandingTotal} />
                <KpiTile label="Advance Amount" amount={patient.advanceAmount} />
                <KpiTile label="Bills Amount" amount={patient.billsAmount} />
                <KpiTile label="Balance Amount" amount={patient.balanceAmount} />
              </div>
            </div>

            {/* Middle Row: Patient Chip and Buttons */}
            <div className="flex items-center gap-2">
              <PatientChip
                name={patient.name}
                gdid={patient.gdid}
                age={patient.age}
                gender={patient.gender}
              />
              
              <div className="flex gap-2">
                <Button 
                  size="sm"
                  onClick={() => navigate(`/patient-insights/${patientId}/services${fromPage ? `?from=${fromPage}` : ''}`)}
                >
                  Services
                </Button>
                <Button 
                  variant="outline"
                  size="sm"
                  onClick={() => navigate(`/patient-insights/${patientId}/transfer${fromPage ? `?from=${fromPage}` : ''}`)}
                >
                  Transfer
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

            {/* Bottom Row: Visit Selector */}
            <div className="mt-4 pt-4 border-t border-border">
              <VisitSelector />
            </div>
          </div>
        </div>

        {/* Main Content */}
        <main className="flex-1 flex flex-col overflow-hidden min-h-0">
          <VisitDetailsTabs
            selectedVisit={selectedVisit}
            activeTab={activeTab}
            onTabChange={setActiveTab}
            patient={patient}
          />
        </main>
      </PageContent>
    </div>
  );
};

const PatientInsights = () => {
  return (
    <VisitProvider>
      <PatientInsightsContent />
    </VisitProvider>
  );
};

export default PatientInsights;
