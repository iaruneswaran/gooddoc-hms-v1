import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { AppSidebar } from "@/components/AppSidebar";
import { AppHeader } from "@/components/AppHeader";
import { PageContent } from "@/components/PageContent";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { 
  Search, 
  ChevronRight,
  HeartPulse,
  BrainCircuit,
  Accessibility,
  Cross,
  Pill,
  Smile,
  Stethoscope,
  UserRound,
  Users,
  BedDouble,
  Timer
} from "lucide-react";

const DEPARTMENTS = [
  {
    id: "cardiology",
    name: "Cardiology",
    description: "Heart & Cardiovascular Care",
    headDoctor: "Dr. Priya Sharma",
    icon: HeartPulse,
    accentColor: "from-rose-500 to-red-600",
    lightBg: "bg-rose-50 dark:bg-rose-950/30",
    iconBg: "bg-rose-100 dark:bg-rose-900/50",
    iconColor: "text-rose-600 dark:text-rose-400",
    doctorsCount: 8,
    outpatientCount: 145,
    inpatientCount: 23,
    avgWaitTime: 18,
  },
  {
    id: "orthopedics",
    name: "Orthopedics",
    description: "Bones, Joints & Musculoskeletal",
    headDoctor: "Dr. Aisha Khan",
    icon: Accessibility,
    accentColor: "from-amber-500 to-orange-600",
    lightBg: "bg-amber-50 dark:bg-amber-950/30",
    iconBg: "bg-amber-100 dark:bg-amber-900/50",
    iconColor: "text-amber-600 dark:text-amber-400",
    doctorsCount: 6,
    outpatientCount: 98,
    inpatientCount: 15,
    avgWaitTime: 22,
  },
  {
    id: "neurology",
    name: "Neurology",
    description: "Brain & Nervous System",
    headDoctor: "Dr. Meera Reddy",
    icon: BrainCircuit,
    accentColor: "from-violet-500 to-purple-600",
    lightBg: "bg-violet-50 dark:bg-violet-950/30",
    iconBg: "bg-violet-100 dark:bg-violet-900/50",
    iconColor: "text-violet-600 dark:text-violet-400",
    doctorsCount: 5,
    outpatientCount: 67,
    inpatientCount: 8,
    avgWaitTime: 25,
  },
  {
    id: "general-medicine",
    name: "General Medicine",
    description: "Primary & Internal Medicine",
    headDoctor: "Dr. Vikram Singh",
    icon: Stethoscope,
    accentColor: "from-blue-500 to-indigo-600",
    lightBg: "bg-blue-50 dark:bg-blue-950/30",
    iconBg: "bg-blue-100 dark:bg-blue-900/50",
    iconColor: "text-blue-600 dark:text-blue-400",
    doctorsCount: 12,
    outpatientCount: 234,
    inpatientCount: 45,
    avgWaitTime: 15,
  },
  {
    id: "endocrinology",
    name: "Endocrinology",
    description: "Diabetes & Hormonal Disorders",
    headDoctor: "Dr. Rahul Mehta",
    icon: Pill,
    accentColor: "from-teal-500 to-emerald-600",
    lightBg: "bg-teal-50 dark:bg-teal-950/30",
    iconBg: "bg-teal-100 dark:bg-teal-900/50",
    iconColor: "text-teal-600 dark:text-teal-400",
    doctorsCount: 4,
    outpatientCount: 89,
    inpatientCount: 5,
    avgWaitTime: 20,
  },
  {
    id: "pediatrics",
    name: "Pediatrics",
    description: "Child & Adolescent Care",
    headDoctor: "Dr. Kavitha Menon",
    icon: Smile,
    accentColor: "from-pink-500 to-rose-600",
    lightBg: "bg-pink-50 dark:bg-pink-950/30",
    iconBg: "bg-pink-100 dark:bg-pink-900/50",
    iconColor: "text-pink-600 dark:text-pink-400",
    doctorsCount: 7,
    outpatientCount: 156,
    inpatientCount: 18,
    avgWaitTime: 12,
  },
];

