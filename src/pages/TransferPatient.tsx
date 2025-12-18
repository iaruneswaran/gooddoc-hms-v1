import { useState, useEffect } from "react";
import { useParams, useNavigate, useSearchParams } from "react-router-dom";
import { ChevronLeft, Save, X } from "lucide-react";
import { AppSidebar } from "@/components/AppSidebar";
import { AppHeader } from "@/components/AppHeader";
import { PageContent } from "@/components/PageContent";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { TransferStepper } from "@/components/transfer/TransferStepper";
import { TransferTimeline } from "@/components/transfer/TransferTimeline";
import { TransferDetailsStep } from "@/components/transfer/steps/TransferDetailsStep";
import { DestinationBedStep } from "@/components/transfer/steps/DestinationBedStep";
import { PreTransferChecklistStep } from "@/components/transfer/steps/PreTransferChecklistStep";
import { ReviewConfirmStep } from "@/components/transfer/steps/ReviewConfirmStep";
import { TransferRequest, Bed, TransferTimelineEvent, ChecklistItem } from "@/types/transfer";
import { getDefaultChecklist } from "@/data/transfer.mock";

const steps = [
  { id: 1, title: "Transfer Details", description: "Type, priority & schedule" },
  { id: 2, title: "Choose Destination", description: "Select available bed" },
  { id: 3, title: "Pre-Transfer Checklist", description: "Clinical & operational" },
  { id: 4, title: "Review & Confirm", description: "Final verification" },
];

