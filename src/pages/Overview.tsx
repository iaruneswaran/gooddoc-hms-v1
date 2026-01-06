import { useNavigate } from "react-router-dom";
import { AppSidebar } from "@/components/AppSidebar";
import { AppHeader } from "@/components/AppHeader";
import { PageContent } from "@/components/PageContent";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CalendarWidget } from "@/components/CalendarWidget";
import { 
  Users,
  BedDouble, 
  UserCheck, 
  LogOut, 
  Stethoscope, 
  CalendarClock, 
  FlaskConical,
  Scissors,
  AlertTriangle,
  Pill,
  ScanLine,
  PackageOpen,
  ChevronRight,
  Plus,
  IndianRupee,
  Hospital
} from "lucide-react";

interface SubMetric {
  label: string;
  value: number | string;
  filterParam?: string;
  route?: string; // Direct route for navigation instead of filter
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

// Icon color classes per category
const iconColors = {
  patients: "text-blue-600",
  doctors: "text-indigo-600",
  labs: "text-teal-600",
  surgery: "text-purple-600",
  emergency: "text-red-600",
  pharmacy: "text-amber-600",
  inventory: "text-gray-700",
};

interface PrimaryCardProps extends MetricCardProps {
  bottomLabel?: string;
}

const PrimaryMetricCard = ({ 
  title, 
  count,
  displayCount,
  icon: Icon, 
  route, 
  iconColorClass,
  subMetrics = [],
  bottomLabel,
}: PrimaryCardProps) => {
  const navigate = useNavigate();
  
  const handleCardClick = () => {
    navigate(route);
  };
  
  const handleSubMetricClick = (e: React.MouseEvent, metric: SubMetric) => {
    e.stopPropagation();
    e.preventDefault();
    if (metric.route) {
      navigate(metric.route);
    } else if (metric.filterParam) {
      const baseRoute = route.split('?')[0];
      const existingParams = route.includes('?') ? route.split('?')[1] : '';
      const newUrl = existingParams 
        ? `${baseRoute}?${existingParams}&${metric.filterParam}`
        : `${baseRoute}?${metric.filterParam}`;
      navigate(newUrl);
    }
  };
  
  return (
    <div
      role="button"
      tabIndex={0}
      onClick={handleCardClick}
      onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') handleCardClick(); }}
      aria-label={`Open ${title} list (${count})`}
      className="
        group w-full text-left rounded-xl border border-border bg-card overflow-hidden
        transition-all duration-200 ease-out cursor-pointer
        hover:border-primary/40 hover:shadow-md hover:-translate-y-0.5
        active:scale-[0.98]
        focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:outline-none
        h-[140px] flex flex-col p-4
      "
    >
      {/* Header Row - Title left, Sub-metrics right */}
      <div className="flex items-start justify-between">
        {/* Left side - Icon + Title */}
        <div className="flex items-center gap-2.5">
          <Icon className={`w-5 h-5 ${iconColorClass}`} />
          <p className="text-sm font-medium text-foreground">
            {title}
          </p>
        </div>
        
        {/* Right side - Sub-metrics stacked */}
        <div className="flex flex-col items-end gap-1">
          {subMetrics.map((metric, idx) => (
            <span
              key={idx}
              role="button"
              tabIndex={0}
              onClick={(e) => handleSubMetricClick(e, metric)}
              onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') handleSubMetricClick(e as any, metric); }}
              className={`
                text-xs text-right px-2 py-0.5 rounded
                ${metric.filterParam || metric.route ? 'hover:bg-primary/10 cursor-pointer' : 'cursor-default'}
                transition-colors
              `}
              title={metric.filterParam ? `Filter: ${metric.label}` : metric.route ? `Open ${metric.label}` : undefined}
            >
              <span className="text-muted-foreground">{metric.label}</span>
              <span className="font-semibold text-foreground ml-1">{metric.value}</span>
            </span>
          ))}
        </div>
      </div>
      
      {/* Main Value - Large blue number */}
      <p className="text-[32px] font-bold text-primary tracking-tight mt-auto">
        {displayCount ? displayCount.split('/')[0].split('|')[0].trim() : count.toLocaleString()}
      </p>
      
      {/* Bottom Label */}
      {bottomLabel && (
        <p className="text-xs text-muted-foreground mt-1">
          <span className="inline-block w-1.5 h-1.5 rounded-full bg-foreground/40 mr-1.5" />
          {bottomLabel}
        </p>
      )}
    </div>
  );
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
  
  const primaryCards: PrimaryCardProps[] = [
    {
      title: "OP Patients",
      count: 847,
      icon: Users,
      route: "/patients/op?date=today",
      iconColorClass: iconColors.patients,
      isPrimary: true,
      bottomLabel: "Patients",
      subMetrics: [
        { label: "Visit Completed", value: 282, filterParam: "visitStatus=Completed" },
        { label: "Check in Pending", value: 56, filterParam: "visitStatus=In_Queue" },
      ],
    },
    {
      title: "IP Patients",
      count: 234,
      icon: Hospital,
      route: "/patients/ip?status=admitted",
      iconColorClass: iconColors.patients,
      isPrimary: true,
      bottomLabel: "ICU 34  •  Ward 200",
      subMetrics: [
        { label: "New Admission", value: 19, filterParam: "admittedToday=true" },
        { label: "Discharged", value: 45, route: "/patients/discharged?date=today" },
      ],
    },
    {
      title: "Diagnostics",
      count: 56,
      icon: FlaskConical,
      route: "/diagnostics/orders",
      iconColorClass: iconColors.labs,
      isPrimary: true,
      bottomLabel: "Orders",
      subMetrics: [
        { label: "Laboratory", value: 26, route: "/diagnostics/orders?type=Laboratory" },
        { label: "Radiology", value: 30, route: "/diagnostics/orders?type=Radiology" },
      ],
    },
    {
      title: "Revenue",
      count: 24,
      displayCount: "24.4L",
      icon: IndianRupee,
      route: "/reports/revenue?type=paid",
      iconColorClass: "text-green-600",
      isPrimary: true,
      bottomLabel: "24 Bills Paid",
      subMetrics: [
        { label: "Outstanding Bills", value: "₹8.4L/12", route: "/reports/revenue?type=outstanding" },
        { label: "Advance Collected", value: "₹5.7/12", route: "/reports/advance-payments" },
      ],
    },
  ];

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

          {/* Priority Cards Row - 4 columns */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 mb-4">
            {primaryCards.map((card) => (
              <PrimaryMetricCard key={card.title} {...card} />
            ))}
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
