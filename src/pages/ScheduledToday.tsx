import { useState } from "react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { PatientCell } from "@/components/overview/PatientCell";
import { appointmentRequests, AppointmentRequestRecord } from "@/data/overview.mock";
import { AppSidebar } from "@/components/AppSidebar";
import { AppHeader } from "@/components/AppHeader";
import { PageContent } from "@/components/PageContent";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
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
import { User, Calendar, Clock, Stethoscope, MapPin, FileText, Hash, Search, Download, Printer, MoreHorizontal, ChevronLeft, ChevronRight, ArrowLeft } from "lucide-react";

// Mock data for Laboratory tab - appointment-style like Outpatient
interface LaboratoryAppointmentRecord {
  requestId: string;
  patient: string;
  ageSex: string;
  contact: string;
  email: string;
  testName: string;
  testCode: string;
  category: string;
  preferredDate: string;
  preferredTime: string;
  referredBy: string;
  priority: "Routine" | "Urgent" | "STAT";
  status: "Pending" | "Scheduled" | "Sample Collected" | "In Progress" | "Completed";
  visitType: "In-patient" | "Home";
}

const laboratoryData: LaboratoryAppointmentRecord[] = [
  { requestId: "LB1A2C", patient: "Ravi Sharma", ageSex: "45 / M", contact: "9876543210", email: "ravi.sharma@email.com", testName: "Complete Blood Count (CBC)", testCode: "CBC001", category: "Hematology", preferredDate: "21 Dec 2025", preferredTime: "09:00 AM", referredBy: "Dr. Meera Nair", priority: "Routine", status: "Pending", visitType: "In-patient" },
  { requestId: "LB3D4E", patient: "Priya Menon", ageSex: "32 / F", contact: "9876543211", email: "priya.menon@email.com", testName: "Lipid Profile", testCode: "LIP001", category: "Biochemistry", preferredDate: "21 Dec 2025", preferredTime: "10:00 AM", referredBy: "Dr. Rajesh Kumar", priority: "Routine", status: "Scheduled", visitType: "Home" },
  { requestId: "LB5F6G", patient: "Anil Kapoor", ageSex: "58 / M", contact: "9876543212", email: "anil.kapoor@email.com", testName: "Liver Function Test (LFT)", testCode: "LFT001", category: "Biochemistry", preferredDate: "21 Dec 2025", preferredTime: "11:00 AM", referredBy: "Dr. Anita Singh", priority: "Urgent", status: "Sample Collected", visitType: "In-patient" },
  { requestId: "LB7H8J", patient: "Sunita Rao", ageSex: "41 / F", contact: "9876543213", email: "sunita.rao@email.com", testName: "Kidney Function Test (KFT)", testCode: "KFT001", category: "Biochemistry", preferredDate: "21 Dec 2025", preferredTime: "02:00 PM", referredBy: "Dr. Sunil Reddy", priority: "Routine", status: "In Progress", visitType: "Home" },
  { requestId: "LB9K1L", patient: "Mohan Iyer", ageSex: "65 / M", contact: "9876543214", email: "mohan.iyer@email.com", testName: "Thyroid Profile (T3, T4, TSH)", testCode: "THY001", category: "Endocrinology", preferredDate: "21 Dec 2025", preferredTime: "03:00 PM", referredBy: "Dr. Prakash Shah", priority: "STAT", status: "Pending", visitType: "In-patient" },
  { requestId: "LB2M3N", patient: "Kavitha Nair", ageSex: "29 / F", contact: "9876543215", email: "kavitha.nair@email.com", testName: "HbA1c", testCode: "HBA001", category: "Diabetes", preferredDate: "22 Dec 2025", preferredTime: "09:00 AM", referredBy: "Dr. Priya Menon", priority: "Routine", status: "Completed", visitType: "Home" },
  { requestId: "LB4P5Q", patient: "Vikram Singh", ageSex: "52 / M", contact: "9876543216", email: "vikram.singh@email.com", testName: "Urinalysis", testCode: "URI001", category: "Urology", preferredDate: "22 Dec 2025", preferredTime: "10:00 AM", referredBy: "Dr. Arun Bhat", priority: "Routine", status: "Pending", visitType: "In-patient" },
  { requestId: "LB6R7S", patient: "Deepa Krishnan", ageSex: "38 / F", contact: "9876543217", email: "deepa.k@email.com", testName: "Vitamin D", testCode: "VIT001", category: "Biochemistry", preferredDate: "22 Dec 2025", preferredTime: "11:00 AM", referredBy: "Dr. Sunita Rao", priority: "Routine", status: "Scheduled", visitType: "Home" },
  { requestId: "LB8T9U", patient: "Rajendra Prasad", ageSex: "60 / M", contact: "9876543218", email: "raj.prasad@email.com", testName: "Vitamin B12", testCode: "VIT002", category: "Biochemistry", preferredDate: "22 Dec 2025", preferredTime: "02:00 PM", referredBy: "Dr. Meera Nair", priority: "Urgent", status: "Pending", visitType: "In-patient" },
  { requestId: "LB1V2W", patient: "Lakshmi Devi", ageSex: "48 / F", contact: "9876543219", email: "lakshmi.d@email.com", testName: "Iron Studies", testCode: "IRO001", category: "Hematology", preferredDate: "22 Dec 2025", preferredTime: "03:00 PM", referredBy: "Dr. Rajesh Kumar", priority: "Routine", status: "Sample Collected", visitType: "Home" },
];

