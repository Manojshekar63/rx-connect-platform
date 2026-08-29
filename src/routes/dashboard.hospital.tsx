import { createFileRoute } from "@tanstack/react-router";
import {
  Activity,
  AlertTriangle,
  BedDouble,
  Boxes,
  Building2,
  ClipboardList,
  Home,
  Plus,
  Truck,
} from "lucide-react";
import { DashboardLayout } from "@/components/layout/dashboard-layout";
import { StatCard } from "@/components/common/stat-card";
import { Panel } from "@/components/common/panel";
import { DataTable, type Column } from "@/components/common/data-table";
import { StatusBadge } from "@/components/common/status-badge";
import { MixDonutChart, UnitsBarChart } from "@/components/common/charts";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import {
  categoryMix,
  dailyDispense,
  hospitalRequests,
  medicines,
  type Medicine,
  type Order,
} from "@/lib/mock-data";

export const Route = createFileRoute("/dashboard/hospital")({
  head: () => ({
    meta: [
      { title: "Hospital dashboard — PharmaBridge AI" },
      {
        name: "description",
        content:
          "Manage hospital medicine inventory, stock alerts and supply requests with AI forecasting.",
      },
      { property: "og:title", content: "Hospital dashboard — PharmaBridge AI" },
      {
        property: "og:description",
        content: "Inventory, requests and dispensing analytics for your hospital.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: HospitalDashboard,
});

const nav = [
  { label: "Overview", icon: Home, active: true },
  { label: "Inventory", icon: Boxes },
  { label: "Requests", icon: ClipboardList, badge: "3" },
  { label: "Shipments", icon: Truck },
  { label: "Wards", icon: BedDouble },
  { label: "Analytics", icon: Activity },
];

const inventoryColumns: Column<Medicine>[] = [
  {
    key: "name",
    header: "Medicine",
    cell: (r) => (
      <div>
        <p className="font-medium">{r.name}</p>
        <p className="text-xs text-muted-foreground">
          {r.strength} · {r.form}
        </p>
      </div>
    ),
  },
  { key: "batch", header: "Batch", cell: (r) => r.batch },
  { key: "stock", header: "On hand", cell: (r) => r.stock.toLocaleString() },
  { key: "expiry", header: "Expiry", cell: (r) => r.expiry },
  { key: "status", header: "Status", cell: (r) => <StatusBadge status={r.status} /> },
];

const requestColumns: Column<Order>[] = [
  { key: "id", header: "Request", cell: (r) => <span className="font-medium">{r.id}</span> },
  { key: "item", header: "Item", cell: (r) => r.item },
  { key: "party", header: "Supplier", cell: (r) => r.party },
  { key: "quantity", header: "Qty", cell: (r) => r.quantity.toLocaleString() },
  { key: "total", header: "Value", cell: (r) => `$${r.total.toLocaleString()}` },
  { key: "status", header: "Status", cell: (r) => <StatusBadge status={r.status} /> },
];

const wards = [
  { name: "Intensive care", fill: 92 },
  { name: "Emergency", fill: 78 },
  { name: "Oncology", fill: 64 },
  { name: "Paediatrics", fill: 41 },
];

function HospitalDashboard() {
  return (
    <DashboardLayout
      role="hospital"
      roleLabel="Hospital workspace"
      userName="St. Anne's General"
      userMeta="Pharmacy operations"
      nav={nav}
      title="Inventory command centre"
      subtitle="Three supply requests need approval and two SKUs are below par level."
      breadcrumbs={["Hospital", "Overview"]}
      actions={
        <>
          <Button variant="outline">
            <Boxes className="size-4" /> Stock audit
          </Button>
          <Button>
            <Plus className="size-4" /> New supply request
          </Button>
        </>
      }
    >
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard label="SKUs tracked" value="1,482" delta="+34" hint="this month" icon={Boxes} index={0} />
        <StatCard
          label="Below par level"
          value="17"
          delta="4 critical"
          trend="down"
          hint="needs action"
          icon={AlertTriangle}
          index={1}
        />
        <StatCard
          label="Open requests"
          value="9"
          delta="3 pending"
          hint="approval queue"
          icon={ClipboardList}
          index={2}
        />
        <StatCard
          label="Fill rate"
          value="96.4%"
          delta="1.8%"
          hint="last 30 days"
          icon={Building2}
          index={3}
        />
      </div>

      <div className="mt-6 grid gap-4 xl:grid-cols-3">
        <Panel
          title="Daily dispensing volume"
          description="Units dispensed across all wards"
          className="xl:col-span-2"
        >
          <UnitsBarChart data={dailyDispense} xKey="day" barKey="units" label="Units" />
        </Panel>
        <Panel title="Therapeutic mix" description="Share of dispensed volume">
          <MixDonutChart data={categoryMix} />
        </Panel>
      </div>

      <div className="mt-6 grid gap-4 xl:grid-cols-3">
        <Panel
          title="Inventory watchlist"
          description="AI-flagged items at risk in the next 21 days"
          className="xl:col-span-2"
        >
          <DataTable columns={inventoryColumns} rows={medicines} />
        </Panel>
        <Panel title="Ward stock coverage" description="Par-level fulfilment by unit">
          <ul className="space-y-5">
            {wards.map((w) => (
              <li key={w.name}>
                <div className="mb-2 flex items-center justify-between text-sm">
                  <span className="font-medium">{w.name}</span>
                  <span className="text-muted-foreground">{w.fill}%</span>
                </div>
                <Progress value={w.fill} />
              </li>
            ))}
          </ul>
        </Panel>
      </div>

      <div className="mt-6">
        <Panel
          title="Supply requests"
          description="Orders raised with pharmaceutical partners"
          action={<Button variant="ghost">Export CSV</Button>}
        >
          <DataTable columns={requestColumns} rows={hospitalRequests} />
        </Panel>
      </div>
    </DashboardLayout>
  );
}
