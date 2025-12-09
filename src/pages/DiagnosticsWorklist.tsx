import { useState } from "react";
import { AppSidebar } from "@/components/AppSidebar";
import { AppHeader } from "@/components/AppHeader";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Search, Filter, CheckCircle } from "lucide-react";
import { Link } from "react-router-dom";
import { CalendarWidget } from "@/components/CalendarWidget";
import { SLABadge } from "@/components/radiology/SLABadge";
import { StatusBadges, ExamStatusBadge } from "@/components/radiology/StatusBadges";
import { OrderRowActions } from "@/components/radiology/OrderRowActions";
import { useToast } from "@/hooks/use-toast";
import type { RadiologyOrderStaff, ExamStatus } from "@/types/radiology-staff";

interface DiagnosticOrder {
  id: string;
  type: "laboratory" | "radiology";
  patient: { name: string; gdid: string; age: number; sex: string; phone: string };
  workorderId: string;
  orderDate: string;
  orderTime: string;
  status: string;
  waitingForApproval: string;
  approvedBy: string;
  price: number;
  departments: { name: string; tests: string[] }[];
}

const mockLabOrders: DiagnosticOrder[] = [
  { id: "OR-LL-10342", type: "laboratory", patient: { name: "Harish Kalyan", gdid: "GD2028", age: 35, sex: "M", phone: "+91 98xxxx210" }, workorderId: "GD2028", orderDate: "08-12-2025", orderTime: "11:52:23", status: "Pending", waitingForApproval: "-", approvedBy: "Dr. Arjun Reddy", price: 756.00, departments: [{ name: "Biochemistry", tests: ["ST Order Test", "Liver Function Test (LFT)", "Overall Test", "24-Hour Urine BUN"] }] },
  { id: "OR-LL-10367", type: "laboratory", patient: { name: "Rohan Mehta", gdid: "GD2035", age: 62, sex: "M", phone: "+91 98xxxx345" }, workorderId: "GD2035", orderDate: "08-12-2025", orderTime: "10:30:15", status: "Pending", waitingForApproval: "Dr. Sharma", approvedBy: "Dr. Sharma", price: 1250.00, departments: [{ name: "Biochemistry", tests: ["HbA1c", "Lipid Panel", "Fasting Glucose"] }, { name: "Hematology", tests: ["CBC with Diff"] }] },
  { id: "OR-LL-10389", type: "laboratory", patient: { name: "Priya Desai", gdid: "GD2055", age: 52, sex: "F", phone: "+91 98xxxx432" }, workorderId: "GD2055", orderDate: "08-12-2025", orderTime: "13:00:00", status: "Pending", waitingForApproval: "Dr. Singh", approvedBy: "-", price: 450.00, departments: [{ name: "Microbiology", tests: ["Urinalysis", "Urine Culture"] }] }
];

const mockRadiologyOrders: RadiologyOrderStaff[] = [
  { id: "OR-RD-55421", type: "radiology", patient: { name: "Kavya Iyer", gdid: "GD2042", mrn: "MRN-217564", age: 28, sex: "F", phone: "+91 98xxxx567" }, workorderId: "GD2042", orderDate: "08-12-2025", orderTime: "09:45:00", status: "To Be Read", priority: "STAT", slaDueAt: "08-12-2025 10:15", slaMinutesRemaining: 18, waitingForApproval: "-", approvedBy: "Dr. Patel", price: 3500.00, assignedRadiologistId: "rad_101", assignedRadiologistName: "Dr. Kumar", assignedTechnologistId: "tech_207", assignedTechnologistName: "Tech. Patel", modality: "CT", study: "CT Chest with IV contrast", departments: [{ name: "Radiology", tests: ["CT Chest with contrast"] }], safetyStatus: "passed", qcStatus: "complete", reportStatus: "Draft", hasCriticalFinding: false, criticalCommunicationLogged: false },
  { id: "OR-RD-55438", type: "radiology", patient: { name: "Arnav Rao", gdid: "GD2048", mrn: "MRN-219873", age: 45, sex: "M", phone: "+91 98xxxx789" }, workorderId: "GD2048", orderDate: "08-12-2025", orderTime: "14:30:00", status: "Released", priority: "Routine", waitingForApproval: "-", approvedBy: "Dr. Kumar", price: 8500.00, assignedRadiologistId: "rad_102", assignedRadiologistName: "Dr. Patel", assignedTechnologistId: "tech_208", assignedTechnologistName: "Tech. Sharma", modality: "MRI", study: "MRI Brain w/o contrast", departments: [{ name: "Radiology", tests: ["MRI Brain w/o contrast"] }], safetyStatus: "passed", qcStatus: "complete", reportStatus: "Released", hasCriticalFinding: false, criticalCommunicationLogged: false },
];