// Mock data for Scheduled tab - confirmed appointments from OP and Lab
interface ScheduledAppointmentRecord {
  appointmentId: string;
  patient: string;
  ageSex: string;
  contact: string;
  email: string;
  appointmentType: "Outpatient" | "Laboratory";
  scheduledDate: string;
  scheduledTime: string;
  doctor: string;
  department: string;
  testCode?: string;
  visitType: "First Visit" | "Follow up" | "In-patient" | "Home";
  status: "Confirmed" | "Checked In" | "In Progress" | "Completed" | "No Show";
}

const scheduledData: ScheduledAppointmentRecord[] = [
  { appointmentId: "APT001", patient: "Ravi Sharma", ageSex: "45 / M", contact: "9876543210", email: "ravi.sharma@email.com", appointmentType: "Outpatient", scheduledDate: "21 Dec 2025", scheduledTime: "09:00 AM", doctor: "Dr. Meera Nair", department: "Cardiology", visitType: "First Visit", status: "Confirmed" },
  { appointmentId: "APT002", patient: "Priya Menon", ageSex: "32 / F", contact: "9876543211", email: "priya.menon@email.com", appointmentType: "Laboratory", scheduledDate: "21 Dec 2025", scheduledTime: "09:30 AM", doctor: "Dr. Rajesh Kumar", department: "Biochemistry", testCode: "LIP001", visitType: "Home", status: "Confirmed" },
  { appointmentId: "APT003", patient: "Anil Kapoor", ageSex: "58 / M", contact: "9876543212", email: "anil.kapoor@email.com", appointmentType: "Outpatient", scheduledDate: "21 Dec 2025", scheduledTime: "10:00 AM", doctor: "Dr. Anita Singh", department: "Neurology", visitType: "Follow up", status: "Checked In" },
  { appointmentId: "APT004", patient: "Sunita Rao", ageSex: "41 / F", contact: "9876543213", email: "sunita.rao@email.com", appointmentType: "Laboratory", scheduledDate: "21 Dec 2025", scheduledTime: "10:30 AM", doctor: "Dr. Sunil Reddy", department: "Biochemistry", testCode: "KFT001", visitType: "In-patient", status: "In Progress" },
  { appointmentId: "APT005", patient: "Mohan Iyer", ageSex: "65 / M", contact: "9876543214", email: "mohan.iyer@email.com", appointmentType: "Outpatient", scheduledDate: "21 Dec 2025", scheduledTime: "11:00 AM", doctor: "Dr. Prakash Shah", department: "ENT", visitType: "First Visit", status: "Confirmed" },
  { appointmentId: "APT006", patient: "Kavitha Nair", ageSex: "29 / F", contact: "9876543215", email: "kavitha.nair@email.com", appointmentType: "Laboratory", scheduledDate: "21 Dec 2025", scheduledTime: "11:30 AM", doctor: "Dr. Priya Menon", department: "Diabetes", testCode: "HBA001", visitType: "Home", status: "Completed" },
  { appointmentId: "APT007", patient: "Vikram Singh", ageSex: "52 / M", contact: "9876543216", email: "vikram.singh@email.com", appointmentType: "Outpatient", scheduledDate: "21 Dec 2025", scheduledTime: "02:00 PM", doctor: "Dr. Arun Bhat", department: "Gastroenterology", visitType: "Follow up", status: "Confirmed" },
  { appointmentId: "APT008", patient: "Deepa Krishnan", ageSex: "38 / F", contact: "9876543217", email: "deepa.k@email.com", appointmentType: "Laboratory", scheduledDate: "21 Dec 2025", scheduledTime: "02:30 PM", doctor: "Dr. Sunita Rao", department: "Biochemistry", testCode: "VIT001", visitType: "In-patient", status: "Confirmed" },
  { appointmentId: "APT009", patient: "Rajendra Prasad", ageSex: "60 / M", contact: "9876543218", email: "raj.prasad@email.com", appointmentType: "Outpatient", scheduledDate: "21 Dec 2025", scheduledTime: "03:00 PM", doctor: "Dr. Meera Nair", department: "Cardiology", visitType: "Follow up", status: "No Show" },
  { appointmentId: "APT010", patient: "Lakshmi Devi", ageSex: "48 / F", contact: "9876543219", email: "lakshmi.d@email.com", appointmentType: "Laboratory", scheduledDate: "21 Dec 2025", scheduledTime: "03:30 PM", doctor: "Dr. Rajesh Kumar", department: "Hematology", testCode: "IRO001", visitType: "Home", status: "Confirmed" },
];

