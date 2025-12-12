import { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { AppSidebar } from "@/components/AppSidebar";
import { AppHeader } from "@/components/AppHeader";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Search, User, Download, Phone, Mail, Building2, Calendar } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

// Mock data for all patients with unified structure
const mockPatients = [
  {
    id: "1",
    name: "Harish Kalyan",
    gdid: "001",
    age: 35,
    gender: "M",
    phone: "+91 98765 43210",
    email: "9876543210@gooddoc.app",
    type: "IP" as const,
    visitId: "VST-205431",
    visitPurpose: "Admitted",
    admissionTime: "03 Aug 2025, 10:30 AM",
    ward: "Cardiology Ward 3B",
    room: "312",
    bed: "12",
    los: "2d",
    doctor: "Dr. Meera Nair",
    specialty: "Cardiology",
    vitals: null,
    isActive: true,
  },
  {
    id: "2",
    name: "Priya Sharma",
    gdid: "006",
    age: 42,
    gender: "F",
    phone: "+91 98765 43211",
    email: "9876543211@gooddoc.app",
    type: "IP" as const,
    visitId: "VST-205432",
    visitPurpose: "Admitted",
    admissionTime: "02 Aug 2025, 02:15 PM",
    ward: "General Medicine Ward 2A",
    room: "208",
    bed: "5",
    los: "3d",
    doctor: "Dr. Rajesh Kumar",
    specialty: "Endocrinology",
    vitals: null,
    isActive: true,
  },
  {
    id: "3",
    name: "Arun Patel",
    gdid: "007",
    age: 55,
    gender: "M",
    phone: "+91 98765 43212",
    email: "9876543212@gooddoc.app",
    type: "IP" as const,
    visitId: "VST-205433",
    visitPurpose: "Admitted",
    admissionTime: "04 Aug 2025, 08:45 AM",
    ward: "Orthopedics Ward 1C",
    room: "115",
    bed: "3",
    los: "1d",
    doctor: "Dr. Anita Singh",
    specialty: "Orthopedics",
    vitals: null,
    isActive: true,
  },
  {
    id: "4",
    name: "Kavya Iyer",
    gdid: "008",
    age: 29,
    gender: "F",
    phone: "+91 98765 43213",
    email: "9876543213@gooddoc.app",
    type: "IP" as const,
    visitId: "VST-205434",
    visitPurpose: "Admitted",
    admissionTime: "01 Aug 2025, 06:20 PM",
    ward: "Dermatology Ward 4A",
    room: "402",
    bed: "8",
    los: "4d",
    doctor: "Dr. Sunil Reddy",
    specialty: "Dermatology",
    vitals: null,
    isActive: true,
  },
  {
    id: "5",
    name: "Ravi Kumar",
    gdid: "012",
    age: 48,
    gender: "M",
    phone: "+91 98765 43214",
    email: "9876543214@gooddoc.app",
    type: "OP" as const,
    visitId: "VST-205435",
    visitPurpose: "Follow-up",
    appointmentDate: "12 Aug 2025, 10:00 AM",
    appointmentType: "Follow-up",
    appointmentStatus: "Confirmed",
    doctor: "Dr. Meera Nair",
    specialty: "Cardiology",
    vitals: { bp: "120/80", spo2: 98, hr: 72, rr: 16, temp: 37 },
    pastVisits: 5,
    isActive: true,
  },
  {
    id: "6",
    name: "Sunita Menon",
    gdid: "015",
    age: 34,
    gender: "F",
    phone: "+91 98765 43215",
    email: "9876543215@gooddoc.app",
    type: "OP" as const,
    visitId: "VST-205436",
    visitPurpose: "Consultation",
    appointmentDate: "08 Aug 2025, 11:30 AM",
    appointmentType: "Consultation",
    appointmentStatus: "Pending",
    doctor: "Dr. Rajesh Kumar",
    specialty: "Endocrinology",
    vitals: { bp: "130/85", spo2: 97, hr: 78, rr: 18, temp: 36.8 },
    pastVisits: 8,
    isActive: true,
  },
  {
    id: "7",
    name: "Mohan Das",
    gdid: "018",
    age: 62,
    gender: "M",
    phone: "+91 98765 43216",
    email: "9876543216@gooddoc.app",
    type: "OP" as const,
    visitId: "VST-205437",
    visitPurpose: "Review",
    appointmentDate: "10 Aug 2025, 09:00 AM",
    appointmentType: "Review",
    appointmentStatus: "Confirmed",
    doctor: "Dr. Anita Singh",
    specialty: "Orthopedics",
    vitals: { bp: "140/90", spo2: 96, hr: 68, rr: 14, temp: 37.2 },
    pastVisits: 12,
    isActive: true,
  },
  {
    id: "8",
    name: "Lakshmi Nair",
    gdid: "022",
    age: 41,
    gender: "F",
    phone: "+91 98765 43217",
    email: "9876543217@gooddoc.app",
    type: "OP" as const,
    visitId: null,
    visitPurpose: "New Visit",
    appointmentDate: null,
    appointmentType: "New Visit",
    appointmentStatus: "Not Scheduled",
    doctor: "Dr. Sunil Reddy",
    specialty: "Dermatology",
    vitals: { bp: "118/76", spo2: 99, hr: 70, rr: 15, temp: 36.6 },
    pastVisits: 3,
    isActive: false,
  },
];