export default function DiagnosticsWorklist() {
  const [selectedTab, setSelectedTab] = useState("laboratory");
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [selectedOrders, setSelectedOrders] = useState<string[]>([]);
  const [radiologyOrders, setRadiologyOrders] = useState(mockRadiologyOrders);
  const { toast } = useToast();

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case "pending": return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-300";
      case "for review": return "bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-300";
      case "completed": return "bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-300";
      default: return "bg-muted text-muted-foreground";
    }
  };

  const filteredLabOrders = mockLabOrders.filter(order => {
    const matchesSearch = searchQuery === "" || order.patient.name.toLowerCase().includes(searchQuery.toLowerCase()) || order.patient.gdid.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === "all" || order.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const filteredRadiologyOrders = radiologyOrders.filter(order => {
    const matchesSearch = searchQuery === "" || order.patient.name.toLowerCase().includes(searchQuery.toLowerCase()) || order.patient.gdid.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === "all" || order.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const getTotalTests = (departments: { tests: string[] }[]) => departments.reduce((acc, dept) => acc + dept.tests.length, 0);

  const handleStatusChange = (orderId: string, newStatus: ExamStatus) => {
    setRadiologyOrders(prev => prev.map(o => o.id === orderId ? { ...o, status: newStatus } : o));
    toast({ title: "Status Updated", description: `Order ${orderId} is now ${newStatus}` });
  };

  const handleAssign = (orderId: string, role: "radiologist" | "technologist", staffId: string) => {
    toast({ title: "Staff Assigned", description: `${role} assigned to ${orderId}` });
  };

  const handleBulkApprove = () => {
    toast({ title: "Bulk Approved", description: `${selectedOrders.length} orders approved` });
    setSelectedOrders([]);
  };

  return (
    <div className="flex min-h-screen bg-background">
      <AppSidebar />
      <div className="flex-1 ml-[196px]">
        <AppHeader breadcrumbs={["Diagnostics"]} />
        <main className="p-6">
          <Card className="p-6 mb-8">
            <div className="flex items-center justify-between">
              <h1 className="text-lg font-semibold text-foreground">Diagnostics</h1>
              <CalendarWidget />
            </div>
          </Card>

          <div className="flex items-center justify-between mb-6">
            <Tabs value={selectedTab} onValueChange={setSelectedTab}>
              <TabsList className="bg-transparent border-b border-border rounded-none h-auto p-0 justify-start">
                <TabsTrigger value="laboratory" className="tab-trigger rounded-none border-b-0 data-[state=active]:bg-transparent px-4 py-3">Laboratory</TabsTrigger>
                <TabsTrigger value="radiology" className="tab-trigger rounded-none border-b-0 data-[state=active]:bg-transparent px-4 py-3">Radiology</TabsTrigger>
              </TabsList>
            </Tabs>
            <div className="flex gap-3 pb-2">
              {selectedTab === "radiology" && selectedOrders.length > 0 && (
                <Button size="sm" className="h-9" onClick={handleBulkApprove}>
                  <CheckCircle className="h-4 w-4 mr-2" />
                  Approve ({selectedOrders.length})
                </Button>
              )}
              <div className="relative w-[320px]">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input placeholder="Search by patient name, MRN, or order ID..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} className="pl-9 h-9" />
              </div>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-[160px] h-9"><SelectValue placeholder="Filter by status" /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="Pending">Pending</SelectItem>
                  <SelectItem value="For Review">For Review</SelectItem>
                  <SelectItem value="Completed">Completed</SelectItem>
                </SelectContent>
              </Select>
              <Button variant="outline" size="sm" className="h-9"><Filter className="h-4 w-4 mr-2" />More Filters</Button>
            </div>
          </div>

          <div className="bg-card rounded-lg border border-border overflow-hidden">
            <div className="grid grid-cols-[40px_1fr_1fr_1fr_1fr_1fr_1fr_1fr_180px] gap-4 p-4 border-b border-border bg-muted/30">
              {selectedTab === "radiology" && <div></div>}
              {selectedTab === "laboratory" && <div></div>}
              <div className="text-sm font-medium text-foreground">Patient Info</div>
              <div className="text-sm font-medium text-foreground">Workorder ID</div>
              <div className="text-sm font-medium text-foreground">Order</div>
              <div className="text-sm font-medium text-foreground">Status</div>
              <div className="text-sm font-medium text-foreground">Waiting for Approval</div>
              <div className="text-sm font-medium text-foreground">Approved by</div>
              <div className="text-sm font-medium text-foreground">Price</div>
              <div className="text-sm font-medium text-foreground">Action</div>
            </div>

            {selectedTab === "laboratory" && filteredLabOrders.map((order) => (
              <div key={order.id} className="border-b border-border last:border-b-0">
                <div className="grid grid-cols-[40px_1fr_1fr_1fr_1fr_1fr_1fr_1fr_180px] gap-4 p-4 items-center hover:bg-muted/20 transition-colors">
                  <div></div>
                  <div><div className="text-sm font-medium text-foreground">{order.patient.name}</div><div className="text-xs text-muted-foreground">{order.patient.age}Y | {order.patient.sex}</div></div>
                  <div className="text-sm text-foreground">{order.workorderId}</div>
                  <div><div className="text-sm text-foreground">{order.orderDate}</div><div className="text-xs text-muted-foreground">{order.orderTime}</div></div>
                  <div><Badge className={getStatusColor(order.status)}>{order.status}</Badge></div>
                  <div className="text-sm text-foreground">{order.waitingForApproval}</div>
                  <div className="text-sm text-foreground">{order.approvedBy}</div>
                  <div className="text-sm text-foreground">₹{order.price.toFixed(2)}</div>
                  <div className="flex justify-center"><Link to={`/diagnostics/lab/${order.id}`}><Button variant="default" className="h-9">Enter Results</Button></Link></div>
                </div>
                <div className="px-4 pb-4 pt-0">
                  <div className="border-t border-border pt-4" style={{ width: 'fit-content' }}>
                    <div className="flex items-start gap-6 text-sm">
                      <div className="flex items-center gap-3"><span className="text-muted-foreground font-medium">Departments</span><div className="flex gap-2">{order.departments.map((dept, idx) => (<Badge key={idx} variant="secondary" className="bg-primary/10 text-primary font-normal">{dept.name}</Badge>))}</div></div>
                      <div className="flex items-center gap-3"><span className="text-muted-foreground">All Tests ({getTotalTests(order.departments)})</span><div className="flex gap-4 text-foreground">{order.departments.flatMap(dept => dept.tests).map((test, idx) => (<span key={idx}>{test}</span>))}</div></div>
                    </div>
                  </div>
                </div>
              </div>
            ))}

            {selectedTab === "radiology" && filteredRadiologyOrders.map((order) => (
              <div key={order.id} className="border-b border-border last:border-b-0">
                <div className="grid grid-cols-[40px_1fr_1fr_1fr_1fr_1fr_1fr_1fr_180px] gap-4 p-4 items-center hover:bg-muted/20 transition-colors">
                  <div className="flex justify-center"><Checkbox checked={selectedOrders.includes(order.id)} onCheckedChange={(checked) => setSelectedOrders(prev => checked ? [...prev, order.id] : prev.filter(id => id !== order.id))} /></div>
                  <div><div className="text-sm font-medium text-foreground">{order.patient.name}</div><div className="text-xs text-muted-foreground">{order.patient.age}Y | {order.patient.sex}</div></div>
                  <div className="text-sm text-foreground">{order.workorderId}</div>
                  <div><div className="text-sm text-foreground">{order.orderDate}</div><div className="text-xs text-muted-foreground">{order.orderTime}</div></div>
                  <div className="space-y-1"><ExamStatusBadge status={order.status} /><SLABadge priority={order.priority} slaDueAt={order.slaDueAt} slaMinutesRemaining={order.slaMinutesRemaining} /><StatusBadges order={order} /></div>
                  <div className="text-sm text-foreground">{order.waitingForApproval}</div>
                  <div className="text-sm text-foreground">{order.approvedBy}</div>
                  <div className="text-sm text-foreground">₹{order.price.toFixed(2)}</div>
                  <OrderRowActions order={order} onStatusChange={handleStatusChange} onAssign={handleAssign} />
                </div>
                <div className="px-4 pb-4 pt-0">
                  <div className="border-t border-border pt-4" style={{ width: 'fit-content' }}>
                    <div className="flex items-start gap-6 text-sm">
                      <div className="flex items-center gap-3"><span className="text-muted-foreground font-medium">Departments</span><div className="flex gap-2">{order.departments.map((dept, idx) => (<Badge key={idx} variant="secondary" className="bg-primary/10 text-primary font-normal">{dept.name}</Badge>))}</div></div>
                      <div className="flex items-center gap-3"><span className="text-muted-foreground">All Tests ({getTotalTests(order.departments)})</span><div className="flex gap-4 text-foreground">{order.departments.flatMap(dept => dept.tests).map((test, idx) => (<span key={idx}>{test}</span>))}</div></div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </main>
      </div>
    </div>
  );
}
