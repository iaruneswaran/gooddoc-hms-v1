import { useState } from "react";
import { AppSidebar } from "@/components/AppSidebar";
import { AppHeader } from "@/components/AppHeader";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Calendar, Search, Filter, Phone, Mail, MoreVertical, Clock, AlertCircle } from "lucide-react";
import { Link } from "react-router-dom";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";

interface DiagnosticOrder {
  id: string;
  type: "laboratory" | "radiology";
  patient: {
    name: string;
    mrn: string;
    age: number;
    sex: string;
    phone: string;
    avatar: string;
  };
  orderSummary: {
    indication: string;
    tests: string[];
    referringDoctor: string;
  };
  service: {
    department?: string;
    modality?: string;
  };
  token: string;
  scheduledTime: string;
  status: string;
  priority: "routine" | "stat";
  tatMinutes?: number;
  isOverdue?: boolean;
}

const mockOrders: DiagnosticOrder[] = [
  {
    id: "OR-LL-10342",
    type: "laboratory",
    patient: {
      name: "Anaya Shah",
      mrn: "MRN-204983",
      age: 34,
      sex: "F",
      phone: "+91 98xxxx210",
      avatar: "AS"
    },
    orderSummary: {
      indication: "Chest pain evaluation",
      tests: ["Troponin I", "CMP", "CBC with Diff"],
      referringDoctor: "Dr. Mehta"
    },
    service: {
      department: "Central Diagnostic Lab"
    },
    token: "T-045",
    scheduledTime: "10:30 AM",
    status: "Sample Collected",
    priority: "stat",
    tatMinutes: 45,
    isOverdue: false
  },
  {
    id: "OR-LL-10367",
    type: "laboratory",
    patient: {
      name: "Rohan Mehta",
      mrn: "MRN-198733",
      age: 62,
      sex: "M",
      phone: "+91 98xxxx345",
      avatar: "RM"
    },
    orderSummary: {
      indication: "DM2 follow-up",
      tests: ["HbA1c", "Lipid Panel"],
      referringDoctor: "Dr. Sharma"
    },
    service: {
      department: "Central Diagnostic Lab"
    },
    token: "T-052",
    scheduledTime: "11:15 AM",
    status: "Pending",
    priority: "routine",
    tatMinutes: 120
  },
  {
    id: "OR-RD-55421",
    type: "radiology",
    patient: {
      name: "Kavya Iyer",
      mrn: "MRN-217564",
      age: 28,
      sex: "F",
      phone: "+91 98xxxx567",
      avatar: "KI"
    },
    orderSummary: {
      indication: "r/o PE",
      tests: ["CT Chest with contrast"],
      referringDoctor: "Dr. Patel"
    },
    service: {
      modality: "CT"
    },
    token: "R-023",
    scheduledTime: "09:45 AM",
    status: "In Progress",
    priority: "stat",
    tatMinutes: 60
  },
  {
    id: "OR-RD-55438",
    type: "radiology",
    patient: {
      name: "Arnav Rao",
      mrn: "MRN-176540",
      age: 45,
      sex: "M",
      phone: "+91 98xxxx789",
      avatar: "AR"
    },
    orderSummary: {
      indication: "Persistent headache",
      tests: ["MRI Brain w/o contrast"],
      referringDoctor: "Dr. Kumar"
    },
    service: {
      modality: "MRI"
    },
    token: "R-031",
    scheduledTime: "02:30 PM",
    status: "Scheduled",
    priority: "routine",
    tatMinutes: 180
  },
  {
    id: "OR-LL-10389",
    type: "laboratory",
    patient: {
      name: "Priya Desai",
      mrn: "MRN-209845",
      age: 52,
      sex: "F",
      phone: "+91 98xxxx432",
      avatar: "PD"
    },
    orderSummary: {
      indication: "UTI symptoms",
      tests: ["Urinalysis", "Urine Culture"],
      referringDoctor: "Dr. Singh"
    },
    service: {
      department: "Microbiology Lab"
    },
    token: "T-058",
    scheduledTime: "01:00 PM",
    status: "Checked-in",
    priority: "routine",
    tatMinutes: 240
  }
];

