import { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { AppSidebar } from "@/components/AppSidebar";
import { AppHeader } from "@/components/AppHeader";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Search, User, Download, Phone, Mail } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

// Mock data for inpatients
const mockInpatients = [
  {
    id: "1",
    name: "Harish Kalyan",
    gdid: "001",
    age: 35,
    gender: "M",
    phone: "+91 98765 43210",
    email: "9876543210@gooddoc.app",
    admissionTime: "03 Aug 2025, 10:30 AM",
    ward: "Cardiology Ward 3B",
    room: "312",
    bed: "12",
    los: "2d",
    doctor: "Dr. Meera Nair",
    specialty: "Cardiology",
    condition: "Stable",
  },
  {
    id: "2",
    name: "Priya Sharma",
    gdid: "006",
    age: 42,
    gender: "F",
    phone: "+91 98765 43211",
    email: "9876543211@gooddoc.app",
    admissionTime: "02 Aug 2025, 02:15 PM",
    ward: "General Medicine Ward 2A",
    room: "208",
    bed: "5",
    los: "3d",
    doctor: "Dr. Rajesh Kumar",
    specialty: "Endocrinology",
    condition: "Under Observation",
  },
  {
    id: "3",
    name: "Arun Patel",
    gdid: "007",
    age: 55,
    gender: "M",
    phone: "+91 98765 43212",
    email: "9876543212@gooddoc.app",
    admissionTime: "04 Aug 2025, 08:45 AM",
    ward: "Orthopedics Ward 1C",
    room: "115",
    bed: "3",
    los: "1d",
    doctor: "Dr. Anita Singh",
    specialty: "Orthopedics",
    condition: "Pending Tests",
  },
  {
    id: "4",
    name: "Kavya Iyer",
    gdid: "008",
    age: 29,
    gender: "F",
    phone: "+91 98765 43213",
    email: "9876543213@gooddoc.app",
    admissionTime: "01 Aug 2025, 06:20 PM",
    ward: "Dermatology Ward 4A",
    room: "402",
    bed: "8",
    los: "4d",
    doctor: "Dr. Sunil Reddy",
    specialty: "Dermatology",
    condition: "Stable",
  },
];

// Mock data for outpatients
const mockOutpatients = [
  {
    id: "5",
    name: "Ravi Kumar",
    gdid: "012",
    age: 48,
    gender: "M",
    phone: "+91 98765 43214",
    email: "9876543214@gooddoc.app",
    nextAppointment: "12 Aug 2025, 10:00 AM",
    doctor: "Dr. Meera Nair",
    specialty: "Cardiology",
    appointmentType: "Follow-up",
    appointmentStatus: "Confirmed",
    visitCount: 5,
    vitals: { bp: "120/80", spo2: 98, hr: 72, rr: 16, temp: 37 },
  },
  {
    id: "6",
    name: "Sunita Menon",
    gdid: "015",
    age: 34,
    gender: "F",
    phone: "+91 98765 43215",
    email: "9876543215@gooddoc.app",
    nextAppointment: "08 Aug 2025, 11:30 AM",
    doctor: "Dr. Rajesh Kumar",
    specialty: "Endocrinology",
    appointmentType: "Consultation",
    appointmentStatus: "Pending",
    visitCount: 8,
    vitals: { bp: "130/85", spo2: 97, hr: 78, rr: 18, temp: 36.8 },
  },
  {
    id: "7",
    name: "Mohan Das",
    gdid: "018",
    age: 62,
    gender: "M",
    phone: "+91 98765 43216",
    email: "9876543216@gooddoc.app",
    nextAppointment: "10 Aug 2025, 09:00 AM",
    doctor: "Dr. Anita Singh",
    specialty: "Orthopedics",
    appointmentType: "Review",
    appointmentStatus: "Confirmed",
    visitCount: 12,
    vitals: { bp: "140/90", spo2: 96, hr: 68, rr: 14, temp: 37.2 },
  },
  {
    id: "8",
    name: "Lakshmi Nair",
    gdid: "022",
    age: 41,
    gender: "F",
    phone: "+91 98765 43217",
    email: "9876543217@gooddoc.app",
    nextAppointment: "—",
    doctor: "Dr. Sunil Reddy",
    specialty: "Dermatology",
    appointmentType: "New Visit",
    appointmentStatus: "Not Scheduled",
    visitCount: 3,
    vitals: { bp: "118/76", spo2: 99, hr: 70, rr: 15, temp: 36.6 },
  },
];

