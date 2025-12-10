import { useState, useEffect } from "react";
import { useNavigate, useSearchParams, useParams } from "react-router-dom";
import { AppSidebar } from "@/components/AppSidebar";
import { AppHeader } from "@/components/AppHeader";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Plus, Search, Download, MoreVertical, Eye, Edit, Calendar, Ban, CheckCircle, X } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card } from "@/components/ui/card";
import { toast } from "@/hooks/use-toast";
import { DoctorFilters } from "@/components/doctors/DoctorFilters";

interface Doctor {
  id: string;
  displayName: string;
  degrees: string;
  department: string;
  specialty: string;
  avatar?: string;
  availability: string;
  locations: string[];
  duration: number;
  fee: number;
  status: "active" | "inactive" | "pending";
}

export default function DoctorsList() {
  const navigate = useNavigate();
  const { id } = useParams();
  const [searchParams, setSearchParams] = useSearchParams();
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [search, setSearch] = useState(searchParams.get("search") || "");
  const [selectedDoctor, setSelectedDoctor] = useState<Doctor | null>(null);
  const [viewDrawerOpen, setViewDrawerOpen] = useState(false);
  const [deactivateDialogOpen, setDeactivateDialogOpen] = useState(false);
  const [activateDialogOpen, setActivateDialogOpen] = useState(false);
  const [actionLoading, setActionLoading] = useState(false);

  // Mock data
  useEffect(() => {
    setDoctors([
      {
        id: "1",
        displayName: "Dr. Meera Nair",
        degrees: "MBBS, MD",
        department: "Cardiology",
        specialty: "Interventional Cardiology",
        availability: "Today at 2:30 PM",
        locations: ["Main Campus", "Telemedicine"],
        duration: 20,
        fee: 1500,
        status: "active",
      },
      {
        id: "2",
        displayName: "Dr. Rajesh Kumar",
        degrees: "MBBS, DM",
        department: "Endocrinology",
        specialty: "Diabetes & Metabolism",
        availability: "Tomorrow at 10:00 AM",
        locations: ["Main Campus"],
        duration: 30,
        fee: 1200,
        status: "active",
      },
      {
        id: "3",
        displayName: "Dr. Priya Sharma",
        degrees: "MBBS, MS",
        department: "Orthopedics",
        specialty: "Joint Replacement",
        availability: "On leave",
        locations: ["Main Campus", "Branch A"],
        duration: 20,
        fee: 1800,
        status: "inactive",
      },
    ]);
  }, []);

  // Handle deep link with view parameter
  useEffect(() => {
    if (id && searchParams.get("view") === "overview") {
      const doctor = doctors.find((d) => d.id === id);
      if (doctor) {
        setSelectedDoctor(doctor);
        setViewDrawerOpen(true);
      }
    }
  }, [id, searchParams, doctors]);

  // Search debounce
  useEffect(() => {
    const timer = setTimeout(() => {
      if (search) {
        searchParams.set("search", search);
      } else {
        searchParams.delete("search");
      }
      setSearchParams(searchParams);
    }, 300);
    return () => clearTimeout(timer);
  }, [search]);

  const handleView = (doctor: Doctor) => {
    setSelectedDoctor(doctor);
    setViewDrawerOpen(true);
  };

  const handleEdit = (doctorId: string) => {
    navigate(`/doctors/${doctorId}/edit`);
  };

  const handleManageSchedule = (doctorId: string) => {
    navigate(`/doctors/${doctorId}/edit?step=availability`);
  };

  const handleDeactivate = async () => {
    if (!selectedDoctor) return;
    setActionLoading(true);
    
    // Mock API call
    setTimeout(() => {
      setDoctors(doctors.map(d => 
        d.id === selectedDoctor.id ? { ...d, status: "inactive" as const } : d
      ));
      toast({ title: "Doctor deactivated." });
      setDeactivateDialogOpen(false);
      setActionLoading(false);
      setSelectedDoctor(null);
    }, 500);
  };

  const handleActivate = async () => {
    if (!selectedDoctor) return;
    setActionLoading(true);
    
    // Mock API call
    setTimeout(() => {
      setDoctors(doctors.map(d => 
        d.id === selectedDoctor.id ? { ...d, status: "active" as const } : d
      ));
      toast({ title: "Doctor activated." });
      setActivateDialogOpen(false);
      setActionLoading(false);
      setSelectedDoctor(null);
    }, 500);
  };

  const getStatusVariant = (status: string) => {
    switch (status) {
      case "active": return "default";
      case "inactive": return "secondary";
      case "pending": return "outline";
      default: return "default";
    }
  };

  return (
    <div className="min-h-screen flex w-full bg-background">
      <AppSidebar />
      <div className="flex-1 ml-[196px]">
        <AppHeader breadcrumbs={["Doctors"]} />
        
        <main className="p-6">
          {/* Header */}
          <Card className="p-6 mb-8">
            <div className="flex items-center justify-between">
              <h1 className="text-h3 text-foreground">Doctors</h1>
              <div className="flex gap-3">
                <Button variant="outline">
                  <Download className="w-4 h-4 mr-2" />
                  Export CSV
                </Button>
                <Button onClick={() => navigate("/doctors/new")}>
                  <Plus className="w-4 h-4 mr-2" />
                  Add Doctor
                </Button>
              </div>
            </div>
          </Card>

          {/* Filters with Search */}
          <DoctorFilters search={search} onSearchChange={setSearch} />

          {/* Table */}
          {doctors.length === 0 ? (
            <div className="bg-card rounded-lg border border-border p-12 text-center">
              <div className="max-w-md mx-auto">
                <h3 className="text-lg font-medium mb-2">No doctors yet</h3>
                <p className="text-sm text-muted-foreground mb-4">
                  Get started by adding your first doctor
                </p>
                <Button onClick={() => navigate("/doctors/new")}>
                  <Plus className="w-4 h-4 mr-2" />
                  Add Doctor
                </Button>
              </div>
            </div>
          ) : (
            <div className="bg-card rounded-lg border border-border overflow-hidden">
              <div className="grid grid-cols-[240px_1fr_180px_180px_150px_120px_80px] gap-4 p-4 border-b border-border bg-muted/30">
                <div className="text-label text-muted-foreground">Doctor</div>
                <div className="text-label text-muted-foreground">Department / Specialty</div>
                <div className="text-label text-muted-foreground">Availability</div>
                <div className="text-label text-muted-foreground">Locations</div>
                <div className="text-label text-muted-foreground">Duration / Fee</div>
                <div className="text-label text-muted-foreground">Status</div>
                <div className="text-label text-muted-foreground">Action</div>
              </div>

              {doctors.map((doctor) => (
                <div key={doctor.id} className="grid grid-cols-[240px_1fr_180px_180px_150px_120px_80px] gap-4 p-4 items-center hover:bg-muted/20 transition-colors border-b border-border last:border-b-0">
                  <div className="flex items-center gap-3">
                    <Avatar className="h-10 w-10 flex-shrink-0">
                      <AvatarImage src={doctor.avatar} />
                      <AvatarFallback className="bg-primary/10 text-primary">
                        {doctor.displayName.split(" ").map(n => n[0]).join("")}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <div className="text-xs font-medium text-foreground">{doctor.displayName}</div>
                      <div className="text-xs text-muted-foreground">{doctor.degrees}</div>
                    </div>
                  </div>

                  <div>
                    <div className="text-xs font-medium text-foreground">{doctor.department}</div>
                    <div className="text-xs text-muted-foreground">{doctor.specialty}</div>
                  </div>

                  <div className="text-xs text-foreground">{doctor.availability}</div>

                  <div className="flex flex-wrap gap-1">
                    {doctor.locations.map((loc, i) => (
                      <Badge key={i} variant="outline" className="text-xs">
                        {loc}
                      </Badge>
                    ))}
                  </div>

                  <div className="text-xs text-foreground">{doctor.duration} min / ₹{doctor.fee.toLocaleString('en-IN')}</div>

                  <div>
                    <Badge variant={getStatusVariant(doctor.status)}>
                      {doctor.status.charAt(0).toUpperCase() + doctor.status.slice(1)}
                    </Badge>
                  </div>

                  <div>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon">
                          <MoreVertical className="w-4 h-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => handleView(doctor)}>
                          <Eye className="w-4 h-4 mr-2" />
                          View
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => handleEdit(doctor.id)}>
                          <Edit className="w-4 h-4 mr-2" />
                          Edit
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => handleManageSchedule(doctor.id)}>
                          <Calendar className="w-4 h-4 mr-2" />
                          Manage Schedule
                        </DropdownMenuItem>
                        {doctor.status === "active" ? (
                          <DropdownMenuItem 
                            onClick={() => {
                              setSelectedDoctor(doctor);
                              setDeactivateDialogOpen(true);
                            }}
                          >
                            <Ban className="w-4 h-4 mr-2" />
                            Deactivate
                          </DropdownMenuItem>
                        ) : (
                          <DropdownMenuItem 
                            onClick={() => {
                              setSelectedDoctor(doctor);
                              setActivateDialogOpen(true);
                            }}
                          >
                            <CheckCircle className="w-4 h-4 mr-2" />
                            Activate
                          </DropdownMenuItem>
                        )}
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </div>
              ))}
            </div>
          )}
        </main>
      </div>

      {/* View Drawer */}
      <Sheet open={viewDrawerOpen} onOpenChange={setViewDrawerOpen}>
        <SheetContent className="sm:max-w-lg">
          <SheetHeader>
            <SheetTitle>Doctor Overview</SheetTitle>
          </SheetHeader>
          {selectedDoctor && (
            <div className="mt-6 space-y-6">
              <div className="flex items-center gap-4">
                <Avatar className="h-16 w-16">
                  <AvatarImage src={selectedDoctor.avatar} />
                  <AvatarFallback className="bg-primary/10 text-primary">
                    {selectedDoctor.displayName.split(" ").map(n => n[0]).join("")}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <h3 className="text-lg font-semibold">{selectedDoctor.displayName}</h3>
                  <p className="text-sm text-muted-foreground">{selectedDoctor.degrees}</p>
                </div>
              </div>

              <div className="space-y-4">
                <div>
                  <div className="text-sm font-medium mb-1">Department</div>
                  <div className="text-sm text-muted-foreground">{selectedDoctor.department}</div>
                </div>
                <div>
                  <div className="text-sm font-medium mb-1">Specialty</div>
                  <div className="text-sm text-muted-foreground">{selectedDoctor.specialty}</div>
                </div>
                <div>
                  <div className="text-sm font-medium mb-1">Consultation Fee</div>
                  <div className="text-sm text-muted-foreground">₹{selectedDoctor.fee.toLocaleString('en-IN')}</div>
                </div>
                <div>
                  <div className="text-sm font-medium mb-1">Next Availability</div>
                  <div className="text-sm text-muted-foreground">{selectedDoctor.availability}</div>
                </div>
                <div>
                  <div className="text-sm font-medium mb-1">Locations</div>
                  <div className="flex flex-wrap gap-2">
                    {selectedDoctor.locations.map((loc, i) => (
                      <Badge key={i} variant="outline">{loc}</Badge>
                    ))}
                  </div>
                </div>
                <div>
                  <div className="text-sm font-medium mb-1">Status</div>
                  <Badge variant={getStatusVariant(selectedDoctor.status)}>
                    {selectedDoctor.status.charAt(0).toUpperCase() + selectedDoctor.status.slice(1)}
                  </Badge>
                </div>
              </div>

              <div className="flex gap-3 pt-4">
                <Button onClick={() => handleEdit(selectedDoctor.id)} className="flex-1">
                  <Edit className="w-4 h-4 mr-2" />
                  Edit
                </Button>
                <Button 
                  variant="outline" 
                  onClick={() => handleManageSchedule(selectedDoctor.id)}
                  className="flex-1"
                >
                  <Calendar className="w-4 h-4 mr-2" />
                  Manage Schedule
                </Button>
              </div>
            </div>
          )}
        </SheetContent>
      </Sheet>

      {/* Deactivate Dialog */}
      <AlertDialog open={deactivateDialogOpen} onOpenChange={setDeactivateDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Deactivate {selectedDoctor?.displayName}?</AlertDialogTitle>
            <AlertDialogDescription>
              This will hide the doctor from new bookings. Existing appointments will remain.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={actionLoading}>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDeactivate}
              disabled={actionLoading}
              className="bg-primary text-primary-foreground hover:bg-primary/90"
            >
              {actionLoading ? "Deactivating..." : "Deactivate"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Activate Dialog */}
      <AlertDialog open={activateDialogOpen} onOpenChange={setActivateDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Activate {selectedDoctor?.displayName}?</AlertDialogTitle>
            <AlertDialogDescription>
              This will make the doctor available for new bookings.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={actionLoading}>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleActivate}
              disabled={actionLoading}
            >
              {actionLoading ? "Activating..." : "Activate"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
