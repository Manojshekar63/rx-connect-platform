import { useMemo, useState } from "react";
import { motion } from "motion/react";
import {
  Activity,
  AlertTriangle,
  BadgeCheck,
  BedDouble,
  Boxes,
  Building2,
  ClipboardList,
  Home,
  PackageCheck,
  Plus,
  Search,
  Siren,
  Truck,
} from "lucide-react";
import { toast } from "sonner";
import { DashboardLayout } from "@/components/layout/dashboard-layout";
import { StatCard } from "@/components/common/stat-card";
import { Panel } from "@/components/common/panel";
import { DataTable, type Column } from "@/components/common/data-table";
import { StatusBadge } from "@/components/common/status-badge";
import { EmptyState } from "@/components/common/states";
import { MixDonutChart, UnitsBarChart } from "@/components/common/charts";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
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
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import {
  categoryMix,
  dailyDispense,
  hospitalRequests,
  medicines,
  shipments as shipmentSeed,
  wardBreakdown,
  type Medicine,
  type Order,
  type Shipment,
} from "@/lib/mock-data";
import { cn } from "@/lib/utils";

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

/* ---------------------------------- Tabs ---------------------------------- */

const TABS = [
  {
    id: "overview",
    label: "Overview",
    icon: Home,
    title: "Inventory command centre",
  },
  {
    id: "inventory",
    label: "Inventory",
    icon: Boxes,
    title: "Medicine inventory",
  },
  {
    id: "requests",
    label: "Requests",
    icon: ClipboardList,
    title: "Supply request ledger",
  },
  {
    id: "shipments",
    label: "Shipments",
    icon: Truck,
    title: "Incoming shipments",
  },
  {
    id: "wards",
    label: "Wards",
    icon: BedDouble,
    title: "Ward analytics",
  },
] as const;

type TabId = (typeof TABS)[number]["id"];

const TAB_SUBTITLES: Record<TabId, string> = {
  overview: "Live command centre for stock, requests and ward coverage.",
  inventory: "Search, filter and audit the full formulary stock position.",
  requests: "Every request raised with pharmaceutical partners, in one ledger.",
  shipments: "Live tracking for inbound deliveries from partner suppliers.",
  wards: "Bed occupancy and stock coverage across clinical units.",
};

const REQUEST_FILTERS = [
  { id: "all", label: "All" },
  { id: "pending", label: "Pending" },
  { id: "in-transit", label: "In Transit" },
  { id: "delivered", label: "Delivered" },
] as const;

const STOCK_FILTERS = [
  { id: "all", label: "All stock" },
  { id: "in-stock", label: "In Stock" },
  { id: "low-stock", label: "Low Stock" },
  { id: "out-of-stock", label: "Out of Stock" },
  { id: "expiring", label: "Expiring" },
] as const;

const SHIPMENT_STEPS = ["Placed", "Dispatched", "In Transit", "Delivered"];

const SUPPLIERS = ["Helvex Biotech", "Corvea Labs", "Nordis Pharma", "Meridian Health"];
const DESTINATION_WARDS = ["ICU", "Emergency", "Central Storage"];
const PRIORITIES = ["Routine", "Urgent", "Critical"];

function FilterChip({
  active,
  label,
  count,
  onClick,
}: {
  active: boolean;
  label: string;
  count?: number;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={active}
      className={cn(
        "flex items-center gap-1.5 border px-3 py-1.5 text-[11px] font-semibold uppercase tracking-[0.08em] transition-colors",
        active
          ? "border-primary bg-primary/10 text-primary"
          : "border-border text-muted-foreground hover:bg-muted hover:text-foreground",
      )}
    >
      {label}
      {typeof count === "number" ? (
        <span className={cn("text-[10px]", active ? "text-primary" : "text-muted-foreground")}>
          {count}
        </span>
      ) : null}
    </button>
  );
}

