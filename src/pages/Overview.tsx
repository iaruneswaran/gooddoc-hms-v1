import { useNavigate } from "react-router-dom";
import { AppSidebar } from "@/components/AppSidebar";
import { AppHeader } from "@/components/AppHeader";
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
        group w-full text-left bg-card rounded-xl border border-border
        transition-all duration-200 ease-out
        hover:shadow-lg hover:border-primary/30 hover:-translate-y-0.5
        active:scale-[0.98]
        focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2
        ${isPrimary ? "p-6" : "p-5"}
      `}
    >
      <div className="flex items-start justify-between mb-4">
        <div className={`
          flex items-center justify-center rounded-lg bg-primary/10
          ${isPrimary ? "w-12 h-12" : "w-10 h-10"}
        `}>
          <Icon className={`text-primary ${isPrimary ? "w-6 h-6" : "w-5 h-5"}`} />
        </div>
        <ArrowRight className="w-4 h-4 text-muted-foreground opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all duration-200" />
      </div>
      
      <p className={`font-bold text-foreground mb-1 ${isPrimary ? "text-4xl" : "text-3xl"}`}>
        {count.toLocaleString()}
      </p>
      
      <p className={`font-medium text-foreground ${isPrimary ? "text-base" : "text-sm"}`}>
        {title}
      </p>
      
      <p className="text-caption text-muted-foreground mt-1 line-clamp-1">
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
        
        <main className="p-6">
          {/* Section Label */}
          <div className="mb-4">
            <h2 className="text-label text-muted-foreground uppercase tracking-wider">Patient Metrics</h2>
          </div>

          {/* Primary Metrics Row */}
          <div className="grid grid-cols-4 gap-4 mb-8">
            {primaryCards.map((card) => (
              <MetricCard key={card.title} {...card} />
            ))}
          </div>

          {/* Section Label */}
          <div className="mb-4">
            <h2 className="text-label text-muted-foreground uppercase tracking-wider">Operations</h2>
          </div>

          {/* Support Metrics Row */}
          <div className="grid grid-cols-4 gap-4">
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
