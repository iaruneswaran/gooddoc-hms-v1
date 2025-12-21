import { useState, useMemo, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { AppSidebar } from "@/components/AppSidebar";
import { AppHeader } from "@/components/AppHeader";
import { PageContent } from "@/components/PageContent";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Download, MoreVertical, Pencil, Eye, CalendarPlus, User, AlertTriangle, Loader2 } from "lucide-react";
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
import { usePatients, useUpdatePatient } from "@/hooks/usePatients";
import { Patient } from "@/types/patient";
import { format, differenceInYears, parseISO } from "date-fns";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

// Helper to calculate age from date of birth
const calculateAge = (dob: string): number => {
  return differenceInYears(new Date(), parseISO(dob));
};

// Helper to format date
const formatDate = (dateStr: string): string => {
  return format(parseISO(dateStr), "dd-MMM-yyyy");
};

// Status badge styling
const getStatusBadgeStyle = (status: Patient['status']) => {
  switch (status) {
    case 'IP':
      return 'bg-blue-100 text-blue-700 hover:bg-blue-100';
    case 'OP':
      return 'bg-green-100 text-green-700 hover:bg-green-100';
    case 'Discharged':
      return 'bg-gray-100 text-gray-700 hover:bg-gray-100';
    case 'Emergency':
      return 'bg-red-100 text-red-700 hover:bg-red-100';
    default:
      return 'bg-gray-100 text-gray-700 hover:bg-gray-100';
  }
};