export default function Patients() {
  const navigate = useNavigate();
  const [selectedTab, setSelectedTab] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [doctorFilter, setDoctorFilter] = useState("all");
  const [specialtyFilter, setSpecialtyFilter] = useState("all");

  // Get unique values for filter options
  const filterOptions = useMemo(() => {
    const allDoctors = [...new Set([...mockInpatients, ...mockOutpatients].map(p => p.doctor))];
    const allSpecialties = [...new Set([...mockInpatients, ...mockOutpatients].map(p => p.specialty))];
    return { doctors: allDoctors, specialties: allSpecialties };
  }, []);

  const filterPatients = <T extends { name: string; gdid: string; phone: string; email: string; doctor: string; specialty: string }>(patients: T[]) => {
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

  const filteredInpatients = filterPatients(mockInpatients);
  const filteredOutpatients = filterPatients(mockOutpatients);

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
                  value="all"
                  className="tab-trigger rounded-none border-b-0 data-[state=active]:bg-transparent px-4 py-3"
                >
                  All Patients
                </TabsTrigger>
                <TabsTrigger
                  value="inpatient"
                  className="tab-trigger rounded-none border-b-0 data-[state=active]:bg-transparent px-4 py-3"
                >
                  Inpatient (IP)
                </TabsTrigger>
                <TabsTrigger
                  value="outpatient"
                  className="tab-trigger rounded-none border-b-0 data-[state=active]:bg-transparent px-4 py-3"
                >
                  Outpatient (OP)
                </TabsTrigger>
              </TabsList>
              <div className="flex items-center gap-3">
                <Select value={doctorFilter} onValueChange={setDoctorFilter}>
                  <SelectTrigger className="w-[160px] h-9">
                    <SelectValue placeholder="All Doctors" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Doctors</SelectItem>
                    {filterOptions.doctors.map((doctor) => (
                      <SelectItem key={doctor} value={doctor}>{doctor}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <Select value={specialtyFilter} onValueChange={setSpecialtyFilter}>
                  <SelectTrigger className="w-[150px] h-9">
                    <SelectValue placeholder="Specialty" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Specialties</SelectItem>
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

            {/* All Patients Tab */}
            <TabsContent value="all">
              <div className="bg-card rounded-lg border border-border overflow-hidden">
                <div className="grid grid-cols-[200px_180px_80px_1fr_180px_120px] gap-4 p-4 border-b border-border bg-muted/30 items-start justify-items-start">
                  <div className="text-xs font-medium text-muted-foreground">Patient Info</div>
                  <div className="text-xs font-medium text-muted-foreground">Contact</div>
                  <div className="text-xs font-medium text-muted-foreground">Type</div>
                  <div className="text-xs font-medium text-muted-foreground">Details</div>
                  <div className="text-xs font-medium text-muted-foreground">Care Team</div>
                  <div className="text-xs font-medium text-muted-foreground">Action</div>
                </div>
                
                {/* Inpatients in All tab */}
                {filteredInpatients.map((patient) => (
                  <div key={patient.id} className="grid grid-cols-[200px_180px_80px_1fr_180px_120px] gap-4 p-4 items-center hover:bg-muted/20 transition-colors border-b border-border">
                    <div className="flex items-start gap-3">
                      <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                        <User className="w-5 h-5 text-primary" />
                      </div>
                      <div>
                        <div className="text-sm font-medium text-foreground">{patient.name}</div>
                        <div className="text-xs text-muted-foreground">GDID - {patient.gdid} • {patient.age} | {patient.gender}</div>
                      </div>
                    </div>
                    <div className="space-y-1">
                      <div className="flex items-center gap-2 text-xs text-foreground">
                        <Phone className="w-3 h-3 flex-shrink-0" />
                        <span>{patient.phone}</span>
                      </div>
                      <div className="flex items-center gap-2 text-xs text-foreground">
                        <Mail className="w-3 h-3 flex-shrink-0" />
                        <span>{patient.email}</span>
                      </div>
                    </div>
                    <div>
                      <Badge className="bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-300">IP</Badge>
                    </div>
                    <div className="text-sm text-foreground">
                      {patient.ward} • Room {patient.room} • Bed {patient.bed}
                    </div>
                    <div className="text-sm text-foreground">{patient.doctor}</div>
                    <div>
                      <Button variant="default" size="sm" onClick={() => navigate(`/patient-insights/${patient.id}`)}>
                        Patient Insight
                      </Button>
                    </div>
                  </div>
                ))}
                
                {/* Outpatients in All tab */}
                {filteredOutpatients.map((patient) => (
                  <div key={patient.id} className="grid grid-cols-[200px_180px_80px_1fr_180px_120px] gap-4 p-4 items-center hover:bg-muted/20 transition-colors border-b border-border last:border-b-0">
                    <div className="flex items-start gap-3">
                      <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                        <User className="w-5 h-5 text-primary" />
                      </div>
                      <div>
                        <div className="text-sm font-medium text-foreground">{patient.name}</div>
                        <div className="text-xs text-muted-foreground">GDID - {patient.gdid} • {patient.age} | {patient.gender}</div>
                      </div>
                    </div>
                    <div className="space-y-1">
                      <div className="flex items-center gap-2 text-xs text-foreground">
                        <Phone className="w-3 h-3 flex-shrink-0" />
                        <span>{patient.phone}</span>
                      </div>
                      <div className="flex items-center gap-2 text-xs text-foreground">
                        <Mail className="w-3 h-3 flex-shrink-0" />
                        <span>{patient.email}</span>
                      </div>
                    </div>
                    <div>
                      <Badge className="bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-300">OP</Badge>
                    </div>
                    <div className="text-sm text-foreground">
                      {patient.nextAppointment !== "—" ? patient.nextAppointment : "No upcoming"} • {patient.visitCount} visits
                    </div>
                    <div className="text-sm text-foreground">{patient.doctor}</div>
                    <div>
                      <Button variant="default" size="sm" onClick={() => navigate(`/patient-insights/${patient.id}`)}>
                        Patient Insight
                      </Button>
                    </div>
                  </div>
                ))}

                {filteredInpatients.length === 0 && filteredOutpatients.length === 0 && (
                  <div className="text-center py-12 text-muted-foreground text-sm">No patients found</div>
                )}
              </div>
            </TabsContent>

            {/* Inpatient Tab */}
            <TabsContent value="inpatient">
              <div className="bg-card rounded-lg border border-border overflow-hidden">
                <div className="grid grid-cols-[200px_180px_1fr_200px_120px] gap-4 p-4 border-b border-border bg-muted/30">
                  <div className="text-xs font-medium text-muted-foreground">Patient Info</div>
                  <div className="text-xs font-medium text-muted-foreground">Contact</div>
                  <div className="text-xs font-medium text-muted-foreground">Admission & Ward</div>
                  <div className="text-xs font-medium text-muted-foreground">Care Team</div>
                  <div className="text-xs font-medium text-muted-foreground">Action</div>
                </div>
                {filteredInpatients.map((patient) => (
                  <div key={patient.id} className="grid grid-cols-[200px_180px_1fr_200px_120px] gap-4 p-4 items-center hover:bg-muted/20 transition-colors border-b border-border last:border-b-0">
                    <div className="flex items-start gap-3">
                      <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                        <User className="w-5 h-5 text-primary" />
                      </div>
                      <div>
                        <div className="text-sm font-medium text-foreground">{patient.name}</div>
                        <div className="text-xs text-muted-foreground">GDID - {patient.gdid} • {patient.age} | {patient.gender}</div>
                      </div>
                    </div>
                    <div className="space-y-1">
                      <div className="flex items-center gap-2 text-xs text-foreground">
                        <Phone className="w-3 h-3 flex-shrink-0" />
                        <span>{patient.phone}</span>
                      </div>
                      <div className="flex items-center gap-2 text-xs text-foreground">
                        <Mail className="w-3 h-3 flex-shrink-0" />
                        <span>{patient.email}</span>
                      </div>
                    </div>
                    <div className="space-y-1">
                      <div className="text-xs text-muted-foreground">Admitted: {patient.admissionTime}</div>
                      <div className="text-sm text-foreground">
                        {patient.ward} • Room {patient.room} • Bed {patient.bed} • LOS: {patient.los}
                      </div>
                    </div>
                    <div className="text-sm text-foreground">{patient.doctor} — {patient.specialty}</div>
                    <div>
                      <Button variant="default" size="sm" onClick={() => navigate(`/patient-insights/${patient.id}`)}>
                        Patient Insight
                      </Button>
                    </div>
                  </div>
                ))}
                {filteredInpatients.length === 0 && (
                  <div className="text-center py-12 text-muted-foreground text-sm">No inpatients found</div>
                )}
              </div>
            </TabsContent>

            {/* Outpatient Tab */}
            <TabsContent value="outpatient">
              <div className="bg-card rounded-lg border border-border overflow-hidden w-full">
                <div className="grid grid-cols-[minmax(180px,1fr)_minmax(180px,1fr)_minmax(180px,1fr)_minmax(180px,1fr)_minmax(160px,1fr)_auto] gap-4 px-4 py-3 items-center border-b border-border bg-muted/30">
                  <div className="text-xs font-medium text-muted-foreground pl-[52px]">Patient Info</div>
                  <div className="text-xs font-medium text-muted-foreground">Contact</div>
                  <div className="text-xs font-medium text-muted-foreground">Appointment Summary</div>
                  <div className="text-xs font-medium text-muted-foreground">Vitals</div>
                  <div className="text-xs font-medium text-muted-foreground">Care Team</div>
                  <div className="text-xs font-medium text-muted-foreground">Action</div>
                </div>
                {filteredOutpatients.map((patient) => (
                  <div key={patient.id} className="grid grid-cols-[minmax(180px,1fr)_minmax(180px,1fr)_minmax(180px,1fr)_minmax(180px,1fr)_minmax(160px,1fr)_auto] gap-4 px-4 py-3 items-center hover:bg-muted/20 transition-colors border-b border-border last:border-b-0">
                    <div className="flex items-start gap-3">
                      <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                        <User className="w-5 h-5 text-primary" />
                      </div>
                      <div>
                        <div className="text-sm font-medium text-foreground">{patient.name}</div>
                        <div className="text-xs text-muted-foreground">GDID - {patient.gdid} • {patient.age} | {patient.gender}</div>
                      </div>
                    </div>
                    <div className="space-y-1">
                      <div className="flex items-center gap-2 text-xs text-foreground">
                        <Phone className="w-3 h-3 flex-shrink-0" />
                        <span>{patient.phone}</span>
                      </div>
                      <div className="flex items-center gap-2 text-xs text-foreground">
                        <Mail className="w-3 h-3 flex-shrink-0" />
                        <span>{patient.email}</span>
                      </div>
                    </div>
                    <div className="space-y-1">
                      <div className="text-sm text-foreground">{patient.nextAppointment}</div>
                      <div className="flex items-center gap-2">
                        <Badge variant="outline" className="text-xs">{patient.appointmentType}</Badge>
                        <Badge className={
                          patient.appointmentStatus === "Confirmed" 
                            ? "bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-300" 
                            : patient.appointmentStatus === "Pending"
                            ? "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-300"
                            : "bg-muted text-muted-foreground"
                        }>
                          {patient.appointmentStatus}
                        </Badge>
                      </div>
                    </div>
                    <div className="text-xs text-foreground space-y-0.5">
                      <div>BP: {patient.vitals.bp} • SpO₂: {patient.vitals.spo2}% • HR: {patient.vitals.hr}</div>
                      <div>RR: {patient.vitals.rr} • Temp: {patient.vitals.temp}°C</div>
                    </div>
                    <div className="text-sm text-foreground">{patient.doctor} — {patient.specialty}</div>
                    <div>
                      <Button variant="default" size="sm" onClick={() => navigate(`/patient-insights/${patient.id}`)}>
                        Patient Insight
                      </Button>
                    </div>
                  </div>
                ))}
                {filteredOutpatients.length === 0 && (
                  <div className="text-center py-12 text-muted-foreground text-sm">No outpatients found</div>
                )}
              </div>
            </TabsContent>
          </Tabs>
        </main>
      </div>
    </div>
  );
}
