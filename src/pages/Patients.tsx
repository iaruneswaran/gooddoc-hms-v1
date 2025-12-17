import { useState, useMemo, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { AppSidebar } from "@/components/AppSidebar";
import { AppHeader } from "@/components/AppHeader";
import { PageContent } from "@/components/PageContent";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Download, MoreVertical, Pencil, Eye, CalendarPlus, User } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { EditPatientModal } from "@/components/patients/EditPatientModal";
import { toast } from "@/hooks/use-toast";

// Mock data for patient registry
const PATIENTS = [
  {
    id: "GDID-001",
    name: "Harish Kalyan",
    age: 35,
    gender: "Male",
    phone: "+91 98765 43210",
    email: "9876543210@gooddoc.app",
    address: "Chennai",
    bloodGroup: "O+",
    registeredDate: "14-Dec-2025",
    status: "IP" as const,
  },
  {
    id: "P-0002",
    name: "Rahul Verma",
    age: 45,
    gender: "Male",
    phone: "+91 97XXXXXX54",
    email: "rahul@email.com",
    address: "Delhi",
    bloodGroup: "B+",
    registeredDate: "12-Dec-2025",
    status: "OP" as const,
  },
  {
    id: "P-0003",
    name: "Sana Ali",
    age: 29,
    gender: "Female",
    phone: "+91 96XXXXXX87",
    email: "sana@email.com",
    address: "Bengaluru",
    bloodGroup: "A+",
    registeredDate: "10-Dec-2025",
    status: "OP" as const,
  },
  {
    id: "P-0004",
    name: "Arjun Patel",
    age: 52,
    gender: "Male",
    phone: "+91 99XXXXXX34",
    email: "arjun@email.com",
    address: "Ahmedabad",
    bloodGroup: "AB+",
    registeredDate: "09-Dec-2025",
    status: "IP" as const,
  },
  {
    id: "P-0005",
    name: "Meera Nair",
    age: 41,
    gender: "Female",
    phone: "+91 95XXXXXX66",
    email: "meera@email.com",
    address: "Kochi",
    bloodGroup: "O−",
    registeredDate: "08-Dec-2025",
    status: "OP" as const,
  },
  {
    id: "P-0006",
    name: "Vikram Singh",
    age: 36,
    gender: "Male",
    phone: "+91 94XXXXXX19",
    email: "vikram@email.com",
    address: "Jaipur",
    bloodGroup: "B−",
    registeredDate: "07-Dec-2025",
    status: "OP" as const,
  },
  {
    id: "P-0007",
    name: "Priya Iyer",
    age: 27,
    gender: "Female",
    phone: "+91 93XXXXXX72",
    email: "priya@email.com",
    address: "Chennai",
    bloodGroup: "A−",
    registeredDate: "06-Dec-2025",
    status: "IP" as const,
  },
  {
    id: "P-0008",
    name: "Mohit Agarwal",
    age: 60,
    gender: "Male",
    phone: "+91 92XXXXXX58",
    email: "mohit@email.com",
    address: "Kolkata",
    bloodGroup: "O+",
    registeredDate: "05-Dec-2025",
    status: "OP" as const,
  },
  {
    id: "P-0009",
    name: "Neha Kulkarni",
    age: 33,
    gender: "Female",
    phone: "+91 91XXXXXX44",
    email: "neha@email.com",
    address: "Pune",
    bloodGroup: "B+",
    registeredDate: "04-Dec-2025",
    status: "IP" as const,
  },
  {
    id: "P-0010",
    name: "Ramesh Rao",
    age: 48,
    gender: "Male",
    phone: "+91 90XXXXXX11",
    email: "ramesh@email.com",
    address: "Hyderabad",
    bloodGroup: "A+",
    registeredDate: "03-Dec-2025",
    status: "OP" as const,
  },
];

type Patient = typeof PATIENTS[number];