type Patient = typeof mockPatients[number];

export default function Patients() {
  const navigate = useNavigate();
  const [selectedTab, setSelectedTab] = useState("active");
  const [searchQuery, setSearchQuery] = useState("");
  const [doctorFilter, setDoctorFilter] = useState("all");
  const [specialtyFilter, setSpecialtyFilter] = useState("all");

  // Get unique values for filter options
  const filterOptions = useMemo(() => {
    const allDoctors = [...new Set(mockPatients.map(p => p.doctor))];
    const allSpecialties = [...new Set(mockPatients.map(p => p.specialty))];
    return { doctors: allDoctors, specialties: allSpecialties };
  }, []);

  const filterPatients = (patients: Patient[]) => {
    return patients.filter((patient) => {
      const matchesSearch = 
        patient.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        patient.gdid.includes(searchQuery) ||
        patient.phone.includes(searchQuery) ||
        patient.email.toLowerCase().includes(searchQuery.toLowerCase());
      
      const matchesDoctor = doctorFilter === "all" || patient.doctor === doctorFilter;
      const matchesSpecialty = specialtyFilter === "all" || patient.specialty === specialtyFilter;
      
      return matchesSearch && matchesDoctor && matchesSpecialty;
    });
  };

  // Active patients = admitted IP or OP with scheduled visit
  const activePatients = useMemo(() => {
    return mockPatients.filter(p => p.isActive);
  }, []);

  const filteredActivePatients = filterPatients(activePatients);
  const filteredAllPatients = filterPatients(mockPatients);

  const renderVitals = (patient: Patient) => {
    if (!patient.vitals) return "—";
    const v = patient.vitals;
    return (
      <div className="space-y-0.5">
        <div>BP {v.bp} • SpO₂ {v.spo2}%</div>
        <div>HR {v.hr} • RR {v.rr} • Temp {v.temp}°C</div>
      </div>
    );
  };

  const renderLocationOrAppointment = (patient: Patient) => {
    if (patient.type === "IP") {
      return (
        <div className="space-y-1">
          <div className="flex items-center gap-1.5 text-sm text-foreground">
            <Building2 className="w-3.5 h-3.5 text-muted-foreground flex-shrink-0" />
            <span>Admitted {patient.admissionTime}</span>
          </div>
          <div className="text-xs text-muted-foreground pl-5">
            {patient.ward} • Room {patient.room} • Bed {patient.bed} • LOS: {patient.los}
          </div>
        </div>
      );
    } else {
      if (!patient.appointmentDate) {
        return (
          <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
            <Calendar className="w-3.5 h-3.5 flex-shrink-0" />
            <span>Not Scheduled</span>
          </div>
        );
      }
      return (
        <div className="flex items-center gap-1.5 text-sm text-foreground">
          <Calendar className="w-3.5 h-3.5 text-muted-foreground flex-shrink-0" />
          <span>{patient.appointmentDate} • {patient.appointmentType} • {patient.appointmentStatus}</span>
        </div>
      );
    }
  };

  const renderAllPatientsStatus = (patient: Patient) => {
    if (patient.type === "IP") {
      return (
        <div className="text-sm text-foreground">
          Admitted {patient.admissionTime?.split(',')[0]} • {patient.ward} • Room {patient.room} • Bed {patient.bed} • LOS: {patient.los}
        </div>
      );
    } else {
      if (!patient.appointmentDate) {
        return (
          <div className="text-sm text-foreground">
            New Visit • Not Scheduled • {patient.pastVisits} past visits
          </div>
        );
      }
      return (
        <div className="text-sm text-foreground">
          {patient.appointmentDate} • {patient.appointmentType} • {patient.appointmentStatus}
        </div>
      );
    }
  };

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

          <Tabs value={selectedTab} onValueChange={setSelectedTab} className="w-full">
            <div className="flex items-center justify-between mb-6">
              <TabsList className="bg-transparent border-b border-border rounded-none h-auto p-0 justify-start">
                <TabsTrigger
                  value="active"
                  className="tab-trigger rounded-none border-b-0 data-[state=active]:bg-transparent px-4 py-3"
                >
                  Active Patients
                </TabsTrigger>
                <TabsTrigger
                  value="all"
                  className="tab-trigger rounded-none border-b-0 data-[state=active]:bg-transparent px-4 py-3"
                >
                  All Patients
                </TabsTrigger>
              </TabsList>
              <div className="flex items-center gap-3">
                <Select value={doctorFilter} onValueChange={setDoctorFilter}>
                  <SelectTrigger className="w-[160px] h-9">
                    <SelectValue placeholder="All Providers" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Providers</SelectItem>
                    {filterOptions.doctors.map((doctor) => (
                      <SelectItem key={doctor} value={doctor}>{doctor}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <Select value={specialtyFilter} onValueChange={setSpecialtyFilter}>
                  <SelectTrigger className="w-[160px] h-9">
                    <SelectValue placeholder="All Departments" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Departments</SelectItem>
                    {filterOptions.specialties.map((specialty) => (
                      <SelectItem key={specialty} value={specialty}>{specialty}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <div className="relative w-64">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none" />
                  <Input
                    placeholder="Search by name, GDID..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-9 h-9"
                  />
                </div>
              </div>
            </div>

            {/* Active Patients Tab */}
            <TabsContent value="active">
              <div className="bg-card rounded-lg border border-border overflow-hidden">
                <div className="grid grid-cols-[180px_160px_180px_minmax(280px,1.4fr)_minmax(180px,0.9fr)_minmax(160px,0.9fr)_100px] gap-3 px-4 py-3 border-b border-border bg-muted/30 box-border">
                  <div className="text-xs font-medium text-muted-foreground">Patient</div>
                  <div className="text-xs font-medium text-muted-foreground">Contact</div>
                  <div className="text-xs font-medium text-muted-foreground">Active Visit & Purpose</div>
                  <div className="text-xs font-medium text-muted-foreground">Location / Appointment</div>
                  <div className="text-xs font-medium text-muted-foreground">Doctor</div>
                  <div className="text-xs font-medium text-muted-foreground">Vitals</div>
                  <div className="text-xs font-medium text-muted-foreground text-right">Action</div>
                </div>
                {filteredActivePatients.map((patient) => (
                  <div key={patient.id} className="grid grid-cols-[180px_160px_180px_minmax(280px,1.4fr)_minmax(180px,0.9fr)_minmax(160px,0.9fr)_100px] gap-3 px-4 py-4 items-center hover:bg-muted/20 transition-colors border-b border-border last:border-b-0 box-border">
                    <div className="flex items-start gap-2 min-w-0">
                      <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                        <User className="w-4 h-4 text-primary" />
                      </div>
                      <div className="min-w-0">
                        <div className="text-sm font-medium text-foreground truncate">{patient.name}</div>
                        <div className="text-xs text-muted-foreground truncate">GDID-{patient.gdid} • {patient.age} | {patient.gender}</div>
                      </div>
                    </div>
                    <div className="space-y-0.5 min-w-0">
                      <div className="flex items-center gap-1.5 text-xs text-foreground">
                        <Phone className="w-3 h-3 flex-shrink-0" />
                        <span className="truncate">{patient.phone}</span>
                      </div>
                      <div className="flex items-center gap-1.5 text-xs text-foreground">
                        <Mail className="w-3 h-3 flex-shrink-0" />
                        <span className="truncate">{patient.email}</span>
                      </div>
                    </div>
                    <div className="space-y-0.5 min-w-0">
                      <div className="text-xs text-muted-foreground truncate">
                        {patient.visitId ? `Active Visit: ${patient.visitId}` : "No Active Visit"}
                      </div>
                      <div className="text-sm font-medium text-foreground truncate">{patient.visitPurpose}</div>
                    </div>
                    <div className="min-w-0 line-clamp-2 whitespace-normal break-words">{renderLocationOrAppointment(patient)}</div>
                    <div className="text-sm text-foreground min-w-0 truncate">
                      {patient.doctor} — {patient.specialty}
                    </div>
                    <div className="text-xs text-foreground min-w-0 whitespace-normal break-words line-clamp-2 leading-5">
                      {renderVitals(patient)}
                    </div>
                    <div className="flex justify-end">
                      <Button variant="default" size="sm" onClick={() => navigate(`/patient-insights/${patient.id}`)}>
                        Patient Insight
                      </Button>
                    </div>
                  </div>
                ))}
                {filteredActivePatients.length === 0 && (
                  <div className="text-center py-12 text-muted-foreground text-sm">No active patients found</div>
                )}
              </div>
            </TabsContent>

            {/* All Patients Tab */}
            <TabsContent value="all">
              <div className="bg-card rounded-lg border border-border overflow-hidden">
                <div className="grid grid-cols-[200px_60px_200px_1fr_220px_120px] gap-4 p-4 border-b border-border bg-muted/30">
                  <div className="text-xs font-medium text-muted-foreground">Patient</div>
                  <div className="text-xs font-medium text-muted-foreground">Type</div>
                  <div className="text-xs font-medium text-muted-foreground">Contact</div>
                  <div className="text-xs font-medium text-muted-foreground">Status</div>
                  <div className="text-xs font-medium text-muted-foreground">Doctor</div>
                  <div className="text-xs font-medium text-muted-foreground">Action</div>
                </div>
                {filteredAllPatients.map((patient) => (
                  <div key={patient.id} className="grid grid-cols-[200px_60px_200px_1fr_220px_120px] gap-4 p-4 items-center hover:bg-muted/20 transition-colors border-b border-border last:border-b-0">
                    <div className="flex items-start gap-3">
                      <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                        <User className="w-5 h-5 text-primary" />
                      </div>
                      <div className="min-w-0">
                        <div className="text-sm font-medium text-foreground truncate">{patient.name}</div>
                        <div className="text-xs text-muted-foreground">GDID-{patient.gdid} • {patient.age} | {patient.gender}</div>
                      </div>
                    </div>
                    <div>
                      <Badge className={patient.type === "IP" 
                        ? "bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-300" 
                        : "bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-300"
                      }>
                        {patient.type}
                      </Badge>
                    </div>
                    <div className="space-y-0.5">
                      <div className="flex items-center gap-1.5 text-xs text-foreground">
                        <Phone className="w-3 h-3 flex-shrink-0" />
                        <span>{patient.phone}</span>
                      </div>
                      <div className="flex items-center gap-1.5 text-xs text-foreground">
                        <Mail className="w-3 h-3 flex-shrink-0" />
                        <span className="truncate">{patient.email}</span>
                      </div>
                    </div>
                    <div>{renderAllPatientsStatus(patient)}</div>
                    <div className="text-sm text-foreground whitespace-nowrap truncate">
                      {patient.doctor} — {patient.specialty}
                    </div>
                    <div>
                      <Button variant="default" size="sm" onClick={() => navigate(`/patient-insights/${patient.id}`)}>
                        Patient Insight
                      </Button>
                    </div>
                  </div>
                ))}
                {filteredAllPatients.length === 0 && (
                  <div className="text-center py-12 text-muted-foreground text-sm">No patients found</div>
                )}
              </div>
            </TabsContent>
          </Tabs>
        </main>
      </div>
    </div>
  );
}
