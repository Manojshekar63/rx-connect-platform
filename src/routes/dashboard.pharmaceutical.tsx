import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useMemo, useRef, useState, type RefObject } from "react";
import { motion } from "motion/react";
import {
  BarChart3,
  Factory,
  FlaskConical,
  Home,
  Package,
  PackagePlus,
  Pencil,
  Plus,
  Search,
  Truck,
} from "lucide-react";
import { toast } from "sonner";
import { DashboardLayout } from "@/components/layout/dashboard-layout";
import { StatCard } from "@/components/common/stat-card";
import { Panel } from "@/components/common/panel";
import { DataTable, type Column } from "@/components/common/data-table";
import { StatusBadge } from "@/components/common/status-badge";
import { ReliabilityLineChart, TrendAreaChart } from "@/components/common/charts";
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
  batchSchedule as batchSeed,
  demandTrend,
  medicines as productSeed,
  pharmaOrders as orderSeed,
  productionLines as lineSeed,
  supplyReliability,
  type Batch,
  type Medicine,
  type Order,
  type OrderStatus,
  type ProductionLine,
} from "@/lib/mock-data";
import { cn } from "@/lib/utils";

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

/* ---------------------------------- Tabs ---------------------------------- */

const TABS = [
  {
    id: "overview",
    label: "Overview",
    icon: Home,
    title: "Supply and production overview",
    subtitle: "Live demand, capacity and distribution across the network.",
  },
  {
    id: "products",
    label: "Products",
    icon: FlaskConical,
    title: "Product catalogue",
    subtitle: "Register, edit and restock every item in the formulary.",
  },
  {
    id: "production",
    label: "Production",
    icon: Factory,
    title: "Production operations",
    subtitle: "Line capacity, output rates and the active batch schedule.",
  },
  {
    id: "orders",
    label: "Supply orders",
    icon: Package,
    title: "Supply order ledger",
    subtitle: "Hospital and pharmacy purchase orders end to end.",
  },
] as const;

type TabId = (typeof TABS)[number]["id"];

const PRODUCT_FILTERS = [
  { id: "all", label: "All" },
  { id: "in-stock", label: "In Stock" },
  { id: "low-stock", label: "Low Stock" },
  { id: "out-of-stock", label: "Out of Stock" },
  { id: "expiring", label: "Expiring" },
] as const;

const ORDER_FILTERS = [
  { id: "all", label: "All" },
  { id: "pending", label: "Pending" },
  { id: "processing", label: "Processing" },
  { id: "in-transit", label: "In Transit" },
  { id: "delivered", label: "Delivered" },
] as const;

const ORDER_FLOW: OrderStatus[] = ["pending", "processing", "in-transit", "delivered"];

const STATUS_LABEL: Record<OrderStatus, string> = {
  pending: "Pending",
  processing: "Processing",
  "in-transit": "In Transit",
  delivered: "Delivered",
  cancelled: "Cancelled",
};

const DOSAGE_FORMS = ["Capsule", "Tablet", "Injection", "Inhaler", "Syrup"];

const DISPATCH: Record<string, { carrier: string; origin: string; dispatched: string }> = {
  "SUP-9120": { carrier: "ColdChain Express", origin: "Nordis Pharma — Plant 1", dispatched: "Aug 29, 08:10" },
  "SUP-9114": { carrier: "MedFreight Lines", origin: "Nordis Pharma — Plant 2", dispatched: "Aug 26, 10:30" },
  "SUP-9101": { carrier: "Swift Medical Logistics", origin: "Nordis Pharma — Distribution", dispatched: "Aug 21, 09:00" },
  "SUP-9088": { carrier: "Awaiting assignment", origin: "Nordis Pharma — Warehouse A", dispatched: "—" },
};

const BUYER_ADDRESS: Record<string, string> = {
  "St. Anne's General Hospital": "240 Riverside Parkway, Cleveland, OH 44113",
  "Northfield Medical Center": "18 Harborview Street, Portland, ME 04101",
  "Riverside Pharmacy Group": "77 Market Square, Camden, NJ 08102",
  "Lakeview Clinic Network": "910 Lakeshore Drive, Madison, WI 53703",
};

interface FieldErrors {
  name?: string;
  generic?: string;
  form?: string;
  strength?: string;
  price?: string;
  stock?: string;
  productId?: string;
  lineId?: string;
  target?: string;
  start?: string;
  completion?: string;
}

function statusFromStock(stock: number, parLevel: number): Medicine["status"] {
  if (stock <= 0) return "out-of-stock";
  if (stock < parLevel) return "low-stock";
  return "in-stock";
}

function isPositiveInt(value: string) {
  const n = Number(value);
  return !Number.isNaN(n) && Number.isInteger(n) && n > 0;
}

