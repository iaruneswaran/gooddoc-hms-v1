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
import { format, parseISO, startOfDay, endOfDay, differenceInYears } from "date-fns";

interface PatientData {
  id: string;
  gdid: string;
  first_name: string;
  last_name: string;
  gender: string;
  date_of_birth: string;
  phone: string;
}

interface TodayAppointment extends Appointment {
  patient?: PatientData | null;
  appointment_type?: {
    name: string;
  } | null;
  location?: {
    name: string;
  } | null;
}

// Helper to calculate age from date of birth
const calculateAge = (dob: string): number => {
  return differenceInYears(new Date(), parseISO(dob));
};

const statusConfig: Record<string, { label: string; className: string }> = {
  held: { label: "Held", className: "bg-gray-100 text-gray-700" },
  booked: { label: "Booked", className: "bg-blue-100 text-blue-700" },
  checked_in: { label: "Checked In", className: "bg-primary text-primary-foreground" },
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
  const [todayAppointments, setTodayAppointments] = useState<TodayAppointment[]>([]);
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

      // Fetch all future appointments for calendar
      const { data: appointmentsData } = await supabase
        .from('appointments')
        .select('*')
        .eq('doctor_id', id)
        .gte('start_time', new Date().toISOString())
        .order('start_time', { ascending: true });
      setAppointments((appointmentsData || []) as Appointment[]);

      // Fetch today's appointments with related data
      const today = new Date();
      const todayStart = startOfDay(today).toISOString();
      const todayEnd = endOfDay(today).toISOString();

      const { data: todayData } = await supabase
        .from('appointments')
        .select(`
          *,
          appointment_type:appointment_types (
            name
          ),
          location:locations (
            name
          )
        `)
        .eq('doctor_id', id)
        .gte('start_time', todayStart)
        .lte('start_time', todayEnd)
        .order('start_time', { ascending: true });

      // Fetch patient details separately for each appointment
      const todayAptsWithPatients: TodayAppointment[] = [];
      for (const apt of (todayData || [])) {
        let patientData = null;
        if (apt.patient_id) {
          const { data: patient } = await supabase
            .from('patients')
            .select('id, gdid, first_name, last_name, gender, date_of_birth, phone')
            .eq('id', apt.patient_id)
            .single();
          patientData = patient;
        }
        todayAptsWithPatients.push({
          ...apt,
          patient: patientData,
        } as TodayAppointment);
      }

      setTodayAppointments(todayAptsWithPatients);

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

  // Calculate KPIs from real appointments
  const completedCount = todayAppointments.filter(a => a.status === 'completed').length;
  const noShowCount = todayAppointments.filter(a => a.status === 'no_show').length;
  const pendingCount = todayAppointments.filter(a => ['booked', 'held', 'checked_in'].includes(a.status)).length;

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
                  {todayAppointments.map((apt) => {
                    const patientName = apt.patient 
                      ? `${apt.patient.first_name} ${apt.patient.last_name}` 
                      : apt.patient_name || 'Unknown Patient';
                    const patientAge = apt.patient?.date_of_birth 
                      ? calculateAge(apt.patient.date_of_birth) 
                      : null;
                    const patientGender = apt.patient?.gender || '';
                    const patientGdid = apt.patient?.gdid || apt.patient_id;
                    const appointmentType = apt.appointment_type?.name || (apt.mode === 'telehealth' ? 'Telehealth' : 'Consultation');
                    const locationName = apt.location?.name || null;
                    const isTelehealth = apt.mode === 'telehealth';

                    return (
                      <div key={apt.id} className={`flex items-center justify-between p-4 hover:bg-muted/20 transition-colors ${apt.status === 'checked_in' ? 'bg-primary/5 border-l-4 border-l-primary' : ''}`}>
                        <div className="flex items-center gap-4">
                          <div className="text-center min-w-[60px]">
                            <div className="text-sm font-semibold text-foreground">
                              {format(parseISO(apt.start_time), 'HH:mm')}
                            </div>
                            <div className="text-xs text-muted-foreground">
                              {format(parseISO(apt.end_time), 'HH:mm')}
                            </div>
                          </div>
                          <div className="w-px h-10 bg-border" />
                          <div 
                            className="cursor-pointer hover:text-primary min-w-[180px]"
                            onClick={() => navigate(`/patient-insights/${apt.patient_id}?from=doctor-detail`)}
                          >
                            <div className="text-sm font-medium text-foreground hover:underline">
                              {patientName}
                            </div>
                            <div className="text-xs text-muted-foreground">
                              {patientGdid} {patientAge ? `• ${patientAge}Y` : ''} {patientGender ? patientGender.charAt(0).toUpperCase() : ''}
                            </div>
                          </div>
                          <div className="flex-1 min-w-[200px]">
                            <Badge variant="outline" className="text-xs mb-1">{appointmentType}</Badge>
                            {apt.notes && (
                              <div className="text-xs text-muted-foreground line-clamp-1">
                                {apt.notes}
                              </div>
                            )}
                          </div>
                        </div>
                        <div className="flex items-center gap-3">
                          {isTelehealth && (
                            <Button variant="default" size="sm" className="gap-1">
                              <Video className="w-4 h-4" />
                              Join Call
                            </Button>
                          )}
                          {locationName && (
                            <span className="text-xs text-muted-foreground bg-muted/50 px-2 py-1 rounded">{locationName}</span>
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
                              <DropdownMenuItem onClick={() => toast({ title: "Checked In" })}>
                                <CheckCircle className="w-4 h-4 mr-2" />
                                Check In
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
                    );
                  })}
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
                  <h2 className="text-sm font-medium text-foreground">Today's Patients ({todayAppointments.filter(a => a.patient).length})</h2>
                </div>
                <div className="divide-y divide-border">
                  {todayAppointments.filter(apt => apt.patient).map((apt) => {
                    const patient = apt.patient!;
                    const patientName = `${patient.first_name} ${patient.last_name}`;
                    const patientAge = patient.date_of_birth ? calculateAge(patient.date_of_birth) : null;
                    
                    return (
                      <div key={apt.id} className="flex items-center justify-between p-4 hover:bg-muted/20 transition-colors">
                        <div 
                          className="flex items-center gap-4 cursor-pointer flex-1"
                          onClick={() => navigate(`/patient-insights/${patient.id}?from=doctor-detail`)}
                        >
                          <Avatar className="h-10 w-10">
                            <AvatarFallback className={patient.gender?.toLowerCase() === 'female' || patient.gender?.toLowerCase() === 'f' ? 'bg-pink-100 text-pink-700' : 'bg-blue-100 text-blue-700'}>
                              {patientName.split(" ").map(n => n[0]).join("").slice(0, 2)}
                            </AvatarFallback>
                          </Avatar>
                          <div className="min-w-[160px]">
                            <div className="text-sm font-medium text-foreground hover:underline">
                              {patientName}
                            </div>
                            <div className="text-xs text-muted-foreground">
                              {patient.gdid} {patientAge ? `• ${patientAge}Y` : ''} {patient.gender?.charAt(0).toUpperCase() || ''}
                            </div>
                          </div>
                          <div className="flex-1">
                            <Badge variant="outline" className="text-xs">
                              {apt.appointment_type?.name || 'Consultation'}
                            </Badge>
                            {apt.notes && (
                              <div className="text-xs text-muted-foreground mt-1 line-clamp-1">{apt.notes}</div>
                            )}
                          </div>
                        </div>
                        <div className="flex items-center gap-4">
                          <div className="text-right min-w-[90px]">
                            <div className="text-xs text-muted-foreground">Appointment</div>
                            <div className="text-sm text-foreground">{format(parseISO(apt.start_time), 'HH:mm')}</div>
                          </div>
                          <Badge className={statusConfig[apt.status]?.className || ''}>
                            {statusConfig[apt.status]?.label || apt.status}
                          </Badge>
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
                    );
                  })}
                  {todayAppointments.filter(a => a.patient).length === 0 && (
                    <div className="p-12 text-center text-muted-foreground">
                      No patients with appointments today
                    </div>
                  )}
                </div>
              </Card>
            </TabsContent>
          </Tabs>
        </main>
      </PageContent>
    </div>
  );
}