export default function DiagnosticsWorklist() {
  const [selectedTab, setSelectedTab] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case "pending": return "bg-muted text-muted-foreground";
      case "checked-in": return "bg-blue-100 text-blue-700";
      case "sample collected": return "bg-purple-100 text-purple-700";
      case "in progress": return "bg-yellow-100 text-yellow-700";
      case "entered": return "bg-cyan-100 text-cyan-700";
      case "under review": return "bg-orange-100 text-orange-700";
      case "released": return "bg-green-100 text-green-700";
      case "critical": return "bg-destructive text-destructive-foreground";
      default: return "bg-muted text-muted-foreground";
    }
  };

  const filteredOrders = mockOrders.filter(order => {
    const matchesTab = selectedTab === "all" || 
                       (selectedTab === "laboratory" && order.type === "laboratory") ||
                       (selectedTab === "radiology" && order.type === "radiology");
    const matchesSearch = searchQuery === "" || 
                         order.patient.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         order.patient.mrn.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         order.id.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === "all" || order.status === statusFilter;
    
    return matchesTab && matchesSearch && matchesStatus;
  });

  const stats = {
    total: mockOrders.length,
    medianTAT: 120,
    critical: mockOrders.filter(o => o.priority === "stat").length
  };

  return (
    <div className="flex min-h-screen bg-background">
      <AppSidebar />
      
      <div className="flex-1 ml-[196px]">
        <AppHeader breadcrumbs={["Diagnostics", "Worklist"]} />
        
        <main className="p-6">
          {/* Header with Stats */}
          <Card className="p-6 mb-8">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <h1 className="text-lg font-semibold text-foreground">Diagnostics</h1>
                <div className="flex gap-2">
                  <Badge variant="secondary" className="px-3 py-1">
                    Today: {stats.total} orders
                  </Badge>
                  <Badge variant="secondary" className="px-3 py-1">
                    Median TAT: {stats.medianTAT}min
                  </Badge>
                </div>
              </div>
              <div className="flex gap-2">
                <Button variant="outline" size="icon">
                  <Calendar className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </Card>

          {/* Tabs and Filters */}
          <div className="flex items-center justify-between mb-6">
            <Tabs value={selectedTab} onValueChange={setSelectedTab}>
              <TabsList className="bg-transparent border-b border-border rounded-none h-auto p-0 justify-start">
                <TabsTrigger value="all" className="tab-trigger rounded-none border-b-0 data-[state=active]:bg-transparent px-4 py-3">
                  All ({mockOrders.length})
                </TabsTrigger>
                <TabsTrigger value="laboratory" className="tab-trigger rounded-none border-b-0 data-[state=active]:bg-transparent px-4 py-3">
                  Laboratory ({mockOrders.filter(o => o.type === "laboratory").length})
                </TabsTrigger>
                <TabsTrigger value="radiology" className="tab-trigger rounded-none border-b-0 data-[state=active]:bg-transparent px-4 py-3">
                  Radiology ({mockOrders.filter(o => o.type === "radiology").length})
                </TabsTrigger>
              </TabsList>
            </Tabs>

            <div className="flex gap-3 pb-2">
              <div className="relative w-[320px]">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search by patient name, MRN, or order ID..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-9 h-9"
                />
              </div>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-[160px] h-9">
                  <SelectValue placeholder="Filter by status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="Pending">Pending</SelectItem>
                  <SelectItem value="Checked-in">Checked-in</SelectItem>
                  <SelectItem value="Sample Collected">Sample Collected</SelectItem>
                  <SelectItem value="In Progress">In Progress</SelectItem>
                  <SelectItem value="Released">Released</SelectItem>
                </SelectContent>
              </Select>
              <Button variant="outline" size="sm" className="h-9">
                <Filter className="h-4 w-4 mr-2" />
                More Filters
              </Button>
            </div>
          </div>

          {/* Orders Table */}
          <div className="bg-card rounded-lg border border-border overflow-hidden">
            <div className="grid grid-cols-[200px_1fr_180px_180px_140px_180px] gap-4 p-4 border-b border-border bg-muted/30">
              <div className="text-sm font-medium text-foreground">Patient</div>
              <div className="text-sm font-medium text-foreground">Order Summary</div>
              <div className="text-sm font-medium text-foreground">Service</div>
              <div className="text-sm font-medium text-foreground">Token & Time</div>
              <div className="text-sm font-medium text-foreground">Status</div>
              <div className="text-sm font-medium text-foreground">Actions</div>
            </div>

            {filteredOrders.map((order) => (
              <div key={order.id} className="grid grid-cols-[200px_1fr_180px_180px_140px_180px] gap-4 p-4 items-center hover:bg-muted/20 transition-colors border-b border-border last:border-b-0">
                <div className="flex items-start gap-3">
                  <Avatar className="w-10 h-10 flex-shrink-0">
                    <AvatarFallback className="bg-primary/10 text-primary">{order.patient.avatar}</AvatarFallback>
                  </Avatar>
                  <div>
                    <button className="text-sm font-medium text-foreground hover:text-primary transition-colors text-left">
                      {order.patient.name}
                    </button>
                    <div className="text-xs text-muted-foreground">
                      {order.patient.mrn} • {order.patient.age}y | {order.patient.sex}
                    </div>
                    <div className="flex gap-2 mt-1">
                      <button className="text-muted-foreground hover:text-primary">
                        <Phone className="w-3.5 h-3.5" />
                      </button>
                      <button className="text-muted-foreground hover:text-primary">
                        <Mail className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                </div>

                <div className="space-y-1">
                  <div className="text-sm font-medium text-foreground">{order.id}</div>
                  <div className="text-sm text-muted-foreground">{order.orderSummary.indication}</div>
                  <div className="text-sm text-foreground">{order.orderSummary.tests.join(", ")}</div>
                </div>

                <div className="text-sm text-foreground">
                  {order.service.department || order.service.modality}
                </div>

                <div className="space-y-1">
                  <div className="text-sm font-medium text-foreground">{order.token}</div>
                  <div className="text-sm text-muted-foreground flex items-center gap-1">
                    <Clock className="w-3.5 h-3.5" />
                    {order.scheduledTime}
                  </div>
                  {order.tatMinutes && (
                    <div className="text-xs text-muted-foreground">
                      TAT: {order.tatMinutes}min
                    </div>
                  )}
                </div>

                <div>
                  <Badge className={getStatusColor(order.status)}>
                    {order.status}
                  </Badge>
                </div>

                <div className="flex items-center gap-2">
                  <Link to={`/diagnostics/${order.type === "laboratory" ? "lab" : order.type}/${order.id}`}>
                    <Button size="sm" className="bg-primary hover:bg-primary/90">
                      Enter Results
                    </Button>
                  </Link>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon">
                        <MoreVertical className="w-4 h-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem>View Order</DropdownMenuItem>
                      <DropdownMenuItem>Reassign</DropdownMenuItem>
                      <DropdownMenuItem>Print Barcodes</DropdownMenuItem>
                      <DropdownMenuItem className="text-destructive">Cancel</DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </div>
            ))}
          </div>
        </main>
      </div>
    </div>
  );
}
