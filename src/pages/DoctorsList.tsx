import { useState, useEffect } from "react";
import { useNavigate, useSearchParams, useParams } from "react-router-dom";
import { AppSidebar } from "@/components/AppSidebar";
import { AppHeader } from "@/components/AppHeader";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Plus, Search, Download, MoreVertical, Eye, Edit, Calendar, Ban, CheckCircle, X } from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
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
import { Skeleton } from "@/components/ui/skeleton";
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
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState(searchParams.get("search") || "");
  const [selectedDoctor, setSelectedDoctor] = useState<Doctor | null>(null);
  const [viewDrawerOpen, setViewDrawerOpen] = useState(false);
  const [deactivateDialogOpen, setDeactivateDialogOpen] = useState(false);
  const [activateDialogOpen, setActivateDialogOpen] = useState(false);
  const [actionLoading, setActionLoading] = useState(false);

  // Mock data
  useEffect(() => {
    setTimeout(() => {
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
      setLoading(false);
    }, 500);
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
              <h1 className="text-lg font-semibold">Doctors</h1>
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
          <Card className="rounded-lg border">
            {loading ? (
              <div className="p-6 space-y-4">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="flex items-center gap-4">
                    <Skeleton className="h-10 w-10 rounded-full" />
                    <Skeleton className="h-4 w-[200px]" />
                    <Skeleton className="h-4 w-[150px]" />
                    <Skeleton className="h-4 w-[100px]" />
                  </div>
                ))}
              </div>
            ) : doctors.length === 0 ? (
              <div className="p-12 text-center">
                <Card className="max-w-md mx-auto p-8">
                  <h3 className="text-lg font-medium mb-2">No doctors yet</h3>
                  <p className="text-sm text-muted-foreground mb-4">
                    Get started by adding your first doctor
                  </p>
                  <Button onClick={() => navigate("/doctors/new")}>
                    <Plus className="w-4 h-4 mr-2" />
                    Add Doctor
                  </Button>
                </Card>
              </div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Doctor</TableHead>
                    <TableHead>Department / Specialty</TableHead>
                    <TableHead>Availability</TableHead>
                    <TableHead>Locations</TableHead>
                    <TableHead>Duration / Fee</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="w-[50px]"></TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {doctors.map((doctor) => (
                    <TableRow key={doctor.id}>
                      <TableCell>
                        <div className="flex items-center gap-3">
                          <Avatar className="h-10 w-10">
                            <AvatarImage src={doctor.avatar} />
                            <AvatarFallback>
                              {doctor.displayName.split(" ").map(n => n[0]).join("")}
                            </AvatarFallback>
                          </Avatar>
                          <div>
                            <div className="font-medium">{doctor.displayName}</div>
                            <div className="text-sm text-muted-foreground">{doctor.degrees}</div>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="font-medium">{doctor.department}</div>
                        <div className="text-sm text-muted-foreground">{doctor.specialty}</div>
                      </TableCell>
                      <TableCell className="text-sm">{doctor.availability}</TableCell>
                      <TableCell>
                        <div className="flex flex-wrap gap-1">
                          {doctor.locations.map((loc, i) => (
                            <Badge key={i} variant="outline" className="text-xs">
                              {loc}
                            </Badge>
                          ))}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="text-sm">{doctor.duration} min / ₹{doctor.fee.toLocaleString('en-IN')}</div>
                      </TableCell>
                      <TableCell>
                        <Badge variant={getStatusVariant(doctor.status)}>
                          {doctor.status.charAt(0).toUpperCase() + doctor.status.slice(1)}
                        </Badge>
                      </TableCell>
                      <TableCell>
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
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </Card>
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
                  <AvatarFallback>
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
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
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
