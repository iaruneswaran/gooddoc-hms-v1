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

const PrimaryMetricCard = ({ 
  title, 
  count,
  displayCount,
  icon: Icon, 
  route, 
  iconColorClass,
  subMetrics = [],
}: MetricCardProps) => {
  const navigate = useNavigate();
  
  const handleCardClick = () => {
    navigate(route);
  };
  
  const handleSubMetricClick = (e: React.MouseEvent, metric: SubMetric) => {
    e.stopPropagation();
    e.preventDefault();
    if (metric.route) {
      // Direct navigation to route
      navigate(metric.route);
    } else if (metric.filterParam) {
      // Build proper URL with filter
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
        h-[180px] flex flex-col
      "
    >
      {/* Top section - Main metric */}
      <div className="flex-1 p-3 pb-2 flex flex-col">
        <div className="flex items-start justify-between mb-1">
          <div className="flex items-center gap-2.5">
            <div className="flex items-center justify-center w-9 h-9 rounded-lg bg-white border border-border shadow-sm">
              <Icon className={`w-4 h-4 ${iconColorClass}`} />
            </div>
            <p className="text-sm font-semibold text-foreground">
              {title}
            </p>
          </div>
          <ChevronRight 
            aria-hidden="true"
            className="w-5 h-5 text-primary/50 group-hover:text-primary group-hover:translate-x-0.5 transition-all duration-200" 
          />
        </div>
        <p className="text-2xl font-bold text-foreground tracking-tight mt-auto">
          {displayCount ? (
            displayCount.includes('|') ? (
              <>
                {displayCount.split('|')[0].trim()}
                <span className="text-[14px] font-medium text-muted-foreground">{displayCount.split('|').slice(1).join('|')}</span>
              </>
            ) : (
              <>
                {displayCount.split('/')[0]}
                {displayCount.includes('/') && (
                  <span className="text-sm font-medium text-muted-foreground">/{displayCount.split('/').slice(1).join('/')}</span>
                )}
              </>
            )
          ) : count.toLocaleString()}
        </p>
      </div>
      
      {/* Divider */}
      <div className="h-px bg-border" />
      
      {/* Bottom section - Sub-metrics grid */}
      <div className={`px-2 py-3 grid ${subMetrics.length === 1 ? 'grid-cols-1' : subMetrics.length === 2 ? 'grid-cols-2' : 'grid-cols-3'} text-xs`}>
        {subMetrics.map((metric, idx) => (
          <span
            key={idx}
            role="button"
            tabIndex={0}
            onClick={(e) => handleSubMetricClick(e, metric)}
            onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') handleSubMetricClick(e as any, metric); }}
            className={`
              flex flex-col py-1.5 px-2 text-center rounded-md
              ${idx > 0 ? 'border-l border-border' : ''}
              ${metric.filterParam || metric.route ? 'hover:bg-primary/10 hover:text-primary cursor-pointer' : 'cursor-default'}
              transition-colors
            `}
            title={metric.filterParam ? `Filter: ${metric.label}` : metric.route ? `Open ${metric.label}` : undefined}
          >
            <span className="text-muted-foreground text-[11px] leading-tight">{metric.label}</span>
            <span className="font-semibold text-foreground mt-0.5">{metric.value}</span>
          </span>
        ))}
      </div>
    </div>
  );
};

const StandardMetricCard = ({ 
  title, 
  count, 
  icon: Icon, 
  route, 
  iconColorClass,
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
        <p className="text-2xl font-bold text-foreground tracking-tight">
          {count.toLocaleString()}
        </p>
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
  
  const primaryCards: MetricCardProps[] = [
    {
      title: "OP Patients",
      count: 847,
      icon: Users,
      route: "/patients/op?date=today",
      iconColorClass: iconColors.patients,
      isPrimary: true,
      subMetrics: [
        { label: "Visit Completed", value: 282, filterParam: "visitStatus=Completed" },
        { label: "Check In Pending", value: 56, filterParam: "visitStatus=In_Queue" },
      ],
    },
    {
      title: "IP Patients",
      count: 234,
      displayCount: "234| - ICU 34 - Ward 200",
      icon: Hospital,
      route: "/patients/ip?status=admitted",
      iconColorClass: iconColors.patients,
      isPrimary: true,
      subMetrics: [
        { label: "New Admissions", value: 19, filterParam: "admittedToday=true" },
        { label: "Discharged", value: 45, filterParam: "status=discharged" },
      ],
    },
    {
      title: "Diagnostics",
      count: 56,
      displayCount: "56/Orders",
      icon: FlaskConical,
      route: "/diagnostics/orders",
      iconColorClass: iconColors.labs,
      isPrimary: true,
      subMetrics: [
        { label: "Laboratory", value: 26, route: "/diagnostics/orders?type=Laboratory" },
        { label: "Radiology", value: 30, route: "/diagnostics/orders?type=Radiology" },
      ],
    },
    {
      title: "Revenue",
      count: 24,
      displayCount: "24.4L/24 Bills Paid",
      icon: IndianRupee,
      route: "/reports/revenue?type=paid",
      iconColorClass: "text-green-600",
      isPrimary: true,
      subMetrics: [
        { label: "Outstanding Bills", value: "₹8.4L/12", route: "/reports/revenue?type=outstanding" },
        { label: "Advance Collected", value: "₹5.7L/12", route: "/reports/advance-payments" },
      ],
    },
  ];

  const standardCards: MetricCardProps[] = [
    {
      title: "Doctors on Duty",
      count: 89,
      icon: Stethoscope,
      route: "/doctors/on-duty?shift=current",
      iconColorClass: iconColors.doctors,
    },
    {
      title: "Discharged",
      count: 45,
      icon: LogOut,
      route: "/patients/discharged?date=today",
      iconColorClass: iconColors.patients,
    },
    {
      title: "Appointment request received",
      count: 342,
      icon: CalendarClock,
      route: "/schedule/today?date=today",
      iconColorClass: iconColors.doctors,
    },
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
      title: "Total medicine orders",
      count: 89,
      icon: Pill,
      route: "/pharmacy/pending?status=pending",
      iconColorClass: iconColors.pharmacy,
    },
    {
      title: "Beds Availability",
      count: 67,
      icon: BedDouble,
      route: "/patients/check-in?date=today",
      iconColorClass: iconColors.patients,
    },
    {
      title: "Low Stock",
      count: 34,
      icon: PackageOpen,
      route: "/inventory/low-stock",
      iconColorClass: iconColors.inventory,
    },
    {
      title: "Bed Charges",
      count: 15,
      displayCount: "View Master",
      icon: BedDouble,
      route: "/settings/bed-charges",
      iconColorClass: iconColors.patients,
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

          {/* Standard Cards - 4 columns grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {standardCards.map((card) => (
              <StandardMetricCard key={card.title} {...card} />
            ))}
          </div>
        </main>
      </PageContent>
    </div>
  );
};

export default Overview;
