import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { AppSidebar } from "@/components/AppSidebar";
import { AppHeader } from "@/components/AppHeader";
import { PageContent } from "@/components/PageContent";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Search, Users, UserRound, Bed, Clock, ChevronRight } from "lucide-react";

const DEPARTMENTS = [
  {
    id: "cardiology",
    name: "Cardiology",
    description: "Heart and cardiovascular system disorders",
    headDoctor: "Dr. Priya Sharma",
    doctorsCount: 8,
    outpatientCount: 145,
    inpatientCount: 23,
    avgWaitTime: "18 min",
  },
  {
    id: "orthopedics",
    name: "Orthopedics",
    description: "Musculoskeletal system including bones and joints",
    headDoctor: "Dr. Aisha Khan",
    doctorsCount: 6,
    outpatientCount: 98,
    inpatientCount: 15,
    avgWaitTime: "22 min",
  },
  {
    id: "neurology",
    name: "Neurology",
    description: "Brain, spinal cord, and nervous system disorders",
    headDoctor: "Dr. Meera Reddy",
    doctorsCount: 5,
    outpatientCount: 67,
    inpatientCount: 8,
    avgWaitTime: "25 min",
  },
  {
    id: "general-medicine",
    name: "General Medicine",
    description: "Primary care and general health issues",
    headDoctor: "Dr. Vikram Singh",
    doctorsCount: 12,
    outpatientCount: 234,
    inpatientCount: 45,
    avgWaitTime: "15 min",
  },
  {
    id: "endocrinology",
    name: "Endocrinology",
    description: "Hormonal disorders including diabetes and thyroid",
    headDoctor: "Dr. Rahul Mehta",
    doctorsCount: 4,
    outpatientCount: 89,
    inpatientCount: 5,
    avgWaitTime: "20 min",
  },
  {
    id: "pediatrics",
    name: "Pediatrics",
    description: "Medical care for infants, children, and adolescents",
    headDoctor: "Dr. Kavitha Menon",
    doctorsCount: 7,
    outpatientCount: 156,
    inpatientCount: 18,
    avgWaitTime: "12 min",
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

  return (
    <div className="min-h-screen flex w-full bg-background">
      <AppSidebar />
      <PageContent>
        <AppHeader breadcrumbs={["Departments"]} />

        <main className="p-6 space-y-6">
          {/* Header */}
          <Card className="p-6">
            <div className="flex items-center justify-between">
              <h1 className="text-lg font-semibold text-foreground">Departments</h1>
              <div className="relative w-72">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  placeholder="Search departments..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="pl-10 h-9"
                />
              </div>
            </div>
          </Card>

          {/* Departments Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredDepartments.map((dept) => (
              <Card
                key={dept.id}
                className="p-5 cursor-pointer hover:shadow-md transition-shadow group"
                onClick={() => navigate(`/departments/${dept.id}`)}
              >
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <h3 className="text-base font-semibold text-foreground group-hover:text-primary transition-colors">
                      {dept.name}
                    </h3>
                    <p className="text-xs text-muted-foreground mt-0.5">{dept.description}</p>
                  </div>
                  <ChevronRight className="w-5 h-5 text-muted-foreground group-hover:text-primary transition-colors" />
                </div>

                <div className="text-xs text-muted-foreground mb-3">
                  Head: <span className="text-foreground">{dept.headDoctor}</span>
                </div>

                <div className="grid grid-cols-4 gap-2 pt-3 border-t border-border">
                  <div className="text-center">
                    <div className="flex items-center justify-center gap-1 text-muted-foreground mb-1">
                      <UserRound className="w-3 h-3" />
                    </div>
                    <div className="text-sm font-semibold text-foreground">{dept.doctorsCount}</div>
                    <div className="text-[10px] text-muted-foreground">Doctors</div>
                  </div>
                  <div className="text-center">
                    <div className="flex items-center justify-center gap-1 text-muted-foreground mb-1">
                      <Users className="w-3 h-3" />
                    </div>
                    <div className="text-sm font-semibold text-foreground">{dept.outpatientCount}</div>
                    <div className="text-[10px] text-muted-foreground">OP</div>
                  </div>
                  <div className="text-center">
                    <div className="flex items-center justify-center gap-1 text-muted-foreground mb-1">
                      <Bed className="w-3 h-3" />
                    </div>
                    <div className="text-sm font-semibold text-foreground">{dept.inpatientCount}</div>
                    <div className="text-[10px] text-muted-foreground">IP</div>
                  </div>
                  <div className="text-center">
                    <div className="flex items-center justify-center gap-1 text-muted-foreground mb-1">
                      <Clock className="w-3 h-3" />
                    </div>
                    <div className="text-sm font-semibold text-foreground">{dept.avgWaitTime}</div>
                    <div className="text-[10px] text-muted-foreground">Wait</div>
                  </div>
                </div>
              </Card>
            ))}
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
