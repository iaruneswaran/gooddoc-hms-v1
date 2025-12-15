import { useNavigate } from "react-router-dom";
import { AppSidebar } from "@/components/AppSidebar";
import { AppHeader } from "@/components/AppHeader";
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
  ArrowRight
} from "lucide-react";
import {
  opSubData,
  ipSubData,
  checkInSubData,
  dischargedSubData,
} from "@/data/overview.mock";

interface SubDataItem {
  label: string;
  value: number | string;
}

interface MetricCardProps {
  title: string;
  count: number;
  subtitle?: string;
  icon: React.ElementType;
  route: string;
  colorClass: string;
  isPrimary?: boolean;
  subData?: SubDataItem[];
}

const MetricCard = ({ 
  title, 
  count, 
  subtitle, 
  icon: Icon, 
  route, 
  colorClass,
  isPrimary = false,
  subData,
}: MetricCardProps) => {
  const navigate = useNavigate();
  
  if (isPrimary) {
    return (
      <button
        onClick={() => navigate(route)}
        aria-label={`Open ${title} list`}
        className="
          group w-full text-left rounded-xl border border-primary/15 overflow-hidden bg-card
          transition-all duration-200 ease-out
          hover:border-primary/40 hover:-translate-y-0.5
          active:scale-[0.98]
          focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2
          h-[140px] flex flex-col p-4
        "
      >
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <div className="flex items-center gap-2.5 mb-2">
              <div className="flex items-center justify-center w-9 h-9 rounded-lg bg-primary/10">
                <Icon className="w-4 h-4 text-primary" />
              </div>
              <p className="text-xs font-medium text-muted-foreground">
                {title}
              </p>
            </div>
            <p className="text-2xl font-bold text-foreground tracking-tight mb-2">
              {count.toLocaleString()}
            </p>
            {/* Sub-data inline */}
            {subData && (
              <div className="flex items-center gap-4">
                {subData.map((item, idx) => (
                  <div key={idx} className="flex items-center gap-1">
                    <span className="text-[11px] text-muted-foreground">{item.label}:</span>
                    <span className="text-[11px] font-semibold text-primary">{item.value}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
          <ArrowRight className="w-4 h-4 text-primary/40 group-hover:text-primary group-hover:translate-x-0.5 transition-all duration-200" />
        </div>
      </button>
    );
  }
  
  // Operations card (compact)
  return (
    <button
      onClick={() => navigate(route)}
      aria-label={`Open ${title} list`}
      className="
        group w-full text-left rounded-xl border border-primary/15 bg-card
        transition-all duration-200 ease-out
        hover:border-primary/40 hover:-translate-y-0.5
        active:scale-[0.98]
        focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2
        h-[72px] px-4 flex items-center gap-3
      "
    >
      <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-primary/10 shrink-0">
        <Icon className="w-5 h-5 text-primary" />
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-2xl font-bold text-foreground tracking-tight">
          {count.toLocaleString()}
        </p>
        <p className="text-xs text-muted-foreground truncate">
          {subtitle}
        </p>
      </div>
      <ArrowRight className="w-4 h-4 text-primary/40 group-hover:text-primary group-hover:translate-x-0.5 transition-all duration-200 shrink-0" />
    </button>
  );
};

const Overview = () => {
  const primaryCards: MetricCardProps[] = [
    {
      title: "OP Patients Today",
      count: 847,
      subtitle: "Out-patient visits registered today",
      icon: Users,
      route: "/patients/op?date=today",
      colorClass: "",
      isPrimary: true,
      subData: [
        { label: "Completed", value: opSubData.completed },
      ],
    },
    {
      title: "IP Patients",
      count: 234,
      subtitle: "Currently admitted in-patients",
      icon: BedDouble,
      route: "/patients/ip?admitted=true",
      colorClass: "",
      isPrimary: true,
      subData: [
        { label: "Admitted Today", value: ipSubData.admittedToday },
      ],
    },
    {
      title: "Check In",
      count: 67,
      subtitle: "All patient check-ins today (OP, IP, ER)",
      icon: UserCheck,
      route: "/patients/check-in?date=today",
      colorClass: "",
      isPrimary: true,
      subData: [
        { label: "Outpatient", value: checkInSubData.op },
      ],
    },
    {
      title: "Discharged Today",
      count: 45,
      subtitle: "Discharges finalized today",
      icon: LogOut,
      route: "/patients/discharged?date=today",
      colorClass: "",
      isPrimary: true,
      subData: [
        { label: "Pending", value: dischargedSubData.pendingClearance },
      ],
    },
  ];

  const operationsCards: MetricCardProps[] = [
    {
      title: "Doctors on Duty",
      count: 89,
      icon: Stethoscope,
      route: "/doctors/on-duty?shift=active",
      colorClass: "",
    },
    {
      title: "Scheduled Today",
      count: 342,
      icon: CalendarClock,
      route: "/schedule/today",
      colorClass: "",
    },
    {
      title: "Lab Reports Pending",
      count: 156,
      icon: FlaskConical,
      route: "/lab/pending?date=today",
      colorClass: "",
    },
    {
      title: "Surgeries Today",
      count: 24,
      icon: Scissors,
      route: "/or/surgeries?date=today",
      colorClass: "",
    },
    {
      title: "Emergency Cases",
      count: 15,
      icon: AlertTriangle,
      route: "/er/cases?date=today",
      colorClass: "",
    },
    {
      title: "Pharmacy Pending",
      count: 89,
      icon: Pill,
      route: "/pharmacy/pending?date=today",
      colorClass: "",
    },
    {
      title: "Radiology Queue",
      count: 34,
      icon: ScanLine,
      route: "/radiology/queue?date=today",
      colorClass: "",
    },
    {
      title: "Low Stock Items",
      count: 34,
      icon: PackageOpen,
      route: "/inventory/low-stock",
      colorClass: "",
    },
  ];

  const today = new Date();

  return (
    <div className="flex min-h-screen bg-background">
      <AppSidebar />
      
      <div className="flex-1 ml-[196px]">
        <AppHeader breadcrumbs={["Overview"]} />
        
        <main className="p-6">
          {/* Header Card */}
          <Card className="p-5 mb-6">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-lg font-semibold text-foreground">Today's Summary</h1>
                <p className="text-sm text-muted-foreground">{format(today, "EEEE, MMMM d, yyyy")}</p>
              </div>
            </div>
          </Card>

          {/* Primary Metrics Row - 4 columns */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 mb-4">
            {primaryCards.map((card) => (
              <MetricCard key={card.title} {...card} />
            ))}
          </div>

          {/* Operations Metrics - 4 columns grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {operationsCards.map((card) => (
              <MetricCard key={card.title} {...card} />
            ))}
          </div>
        </main>
      </div>
    </div>
  );
};

export default Overview;
