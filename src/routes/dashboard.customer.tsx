import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import {
  ClipboardList,
  FileUp,
  Heart,
  Home,
  Package,
  Pill,
  Search,
  Truck,
  Upload,
} from "lucide-react";
import { DashboardLayout } from "@/components/layout/dashboard-layout";
import { StatCard } from "@/components/common/stat-card";
import { Panel } from "@/components/common/panel";
import { DataTable, type Column } from "@/components/common/data-table";
import { StatusBadge } from "@/components/common/status-badge";
import { TrendAreaChart } from "@/components/common/charts";
import { EmptyState } from "@/components/common/states";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { customerOrders, demandTrend, prescriptions, type Order } from "@/lib/mock-data";

export const Route = createFileRoute("/dashboard/customer")({
  head: () => ({
    meta: [
      { title: "Customer dashboard — PharmaBridge AI" },
      {
        name: "description",
        content:
          "Track medicine orders, upload prescriptions and monitor deliveries in your PharmaBridge AI customer workspace.",
      },
      { property: "og:title", content: "Customer dashboard — PharmaBridge AI" },
      {
        property: "og:description",
        content: "Your medicines, prescriptions and deliveries in one place.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: CustomerDashboard,
});

const nav = [
  { label: "Overview", icon: Home, active: true },
  { label: "Find medicines", icon: Search },
  { label: "Prescriptions", icon: FileUp, badge: "1" },
  { label: "Orders", icon: Package },
  { label: "Deliveries", icon: Truck },
  { label: "Saved items", icon: Heart },
];

const orderColumns: Column<Order>[] = [
  { key: "id", header: "Order", cell: (r) => <span className="font-medium">{r.id}</span> },
  { key: "item", header: "Item", cell: (r) => r.item },
  { key: "party", header: "Pharmacy", cell: (r) => r.party },
  { key: "date", header: "Placed", cell: (r) => r.date },
  { key: "total", header: "Total", cell: (r) => `$${r.total.toFixed(2)}` },
  { key: "status", header: "Status", cell: (r) => <StatusBadge status={r.status} /> },
];

function UploadPrescriptionDialog() {
  const [open, setOpen] = useState(false);
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>
          <Upload className="size-4" /> Upload prescription
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Upload a prescription</DialogTitle>
          <DialogDescription>
            Our pharmacist team verifies uploads before any medicine is dispensed.
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="doctor">Prescribing doctor</Label>
            <Input id="doctor" placeholder="Dr. Amara Osei" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="file">Prescription file</Label>
            <div className="flex flex-col items-center border border-dashed border-border px-4 py-8 text-center">
              <FileUp className="mb-2 size-6 text-muted-foreground" />
              <p className="text-sm font-medium">Drop a PDF or photo here</p>
              <p className="text-xs text-muted-foreground">Max 10 MB · JPG, PNG or PDF</p>
              <Input id="file" type="file" className="mt-4 max-w-64" />
            </div>
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => setOpen(false)}>
            Cancel
          </Button>
          <Button onClick={() => setOpen(false)}>Submit for review</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

function CustomerDashboard() {
  return (
    <DashboardLayout
      role="customer"
      roleLabel="Customer workspace"
      userName="Marta Kowalski"
      userMeta="Boston, MA"
      nav={nav}
      title="Good morning, Marta"
      subtitle="Two prescriptions are active and one delivery is on its way."
      breadcrumbs={["Customer", "Overview"]}
      actions={
        <>
          <Button variant="outline">
            <Search className="size-4" /> Find medicine
          </Button>
          <UploadPrescriptionDialog />
        </>
      }
    >
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard label="Active orders" value="3" delta="+1" hint="this week" icon={Package} index={0} />
        <StatCard label="Prescriptions" value="2" hint="1 in review" icon={ClipboardList} index={1} />
        <StatCard
          label="Spent this year"
          value="$1,284"
          delta="8.2%"
          trend="down"
          hint="vs last year"
          icon={Pill}
          index={2}
        />
        <StatCard
          label="Refills due"
          value="4"
          delta="2 soon"
          trend="up"
          hint="next 14 days"
          icon={Truck}
          index={3}
        />
      </div>

      <div className="mt-6 grid gap-4 xl:grid-cols-3">
        <Panel
          title="Your medicine spend"
          description="Prescription value fulfilled vs requested"
          className="xl:col-span-2"
        >
          <TrendAreaChart
            data={demandTrend}
            xKey="month"
            series={[
              { key: "requested", label: "Requested ($)", color: "var(--chart-2)" },
              { key: "fulfilled", label: "Fulfilled ($)", color: "var(--chart-1)" },
            ]}
          />
        </Panel>

        <Panel title="Prescriptions" description="Verified by our pharmacist team">
          <ul className="space-y-3">
            {prescriptions.map((p) => (
              <li key={p.id} className="border border-border p-4">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="text-sm font-semibold">{p.doctor}</p>
                    <p className="text-xs text-muted-foreground">{p.clinic}</p>
                  </div>
                  <StatusBadge status={p.status} />
                </div>
                <p className="mt-3 text-xs text-muted-foreground">
                  {p.id} · {p.items} items · uploaded {p.uploaded}
                </p>
              </li>
            ))}
          </ul>
        </Panel>
      </div>

      <div className="mt-6 grid gap-4 xl:grid-cols-3">
        <Panel
          title="Recent orders"
          description="Everything you ordered in the last 30 days"
          className="xl:col-span-2"
          action={<Button variant="ghost">View all</Button>}
        >
          <DataTable columns={orderColumns} rows={customerOrders} />
        </Panel>

        <Panel title="Saved medicines" description="Quick reorder shortlist">
          <EmptyState
            icon={Heart}
            title="No saved medicines yet"
            description="Save the medicines you reorder often and they'll show up here for one-tap refills."
            action={<Button variant="outline">Browse catalogue</Button>}
          />
        </Panel>
      </div>
    </DashboardLayout>
  );
}