function TrackingStepper({ stage }: { stage: number }) {
  return (
    <ol className="flex items-start">
      {SHIPMENT_STEPS.map((step, i) => (
        <li key={step} className="flex flex-1 items-start last:flex-none">
          <div className="flex flex-col items-center gap-1.5">
            <span
              className={cn(
                "flex size-4 items-center justify-center rounded-full border",
                i <= stage ? "border-secondary bg-secondary" : "border-border bg-muted",
              )}
            >
              {i <= stage ? <span className="size-1.5 rounded-full bg-secondary-foreground" /> : null}
            </span>
            <span
              className={cn(
                "whitespace-nowrap text-[10px] font-medium uppercase tracking-wide",
                i <= stage ? "text-foreground" : "text-muted-foreground",
              )}
            >
              {step}
            </span>
          </div>
          {i < SHIPMENT_STEPS.length - 1 ? (
            <span className={cn("mx-1.5 mt-2 h-px flex-1", i < stage ? "bg-secondary" : "bg-border")} />
          ) : null}
        </li>
      ))}
    </ol>
  );
}

/* ------------------------------- Inventory view ---------------------------- */

function InventoryView({ inventory }: { inventory: Medicine[] }) {
  const [query, setQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<(typeof STOCK_FILTERS)[number]["id"]>("all");

  const counts = useMemo(() => {
    const map: Record<string, number> = { all: inventory.length };
    for (const f of STOCK_FILTERS) {
      if (f.id !== "all") map[f.id] = inventory.filter((m) => m.status === f.id).length;
    }
    return map;
  }, [inventory]);

  const rows = useMemo(() => {
    const q = query.trim().toLowerCase();
    return inventory.filter((m) => {
      const matchesStatus = statusFilter === "all" || m.status === statusFilter;
      const matchesQuery =
        q === "" || m.name.toLowerCase().includes(q) || m.batch.toLowerCase().includes(q);
      return matchesStatus && matchesQuery;
    });
  }, [inventory, query, statusFilter]);

  const columns: Column<Medicine>[] = [
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
    { key: "category", header: "Category", cell: (r) => r.category },
    { key: "batch", header: "Batch", cell: (r) => r.batch },
    { key: "stock", header: "Stock on hand", cell: (r) => r.stock.toLocaleString() },
    { key: "par", header: "Par level", cell: (r) => r.parLevel.toLocaleString() },
    { key: "expiry", header: "Expiry", cell: (r) => r.expiry },
    { key: "status", header: "Status", cell: (r) => <StatusBadge status={r.status} /> },
  ];

  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
        <div className="relative w-full max-w-sm">
          <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search by medicine name or batch…"
            className="pl-9"
            aria-label="Search inventory"
          />
        </div>
        <div className="flex flex-wrap gap-2">
          {STOCK_FILTERS.map((f) => (
            <FilterChip
              key={f.id}
              label={f.label}
              count={counts[f.id]}
              active={statusFilter === f.id}
              onClick={() => setStatusFilter(f.id)}
            />
          ))}
        </div>
      </div>

      <DataTable
        columns={columns}
        rows={rows}
        emptyTitle="No medicines match"
        emptyDescription="Try a different search term or clear the status filters."
      />
    </div>
  );
}

/* ------------------------------- Requests view ----------------------------- */