const TransferPatient = () => {
  const { patientId } = useParams();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const fromPage = searchParams.get("from");
  const { toast } = useToast();

  const [currentStep, setCurrentStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [selectedBed, setSelectedBed] = useState<Bed | undefined>();

  // Mock patient data
  const patient = {
    name: "Harish Kalyan",
    gdid: "001",
    age: 44,
    gender: "Male",
    mrn: "MRN0100000",
    currentLocation: {
      unitId: "unit-ward-a",
      unitName: "Ward A",
      roomId: "room-wa-102",
      roomName: "Room 102",
      bedId: "bed-wa-3",
      bedName: "WA-102-1",
    },
    currentTariff: 3500,
    admissionStatus: "Admitted",
  };

  const [transferData, setTransferData] = useState<Partial<TransferRequest>>({
    patientId: patientId,
    patientName: patient.name,
    fromLocation: patient.currentLocation,
    transferType: undefined,
    priority: "routine",
    reason: undefined,
    scheduleType: "now",
    notes: "",
    orderingClinician: "",
    insurancePreAuthRequired: false,
    checklist: [],
    attachments: [],
    status: "draft",
    timeline: [],
  });

  // Update checklist when transfer type or priority changes
  useEffect(() => {
    if (transferData.transferType && transferData.priority) {
      const defaultChecklist = getDefaultChecklist(
        transferData.transferType,
        transferData.priority
      );
      setTransferData((prev) => ({
        ...prev,
        checklist: defaultChecklist,
        insurancePreAuthRequired: transferData.transferType === "ward_to_icu",
      }));
    }
  }, [transferData.transferType, transferData.priority]);

  // Auto-save draft
  useEffect(() => {
    const timer = setTimeout(() => {
      // In real app, save to backend
      console.log("Auto-saving draft...", transferData);
    }, 2000);
    return () => clearTimeout(timer);
  }, [transferData]);

  const handleDataChange = (updates: Partial<TransferRequest>) => {
    setTransferData((prev) => ({ ...prev, ...updates }));
  };

  const handleChecklistChange = (checklist: ChecklistItem[]) => {
    setTransferData((prev) => ({ ...prev, checklist }));
  };

  const handleSelectBed = (bed: Bed) => {
    setSelectedBed(bed);
    handleDataChange({
      toLocation: {
        unitId: bed.unitId,
        unitName: bed.unitName,
        roomId: bed.roomId,
        roomName: bed.roomName,
        bedId: bed.id,
        bedName: bed.bedName,
      },
      costDelta: bed.tariff - patient.currentTariff,
    });
    toast({
      title: `Bed ${bed.bedName} selected`,
      description: `${bed.unitName} • ${bed.roomName}`,
    });
  };

  const handleHoldBed = (bed: Bed) => {
    // In real app, call API to hold bed
    const newEvent: TransferTimelineEvent = {
      id: `event-${Date.now()}`,
      type: "hold",
      timestamp: new Date(),
      actor: "Current User",
      description: `Bed ${bed.bedName} held for 15 minutes`,
    };
    handleDataChange({
      timeline: [...(transferData.timeline || []), newEvent],
    });
  };

  const handleNext = () => {
    if (currentStep < 4) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleSaveDraft = () => {
    toast({
      title: "Draft saved",
      description: "Transfer request saved as draft",
    });
  };

  const handleConfirm = async () => {
    setIsSubmitting(true);
    
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1500));
    
    const transferId = `TR-${Date.now().toString().slice(-6)}`;
    
    toast({
      title: "Transfer request created",
      description: `Transfer ID: ${transferId}`,
    });
    
    // Navigate to success or back to patient insights
    navigate(`/patient-insights/${patientId}${fromPage ? `?from=${fromPage}` : ""}`);
  };

  const handleCancel = () => {
    navigate(`/patient-insights/${patientId}${fromPage ? `?from=${fromPage}` : ""}`);
  };

  const canProceed = () => {
    switch (currentStep) {
      case 1:
        return transferData.transferType && transferData.priority && transferData.reason;
      case 2:
        return !!selectedBed;
      case 3:
        const requiredItems = transferData.checklist?.filter((item) => item.required) || [];
        return requiredItems.every((item) => item.checked);
      default:
        return true;
    }
  };

  const breadcrumbConfig: Record<string, { label: string; path: string }> = {
    "patients": { label: "Patients", path: "/patients" },
    "appointments": { label: "Appointments", path: "/" },
    "op-patients": { label: "OP Patients", path: "/patients/op" },
    "ip-patients": { label: "IP Patients", path: "/patients/ip" },
  };

  const currentBreadcrumb = breadcrumbConfig[fromPage || ""] || { label: "Appointments", path: "/" };

  return (
    <div className="flex h-screen bg-background overflow-hidden">
      <AppSidebar />
      
      <PageContent className="flex flex-col overflow-hidden">
        <AppHeader breadcrumbs={[
          { label: currentBreadcrumb.label, onClick: () => navigate(currentBreadcrumb.path) },
          { label: "Patient Insight", onClick: () => navigate(`/patient-insights/${patientId}${fromPage ? `?from=${fromPage}` : ""}`) },
          "Transfer Patient"
        ]} />
        
        {/* Fixed Header */}
        <div className="bg-background border-b border-border flex-shrink-0">
          <div className="px-6 py-4">
            {/* Back Button */}
            <button
              onClick={handleCancel}
              className="flex items-center gap-2 text-sm text-foreground hover:text-primary transition-colors mb-4"
            >
              <ChevronLeft className="h-4 w-4" />
              <span className="font-semibold">Patient Insight</span>
            </button>

            {/* Header Actions */}
            <div className="flex items-center justify-end">
              <div className="flex items-center gap-3">
                <div className="text-right">
                  <p className="text-xs text-muted-foreground">Current Location</p>
                  <p className="font-medium">
                    {patient.currentLocation.unitName} • {patient.currentLocation.bedName}
                  </p>
                </div>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm" onClick={handleSaveDraft}>
                    <Save className="w-4 h-4 mr-1" />
                    Save Draft
                  </Button>
                  <Button variant="ghost" size="sm" onClick={handleCancel}>
                    <X className="w-4 h-4 mr-1" />
                    Cancel
                  </Button>
                </div>
              </div>
            </div>
          </div>

          {/* Stepper */}
          <div className="px-6 pb-4">
            <TransferStepper
              steps={steps}
              currentStep={currentStep}
              onStepClick={(step) => step <= currentStep && setCurrentStep(step)}
            />
          </div>
        </div>

        {/* Main Content */}
        <main className="flex-1 flex overflow-hidden min-h-0">
          {/* Left Panel - Step Content */}
          <div className="flex-1 overflow-y-auto p-6">
            <div className="max-w-3xl">
              {currentStep === 1 && (
                <TransferDetailsStep
                  data={transferData}
                  onChange={handleDataChange}
                  currentTariff={patient.currentTariff}
                />
              )}
              
              {currentStep === 2 && (
                <DestinationBedStep
                  selectedBed={selectedBed}
                  onSelectBed={handleSelectBed}
                  onHoldBed={handleHoldBed}
                  patientGender={patient.gender}
                  patientAgeGroup="adult"
                />
              )}
              
              {currentStep === 3 && (
                <PreTransferChecklistStep
                  checklist={transferData.checklist || []}
                  onChecklistChange={handleChecklistChange}
                  priority={transferData.priority || "routine"}
                />
              )}
              
              {currentStep === 4 && (
                <ReviewConfirmStep
                  data={transferData}
                  selectedBed={selectedBed}
                  currentTariff={patient.currentTariff}
                  onConfirm={handleConfirm}
                  onSaveDraft={handleSaveDraft}
                  isSubmitting={isSubmitting}
                />
              )}
            </div>
          </div>

          {/* Right Rail - Timeline */}
          <div className="w-80 border-l border-border bg-muted/30 flex-shrink-0 overflow-y-auto">
            <Card className="m-4 border-0 shadow-none bg-transparent">
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-semibold">Transfer Timeline</CardTitle>
              </CardHeader>
              <CardContent>
                <TransferTimeline events={transferData.timeline || []} />
              </CardContent>
            </Card>
          </div>
        </main>

        {/* Footer Navigation */}
        {currentStep < 4 && (
          <div className="border-t border-border bg-background px-6 py-4 flex-shrink-0">
            <div className="flex justify-between max-w-3xl">
              <Button
                variant="outline"
                onClick={handleBack}
                disabled={currentStep === 1}
              >
                Back
              </Button>
              <Button
                onClick={handleNext}
                disabled={!canProceed()}
              >
                {currentStep === 3 ? "Review Transfer" : "Continue"}
              </Button>
            </div>
          </div>
        )}
      </PageContent>
    </div>
  );
};

export default TransferPatient;