export default function DepartmentsList() {
  const navigate = useNavigate();
  const [search, setSearch] = useState("");

  const filteredDepartments = DEPARTMENTS.filter((dept) =>
    dept.name.toLowerCase().includes(search.toLowerCase()) ||
    dept.description.toLowerCase().includes(search.toLowerCase()) ||
    dept.headDoctor.toLowerCase().includes(search.toLowerCase())
  );

  const totalDoctors = DEPARTMENTS.reduce((sum, d) => sum + d.doctorsCount, 0);
  const totalOP = DEPARTMENTS.reduce((sum, d) => sum + d.outpatientCount, 0);
  const totalIP = DEPARTMENTS.reduce((sum, d) => sum + d.inpatientCount, 0);

  return (
    <div className="min-h-screen flex w-full bg-background">
      <AppSidebar />
      <PageContent>
        <AppHeader breadcrumbs={["Departments"]} />

        <main className="p-6 space-y-6">
          {/* Header */}
          <div className="flex flex-col lg:flex-row gap-4 items-start lg:items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-foreground">Hospital Departments</h1>
              <p className="text-sm text-muted-foreground mt-1">
                {DEPARTMENTS.length} departments · {totalDoctors} doctors · {totalOP} OP today · {totalIP} IP admitted
              </p>
            </div>
            <div className="relative w-full lg:w-80">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                placeholder="Search departments, doctors..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-10 h-10"
              />
            </div>
          </div>

          {/* Departments Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
            {filteredDepartments.map((dept) => {
              const Icon = dept.icon;
              return (
                <Card
                  key={dept.id}
                  className="group cursor-pointer overflow-hidden border hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
                  onClick={() => navigate(`/departments/${dept.id}`)}
                >
                  {/* Top Gradient Bar */}
                  <div className={`h-1.5 bg-gradient-to-r ${dept.accentColor}`} />
                  
                  <div className="p-5">
                    {/* Header Row */}
                    <div className="flex items-start gap-4 mb-4">
                      <div className={`${dept.iconBg} p-3 rounded-xl shrink-0`}>
                        <Icon className={`w-6 h-6 ${dept.iconColor}`} strokeWidth={1.5} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="text-base font-semibold text-foreground group-hover:text-primary transition-colors">
                          {dept.name}
                        </h3>
                        <p className="text-xs text-muted-foreground mt-0.5">
                          {dept.description}
                        </p>
                      </div>
                      <ChevronRight className="w-5 h-5 text-muted-foreground/50 group-hover:text-primary group-hover:translate-x-1 transition-all shrink-0 mt-1" />
                    </div>

                    {/* Department Head */}
                    <div className="flex items-center gap-2 mb-4 pb-4 border-b border-border">
                      <div className="w-7 h-7 rounded-full bg-muted flex items-center justify-center">
                        <UserRound className="w-4 h-4 text-muted-foreground" />
                      </div>
                      <div>
                        <p className="text-sm font-medium text-foreground">{dept.headDoctor}</p>
                        <p className="text-[10px] text-muted-foreground uppercase tracking-wide">Head of Department</p>
                      </div>
                    </div>

                    {/* Stats Row */}
                    <div className="grid grid-cols-4 gap-2">
                      <div className={`${dept.lightBg} rounded-lg p-2.5 text-center`}>
                        <div className="flex justify-center mb-1">
                          <Users className={`w-4 h-4 ${dept.iconColor}`} />
                        </div>
                        <div className="text-lg font-bold text-foreground leading-none">{dept.doctorsCount}</div>
                        <div className="text-[9px] text-muted-foreground mt-1 uppercase">Doctors</div>
                      </div>
                      <div className="bg-blue-50 dark:bg-blue-950/30 rounded-lg p-2.5 text-center">
                        <div className="flex justify-center mb-1">
                          <Cross className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                        </div>
                        <div className="text-lg font-bold text-blue-600 dark:text-blue-400 leading-none">{dept.outpatientCount}</div>
                        <div className="text-[9px] text-muted-foreground mt-1 uppercase">OP</div>
                      </div>
                      <div className="bg-amber-50 dark:bg-amber-950/30 rounded-lg p-2.5 text-center">
                        <div className="flex justify-center mb-1">
                          <BedDouble className="w-4 h-4 text-amber-600 dark:text-amber-400" />
                        </div>
                        <div className="text-lg font-bold text-amber-600 dark:text-amber-400 leading-none">{dept.inpatientCount}</div>
                        <div className="text-[9px] text-muted-foreground mt-1 uppercase">IP</div>
                      </div>
                      <div className="bg-slate-100 dark:bg-slate-800/50 rounded-lg p-2.5 text-center">
                        <div className="flex justify-center mb-1">
                          <Timer className="w-4 h-4 text-slate-600 dark:text-slate-400" />
                        </div>
                        <div className="text-lg font-bold text-foreground leading-none">{dept.avgWaitTime}<span className="text-[10px] font-normal">m</span></div>
                        <div className="text-[9px] text-muted-foreground mt-1 uppercase">Wait</div>
                      </div>
                    </div>
                  </div>
                </Card>
              );
            })}
          </div>

          {filteredDepartments.length === 0 && (
            <div className="text-center py-12 text-muted-foreground">
              No departments found matching "{search}"
            </div>
          )}
        </main>
      </PageContent>
    </div>
  );
}
