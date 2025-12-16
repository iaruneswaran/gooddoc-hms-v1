import { useNavigate } from "react-router-dom";
import { AppSidebar } from "@/components/AppSidebar";
import { AppHeader } from "@/components/AppHeader";
import { PageContent } from "@/components/PageContent";
import { Card } from "@/components/ui/card";
import { format } from "date-fns";
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
  ChevronRight
} from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface SubMetric {
  label: string;
  value: number | string;
  filterParam?: string;
}

interface MetricCardProps {
  title: string;
  count: number;
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
  icon: Icon, 
  route, 
  iconColorClass,
  subMetrics = [],
}: MetricCardProps) => {
  const navigate = useNavigate();
  
  const handleCardClick = () => {
    navigate(route);
  };
  
  const handleSubMetricClick = (e: React.MouseEvent, filterParam?: string) => {
    e.stopPropagation();
    e.preventDefault();
    if (filterParam) {
      // Build proper URL with filter
      const baseRoute = route.split('?')[0];
      const existingParams = route.includes('?') ? route.split('?')[1] : '';
      const newUrl = existingParams 
        ? `${baseRoute}?${existingParams}&${filterParam}`
        : `${baseRoute}?${filterParam}`;
      navigate(newUrl);
    }
  };
  
  return (
    <Tooltip>
      <TooltipTrigger asChild>
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
            h-[160px] flex flex-col
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
              {count.toLocaleString()}
            </p>
          </div>
          
          {/* Divider */}
          <div className="h-px bg-[#E5E7EB]" />
          
          {/* Bottom section - Sub-metrics grid */}
          <div className="px-3 py-2.5 grid grid-cols-3 text-xs">
            {subMetrics.map((metric, idx) => (
              <span
                key={idx}
                role="button"
                tabIndex={0}
                onClick={(e) => handleSubMetricClick(e, metric.filterParam)}
                onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') handleSubMetricClick(e as any, metric.filterParam); }}
                className={`
                  flex flex-col py-1 px-2 text-center
                  ${idx > 0 ? 'border-l border-border' : ''}
                  ${metric.filterParam ? 'hover:text-primary cursor-pointer' : 'cursor-default'}
                  transition-colors
                `}
                title={metric.filterParam ? `Filter: ${metric.label}` : undefined}
              >
                <span className="text-muted-foreground text-[11px] leading-tight">{metric.label}</span>
                <span className="font-semibold text-foreground mt-0.5">{metric.value}</span>
              </span>
            ))}
          </div>
        </div>
      </TooltipTrigger>
      <TooltipContent side="bottom">
        <p>View list</p>
      </TooltipContent>
    </Tooltip>
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
    <Tooltip>
      <TooltipTrigger asChild>
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
      </TooltipTrigger>
      <TooltipContent side="bottom">
        <p>View list</p>
      </TooltipContent>
    </Tooltip>
  );
};

const Overview = () => {
  const primaryCards: MetricCardProps[] = [
    {
      title: "OP Patients",
      count: 847,
      icon: Users,
      route: "/patients/op?date=today",
      iconColorClass: iconColors.patients,
      isPrimary: true,
      subMetrics: [
        { label: "Consultation Completed", value: 282, filterParam: "visitStatus=Completed" },
        { label: "Check in completed", value: 54, filterParam: "visitStatus=Pending" },
        { label: "Pending to check in", value: 56, filterParam: "visitStatus=In_Queue" },
      ],
    },
    {
      title: "IP Patients",
      count: 234,
      icon: BedDouble,
      route: "/patients/ip?status=admitted",
      iconColorClass: iconColors.patients,
      isPrimary: true,
      subMetrics: [
        { label: "New Admissions", value: 19, filterParam: "admittedToday=true" },
        { label: "ER case today", value: 8, filterParam: "erCase=true" },
      ],
    },
    {
      title: "Bed Availability",
      count: 67,
      icon: UserCheck,
      route: "/patients/check-in?date=today",
      iconColorClass: iconColors.patients,
      isPrimary: true,
      subMetrics: [
        { label: "ICU", value: 25, filterParam: "bedType=icu" },
        { label: "Ward", value: 21, filterParam: "bedType=ward" },
        { label: "Rooms", value: "03", filterParam: "bedType=rooms" },
      ],
    },
    {
      title: "Discharged",
      count: 45,
      icon: LogOut,
      route: "/patients/discharged?date=today",
      iconColorClass: iconColors.patients,
      isPrimary: true,
      subMetrics: [
        { label: "Pending", value: 11, filterParam: "dischargeStatus=Pending" },
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
      title: "Appointment request received",
      count: 342,
      icon: CalendarClock,
      route: "/schedule/today?date=today",
      iconColorClass: iconColors.doctors,
    },
    {
      title: "Lab orders today",
      count: 156,
      icon: FlaskConical,
      route: "/lab/pending?status=pending",
      iconColorClass: iconColors.labs,
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
      title: "Radiology orders today",
      count: 34,
      icon: ScanLine,
      route: "/radiology/queue?status=queued",
      iconColorClass: iconColors.labs,
    },
    {
      title: "Low Stock",
      count: 34,
      icon: PackageOpen,
      route: "/inventory/low-stock",
      iconColorClass: iconColors.inventory,
    },
  ];

  const today = new Date();

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
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <CalendarClock className="w-4 h-4" />
                <span>{format(today, "EEEE, MMMM d, yyyy")}</span>
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