function RequestDetailDrawer({
  order,
  onClose,
}: {
  order: Order | null;
  onClose: () => void;
}) {
  if (!order) return null;

  const base = new Date(order.date);
  const day = (offset: number) => {
    const d = new Date(base);
    d.setDate(d.getDate() + offset);
    return d.toLocaleDateString("en-US", { month: "short", day: "numeric" });
  };

  const timeline = [
    { label: "Requested", date: day(0), reached: true },
    { label: "Approved", date: day(1), reached: order.status !== "pending" },
    { label: "Dispatched", date: day(2), reached: order.status === "in-transit" || order.status === "delivered" },
    { label: "Delivered", date: day(3), reached: order.status === "delivered" },
  ];

  const breakdown: [string, string][] = [
    ["Order", order.id],
    ["Item", order.item],
    ["Supplier", order.party],
    ["Quantity", order.quantity.toLocaleString()],
    ["Order value", `$${order.total.toLocaleString()}`],
    ["Raised", day(0)],
  ];

  return (
    <Sheet open={!!order} onOpenChange={(open) => !open && onClose()}>
      <SheetContent side="right" className="w-full overflow-y-auto sm:max-w-md">
        <SheetHeader>
          <SheetTitle className="font-display text-2xl">Request {order.id}</SheetTitle>
          <SheetDescription>Order breakdown, timestamps and approved items</SheetDescription>
        </SheetHeader>

        <div className="mt-6 space-y-6 px-1 pb-6">
          <section>
            <p className="editorial-label mb-3">Breakdown</p>
            <dl className="space-y-2.5 text-sm">
              {breakdown.map(([k, v]) => (
                <div key={k} className="flex items-start justify-between gap-4">
                  <dt className="text-muted-foreground">{k}</dt>
                  <dd className="text-right font-medium">{v}</dd>
                </div>
              ))}
              <div className="flex items-center justify-between">
                <dt className="text-muted-foreground">Status</dt>
                <dd>
                  <StatusBadge status={order.status} />
                </dd>
              </div>
            </dl>
          </section>

          <Separator />

          <section>
            <p className="editorial-label mb-3">Timeline</p>
            <ol className="space-y-3">
              {timeline.map((t) => (
                <li key={t.label} className="flex items-center gap-3 text-sm">
                  <span
                    className={cn(
                      "size-2 rounded-full",
                      t.reached ? "bg-secondary" : "border border-border bg-muted",
                    )}
                  />
                  <span className={cn("flex-1", t.reached ? "font-medium" : "text-muted-foreground")}>
                    {t.label}
                  </span>
                  <span className="text-xs text-muted-foreground">{t.reached ? t.date : "—"}</span>
                </li>
              ))}
            </ol>
          </section>

          <Separator />

          <section>
            <p className="editorial-label mb-3">Approved items</p>
            <ul className="space-y-2">
              <li className="flex items-start justify-between gap-3 border border-border bg-muted/40 p-3 text-sm">
                <div>
                  <p className="font-medium">{order.item}</p>
                  <p className="mt-0.5 text-xs text-muted-foreground">
                    Approved by pharmacy operations
                  </p>
                </div>
                <BadgeCheck className="size-5 shrink-0 text-secondary" />
              </li>
            </ul>
          </section>
        </div>
      </SheetContent>
    </Sheet>
  );
}

function RequestsView({
  requests,
  onOpenOrder,
}: {
  requests: Order[];
  onOpenOrder: (order: Order) => void;
}) {
  const [filter, setFilter] = useState<(typeof REQUEST_FILTERS)[number]["id"]>("all");

  const counts = useMemo(() => {
    const map: Record<string, number> = { all: requests.length };
    for (const f of REQUEST_FILTERS) {
      if (f.id !== "all") map[f.id] = requests.filter((r) => r.status === f.id).length;
    }
    return map;
  }, [requests]);

  const rows = requests.filter((r) => filter === "all" || r.status === filter);

  const columns: Column<Order>[] = [
    { key: "id", header: "Request", cell: (r) => <span className="font-medium">{r.id}</span> },
    { key: "item", header: "Item", cell: (r) => r.item },
    { key: "party", header: "Supplier", cell: (r) => r.party },
    { key: "quantity", header: "Qty", cell: (r) => r.quantity.toLocaleString() },
    { key: "total", header: "Value", cell: (r) => `$${r.total.toLocaleString()}` },
    { key: "date", header: "Raised", cell: (r) => r.date },
    { key: "status", header: "Status", cell: (r) => <StatusBadge status={r.status} /> },
  ];

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap gap-2">
        {REQUEST_FILTERS.map((f) => (
          <FilterChip
            key={f.id}
            label={f.label}
            count={counts[f.id]}
            active={filter === f.id}
            onClick={() => setFilter(f.id)}
          />
        ))}
      </div>

      <DataTable
        columns={columns}
        rows={rows}
        onRowClick={onOpenOrder}
        emptyTitle="No requests in this state"
        emptyDescription="New requests raised with suppliers will appear here."
      />
    </div>
  );
}

/* ------------------------------ Shipments view ----------------------------- */