export default function Patients() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const initialSearch = searchParams.get("search") || "";
  const [searchQuery, setSearchQuery] = useState(initialSearch);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [selectedPatient, setSelectedPatient] = useState<Patient | null>(null);
  const [patients, setPatients] = useState(PATIENTS);
  const [genderFilter, setGenderFilter] = useState("all");
  const [bloodGroupFilter, setBloodGroupFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");

  // Sync search query with URL parameter
  useEffect(() => {
    const urlSearch = searchParams.get("search") || "";
    if (urlSearch !== searchQuery) {
      setSearchQuery(urlSearch);
    }
  }, [searchParams]);

  // Get unique filter options
  const filterOptions = useMemo(() => {
    const genders = [...new Set(patients.map(p => p.gender))];
    const bloodGroups = [...new Set(patients.map(p => p.bloodGroup))];
    const statuses = [...new Set(patients.map(p => p.status))];
    return { genders, bloodGroups, statuses };
  }, [patients]);

  const filteredPatients = useMemo(() => {
    return patients.filter((patient) => {
      const matchesSearch =
        patient.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        patient.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
        patient.phone.includes(searchQuery) ||
        patient.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
        patient.address.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesGender = genderFilter === "all" || patient.gender === genderFilter;
      const matchesBloodGroup = bloodGroupFilter === "all" || patient.bloodGroup === bloodGroupFilter;
      const matchesStatus = statusFilter === "all" || patient.status === statusFilter;

      return matchesSearch && matchesGender && matchesBloodGroup && matchesStatus;
    });
  }, [searchQuery, patients, genderFilter, bloodGroupFilter, statusFilter]);

  const handleEditPatient = (patient: Patient) => {
    setSelectedPatient(patient);
    setEditModalOpen(true);
  };

  const handleSavePatient = (updatedPatient: Patient) => {
    setPatients((prev) =>
      prev.map((p) => (p.id === updatedPatient.id ? updatedPatient : p))
    );
    toast({
      title: "Patient updated",
      description: "Patient information has been saved successfully.",
    });
  };

  const handlePatientInsight = (patient: Patient) => {
    navigate(`/patient-insights/${patient.id}?from=patients`);
  };

  const handleBookAppointment = (patient: Patient) => {
    navigate(`/book-appointment?from=patients&patientId=${patient.id}`);
  };

  const handlePatient360 = (patient: Patient) => {
    navigate(`/patients/${patient.id}/360?from=patients`);
  };

  return (
    <div className="flex min-h-screen bg-background">
      <AppSidebar />

      <PageContent>
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

          <div className="flex items-center justify-start mb-6">
            <div className="flex items-center gap-3">
              <Select value={genderFilter} onValueChange={setGenderFilter}>
                <SelectTrigger className="w-[140px] h-9">
                  <SelectValue placeholder="All Genders" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Genders</SelectItem>
                  {filterOptions.genders.map((gender) => (
                    <SelectItem key={gender} value={gender}>{gender}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Select value={bloodGroupFilter} onValueChange={setBloodGroupFilter}>
                <SelectTrigger className="w-[140px] h-9">
                  <SelectValue placeholder="All Blood Groups" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Blood Groups</SelectItem>
                  {filterOptions.bloodGroups.map((bg) => (
                    <SelectItem key={bg} value={bg}>{bg}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-[120px] h-9">
                  <SelectValue placeholder="All Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  {filterOptions.statuses.map((status) => (
                    <SelectItem key={status} value={status}>{status}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="bg-card rounded-lg border border-border overflow-hidden w-full">
            <div className="grid grid-cols-[0.8fr_1.2fr_0.4fr_0.6fr_1fr_1.2fr_0.8fr_0.6fr_0.8fr_0.6fr_0.4fr] gap-4 px-4 py-3 border-b border-border bg-muted/30 w-full">
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
              <div className="text-xs font-medium text-muted-foreground text-right">Action</div>
            </div>
            {filteredPatients.map((patient) => (
              <div
                key={patient.id}
                className="grid grid-cols-[0.8fr_1.2fr_0.4fr_0.6fr_1fr_1.2fr_0.8fr_0.6fr_0.8fr_0.6fr_0.4fr] gap-4 px-4 py-4 items-center hover:bg-muted/20 transition-colors border-b border-border last:border-b-0 w-full"
              >
                <div className="text-sm font-medium text-foreground truncate">{patient.id}</div>
                <div 
                  className="text-sm text-foreground truncate cursor-pointer hover:text-primary hover:underline"
                  onClick={() => handlePatientInsight(patient)}
                  role="button"
                  tabIndex={0}
                  onKeyDown={(e) => e.key === 'Enter' && handlePatientInsight(patient)}
                >
                  {patient.name}
                </div>
                <div className="text-sm text-foreground">{patient.age}</div>
                <div className="text-sm text-foreground truncate">{patient.gender}</div>
                <div className="text-sm text-foreground truncate">{patient.phone}</div>
                <div className="text-sm text-foreground truncate">{patient.email}</div>
                <div className="text-sm text-foreground truncate">{patient.address}</div>
                <div className="text-sm text-foreground">{patient.bloodGroup}</div>
                <div className="text-sm text-foreground truncate">{patient.registeredDate}</div>
                <div>
                  <Badge
                    variant={patient.status === "IP" ? "default" : "secondary"}
                    className={patient.status === "IP" ? "bg-blue-100 text-blue-700 hover:bg-blue-100" : "bg-green-100 text-green-700 hover:bg-green-100"}
                  >
                    {patient.status}
                  </Badge>
                </div>
                <div className="flex justify-end">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon" className="h-8 w-8">
                        <MoreVertical className="w-4 h-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="w-48 bg-popover z-50">
                      <DropdownMenuItem onClick={() => handleEditPatient(patient)} className="gap-2 cursor-pointer">
                        <Pencil className="w-4 h-4" />
                        Edit Patient Info
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => handlePatient360(patient)} className="gap-2 cursor-pointer">
                        <User className="w-4 h-4" />
                        Patient 360
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => handlePatientInsight(patient)} className="gap-2 cursor-pointer">
                        <Eye className="w-4 h-4" />
                        Patient Insight
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => handleBookAppointment(patient)} className="gap-2 cursor-pointer">
                        <CalendarPlus className="w-4 h-4" />
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
      </PageContent>

      <EditPatientModal
        open={editModalOpen}
        onOpenChange={setEditModalOpen}
        patient={selectedPatient}
        onSave={handleSavePatient}
      />
    </div>
  );
}
