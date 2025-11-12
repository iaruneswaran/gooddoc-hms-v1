import { useState } from "react";
import { AppSidebar } from "@/components/AppSidebar";
import { AppHeader } from "@/components/AppHeader";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { OverviewTab } from "@/components/reports/OverviewTab";
import { AllTransactionsTab } from "@/components/reports/AllTransactionsTab";
import { BillsInvoicesTab } from "@/components/reports/BillsInvoicesTab";
import { ReportsBuilderTab } from "@/components/reports/ReportsBuilderTab";
import { ScheduledReportsTab } from "@/components/reports/ScheduledReportsTab";
import { AuditLogTab } from "@/components/reports/AuditLogTab";
import { GlobalFilterBar } from "@/components/reports/GlobalFilterBar";
import { Card } from "@/components/ui/card";

export default function TransactionsBillingReports() {
  const [activeTab, setActiveTab] = useState("overview");

  return (
    <div className="flex min-h-screen bg-background">
      <AppSidebar />
      
      <div className="flex-1 ml-[196px]">
        <AppHeader breadcrumbs={["Reports", "Transactions & Billing Reports"]} />
        
        <main className="p-6">
          <Card className="p-6 mb-6">
            <div className="mb-4">
              <h1 className="text-2xl font-semibold text-foreground">Transactions & Billing Reports</h1>
              <p className="text-sm text-muted-foreground mt-1">
                Track inflows, outflows, and billing performance across departments.
              </p>
            </div>
            
            <GlobalFilterBar />
          </Card>

          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="mb-6 w-full justify-start">
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="transactions">All Transactions</TabsTrigger>
              <TabsTrigger value="invoices">Bills & Invoices</TabsTrigger>
              <TabsTrigger value="reports">Reports</TabsTrigger>
              <TabsTrigger value="scheduled">Scheduled Reports</TabsTrigger>
              <TabsTrigger value="audit">Audit Log</TabsTrigger>
            </TabsList>

            <TabsContent value="overview">
              <OverviewTab />
            </TabsContent>

            <TabsContent value="transactions">
              <AllTransactionsTab />
            </TabsContent>

            <TabsContent value="invoices">
              <BillsInvoicesTab />
            </TabsContent>

            <TabsContent value="reports">
              <ReportsBuilderTab />
            </TabsContent>

            <TabsContent value="scheduled">
              <ScheduledReportsTab />
            </TabsContent>

            <TabsContent value="audit">
              <AuditLogTab />
            </TabsContent>
          </Tabs>
        </main>
      </div>
    </div>
  );
}