export default function Patients() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const initialSearch = searchParams.get("search") || "";
  const [searchQuery, setSearchQuery] = useState(initialSearch);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [selectedPatient, setSelectedPatient] = useState<Patient | null>(null);
  const [genderFilter, setGenderFilter] = useState("all");
  const [bloodGroupFilter, setBloodGroupFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [departmentFilter, setDepartmentFilter] = useState("all");

  const { data: patients = [], isLoading, error } = usePatients();
  const updatePatient = useUpdatePatient();

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
    const bloodGroups = [...new Set(patients.map(p => p.blood_group).filter(Boolean))] as string[];
    const statuses = [...new Set(patients.map(p => p.status))];
    const departments = [...new Set(patients.map(p => p.department).filter(Boolean))] as string[];
    return { genders, bloodGroups, statuses, departments };
  }, [patients]);

  const filteredPatients = useMemo(() => {
    return patients.filter((patient) => {
      const fullName = `${patient.first_name} ${patient.last_name}`.toLowerCase();
      const matchesSearch =
        fullName.includes(searchQuery.toLowerCase()) ||
        patient.gdid.toLowerCase().includes(searchQuery.toLowerCase()) ||
        patient.phone.includes(searchQuery) ||
        (patient.email?.toLowerCase().includes(searchQuery.toLowerCase()) ?? false) ||
        (patient.address_city?.toLowerCase().includes(searchQuery.toLowerCase()) ?? false) ||
        (patient.department?.toLowerCase().includes(searchQuery.toLowerCase()) ?? false);

      const matchesGender = genderFilter === "all" || patient.gender === genderFilter;
      const matchesBloodGroup = bloodGroupFilter === "all" || patient.blood_group === bloodGroupFilter;
      const matchesStatus = statusFilter === "all" || patient.status === statusFilter;
      const matchesDepartment = departmentFilter === "all" || patient.department === departmentFilter;

      return matchesSearch && matchesGender && matchesBloodGroup && matchesStatus && matchesDepartment;
    });
  }, [searchQuery, patients, genderFilter, bloodGroupFilter, statusFilter, departmentFilter]);

  const handleEditPatient = (patient: Patient) => {
    setSelectedPatient(patient);
    setEditModalOpen(true);
  };

  const handleSavePatient = (updatedPatient: Patient) => {
    updatePatient.mutate(updatedPatient);
  };

  const handlePatientInsight = (patient: Patient) => {
    navigate(`/patient-insights/${patient.gdid}?from=patients`);
  };

  const handleBookAppointment = (patient: Patient) => {
    navigate(`/book-appointment?from=patients&patientId=${patient.gdid}`);
  };

  const handlePatient360 = (patient: Patient) => {
    navigate(`/patients/${patient.gdid}/360?from=patients`);
  };

  if (isLoading) {
    return (
      <div className="flex min-h-screen bg-background">
        <AppSidebar />
        <PageContent>
          <AppHeader breadcrumbs={["Patients"]} />
          <main className="p-6 flex items-center justify-center">
            <Loader2 className="w-8 h-8 animate-spin text-primary" />
          </main>
        </PageContent>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex min-h-screen bg-background">
        <AppSidebar />
        <PageContent>
          <AppHeader breadcrumbs={["Patients"]} />
          <main className="p-6">
            <Card className="p-6 text-center text-destructive">
              Error loading patients. Please try again.
            </Card>
          </main>
        </PageContent>
      </div>
    );
  }

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

          <div className="flex items-center justify-start mb-6 flex-wrap gap-3">
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
            <Select value={departmentFilter} onValueChange={setDepartmentFilter}>
              <SelectTrigger className="w-[160px] h-9">
                <SelectValue placeholder="All Departments" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Departments</SelectItem>
                {filterOptions.departments.map((dept) => (
                  <SelectItem key={dept} value={dept}>{dept}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="bg-card rounded-lg border border-border overflow-hidden w-full">
            <div className="grid grid-cols-[0.7fr_1.2fr_0.4fr_0.5fr_0.9fr_0.9fr_0.6fr_0.5fr_0.8fr_0.8fr_0.5fr_0.4fr] gap-3 px-4 py-3 border-b border-border bg-muted/30 w-full">
              <div className="text-xs font-medium text-muted-foreground">GDID</div>
              <div className="text-xs font-medium text-muted-foreground">Patient Name</div>
              <div className="text-xs font-medium text-muted-foreground">Age</div>
              <div className="text-xs font-medium text-muted-foreground">Gender</div>
              <div className="text-xs font-medium text-muted-foreground">Phone</div>
              <div className="text-xs font-medium text-muted-foreground">Department</div>
              <div className="text-xs font-medium text-muted-foreground">City</div>
              <div className="text-xs font-medium text-muted-foreground">Blood</div>
              <div className="text-xs font-medium text-muted-foreground">Last Visit</div>
              <div className="text-xs font-medium text-muted-foreground">Registered</div>
              <div className="text-xs font-medium text-muted-foreground">Status</div>
              <div className="text-xs font-medium text-muted-foreground text-right">Action</div>
            </div>
            {filteredPatients.map((patient) => (
              <div
                key={patient.id}
                className="grid grid-cols-[0.7fr_1.2fr_0.4fr_0.5fr_0.9fr_0.9fr_0.6fr_0.5fr_0.8fr_0.8fr_0.5fr_0.4fr] gap-3 px-4 py-4 items-center hover:bg-muted/20 transition-colors border-b border-border last:border-b-0 w-full"
              >
                <div className="text-sm font-medium text-foreground truncate">{patient.gdid}</div>
                <div className="flex items-center gap-2">
                  <span
                    className="text-sm text-foreground truncate cursor-pointer hover:text-primary hover:underline"
                    onClick={() => handlePatientInsight(patient)}
                    role="button"
                    tabIndex={0}
                    onKeyDown={(e) => e.key === 'Enter' && handlePatientInsight(patient)}
                  >
                    {patient.first_name} {patient.last_name}
                  </span>
                  {(patient.allergies?.length || patient.medical_alerts?.length) && (
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger>
                          <AlertTriangle className="w-4 h-4 text-amber-500" />
                        </TooltipTrigger>
                        <TooltipContent>
                          <div className="text-xs space-y-1">
                            {patient.allergies?.length && (
                              <div>Allergies: {patient.allergies.join(", ")}</div>
                            )}
                            {patient.medical_alerts?.length && (
                              <div>Alerts: {patient.medical_alerts.join(", ")}</div>
                            )}
                          </div>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  )}
                </div>
                <div className="text-sm text-foreground">{calculateAge(patient.date_of_birth)}</div>
                <div className="text-sm text-foreground truncate">{patient.gender}</div>
                <div className="text-sm text-foreground truncate">{patient.phone}</div>
                <div className="text-sm text-foreground truncate">{patient.department || "-"}</div>
                <div className="text-sm text-foreground truncate">{patient.address_city || "-"}</div>
                <div className="text-sm text-foreground">{patient.blood_group || "-"}</div>
                <div className="text-sm text-foreground truncate">
                  {patient.last_visit_date ? formatDate(patient.last_visit_date) : "-"}
                </div>
                <div className="text-sm text-foreground truncate">{formatDate(patient.registration_date)}</div>
                <div>
                  <Badge
                    variant="secondary"
                    className={getStatusBadgeStyle(patient.status)}
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
