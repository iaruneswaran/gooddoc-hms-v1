import { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { AppSidebar } from "@/components/AppSidebar";
import { AppHeader } from "@/components/AppHeader";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Search, Download, MoreVertical, UserPen, User, Eye, CalendarPlus } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

// Mock data for patient registry
const PATIENTS = [
  {
    id: "P-0001",
    name: "Anaya Shah",
    age: 34,
    gender: "Female",
    phone: "98XXXXXX21",
    email: "anaya@email.com",
    address: "Mumbai",
    bloodGroup: "O+",
    registeredDate: "14-Dec-2025",
    status: "Active" as const,
  },
  {
    id: "P-0002",
    name: "Rahul Verma",
    age: 45,
    gender: "Male",
    phone: "97XXXXXX54",
    email: "rahul@email.com",
    address: "Delhi",
    bloodGroup: "B+",
    registeredDate: "12-Dec-2025",
    status: "Active" as const,
  },
  {
    id: "P-0003",
    name: "Sana Ali",
    age: 29,
    gender: "Female",
    phone: "96XXXXXX87",
    email: "sana@email.com",
    address: "Bengaluru",
    bloodGroup: "A+",
    registeredDate: "10-Dec-2025",
    status: "Inactive" as const,
  },
  {
    id: "P-0004",
    name: "Arjun Patel",
    age: 52,
    gender: "Male",
    phone: "99XXXXXX34",
    email: "arjun@email.com",
    address: "Ahmedabad",
    bloodGroup: "AB+",
    registeredDate: "09-Dec-2025",
    status: "Active" as const,
  },
  {
    id: "P-0005",
    name: "Meera Nair",
    age: 41,
    gender: "Female",
    phone: "95XXXXXX66",
    email: "meera@email.com",
    address: "Kochi",
    bloodGroup: "O−",
    registeredDate: "08-Dec-2025",
    status: "Active" as const,
  },
  {
    id: "P-0006",
    name: "Vikram Singh",
    age: 36,
    gender: "Male",
    phone: "94XXXXXX19",
    email: "vikram@email.com",
    address: "Jaipur",
    bloodGroup: "B−",
    registeredDate: "07-Dec-2025",
    status: "Active" as const,
  },
  {
    id: "P-0007",
    name: "Priya Iyer",
    age: 27,
    gender: "Female",
    phone: "93XXXXXX72",
    email: "priya@email.com",
    address: "Chennai",
    bloodGroup: "A−",
    registeredDate: "06-Dec-2025",
    status: "Active" as const,
  },
  {
    id: "P-0008",
    name: "Mohit Agarwal",
    age: 60,
    gender: "Male",
    phone: "92XXXXXX58",
    email: "mohit@email.com",
    address: "Kolkata",
    bloodGroup: "O+",
    registeredDate: "05-Dec-2025",
    status: "Inactive" as const,
  },
  {
    id: "P-0009",
    name: "Neha Kulkarni",
    age: 33,
    gender: "Female",
    phone: "91XXXXXX44",
    email: "neha@email.com",
    address: "Pune",
    bloodGroup: "B+",
    registeredDate: "04-Dec-2025",
    status: "Active" as const,
  },
  {
    id: "P-0010",
    name: "Ramesh Rao",
    age: 48,
    gender: "Male",
    phone: "90XXXXXX11",
    email: "ramesh@email.com",
    address: "Hyderabad",
    bloodGroup: "A+",
    registeredDate: "03-Dec-2025",
    status: "Active" as const,
  },
];

type Patient = typeof PATIENTS[number];

