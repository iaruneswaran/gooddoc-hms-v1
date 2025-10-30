import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { ChevronLeft, Calendar, FlaskConical, Scan, Bed, Syringe, Trash2 } from "lucide-react";
import { AppSidebar } from "@/components/AppSidebar";
import { AppHeader } from "@/components/AppHeader";
import { BookingSteps } from "@/components/BookingSteps";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { ConsultationBookingForm, ConsultationData } from "@/components/ConsultationBookingForm";
import { LaboratoryBookingForm, LaboratoryData } from "@/components/LaboratoryBookingForm";
import { RadiologyBookingForm, RadiologyData } from "@/components/RadiologyBookingForm";
import { IPDAdmissionBookingForm, IPDAdmissionData } from "@/components/IPDAdmissionBookingForm";
import { DCProcedureBookingForm, DCProcedureData } from "@/components/DCProcedureBookingForm";
import { LineItemPriceEditor } from "@/components/pricing/LineItemPriceEditor";
import { AdjustPriceModal } from "@/components/pricing/AdjustPriceModal";
import { GlobalDiscountControls } from "@/components/pricing/GlobalDiscountControls";
import { StickyFooterBar } from "@/components/pricing/StickyFooterBar";
import { usePricingState } from "@/hooks/usePricingState";
import { LineItem } from "@/types/pricing";
import { formatCurrency } from "@/lib/pricingEngine";
import { format } from "date-fns";
import { toast } from "@/hooks/use-toast";

const appointmentTypes = [
  { icon: Calendar, label: "Consultation", value: "consultation" },
  { icon: FlaskConical, label: "Laboratory", value: "laboratory" },
  { icon: Scan, label: "Radiology", value: "radiology" },
  { icon: Bed, label: "IP Admission", value: "ipd" },
  { icon: Syringe, label: "Day-Care Procedure", value: "dc" },
];

