import { useNavigate } from "react-router-dom";
import { AppSidebar } from "@/components/AppSidebar";
import { AppHeader } from "@/components/AppHeader";
import { PageContent } from "@/components/PageContent";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CalendarWidget } from "@/components/CalendarWidget";
import { OverviewKpiCard } from "@/components/overview/OverviewKpiCard";
import { 
  ChevronRight,
} from "lucide-react";

import iconOpPatients from "@/assets/icon-op-patients.svg";
import iconDiagnostics from "@/assets/icon-diagnostics.svg";
import iconRevenue from "@/assets/icon-revenue.svg";

// New metric card icons
import iconAppointmentRequest from "@/assets/icons/icon-appointment-request.svg";
import iconDoctorsDuty from "@/assets/icons/icon-doctors-duty.svg";
import iconMedicineOrders from "@/assets/icons/icon-medicine-orders.svg";
import iconBeds from "@/assets/icons/icon-beds.svg";
import iconSurgeries from "@/assets/icons/icon-surgeries.svg";
import iconEmergency from "@/assets/icons/icon-emergency.svg";
import iconLowStock from "@/assets/icons/icon-low-stock.svg";

interface MetricCardProps {
  title: string;
  count: number;
  displayCount?: string;
  iconSrc: string;
  route: string;
  badge?: string;
}

const formatValue = (value: string | number): string => {
  const s = value.toString();
  if (/^\d$/.test(s)) return `0${s}`;
  if (/^\d[a-zA-Z]/.test(s)) return `0${s}`;
  return s;
};

const StandardMetricCard = ({ 
  title, 
  count,
  displayCount,
  iconSrc, 
  route, 
  badge,
}: MetricCardProps) => {
  const navigate = useNavigate();
  
  const formattedBadge = badge ? formatValue(badge) : undefined;

  return (
    <button
      onClick={() => navigate(route)}
      aria-label={`Open ${title} list (${count})`}
      className="
        group w-full text-left rounded-xl border border-border bg-card
        transition-all duration-200 ease-out
        hover:border-primary/40 hover:shadow-md hover:-translate-y-0.5
        active:scale-[0.98]
        focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2
        h-[90px] px-4 flex items-center gap-3
      "
    >
      <img 
        src={iconSrc} 
        alt="" 
        className="w-11 h-11 shrink-0"
      />
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2">
          <p className="text-foreground" style={{ fontSize: "22px", fontWeight: 600, letterSpacing: "-1.5px" }}>
            {displayCount ? (
              displayCount.includes('|') ? (
                <>
                  {formatValue(displayCount.split('|')[0].trim())}
                  <span className="text-[14px] font-medium text-muted-foreground" style={{ fontWeight: 500, letterSpacing: "normal" }}>{displayCount.split('|').slice(1).join('|')}</span>
                </>
              ) : formatValue(displayCount)
            ) : (count < 10 ? `0${count}` : count.toLocaleString())}
          </p>
          {formattedBadge && (
            <span className="px-2 py-0.5 rounded-full bg-destructive text-destructive-foreground text-xs font-semibold shadow-sm">
              {formattedBadge}
            </span>
          )}
        </div>
        <p className="text-xs font-medium text-muted-foreground truncate">
          {title}
        </p>
      </div>
      <ChevronRight 
        aria-hidden="true"
        className="w-5 h-5 text-primary/50 group-hover:text-primary group-hover:translate-x-0.5 transition-all duration-200 shrink-0" 
      />
    </button>
  );
};

const DentalDashboard = () => {
  const navigate = useNavigate();

  // Top row cards (first 4)
  const topRowCards: MetricCardProps[] = [
    {
      title: "Dental Appointments",
      count: 156,
      displayCount: "156",
      iconSrc: iconAppointmentRequest,
      route: "/dental/consultations",
      badge: "08new",
    },
    {
      title: "Dentists on Duty",
      count: 12,
      iconSrc: iconDoctorsDuty,
      route: "/doctors",
    },
    {
      title: "Prescription Orders",
      count: 45,
      iconSrc: iconMedicineOrders,
      route: "/dental/pharmacy/pending?status=pending",
    },
    {
      title: "Chair Availability",
      count: 8,
      displayCount: "08",
      iconSrc: iconBeds,
      route: "/dental/chairs",
    },
  ];

  // Bottom row cards
  const bottomRowCards: MetricCardProps[] = [
    {
      title: "Oral Surgeries",
      count: 6,
      iconSrc: iconSurgeries,
      route: "/dental/surgeries?date=today",
    },
    {
      title: "Dental Emergencies",
      count: 3,
      iconSrc: iconEmergency,
      route: "/dental/emergencies?status=active",
    },
    {
      title: "Dental Supplies Stock",
      count: 12,
      iconSrc: iconLowStock,
      route: "/dental/inventory/low-stock",
    },
  ];

  return (
    <div className="flex min-h-screen bg-background">
      <AppSidebar />
      
      <PageContent>
        <AppHeader breadcrumbs={["Overview"]} />
        
        <main className="p-6">
          {/* Header Card */}
          <Card className="p-5 mb-6">
            <div className="flex items-center justify-between">
              <h1 className="text-lg font-semibold text-foreground">Dental Center Summary</h1>
              <div className="flex items-center gap-4">
                <CalendarWidget pageKey="dental-overview" showSubtext={true} />
              </div>
            </div>
          </Card>

          {/* Priority KPI Cards Row */}
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4 mb-4">
            <OverviewKpiCard
              title="Consultations"
              kpiValue="124"
              iconSrc={iconOpPatients}
              route="/dental/consultations"
              bullets={[{ text: "Total Scheduled" }]}
              chips={[
                { label: "Completed", value: "48", route: "/dental/consultations?status=Completed" },
                { label: "In Waiting", value: "12", route: "/dental/consultations?status=Waiting" },
              ]}
            />
            <OverviewKpiCard
              title="Procedures"
              kpiValue="42"
              iconSrc={iconSurgeries}
              route="/dental/procedures?status=active"
              bullets={[{ text: "Active Procedures" }]}
              chips={[
                { label: "Root Canal", value: "08", route: "/dental/procedures?type=RCT" },
                { label: "Cleaning", value: "15", route: "/dental/procedures?type=Cleaning" },
              ]}
            />
            <OverviewKpiCard
              title="Imaging"
              kpiValue="28"
              iconSrc={iconDiagnostics}
              route="/dental/imaging"
              bullets={[{ text: "Images Taken" }]}
              chips={[
                { label: "Pending Report", value: "06", route: "/dental/imaging?status=Pending" },
                { label: "Ready", value: "22", route: "/dental/imaging?status=Ready" },
              ]}
            />
            <OverviewKpiCard
              title="Revenue"
              kpiValue="4.8L"
              iconSrc={iconRevenue}
              route="/dental/revenue"
              bullets={[{ text: "From 24 Bills" }]}
              chips={[
                { label: "Insurance Claims", value: "₹1.2L", route: "/dental/revenue?type=insurance" },
                { label: "Self Pay", value: "₹3.6L", route: "/dental/revenue?type=self" },
              ]}
            />
          </div>

          {/* Top Row - Appointment, Doctors, Medicine, Beds */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
            {topRowCards.map((card) => (
              <StandardMetricCard key={card.title} {...card} />
            ))}
          </div>

          {/* Bottom Row - Other cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {bottomRowCards.map((card) => (
              <StandardMetricCard key={card.title} {...card} />
            ))}
          </div>
        </main>
      </PageContent>
    </div>
  );
};

export default DentalDashboard;