function FilterChip({
  active,
  label,
  count,
  onClick,
}: {
  active: boolean;
  label: string;
  count?: number | undefined;
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

/* ------------------------------ Products view ------------------------------ */

function ProductsView({
  products,
  searchRef,
  focusSignal,
  onEdit,
  onRestock,
}: {
  products: Medicine[];
  searchRef: RefObject<HTMLInputElement | null>;
  focusSignal: number;
  onEdit: (m: Medicine) => void;
  onRestock: (m: Medicine) => void;
}) {
  const [query, setQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<(typeof PRODUCT_FILTERS)[number]["id"]>("all");

  useEffect(() => {
    if (focusSignal > 0) searchRef.current?.focus();
  }, [focusSignal, searchRef]);

  const counts = useMemo(() => {
    const map: Record<string, number> = { all: products.length };
    for (const f of PRODUCT_FILTERS) {
      if (f.id !== "all") map[f.id] = products.filter((m) => m.status === f.id).length;
    }
    return map;
  }, [products]);

  const rows = useMemo(() => {
    const q = query.trim().toLowerCase();
    return products.filter((m) => {
      const matchesStatus = statusFilter === "all" || m.status === statusFilter;
      const matchesQuery =
        q === "" ||
        m.name.toLowerCase().includes(q) ||
        m.generic.toLowerCase().includes(q) ||
        m.form.toLowerCase().includes(q) ||
        m.strength.toLowerCase().includes(q);
      return matchesStatus && matchesQuery;
    });
  }, [products, query, statusFilter]);

  const columns: Column<Medicine>[] = [
    {
      key: "name",
      header: "Product name",
      cell: (r) => (
        <div>
          <p className="font-medium">{r.name}</p>
          <p className="text-xs text-muted-foreground">{r.manufacturer}</p>
        </div>
      ),
    },
    { key: "generic", header: "Generic / salt", cell: (r) => r.generic },
    { key: "form", header: "Dosage & form", cell: (r) => `${r.form} · ${r.strength}` },
    { key: "price", header: "Unit price", cell: (r) => `$${r.price.toFixed(2)}` },
    { key: "stock", header: "Stock available", cell: (r) => r.stock.toLocaleString() },
    { key: "status", header: "Status", cell: (r) => <StatusBadge status={r.status} /> },
    {
      key: "actions",
      header: "Actions",
      className: "text-right",
      cell: (r) => (
        <div className="flex justify-end gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={(e) => {
              e.stopPropagation();
              onEdit(r);
            }}
          >
            <Pencil className="size-3.5" /> Edit details
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={(e) => {
              e.stopPropagation();
              onRestock(r);
            }}
          >
            <PackagePlus className="size-3.5" /> Restock batch
          </Button>
        </div>
      ),
    },
  ];

  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
        <div className="relative w-full max-w-sm">
          <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            ref={searchRef}
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search by name, compound or dosage form…"
            className="pl-9"
            aria-label="Search products"
          />
        </div>
        <div className="flex flex-wrap gap-2">
          {PRODUCT_FILTERS.map((f) => (
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
        emptyTitle="No products match"
        emptyDescription="Try a different search term or clear the status filters."
      />
    </div>
  );
}

/* ----------------------------- Production view ----------------------------- */

const BATCH_TONE = {
  running: "brand",
  queued: "neutral",
  "quality-check": "warning",
} as const;

function ProductionView({
  batches,
  lines,
  onSchedule,
}: {
  batches: Batch[];
  lines: ProductionLine[];
  onSchedule: () => void;
}) {
  const columns: Column<Batch>[] = [
    { key: "id", header: "Batch ID", cell: (r) => <span className="font-medium">{r.id}</span> },
    { key: "product", header: "Product", cell: (r) => r.product },
    { key: "target", header: "Target units", cell: (r) => r.targetUnits.toLocaleString() },
    { key: "completion", header: "Scheduled completion", cell: (r) => r.completion },
    { key: "line", header: "Line assigned", cell: (r) => r.line },
    {
      key: "status",
      header: "Status",
      cell: (r) => <StatusBadge status={r.status} tone={BATCH_TONE[r.status]} />,
    },
  ];

  return (
    <div className="space-y-4">
      <div className="grid gap-4 md:grid-cols-3">
        {lines.map((l, i) => (
          <motion.div
            key={l.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: i * 0.06 }}
          >
            <Panel title={l.name} description={l.focus}>
              <div className="space-y-4">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Line health</span>
                  <StatusBadge
                    status={l.health}
                    tone={l.health === "optimal" ? "success" : l.health === "watch" ? "warning" : "neutral"}
                  />
                </div>
                <dl className="grid grid-cols-2 gap-3 text-sm">
                  <div className="border border-border bg-muted/40 p-3">
                    <dt className="text-xs text-muted-foreground">Active batches</dt>
                    <dd className="mt-1 font-display text-2xl">{l.activeBatches}</dd>
                  </div>
                  <div className="border border-border bg-muted/40 p-3">
                    <dt className="text-xs text-muted-foreground">Output rate</dt>
                    <dd className="mt-1 text-sm font-medium">{l.outputRate}</dd>
                  </div>
                </dl>
                <div>
                  <div className="mb-2 flex items-center justify-between text-sm">
                    <span className="font-medium">Capacity</span>
                    <span className="text-muted-foreground">{l.capacity}%</span>
                  </div>
                  <Progress value={l.capacity} />
                </div>
              </div>
            </Panel>
          </motion.div>
        ))}
      </div>

      <Panel
        title="Active batch schedule"
        description="Running, queued and quality-check batches across all lines"
        action={
          <Button variant="outline" onClick={onSchedule}>
            <Plus className="size-4" /> Schedule batch
          </Button>
        }
      >
        <DataTable
          columns={columns}
          rows={batches}
          emptyTitle="No batches scheduled"
          emptyDescription="Schedule a batch to see it appear here."
        />
      </Panel>
    </div>
  );
}

/* ------------------------------ Orders view ------------------------------ */

function OrderInspectionDrawer({
  order,
  onClose,
  onAdvance,
}: {
  order: Order | null;
  onClose: () => void;
  onAdvance: (id: string) => void;
}) {
  if (!order) return null;

  const dispatch = DISPATCH[order.id] ?? {
    carrier: "Awaiting assignment",
    origin: "Nordis Pharma — Warehouse A",
    dispatched: "—",
  };
  const address = BUYER_ADDRESS[order.party] ?? "Address on file with the buyer facility";

  const idx = ORDER_FLOW.indexOf(order.status);
  const nextStatus: OrderStatus | null =
    idx >= 0 && idx < ORDER_FLOW.length - 1 ? (ORDER_FLOW[idx + 1] ?? null) : null;

  const timeline = [
    { label: "Placed", reached: true },
    { label: "Confirmed", reached: order.status !== "pending" },
    { label: "Dispatched", reached: order.status === "in-transit" || order.status === "delivered" },
    { label: "In transit", reached: order.status === "in-transit" || order.status === "delivered" },
    { label: "Delivered", reached: order.status === "delivered" },
  ];

  const breakdown: [string, string][] = [
    ["Order", order.id],
    ["Line item", order.item],
    ["Buyer facility", order.party],
    ["Quantity", order.quantity.toLocaleString()],
    ["Order value", `$${order.total.toLocaleString()}`],
    ["Placed", order.date],
  ];

  return (
    <Sheet open={!!order} onOpenChange={(open) => !open && onClose()}>
      <SheetContent side="right" className="w-full overflow-y-auto sm:max-w-md">
        <SheetHeader>
          <SheetTitle className="font-display text-2xl">Order {order.id}</SheetTitle>
          <SheetDescription>Dispatch details, buyer address and status control</SheetDescription>
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
            <p className="editorial-label mb-3">Dispatch details</p>
            <dl className="space-y-2.5 text-sm">
              <div className="flex items-start justify-between gap-4">
                <dt className="text-muted-foreground">Carrier</dt>
                <dd className="text-right font-medium">{dispatch.carrier}</dd>
              </div>
              <div className="flex items-start justify-between gap-4">
                <dt className="text-muted-foreground">Origin</dt>
                <dd className="text-right font-medium">{dispatch.origin}</dd>
              </div>
              <div className="flex items-start justify-between gap-4">
                <dt className="text-muted-foreground">Dispatched</dt>
                <dd className="text-right font-medium">{dispatch.dispatched}</dd>
              </div>
            </dl>
          </section>

          <Separator />

          <section>
            <p className="editorial-label mb-3">Buyer delivery address</p>
            <p className="border border-border bg-muted/40 p-3 text-sm">{address}</p>
          </section>

          <Separator />

          <section>
            <p className="editorial-label mb-3">Fulfilment timeline</p>
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
                </li>
              ))}
            </ol>
          </section>

          {nextStatus ? (
            <Button className="w-full" onClick={() => onAdvance(order.id)}>
              <Truck className="size-4" /> Update status — mark {STATUS_LABEL[nextStatus]}
            </Button>
          ) : (
            <p className="border border-border bg-muted/40 p-3 text-center text-sm text-muted-foreground">
              {order.status === "delivered"
                ? "Order delivered — no further status updates."
                : "Order cancelled — status updates are locked."}
            </p>
          )}
        </div>
      </SheetContent>
    </Sheet>
  );
}