export default function Patients() {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");

  const filteredPatients = useMemo(() => {
    return PATIENTS.filter((patient) => {
      const matchesSearch =
        patient.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        patient.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
        patient.phone.includes(searchQuery) ||
        patient.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
        patient.address.toLowerCase().includes(searchQuery.toLowerCase());

      return matchesSearch;
    });
  }, [searchQuery]);

  return (
    <div className="flex min-h-screen bg-background">
      <AppSidebar />

      <div className="flex-1 ml-[196px]">
        <AppHeader breadcrumbs={["Patients"]} />

        <main className="p-6">
          <Card className="p-6 mb-6">
            <div className="flex items-center justify-between">
              <h1 className="text-lg font-semibold text-foreground">Patients</h1>
              <div className="flex items-center gap-3">
                <Button variant="outline" className="gap-2">
                  <Download className="w-4 h-4" />
                  Export
                </Button>
                <Button onClick={() => navigate("/vitals/new")} className="gap-2">
                  Record Vitals
                </Button>
              </div>
            </div>
          </Card>

          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-2 border-b border-border pb-0">
              <div className="px-4 py-3 text-sm font-medium text-primary border-b-2 border-primary">
                All Patients
              </div>
            </div>
            <div className="relative w-64">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none" />
              <Input
                placeholder="Search by name, ID, email..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9 h-9"
              />
            </div>
          </div>

          <div className="bg-card rounded-lg border border-border overflow-hidden w-full">
            <div className="grid grid-cols-[1fr_1.5fr_0.5fr_0.8fr_1.2fr_1.8fr_1fr_0.8fr_1.2fr_0.8fr_60px] gap-4 px-4 py-3 border-b border-border bg-muted/30 box-border">
              <div className="text-xs font-medium text-muted-foreground">Patient ID</div>
              <div className="text-xs font-medium text-muted-foreground">Full Name</div>
              <div className="text-xs font-medium text-muted-foreground">Age</div>
              <div className="text-xs font-medium text-muted-foreground">Gender</div>
              <div className="text-xs font-medium text-muted-foreground">Phone Number</div>
              <div className="text-xs font-medium text-muted-foreground">Email</div>
              <div className="text-xs font-medium text-muted-foreground">Address</div>
              <div className="text-xs font-medium text-muted-foreground">Blood Group</div>
              <div className="text-xs font-medium text-muted-foreground">Registered Date</div>
              <div className="text-xs font-medium text-muted-foreground">Status</div>
              <div className="text-xs font-medium text-muted-foreground text-center">Action</div>
            </div>
            {filteredPatients.map((patient) => (
              <div
                key={patient.id}
                className="grid grid-cols-[1fr_1.5fr_0.5fr_0.8fr_1.2fr_1.8fr_1fr_0.8fr_1.2fr_0.8fr_60px] gap-4 px-4 py-4 items-center hover:bg-muted/20 transition-colors border-b border-border last:border-b-0 box-border"
              >
                <div className="text-sm font-medium text-foreground truncate">{patient.id}</div>
                <div className="text-sm text-foreground truncate">{patient.name}</div>
                <div className="text-sm text-foreground">{patient.age}</div>
                <div className="text-sm text-foreground truncate">{patient.gender}</div>
                <div className="text-sm text-foreground truncate">{patient.phone}</div>
                <div className="text-sm text-foreground truncate">{patient.email}</div>
                <div className="text-sm text-foreground truncate">{patient.address}</div>
                <div className="text-sm text-foreground">{patient.bloodGroup}</div>
                <div className="text-sm text-foreground truncate">{patient.registeredDate}</div>
                <div>
                  <Badge
                    variant={patient.status === "Active" ? "default" : "secondary"}
                    className={patient.status === "Active" ? "bg-green-100 text-green-700 hover:bg-green-100" : "bg-muted text-muted-foreground"}
                  >
                    {patient.status}
                  </Badge>
                </div>
                <div className="flex justify-center">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon" className="h-8 w-8">
                        <MoreVertical className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem onClick={() => navigate(`/patients/${patient.id}/edit`)}>
                        <UserPen className="mr-2 h-4 w-4" />
                        Edit Patient Info
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => navigate(`/patient-360/${patient.id}`)}>
                        <User className="mr-2 h-4 w-4" />
                        Patient 360
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => navigate(`/patient-insights/${patient.id}`)}>
                        <Eye className="mr-2 h-4 w-4" />
                        Patient Insight
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => navigate(`/book-appointment?patient=${patient.id}`)}>
                        <CalendarPlus className="mr-2 h-4 w-4" />
                        Book Appointment
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </div>
            ))}
            {filteredPatients.length === 0 && (
              <div className="text-center py-12 text-muted-foreground text-sm">No patients found</div>
            )}
          </div>
        </main>
      </div>
    </div>
  );
}