function ShipmentsView({
  shipments,
  onAcknowledge,
}: {
  shipments: Shipment[];
  onAcknowledge: (id: string) => void;
}) {
  if (shipments.length === 0) {
    return (
      <EmptyState
        icon={Truck}
        title="No inbound shipments"
        description="Dispatched deliveries from your suppliers will be tracked here."
      />
    );
  }

  return (
    <div className="grid gap-4 xl:grid-cols-2">
      {shipments.map((s) => (
        <Panel key={s.id} title={s.id} description={s.item}>
          <dl className="grid grid-cols-2 gap-x-4 gap-y-2 text-sm sm:grid-cols-3">
            <div>
              <dt className="editorial-label">Carrier</dt>
              <dd className="mt-1 font-medium">{s.carrier}</dd>
            </div>
            <div>
              <dt className="editorial-label">Origin</dt>
              <dd className="mt-1 font-medium">{s.origin}</dd>
            </div>
            <div>
              <dt className="editorial-label">ETA</dt>
              <dd className="mt-1 font-medium">{s.eta}</dd>
            </div>
          </dl>
          <div className="mt-5 border-t border-border pt-5">
            <TrackingStepper stage={s.stage} />
          </div>
          <div className="mt-5 flex items-center justify-between">
            <p className="text-xs text-muted-foreground">
              {s.quantity.toLocaleString()} units · {SHIPMENT_STEPS[s.stage]}
            </p>
            {s.stage < 3 ? (
              <Button size="sm" onClick={() => onAcknowledge(s.id)}>
                <PackageCheck className="size-4" /> Acknowledge delivery
              </Button>
            ) : (
              <StatusBadge status="delivered" />
            )}
          </div>
        </Panel>
      ))}
    </div>
  );
}

/* -------------------------------- Wards view ------------------------------- */

function WardsView({ onAlertWard }: { onAlertWard: (ward: string) => void }) {
  return (
    <Panel
      title="Ward breakdown"
      description="Bed occupancy and medicine stock coverage by clinical unit"
    >
      <div className="space-y-6">
        {wardBreakdown.map((w) => (
          <div key={w.name} className="border-b border-border pb-6 last:border-0 last:pb-0">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <h3 className="font-display text-xl">{w.name}</h3>
              <Button variant="outline" size="sm" onClick={() => onAlertWard(w.name)}>
                <Siren className="size-4" /> Alert ward pharmacy
              </Button>
            </div>
            <div className="mt-4 grid gap-5 sm:grid-cols-2">
              <div>
                <div className="mb-2 flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Bed occupancy</span>
                  <span className="font-medium">
                    {w.occupied}/{w.beds} beds
                  </span>
                </div>
                <Progress value={Math.round((w.occupied / w.beds) * 100)} />
              </div>
              <div>
                <div className="mb-2 flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Stock coverage</span>
                  <span className="font-medium">{w.coverage}%</span>
                </div>
                <Progress value={w.coverage} />
              </div>
            </div>
          </div>
        ))}
      </div>
    </Panel>
  );
}

/* ------------------------------- Overview view ----------------------------- */

function OverviewView({
  requests,
  inventory,
  onOpenOrder,
  onGoToRequests,
  onGoToWards,
}: {
  requests: Order[];
  inventory: Medicine[];
  onOpenOrder: (order: Order) => void;
  onGoToRequests: () => void;
  onGoToWards: () => void;
}) {
  const flagged = inventory.filter(
    (m) => m.status === "low-stock" || m.status === "out-of-stock" || m.status === "expiring",
  );

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

  return (
    <>
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard label="SKUs tracked" value={inventory.length.toLocaleString()} delta="+34" hint="this month" icon={Boxes} index={0} />
        <StatCard
          label="Below par level"
          value={flagged.length.toLocaleString()}
          delta="4 critical"
          trend="down"
          hint="needs action"
          icon={AlertTriangle}
          index={1}
        />
        <StatCard
          label="Open requests"
          value={requests.filter((r) => r.status === "pending").length.toLocaleString()}
          delta="approval queue"
          hint="pending sign-off"
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
          <DataTable columns={inventoryColumns} rows={flagged} />
        </Panel>
        <Panel
          title="Ward stock coverage"
          description="Par-level fulfilment by unit"
          action={
            <Button variant="ghost" size="sm" onClick={onGoToWards}>
              View wards
            </Button>
          }
        >
          <ul className="space-y-5">
            {wardBreakdown.map((w) => (
              <li key={w.name}>
                <div className="mb-2 flex items-center justify-between text-sm">
                  <span className="font-medium">{w.name}</span>
                  <span className="text-muted-foreground">{w.coverage}%</span>
                </div>
                <Progress value={w.coverage} />
              </li>
            ))}
          </ul>
        </Panel>
      </div>

      <div className="mt-6">
        <Panel
          title="Supply requests"
          description="Orders raised with pharmaceutical partners"
          action={
            <Button variant="ghost" onClick={onGoToRequests}>
              View all requests
            </Button>
          }
        >
          <DataTable columns={requestColumns} rows={requests.slice(0, 4)} onRowClick={onOpenOrder} />
        </Panel>
      </div>
    </>
  );
}

