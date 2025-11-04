import { useState, useEffect } from "react";
import { useNavigate, useLocation, useSearchParams } from "react-router-dom";
import { ChevronLeft, Calendar, FlaskConical, Bed, Trash2 } from "lucide-react";
import { AppSidebar } from "@/components/AppSidebar";
import { AppHeader } from "@/components/AppHeader";
import { BookingSteps } from "@/components/BookingSteps";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { ConsultationBookingForm, ConsultationData } from "@/components/ConsultationBookingForm";
import { LaboratoryBookingForm, LaboratoryData } from "@/components/LaboratoryBookingForm";
import { IPDAdmissionBookingForm, IPDAdmissionData } from "@/components/IPDAdmissionBookingForm";
import { LineItemPriceEditor } from "@/components/pricing/LineItemPriceEditor";
import { AdjustPriceModal } from "@/components/pricing/AdjustPriceModal";
import { GlobalDiscountControls } from "@/components/pricing/GlobalDiscountControls";
import { StickyFooterBar } from "@/components/pricing/StickyFooterBar";
import { BookingStickyFooter } from "@/components/booking/BookingStickyFooter";
import { ConfirmationModal } from "@/components/booking/ConfirmationModal";
import { usePricingState } from "@/hooks/usePricingState";
import { LineItem } from "@/types/pricing";
import { formatCurrency } from "@/lib/pricingEngine";
import { format } from "date-fns";
import { toast } from "@/hooks/use-toast";
import { CartItem, Totals } from "@/types/booking/ipAdmission";
import { calcLineTotal } from "@/utils/billing/totals";

const appointmentTypes = [
  { icon: Calendar, label: "OP Consultation", value: "consultation" },
  { icon: Bed, label: "IP Admission", value: "ipd" },
  { icon: FlaskConical, label: "Diagnostics", value: "laboratory" },
];

