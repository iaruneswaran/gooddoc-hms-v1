import { useNavigate } from "react-router-dom";
import { AppSidebar } from "@/components/AppSidebar";
import { AppHeader } from "@/components/AppHeader";
import { PageContent } from "@/components/PageContent";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CalendarWidget } from "@/components/CalendarWidget";
import { OverviewKpiCard } from "@/components/overview/OverviewKpiCard";
import { 
  BedDouble, 
  Stethoscope, 
  CalendarClock, 
  Scissors,
  AlertTriangle,
  Pill,
  PackageOpen,
  ChevronRight,
  Plus,
} from "lucide-react";

import iconOpPatients from "@/assets/icon-op-patients.svg";
import iconIpPatients from "@/assets/icon-ip-patients.svg";
import iconDiagnostics from "@/assets/icon-diagnostics.svg";
import iconRevenue from "@/assets/icon-revenue.svg";

interface SubMetric {
  label: string;
  value: number | string;
  filterParam?: string;
  route?: string;
}

interface MetricCardProps {
  title: string;
  count: number;
  displayCount?: string;
  icon: React.ElementType;
  route: string;
  iconColorClass: string;
  isPrimary?: boolean;
  subMetrics?: SubMetric[];
  badge?: string;
}

const iconColors = {
  patients: "text-blue-600",
  doctors: "text-indigo-600",
  labs: "text-teal-600",
  surgery: "text-purple-600",
  emergency: "text-red-600",
  pharmacy: "text-amber-600",
  inventory: "text-gray-700",
};

const StandardMetricCard = ({ 
  title, 
  count,
  displayCount,
  icon: Icon, 
  route, 
  iconColorClass,
  badge,
}: MetricCardProps) => {
  const navigate = useNavigate();
  
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
      <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-white border border-border shadow-sm shrink-0">
        <Icon className={`w-5 h-5 ${iconColorClass}`} />
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2">
          <p className="text-2xl font-bold text-foreground tracking-tight">
            {displayCount ? (
              displayCount.includes('|') ? (
                <>
                  {displayCount.split('|')[0].trim()}
                  <span className="text-[14px] font-medium text-muted-foreground">{displayCount.split('|').slice(1).join('|')}</span>
                </>
              ) : displayCount
            ) : count.toLocaleString()}
          </p>
          {badge && (
            <span className="px-2 py-0.5 rounded-full bg-red-500 text-white text-xs font-semibold shadow-sm">
              {badge}
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

const Overview = () => {
  const navigate = useNavigate();

  // Top row cards (first 4)
  const topRowCards: MetricCardProps[] = [
    {
      title: "Appointment request received",
      count: 342,
      displayCount: "342",
      icon: CalendarClock,
      route: "/schedule/today?date=today",
      iconColorClass: iconColors.doctors,
      badge: "12new",
    },
    {
      title: "Doctors on Duty",
      count: 89,
      icon: Stethoscope,
      route: "/doctors/on-duty?shift=current",
      iconColorClass: iconColors.doctors,
    },
    {
      title: "Total medicine orders",
      count: 89,
      icon: Pill,
      route: "/pharmacy/pending?status=pending",
      iconColorClass: iconColors.pharmacy,
    },
    {
      title: "Beds Availability",
      count: 67,
      displayCount: "67| ICU: 37 • Ward: 30",
      icon: BedDouble,
      route: "/patients/check-in?date=today",
      iconColorClass: iconColors.patients,
    },
  ];

  // Bottom row cards
  const bottomRowCards: MetricCardProps[] = [
    {
      title: "Surgeries",
      count: 24,
      icon: Scissors,
      route: "/or/surgeries?date=today",
      iconColorClass: iconColors.surgery,
    },
    {
      title: "Emergency Cases",
      count: 15,
      icon: AlertTriangle,
      route: "/er/cases?status=active",
      iconColorClass: iconColors.emergency,
    },
    {
      title: "Low Stock",
      count: 34,
      icon: PackageOpen,
      route: "/inventory/low-stock",
      iconColorClass: iconColors.inventory,
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
              <h1 className="text-lg font-semibold text-foreground">Today's Summary</h1>
              <div className="flex items-center gap-4">
                <CalendarWidget />
                <Button onClick={() => navigate("/new-appointment")} className="h-9">
                  <Plus className="w-4 h-4 mr-1" />
                  New Appointment
                </Button>
              </div>
            </div>
          </Card>

          {/* Priority KPI Cards Row - New Design */}
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4 mb-4">
            <OverviewKpiCard
              title="OP Patients"
              kpiValue="847"
              iconSrc={iconOpPatients}
              route="/patients/op?date=today"
              bullets={[{ text: "Patients" }]}
              chips={[
                { label: "Visit Completed", value: "282", route: "/patients/op?date=today&visitStatus=Completed" },
                { label: "Check in Pending", value: "56", route: "/patients/op?date=today&visitStatus=In_Queue" },
              ]}
            />
            <OverviewKpiCard
              title="IP Patients"
              kpiValue="234"
              iconSrc={iconIpPatients}
              route="/patients/ip?status=admitted"
              bullets={[{ text: "ICU 34" }, { text: "Ward 200" }]}
              chips={[
                { label: "New Admission", value: "19", route: "/patients/ip?status=admitted&admittedToday=true" },
                { label: "Discharged", value: "45", route: "/patients/discharged?date=today" },
              ]}
            />
            <OverviewKpiCard
              title="Diagnostics"
              kpiValue="56"
              iconSrc={iconDiagnostics}
              route="/diagnostics/orders"
              bullets={[{ text: "Orders" }]}
              chips={[
                { label: "Laboratory", value: "26", route: "/diagnostics/orders?type=Laboratory" },
                { label: "Radiology", value: "30", route: "/diagnostics/orders?type=Radiology" },
              ]}
            />
            <OverviewKpiCard
              title="Revenue"
              kpiValue="24.4L"
              iconSrc={iconRevenue}
              route="/reports/revenue?type=paid"
              bullets={[{ text: "24 Bills Paid" }]}
              chips={[
                { label: "Outstanding Bills", value: "₹8.4L/12", route: "/reports/revenue?type=outstanding" },
                { label: "Advance Amount", value: "₹5.7/12", route: "/reports/advance-payments" },
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

export default Overview;