/* ---------------------------------- Dialogs -------------------------------- */

function NewSupplyRequestDialog({
  open,
  onOpenChange,
  inventory,
  nextRequestId,
  onSubmit,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  inventory: Medicine[];
  nextRequestId: string;
  onSubmit: (order: Order, priority: string, ward: string) => void;
}) {
  const [medicineId, setMedicineId] = useState("");
  const [quantity, setQuantity] = useState("100");
  const [priority, setPriority] = useState("");
  const [ward, setWard] = useState("");
  const [supplier, setSupplier] = useState("");
  const [errors, setErrors] = useState<Record<string, string>>({});

  const reset = () => {
    setMedicineId("");
    setQuantity("100");
    setPriority("");
    setWard("");
    setSupplier("");
    setErrors({});
  };

  const handleSubmit = () => {
    const next: Record<string, string> = {};
    if (!medicineId) next.medicineId = "Select a medicine.";
    const qty = Number(quantity);
    if (!quantity || Number.isNaN(qty) || qty <= 0 || !Number.isInteger(qty)) {
      next.quantity = "Enter a whole quantity of at least 1.";
    }
    if (!priority) next.priority = "Choose a priority level.";
    if (!ward) next.ward = "Choose a destination ward.";
    if (!supplier) next.supplier = "Choose a preferred supplier.";
    setErrors(next);
    if (Object.keys(next).length > 0) return;

    const med = inventory.find((m) => m.id === medicineId)!;
    const order: Order = {
      id: nextRequestId,
      item: `${med.name} ${med.strength} × ${qty}`,
      party: supplier,
      quantity: qty,
      total: Math.round(qty * med.price * 100) / 100,
      status: "pending",
      date: new Date().toISOString().slice(0, 10),
    };
    onSubmit(order, priority, ward);
    reset();
    onOpenChange(false);
  };

  const fieldError = (key: string) =>
    errors[key] ? <p className="mt-1 text-xs text-destructive">{errors[key]}</p> : null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle className="font-display text-2xl">New supply request</DialogTitle>
          <DialogDescription>
            Raise a request with a pharmaceutical partner. It enters the ledger as Pending.
          </DialogDescription>
        </DialogHeader>

        <div className="grid gap-4">
          <div>
            <Label htmlFor="req-medicine">Medicine</Label>
            <Select value={medicineId} onValueChange={setMedicineId}>
              <SelectTrigger id="req-medicine" className="mt-1.5 w-full">
                <SelectValue placeholder="Select medicine" />
              </SelectTrigger>
              <SelectContent>
                {inventory.map((m) => (
                  <SelectItem key={m.id} value={m.id}>
                    {m.name} {m.strength}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {fieldError("medicineId")}
          </div>

          <div>
            <Label htmlFor="req-quantity">Quantity (units)</Label>
            <Input
              id="req-quantity"
              type="number"
              min={1}
              value={quantity}
              onChange={(e) => setQuantity(e.target.value)}
              className="mt-1.5"
            />
            {fieldError("quantity")}
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <Label>Priority level</Label>
              <Select value={priority} onValueChange={setPriority}>
                <SelectTrigger className="mt-1.5 w-full">
                  <SelectValue placeholder="Select priority" />
                </SelectTrigger>
                <SelectContent>
                  {PRIORITIES.map((p) => (
                    <SelectItem key={p} value={p}>
                      {p}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {fieldError("priority")}
            </div>
            <div>
              <Label>Destination ward</Label>
              <Select value={ward} onValueChange={setWard}>
                <SelectTrigger className="mt-1.5 w-full">
                  <SelectValue placeholder="Select ward" />
                </SelectTrigger>
                <SelectContent>
                  {DESTINATION_WARDS.map((w) => (
                    <SelectItem key={w} value={w}>
                      {w}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {fieldError("ward")}
            </div>
          </div>

          <div>
            <Label>Preferred supplier</Label>
            <Select value={supplier} onValueChange={setSupplier}>
              <SelectTrigger className="mt-1.5 w-full">
                <SelectValue placeholder="Select supplier" />
              </SelectTrigger>
              <SelectContent>
                {SUPPLIERS.map((s) => (
                  <SelectItem key={s} value={s}>
                    {s}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {fieldError("supplier")}
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={handleSubmit}>
            <Plus className="size-4" /> Submit request
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

function StockAuditDialog({
  open,
  onOpenChange,
  inventory,
  lastAudited,
  onReconcile,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  inventory: Medicine[];
  lastAudited: string;
  onReconcile: (counts: { id: string; count: number }[]) => void;
}) {
  const flagged = inventory.filter(
    (m) => m.status === "low-stock" || m.status === "out-of-stock" || m.status === "expiring",
  );
  const [counts, setCounts] = useState<Record<string, string>>({});
  const [error, setError] = useState("");

  const valueFor = (m: Medicine) => counts[m.id] ?? String(m.stock);

  const handleSubmit = () => {
    const parsed: { id: string; count: number }[] = [];
    for (const m of flagged) {
      const n = Number(valueFor(m));
      if (quantityInvalid(n)) {
        setError("Physical counts must be whole numbers of 0 or more.");
        return;
      }
      parsed.push({ id: m.id, count: n });
    }
    setError("");
    onReconcile(parsed);
    setCounts({});
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-xl">
        <DialogHeader>
          <DialogTitle className="font-display text-2xl">Stock audit</DialogTitle>
          <DialogDescription>
            {flagged.length} flagged item{flagged.length === 1 ? "" : "s"} need a physical count.
            Last audited {lastAudited}.
          </DialogDescription>
        </DialogHeader>

        <div className="max-h-80 space-y-3 overflow-y-auto pr-1">
          {flagged.map((m) => (
            <div key={m.id} className="flex items-center gap-3 border border-border p-3">
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-medium">
                  {m.name} {m.strength}
                </p>
                <p className="mt-0.5 text-xs text-muted-foreground">
                  Batch {m.batch} · system {m.stock.toLocaleString()} units
                </p>
              </div>
              <StatusBadge status={m.status} />
              <div className="w-24 shrink-0">
                <Input
                  type="number"
                  min={0}
                  aria-label={`Physical count for ${m.name}`}
                  value={valueFor(m)}
                  onChange={(e) => setCounts((prev) => ({ ...prev, [m.id]: e.target.value }))}
                />
              </div>
            </div>
          ))}
        </div>
        {error ? <p className="text-xs text-destructive">{error}</p> : null}

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={handleSubmit}>
            <Activity className="size-4" /> Audit &amp; reconcile
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

function quantityInvalid(n: number) {
  return Number.isNaN(n) || n < 0 || !Number.isInteger(n);
}

/* ------------------------------- Main component ---------------------------- */

function formatAuditTime() {
  return new Date().toLocaleString("en-US", {
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

function HospitalDashboard() {
  const [tab, setTab] = useState<TabId>("overview");
  const [requests, setRequests] = useState<Order[]>(hospitalRequests);
  const [inventory, setInventory] = useState<Medicine[]>(medicines);
  const [shipments, setShipments] = useState<Shipment[]>(shipmentSeed);
  const [requestOpen, setRequestOpen] = useState(false);
  const [auditOpen, setAuditOpen] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [lastAudited, setLastAudited] = useState("Aug 12, 09:20");

  const pendingCount = requests.filter((r) => r.status === "pending").length;
  const flaggedCount = inventory.filter(
    (m) => m.status === "low-stock" || m.status === "out-of-stock" || m.status === "expiring",
  ).length;

  const nav = TABS.map((t) => ({
    label: t.label,
    icon: t.icon,
    active: tab === t.id,
    badge: t.id === "requests" && pendingCount > 0 ? String(pendingCount) : undefined,
    onClick: () => setTab(t.id),
  }));

  const meta = TABS.find((t) => t.id === tab)!;

  const overviewSubtitle = `${pendingCount} supply request${pendingCount === 1 ? "" : "s"} need${
    pendingCount === 1 ? "s" : ""
  } approval and ${flaggedCount} SKU${flaggedCount === 1 ? " is" : "s are"} below par level.`;

  const handleSubmitRequest = (order: Order, priority: string, ward: string) => {
    setRequests((prev) => [order, ...prev]);
    toast.success(`Request ${order.id} submitted successfully`, {
      description: `${priority} priority · ${ward} · ${order.party}`,
    });
  };

  const handleReconcile = (updates: { id: string; count: number }[]) => {
    const countById = new Map(updates.map((u) => [u.id, u.count]));
    setInventory((prev) =>
      prev.map((m) => {
        const count = countById.get(m.id);
        if (count === undefined) return m;
        let status = m.status;
        if (count === 0) status = "out-of-stock";
        else if (m.status === "expiring") status = "expiring";
        else if (count < m.parLevel) status = "low-stock";
        else status = "in-stock";
        return { ...m, stock: count, status };
      }),
    );
    const changed = updates.filter((u, i) => {
      const original = inventory.find((m) => m.id === u.id);
      return original && original.stock !== u.count;
    }).length;
    setLastAudited(formatAuditTime());
    toast.success("Audit reconciled", {
      description: `${updates.length} item${updates.length === 1 ? "" : "s"} counted${
        changed > 0 ? ` · ${changed} stock level${changed === 1 ? "" : "s"} updated` : " · no variances found"
      }`,
    });
  };

  const handleAcknowledge = (id: string) => {
    setShipments((prev) =>
      prev.map((s) => (s.id === id ? { ...s, stage: 3 as const, eta: "Delivered" } : s)),
    );
    toast.success(`Shipment ${id} acknowledged`, {
      description: "Delivery confirmed — inventory records are being updated.",
    });
  };

  const handleAlertWard = (ward: string) => {
    toast.success(`Ward pharmacy alerted for ${ward}`, {
      description: "A restock notification was sent to the ward's pharmacy liaison.",
    });
  };

  const activeTab = tab;

  return (
    <>
      <DashboardLayout
        role="hospital"
        roleLabel="Hospital workspace"
        userName="St. Anne's General"
        userMeta="Pharmacy operations"
        nav={nav}
        title={meta.title}
        subtitle={
          activeTab === "overview" ? overviewSubtitle : TAB_SUBTITLES[activeTab]
        }
        breadcrumbs={["Hospital", meta.label]}
        actions={
          <>
            <Button variant="outline" onClick={() => setAuditOpen(true)}>
              <Boxes className="size-4" /> Stock audit
            </Button>
            <Button onClick={() => setRequestOpen(true)}>
              <Plus className="size-4" /> New supply request
            </Button>
          </>
        }
      >
        <motion.div
          key={activeTab}
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          {activeTab === "overview" ? (
            <OverviewView
              requests={requests}
              inventory={inventory}
              onOpenOrder={setSelectedOrder}
              onGoToRequests={() => setTab("requests")}
              onGoToWards={() => setTab("wards")}
            />
          ) : null}
          {activeTab === "inventory" ? <InventoryView inventory={inventory} /> : null}
          {activeTab === "requests" ? (
            <RequestsView requests={requests} onOpenOrder={setSelectedOrder} />
          ) : null}
          {activeTab === "shipments" ? (
            <ShipmentsView shipments={shipments} onAcknowledge={handleAcknowledge} />
          ) : null}
          {activeTab === "wards" ? <WardsView onAlertWard={handleAlertWard} /> : null}
        </motion.div>
      </DashboardLayout>

      <NewSupplyRequestDialog
        open={requestOpen}
        onOpenChange={setRequestOpen}
        inventory={inventory}
        nextRequestId={`REQ-${4472 + requests.length}`}
        onSubmit={handleSubmitRequest}
      />
      <StockAuditDialog
        open={auditOpen}
        onOpenChange={setAuditOpen}
        inventory={inventory}
        lastAudited={lastAudited}
        onReconcile={handleReconcile}
      />
      <RequestDetailDrawer order={selectedOrder} onClose={() => setSelectedOrder(null)} />
    </>
  );
}
