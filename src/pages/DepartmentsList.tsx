import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { AppSidebar } from "@/components/AppSidebar";
import { AppHeader } from "@/components/AppHeader";
import { PageContent } from "@/components/PageContent";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { 
  Search, 
  Users, 
  UserRound, 
  Bed, 
  Clock, 
  ChevronRight,
  Heart,
  Brain,
  Bone,
  Stethoscope,
  Activity,
  Baby,
  Phone,
  MapPin
} from "lucide-react";

const DEPARTMENTS = [
  {
    id: "cardiology",
    name: "Cardiology",
    description: "Heart and cardiovascular system disorders",
    headDoctor: "Dr. Priya Sharma",
    headDoctorPhone: "+91 98765 43210",
    location: "Building A, Floor 3",
    icon: Heart,
    color: "bg-rose-500",
    bgColor: "bg-rose-50",
    doctorsCount: 8,
    outpatientCount: 145,
    inpatientCount: 23,
    avgWaitTime: 18,
    opHours: "8:00 AM - 6:00 PM",
    status: "Active",
  },
  {
    id: "orthopedics",
    name: "Orthopedics",
    description: "Musculoskeletal system including bones and joints",
    headDoctor: "Dr. Aisha Khan",
    headDoctorPhone: "+91 98765 43211",
    location: "Building B, Floor 2",
    icon: Bone,
    color: "bg-amber-500",
    bgColor: "bg-amber-50",
    doctorsCount: 6,
    outpatientCount: 98,
    inpatientCount: 15,
    avgWaitTime: 22,
    opHours: "8:00 AM - 5:00 PM",
    status: "Active",
  },
  {
    id: "neurology",
    name: "Neurology",
    description: "Brain, spinal cord, and nervous system disorders",
    headDoctor: "Dr. Meera Reddy",
    headDoctorPhone: "+91 98765 43212",
    location: "Building A, Floor 4",
    icon: Brain,
    color: "bg-purple-500",
    bgColor: "bg-purple-50",
    doctorsCount: 5,
    outpatientCount: 67,
    inpatientCount: 8,
    avgWaitTime: 25,
    opHours: "9:00 AM - 5:00 PM",
    status: "Active",
  },
  {
    id: "general-medicine",
    name: "General Medicine",
    description: "Primary care and general health issues",
    headDoctor: "Dr. Vikram Singh",
    headDoctorPhone: "+91 98765 43213",
    location: "Building A, Floor 1",
    icon: Stethoscope,
    color: "bg-blue-500",
    bgColor: "bg-blue-50",
    doctorsCount: 12,
    outpatientCount: 234,
    inpatientCount: 45,
    avgWaitTime: 15,
    opHours: "7:00 AM - 8:00 PM",
    status: "Active",
  },
  {
    id: "endocrinology",
    name: "Endocrinology",
    description: "Hormonal disorders including diabetes and thyroid",
    headDoctor: "Dr. Rahul Mehta",
    headDoctorPhone: "+91 98765 43214",
    location: "Building C, Floor 2",
    icon: Activity,
    color: "bg-teal-500",
    bgColor: "bg-teal-50",
    doctorsCount: 4,
    outpatientCount: 89,
    inpatientCount: 5,
    avgWaitTime: 20,
    opHours: "9:00 AM - 4:00 PM",
    status: "Active",
  },
  {
    id: "pediatrics",
    name: "Pediatrics",
    description: "Medical care for infants, children, and adolescents",
    headDoctor: "Dr. Kavitha Menon",
    headDoctorPhone: "+91 98765 43215",
    location: "Building B, Floor 1",
    icon: Baby,
    color: "bg-pink-500",
    bgColor: "bg-pink-50",
    doctorsCount: 7,
    outpatientCount: 156,
    inpatientCount: 18,
    avgWaitTime: 12,
    opHours: "8:00 AM - 7:00 PM",
    status: "Active",
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
          {/* Header with Stats */}
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
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
            {filteredDepartments.map((dept) => {
              const Icon = dept.icon;
              return (
                <Card
                  key={dept.id}
                  className="overflow-hidden cursor-pointer hover:shadow-lg transition-all duration-200 group border-l-4"
                  style={{ borderLeftColor: dept.color.replace('bg-', '').includes('-') ? undefined : undefined }}
                  onClick={() => navigate(`/departments/${dept.id}`)}
                >
                  {/* Header with Icon */}
                  <div className={`${dept.bgColor} px-5 py-4 border-b border-border/50`}>
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-3">
                        <div className={`${dept.color} p-2.5 rounded-lg text-white shadow-sm`}>
                          <Icon className="w-5 h-5" />
                        </div>
                        <div>
                          <h3 className="text-lg font-semibold text-foreground group-hover:text-primary transition-colors">
                            {dept.name}
                          </h3>
                          <p className="text-xs text-muted-foreground mt-0.5 line-clamp-1">
                            {dept.description}
                          </p>
                        </div>
                      </div>
                      <Badge variant="secondary" className="text-[10px] bg-white/80">
                        {dept.status}
                      </Badge>
                    </div>
                  </div>

                  {/* Content */}
                  <div className="p-5 space-y-4">
                    {/* Department Head */}
                    <div className="flex items-center gap-3 p-3 bg-muted/30 rounded-lg">
                      <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                        <UserRound className="w-5 h-5 text-primary" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-foreground truncate">{dept.headDoctor}</p>
                        <p className="text-xs text-muted-foreground">Department Head</p>
                      </div>
                      <Button variant="ghost" size="icon" className="h-8 w-8 shrink-0">
                        <Phone className="w-3.5 h-3.5" />
                      </Button>
                    </div>

                    {/* Stats Grid */}
                    <div className="grid grid-cols-4 gap-1">
                      <div className="text-center p-2 rounded-lg hover:bg-muted/50 transition-colors">
                        <div className="text-lg font-bold text-foreground">{dept.doctorsCount}</div>
                        <div className="text-[10px] text-muted-foreground uppercase tracking-wide">Doctors</div>
                      </div>
                      <div className="text-center p-2 rounded-lg hover:bg-muted/50 transition-colors">
                        <div className="text-lg font-bold text-blue-600">{dept.outpatientCount}</div>
                        <div className="text-[10px] text-muted-foreground uppercase tracking-wide">OP Today</div>
                      </div>
                      <div className="text-center p-2 rounded-lg hover:bg-muted/50 transition-colors">
                        <div className="text-lg font-bold text-amber-600">{dept.inpatientCount}</div>
                        <div className="text-[10px] text-muted-foreground uppercase tracking-wide">IP Now</div>
                      </div>
                      <div className="text-center p-2 rounded-lg hover:bg-muted/50 transition-colors">
                        <div className="text-lg font-bold text-foreground">{dept.avgWaitTime}<span className="text-xs font-normal">m</span></div>
                        <div className="text-[10px] text-muted-foreground uppercase tracking-wide">Avg Wait</div>
                      </div>
                    </div>

                    {/* Footer Info */}
                    <div className="flex items-center justify-between pt-3 border-t border-border">
                      <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                        <MapPin className="w-3 h-3" />
                        <span>{dept.location}</span>
                      </div>
                      <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                        <Clock className="w-3 h-3" />
                        <span>{dept.opHours}</span>
                      </div>
                    </div>
                  </div>

                  {/* View Details Footer */}
                  <div className="px-5 py-3 bg-muted/30 border-t border-border flex items-center justify-between group-hover:bg-primary/5 transition-colors">
                    <span className="text-xs font-medium text-muted-foreground group-hover:text-primary transition-colors">
                      View Department Details
                    </span>
                    <ChevronRight className="w-4 h-4 text-muted-foreground group-hover:text-primary group-hover:translate-x-0.5 transition-all" />
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
