import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { FileText, TrendingUp, DollarSign, Users, Building } from "lucide-react";

const prebuiltReports = [
  { name: "Cash Flow Summary", description: "Overview of inflows and outflows", icon: TrendingUp },
  { name: "Inflows vs Outflows by Category", description: "Detailed category breakdown", icon: DollarSign },
  { name: "AR Aging Report", description: "Accounts receivable aging analysis", icon: FileText },
  { name: "Top Payers", description: "Highest revenue insurance payers", icon: Users },
  { name: "Top Vendors", description: "Largest vendor payments", icon: Building },
  { name: "Departmental Net Revenue", description: "Revenue by department", icon: Building },
];

export function ReportsBuilderTab() {
  return (
    <div className="space-y-6">
      <Card className="p-6">
        <h2 className="text-lg font-semibold mb-4">Prebuilt Reports</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {prebuiltReports.map((report) => {
            const Icon = report.icon;
            return (
              <Card key={report.name} className="p-4 hover:shadow-md transition-shadow cursor-pointer">
                <div className="flex items-start gap-3">
                  <div className="p-2 rounded-lg bg-primary/10">
                    <Icon className="w-5 h-5 text-primary" />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-medium mb-1">{report.name}</h3>
                    <p className="text-sm text-muted-foreground">{report.description}</p>
                    <Button variant="link" className="px-0 mt-2 h-auto">
                      Generate Report
                    </Button>
                  </div>
                </div>
              </Card>
            );
          })}
        </div>
      </Card>

      <Card className="p-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-lg font-semibold">Custom Report Builder</h2>
            <p className="text-sm text-muted-foreground mt-1">
              Create custom reports with your own columns, filters, and aggregations
            </p>
          </div>
          <Button className="gap-2">
            <FileText className="w-4 h-4" />
            Build New Report
          </Button>
        </div>

        <div className="border-2 border-dashed rounded-lg p-12 text-center">
          <FileText className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
          <h3 className="text-lg font-medium mb-2">No custom reports yet</h3>
          <p className="text-sm text-muted-foreground mb-4">
            Click "Build New Report" to create your first custom report
          </p>
        </div>
      </Card>
    </div>
  );
}
