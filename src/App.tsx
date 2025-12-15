import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import Overview from "./pages/Overview";
import NewAppointment from "./pages/NewAppointment";
import Registration from "./pages/Registration";
import BookAppointment from "./pages/BookAppointment";
import Inbox from "./pages/Inbox";
import Payment from "./pages/Payment";
import PatientInsights from "./pages/PatientInsights";
import PatientTimeline from "./pages/PatientTimeline";
import Payments from "./pages/Payments";
import Discharge from "./pages/Discharge";
import DoctorsList from "./pages/DoctorsList";
import DoctorForm from "./pages/DoctorForm";
import DoctorSchedulePage from "./pages/DoctorSchedulePage";
import DoctorCalendarPage from "./pages/DoctorCalendarPage";
import NotFound from "./pages/NotFound";
import DiagnosticsWorklist from "./pages/DiagnosticsWorklist";
import LaboratoryResults from "./pages/LaboratoryResults";
import RadiologyResults from "./pages/RadiologyResults";
import OutpatientAppointments from "./pages/OutpatientAppointments";
import Patient360 from "./pages/Patient360";
import Patients from "./pages/Patients";
import RecordVitals from "./pages/RecordVitals";
import Insurance from "./pages/Insurance";
import NewClaim from "./pages/NewClaim";
import PricingCatalog from "./pages/PricingCatalog";
import AddPricingItem from "./pages/AddPricingItem";
import Pharmacy from "./pages/Pharmacy";
import Reports from "./pages/Reports";
import OPPatientsToday from "./pages/OPPatientsToday";
import IPPatients from "./pages/IPPatients";
import CheckInPatients from "./pages/CheckInPatients";
import DischargedToday from "./pages/DischargedToday";
import DoctorsOnDuty from "./pages/DoctorsOnDuty";
import ScheduledToday from "./pages/ScheduledToday";
import LabReportsPending from "./pages/LabReportsPending";
import SurgeriesToday from "./pages/SurgeriesToday";
import EmergencyCases from "./pages/EmergencyCases";
import PharmacyPending from "./pages/PharmacyPending";
import RadiologyQueue from "./pages/RadiologyQueue";
import LowStockItems from "./pages/LowStockItems";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/overview" element={<Overview />} />
          <Route path="/inbox" element={<Inbox />} />
          <Route path="/new-appointment" element={<NewAppointment />} />
          <Route path="/registration" element={<Registration />} />
          <Route path="/book-appointment" element={<BookAppointment />} />
          <Route path="/payment" element={<Payment />} />
          <Route path="/patient-insights/:patientId" element={<PatientInsights />} />
          <Route path="/patient-insights/:patientId/timeline" element={<PatientTimeline />} />
          <Route path="/patient-insights/:patientId/payments" element={<Payments />} />
          <Route path="/patient-insights/:patientId/discharge" element={<Discharge />} />
          <Route path="/doctors" element={<DoctorsList />} />
          <Route path="/doctors/new" element={<DoctorForm />} />
          <Route path="/doctors/:id" element={<DoctorsList />} />
          <Route path="/doctors/:id/edit" element={<DoctorForm />} />
          <Route path="/doctors/:id/schedule" element={<DoctorSchedulePage />} />
          <Route path="/doctors/:id/calendar" element={<DoctorCalendarPage />} />
          <Route path="/diagnostics" element={<DiagnosticsWorklist />} />
          <Route path="/diagnostics/lab/:orderId" element={<LaboratoryResults />} />
          <Route path="/diagnostics/radiology/:orderId" element={<RadiologyResults />} />
          <Route path="/appointments/outpatient" element={<OutpatientAppointments />} />
          <Route path="/patients/:gdid/360" element={<Patient360 />} />
          <Route path="/patients" element={<Patients />} />
          <Route path="/vitals/new" element={<RecordVitals />} />
          <Route path="/patient-insights/:patientId/insurance" element={<Insurance />} />
          <Route path="/insurance/claims/new" element={<NewClaim />} />
          <Route path="/pricing-catalog" element={<PricingCatalog />} />
          <Route path="/pricing-catalog/new" element={<AddPricingItem />} />
          <Route path="/pharmacy" element={<Pharmacy />} />
          <Route path="/reports" element={<Reports />} />
          {/* Overview drill-down routes */}
          <Route path="/patients/op" element={<OPPatientsToday />} />
          <Route path="/patients/ip" element={<IPPatients />} />
          <Route path="/patients/check-in" element={<CheckInPatients />} />
          <Route path="/patients/discharged" element={<DischargedToday />} />
          <Route path="/doctors/on-duty" element={<DoctorsOnDuty />} />
          <Route path="/schedule/today" element={<ScheduledToday />} />
          <Route path="/lab/pending" element={<LabReportsPending />} />
          <Route path="/or/surgeries" element={<SurgeriesToday />} />
          <Route path="/er/cases" element={<EmergencyCases />} />
          <Route path="/pharmacy/pending" element={<PharmacyPending />} />
          <Route path="/radiology/queue" element={<RadiologyQueue />} />
          <Route path="/inventory/low-stock" element={<LowStockItems />} />
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
