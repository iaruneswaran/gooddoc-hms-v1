import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import NewAppointment from "./pages/NewAppointment";
import Registration from "./pages/Registration";
import BookAppointment from "./pages/BookAppointment";
import Payment from "./pages/Payment";
import PatientInsights from "./pages/PatientInsights";
import PatientPayments from "./pages/PatientPayments";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/new-appointment" element={<NewAppointment />} />
          <Route path="/registration" element={<Registration />} />
          <Route path="/book-appointment" element={<BookAppointment />} />
          <Route path="/payment" element={<Payment />} />
          <Route path="/patient-insights/:patientId" element={<PatientInsights />} />
          <Route path="/patient-insights/:patientId/payments" element={<PatientPayments />} />
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
