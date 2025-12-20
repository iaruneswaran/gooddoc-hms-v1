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

// Mock data for Laboratory tab
interface LaboratoryRecord {
  id: string;
  testName: string;
  testCode: string;
  category: string;
  sampleType: string;
  turnaroundTime: string;
  price: number;
  status: "Active" | "Inactive";
}

const laboratoryData: LaboratoryRecord[] = [
  { id: "LAB001", testName: "Complete Blood Count (CBC)", testCode: "CBC001", category: "Hematology", sampleType: "Blood", turnaroundTime: "4 hours", price: 350, status: "Active" },
  { id: "LAB002", testName: "Lipid Profile", testCode: "LIP001", category: "Biochemistry", sampleType: "Blood", turnaroundTime: "6 hours", price: 800, status: "Active" },
  { id: "LAB003", testName: "Liver Function Test (LFT)", testCode: "LFT001", category: "Biochemistry", sampleType: "Blood", turnaroundTime: "6 hours", price: 650, status: "Active" },
  { id: "LAB004", testName: "Kidney Function Test (KFT)", testCode: "KFT001", category: "Biochemistry", sampleType: "Blood", turnaroundTime: "6 hours", price: 550, status: "Active" },
  { id: "LAB005", testName: "Thyroid Profile (T3, T4, TSH)", testCode: "THY001", category: "Endocrinology", sampleType: "Blood", turnaroundTime: "8 hours", price: 900, status: "Active" },
  { id: "LAB006", testName: "HbA1c", testCode: "HBA001", category: "Diabetes", sampleType: "Blood", turnaroundTime: "4 hours", price: 450, status: "Active" },
  { id: "LAB007", testName: "Urinalysis", testCode: "URI001", category: "Urology", sampleType: "Urine", turnaroundTime: "2 hours", price: 200, status: "Active" },
  { id: "LAB008", testName: "Vitamin D", testCode: "VIT001", category: "Biochemistry", sampleType: "Blood", turnaroundTime: "24 hours", price: 1200, status: "Active" },
  { id: "LAB009", testName: "Vitamin B12", testCode: "VIT002", category: "Biochemistry", sampleType: "Blood", turnaroundTime: "24 hours", price: 850, status: "Active" },
  { id: "LAB010", testName: "Iron Studies", testCode: "IRO001", category: "Hematology", sampleType: "Blood", turnaroundTime: "6 hours", price: 700, status: "Inactive" },
];

// Mock data for Scheduled tab
interface ScheduledRecord {
  id: string;
  slotTime: string;
  slotDate: string;
  doctor: string;
  department: string;
  duration: string;
  maxPatients: number;
  bookedCount: number;
  status: "Available" | "Full" | "Blocked";
}

const scheduledData: ScheduledRecord[] = [
  { id: "SCH001", slotTime: "09:00 AM", slotDate: "21 Dec 2025", doctor: "Dr. Meera Nair", department: "Cardiology", duration: "30 min", maxPatients: 10, bookedCount: 8, status: "Available" },
  { id: "SCH002", slotTime: "10:00 AM", slotDate: "21 Dec 2025", doctor: "Dr. Rajesh Kumar", department: "Orthopedics", duration: "30 min", maxPatients: 8, bookedCount: 8, status: "Full" },
  { id: "SCH003", slotTime: "11:00 AM", slotDate: "21 Dec 2025", doctor: "Dr. Anita Singh", department: "Neurology", duration: "45 min", maxPatients: 6, bookedCount: 4, status: "Available" },
  { id: "SCH004", slotTime: "02:00 PM", slotDate: "21 Dec 2025", doctor: "Dr. Sunil Reddy", department: "General Medicine", duration: "20 min", maxPatients: 12, bookedCount: 10, status: "Available" },
  { id: "SCH005", slotTime: "03:00 PM", slotDate: "21 Dec 2025", doctor: "Dr. Prakash Shah", department: "ENT", duration: "30 min", maxPatients: 8, bookedCount: 0, status: "Blocked" },
  { id: "SCH006", slotTime: "09:00 AM", slotDate: "22 Dec 2025", doctor: "Dr. Priya Menon", department: "Dermatology", duration: "20 min", maxPatients: 15, bookedCount: 12, status: "Available" },
  { id: "SCH007", slotTime: "10:00 AM", slotDate: "22 Dec 2025", doctor: "Dr. Arun Bhat", department: "Gastroenterology", duration: "30 min", maxPatients: 8, bookedCount: 5, status: "Available" },
  { id: "SCH008", slotTime: "11:00 AM", slotDate: "22 Dec 2025", doctor: "Dr. Sunita Rao", department: "Pulmonology", duration: "30 min", maxPatients: 8, bookedCount: 8, status: "Full" },
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

  const renderLaboratoryTable = () => (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Test Code</TableHead>
          <TableHead>Test Name</TableHead>
          <TableHead>Category</TableHead>
          <TableHead>Sample Type</TableHead>
          <TableHead>Turnaround Time</TableHead>
          <TableHead>Price (₹)</TableHead>
          <TableHead>Status</TableHead>
          <TableHead style={{ width: "80px" }}>Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {laboratoryData.map((row) => (
          <TableRow key={row.id} className="cursor-pointer hover:bg-muted/50">
            <TableCell className="font-medium">{row.testCode}</TableCell>
            <TableCell>{row.testName}</TableCell>
            <TableCell>{row.category}</TableCell>
            <TableCell>{row.sampleType}</TableCell>
            <TableCell>{row.turnaroundTime}</TableCell>
            <TableCell>₹{row.price.toLocaleString()}</TableCell>
            <TableCell>
              <Badge className={row.status === "Active" ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-700"}>
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
                  <DropdownMenuItem>Edit Test</DropdownMenuItem>
                  <DropdownMenuItem>View Details</DropdownMenuItem>
                  <DropdownMenuItem>{row.status === "Active" ? "Deactivate" : "Activate"}</DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );

  const renderScheduledTable = () => (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Slot ID</TableHead>
          <TableHead>Date</TableHead>
          <TableHead>Time</TableHead>
          <TableHead>Doctor</TableHead>
          <TableHead>Department</TableHead>
          <TableHead>Duration</TableHead>
          <TableHead>Capacity</TableHead>
          <TableHead>Status</TableHead>
          <TableHead style={{ width: "80px" }}>Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {scheduledData.map((row) => (
          <TableRow key={row.id} className="cursor-pointer hover:bg-muted/50">
            <TableCell className="font-medium">{row.id}</TableCell>
            <TableCell>{row.slotDate}</TableCell>
            <TableCell>{row.slotTime}</TableCell>
            <TableCell>{row.doctor}</TableCell>
            <TableCell>{row.department}</TableCell>
            <TableCell>{row.duration}</TableCell>
            <TableCell>{row.bookedCount}/{row.maxPatients}</TableCell>
            <TableCell>
              <Badge className={
                row.status === "Available" ? "bg-green-100 text-green-700" : 
                row.status === "Full" ? "bg-amber-100 text-amber-700" : 
                "bg-red-100 text-red-700"
              }>
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
                  <DropdownMenuItem>Edit Slot</DropdownMenuItem>
                  <DropdownMenuItem>View Bookings</DropdownMenuItem>
                  <DropdownMenuItem>{row.status === "Blocked" ? "Unblock" : "Block"}</DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );

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