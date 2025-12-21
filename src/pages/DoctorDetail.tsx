import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { AppSidebar } from "@/components/AppSidebar";
import { AppHeader } from "@/components/AppHeader";
import { PageContent } from "@/components/PageContent";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { 
  ArrowLeft, 
  Phone, 
  Mail, 
  MapPin, 
  Clock, 
  Calendar,
  Users,
  CheckCircle,
  XCircle,
  AlertCircle,
  Video,
  Edit,
  MoreVertical
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { toast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { DoctorCalendar } from "@/components/doctors/DoctorCalendar";
import { ScheduleBuilder } from "@/components/doctors/ScheduleBuilder";
import { LeaveManagement } from "@/components/doctors/LeaveManagement";
import { Doctor, Location, Leave, DaySchedule, Appointment } from "@/types/scheduling";
import { format, parseISO, isToday } from "date-fns";

// Mock data for today's appointments - realistic hospital data
const mockTodayAppointments = [
  { 
    id: "APT-2025122101", 
    patientId: "UHID-2024-00847", 
    patientName: "Ramesh Krishnamurthy", 
    patientAge: 58, 
    patientGender: "M", 
    time: "09:00", 
    endTime: "09:20", 
    type: "Post-Op Review", 
    chiefComplaint: "Knee replacement follow-up - Day 14",
    status: "completed", 
    room: "OPD Cabin 3",
    vitals: { bp: "128/82", pulse: 76 }
  },
  { 
    id: "APT-2025122102", 
    patientId: "UHID-2024-01234", 
    patientName: "Sunita Devi", 
    patientAge: 45, 
    patientGender: "F", 
    time: "09:20", 
    endTime: "09:40", 
    type: "New Consultation", 
    chiefComplaint: "Chronic lower back pain x 3 months",
    status: "completed", 
    room: "OPD Cabin 3",
    vitals: { bp: "134/88", pulse: 82 }
  },
  { 
    id: "APT-2025122103", 
    patientId: "UHID-2023-00562", 
    patientName: "Mohammed Farooq", 
    patientAge: 67, 
    patientGender: "M", 
    time: "09:40", 
    endTime: "10:00", 
    type: "Review", 
    chiefComplaint: "Hip arthritis - medication review",
    status: "in_progress", 
    room: "OPD Cabin 3",
    vitals: { bp: "142/90", pulse: 78 }
  },
  { 
    id: "APT-2025122104", 
    patientId: "UHID-2024-02156", 
    patientName: "Anjali Sharma", 
    patientAge: 34, 
    patientGender: "F", 
    time: "10:00", 
    endTime: "10:20", 
    type: "New Consultation", 
    chiefComplaint: "Sports injury - ACL tear suspected",
    status: "arrived", 
    room: "OPD Cabin 3",
    vitals: { bp: "118/76", pulse: 72 }
  },
  { 
    id: "APT-2025122105", 
    patientId: "UHID-2022-00189", 
    patientName: "Gopal Reddy", 
    patientAge: 72, 
    patientGender: "M", 
    time: "10:20", 
    endTime: "10:40", 
    type: "Pre-Op Assessment", 
    chiefComplaint: "Total hip replacement - surgical fitness",
    status: "scheduled", 
    room: "OPD Cabin 3",
    vitals: null
  },
  { 
    id: "APT-2025122106", 
    patientId: "UHID-2024-01876", 
    patientName: "Kavitha Nair", 
    patientAge: 52, 
    patientGender: "F", 
    time: "10:40", 
    endTime: "11:00", 
    type: "Telehealth", 
    chiefComplaint: "Post-surgery rehab progress review",
    status: "scheduled", 
    room: null, 
    teleUrl: "https://meet.baines.health/apt-106"
  },
  { 
    id: "APT-2025122107", 
    patientId: "UHID-2024-02890", 
    patientName: "Suresh Babu", 
    patientAge: 48, 
    patientGender: "M", 
    time: "11:00", 
    endTime: "11:20", 
    type: "Injection Therapy", 
    chiefComplaint: "Platelet-rich plasma injection - shoulder",
    status: "scheduled", 
    room: "Procedure Room 2"
  },
  { 
    id: "APT-2025122108", 
    patientId: "UHID-2023-01456", 
    patientName: "Lakshmi Venkatesh", 
    patientAge: 61, 
    patientGender: "F", 
    time: "11:20", 
    endTime: "11:40", 
    type: "Review", 
    chiefComplaint: "Osteoporosis - DEXA scan results",
    status: "scheduled", 
    room: "OPD Cabin 3"
  },
  { 
    id: "APT-2025122109", 
    patientId: "UHID-2024-00234", 
    patientName: "Arjun Malhotra", 
    patientAge: 28, 
    patientGender: "M", 
    time: "14:00", 
    endTime: "14:20", 
    type: "New Consultation", 
    chiefComplaint: "Fracture non-union - left tibia",
    status: "scheduled", 
    room: "OPD Cabin 3"
  },
  { 
    id: "APT-2025122110", 
    patientId: "UHID-2024-01567", 
    patientName: "Meenakshi Iyer", 
    patientAge: 55, 
    patientGender: "F", 
    time: "14:20", 
    endTime: "14:40", 
    type: "Post-Op Review", 
    chiefComplaint: "Carpal tunnel release - wound check",
    status: "scheduled", 
    room: "OPD Cabin 3"
  },
  { 
    id: "APT-2025122111", 
    patientId: "UHID-2023-02341", 
    patientName: "Ravi Shankar", 
    patientAge: 64, 
    patientGender: "M", 
    time: "14:40", 
    endTime: "15:00", 
    type: "Review", 
    chiefComplaint: "Spinal stenosis - conservative mgmt",
    status: "no_show", 
    room: "OPD Cabin 3"
  },
  { 
    id: "APT-2025122112", 
    patientId: "UHID-2024-03012", 
    patientName: "Priya Menon", 
    patientAge: 42, 
    patientGender: "F", 
    time: "15:00", 
    endTime: "15:20", 
    type: "Second Opinion", 
    chiefComplaint: "Disc herniation - surgical vs conservative",
    status: "scheduled", 
    room: "OPD Cabin 3"
  },
];

// Mock data for doctor's patients - realistic hospital data
const mockDoctorPatients = [
  { 
    id: "UHID-2024-00847", 
    name: "Ramesh Krishnamurthy", 
    age: 58, 
    gender: "M", 
    lastVisit: "2025-12-21", 
    nextVisit: "2025-12-28", 
    diagnosis: "S/P Total Knee Replacement (L)",
    flags: ["Diabetes", "HTN"], 
    isPCP: true 
  },
  { 
    id: "UHID-2024-01234", 
    name: "Sunita Devi", 
    age: 45, 
    gender: "F", 
    lastVisit: "2025-12-21", 
    nextVisit: "2025-12-28", 
    diagnosis: "Lumbar Spondylosis",
    flags: [], 
    isPCP: true 
  },
  { 
    id: "UHID-2023-00562", 
    name: "Mohammed Farooq", 
    age: 67, 
    gender: "M", 
    lastVisit: "2025-12-21", 
    nextVisit: "2026-01-04", 
    diagnosis: "Bilateral Hip Osteoarthritis",
    flags: ["Cardiac", "CKD-3"], 
    isPCP: false 
  },
  { 
    id: "UHID-2022-00189", 
    name: "Gopal Reddy", 
    age: 72, 
    gender: "M", 
    lastVisit: "2025-12-14", 
    nextVisit: "2025-12-21", 
    diagnosis: "Avascular Necrosis - Hip",
    flags: ["Fall Risk", "Anticoag"], 
    isPCP: true 
  },
  { 
    id: "UHID-2024-01876", 
    name: "Kavitha Nair", 
    age: 52, 
    gender: "F", 
    lastVisit: "2025-12-18", 
    nextVisit: null, 
    diagnosis: "S/P Rotator Cuff Repair",
    flags: [], 
    isPCP: true 
  },
  { 
    id: "UHID-2023-01456", 
    name: "Lakshmi Venkatesh", 
    age: 61, 
    gender: "F", 
    lastVisit: "2025-12-07", 
    nextVisit: "2025-12-21", 
    diagnosis: "Osteoporosis with Compression Fx",
    flags: ["Fragility"], 
    isPCP: true 
  },
  { 
    id: "UHID-2024-02890", 
    name: "Suresh Babu", 
    age: 48, 
    gender: "M", 
    lastVisit: "2025-12-10", 
    nextVisit: "2025-12-21", 
    diagnosis: "Frozen Shoulder",
    flags: ["Diabetes"], 
    isPCP: false 
  },
  { 
    id: "UHID-2024-00234", 
    name: "Arjun Malhotra", 
    age: 28, 
    gender: "M", 
    lastVisit: "2025-11-28", 
    nextVisit: "2025-12-21", 
    diagnosis: "Tibial Fracture Non-Union",
    flags: ["Smoker"], 
    isPCP: true 
  },
];

const statusConfig: Record<string, { label: string; className: string }> = {
  scheduled: { label: "Scheduled", className: "bg-gray-100 text-gray-700" },
  arrived: { label: "Arrived", className: "bg-blue-100 text-blue-700" },
  in_progress: { label: "In Progress", className: "bg-primary text-primary-foreground" },
  completed: { label: "Completed", className: "bg-green-100 text-green-700" },
  no_show: { label: "No Show", className: "bg-amber-100 text-amber-700" },
  cancelled: { label: "Cancelled", className: "bg-red-100 text-red-700" },
};

export default function DoctorDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("today");
  
  const [doctor, setDoctor] = useState<Doctor | null>(null);
  const [locations, setLocations] = useState<Location[]>([]);
  const [weekPattern, setWeekPattern] = useState<DaySchedule[]>([]);
  const [leaves, setLeaves] = useState<Leave[]>([]);
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (id) {
      fetchData();
    }
  }, [id]);

  const fetchData = async () => {
    if (!id) return;
    setLoading(true);

    try {
      // Fetch doctor
      const { data: doctorData, error: doctorError } = await supabase
        .from('doctors')
        .select('*')
        .eq('id', id)
        .single();

      if (doctorError) throw doctorError;
      setDoctor(doctorData as Doctor);

      // Fetch locations
      const { data: locationsData } = await supabase
        .from('locations')
        .select('*')
        .eq('is_active', true);
      setLocations((locationsData || []) as Location[]);

      // Fetch schedule template
      const { data: templateData } = await supabase
        .from('schedule_templates')
        .select('*')
        .eq('doctor_id', id)
        .eq('is_active', true)
        .limit(1);

      if (templateData?.[0]) {
        setWeekPattern(templateData[0].week_pattern as unknown as DaySchedule[]);
      }

      // Fetch leaves
      const { data: leavesData } = await supabase
        .from('leaves')
        .select('*')
        .eq('doctor_id', id)
        .order('start_datetime', { ascending: true });
      setLeaves((leavesData || []) as Leave[]);

      // Fetch appointments
      const { data: appointmentsData } = await supabase
        .from('appointments')
        .select('*')
        .eq('doctor_id', id)
        .gte('start_time', new Date().toISOString())
        .order('start_time', { ascending: true });
      setAppointments((appointmentsData || []) as Appointment[]);

    } catch (error) {
      console.error('Error fetching data:', error);
      toast({ title: "Error loading doctor data", variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  const handleSaveSchedule = async (pattern: DaySchedule[]) => {
    if (!id) return;
    
    try {
      const { data: existingTemplate } = await supabase
        .from('schedule_templates')
        .select('id')
        .eq('doctor_id', id)
        .eq('is_active', true)
        .limit(1);

      if (existingTemplate?.[0]) {
        await supabase
          .from('schedule_templates')
          .update({ week_pattern: JSON.parse(JSON.stringify(pattern)), updated_at: new Date().toISOString() })
          .eq('id', existingTemplate[0].id);
      } else {
        await supabase
          .from('schedule_templates')
          .insert({
            doctor_id: id,
            name: 'Default Schedule',
            week_pattern: JSON.parse(JSON.stringify(pattern)),
            is_active: true,
          });
      }

      setWeekPattern(pattern);
      toast({ title: "Schedule saved successfully" });
    } catch (error) {
      console.error('Error saving schedule:', error);
      toast({ title: "Error saving schedule", variant: "destructive" });
    }
  };

  const handleCreateLeave = async (leave: Omit<Leave, 'id' | 'status'>) => {
    try {
      const { data, error } = await supabase
        .from('leaves')
        .insert({ ...leave, status: 'active' })
        .select()
        .single();

      if (error) throw error;
      setLeaves([...leaves, data as Leave]);
      toast({ title: "Leave created successfully" });
    } catch (error) {
      console.error('Error creating leave:', error);
      toast({ title: "Error creating leave", variant: "destructive" });
    }
  };

  const handleCancelLeave = async (leaveId: string) => {
    try {
      await supabase
        .from('leaves')
        .update({ status: 'cancelled' })
        .eq('id', leaveId);

      setLeaves(leaves.map(l => l.id === leaveId ? { ...l, status: 'cancelled' as const } : l));
      toast({ title: "Leave cancelled" });
    } catch (error) {
      console.error('Error cancelling leave:', error);
      toast({ title: "Error cancelling leave", variant: "destructive" });
    }
  };

  // Calculate KPIs from mock data
  const todayAppointments = mockTodayAppointments;
  const completedCount = todayAppointments.filter(a => a.status === 'completed').length;
  const noShowCount = todayAppointments.filter(a => a.status === 'no_show').length;
  const pendingCount = todayAppointments.filter(a => ['scheduled', 'arrived'].includes(a.status)).length;

  if (loading) {
    return (
      <div className="min-h-screen flex w-full bg-background">
        <AppSidebar />
        <PageContent>
          <AppHeader breadcrumbs={["Doctors", "Loading..."]} />
          <main className="p-6">
            <div className="animate-pulse space-y-6">
              <div className="h-40 bg-muted rounded-lg" />
              <div className="h-80 bg-muted rounded-lg" />
            </div>
          </main>
        </PageContent>
      </div>
    );
  }

  if (!doctor) {
    return (
      <div className="min-h-screen flex w-full bg-background">
        <AppSidebar />
        <PageContent>
          <AppHeader breadcrumbs={["Doctors", "Not Found"]} />
          <main className="p-6">
            <Card className="p-12 text-center">
              <h2 className="text-lg font-semibold mb-2">Doctor not found</h2>
              <p className="text-muted-foreground mb-4">The doctor you're looking for doesn't exist.</p>
              <Button onClick={() => navigate('/doctors')}>Back to Doctors</Button>
            </Card>
          </main>
        </PageContent>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex w-full bg-background">
      <AppSidebar />
      <PageContent>
        <AppHeader breadcrumbs={["Doctors", doctor.name]} />
        
        <main className="p-6 space-y-6">
          {/* Back Button */}
          <Button variant="ghost" size="sm" onClick={() => navigate('/doctors')} className="gap-2">
            <ArrowLeft className="w-4 h-4" />
            Back to Doctors
          </Button>

          {/* Doctor Header */}
          <Card className="p-6">
            <div className="flex items-start justify-between">
              <div className="flex items-start gap-4">
                <Avatar className="h-20 w-20">
                  <AvatarImage src={doctor.avatar_url || undefined} />
                  <AvatarFallback className="bg-primary/10 text-primary text-xl">
                    {doctor.name.split(" ").slice(0, 2).map(n => n[0]).join("")}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <h1 className="text-xl font-semibold text-foreground">{doctor.name}</h1>
                  <p className="text-muted-foreground">{doctor.degrees || "MBBS, MD"}</p>
                  <div className="flex items-center gap-4 mt-2 text-sm text-muted-foreground">
                    <span className="flex items-center gap-1">
                      <MapPin className="w-4 h-4" />
                      Main Clinic
                    </span>
                    <span className="flex items-center gap-1">
                      <Clock className="w-4 h-4" />
                      {doctor.default_duration} min slots
                    </span>
                  </div>
                  <div className="flex items-center gap-4 mt-2 text-sm text-muted-foreground">
                    <span className="flex items-center gap-1">
                      <Phone className="w-4 h-4" />
                      +91 98XXX XXXXX
                    </span>
                    <span className="flex items-center gap-1">
                      <Mail className="w-4 h-4" />
                      doctor@gooddoc.app
                    </span>
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Badge variant={doctor.status === 'active' ? 'default' : 'secondary'}>
                  {doctor.status.charAt(0).toUpperCase() + doctor.status.slice(1)}
                </Badge>
                <Button variant="outline" size="sm" onClick={() => navigate(`/doctors/${id}/edit`)}>
                  <Edit className="w-4 h-4 mr-2" />
                  Edit Profile
                </Button>
              </div>
            </div>

            {/* KPI Cards */}
            <div className="grid grid-cols-4 gap-4 mt-6">
              <div className="bg-muted/30 rounded-lg p-4">
                <div className="text-2xl font-semibold text-foreground">{todayAppointments.length}</div>
                <div className="text-sm text-muted-foreground">Today's Appointments</div>
              </div>
              <div className="bg-green-50 dark:bg-green-900/20 rounded-lg p-4">
                <div className="text-2xl font-semibold text-green-700 dark:text-green-400">{completedCount}</div>
                <div className="text-sm text-muted-foreground">Completed</div>
              </div>
              <div className="bg-amber-50 dark:bg-amber-900/20 rounded-lg p-4">
                <div className="text-2xl font-semibold text-amber-700 dark:text-amber-400">{noShowCount}</div>
                <div className="text-sm text-muted-foreground">No Shows</div>
              </div>
              <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-4">
                <div className="text-2xl font-semibold text-blue-700 dark:text-blue-400">{pendingCount}</div>
                <div className="text-sm text-muted-foreground">Pending</div>
              </div>
            </div>
          </Card>

          {/* Tabs */}
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="bg-transparent border-b border-border rounded-none h-auto p-0 justify-start w-full">
              <TabsTrigger value="today" className="tab-trigger rounded-none border-b-0 data-[state=active]:bg-transparent px-4 py-3">
                Today
              </TabsTrigger>
              <TabsTrigger value="availability" className="tab-trigger rounded-none border-b-0 data-[state=active]:bg-transparent px-4 py-3">
                Availability
              </TabsTrigger>
              <TabsTrigger value="calendar" className="tab-trigger rounded-none border-b-0 data-[state=active]:bg-transparent px-4 py-3">
                Calendar
              </TabsTrigger>
              <TabsTrigger value="patients" className="tab-trigger rounded-none border-b-0 data-[state=active]:bg-transparent px-4 py-3">
                Patients
              </TabsTrigger>
            </TabsList>

            {/* Today Tab */}
            <TabsContent value="today" className="mt-6">
              <Card className="overflow-hidden">
                <div className="p-4 border-b border-border bg-muted/30">
                  <h2 className="text-sm font-medium text-foreground">Today's Agenda - {format(new Date(), 'EEEE, MMMM d, yyyy')}</h2>
                </div>
                <div className="divide-y divide-border">
                  {todayAppointments.map((apt) => (
                    <div key={apt.id} className={`flex items-center justify-between p-4 hover:bg-muted/20 transition-colors ${apt.status === 'in_progress' ? 'bg-primary/5 border-l-4 border-l-primary' : ''}`}>
                      <div className="flex items-center gap-4">
                        <div className="text-center min-w-[60px]">
                          <div className="text-sm font-semibold text-foreground">
                            {apt.time}
                          </div>
                          <div className="text-xs text-muted-foreground">
                            {apt.endTime}
                          </div>
                        </div>
                        <div className="w-px h-10 bg-border" />
                        <div 
                          className="cursor-pointer hover:text-primary min-w-[180px]"
                          onClick={() => navigate(`/patient-insights/${apt.patientId}?from=doctor-detail`)}
                        >
                          <div className="text-sm font-medium text-foreground hover:underline">
                            {apt.patientName}
                          </div>
                          <div className="text-xs text-muted-foreground">
                            {apt.patientId} • {apt.patientAge}Y {apt.patientGender}
                          </div>
                        </div>
                        <div className="flex-1 min-w-[200px]">
                          <Badge variant="outline" className="text-xs mb-1">{apt.type}</Badge>
                          <div className="text-xs text-muted-foreground line-clamp-1">
                            {apt.chiefComplaint}
                          </div>
                        </div>
                        {apt.vitals && (
                          <div className="text-xs text-muted-foreground bg-muted/50 px-2 py-1 rounded">
                            BP: {apt.vitals.bp} | P: {apt.vitals.pulse}
                          </div>
                        )}
                      </div>
                      <div className="flex items-center gap-3">
                        {apt.teleUrl && (
                          <Button variant="default" size="sm" className="gap-1">
                            <Video className="w-4 h-4" />
                            Join Call
                          </Button>
                        )}
                        {apt.room && (
                          <span className="text-xs text-muted-foreground bg-muted/50 px-2 py-1 rounded">{apt.room}</span>
                        )}
                        <Badge className={statusConfig[apt.status]?.className || ''}>
                          {statusConfig[apt.status]?.label || apt.status}
                        </Badge>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon" className="h-8 w-8">
                              <MoreVertical className="w-4 h-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem onClick={() => toast({ title: "Marked as Arrived" })}>
                              <CheckCircle className="w-4 h-4 mr-2" />
                              Mark Arrived
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => toast({ title: "Started Consultation" })}>
                              <AlertCircle className="w-4 h-4 mr-2" />
                              Start Consultation
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => toast({ title: "Marked as Completed" })}>
                              <CheckCircle className="w-4 h-4 mr-2" />
                              Mark Completed
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => toast({ title: "Marked as No Show" })}>
                              <XCircle className="w-4 h-4 mr-2" />
                              Mark No Show
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => navigate(`/book-appointment?reschedule=${apt.id}`)}>
                              <Calendar className="w-4 h-4 mr-2" />
                              Reschedule
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
                    </div>
                  ))}
                  {todayAppointments.length === 0 && (
                    <div className="p-12 text-center text-muted-foreground">
                      No appointments scheduled for today
                    </div>
                  )}
                </div>
              </Card>
            </TabsContent>

            {/* Availability Tab */}
            <TabsContent value="availability" className="mt-6 space-y-6">
              <ScheduleBuilder
                doctorId={id!}
                weekPattern={weekPattern}
                locations={locations}
                defaultDuration={doctor.default_duration}
                defaultBuffer={doctor.default_buffer}
                onSave={handleSaveSchedule}
              />
              <LeaveManagement
                doctorId={id!}
                doctorName={doctor.name}
                leaves={leaves}
                onCreateLeave={handleCreateLeave}
                onCancelLeave={handleCancelLeave}
              />
            </TabsContent>

            {/* Calendar Tab */}
            <TabsContent value="calendar" className="mt-6">
              <DoctorCalendar
                doctorId={id!}
                doctorName={doctor.name}
                weekPattern={weekPattern}
                leaves={leaves}
                appointments={appointments}
              />
            </TabsContent>

            {/* Patients Tab */}
            <TabsContent value="patients" className="mt-6">
              <Card className="overflow-hidden">
                <div className="p-4 border-b border-border bg-muted/30 flex items-center justify-between">
                  <h2 className="text-sm font-medium text-foreground">Active Patients ({mockDoctorPatients.length})</h2>
                </div>
                <div className="divide-y divide-border">
                  {mockDoctorPatients.map((patient) => (
                    <div key={patient.id} className="flex items-center justify-between p-4 hover:bg-muted/20 transition-colors">
                      <div 
                        className="flex items-center gap-4 cursor-pointer flex-1"
                        onClick={() => navigate(`/patient-insights/${patient.id}?from=doctor-detail`)}
                      >
                        <Avatar className="h-10 w-10">
                          <AvatarFallback className={patient.gender === 'F' ? 'bg-pink-100 text-pink-700' : 'bg-blue-100 text-blue-700'}>
                            {patient.name.split(" ").map(n => n[0]).join("").slice(0, 2)}
                          </AvatarFallback>
                        </Avatar>
                        <div className="min-w-[160px]">
                          <div className="text-sm font-medium text-foreground hover:underline">
                            {patient.name}
                          </div>
                          <div className="text-xs text-muted-foreground">
                            {patient.id} • {patient.age}Y {patient.gender}
                          </div>
                        </div>
                        <div className="flex-1">
                          <div className="text-sm text-foreground">{patient.diagnosis}</div>
                          {patient.isPCP && (
                            <span className="text-xs text-primary">Primary Care Patient</span>
                          )}
                        </div>
                      </div>
                      <div className="flex items-center gap-4">
                        <div className="text-right min-w-[90px]">
                          <div className="text-xs text-muted-foreground">Last visit</div>
                          <div className="text-sm text-foreground">{format(parseISO(patient.lastVisit), 'dd MMM')}</div>
                        </div>
                        <div className="text-right min-w-[90px]">
                          <div className="text-xs text-muted-foreground">Next visit</div>
                          <div className="text-sm text-foreground">
                            {patient.nextVisit ? format(parseISO(patient.nextVisit), 'dd MMM') : '—'}
                          </div>
                        </div>
                        {patient.flags.length > 0 && (
                          <div className="flex gap-1 flex-wrap max-w-[150px]">
                            {patient.flags.map((flag) => (
                              <Badge key={flag} variant="outline" className="text-xs bg-amber-50 text-amber-700 border-amber-200">
                                {flag}
                              </Badge>
                            ))}
                          </div>
                        )}
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={(e) => {
                            e.stopPropagation();
                            navigate(`/book-appointment?patientId=${patient.id}&doctorId=${id}`);
                          }}
                        >
                          Book
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </Card>
            </TabsContent>
          </Tabs>
        </main>
      </PageContent>
    </div>
  );
}