const BookAppointment = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const fromPatientInsights = location.state?.fromPatientInsights;
  const patientId = location.state?.patientId;
  const visitId = location.state?.visitId; // Visit ID for new appointments
  const [selectedTypes, setSelectedTypes] = useState<string[]>([]);
  const [consultationData, setConsultationData] = useState<ConsultationData | null>(null);
  const [laboratoryData, setLaboratoryData] = useState<LaboratoryData | null>(null);
  const [radiologyData, setRadiologyData] = useState<RadiologyData | null>(null);
  const [ipdAdmissionData, setIpdAdmissionData] = useState<IPDAdmissionData | null>(null);
  const [dcProcedureData, setDcProcedureData] = useState<DCProcedureData | null>(null);
  
  // Pricing state management
  const pricing = usePricingState();
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedItemForModal, setSelectedItemForModal] = useState<LineItem | null>(null);

  // Sync line items with selected services
  useEffect(() => {
    const items: LineItem[] = [];

    if (consultationData) {
      items.push({
        id: 'consultation-1',
        name: 'Consultation',
        category: 'Consultation',
        basePrice: 1000,
        isDiscountable: true,
        floorPrice: 500,
        taxRateComponents: { cgst: 9, sgst: 9 },
      });
    }

    if (laboratoryData) {
      laboratoryData.selectedTests.forEach((test) => {
        items.push({
          id: `lab-test-${test.id}`,
          name: test.name,
          category: 'Laboratory',
          basePrice: test.price,
          isDiscountable: true,
          floorPrice: test.price * 0.5,
          taxRateComponents: { cgst: 9, sgst: 9 },
        });
      });
      laboratoryData.selectedPackages.forEach((pkg) => {
        items.push({
          id: `lab-pkg-${pkg.id}`,
          name: pkg.name,
          category: 'Laboratory Package',
          basePrice: pkg.price,
          isDiscountable: true,
          floorPrice: pkg.price * 0.5,
          taxRateComponents: { cgst: 9, sgst: 9 },
        });
      });
    }

    if (radiologyData) {
      radiologyData.selectedTests.forEach((test) => {
        items.push({
          id: `rad-test-${test.id}`,
          name: test.name,
          category: 'Radiology',
          basePrice: test.price,
          isDiscountable: true,
          floorPrice: test.price * 0.5,
          taxRateComponents: { cgst: 9, sgst: 9 },
        });
      });
    }

    if (ipdAdmissionData) {
      items.push({
        id: 'ipd-admission-1',
        name: 'IPD Admission',
        category: 'IPD',
        basePrice: 5000,
        isDiscountable: false, // Example: non-discountable
        floorPrice: 5000,
        taxRateComponents: { cgst: 9, sgst: 9 },
      });
    }

    if (dcProcedureData) {
      items.push({
        id: 'dc-procedure-1',
        name: dcProcedureData.procedure,
        category: 'Day Care',
        basePrice: 15000,
        isDiscountable: true,
        floorPrice: 10000,
        taxRateComponents: { cgst: 9, sgst: 9 },
      });
    }

    // Update pricing state (but preserve existing overrides/discounts)
    const existingItems = pricing.lineItems;
    const updatedItems = items.map((item) => {
      const existing = existingItems.find((e) => e.id === item.id);
      return existing ? { ...item, ...existing } : item;
    });

    // Remove items that are no longer selected
    const itemIdsToKeep = new Set(items.map((i) => i.id));
    existingItems.forEach((item) => {
      if (!itemIdsToKeep.has(item.id)) {
        pricing.removeLineItem(item.id);
      }
    });

    // Add new items
    updatedItems.forEach((item) => {
      if (!existingItems.find((e) => e.id === item.id)) {
        pricing.addLineItem(item);
      }
    });
  }, [consultationData, laboratoryData, radiologyData, ipdAdmissionData, dcProcedureData]);

  const handleTypeClick = (type: string) => {
    // Toggle the type - add if not present, remove if already selected
    if (selectedTypes.includes(type)) {
      // Deselect: call the appropriate remove handler
      if (type === "consultation") handleRemoveConsultation();
      else if (type === "laboratory") handleRemoveLaboratory();
      else if (type === "radiology") handleRemoveRadiology();
      else if (type === "ipd") handleRemoveIPDAdmission();
      else if (type === "dc") handleRemoveDCProcedure();
      return;
    }
    
    setSelectedTypes(prev => [...prev, type]);
    
    if (type === "consultation") {
      // Initialize with default data
      setConsultationData({
        mode: "in-person",
        type: "First Visit",
        department: "Cardiology",
        doctor: "Dr. Meera Nair – Cardiology",
        clinicalInfo: "",
        date: new Date(2025, 7, 5),
        time: "07:30",
      });
    } else if (type === "laboratory") {
      // Initialize with default data
      setLaboratoryData({
        mode: "in-clinic",
        selectedTests: [
          { id: "1", name: "Complete Blood Count (CBC)", category: "Hematology", price: 200 },
          { id: "2", name: "Liver Function Test (LFT)", category: "Biochemistry", price: 400 },
        ],
        selectedPackages: [],
        date: new Date(2025, 7, 5),
        time: "07:30",
      });
    } else if (type === "radiology") {
      // Initialize with default data
      setRadiologyData({
        radiologyType: "X-Ray",
        ageGroup: "adults",
        selectedTests: [
          { id: "1", name: "Chest (PA View)", category: "Radiology", price: 500 },
          { id: "2", name: "Cervical Spine", category: "Radiology", price: 600 },
        ],
        date: new Date(2025, 7, 5),
        time: "07:30",
      });
    } else if (type === "ipd") {
      // Initialize with default data
      setIpdAdmissionData({
        department: "General Medicine",
        attendingDoctor: "Dr. A. Joseph (Ophthalmology)",
        ward: "General Ward - 01A",
        bed: "Bed - 35A",
        reasonForAdmission: "",
        date: new Date(2025, 7, 5),
        time: "07:30",
      });
    } else if (type === "dc") {
      // Initialize with default data
      setDcProcedureData({
        department: "General Surgery",
        procedure: "Endoscopy",
        attendingDoctor: "Dr. A. Joseph (Ophthalmology)",
        otRoom: "OT - 05A",
        reasonForProcedure: "",
        date: new Date(2025, 7, 5),
        time: "07:30",
      });
    }
  };

  const handleRemoveConsultation = () => {
    setSelectedTypes(prev => prev.filter(t => t !== "consultation"));
    setConsultationData(null);
  };

  const handleRemoveLaboratory = () => {
    setSelectedTypes(prev => prev.filter(t => t !== "laboratory"));
    setLaboratoryData(null);
  };

  const handleRemoveRadiology = () => {
    setSelectedTypes(prev => prev.filter(t => t !== "radiology"));
    setRadiologyData(null);
  };

  const handleRemoveIPDAdmission = () => {
    setSelectedTypes(prev => prev.filter(t => t !== "ipd"));
    setIpdAdmissionData(null);
  };

  const handleRemoveDCProcedure = () => {
    setSelectedTypes(prev => prev.filter(t => t !== "dc"));
    setDcProcedureData(null);
  };

  const handleConsultationUpdate = (data: ConsultationData) => {
    setConsultationData(data);
  };

  const handleLaboratoryUpdate = (data: LaboratoryData) => {
    setLaboratoryData(data);
  };

  const handleRadiologyUpdate = (data: RadiologyData) => {
    setRadiologyData(data);
  };

  const handleIPDAdmissionUpdate = (data: IPDAdmissionData) => {
    setIpdAdmissionData(data);
  };

  const handleDCProcedureUpdate = (data: DCProcedureData) => {
    setDcProcedureData(data);
  };

  const handleOpenModal = (item: LineItem) => {
    setSelectedItemForModal(item);
    setModalOpen(true);
  };

  const handleApplyModalChanges = (updates: any) => {
    if (!selectedItemForModal) return;

    const { overridePrice, lineDiscountType, lineDiscountValue, reason, approver } = updates;

    if (overridePrice !== undefined) {
      pricing.updateLineItemPrice(selectedItemForModal.id, overridePrice, reason);
    }

    if (lineDiscountType && lineDiscountValue !== undefined) {
      pricing.applyLineDiscount(
        selectedItemForModal.id,
        lineDiscountType,
        lineDiscountValue,
        reason
      );
    }

    // TODO: Store approver info
    if (approver) {
      // Add audit log entry
      console.log('Approver:', approver);
    }

    toast({
      title: "Price updated",
      description: `${selectedItemForModal.name} price has been updated successfully.`,
    });
  };

  const handleApplyCoupon = () => {
    const result = pricing.applyCoupon(pricing.couponCode);
    toast({
      title: result.success ? "Coupon applied" : "Invalid coupon",
      description: result.message,
      variant: result.success ? "default" : "destructive",
    });
  };

  return (
    <div className="flex min-h-screen bg-background">
      <AppSidebar />
      
      <div className="flex-1 ml-[196px]">
        <AppHeader breadcrumbs={["GoodDoc", "Appointments", "Appointment"]} />
        
        <main className="p-8 pb-32">
          <button
            onClick={() => navigate(fromPatientInsights ? `/patient-insights/${patientId}` : "/registration")}
            className="flex items-center gap-2 text-sm text-foreground hover:text-primary transition-colors mb-6"
          >
            <ChevronLeft className="w-4 h-4" />
            <span className="font-semibold">{fromPatientInsights ? "Patient Insights" : "Registration"}</span>
          </button>

          <BookingSteps currentStep="appointment" hideSteps={fromPatientInsights ? ["search", "registration"] : []} />

          <div className="max-w-[1600px] mx-auto">
            <h2 className="text-lg font-semibold text-primary mb-4">Book Appointments</h2>
            
            {/* Appointment Type Buttons */}
            <div className="mb-8">
              <div className="flex gap-3">
                {appointmentTypes.map((type) => {
                  const Icon = type.icon;
                  const isSelected = selectedTypes.includes(type.value);
                  return (
                    <Button
                      key={type.value}
                      variant={isSelected ? "default" : "outline"}
                      className={cn(
                        "group h-9 px-4 flex items-center gap-2 hover:bg-primary hover:border-primary hover:text-primary-foreground transition-colors whitespace-nowrap",
                        isSelected && "bg-primary text-primary-foreground"
                      )}
                      onClick={() => handleTypeClick(type.value)}
                    >
                      <Icon className={cn("w-4 h-4 transition-colors", isSelected ? "text-primary-foreground" : "text-foreground group-hover:text-primary-foreground")} />
                      <span className="text-sm">{type.label}</span>
                    </Button>
                  );
                })}
              </div>
            </div>

            <div className="flex flex-col lg:flex-row gap-6 items-start">
              {/* Main Content */}
              <div className="w-full flex-1 space-y-6">
                {/* Display all selected forms in reverse order (most recent at top) */}
                {selectedTypes.length === 0 ? (
                  <Card className="border-dashed min-h-[400px] flex flex-col items-center justify-center p-8">
                    <p className="text-sm font-medium text-muted-foreground mb-1">No Appointments</p>
                    <p className="text-xs text-muted-foreground">Booking appointments will appear here</p>
                  </Card>
                ) : (
                  <>
                    {[...selectedTypes].reverse().map((type) => {
                      if (type === "laboratory" && laboratoryData) {
                        return (
                          <LaboratoryBookingForm
                            key="laboratory"
                            onRemove={handleRemoveLaboratory}
                            onUpdate={handleLaboratoryUpdate}
                          />
                        );
                      }
                      if (type === "consultation" && consultationData) {
                        return (
                          <ConsultationBookingForm
                            key="consultation"
                            onRemove={handleRemoveConsultation}
                            onUpdate={handleConsultationUpdate}
                          />
                        );
                      }
                      if (type === "radiology" && radiologyData) {
                        return (
                          <RadiologyBookingForm
                            key="radiology"
                            onRemove={handleRemoveRadiology}
                            onUpdate={handleRadiologyUpdate}
                          />
                        );
                      }
                      if (type === "ipd" && ipdAdmissionData) {
                        return (
                          <IPDAdmissionBookingForm
                            key="ipd"
                            onRemove={handleRemoveIPDAdmission}
                            onUpdate={handleIPDAdmissionUpdate}
                          />
                        );
                      }
                      if (type === "dc" && dcProcedureData) {
                        return (
                          <DCProcedureBookingForm
                            key="dc"
                            onRemove={handleRemoveDCProcedure}
                            onUpdate={handleDCProcedureUpdate}
                          />
                        );
                      }
                      return null;
                    })}
                  </>
                )}

              </div>

              {/* Appointment Summary Sidebar */}
              <Card className="w-full lg:w-[380px] p-6 h-fit shrink-0">
                <h3 className="text-sm font-semibold text-foreground mb-6">Appointment Summary</h3>
                
                <div className="space-y-6">
                  <div>
                    <p className="text-xs text-muted-foreground mb-2">Patient</p>
                    <p className="text-sm font-medium text-foreground">Siva Karthikeyan</p>
                    <p className="text-xs text-muted-foreground mt-1">GDID - 009 • 35 | M</p>
                  </div>

                  {visitId && (
                    <div>
                      <p className="text-xs text-muted-foreground mb-2">Visit ID</p>
                      <p className="text-sm font-medium text-foreground">{visitId}</p>
                    </div>
                  )}

                  {selectedTypes.length === 0 ? (
                    <div className="pt-6 border-t border-border">
                      <p className="text-sm font-medium text-muted-foreground mb-2">No Summary</p>
                      <p className="text-xs text-muted-foreground">Booking summary will appear here</p>
                    </div>
                  ) : (
                    <>
                      {[...selectedTypes].reverse().map((type) => {
                        if (type === "laboratory" && laboratoryData) {
                          return (
                            <div key="laboratory" className="pt-6 border-t border-border space-y-4">
                              <div className="flex items-start justify-between">
                                <p className="text-sm font-medium text-foreground mb-1">Laboratory</p>
                                <button
                                  onClick={handleRemoveLaboratory}
                                  className="text-xs text-primary"
                                >
                                  <Trash2 className="w-3 h-3" />
                                </button>
                              </div>

                              <div className="space-y-3 text-xs">
                                <div>
                                  <p className="text-muted-foreground">When</p>
                                  <p className="text-foreground font-medium">
                                    {format(laboratoryData.date, "dd/MM/yyyy")} {laboratoryData.time} AM | {laboratoryData.mode === "in-clinic" ? "In-Clinic" : "Home Collection"}
                                  </p>
                                </div>

                                {laboratoryData.selectedTests.length > 0 && (
                                  <div className="space-y-2 pt-2">
                                    {laboratoryData.selectedTests.map((test) => {
                                      const lineItem = pricing.lineItems.find(li => li.id === `lab-test-${test.id}`);
                                      return (
                                        <div key={test.id} className="flex justify-between items-center">
                                          <p className="text-foreground text-xs">{test.name}</p>
                                          {lineItem && (
                                            <LineItemPriceEditor
                                              item={lineItem}
                                              onPriceUpdate={pricing.updateLineItemPrice}
                                              onDiscountApply={pricing.applyLineDiscount}
                                              onWaiveOff={pricing.waiveOffItem}
                                              onOpenModal={() => handleOpenModal(lineItem)}
                                            />
                                          )}
                                        </div>
                                      );
                                    })}
                                  </div>
                                )}

                                {laboratoryData.selectedPackages.length > 0 && (
                                  <div className="space-y-2 pt-2">
                                    {laboratoryData.selectedPackages.map((pkg) => {
                                      const lineItem = pricing.lineItems.find(li => li.id === `lab-pkg-${pkg.id}`);
                                      return (
                                        <div key={pkg.id} className="flex justify-between items-center">
                                          <p className="text-foreground text-xs">{pkg.name}</p>
                                          {lineItem && (
                                            <LineItemPriceEditor
                                              item={lineItem}
                                              onPriceUpdate={pricing.updateLineItemPrice}
                                              onDiscountApply={pricing.applyLineDiscount}
                                              onWaiveOff={pricing.waiveOffItem}
                                              onOpenModal={() => handleOpenModal(lineItem)}
                                            />
                                          )}
                                        </div>
                                      );
                                    })}
                                  </div>
                                )}
                              </div>
                            </div>
                          );
                        }

                        if (type === "consultation" && consultationData) {
                          return (
                            <div key="consultation" className="pt-6 border-t border-border space-y-4">
                              <div className="flex items-start justify-between">
                                <p className="text-sm font-medium text-foreground mb-1">Consultation</p>
                                <button
                                  onClick={handleRemoveConsultation}
                                  className="text-xs text-primary"
                                >
                                  <Trash2 className="w-3 h-3" />
                                </button>
                              </div>

                              <div className="space-y-3 text-xs">
                                <div>
                                  <p className="text-muted-foreground">When</p>
                                  <p className="text-foreground font-medium">
                                    {format(consultationData.date, "dd/MM/yyyy")} {consultationData.time} AM
                                  </p>
                                </div>

                                <div>
                                  <p className="text-muted-foreground">Provider</p>
                                  <p className="text-foreground font-medium">{consultationData.doctor}</p>
                                </div>

                                <div className="flex justify-between items-center pt-3 border-t border-border">
                                  <p className="text-foreground">Consultation</p>
                                  {(() => {
                                    const lineItem = pricing.lineItems.find(li => li.id === 'consultation-1');
                                    return lineItem ? (
                                      <LineItemPriceEditor
                                        item={lineItem}
                                        onPriceUpdate={pricing.updateLineItemPrice}
                                        onDiscountApply={pricing.applyLineDiscount}
                                        onWaiveOff={pricing.waiveOffItem}
                                        onOpenModal={() => handleOpenModal(lineItem)}
                                      />
                                    ) : <p className="text-foreground font-semibold">₹1,000</p>;
                                  })()}
                                </div>
                              </div>
                            </div>
                          );
                        }

                        if (type === "radiology" && radiologyData) {
                          return (
                            <div key="radiology" className="pt-6 border-t border-border space-y-4">
                              <div className="flex items-start justify-between">
                                <p className="text-sm font-medium text-foreground mb-1">Radiology</p>
                                <button
                                  onClick={handleRemoveRadiology}
                                  className="text-xs text-primary"
                                >
                                  <Trash2 className="w-3 h-3" />
                                </button>
                              </div>

                              <div className="space-y-3 text-xs">
                                <div>
                                  <p className="text-muted-foreground">When</p>
                                  <p className="text-foreground font-medium">
                                    {format(radiologyData.date, "dd/MM/yyyy")} {radiologyData.time} AM | {radiologyData.radiologyType}
                                  </p>
                                </div>

                                {radiologyData.selectedTests.length > 0 && (
                                  <div className="space-y-2 pt-2">
                                    {radiologyData.selectedTests.map((test) => {
                                      const lineItem = pricing.lineItems.find(li => li.id === `rad-test-${test.id}`);
                                      return (
                                        <div key={test.id} className="flex justify-between items-center">
                                          <p className="text-foreground text-xs">{test.name}</p>
                                          {lineItem && (
                                            <LineItemPriceEditor
                                              item={lineItem}
                                              onPriceUpdate={pricing.updateLineItemPrice}
                                              onDiscountApply={pricing.applyLineDiscount}
                                              onWaiveOff={pricing.waiveOffItem}
                                              onOpenModal={() => handleOpenModal(lineItem)}
                                            />
                                          )}
                                        </div>
                                      );
                                    })}
                                  </div>
                                )}
                              </div>
                            </div>
                          );
                        }

                        if (type === "ipd" && ipdAdmissionData) {
                          return (
                            <div key="ipd" className="pt-6 border-t border-border space-y-4">
                              <div className="flex items-start justify-between">
                                <p className="text-sm font-medium text-foreground mb-1">IPD Admission</p>
                                <button
                                  onClick={handleRemoveIPDAdmission}
                                  className="text-xs text-primary"
                                >
                                  <Trash2 className="w-3 h-3" />
                                </button>
                              </div>

                              <div className="space-y-3 text-xs">
                                <div>
                                  <p className="text-muted-foreground">When</p>
                                  <p className="text-foreground font-medium">
                                    {format(ipdAdmissionData.date, "dd/MM/yyyy")} {ipdAdmissionData.time} AM
                                  </p>
                                </div>

                                <div>
                                  <p className="text-muted-foreground">Attending Doctor</p>
                                  <p className="text-foreground font-medium">{ipdAdmissionData.attendingDoctor}</p>
                                </div>

                                <div>
                                  <p className="text-muted-foreground">Ward</p>
                                  <p className="text-foreground font-medium">{ipdAdmissionData.ward}</p>
                                </div>

                                <div>
                                  <p className="text-muted-foreground">Bed</p>
                                  <p className="text-foreground font-medium">{ipdAdmissionData.bed}</p>
                                </div>

                                <div className="flex justify-between items-center pt-3 border-t border-border">
                                  <p className="text-foreground">Admission</p>
                                  {(() => {
                                    const lineItem = pricing.lineItems.find(li => li.id === 'ipd-admission-1');
                                    return lineItem ? (
                                      <LineItemPriceEditor
                                        item={lineItem}
                                        onPriceUpdate={pricing.updateLineItemPrice}
                                        onDiscountApply={pricing.applyLineDiscount}
                                        onWaiveOff={pricing.waiveOffItem}
                                        onOpenModal={() => handleOpenModal(lineItem)}
                                      />
                                    ) : <p className="text-foreground font-semibold">₹5,000</p>;
                                  })()}
                                </div>
                              </div>
                            </div>
                          );
                        }

                        if (type === "dc" && dcProcedureData) {
                          return (
                            <div key="dc" className="pt-6 border-t border-border space-y-4">
                              <div className="flex items-start justify-between">
                                <p className="text-sm font-medium text-foreground mb-1">Day-Care Procedure</p>
                                <button
                                  onClick={handleRemoveDCProcedure}
                                  className="text-xs text-primary"
                                >
                                  <Trash2 className="w-3 h-3" />
                                </button>
                              </div>

                              <div className="space-y-3 text-xs">
                                <div>
                                  <p className="text-muted-foreground">When</p>
                                  <p className="text-foreground font-medium">
                                    {format(dcProcedureData.date, "dd/MM/yyyy")} {dcProcedureData.time} AM
                                  </p>
                                </div>

                                <div>
                                  <p className="text-muted-foreground">Attending Doctor</p>
                                  <p className="text-foreground font-medium">{dcProcedureData.attendingDoctor}</p>
                                </div>

                                <div>
                                  <p className="text-muted-foreground">Procedure</p>
                                  <p className="text-foreground font-medium">{dcProcedureData.procedure}</p>
                                </div>

                                <div>
                                  <p className="text-muted-foreground">OT/Procedure Room</p>
                                  <p className="text-foreground font-medium">{dcProcedureData.otRoom}</p>
                                </div>

                                <div className="flex justify-between items-center pt-3 border-t border-border">
                                  <p className="text-foreground">Procedure</p>
                                  {(() => {
                                    const lineItem = pricing.lineItems.find(li => li.id === 'dc-procedure-1');
                                    return lineItem ? (
                                      <LineItemPriceEditor
                                        item={lineItem}
                                        onPriceUpdate={pricing.updateLineItemPrice}
                                        onDiscountApply={pricing.applyLineDiscount}
                                        onWaiveOff={pricing.waiveOffItem}
                                        onOpenModal={() => handleOpenModal(lineItem)}
                                      />
                                    ) : <p className="text-foreground font-semibold">₹15,000</p>;
                                  })()}
                                </div>
                              </div>
                            </div>
                          );
                        }

                        return null;
                      })}

                      {/* Global Discount Controls */}
                      <div className="pt-4 border-t border-border">
                        <GlobalDiscountControls
                          discountType={pricing.globalDiscountType}
                          discountValue={pricing.globalDiscountValue}
                          applyPretax={pricing.applyGlobalDiscountPretax}
                          couponCode={pricing.couponCode}
                          onDiscountTypeChange={pricing.setGlobalDiscountType}
                          onDiscountValueChange={pricing.setGlobalDiscountValue}
                          onApplyPretaxChange={pricing.setApplyGlobalDiscountPretax}
                          onCouponCodeChange={pricing.setCouponCode}
                          onApplyCoupon={handleApplyCoupon}
                          maxValue={pricing.totals.subtotal}
                        />
                      </div>

                      {/* Total Summary with Global Discount */}
                      <div className="pt-4 border-t border-border space-y-2 text-xs">
                        <div className="flex justify-between">
                          <p className="text-muted-foreground">Subtotal</p>
                          <p className="text-foreground">{formatCurrency(pricing.totals.subtotal)}</p>
                        </div>
                        
                        {/* Global Discount if applied */}
                        {pricing.globalDiscountValue > 0 && (
                          <div className="flex justify-between text-green-600">
                            <p>Global Discount ({formatCurrency(pricing.globalDiscountValue)})</p>
                            <p>-{formatCurrency(pricing.globalDiscountValue)}</p>
                          </div>
                        )}
                        
                        <div className="flex justify-between">
                          <p className="text-muted-foreground">Taxable Amount</p>
                          <p className="text-foreground">{formatCurrency(pricing.totals.taxable)}</p>
                        </div>
                        <div className="flex justify-between">
                          <p className="text-muted-foreground">CGST (9%)</p>
                          <p className="text-foreground">{formatCurrency(pricing.totals.cgst)}</p>
                        </div>
                        <div className="flex justify-between">
                          <p className="text-muted-foreground">SGST (9%)</p>
                          <p className="text-foreground">{formatCurrency(pricing.totals.sgst)}</p>
                        </div>
                        {Math.abs(pricing.totals.roundOff) > 0.01 && (
                          <div className="flex justify-between">
                            <p className="text-muted-foreground">Round-off</p>
                            <p className="text-foreground">{pricing.totals.roundOff >= 0 ? '+' : ''}{formatCurrency(pricing.totals.roundOff)}</p>
                          </div>
                        )}
                        <div className="flex justify-between pt-3 border-t border-border">
                          <p className="text-foreground font-semibold">Net Payable</p>
                          <p className="text-foreground font-bold">{formatCurrency(pricing.totals.netPayable)}</p>
                        </div>
                      </div>
                    </>
                  )}
                </div>
              </Card>
            </div>
          </div>
          
          {/* Sticky Footer Bar */}
          <StickyFooterBar
            totals={pricing.totals}
            itemCount={pricing.lineItems.length}
            onGenerateInvoice={() => {
              const { subtotal, cgst, sgst, netPayable } = pricing.totals;
              const items = pricing.lineItems.map(item => {
                let price = item.overridePrice ?? item.basePrice;
                
                // Apply line discount if present
                if (item.lineDiscountAmount) {
                  price = price - item.lineDiscountAmount;
                } else if (item.lineDiscountPercent) {
                  price = price - (price * item.lineDiscountPercent / 100);
                }
                
                return {
                  name: item.name,
                  price: price,
                };
              });
              
              navigate("/payment", {
                state: {
                  appointmentType: selectedTypes.join(", "),
                  items,
                  subtotal,
                  cgst,
                  sgst,
                  total: netPayable,
                  date: format(new Date(), "dd/MM/yyyy"),
                  fromPatientInsights,
                  patientId
                }
              });
            }}
          />
          
          {/* Adjust Price Modal */}
          {selectedItemForModal && (
            <AdjustPriceModal
              open={modalOpen}
              onClose={() => setModalOpen(false)}
              item={selectedItemForModal}
              onApply={handleApplyModalChanges}
              policy={{
                floorPrice: selectedItemForModal.floorPrice,
                discountThresholdPercent: pricing.policy.discountThresholdPercent,
              }}
            />
          )}
        </main>
      </div>
    </div>
  );
};

export default BookAppointment;
