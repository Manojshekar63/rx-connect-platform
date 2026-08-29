import { createFileRoute } from "@tanstack/react-router";
import {
  BarChart3,
  Factory,
  FlaskConical,
  Home,
  Package,
  Plus,
  Truck,
  Users,
} from "lucide-react";
import { DashboardLayout } from "@/components/layout/dashboard-layout";
import { StatCard } from "@/components/common/stat-card";
import { Panel } from "@/components/common/panel";
import { DataTable, type Column } from "@/components/common/data-table";
import { StatusBadge } from "@/components/common/status-badge";
import { ReliabilityLineChart, TrendAreaChart } from "@/components/common/charts";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import {
  demandTrend,
  medicines,
  pharmaOrders,
  supplyReliability,
  type Medicine,
  type Order,
} from "@/lib/mock-data";

export const Route = createFileRoute("/dashboard/pharmaceutical")({
  head: () => ({
    meta: [
      { title: "Pharmaceutical dashboard — PharmaBridge AI" },
      {
        name: "description",
        content:
          "Manage pharmaceutical products, production batches and distribution to hospitals and pharmacies.",
      },
      { property: "og:title", content: "Pharmaceutical dashboard — PharmaBridge AI" },
      {
        property: "og:description",
        content: "Products, supply orders and distribution performance at a glance.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: PharmaDashboard,
});

const nav = [
  { label: "Overview", icon: Home, active: true },
  { label: "Products", icon: FlaskConical },
  { label: "Production", icon: Factory },
  { label: "Supply orders", icon: Package, badge: "5" },
  { label: "Distribution", icon: Truck },
  { label: "Partners", icon: Users },
  { label: "Analytics", icon: BarChart3 },
];

const productColumns: Column<Medicine>[] = [
  {
    key: "name",
    header: "Product",
    cell: (r) => (
      <div>
        <p className="font-medium">{r.name}</p>
        <p className="text-xs text-muted-foreground">{r.generic}</p>
      </div>
    ),
  },
  { key: "form", header: "Form", cell: (r) => `${r.form} · ${r.strength}` },
  { key: "price", header: "Unit price", cell: (r) => `$${r.price.toFixed(2)}` },
  { key: "stock", header: "Available", cell: (r) => r.stock.toLocaleString() },
  { key: "status", header: "Status", cell: (r) => <StatusBadge status={r.status} /> },
];

const orderColumns: Column<Order>[] = [
  { key: "id", header: "Order", cell: (r) => <span className="font-medium">{r.id}</span> },
  { key: "item", header: "Line item", cell: (r) => r.item },
  { key: "party", header: "Buyer", cell: (r) => r.party },
  { key: "total", header: "Value", cell: (r) => `$${r.total.toLocaleString()}` },
  { key: "date", header: "Placed", cell: (r) => r.date },
  { key: "status", header: "Status", cell: (r) => <StatusBadge status={r.status} /> },
];

const lines = [
  { name: "Line A — Solid dose", value: 88 },
  { name: "Line B — Injectables", value: 72 },
  { name: "Line C — Inhalers", value: 54 },
];

function PharmaDashboard() {
  return (
    <DashboardLayout
      role="pharma"
      roleLabel="Pharmaceutical workspace"
      userName="Nordis Pharma"
      userMeta="Supply operations"
      nav={nav}
      title="Supply and production overview"
      subtitle="Demand forecast is up 12% for antibiotics next quarter."
      breadcrumbs={["Pharmaceutical", "Overview"]}
      actions={
        <>
          <Button variant="outline">
            <Factory className="size-4" /> Schedule batch
          </Button>
          <Button>
            <Plus className="size-4" /> Add product
          </Button>
        </>
      }
    >
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard
          label="Active products"
          value="248"
          delta="+6"
          hint="new registrations"
          icon={FlaskConical}
          index={0}
        />
        <StatCard
          label="Open supply orders"
          value="37"
          delta="12.4%"
          hint="vs last month"
          icon={Package}
          index={1}
        />
        <StatCard
          label="Quarterly revenue"
          value="$4.82M"
          delta="9.1%"
          hint="on track"
          icon={BarChart3}
          index={2}
        />
        <StatCard
          label="On-time delivery"
          value="94.7%"
          delta="0.6%"
          trend="down"
          hint="last 90 days"
          icon={Truck}
          index={3}
        />
      </div>

      <div className="mt-6 grid gap-4 xl:grid-cols-3">
        <Panel
          title="Demand vs fulfilment"
          description="Units in thousands across all buyers"
          className="xl:col-span-2"
        >
          <TrendAreaChart
            data={demandTrend}
            xKey="month"
            series={[
              { key: "requested", label: "Demand", color: "var(--chart-4)" },
              { key: "fulfilled", label: "Fulfilled", color: "var(--chart-3)" },
            ]}
          />
        </Panel>
        <Panel title="Production line capacity" description="Current utilisation">
          <ul className="space-y-5">
            {lines.map((l) => (
              <li key={l.name}>
                <div className="mb-2 flex items-center justify-between text-sm">
                  <span className="font-medium">{l.name}</span>
                  <span className="text-muted-foreground">{l.value}%</span>
                </div>
                <Progress value={l.value} />
              </li>
            ))}
          </ul>
        </Panel>
      </div>

      <div className="mt-6 grid gap-4 xl:grid-cols-3">
        <Panel
          title="Product catalogue"
          description="Distributed across 320 partner facilities"
          className="xl:col-span-2"
          action={<Button variant="ghost">Manage catalogue</Button>}
        >
          <DataTable columns={productColumns} rows={medicines} />
        </Panel>
        <Panel title="Distribution reliability" description="Network benchmark">
          <ReliabilityLineChart data={supplyReliability} />
        </Panel>
      </div>

      <div className="mt-6">
        <Panel title="Incoming supply orders" description="Hospital and pharmacy purchase orders">
          <DataTable columns={orderColumns} rows={pharmaOrders} />
        </Panel>
      </div>
    </DashboardLayout>
  );
}
