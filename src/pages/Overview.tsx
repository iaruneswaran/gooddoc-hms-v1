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
  UserPlus 
} from "lucide-react";

interface MetricCardProps {
  title: string;
  count: number;
  subtitle: string;
  icon: React.ElementType;
  variant: "info" | "primary" | "warning" | "success" | "neutral";
  route: string;
  isPrimary?: boolean;
}

const variantStyles = {
  info: "bg-[hsl(var(--status-info-bg))] border-[hsl(var(--gd-info)/0.3)]",
  primary: "bg-[hsl(var(--gd-primary-50))] border-[hsl(var(--gd-primary-500)/0.3)]",
  warning: "bg-[hsl(var(--status-warning-bg))] border-[hsl(var(--gd-warning)/0.3)]",
  success: "bg-[hsl(var(--status-success-bg))] border-[hsl(var(--gd-success)/0.3)]",
  neutral: "bg-[hsl(var(--gd-neutral-100))] border-[hsl(var(--gd-neutral-300))]",
};

const iconStyles = {
  info: "text-[hsl(var(--gd-info))]",
  primary: "text-[hsl(var(--gd-primary-600))]",
  warning: "text-[hsl(var(--gd-warning))]",
  success: "text-[hsl(var(--gd-success))]",
  neutral: "text-[hsl(var(--gd-neutral-500))]",
};

const MetricCard = ({ 
  title, 
  count, 
  subtitle, 
  icon: Icon, 
  variant, 
  route, 
  isPrimary = false 
}: MetricCardProps) => {
  const navigate = useNavigate();
  
  return (
    <button
      onClick={() => navigate(route)}
      aria-label={`Open ${title} list`}
      className={`
        w-full text-left rounded-lg border transition-all duration-200
        hover:shadow-md hover:scale-[1.01] active:scale-[0.99]
        focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2
        ${variantStyles[variant]}
        ${isPrimary ? "p-6" : "p-5"}
      `}
    >
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <p className="text-label text-muted-foreground mb-1">{title}</p>
          <p className={`font-bold text-foreground ${isPrimary ? "text-4xl" : "text-3xl"}`}>
            {count.toLocaleString()}
          </p>
          <p className="text-caption text-muted-foreground mt-2">{subtitle}</p>
        </div>
        <div className={`p-2 rounded-md bg-card/50 ${iconStyles[variant]}`}>
          <Icon className={isPrimary ? "w-6 h-6" : "w-5 h-5"} />
        </div>
      </div>
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
      variant: "info",
      route: "/patients/op?date=today",
      isPrimary: true,
    },
    {
      title: "IP Patients",
      count: 234,
      subtitle: "Currently admitted in-patients",
      icon: BedDouble,
      variant: "primary",
      route: "/patients/ip?admitted=true",
      isPrimary: true,
    },
    {
      title: "Check In",
      count: 67,
      subtitle: "All patient check-ins today (OP, IP, ER)",
      icon: UserCheck,
      variant: "warning",
      route: "/patients/check-in?date=today",
      isPrimary: true,
    },
    {
      title: "Discharged Today",
      count: 45,
      subtitle: "Discharges finalized today",
      icon: LogOut,
      variant: "success",
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
      variant: "primary",
      route: "/doctors/on-duty?shift=active",
    },
    {
      title: "Available Now",
      count: 34,
      subtitle: "Doctors marked available now",
      icon: CheckCircle,
      variant: "success",
      route: "/doctors/available?status=available",
    },
    {
      title: "Scheduled Today",
      count: 342,
      subtitle: "All appointments for today",
      icon: CalendarClock,
      variant: "info",
      route: "/schedule/today",
    },
    {
      title: "Walk-in Patients",
      count: 56,
      subtitle: "Visits without prior appointment today",
      icon: UserPlus,
      variant: "neutral",
      route: "/patients/walk-in?date=today",
    },
  ];

  return (
    <div className="flex min-h-screen bg-background">
      <AppSidebar />
      
      <div className="flex-1 ml-[196px]">
        <AppHeader breadcrumbs={["Overview"]} />
        
        <main className="p-6">
          <Card className="p-6 mb-8">
            <h1 className="text-h3 font-semibold text-foreground">Dashboard Overview</h1>
            <p className="text-small text-muted-foreground mt-1">
              Today's key metrics at a glance. Click any card to view details.
            </p>
          </Card>

          {/* Primary Metrics Row */}
          <div className="grid grid-cols-4 gap-4 mb-4">
            {primaryCards.map((card) => (
              <MetricCard key={card.title} {...card} />
            ))}
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
