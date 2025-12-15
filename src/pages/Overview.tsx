import { useNavigate } from "react-router-dom";
import { AppSidebar } from "@/components/AppSidebar";
import { AppHeader } from "@/components/AppHeader";
import { CalendarWidget } from "@/components/CalendarWidget";
import { Card } from "@/components/ui/card";
import { 
  Users, 
  BedDouble, 
  UserCheck, 
  LogOut, 
  Stethoscope, 
  CheckCircle, 
  CalendarClock, 
  UserPlus,
  ArrowRight
} from "lucide-react";

interface MetricCardProps {
  title: string;
  count: number;
  subtitle: string;
  icon: React.ElementType;
  route: string;
  isPrimary?: boolean;
}

const MetricCard = ({ 
  title, 
  count, 
  subtitle, 
  icon: Icon, 
  route, 
  isPrimary = false 
}: MetricCardProps) => {
  const navigate = useNavigate();
  
  return (
    <button
      onClick={() => navigate(route)}
      aria-label={`Open ${title} list`}
      className={`
        group w-full text-left bg-card rounded-lg border border-border
        transition-all duration-200 ease-out
        hover:shadow-md hover:border-primary/30 hover:-translate-y-0.5
        active:scale-[0.98]
        focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2
        ${isPrimary ? "p-4" : "p-3"}
      `}
    >
      <div className="flex items-center justify-between mb-2">
        <div className={`
          flex items-center justify-center rounded-md bg-primary/10
          ${isPrimary ? "w-9 h-9" : "w-8 h-8"}
        `}>
          <Icon className={`text-primary ${isPrimary ? "w-4 h-4" : "w-4 h-4"}`} />
        </div>
        <ArrowRight className="w-3.5 h-3.5 text-muted-foreground opacity-0 group-hover:opacity-100 group-hover:translate-x-0.5 transition-all duration-200" />
      </div>
      
      <p className={`font-bold text-foreground mb-0.5 ${isPrimary ? "text-2xl" : "text-xl"}`}>
        {count.toLocaleString()}
      </p>
      
      <p className={`font-medium text-foreground ${isPrimary ? "text-sm" : "text-xs"}`}>
        {title}
      </p>
      
      <p className="text-xs text-muted-foreground mt-0.5 line-clamp-1">
        {subtitle}
      </p>
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
      isPrimary: true,
    },
    {
      title: "IP Patients",
      count: 234,
      subtitle: "Currently admitted in-patients",
      icon: BedDouble,
      route: "/patients/ip?admitted=true",
      isPrimary: true,
    },
    {
      title: "Check In",
      count: 67,
      subtitle: "All patient check-ins today (OP, IP, ER)",
      icon: UserCheck,
      route: "/patients/check-in?date=today",
      isPrimary: true,
    },
    {
      title: "Discharged Today",
      count: 45,
      subtitle: "Discharges finalized today",
      icon: LogOut,
      route: "/patients/discharged?date=today",
      isPrimary: true,
    },
  ];

  const supportCards: MetricCardProps[] = [
    {
      title: "Doctors on Duty",
      count: 89,
      subtitle: "Active shift only",
      icon: Stethoscope,
      route: "/doctors/on-duty?shift=active",
    },
    {
      title: "Available Now",
      count: 34,
      subtitle: "Doctors marked available now",
      icon: CheckCircle,
      route: "/doctors/available?status=available",
    },
    {
      title: "Scheduled Today",
      count: 342,
      subtitle: "All appointments for today",
      icon: CalendarClock,
      route: "/schedule/today",
    },
    {
      title: "Walk-in Patients",
      count: 56,
      subtitle: "Visits without prior appointment today",
      icon: UserPlus,
      route: "/patients/walk-in?date=today",
    },
  ];

  return (
    <div className="flex min-h-screen bg-background">
      <AppSidebar />
      
      <div className="flex-1 ml-[196px]">
        <AppHeader breadcrumbs={["Overview"]} />
        
        <main className="p-6 pr-4">
          {/* Header Card */}
          <Card className="p-6 mb-6">
            <div className="flex items-center justify-between">
              <h1 className="text-lg font-semibold text-foreground">Overview</h1>
              <CalendarWidget />
            </div>
          </Card>

          {/* Section Label */}
          <div className="mb-3">
            <h2 className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Patient Metrics</h2>
          </div>

          {/* Primary Metrics Row */}
          <div className="grid grid-cols-4 gap-3 mb-6">
            {primaryCards.map((card) => (
              <MetricCard key={card.title} {...card} />
            ))}
          </div>

          {/* Section Label */}
          <div className="mb-3">
            <h2 className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Operations</h2>
          </div>

          {/* Support Metrics Row */}
          <div className="grid grid-cols-4 gap-3">
            {supportCards.map((card) => (
              <MetricCard key={card.title} {...card} />
            ))}
          </div>
        </main>
      </div>
    </div>
  );
};

export default Overview;
