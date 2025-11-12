import { KpiCard } from "./KpiCard";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart, Bar, LineChart, Line, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";

const cashFlowData = [
  { date: "Nov 1", inflows: 45000, outflows: 32000 },
  { date: "Nov 5", inflows: 52000, outflows: 28000 },
  { date: "Nov 10", inflows: 48000, outflows: 35000 },
  { date: "Nov 15", inflows: 61000, outflows: 42000 },
  { date: "Nov 20", inflows: 55000, outflows: 38000 },
  { date: "Nov 25", inflows: 58000, outflows: 40000 },
  { date: "Today", inflows: 63000, outflows: 45000 },
];

const categoryData = [
  { category: "Patient Payments", amount: 185000 },
  { category: "Insurance", amount: 142000 },
  { category: "Pharmacy", amount: 98000 },
  { category: "Lab Services", amount: 76000 },
  { category: "Imaging", amount: 54000 },
];

const paymentMethodData = [
  { name: "Card", value: 45, color: "hsl(var(--primary))" },
  { name: "Cash", value: 25, color: "hsl(var(--success))" },
  { name: "Bank Transfer", value: 20, color: "hsl(var(--info))" },
  { name: "Insurance", value: 10, color: "hsl(var(--warning))" },
];

const arAgingData = [
  { bucket: "0-30", amount: 125000 },
  { bucket: "31-60", amount: 85000 },
  { bucket: "61-90", amount: 45000 },
  { bucket: "91-120", amount: 28000 },
  { bucket: "120+", amount: 15000 },
];

export function OverviewTab() {
  return (
    <div className="space-y-6">
      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <KpiCard
          title="Total Inflows"
          value={1847520}
          variant="success"
          trend={{ value: 12.5, isPositive: true }}
        />
        <KpiCard
          title="Total Outflows"
          value={985340}
          variant="danger"
          trend={{ value: 8.2, isPositive: false }}
        />
        <KpiCard
          title="Net Cash Flow"
          value={862180}
          tooltip="Inflows minus outflows for the selected period"
          variant="info"
          trend={{ value: 15.3, isPositive: true }}
        />
        <KpiCard
          title="Accounts Receivable (AR)"
          value={298000}
          variant="warning"
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <KpiCard
          title="Accounts Payable (AP)"
          value={145000}
          variant="default"
        />
        <KpiCard
          title="Avg Days to Collect (DSO)"
          value={42}
          format="days"
          tooltip="Average days to collect after billing"
          variant="default"
        />
        <KpiCard
          title="Write-offs"
          value={18500}
          variant="warning"
        />
        <KpiCard
          title="Refunds"
          value={12300}
          variant="danger"
        />
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Cash Flow Over Time */}
        <Card>
          <CardHeader>
            <CardTitle>Cash Flow Over Time</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={cashFlowData}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                <XAxis dataKey="date" stroke="hsl(var(--muted-foreground))" />
                <YAxis stroke="hsl(var(--muted-foreground))" />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "hsl(var(--card))",
                    border: "1px solid hsl(var(--border))",
                    borderRadius: "var(--radius)",
                  }}
                />
                <Legend />
                <Line type="monotone" dataKey="inflows" stroke="hsl(var(--success))" strokeWidth={2} name="Inflows" />
                <Line type="monotone" dataKey="outflows" stroke="hsl(var(--danger))" strokeWidth={2} name="Outflows" />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Payment Method Mix */}
        <Card>
          <CardHeader>
            <CardTitle>Payment Method Mix</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={paymentMethodData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  outerRadius={100}
                  fill="hsl(var(--primary))"
                  dataKey="value"
                >
                  {paymentMethodData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Inflows by Category */}
        <Card>
          <CardHeader>
            <CardTitle>Inflows by Category</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={categoryData}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                <XAxis dataKey="category" stroke="hsl(var(--muted-foreground))" angle={-45} textAnchor="end" height={100} />
                <YAxis stroke="hsl(var(--muted-foreground))" />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "hsl(var(--card))",
                    border: "1px solid hsl(var(--border))",
                    borderRadius: "var(--radius)",
                  }}
                />
                <Bar dataKey="amount" fill="hsl(var(--success))" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* AR Aging Buckets */}
        <Card>
          <CardHeader>
            <CardTitle>AR Aging Buckets</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={arAgingData}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                <XAxis dataKey="bucket" stroke="hsl(var(--muted-foreground))" />
                <YAxis stroke="hsl(var(--muted-foreground))" />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "hsl(var(--card))",
                    border: "1px solid hsl(var(--border))",
                    borderRadius: "var(--radius)",
                  }}
                />
                <Bar dataKey="amount" fill="hsl(var(--warning))" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