type TabType = "outpatient" | "laboratory" | "scheduled";

const AppointmentRequests = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<TabType>("outpatient");
  const [selectedRequest, setSelectedRequest] = useState<AppointmentRequestRecord | null>(null);
  const [showSummary, setShowSummary] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [visitTypeFilter, setVisitTypeFilter] = useState("all");
  const [departmentFilter, setDepartmentFilter] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 25;

  const getVisitTypeLabel = (visitType: string): string => {
    return visitType === "Follow-up" ? "Follow up" : "First Visit";
  };

  const getVisitTypeBadgeStyle = (visitType: string): string => {
    return visitType === "Follow-up" 
      ? "bg-blue-100 text-blue-700" 
      : "bg-green-100 text-green-700";
  };

  const handleViewSummary = (row: AppointmentRequestRecord) => {
    setSelectedRequest(row);
    setShowSummary(true);
  };

  const getTabCount = () => {
    switch (activeTab) {
      case "outpatient": return appointmentRequests.length;
      case "laboratory": return laboratoryData.length;
      case "scheduled": return scheduledData.length;
    }
  };

  const totalPages = Math.ceil(getTabCount() / pageSize);

  const renderOutpatientTable = () => {
    const paginatedData = appointmentRequests.slice((currentPage - 1) * pageSize, currentPage * pageSize);
    
    return (
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead style={{ width: "220px", minWidth: "220px" }}>Patient Info</TableHead>
            <TableHead>Contact</TableHead>
            <TableHead>Request ID</TableHead>
            <TableHead>Preferred Date</TableHead>
            <TableHead>Preferred Time</TableHead>
            <TableHead>Doctor</TableHead>
            <TableHead>Department</TableHead>
            <TableHead>Visit Type</TableHead>
            <TableHead style={{ width: "140px" }}></TableHead>
            <TableHead style={{ width: "80px" }}>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {paginatedData.map((row) => (
            <TableRow 
              key={row.requestId} 
              className="cursor-pointer hover:bg-muted/50"
              onClick={() => navigate(`/book-appointment?requestId=${row.requestId}`)}
            >
              <TableCell style={{ width: "220px", minWidth: "220px" }}>
                <PatientCell name={row.patient} gdid={row.requestId} ageSex={row.ageSex} patientId={row.requestId} fromPage="scheduled" />
              </TableCell>
              <TableCell>
                <div className="flex flex-col">
                  <span>{row.contact}</span>
                  <span className="text-muted-foreground text-xs">{row.email}</span>
                </div>
              </TableCell>
              <TableCell className="font-medium">{row.requestId}</TableCell>
              <TableCell>{row.preferredDate}</TableCell>
              <TableCell>{row.preferredTime}</TableCell>
              <TableCell>{row.preferredProvider || "Any"}</TableCell>
              <TableCell>{row.department}</TableCell>
              <TableCell>
                <Badge variant="outline" className={getVisitTypeBadgeStyle(row.visitType)}>
                  {getVisitTypeLabel(row.visitType)}
                </Badge>
              </TableCell>
              <TableCell>
                <Button 
                  size="sm" 
                  onClick={(e) => {
                    e.stopPropagation();
                    navigate(`/book-appointment?requestId=${row.requestId}`);
                  }}
                >
                  Schedule Now
                </Button>
              </TableCell>
              <TableCell onClick={(e) => e.stopPropagation()}>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon">
                      <MoreHorizontal className="w-4 h-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="bg-popover border shadow-md z-50">
                    <DropdownMenuItem onClick={() => handleViewSummary(row)}>View Appointment Summary</DropdownMenuItem>
                    <DropdownMenuItem onClick={() => navigate(`/book-appointment?requestId=${row.requestId}`)}>Schedule Now</DropdownMenuItem>
                    <DropdownMenuItem onClick={() => console.log("Contact", row.contact)}>Contact Patient</DropdownMenuItem>
                    <DropdownMenuItem onClick={() => console.log("Reject", row.requestId)}>Reject</DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    );
  };

  const getPriorityBadgeStyle = (priority: string): string => {
    switch (priority) {
      case "STAT": return "bg-red-100 text-red-700";
      case "Urgent": return "bg-amber-100 text-amber-700";
      default: return "bg-blue-100 text-blue-700";
    }
  };

  const getLabStatusBadgeStyle = (status: string): string => {
    switch (status) {
      case "Completed": return "bg-green-100 text-green-700";
      case "In Progress": return "bg-blue-100 text-blue-700";
      case "Sample Collected": return "bg-purple-100 text-purple-700";
      case "Scheduled": return "bg-cyan-100 text-cyan-700";
      default: return "bg-gray-100 text-gray-700";
    }
  };

  const renderLaboratoryTable = () => {
    const paginatedLabData = laboratoryData.slice((currentPage - 1) * pageSize, currentPage * pageSize);
    
    return (
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead style={{ width: "220px", minWidth: "220px" }}>Patient Info</TableHead>
            <TableHead>Contact</TableHead>
            <TableHead>Order ID</TableHead>
            <TableHead>Test Type</TableHead>
            <TableHead>Preferred Date</TableHead>
            <TableHead>Preferred Time</TableHead>
            <TableHead>Ordered By</TableHead>
            <TableHead>Visit Type</TableHead>
            <TableHead style={{ width: "140px" }}></TableHead>
            <TableHead style={{ width: "80px" }}>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {paginatedLabData.map((row) => (
            <TableRow 
              key={row.requestId} 
              className="cursor-pointer hover:bg-muted/50"
              onClick={() => navigate(`/laboratory/booking?requestId=${row.requestId}`)}
            >
              <TableCell style={{ width: "220px", minWidth: "220px" }}>
                <PatientCell name={row.patient} gdid={row.requestId} ageSex={row.ageSex} patientId={row.requestId} fromPage="scheduled" />
              </TableCell>
              <TableCell>
                <div className="flex flex-col">
                  <span>{row.contact}</span>
                  <span className="text-muted-foreground text-xs">{row.email}</span>
                </div>
              </TableCell>
              <TableCell className="font-medium">{row.requestId}</TableCell>
              <TableCell>{row.testCode}</TableCell>
              <TableCell>{row.preferredDate}</TableCell>
              <TableCell>{row.preferredTime}</TableCell>
              <TableCell>{row.referredBy}</TableCell>
              <TableCell>
                <Badge variant="outline" className={row.visitType === "In-patient" ? "bg-purple-100 text-purple-700" : "bg-teal-100 text-teal-700"}>
                  {row.visitType}
                </Badge>
              </TableCell>
              <TableCell>
                <Button 
                  size="sm" 
                  onClick={(e) => {
                    e.stopPropagation();
                    navigate(`/laboratory/booking?requestId=${row.requestId}`);
                  }}
                >
                  Schedule Now
                </Button>
              </TableCell>
              <TableCell onClick={(e) => e.stopPropagation()}>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon">
                      <MoreHorizontal className="w-4 h-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="bg-popover border shadow-md z-50">
                    <DropdownMenuItem>View Details</DropdownMenuItem>
                    <DropdownMenuItem>Collect Sample</DropdownMenuItem>
                    <DropdownMenuItem>Contact Patient</DropdownMenuItem>
                    <DropdownMenuItem>Cancel Request</DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    );
  };

  const getScheduledStatusBadgeStyle = (status: string): string => {
    switch (status) {
      case "Confirmed": return "bg-blue-100 text-blue-700";
      case "Checked In": return "bg-cyan-100 text-cyan-700";
      case "In Progress": return "bg-purple-100 text-purple-700";
      case "Completed": return "bg-green-100 text-green-700";
      case "No Show": return "bg-red-100 text-red-700";
      default: return "bg-gray-100 text-gray-700";
    }
  };

  const getAppointmentTypeBadgeStyle = (type: string): string => {
    return type === "Outpatient" ? "bg-indigo-100 text-indigo-700" : "bg-orange-100 text-orange-700";
  };

  const renderScheduledTable = () => {
    const paginatedScheduledData = scheduledData.slice((currentPage - 1) * pageSize, currentPage * pageSize);
    
    return (
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead style={{ width: "220px", minWidth: "220px" }}>Patient Info</TableHead>
            <TableHead>Contact</TableHead>
            <TableHead>Appointment ID</TableHead>
            <TableHead>Type</TableHead>
            <TableHead>Scheduled Date</TableHead>
            <TableHead>Scheduled Time</TableHead>
            <TableHead>Doctor / Test</TableHead>
            <TableHead>Department</TableHead>
            <TableHead>Visit Type</TableHead>
            <TableHead>Status</TableHead>
            <TableHead style={{ width: "80px" }}>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {paginatedScheduledData.map((row) => (
            <TableRow key={row.appointmentId} className="cursor-pointer hover:bg-muted/50">
              <TableCell style={{ width: "220px", minWidth: "220px" }}>
                <PatientCell name={row.patient} gdid={row.appointmentId} ageSex={row.ageSex} patientId={row.appointmentId} fromPage="scheduled" />
              </TableCell>
              <TableCell>
                <div className="flex flex-col">
                  <span>{row.contact}</span>
                  <span className="text-muted-foreground text-xs">{row.email}</span>
                </div>
              </TableCell>
              <TableCell className="font-medium">{row.appointmentId}</TableCell>
              <TableCell>
                <Badge variant="outline" className={getAppointmentTypeBadgeStyle(row.appointmentType)}>
                  {row.appointmentType}
                </Badge>
              </TableCell>
              <TableCell>{row.scheduledDate}</TableCell>
              <TableCell>{row.scheduledTime}</TableCell>
              <TableCell>
                {row.appointmentType === "Laboratory" ? (
                  <span>{row.testCode}</span>
                ) : (
                  <span>{row.doctor}</span>
                )}
              </TableCell>
              <TableCell>{row.department}</TableCell>
              <TableCell>
                <Badge variant="outline" className={
                  row.visitType === "First Visit" ? "bg-green-100 text-green-700" :
                  row.visitType === "Follow up" ? "bg-blue-100 text-blue-700" :
                  row.visitType === "In-patient" ? "bg-purple-100 text-purple-700" :
                  "bg-teal-100 text-teal-700"
                }>
                  {row.visitType}
                </Badge>
              </TableCell>
              <TableCell>
                <Badge variant="outline" className={getScheduledStatusBadgeStyle(row.status)}>
                  {row.status}
                </Badge>
              </TableCell>
              <TableCell onClick={(e) => e.stopPropagation()}>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon">
                      <MoreHorizontal className="w-4 h-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="bg-popover border shadow-md z-50">
                    <DropdownMenuItem>View Details</DropdownMenuItem>
                    <DropdownMenuItem>Check In</DropdownMenuItem>
                    <DropdownMenuItem>Reschedule</DropdownMenuItem>
                    <DropdownMenuItem>Cancel Appointment</DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    );
  };

  return (
    <div className="flex min-h-screen bg-background">
      <AppSidebar />
      
      <PageContent>
        <AppHeader breadcrumbs={["Overview", "Appointment Requests"]} />
        
        <main className="p-6">
          {/* Header */}
          <Card className="p-6 mb-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => navigate("/")}
                  className="h-9 w-9"
                  aria-label="Back to Overview"
                >
                  <ArrowLeft className="w-5 h-5" />
                </Button>
                <div>
                  <div className="flex items-center gap-3">
                    <h1 className="text-h3 font-semibold text-foreground">Appointment Requests</h1>
                    <Badge variant="secondary" className="text-lg px-3 py-1">
                      {getTabCount().toLocaleString()}
                    </Badge>
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Button variant="outline" size="sm" className="gap-2">
                  <Download className="w-4 h-4" />
                  Export CSV
                </Button>
                <Button variant="outline" size="sm" className="gap-2">
                  <Printer className="w-4 h-4" />
                  Print List
                </Button>
              </div>
            </div>
          </Card>

          {/* Controls Row with Tabs, Filters and Search */}
          <div className="flex items-center justify-between mb-4">
            {/* Left: Tabs */}
            <div className="flex items-center border-b">
              <button
                onClick={() => { setActiveTab("outpatient"); setCurrentPage(1); }}
                className={`px-4 py-2 text-sm font-medium border-b-2 transition-colors ${
                  activeTab === "outpatient" 
                    ? "border-primary text-primary" 
                    : "border-transparent text-muted-foreground hover:text-foreground"
                }`}
              >
                Outpatient
              </button>
              <button
                onClick={() => { setActiveTab("laboratory"); setCurrentPage(1); }}
                className={`px-4 py-2 text-sm font-medium border-b-2 transition-colors ${
                  activeTab === "laboratory" 
                    ? "border-primary text-primary" 
                    : "border-transparent text-muted-foreground hover:text-foreground"
                }`}
              >
                Laboratory
              </button>
              <button
                onClick={() => { setActiveTab("scheduled"); setCurrentPage(1); }}
                className={`px-4 py-2 text-sm font-medium border-b-2 transition-colors ${
                  activeTab === "scheduled" 
                    ? "border-primary text-primary" 
                    : "border-transparent text-muted-foreground hover:text-foreground"
                }`}
              >
                Scheduled
              </button>
            </div>

            {/* Right: Filters and Search */}
            <div className="flex items-center gap-3">
              <Select value={visitTypeFilter} onValueChange={setVisitTypeFilter}>
                <SelectTrigger className="w-[150px]">
                  <SelectValue placeholder="Visit Type" />
                </SelectTrigger>
                <SelectContent className="bg-popover border shadow-md z-50">
                  <SelectItem value="all">All Visit Type</SelectItem>
                  <SelectItem value="First Visit">First Visit</SelectItem>
                  <SelectItem value="Follow-up">Follow up</SelectItem>
                </SelectContent>
              </Select>

              <Select value={departmentFilter} onValueChange={setDepartmentFilter}>
                <SelectTrigger className="w-[150px]">
                  <SelectValue placeholder="Department" />
                </SelectTrigger>
                <SelectContent className="bg-popover border shadow-md z-50">
                  <SelectItem value="all">All Department</SelectItem>
                  <SelectItem value="Cardiology">Cardiology</SelectItem>
                  <SelectItem value="Orthopedics">Orthopedics</SelectItem>
                  <SelectItem value="Neurology">Neurology</SelectItem>
                  <SelectItem value="General Medicine">General Medicine</SelectItem>
                </SelectContent>
              </Select>

              {/* Search */}
              <div className="relative w-72">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  placeholder="Search by Request ID, patient name..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
          </div>

          {/* Table */}
          <Card>
            {activeTab === "outpatient" && renderOutpatientTable()}
            {activeTab === "laboratory" && renderLaboratoryTable()}
            {activeTab === "scheduled" && renderScheduledTable()}

            {/* Pagination */}
            <div className="flex items-center justify-between px-4 py-3 border-t">
              <p className="text-small text-muted-foreground">
                Showing {((currentPage - 1) * pageSize) + 1} to{" "}
                {Math.min(currentPage * pageSize, getTabCount())} of {getTabCount()} results
              </p>
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="icon"
                  disabled={currentPage === 1}
                  onClick={() => setCurrentPage((p) => p - 1)}
                >
                  <ChevronLeft className="w-4 h-4" />
                </Button>
                <span className="text-small text-muted-foreground px-2">
                  Page {currentPage} of {totalPages || 1}
                </span>
                <Button
                  variant="outline"
                  size="icon"
                  disabled={currentPage === totalPages || totalPages === 0}
                  onClick={() => setCurrentPage((p) => p + 1)}
                >
                  <ChevronRight className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </Card>
        </main>
      </PageContent>

      <Dialog open={showSummary} onOpenChange={setShowSummary}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle className="text-lg font-semibold">Appointment Summary</DialogTitle>
          </DialogHeader>
          
          {selectedRequest && (
            <div className="space-y-4">
              {/* Patient Info */}
              <div className="flex items-center gap-3 p-3 bg-muted/50 rounded-lg">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center ${selectedRequest.ageSex.includes('F') ? 'bg-pink-100' : 'bg-blue-100'}`}>
                  <User className={`w-5 h-5 ${selectedRequest.ageSex.includes('F') ? 'text-pink-600' : 'text-blue-600'}`} />
                </div>
                <div>
                  <p className="font-semibold text-foreground">{selectedRequest.patient}</p>
                  <p className="text-sm text-muted-foreground">GDID - {selectedRequest.requestId.slice(-3)} • {selectedRequest.ageSex}</p>
                </div>
                <Badge className={`ml-auto ${selectedRequest.status === "New" ? "bg-amber-100 text-amber-700" : selectedRequest.status === "Pending" ? "bg-blue-100 text-blue-700" : selectedRequest.status === "Scheduled" ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"}`}>
                  {selectedRequest.status === "New" ? "Pending Check-in" : selectedRequest.status}
                </Badge>
              </div>

              {/* Visit Details */}
              <div className="grid grid-cols-3 gap-4">
                <div className="space-y-3">
                  <div className="flex items-start gap-2">
                    <FileText className="w-4 h-4 text-muted-foreground mt-0.5" />
                    <div>
                      <p className="text-xs text-muted-foreground">Visit ID</p>
                      <p className="text-sm font-medium">V25-{selectedRequest.requestId.slice(-3)}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start gap-2">
                    <Calendar className="w-4 h-4 text-muted-foreground mt-0.5" />
                    <div>
                      <p className="text-xs text-muted-foreground">Appointment Time</p>
                      <p className="text-sm font-medium">{selectedRequest.preferredDate} {selectedRequest.preferredTime}</p>
                    </div>
                  </div>
                </div>

                <div className="space-y-3">
                  <div className="flex items-start gap-2">
                    <Clock className="w-4 h-4 text-muted-foreground mt-0.5" />
                    <div>
                      <p className="text-xs text-muted-foreground">Check-in Time</p>
                      <p className="text-sm font-medium">Not checked in</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-2">
                    <Hash className="w-4 h-4 text-muted-foreground mt-0.5" />
                    <div>
                      <p className="text-xs text-muted-foreground">Token/Queue No.</p>
                      <p className="text-sm font-medium">Not assigned</p>
                    </div>
                  </div>
                </div>

                <div className="space-y-3">
                  <div className="flex items-start gap-2">
                    <Stethoscope className="w-4 h-4 text-muted-foreground mt-0.5" />
                    <div>
                      <p className="text-xs text-muted-foreground">Doctor</p>
                      <p className="text-sm font-medium">{selectedRequest.preferredProvider || "Any"}</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-2">
                    <MapPin className="w-4 h-4 text-muted-foreground mt-0.5" />
                    <div>
                      <p className="text-xs text-muted-foreground">Department</p>
                      <p className="text-sm font-medium">{selectedRequest.department}</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Clinical Information */}
              <div className="p-3 border rounded-lg">
                <p className="text-xs text-muted-foreground mb-1">Clinical Information</p>
                <p className="text-sm text-muted-foreground italic">No clinical information available.</p>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AppointmentRequests;