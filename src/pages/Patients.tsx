import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { AppSidebar } from "@/components/AppSidebar";
import { AppHeader } from "@/components/AppHeader";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Search, User, Download, Phone, Mail, MoreVertical } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

// Mock data for inpatients with visit information
const mockInpatients = [
  {
    id: "1",
    name: "Harish Kalyan",
    gdid: "001",
    age: 35,
    gender: "M",
    allergies: ["Penicillin"],
    phone: "+91 98765 43210",
    email: "9876543210@gooddoc.app",
    visitId: "VST-205431",
    admissionTime: "03 Aug 2025, 10:30 AM",
    ward: "Cardiology Ward 3B",
    room: "312",
    bed: "12",
    los: "2d",
    doctor: "Dr. Meera Nair",
    specialty: "Cardiology",
    status: "IP",
    condition: "Stable",
  },
  {
    id: "2",
    name: "Priya Sharma",
    gdid: "006",
    age: 42,
    gender: "F",
    allergies: [],
    phone: "+91 98765 43211",
    email: "9876543211@gooddoc.app",
    visitId: "VST-205432",
    admissionTime: "02 Aug 2025, 02:15 PM",
    ward: "General Medicine Ward 2A",
    room: "208",
    bed: "5",
    los: "3d",
    doctor: "Dr. Rajesh Kumar",
    specialty: "Endocrinology",
    status: "IP",
    condition: "Under Observation",
  },
  {
    id: "3",
    name: "Arun Patel",
    gdid: "007",
    age: 55,
    gender: "M",
    allergies: [],
    phone: "+91 98765 43212",
    email: "9876543212@gooddoc.app",
    visitId: "VST-205433",
    admissionTime: "04 Aug 2025, 08:45 AM",
    ward: "Orthopedics Ward 1C",
    room: "115",
    bed: "3",
    los: "1d",
    doctor: "Dr. Anita Singh",
    specialty: "Orthopedics",
    status: "IP",
    condition: "Pending Tests",
  },
  {
    id: "4",
    name: "Kavya Iyer",
    gdid: "008",
    age: 29,
    gender: "F",
    allergies: ["Latex"],
    phone: "+91 98765 43213",
    email: "9876543213@gooddoc.app",
    visitId: "VST-205434",
    admissionTime: "01 Aug 2025, 06:20 PM",
    ward: "Dermatology Ward 4A",
    room: "402",
    bed: "8",
    los: "4d",
    doctor: "Dr. Sunil Reddy",
    specialty: "Dermatology",
    status: "IP",
    condition: "Stable",
  },
];

export default function Patients() {
  const navigate = useNavigate();
  const [selectedTab, setSelectedTab] = useState("inpatient");
  const [searchQuery, setSearchQuery] = useState("");

  const filteredPatients = mockInpatients.filter(
    (patient) =>
      patient.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      patient.gdid.includes(searchQuery) ||
      patient.phone.includes(searchQuery) ||
      patient.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

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
                <div className="relative w-80">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input
                    placeholder="Search by name, GDID, phone, email..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10"
                  />
                </div>
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

          <div className="mb-6">
            <Tabs value={selectedTab} onValueChange={setSelectedTab}>
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
            </Tabs>
          </div>

          <div className="bg-card rounded-lg border border-border overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-border bg-muted/30">
                    <th className="text-left p-4 text-sm font-medium text-foreground">
                      Patient Info
                    </th>
                    <th className="text-left p-4 text-sm font-medium text-foreground">
                      Contact
                    </th>
                    <th className="text-left p-4 text-sm font-medium text-foreground">
                      Admission & Visit
                    </th>
                    <th className="text-left p-4 text-sm font-medium text-foreground">
                      Care Team
                    </th>
                    <th className="text-left p-4 text-sm font-medium text-foreground">
                      Status
                    </th>
                    <th className="text-right p-4 text-sm font-medium text-foreground">
                      Action
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {filteredPatients.map((patient) => (
                    <tr
                      key={patient.id}
                      className="border-b border-border last:border-b-0 hover:bg-muted/20 transition-colors"
                    >
                      <td className="p-4">
                        <div className="flex items-start gap-3">
                          <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                            <User className="w-5 h-5 text-primary" />
                          </div>
                          <div>
                            <div className="text-sm font-medium text-foreground">
                              {patient.name}
                            </div>
                            <div className="text-xs text-muted-foreground">
                              GDID-{patient.gdid} • {patient.age} | {patient.gender}
                            </div>
                            {patient.allergies.length > 0 && (
                              <Badge variant="destructive" className="mt-1 text-xs">
                                Allergy: {patient.allergies.join(", ")}
                              </Badge>
                            )}
                          </div>
                        </div>
                      </td>
                      <td className="p-4">
                        <div className="space-y-1">
                          <a
                            href={`tel:${patient.phone}`}
                            className="flex items-center gap-2 text-sm text-foreground hover:text-primary"
                          >
                            <Phone className="w-3 h-3" />
                            {patient.phone}
                          </a>
                          <a
                            href={`mailto:${patient.email}`}
                            className="flex items-center gap-2 text-xs text-muted-foreground hover:text-primary"
                          >
                            <Mail className="w-3 h-3" />
                            {patient.email}
                          </a>
                        </div>
                      </td>
                      <td className="p-4">
                        <div className="space-y-1">
                          <Badge variant="secondary" className="text-xs">
                            Active Visit: {patient.visitId}
                          </Badge>
                          <div className="text-xs text-muted-foreground">
                            Admitted: {patient.admissionTime}
                          </div>
                          <div className="text-xs text-foreground">
                            {patient.ward} • Room {patient.room} • Bed {patient.bed} • LOS:{" "}
                            {patient.los}
                          </div>
                        </div>
                      </td>
                      <td className="p-4">
                        <div className="text-sm text-foreground">
                          {patient.doctor} — {patient.specialty}
                        </div>
                      </td>
                      <td className="p-4">
                        <div className="space-y-1">
                          <Badge variant="outline" className="text-xs">
                            {patient.status}
                          </Badge>
                          <Badge
                            variant={
                              patient.condition === "Stable"
                                ? "secondary"
                                : patient.condition === "Under Observation"
                                ? "default"
                                : "outline"
                            }
                            className="text-xs"
                          >
                            {patient.condition}
                          </Badge>
                        </div>
                      </td>
                      <td className="p-4 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <Button
                            size="sm"
                            onClick={() => navigate(`/patient-insights/${patient.id}`)}
                          >
                            Patient Insight
                          </Button>
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="icon" className="h-8 w-8">
                                <MoreVertical className="w-4 h-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end" className="bg-card z-50">
                              <DropdownMenuItem
                                onClick={() =>
                                  navigate(`/vitals/new?patientId=${patient.id}&visitId=${patient.visitId}`)
                                }
                              >
                                Record Vitals
                              </DropdownMenuItem>
                              <DropdownMenuItem>Transfer</DropdownMenuItem>
                              <DropdownMenuItem>Discharge Plan</DropdownMenuItem>
                              <DropdownMenuItem>Add Note</DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {filteredPatients.length === 0 && (
              <div className="text-center py-12 text-muted-foreground text-sm">
                No patients found
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  );
}
