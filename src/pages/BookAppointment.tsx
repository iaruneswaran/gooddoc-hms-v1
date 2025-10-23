import { useState } from "react";
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
import { format } from "date-fns";

const appointmentTypes = [
  { icon: Calendar, label: "Consultation", value: "consultation" },
  { icon: FlaskConical, label: "Laboratory", value: "laboratory" },
  { icon: Scan, label: "Radiology", value: "radiology" },
  { icon: Bed, label: "IPD Admission", value: "ipd" },
  { icon: Syringe, label: "DC Procedure", value: "dc" },
];

const BookAppointment = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const fromPatientInsights = location.state?.fromPatientInsights;
  const patientId = location.state?.patientId;
  const [selectedTypes, setSelectedTypes] = useState<string[]>([]);
  const [consultationData, setConsultationData] = useState<ConsultationData | null>(null);
  const [laboratoryData, setLaboratoryData] = useState<LaboratoryData | null>(null);
  const [radiologyData, setRadiologyData] = useState<RadiologyData | null>(null);
  const [ipdAdmissionData, setIpdAdmissionData] = useState<IPDAdmissionData | null>(null);
  const [dcProcedureData, setDcProcedureData] = useState<DCProcedureData | null>(null);

  const handleTypeClick = (type: string) => {
    // Toggle the type - add if not present, keep others
    if (selectedTypes.includes(type)) {
      return; // Already selected, do nothing
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

  const calculateTotal = () => {
    let subtotal = 0;
    
    if (consultationData) {
      subtotal += 900;
    }
    
    if (laboratoryData) {
      const testsTotal = laboratoryData.selectedTests.reduce((sum, test) => sum + test.price, 0);
      const packagesTotal = laboratoryData.selectedPackages.reduce((sum, pkg) => sum + pkg.price, 0);
      subtotal += testsTotal + packagesTotal;
    }
    
    if (radiologyData) {
      const testsTotal = radiologyData.selectedTests.reduce((sum, test) => sum + test.price, 0);
      subtotal += testsTotal;
    }
    
    if (ipdAdmissionData) {
      subtotal += 4500;
    }
    
    if (dcProcedureData) {
      subtotal += 13500;
    }
    
    const cgst = Math.round(subtotal * 0.09);
    const sgst = Math.round(subtotal * 0.09);
    return { subtotal, cgst, sgst, total: subtotal + cgst + sgst };
  };

  return (
    <div className="flex min-h-screen bg-background">
      <AppSidebar />
      
      <div className="flex-1 ml-[196px]">
        <AppHeader breadcrumbs={["GoodDoc", "Appointments", "Appointment"]} />
        
        <main className="p-8">
          <button
            onClick={() => navigate(fromPatientInsights ? `/patient-insights/${patientId}` : "/registration")}
            className="flex items-center gap-2 text-sm text-foreground hover:text-primary transition-colors mb-6"
          >
            <ChevronLeft className="w-4 h-4" />
            <span className="font-semibold">{fromPatientInsights ? "Patient Insights" : "Registration"}</span>
          </button>

          <BookingSteps currentStep="appointment" hideSteps={fromPatientInsights ? ["search", "registration"] : []} />

          <div className="max-w-[1600px] mx-auto">
            <h2 className="text-lg font-semibold text-primary mb-6">Book Appointments</h2>
            
            {/* Appointment Type Buttons */}
            <div className="space-y-4 mb-8">
              <h3 className="text-sm font-medium text-foreground">Appointment Type</h3>
              <div className="flex gap-3">
                {appointmentTypes.map((type) => {
                  const Icon = type.icon;
                  const isSelected = selectedTypes.includes(type.value);
                  return (
                    <Button
                      key={type.value}
                      variant={isSelected ? "default" : "outline"}
                      className={cn(
                        "h-9 px-4 flex items-center gap-2 hover:bg-accent hover:border-primary transition-colors whitespace-nowrap",
                        isSelected && "bg-primary text-primary-foreground"
                      )}
                      onClick={() => handleTypeClick(type.value)}
                    >
                      <Icon className={cn("w-4 h-4", isSelected ? "text-primary-foreground" : "text-primary")} />
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
                                  className="text-xs text-primary hover:text-primary/80"
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
                                    {laboratoryData.selectedTests.map((test) => (
                                      <div key={test.id} className="flex justify-between items-center">
                                        <p className="text-foreground">{test.name}</p>
                                        <p className="text-foreground font-semibold">₹{test.price}</p>
                                      </div>
                                    ))}
                                  </div>
                                )}

                                {laboratoryData.selectedPackages.length > 0 && (
                                  <div className="space-y-2 pt-2">
                                    {laboratoryData.selectedPackages.map((pkg) => (
                                      <div key={pkg.id} className="flex justify-between items-center">
                                        <p className="text-foreground">{pkg.name}</p>
                                        <p className="text-foreground font-semibold">₹{pkg.price}</p>
                                      </div>
                                    ))}
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
                                  className="text-xs text-primary hover:text-primary/80"
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
                                  <p className="text-foreground font-semibold">₹1,000</p>
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
                                  className="text-xs text-primary hover:text-primary/80"
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
                                    {radiologyData.selectedTests.map((test) => (
                                      <div key={test.id} className="flex justify-between items-center">
                                        <p className="text-foreground">{test.name}</p>
                                        <p className="text-foreground font-semibold">₹{test.price}</p>
                                      </div>
                                    ))}
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
                                  className="text-xs text-primary hover:text-primary/80"
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
                                  <p className="text-foreground font-semibold">₹5,000</p>
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
                                  className="text-xs text-primary hover:text-primary/80"
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
                                  <p className="text-foreground font-semibold">₹15,000</p>
                                </div>
                              </div>
                            </div>
                          );
                        }

                        return null;
                      })}

                      {/* Total Summary */}
                      <div className="pt-4 border-t border-border space-y-2 text-xs">
                        <div className="flex justify-between">
                          <p className="text-muted-foreground">Subtotal</p>
                          <p className="text-foreground">₹{calculateTotal().subtotal}</p>
                        </div>
                        <div className="flex justify-between">
                          <p className="text-muted-foreground">CGST (9%)</p>
                          <p className="text-foreground">₹{calculateTotal().cgst}</p>
                        </div>
                        <div className="flex justify-between">
                          <p className="text-muted-foreground">SGST (9%)</p>
                          <p className="text-foreground">₹{calculateTotal().sgst}</p>
                        </div>
                        <div className="flex justify-between pt-3 border-t border-border">
                          <p className="text-foreground font-semibold">Net Payable</p>
                          <p className="text-foreground font-bold">₹{calculateTotal().total}</p>
                        </div>
                      </div>
                    </>
                  )}
                </div>

                {/* Action Buttons */}
                <div className="flex gap-3 mt-6 pt-6 border-t border-border">
                  <Button
                    variant="outline"
                    className="flex-1"
                    onClick={() => navigate("/registration")}
                  >
                    Back
                  </Button>
                  <Button 
                    className="flex-1 bg-primary hover:bg-primary/90"
                    onClick={() => {
                      const { subtotal, cgst, sgst, total } = calculateTotal();
                      let items: { name: string; price: number }[] = [];
                      
                      if (consultationData) {
                        items.push({ name: "Consultation", price: 1000 });
                      }
                      if (laboratoryData) {
                        items.push(
                          ...laboratoryData.selectedTests.map(test => ({ name: test.name, price: test.price })),
                          ...laboratoryData.selectedPackages.map(pkg => ({ name: pkg.name, price: pkg.price }))
                        );
                      }
                      if (radiologyData) {
                        items.push(...radiologyData.selectedTests.map(test => ({ name: test.name, price: test.price })));
                      }
                      if (ipdAdmissionData) {
                        items.push({ name: "IPD Admission", price: 5000 });
                      }
                      if (dcProcedureData) {
                        items.push({ name: dcProcedureData.procedure, price: 15000 });
                      }
                      
                      navigate("/payment", {
                        state: {
                          appointmentType: selectedTypes.join(", "),
                          items,
                          subtotal,
                          cgst,
                          sgst,
                          total,
                          date: "05/08/2025",
                          fromPatientInsights,
                          patientId
                        }
                      });
                    }}
                  >
                    Generate Invoice
                  </Button>
                </div>
              </Card>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default BookAppointment;
