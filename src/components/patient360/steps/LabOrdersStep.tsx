import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Patient } from "@/types/patient360";
import { LaboratoryBookingForm, LaboratoryData } from "@/components/LaboratoryBookingForm";
import { useToast } from "@/hooks/use-toast";

interface LabOrdersStepProps {
  patient: Patient;
  onBack: () => void;
}

export function LabOrdersStep({ patient, onBack }: LabOrdersStepProps) {
  const { toast } = useToast();
  const [labData, setLabData] = useState<LaboratoryData>({
    mode: "laboratory",
    selectedTests: [],
    selectedPackages: [],
    selectedRadiologyTests: [],
    laboratoryDate: new Date(2025, 7, 5),
    laboratoryTime: "07:30",
    radiologyDate: new Date(2025, 7, 5),
    radiologyTime: "07:30"
  });

  const handleUpdate = (data: LaboratoryData) => {
    setLabData(data);
  };

  const handleOrderNow = () => {
    toast({
      title: "Order Placed",
      description: "Lab order has been successfully placed"
    });
  };

  return (
    <div>
      <LaboratoryBookingForm 
        onUpdate={handleUpdate}
        initialData={labData}
        hideMode={false}
      />
      
      <div className="flex items-center justify-between mt-6 px-6">
        <Button variant="ghost" onClick={onBack}>
          Back
        </Button>
        <div className="flex gap-2">
          <Button variant="outline">Print Requisition</Button>
          <Button variant="outline">Share to patient</Button>
          <Button onClick={handleOrderNow}>Order Now</Button>
        </div>
      </div>
    </div>
  );
}