function SupplyOrdersView({
  orders,
  onOpenOrder,
}: {
  orders: Order[];
  onOpenOrder: (order: Order) => void;
}) {
  const [filter, setFilter] = useState<(typeof ORDER_FILTERS)[number]["id"]>("all");

  const counts = useMemo(() => {
    const map: Record<string, number> = { all: orders.length };
    for (const f of ORDER_FILTERS) {
      if (f.id !== "all") map[f.id] = orders.filter((o) => o.status === f.id).length;
    }
    return map;
  }, [orders]);

  const rows = useMemo(
    () => (filter === "all" ? orders : orders.filter((o) => o.status === filter)),
    [orders, filter],
  );

  const columns: Column<Order>[] = [
    { key: "id", header: "Order ID", cell: (r) => <span className="font-medium">{r.id}</span> },
    { key: "party", header: "Buyer facility", cell: (r) => r.party },
    { key: "item", header: "Line item", cell: (r) => r.item },
    { key: "total", header: "Order value", cell: (r) => `$${r.total.toLocaleString()}` },
    { key: "date", header: "Order date", cell: (r) => r.date },
    { key: "status", header: "Status", cell: (r) => <StatusBadge status={r.status} /> },
  ];

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap gap-2">
        {ORDER_FILTERS.map((f) => (
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
        emptyTitle="No orders in this stage"
        emptyDescription="Orders appear here as hospitals and pharmacies place them."
      />
      <p className="text-xs text-muted-foreground">
        Click any order to inspect dispatch details, the buyer delivery address and to advance its status.
      </p>
    </div>
  );
}

/* ------------------------------ Overview view ------------------------------ */

function OverviewView({
  products,
  orders,
  lines,
  onManageCatalogue,
  onOpenOrder,
}: {
  products: Medicine[];
  orders: Order[];
  lines: ProductionLine[];
  onManageCatalogue: () => void;
  onOpenOrder: (order: Order) => void;
}) {
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

  return (
    <>
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard
          label="Active products"
          value={String(products.length)}
          delta="+6"
          hint="new registrations"
          icon={FlaskConical}
          index={0}
        />
        <StatCard
          label="Open supply orders"
          value={String(orders.filter((o) => o.status !== "delivered").length)}
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
              <li key={l.id}>
                <div className="mb-2 flex items-center justify-between text-sm">
                  <span className="font-medium">{l.name}</span>
                  <span className="text-muted-foreground">{l.capacity}%</span>
                </div>
                <Progress value={l.capacity} />
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
          action={
            <Button variant="ghost" onClick={onManageCatalogue}>
              Manage catalogue
            </Button>
          }
        >
          <DataTable columns={productColumns} rows={products.slice(0, 5)} />
        </Panel>
        <Panel title="Distribution reliability" description="Network benchmark">
          <ReliabilityLineChart data={supplyReliability} />
        </Panel>
      </div>

      <div className="mt-6">
        <Panel title="Incoming supply orders" description="Hospital and pharmacy purchase orders">
          <DataTable columns={orderColumns} rows={orders.slice(0, 4)} onRowClick={onOpenOrder} />
        </Panel>
      </div>
    </>
  );
}

/* --------------------------------- Dialogs -------------------------------- */

function AddProductDialog({
  open,
  onOpenChange,
  nextId,
  onSubmit,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  nextId: string;
  onSubmit: (product: Medicine) => void;
}) {
  const [name, setName] = useState("");
  const [generic, setGeneric] = useState("");
  const [form, setForm] = useState("");
  const [strength, setStrength] = useState("");
  const [price, setPrice] = useState("");
  const [stock, setStock] = useState("");
  const [errors, setErrors] = useState<FieldErrors>({});

  const reset = () => {
    setName("");
    setGeneric("");
    setForm("");
    setStrength("");
    setPrice("");
    setStock("");
    setErrors({});
  };

  const handleSubmit = () => {
    const next: FieldErrors = {};
    if (!name.trim()) next.name = "Product name is required";
    if (!generic.trim()) next.generic = "Generic compound is required";
    if (!form) next.form = "Choose a dosage form";
    if (!strength.trim()) next.strength = "Strength is required, e.g. 500 mg";
    if (!price || Number(price) <= 0 || Number.isNaN(Number(price))) next.price = "Enter a price above zero";
    if (!isPositiveInt(stock)) next.stock = "Enter a whole quantity";
    setErrors(next);
    if (Object.keys(next).length > 0) return;

    const stockUnits = Number(stock);
    const parLevel = 2000;
    onSubmit({
      id: nextId,
      name: name.trim(),
      generic: generic.trim(),
      form,
      strength: strength.trim(),
      manufacturer: "Nordis Pharma",
      price: Number(price),
      stock: stockUnits,
      status: statusFromStock(stockUnits, parLevel),
      batch: `NEW-${nextId.replace("MED-", "")}`,
      expiry: "2028-06-30",
      category: "Other",
      parLevel,
    });
    toast.success(`${name.trim()} registered to catalogue`, {
      description: `${form} · ${strength.trim()} · $${Number(price).toFixed(2)} per unit · ${stockUnits.toLocaleString()} units in stock`,
    });
    reset();
    onOpenChange(false);
  };

  return (
    <Dialog
      open={open}
      onOpenChange={(o) => {
        if (!o) reset();
        onOpenChange(o);
      }}
    >
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle className="font-display text-2xl">Add product</DialogTitle>
          <DialogDescription>
            Register a new pharmaceutical item to the Nordis Pharma catalogue.
          </DialogDescription>
        </DialogHeader>

        <div className="mt-2 grid gap-4">
          <div className="grid gap-1.5">
            <Label htmlFor="np-name">Product name</Label>
            <Input
              id="np-name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Ceftriaxone"
            />
            {errors.name ? <p className="text-xs text-destructive">{errors.name}</p> : null}
          </div>
          <div className="grid gap-1.5">
            <Label htmlFor="np-generic">Generic compound</Label>
            <Input
              id="np-generic"
              value={generic}
              onChange={(e) => setGeneric(e.target.value)}
              placeholder="e.g. Ceftriaxone sodium"
            />
            {errors.generic ? <p className="text-xs text-destructive">{errors.generic}</p> : null}
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="grid gap-1.5">
              <Label>Dosage form</Label>
              <Select value={form} onValueChange={setForm}>
                <SelectTrigger>
                  <SelectValue placeholder="Select form" />
                </SelectTrigger>
                <SelectContent>
                  {DOSAGE_FORMS.map((f) => (
                    <SelectItem key={f} value={f}>
                      {f}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.form ? <p className="text-xs text-destructive">{errors.form}</p> : null}
            </div>
            <div className="grid gap-1.5">
              <Label htmlFor="np-strength">Strength / dosage</Label>
              <Input
                id="np-strength"
                value={strength}
                onChange={(e) => setStrength(e.target.value)}
                placeholder="e.g. 500 mg or 100 IU/mL"
              />
              {errors.strength ? <p className="text-xs text-destructive">{errors.strength}</p> : null}
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="grid gap-1.5">
              <Label htmlFor="np-price">Unit wholesale price ($)</Label>
              <Input
                id="np-price"
                type="number"
                min="0"
                step="0.01"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                placeholder="e.g. 12.50"
              />
              {errors.price ? <p className="text-xs text-destructive">{errors.price}</p> : null}
            </div>
            <div className="grid gap-1.5">
              <Label htmlFor="np-stock">Initial stock quantity</Label>
              <Input
                id="np-stock"
                type="number"
                min="0"
                step="1"
                value={stock}
                onChange={(e) => setStock(e.target.value)}
                placeholder="e.g. 5000"
              />
              {errors.stock ? <p className="text-xs text-destructive">{errors.stock}</p> : null}
            </div>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={handleSubmit}>Register product</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

function ScheduleBatchDialog({
  open,
  onOpenChange,
  products,
  lines,
  nextBatchId,
  onSubmit,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  products: Medicine[];
  lines: ProductionLine[];
  nextBatchId: string;
  onSubmit: (batch: Batch, line: ProductionLine) => void;
}) {
  const [productId, setProductId] = useState("");
  const [lineId, setLineId] = useState("");
  const [target, setTarget] = useState("");
  const [start, setStart] = useState("");
  const [completion, setCompletion] = useState("");
  const [errors, setErrors] = useState<FieldErrors>({});

  const reset = () => {
    setProductId("");
    setLineId("");
    setTarget("");
    setStart("");
    setCompletion("");
    setErrors({});
  };

  const handleSubmit = () => {
    const next: FieldErrors = {};
    if (!productId) next.productId = "Select a product";
    if (!lineId) next.lineId = "Assign a production line";
    if (!isPositiveInt(target)) next.target = "Enter a whole target above zero";
    if (!start) next.start = "Pick a scheduled start date";
    if (!completion) next.completion = "Pick an estimated completion date";
    if (start && completion && new Date(completion) < new Date(start)) {
      next.completion = "Completion must be on or after the start date";
    }
    setErrors(next);
    if (Object.keys(next).length > 0) return;

    const product = products.find((p) => p.id === productId)!;
    const line = lines.find((l) => l.id === lineId)!;
    onSubmit(
      {
        id: nextBatchId,
        product: `${product.name} ${product.strength}`,
        targetUnits: Number(target),
        completion: new Date(completion).toLocaleDateString("en-US", {
          month: "short",
          day: "numeric",
          year: "numeric",
        }),
        line: line.name,
        status: "queued",
      },
      line,
    );
    toast.success(`Batch ${nextBatchId} scheduled on ${line.name}`, {
      description: `${product.name} ${product.strength} · ${Number(target).toLocaleString()} units target`,
    });
    reset();
    onOpenChange(false);
  };

  return (
    <Dialog
      open={open}
      onOpenChange={(o) => {
        if (!o) reset();
        onOpenChange(o);
      }}
    >
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle className="font-display text-2xl">Schedule batch</DialogTitle>
          <DialogDescription>
            Queue a production run on one of the three lines.
          </DialogDescription>
        </DialogHeader>

        <div className="mt-2 grid gap-4">
          <div className="grid gap-1.5">
            <Label>Product</Label>
            <Select value={productId} onValueChange={setProductId}>
              <SelectTrigger>
                <SelectValue placeholder="Select a registered product" />
              </SelectTrigger>
              <SelectContent>
                {products.map((p) => (
                  <SelectItem key={p.id} value={p.id}>
                    {p.name} · {p.strength}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {errors.productId ? <p className="text-xs text-destructive">{errors.productId}</p> : null}
          </div>
          <div className="grid gap-1.5">
            <Label>Production line</Label>
            <Select value={lineId} onValueChange={setLineId}>
              <SelectTrigger>
                <SelectValue placeholder="Assign a line" />
              </SelectTrigger>
              <SelectContent>
                {lines.map((l) => (
                  <SelectItem key={l.id} value={l.id}>
                    {l.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {errors.lineId ? <p className="text-xs text-destructive">{errors.lineId}</p> : null}
          </div>
          <div className="grid gap-1.5">
            <Label htmlFor="sb-target">Batch target units</Label>
            <Input
              id="sb-target"
              type="number"
              min="1"
              step="1"
              value={target}
              onChange={(e) => setTarget(e.target.value)}
              placeholder="e.g. 50000"
            />
            {errors.target ? <p className="text-xs text-destructive">{errors.target}</p> : null}
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="grid gap-1.5">
              <Label htmlFor="sb-start">Scheduled start</Label>
              <Input
                id="sb-start"
                type="date"
                value={start}
                onChange={(e) => setStart(e.target.value)}
              />
              {errors.start ? <p className="text-xs text-destructive">{errors.start}</p> : null}
            </div>
            <div className="grid gap-1.5">
              <Label htmlFor="sb-completion">Estimated completion</Label>
              <Input
                id="sb-completion"
                type="date"
                value={completion}
                onChange={(e) => setCompletion(e.target.value)}
              />
              {errors.completion ? (
                <p className="text-xs text-destructive">{errors.completion}</p>
              ) : null}
            </div>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={handleSubmit}>Schedule batch</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

function EditProductDialog({
  product,
  onClose,
  onSave,
}: {
  product: Medicine | null;
  onClose: () => void;
  onSave: (id: string, patch: Partial<Medicine>) => void;
}) {
  const [name, setName] = useState("");
  const [generic, setGeneric] = useState("");
  const [strength, setStrength] = useState("");
  const [price, setPrice] = useState("");
  const [errors, setErrors] = useState<FieldErrors>({});
  const [loadedId, setLoadedId] = useState<string | null>(null);

  if (product && loadedId !== product.id) {
    setLoadedId(product.id);
    setName(product.name);
    setGeneric(product.generic);
    setStrength(product.strength);
    setPrice(String(product.price));
    setErrors({});
  }

  const handleSubmit = () => {
    if (!product) return;
    const next: FieldErrors = {};
    if (!name.trim()) next.name = "Product name is required";
    if (!generic.trim()) next.generic = "Generic compound is required";
    if (!strength.trim()) next.strength = "Strength is required";
    if (!price || Number(price) <= 0 || Number.isNaN(Number(price))) next.price = "Enter a price above zero";
    setErrors(next);
    if (Object.keys(next).length > 0) return;

    onSave(product.id, {
      name: name.trim(),
      generic: generic.trim(),
      strength: strength.trim(),
      price: Number(price),
    });
    toast.success(`Details updated for ${name.trim()}`, {
      description: "The catalogue record reflects the new information.",
    });
    onClose();
  };

  return (
    <Dialog open={!!product} onOpenChange={(o) => !o && onClose()}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle className="font-display text-2xl">Edit details</DialogTitle>
          <DialogDescription>Update the catalogue record for this item.</DialogDescription>
        </DialogHeader>

        <div className="mt-2 grid gap-4">
          <div className="grid gap-1.5">
            <Label htmlFor="ep-name">Product name</Label>
            <Input id="ep-name" value={name} onChange={(e) => setName(e.target.value)} />
            {errors.name ? <p className="text-xs text-destructive">{errors.name}</p> : null}
          </div>
          <div className="grid gap-1.5">
            <Label htmlFor="ep-generic">Generic compound</Label>
            <Input id="ep-generic" value={generic} onChange={(e) => setGeneric(e.target.value)} />
            {errors.generic ? <p className="text-xs text-destructive">{errors.generic}</p> : null}
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="grid gap-1.5">
              <Label htmlFor="ep-strength">Strength / dosage</Label>
              <Input id="ep-strength" value={strength} onChange={(e) => setStrength(e.target.value)} />
              {errors.strength ? <p className="text-xs text-destructive">{errors.strength}</p> : null}
            </div>
            <div className="grid gap-1.5">
              <Label htmlFor="ep-price">Unit wholesale price ($)</Label>
              <Input
                id="ep-price"
                type="number"
                min="0"
                step="0.01"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
              />
              {errors.price ? <p className="text-xs text-destructive">{errors.price}</p> : null}
            </div>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button onClick={handleSubmit}>Save changes</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

function RestockDialog({
  product,
  onClose,
  onRestock,
}: {
  product: Medicine | null;
  onClose: () => void;
  onRestock: (id: string, quantity: number) => void;
}) {
  const [quantity, setQuantity] = useState("5000");
  const [error, setError] = useState("");
  const [loadedId, setLoadedId] = useState<string | null>(null);

  if (product && loadedId !== product.id) {
    setLoadedId(product.id);
    setQuantity("5000");
    setError("");
  }

  const handleSubmit = () => {
    if (!product) return;
    if (!isPositiveInt(quantity)) {
      setError("Enter a whole quantity above zero");
      return;
    }
    onRestock(product.id, Number(quantity));
    onClose();
  };

  return (
    <Dialog open={!!product} onOpenChange={(o) => !o && onClose()}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="font-display text-2xl">Restock batch</DialogTitle>
          <DialogDescription>
            {product
              ? `Log an incoming production batch for ${product.name} ${product.strength}.`
              : "Log an incoming production batch."}
          </DialogDescription>
        </DialogHeader>

        <div className="mt-2 grid gap-4">
          <div className="grid gap-1.5">
            <Label htmlFor="rs-qty">Units received</Label>
            <Input
              id="rs-qty"
              type="number"
              min="1"
              step="1"
              value={quantity}
              onChange={(e) => setQuantity(e.target.value)}
            />
            {error ? <p className="text-xs text-destructive">{error}</p> : null}
          </div>
          {product ? (
            <div className="border border-border bg-muted/40 p-3 text-sm">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Current stock</span>
                <span className="font-medium">{product.stock.toLocaleString()}</span>
              </div>
              <div className="mt-1 flex justify-between">
                <span className="text-muted-foreground">Par level</span>
                <span className="font-medium">{product.parLevel.toLocaleString()}</span>
              </div>
            </div>
          ) : null}
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button onClick={handleSubmit}>Log restock</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

/* ------------------------------ Main component ----------------------------- */

function PharmaDashboard() {
  const [tab, setTab] = useState<TabId>("overview");
  const [products, setProducts] = useState<Medicine[]>(productSeed);
  const [orders, setOrders] = useState<Order[]>(orderSeed);
  const [batches, setBatches] = useState<Batch[]>(batchSeed);
  const [lines, setLines] = useState<ProductionLine[]>(lineSeed);
  const [addOpen, setAddOpen] = useState(false);
  const [batchOpen, setBatchOpen] = useState(false);
  const [editTarget, setEditTarget] = useState<Medicine | null>(null);
  const [restockTarget, setRestockTarget] = useState<Medicine | null>(null);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [focusSignal, setFocusSignal] = useState(0);
  const searchRef = useRef<HTMLInputElement | null>(null);

  const openOrders = orders.filter((o) => o.status !== "delivered").length;
  const flaggedCount = products.filter(
    (m) => m.status === "low-stock" || m.status === "out-of-stock" || m.status === "expiring",
  ).length;
  const avgCapacity = Math.round(lines.reduce((sum, l) => sum + l.capacity, 0) / lines.length);

  const nav = TABS.map((t) => ({
    label: t.label,
    icon: t.icon,
    active: tab === t.id,
    badge: t.id === "orders" && openOrders > 0 ? String(openOrders) : undefined,
    onClick: () => setTab(t.id),
  }));

  const meta = TABS.find((t) => t.id === tab)!;

  const overviewSubtitle = `${openOrders} supply order${openOrders === 1 ? "" : "s"} awaiting action and ${flaggedCount} catalogue item${flaggedCount === 1 ? "" : "s"} below par or expiring.`;

  const handleAddProduct = (product: Medicine) => {
    setProducts((prev) => [product, ...prev]);
  };

  const handleEditProduct = (id: string, patch: Partial<Medicine>) => {
    setProducts((prev) => prev.map((m) => (m.id === id ? { ...m, ...patch } : m)));
  };

  const handleRestock = (id: string, quantity: number) => {
    setProducts((prev) =>
      prev.map((m) => {
        if (m.id !== id) return m;
        const stock = m.stock + quantity;
        return { ...m, stock, status: statusFromStock(stock, m.parLevel) };
      }),
    );
    const target = products.find((m) => m.id === id);
    if (target) {
      toast.success(`Restock batch logged for ${target.name}`, {
        description: `+${quantity.toLocaleString()} units · new stock ${(target.stock + quantity).toLocaleString()}`,
      });
    }
  };

  const handleScheduleBatch = (batch: Batch, line: ProductionLine) => {
    setBatches((prev) => [batch, ...prev]);
    setLines((prev) =>
      prev.map((l) =>
        l.id === line.id
          ? {
              ...l,
              capacity: Math.min(98, l.capacity + 5),
              activeBatches: l.activeBatches + 1,
            }
          : l,
      ),
    );
  };

  const handleAdvanceOrder = (id: string) => {
    const current = orders.find((o) => o.id === id);
    if (!current) return;
    const idx = ORDER_FLOW.indexOf(current.status);
    if (idx < 0 || idx === ORDER_FLOW.length - 1) return;
    const nextStatus = ORDER_FLOW[idx + 1];
    if (!nextStatus) return;
    setOrders((prev) =>
      prev.map((o) => (o.id === id ? { ...o, status: nextStatus } : o)),
    );
    setSelectedOrder((prev) => (prev && prev.id === id ? { ...prev, status: nextStatus } : prev));
    toast.success(`Order ${id} moved to ${STATUS_LABEL[nextStatus]}`, {
      description: "The buyer facility was notified of the new dispatch stage.",
    });
  };

  const manageCatalogue = () => {
    setTab("products");
    setFocusSignal((f) => f + 1);
  };

  return (
    <>
      <DashboardLayout
        role="pharma"
        roleLabel="Pharmaceutical workspace"
        userName="Nordis Pharma"
        userMeta="Supply operations"
        nav={nav}
        title={meta.title}
        subtitle={tab === "overview" ? overviewSubtitle : meta.subtitle}
        breadcrumbs={["Pharmaceutical", meta.label]}
        actions={
          <>
            <Button variant="outline" onClick={() => setBatchOpen(true)}>
              <Factory className="size-4" /> Schedule batch
            </Button>
            <Button onClick={() => setAddOpen(true)}>
              <Plus className="size-4" /> Add product
            </Button>
          </>
        }
      >
        <motion.div
          key={tab}
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          {tab === "overview" ? (
            <OverviewView
              products={products}
              orders={orders}
              lines={lines}
              onManageCatalogue={manageCatalogue}
              onOpenOrder={setSelectedOrder}
            />
          ) : null}
          {tab === "products" ? (
            <ProductsView
              products={products}
              searchRef={searchRef}
              focusSignal={focusSignal}
              onEdit={setEditTarget}
              onRestock={setRestockTarget}
            />
          ) : null}
          {tab === "production" ? (
            <ProductionView
              batches={batches}
              lines={lines}
              onSchedule={() => setBatchOpen(true)}
            />
          ) : null}
          {tab === "orders" ? (
            <SupplyOrdersView orders={orders} onOpenOrder={setSelectedOrder} />
          ) : null}
        </motion.div>
      </DashboardLayout>

      <AddProductDialog
        open={addOpen}
        onOpenChange={setAddOpen}
        nextId={`MED-${1400 + products.length}`}
        onSubmit={handleAddProduct}
      />
      <ScheduleBatchDialog
        open={batchOpen}
        onOpenChange={setBatchOpen}
        products={products}
        lines={lines}
        nextBatchId={`BAT-${4422 + batches.length}`}
        onSubmit={handleScheduleBatch}
      />
      <EditProductDialog
        product={editTarget}
        onClose={() => setEditTarget(null)}
        onSave={handleEditProduct}
      />
      <RestockDialog
        product={restockTarget}
        onClose={() => setRestockTarget(null)}
        onRestock={handleRestock}
      />
      <OrderInspectionDrawer
        order={selectedOrder}
        onClose={() => setSelectedOrder(null)}
        onAdvance={handleAdvanceOrder}
      />
    </>
  );
}