const BookAppointment = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [searchParams] = useSearchParams();
  
  // Check if this is single-appointment mode from Inbox
  const appointmentId = searchParams.get("id");
  const appointmentType = searchParams.get("type");
  const isSingleAppointmentMode = !!appointmentId && !!appointmentType;
  
  const fromPatientInsights = location.state?.fromPatientInsights;
  const patientId = location.state?.patientId;
  const visitId = location.state?.visitId; // Visit ID for new appointments
  const [selectedTypes, setSelectedTypes] = useState<string[]>([]);
  const [consultationData, setConsultationData] = useState<ConsultationData | null>(null);
  const [laboratoryData, setLaboratoryData] = useState<LaboratoryData | null>(null);
  const [ipdAdmissionData, setIpdAdmissionData] = useState<IPDAdmissionData | null>(null);
  
  // Confirmation modal state
  const [confirmationModalOpen, setConfirmationModalOpen] = useState(false);
  
  // Pricing state management
  const pricing = usePricingState();
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedItemForModal, setSelectedItemForModal] = useState<LineItem | null>(null);
  
  // Services cart state (for IPD)
  const [servicesCart, setServicesCart] = useState<CartItem[]>([]);
  const [servicesTotals, setServicesTotals] = useState<Totals>({
    subtotal: 0,
    discountTotal: 0,
    taxTotal: 0,
    netPayable: 0,
  });

  // Initialize with appointment type if in single-appointment mode
  useEffect(() => {
    if (isSingleAppointmentMode && appointmentType) {
      const validType = appointmentType === "consultation" ? "consultation" : "laboratory";
      setSelectedTypes([validType]);
      
      // Initialize the data based on type
      if (validType === "consultation") {
        setConsultationData({
          mode: "in-person",
          type: "",
          department: "",
          doctor: "",
          clinicalInfo: "",
          date: new Date(),
          time: "",
        });
      } else if (validType === "laboratory") {
        setLaboratoryData({
          mode: "laboratory",
          selectedTests: [],
          selectedPackages: [],
          selectedRadiologyTests: [],
          laboratoryDate: new Date(),
          laboratoryTime: "",
          radiologyDate: new Date(),
          radiologyTime: "",
        });
      }
    }
  }, [isSingleAppointmentMode, appointmentType]);

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
      });
    }

    if (laboratoryData) {
      if (laboratoryData.mode === "laboratory") {
        laboratoryData.selectedTests.forEach((test) => {
          items.push({
            id: `lab-test-${test.id}`,
            name: test.name,
            category: 'Laboratory',
            basePrice: test.price,
            isDiscountable: true,
            floorPrice: test.price * 0.5,
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
          });
        });
      } else if (laboratoryData.mode === "radiology" && laboratoryData.selectedRadiologyTests) {
        laboratoryData.selectedRadiologyTests.forEach((test) => {
          items.push({
            id: `rad-test-${test.id}`,
            name: test.name,
            category: 'Radiology',
            basePrice: test.price,
            isDiscountable: true,
            floorPrice: test.price * 0.5,
          });
        });
      }
    }

    if (ipdAdmissionData) {
      items.push({
        id: 'ipd-admission-1',
        name: 'IPD Admission',
        category: 'IPD',
        basePrice: 5000,
        isDiscountable: false, // Example: non-discountable
        floorPrice: 5000,
      });
    }

    // Add services from cart
    servicesCart.forEach((service) => {
      items.push({
        id: `service-${service.itemId}`,
        name: service.name,
        category: service.category,
        basePrice: service.unitPrice * service.qty,
        isDiscountable: true,
        floorPrice: service.unitPrice * service.qty * 0.5,
      });
    });

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
  }, [consultationData, laboratoryData, ipdAdmissionData, servicesCart]);

  const handleTypeClick = (type: string) => {
    // Toggle the type - add if not present, remove if already selected
    if (selectedTypes.includes(type)) {
      // Deselect: call the appropriate remove handler
      if (type === "consultation") handleRemoveConsultation();
      else if (type === "laboratory") handleRemoveLaboratory();
      else if (type === "ipd") handleRemoveIPDAdmission();
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
        mode: "laboratory",
        selectedTests: [
          { id: "1", name: "Complete Blood Count (CBC)", category: "Hematology", price: 200 },
          { id: "2", name: "Liver Function Test (LFT)", category: "Biochemistry", price: 400 },
        ],
        selectedPackages: [],
        selectedRadiologyTests: [],
        laboratoryDate: new Date(2025, 7, 5),
        laboratoryTime: "07:30",
        radiologyDate: new Date(2025, 7, 5),
        radiologyTime: "07:30",
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
        emergencyContactName: "",
        relationship: "",
        contactNumber: "",
        address: "",
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

  const handleRemoveIPDAdmission = () => {
    setSelectedTypes(prev => prev.filter(t => t !== "ipd"));
    setIpdAdmissionData(null);
  };

  const handleConsultationUpdate = (data: ConsultationData) => {
    setConsultationData(data);
  };

  const handleLaboratoryUpdate = (data: LaboratoryData) => {
    setLaboratoryData(data);
  };

  const handleIPDAdmissionUpdate = (data: IPDAdmissionData) => {
    setIpdAdmissionData(data);
  };
  
  const handleServicesChange = (cart: CartItem[], totals: Totals) => {
    setServicesCart(cart);
    setServicesTotals(totals);
  };
  
  const handleRemoveLabTest = (testId: string) => {
    if (!laboratoryData) return;
    setLaboratoryData({
      ...laboratoryData,
      selectedTests: laboratoryData.selectedTests.filter(t => t.id !== testId),
    });
  };
  
  const handleRemoveLabPackage = (pkgId: string) => {
    if (!laboratoryData) return;
    setLaboratoryData({
      ...laboratoryData,
      selectedPackages: laboratoryData.selectedPackages.filter(p => p.id !== pkgId),
    });
  };
  
  const handleRemoveRadiologyTest = (testId: string) => {
    if (!laboratoryData) return;
    setLaboratoryData({
      ...laboratoryData,
      selectedRadiologyTests: laboratoryData.selectedRadiologyTests?.filter(t => t.id !== testId) || [],
    });
  };
  
  const handleRemoveService = (itemId: string) => {
    setServicesCart(prev => prev.filter(item => item.itemId !== itemId));
  };
  
  const handleClearServices = () => {
    setServicesCart([]);
    setServicesTotals({ subtotal: 0, discountTotal: 0, taxTotal: 0, netPayable: 0 });
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

  // Single-appointment mode handlers
  const handleAskConfirmation = () => {
    setConfirmationModalOpen(true);
  };

  const handleSendConfirmation = () => {
    setConfirmationModalOpen(false);
    toast({
      title: "Confirmation request sent",
      description: "The patient will receive a confirmation request shortly.",
    });
  };

  const handleSchedule = () => {
    // Validate required fields
    const isValid = validateAppointmentData();
    
    if (!isValid) {
      toast({
        title: "Missing information",
        description: "Please fill in all required fields before scheduling.",
        variant: "destructive",
      });
      return;
    }

    toast({
      title: "Appointment scheduled",
      description: "The appointment has been scheduled successfully.",
    });
    
    // Navigate to appointment details or back to inbox
    setTimeout(() => {
      navigate(isSingleAppointmentMode ? "/inbox" : "/");
    }, 1000);
  };

  const validateAppointmentData = () => {
    if (selectedTypes.includes("consultation") && consultationData) {
      return !!(
        consultationData.department &&
        consultationData.doctor &&
        consultationData.date &&
        consultationData.time
      );
    }
    
    if (selectedTypes.includes("laboratory") && laboratoryData) {
      const hasLab = laboratoryData.selectedTests.length > 0 || laboratoryData.selectedPackages.length > 0;
      const hasRadiology = laboratoryData.selectedRadiologyTests && laboratoryData.selectedRadiologyTests.length > 0;
      
      if (hasLab && (!laboratoryData.laboratoryDate || !laboratoryData.laboratoryTime)) return false;
      if (hasRadiology && (!laboratoryData.radiologyDate || !laboratoryData.radiologyTime)) return false;
      
      return hasLab || hasRadiology;
    }
    
    return false;
  };

  const getAppointmentDetails = () => {
    const details: any = {
      patientName: "Patient Name", // This should come from the appointment data
      appointmentType: selectedTypes[0] === "consultation" ? "Consultation" : "Laboratory",
    };

    if (consultationData) {
      details.provider = consultationData.doctor;
      details.mode = consultationData.mode === "in-person" ? "In-person" : "Virtual";
      details.location = consultationData.mode === "in-person" ? "Main Clinic" : undefined;
      details.date = consultationData.date ? format(consultationData.date, "PPP") : undefined;
      details.time = consultationData.time;
    }

    if (laboratoryData) {
      const hasLab = laboratoryData.selectedTests.length > 0 || laboratoryData.selectedPackages.length > 0;
      const hasRadiology = laboratoryData.selectedRadiologyTests && laboratoryData.selectedRadiologyTests.length > 0;
      
      details.mode = hasLab ? "Laboratory" : "Radiology";
      details.tests = [
        ...laboratoryData.selectedTests.map(t => t.name),
        ...laboratoryData.selectedPackages.map(p => p.name),
        ...(laboratoryData.selectedRadiologyTests || []).map(t => t.name),
      ];
      details.date = hasLab ? 
        (laboratoryData.laboratoryDate ? format(laboratoryData.laboratoryDate, "PPP") : undefined) :
        (laboratoryData.radiologyDate ? format(laboratoryData.radiologyDate, "PPP") : undefined);
      details.time = hasLab ? laboratoryData.laboratoryTime : laboratoryData.radiologyTime;
      details.prepNotes = "Fasting may be required for certain tests. Please review instructions.";
    }

    return details;
  };

  return (
    <div className="flex min-h-screen bg-background">
      <AppSidebar />
      
      <div className="flex-1 ml-[196px]">
        <AppHeader breadcrumbs={["Appointments", "Appointment"]} />
        
        <main className="p-6 pb-32">
          <button
            onClick={() => navigate(isSingleAppointmentMode ? "/inbox" : (fromPatientInsights ? `/patient-insights/${patientId}` : "/registration"))}
            className="flex items-center gap-2 text-sm text-foreground hover:text-primary transition-colors mb-6"
          >
            <ChevronLeft className="w-4 h-4" />
            <span className="font-semibold">
              {isSingleAppointmentMode ? "Inbox" : (fromPatientInsights ? "Patient Insights" : "Registration")}
            </span>
          </button>

          {!isSingleAppointmentMode && (
            <BookingSteps currentStep="appointment" hideSteps={fromPatientInsights ? ["search", "registration"] : []} />
          )}

          <div className="max-w-[1600px] mx-auto">
            {isSingleAppointmentMode ? (
              <h2 className="text-lg font-semibold text-primary mb-4">Schedule Appointment</h2>
            ) : (
              <h2 className="text-lg font-semibold text-primary mb-4">Book Appointments</h2>
            )}
            
            {/* Appointment Type Buttons - Hide in single-appointment mode */}
            {!isSingleAppointmentMode && (
              <div className="mb-8">
                <div className="flex gap-3">{appointmentTypes.map((type) => {
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
                })}</div>
              </div>
            )}

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
                              onRemove={isSingleAppointmentMode ? undefined : handleRemoveLaboratory}
                              onUpdate={handleLaboratoryUpdate}
                              initialData={laboratoryData}
                            />
                          );
                        }
                        if (type === "consultation" && consultationData) {
                          return (
                            <ConsultationBookingForm
                              key="consultation"
                              onRemove={isSingleAppointmentMode ? undefined : handleRemoveConsultation}
                              onUpdate={handleConsultationUpdate}
                            />
                          );
                        }
                      if (type === "ipd" && ipdAdmissionData) {
                        return (
                          <IPDAdmissionBookingForm
                            key="ipd"
                            onRemove={handleRemoveIPDAdmission}
                            onUpdate={handleIPDAdmissionUpdate}
                            onServicesChange={handleServicesChange}
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
                <h3 className="text-sm font-semibold text-foreground mb-4">Appointment Summary</h3>
                
                <div className="space-y-4">
                  <div>
                    <p className="text-xs text-muted-foreground mb-1.5">Patient</p>
                    <p className="text-sm font-medium text-foreground">Siva Karthikeyan</p>
                    <p className="text-xs text-muted-foreground mt-0.5">GDID - 009 • 35 | M</p>
                  </div>

                  {visitId && (
                    <div>
                      <p className="text-xs text-muted-foreground mb-1.5">Visit ID</p>
                      <p className="text-sm font-medium text-foreground">{visitId}</p>
                    </div>
                  )}

                  {selectedTypes.length === 0 ? (
                    <div className="pt-4 border-t border-border">
                      <p className="text-sm font-medium text-muted-foreground mb-1">No Summary</p>
                      <p className="text-xs text-muted-foreground">Booking summary will appear here</p>
                    </div>
                  ) : (
                    <>
                      {[...selectedTypes].reverse().map((type) => {
                        if (type === "laboratory" && laboratoryData) {
                          const hasLabTests = laboratoryData.selectedTests.length > 0 || laboratoryData.selectedPackages.length > 0;
                          const hasRadiologyTests = laboratoryData.selectedRadiologyTests && laboratoryData.selectedRadiologyTests.length > 0;
                          
                          return (
                            <div key="laboratory-radiology" className="space-y-4">
                              {/* Laboratory Section */}
                              {hasLabTests && (
                                <div className="pt-4 border-t border-border">
                                  <div className="flex items-start justify-between mb-3">
                                    <p className="text-sm font-medium text-foreground">Laboratory</p>
                                    <button
                                      onClick={handleRemoveLaboratory}
                                      className="text-xs text-primary hover:text-primary/80"
                                    >
                                      <Trash2 className="w-3 h-3" />
                                    </button>
                                  </div>

                                  <div className="space-y-2.5 text-xs">
                                    <div>
                                      <p className="text-muted-foreground mb-1">When</p>
                                      <p className="text-foreground font-medium">
                                        {format(laboratoryData.laboratoryDate, "dd/MM/yyyy")} {laboratoryData.laboratoryTime} AM | Laboratory
                                      </p>
                                    </div>

                                    {laboratoryData.selectedTests.length > 0 && (
                                      <div className="space-y-2 pt-1.5">
                                        {laboratoryData.selectedTests.map((test) => {
                                          const lineItem = pricing.lineItems.find(li => li.id === `lab-test-${test.id}`);
                                          return (
                                            <div key={test.id} className="flex justify-between items-center gap-2 group min-h-[24px]">
                                              <div className="flex items-center gap-1.5 flex-1 min-w-0">
                                                <p className="text-foreground text-xs truncate">{test.name}</p>
                                                <button
                                                  onClick={(e) => {
                                                    e.stopPropagation();
                                                    handleRemoveLabTest(test.id);
                                                  }}
                                                  className="opacity-0 group-hover:opacity-100 text-muted-foreground hover:text-destructive transition-opacity shrink-0"
                                                >
                                                  <Trash2 className="w-3 h-3" />
                                                </button>
                                              </div>
                                              {lineItem && (
                                                <div className="shrink-0">
                                                  <LineItemPriceEditor
                                                    item={lineItem}
                                                    onPriceUpdate={pricing.updateLineItemPrice}
                                                    onDiscountApply={pricing.applyLineDiscount}
                                                    onWaiveOff={pricing.waiveOffItem}
                                                    onOpenModal={() => handleOpenModal(lineItem)}
                                                  />
                                                </div>
                                              )}
                                            </div>
                                          );
                                        })}
                                      </div>
                                    )}

                                    {laboratoryData.selectedPackages.length > 0 && (
                                      <div className="space-y-2 pt-1.5">
                                        {laboratoryData.selectedPackages.map((pkg) => {
                                          const lineItem = pricing.lineItems.find(li => li.id === `lab-pkg-${pkg.id}`);
                                          return (
                                            <div key={pkg.id} className="flex justify-between items-center gap-2 group min-h-[24px]">
                                              <div className="flex items-center gap-1.5 flex-1 min-w-0">
                                                <p className="text-foreground text-xs truncate">{pkg.name}</p>
                                                <button
                                                  onClick={(e) => {
                                                    e.stopPropagation();
                                                    handleRemoveLabPackage(pkg.id);
                                                  }}
                                                  className="opacity-0 group-hover:opacity-100 text-muted-foreground hover:text-destructive transition-opacity shrink-0"
                                                >
                                                  <Trash2 className="w-3 h-3" />
                                                </button>
                                              </div>
                                              {lineItem && (
                                                <div className="shrink-0">
                                                  <LineItemPriceEditor
                                                    item={lineItem}
                                                    onPriceUpdate={pricing.updateLineItemPrice}
                                                    onDiscountApply={pricing.applyLineDiscount}
                                                    onWaiveOff={pricing.waiveOffItem}
                                                    onOpenModal={() => handleOpenModal(lineItem)}
                                                  />
                                                </div>
                                              )}
                                            </div>
                                          );
                                        })}
                                      </div>
                                    )}
                                  </div>
                                </div>
                              )}

                              {/* Radiology Section */}
                              {hasRadiologyTests && (
                                <div className="pt-4 border-t border-border">
                                  <div className="flex items-start justify-between mb-3">
                                    <p className="text-sm font-medium text-foreground">Radiology</p>
                                    <button
                                      onClick={handleRemoveLaboratory}
                                      className="text-xs text-primary hover:text-primary/80"
                                    >
                                      <Trash2 className="w-3 h-3" />
                                    </button>
                                  </div>

                                  <div className="space-y-2.5 text-xs">
                                    <div>
                                      <p className="text-muted-foreground mb-1">When</p>
                                      <p className="text-foreground font-medium">
                                        {format(laboratoryData.radiologyDate, "dd/MM/yyyy")} {laboratoryData.radiologyTime} AM | Radiology
                                      </p>
                                    </div>

                                    <div className="space-y-2 pt-1.5">
                                      {laboratoryData.selectedRadiologyTests.map((test) => {
                                        const lineItem = pricing.lineItems.find(li => li.id === `rad-test-${test.id}`);
                                        return (
                                          <div key={test.id} className="flex justify-between items-center gap-2 group min-h-[24px]">
                                            <div className="flex items-center gap-1.5 flex-1 min-w-0">
                                              <p className="text-foreground text-xs truncate">{test.name}</p>
                                              <button
                                                onClick={(e) => {
                                                  e.stopPropagation();
                                                  handleRemoveRadiologyTest(test.id);
                                                }}
                                                className="opacity-0 group-hover:opacity-100 text-muted-foreground hover:text-destructive transition-opacity shrink-0"
                                              >
                                                <Trash2 className="w-3 h-3" />
                                              </button>
                                            </div>
                                            {lineItem && (
                                              <div className="shrink-0">
                                                <LineItemPriceEditor
                                                  item={lineItem}
                                                  onPriceUpdate={pricing.updateLineItemPrice}
                                                  onDiscountApply={pricing.applyLineDiscount}
                                                  onWaiveOff={pricing.waiveOffItem}
                                                  onOpenModal={() => handleOpenModal(lineItem)}
                                                />
                                              </div>
                                            )}
                                          </div>
                                        );
                                      })}
                                    </div>
                                  </div>
                                </div>
                              )}
                            </div>
                          );
                        }

                        if (type === "consultation" && consultationData) {
                          return (
                            <div key="consultation" className="pt-4 border-t border-border">
                              <div className="flex items-start justify-between mb-3">
                                <p className="text-sm font-medium text-foreground">Consultation</p>
                                <button
                                  onClick={handleRemoveConsultation}
                                  className="text-xs text-primary"
                                >
                                  <Trash2 className="w-3 h-3" />
                                </button>
                              </div>

                              <div className="space-y-2.5 text-xs">
                                <div>
                                  <p className="text-muted-foreground mb-1">When</p>
                                  <p className="text-foreground font-medium">
                                    {format(consultationData.date, "dd/MM/yyyy")} {consultationData.time} AM
                                  </p>
                                </div>

                                <div>
                                  <p className="text-muted-foreground mb-1">Provider</p>
                                  <p className="text-foreground font-medium">{consultationData.doctor}</p>
                                </div>

                                <div className="flex justify-between items-center pt-2 border-t border-border">
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

                        if (type === "ipd" && ipdAdmissionData) {
                          return (
                            <div key="ipd" className="pt-4 border-t border-border">
                              <div className="flex items-start justify-between mb-3">
                                <p className="text-sm font-medium text-foreground">IPD Admission</p>
                                <button
                                  onClick={handleRemoveIPDAdmission}
                                  className="text-xs text-primary"
                                >
                                  <Trash2 className="w-3 h-3" />
                                </button>
                              </div>

                              <div className="space-y-2.5 text-xs">
                                <div>
                                  <p className="text-muted-foreground mb-1">When</p>
                                  <p className="text-foreground font-medium">
                                    {format(ipdAdmissionData.date, "dd/MM/yyyy")} {ipdAdmissionData.time} AM
                                  </p>
                                </div>

                                <div>
                                  <p className="text-muted-foreground mb-1">Attending Doctor</p>
                                  <p className="text-foreground font-medium">{ipdAdmissionData.attendingDoctor}</p>
                                </div>

                                <div>
                                  <p className="text-muted-foreground mb-1">Ward</p>
                                  <p className="text-foreground font-medium">{ipdAdmissionData.ward}</p>
                                </div>

                                <div>
                                  <p className="text-muted-foreground mb-1">Bed</p>
                                  <p className="text-foreground font-medium">{ipdAdmissionData.bed}</p>
                                </div>

                                <div className="flex justify-between items-center pt-2 border-t border-border">
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
                              
                              {/* Services & Procedures Section */}
                              {servicesCart.length > 0 && (
                                <div className="pt-3 mt-3 border-t border-border">
                                  <div className="flex items-start justify-between mb-2.5">
                                    <p className="text-sm font-medium text-foreground">Services & Procedures</p>
                                    <button
                                      onClick={handleClearServices}
                                      className="text-xs text-primary hover:text-primary/80"
                                    >
                                      <Trash2 className="w-3 h-3" />
                                    </button>
                                  </div>
                                  <div className="space-y-2">
                                    {servicesCart.map((item) => {
                                      const lineItem = pricing.lineItems.find(li => li.id === `service-${item.itemId}`);
                                      return (
                                        <div key={item.itemId} className="flex justify-between items-center gap-2 group min-h-[24px]">
                                          <div className="flex items-center gap-1.5 flex-1 min-w-0">
                                            <p className="text-foreground text-xs truncate">{item.name}</p>
                                            <button
                                              onClick={(e) => {
                                                e.stopPropagation();
                                                handleRemoveService(item.itemId);
                                              }}
                                              className="opacity-0 group-hover:opacity-100 text-muted-foreground hover:text-destructive transition-opacity shrink-0"
                                            >
                                              <Trash2 className="w-3 h-3" />
                                            </button>
                                          </div>
                                          {lineItem && (
                                            <div className="shrink-0">
                                              <LineItemPriceEditor
                                                item={lineItem}
                                                onPriceUpdate={pricing.updateLineItemPrice}
                                                onDiscountApply={pricing.applyLineDiscount}
                                                onWaiveOff={pricing.waiveOffItem}
                                                onOpenModal={() => handleOpenModal(lineItem)}
                                              />
                                            </div>
                                          )}
                                        </div>
                                      );
                                    })}
                                  </div>
                                </div>
                              )}
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
                          couponCode={pricing.couponCode}
                          onDiscountTypeChange={pricing.setGlobalDiscountType}
                          onDiscountValueChange={pricing.setGlobalDiscountValue}
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
                        
                        {/* Services Subtotal if present */}
                        {servicesCart.length > 0 && (
                          <>
                            <div className="flex justify-between">
                              <p className="text-muted-foreground">Services Subtotal</p>
                              <p className="text-foreground">₹{servicesTotals.subtotal.toLocaleString('en-IN')}</p>
                            </div>
                            {servicesTotals.taxTotal > 0 && (
                              <div className="flex justify-between">
                                <p className="text-muted-foreground">Services Tax</p>
                                <p className="text-foreground">₹{servicesTotals.taxTotal.toLocaleString('en-IN')}</p>
                              </div>
                            )}
                          </>
                        )}
                        
                        {/* Global Discount if applied */}
                        {pricing.globalDiscountValue > 0 && (
                          <div className="flex justify-between text-green-600">
                            <p>Global Discount ({formatCurrency(pricing.globalDiscountValue)})</p>
                            <p>-{formatCurrency(pricing.globalDiscountValue)}</p>
                          </div>
                        )}
                        {Math.abs(pricing.totals.roundOff) > 0.01 && (
                          <div className="flex justify-between">
                            <p className="text-muted-foreground">Round-off</p>
                            <p className="text-foreground">{pricing.totals.roundOff >= 0 ? '+' : ''}{formatCurrency(pricing.totals.roundOff)}</p>
                          </div>
                        )}
                        <div className="flex justify-between pt-3 border-t border-border">
                          <p className="text-foreground font-semibold">Net Payable</p>
                          <p className="text-foreground font-bold">{formatCurrency(pricing.totals.netPayable + servicesTotals.netPayable)}</p>
                        </div>
                      </div>
                    </>
                  )}
                </div>
              </Card>
            </div>
          </div>
          
          {/* Footer - Different for single vs multi-appointment mode */}
          {isSingleAppointmentMode ? (
            <BookingStickyFooter
              totals={{
                ...pricing.totals,
                netPayable: pricing.totals.netPayable + servicesTotals.netPayable,
              }}
              itemCount={pricing.lineItems.length + servicesCart.length}
              onAskConfirmation={handleAskConfirmation}
              onSchedule={handleSchedule}
              isScheduleDisabled={!validateAppointmentData()}
            />
          ) : (
            <StickyFooterBar
              totals={{
                ...pricing.totals,
                netPayable: pricing.totals.netPayable + servicesTotals.netPayable,
              }}
              itemCount={pricing.lineItems.length + servicesCart.length}
              onGenerateInvoice={() => {
                const { subtotal, netPayable } = pricing.totals;
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
                
                // Add services to items
                const servicesItems = servicesCart.map(item => ({
                  name: item.name,
                  price: calcLineTotal(item),
                }));
                
                navigate("/payment", {
                  state: {
                    appointmentType: selectedTypes.join(", "),
                    items: [...items, ...servicesItems],
                    subtotal: subtotal + servicesTotals.subtotal,
                    total: netPayable + servicesTotals.netPayable,
                    date: format(new Date(), "dd/MM/yyyy"),
                    fromPatientInsights,
                    patientId
                  }
                });
              }}
            />
          )}
          
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
          
          {/* Confirmation Modal */}
          <ConfirmationModal
            open={confirmationModalOpen}
            onOpenChange={setConfirmationModalOpen}
            onConfirm={handleSendConfirmation}
            appointmentDetails={getAppointmentDetails()}
          />
        </main>
      </div>
    </div>
  );
};

export default BookAppointment;
