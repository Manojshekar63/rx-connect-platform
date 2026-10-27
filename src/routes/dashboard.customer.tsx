import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useMemo, useRef, useState } from "react";
import { motion } from "motion/react";
import {
  ClipboardList,
  Eye,
  FileUp,
  Heart,
  Home,
  Package,
  Search,
  ShoppingCart,
  Trash2,
  Truck,
  Upload,
} from "lucide-react";
import { toast } from "sonner";
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
import { Textarea } from "@/components/ui/textarea";
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
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import {
  customerCatalog,
  customerDeliveries,
  customerOrders,
  demandTrend,
  prescriptionItems,
  prescriptions as prescriptionSeed,
  type CatalogMedicine,
  type CustomerDelivery,
  type Order,
  type Prescription,
} from "@/lib/mock-data";
import { cn } from "@/lib/utils";

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

/* ---------------------------------- Tabs ---------------------------------- */

const TABS = [
  { id: "overview", label: "Overview", icon: Home, title: "Good morning, Marta" },
  { id: "find", label: "Find medicines", icon: Search, title: "Medicine catalogue" },
  { id: "prescriptions", label: "Prescriptions", icon: FileUp, title: "Prescription manager" },
  { id: "orders", label: "Orders", icon: Package, title: "Order history" },
  { id: "deliveries", label: "Deliveries", icon: Truck, title: "Delivery tracker" },
  { id: "saved", label: "Saved items", icon: Heart, title: "Saved medicines" },
] as const;

type TabId = (typeof TABS)[number]["id"];

const TAB_SUBTITLES: Record<TabId, string> = {
  overview: "Two prescriptions are active and one delivery is on its way.",
  find: "Search the full catalogue by name, salt composition or brand.",
  prescriptions: "Every prescription you've uploaded, with pharmacist verification status.",
  orders: "Your complete order history with one-tap reordering.",
  deliveries: "Live tracking for every shipment on its way to you.",
  saved: "Medicines you saved from the catalogue for quick reordering.",
};

const RX_FILTERS = [
  { id: "all", label: "All" },
  { id: "verified", label: "Verified" },
  { id: "reviewing", label: "Under Review" },
  { id: "expired", label: "Expired" },
] as const;

const ORDER_FILTERS = [
  { id: "all", label: "All" },
  { id: "processing", label: "Processing" },
  { id: "in-transit", label: "In Transit" },
  { id: "delivered", label: "Delivered" },
  { id: "cancelled", label: "Cancelled" },
] as const;

const DELIVERY_STEPS = ["Order Confirmed", "Packed", "Out for Delivery", "Delivered"];

/* --------------------------------- Helpers -------------------------------- */

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

function DeliveryStepper({ stage }: { stage: number }) {
  return (
    <ol className="flex items-start">
      {DELIVERY_STEPS.map((step, i) => (
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
          {i < DELIVERY_STEPS.length - 1 ? (
            <span className={cn("mx-1.5 mt-2 h-px flex-1", i < stage ? "bg-secondary" : "bg-border")} />
          ) : null}
        </li>
      ))}
    </ol>
  );
}

/* ------------------------------ Find medicines ----------------------------- */

function MedicineCard({
  med,
  saved,
  index,
  onToggleSave,
  onAddToCart,
}: {
  med: CatalogMedicine;
  saved: boolean;
  index: number;
  onToggleSave: (med: CatalogMedicine) => void;
  onAddToCart: (med: CatalogMedicine) => void;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: Math.min(index * 0.04, 0.3), ease: "easeOut" }}
      className="flex flex-col justify-between border border-border bg-card p-5 shadow-soft"
    >
      <div>
        <div className="flex items-start justify-between gap-3">
          <div>
            <p className="font-display text-lg">{med.name}</p>
            <p className="text-xs text-muted-foreground">{med.salt}</p>
          </div>
          <button
            type="button"
            onClick={() => onToggleSave(med)}
            aria-label={saved ? `Remove ${med.name} from saved items` : `Save ${med.name}`}
            className={cn(
              "flex size-9 shrink-0 items-center justify-center border transition-colors",
              saved
                ? "border-destructive/30 bg-destructive/10 text-destructive"
                : "border-border text-muted-foreground hover:bg-muted hover:text-foreground",
            )}
          >
            <Heart className={cn("size-4", saved && "fill-current")} />
          </button>
        </div>
        <p className="mt-3 text-sm font-medium">{med.dosage}</p>
        <p className="text-xs text-muted-foreground">{med.manufacturer}</p>
      </div>
      <div className="mt-4 flex items-center justify-between gap-3 border-t border-border pt-4">
        <div>
          <p className="font-display text-xl">${med.price.toFixed(2)}</p>
          <StatusBadge status={med.status} className="mt-1.5" />
        </div>
        <Button size="sm" disabled={med.status === "out-of-stock"} onClick={() => onAddToCart(med)}>
          <ShoppingCart className="size-4" /> Add to cart
        </Button>
      </div>
    </motion.div>
  );
}

function FindMedicinesView({
  savedIds,
  focusSignal,
  onToggleSave,
  onAddToCart,
}: {
  savedIds: string[];
  focusSignal: number;
  onToggleSave: (med: CatalogMedicine) => void;
  onAddToCart: (med: CatalogMedicine) => void;
}) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState("All");

  const categories = useMemo(
    () => ["All", ...Array.from(new Set(customerCatalog.map((m) => m.category)))],
    [],
  );

  useEffect(() => {
    if (focusSignal > 0) inputRef.current?.focus();
  }, [focusSignal]);

  const rows = useMemo(() => {
    const q = query.trim().toLowerCase();
    return customerCatalog.filter((m) => {
      const matchesCategory = category === "All" || m.category === category;
      const matchesQuery =
        q === "" ||
        m.name.toLowerCase().includes(q) ||
        m.salt.toLowerCase().includes(q) ||
        m.manufacturer.toLowerCase().includes(q);
      return matchesCategory && matchesQuery;
    });
  }, [query, category]);

  return (
    <div className="space-y-5">
      <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
        <div className="relative w-full max-w-sm">
          <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            ref={inputRef}
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search by medicine, salt or brand…"
            className="pl-9"
            aria-label="Search medicines"
          />
        </div>
        <div className="flex flex-wrap gap-2">
          {categories.map((c) => (
            <FilterChip
              key={c}
              label={c}
              active={category === c}
              onClick={() => setCategory(c)}
            />
          ))}
        </div>
      </div>

      {rows.length === 0 ? (
        <EmptyState
          icon={Search}
          title="No medicines match"
          description="Try a different name, salt composition or brand, or clear the category filter."
        />
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {rows.map((med, i) => (
            <MedicineCard
              key={med.id}
              med={med}
              saved={savedIds.includes(med.id)}
              index={i}
              onToggleSave={onToggleSave}
              onAddToCart={onAddToCart}
            />
          ))}
        </div>
      )}
    </div>
  );
}

/* ------------------------------- Prescriptions ----------------------------- */

function RxDetailDrawer({ rx, onClose }: { rx: Prescription | null; onClose: () => void }) {
  if (!rx) return null;
  const items = prescriptionItems[rx.id] ?? [];

  const breakdown: [string, string][] = [
    ["Prescription", rx.id],
    ["Prescribing doctor", rx.doctor],
    ["Clinic", rx.clinic],
    ["Uploaded", rx.uploaded],
  ];

  return (
    <Sheet open={!!rx} onOpenChange={(open) => !open && onClose()}>
      <SheetContent side="right" className="w-full overflow-y-auto sm:max-w-md">
        <SheetHeader>
          <SheetTitle className="font-display text-2xl">{rx.doctor}</SheetTitle>
          <SheetDescription>
            {rx.clinic} · uploaded {rx.uploaded}
          </SheetDescription>
        </SheetHeader>

        <div className="mt-6 space-y-6 px-1 pb-6">
          <section>
            <p className="editorial-label mb-3">Details</p>
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
                  <StatusBadge status={rx.status} tone={rx.status === "expired" ? "warning" : undefined} />
                </dd>
              </div>
            </dl>
          </section>

          <Separator />

          <section>
            <p className="editorial-label mb-3">Prescribed medicines</p>
            {items.length === 0 ? (
              <p className="text-sm text-muted-foreground">
                Medicine details will appear once the pharmacist finishes verifying this upload.
              </p>
            ) : (
              <ul className="space-y-3">
                {items.map((item) => (
                  <li key={item.name} className="border border-border bg-muted/40 p-3 text-sm">
                    <div className="flex items-start justify-between gap-3">
                      <p className="font-medium">{item.name}</p>
                      <span className="shrink-0 text-xs text-muted-foreground">{item.dosage}</span>
                    </div>
                    <p className="mt-1.5 text-xs text-muted-foreground">{item.instructions}</p>
                  </li>
                ))}
              </ul>
            )}
          </section>
        </div>
      </SheetContent>
    </Sheet>
  );
}

function PrescriptionsView({
  prescriptions,
  onOpen,
}: {
  prescriptions: Prescription[];
  onOpen: (rx: Prescription) => void;
}) {
  const [filter, setFilter] = useState<(typeof RX_FILTERS)[number]["id"]>("all");

  const counts = useMemo(() => {
    const map: Record<string, number> = { all: prescriptions.length };
    for (const f of RX_FILTERS) {
      if (f.id !== "all") map[f.id] = prescriptions.filter((r) => r.status === f.id).length;
    }
    return map;
  }, [prescriptions]);

  const rows = prescriptions.filter((r) => filter === "all" || r.status === filter);

  if (rows.length === 0) {
    return (
      <div className="space-y-5">
        <div className="flex flex-wrap gap-2">
          {RX_FILTERS.map((f) => (
            <FilterChip
              key={f.id}
              label={f.label}
              count={counts[f.id]}
              active={filter === f.id}
              onClick={() => setFilter(f.id)}
            />
          ))}
        </div>
        <EmptyState
          icon={FileUp}
          title="No prescriptions in this state"
          description="Uploads you submit appear here and move to Verified once our pharmacy team approves them."
        />
      </div>
    );
  }

  return (
    <div className="space-y-5">
      <div className="flex flex-wrap gap-2">
        {RX_FILTERS.map((f) => (
          <FilterChip
            key={f.id}
            label={f.label}
            count={counts[f.id]}
            active={filter === f.id}
            onClick={() => setFilter(f.id)}
          />
        ))}
      </div>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {rows.map((rx, i) => (
          <motion.button
            key={rx.id}
            type="button"
            onClick={() => onOpen(rx)}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: Math.min(i * 0.05, 0.3), ease: "easeOut" }}
            className="group flex flex-col items-start border border-border bg-card p-5 text-left shadow-soft transition-colors hover:border-primary/40"
          >
            <div className="flex w-full items-start justify-between gap-3">
              <div>
                <p className="font-display text-lg">{rx.doctor}</p>
                <p className="text-xs text-muted-foreground">{rx.clinic}</p>
              </div>
              <StatusBadge status={rx.status} tone={rx.status === "expired" ? "warning" : undefined} />
            </div>
            <p className="mt-4 text-xs text-muted-foreground">
              {rx.id} · {rx.items} item{rx.items === 1 ? "" : "s"} · uploaded {rx.uploaded}
            </p>
            <span className="mt-3 inline-flex items-center gap-1.5 text-xs font-semibold text-primary">
              <Eye className="size-3.5" /> View details
            </span>
          </motion.button>
        ))}
      </div>
    </div>
  );
}

/* ---------------------------------- Orders --------------------------------- */

function OrderSummaryModal({
  order,
  onClose,
  onReorder,
}: {
  order: Order | null;
  onClose: () => void;
  onReorder: (order: Order) => void;
}) {
  if (!order) return null;

  const unitPrice = order.quantity > 0 ? order.total / order.quantity : order.total;

  return (
    <Dialog open={!!order} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle className="font-display text-2xl">Order {order.id}</DialogTitle>
          <DialogDescription>Itemised receipt and order summary</DialogDescription>
        </DialogHeader>

        <div className="space-y-5">
          <dl className="grid grid-cols-2 gap-x-4 gap-y-2 text-sm">
            <div>
              <dt className="editorial-label">Pharmacy</dt>
              <dd className="mt-1 font-medium">{order.party}</dd>
            </div>
            <div>
              <dt className="editorial-label">Placed</dt>
              <dd className="mt-1 font-medium">{order.date}</dd>
            </div>
            <div>
              <dt className="editorial-label">Status</dt>
              <dd className="mt-1">
                <StatusBadge status={order.status} />
              </dd>
            </div>
          </dl>

          <Separator />

          <section>
            <p className="editorial-label mb-3">Itemised receipt</p>
            <ul className="space-y-2.5 text-sm">
              <li className="flex items-start justify-between gap-3">
                <div>
                  <p className="font-medium">{order.item}</p>
                  <p className="text-xs text-muted-foreground">
                    ${unitPrice.toFixed(2)} × {order.quantity}
                  </p>
                </div>
                <span className="font-medium">${order.total.toFixed(2)}</span>
              </li>
              <li className="flex items-center justify-between text-muted-foreground">
                <span>Delivery — {order.party}</span>
                <span>Free</span>
              </li>
            </ul>
            <div className="mt-4 flex items-center justify-between border-t border-border pt-3">
              <span className="text-sm font-semibold">Total</span>
              <span className="font-display text-xl">${order.total.toFixed(2)}</span>
            </div>
          </section>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            Close
          </Button>
          <Button onClick={() => onReorder(order)}>
            <ShoppingCart className="size-4" /> Reorder
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

function OrdersView({
  orders,
  onOpen,
}: {
  orders: Order[];
  onOpen: (order: Order) => void;
}) {
  const [filter, setFilter] = useState<(typeof ORDER_FILTERS)[number]["id"]>("all");

  const counts = useMemo(() => {
    const map: Record<string, number> = { all: orders.length };
    for (const f of ORDER_FILTERS) {
      if (f.id !== "all") map[f.id] = orders.filter((r) => r.status === f.id).length;
    }
    return map;
  }, [orders]);

  const rows = orders.filter((r) => filter === "all" || r.status === filter);

  const columns: Column<Order>[] = [
    { key: "id", header: "Order", cell: (r) => <span className="font-medium">{r.id}</span> },
    { key: "item", header: "Items", cell: (r) => r.item },
    { key: "party", header: "Pharmacy", cell: (r) => r.party },
    { key: "date", header: "Placed", cell: (r) => r.date },
    { key: "total", header: "Total", cell: (r) => `$${r.total.toFixed(2)}` },
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
        onRowClick={onOpen}
        emptyTitle="No orders in this state"
        emptyDescription="Orders you place will appear here with their live status."
      />
    </div>
  );
}

/* -------------------------------- Deliveries ------------------------------- */

function DeliveriesView({ deliveries }: { deliveries: CustomerDelivery[] }) {
  if (deliveries.length === 0) {
    return (
      <EmptyState
        icon={Truck}
        title="No active deliveries"
        description="Shipments dispatched to you will be tracked here with live progress."
      />
    );
  }

  return (
    <div className="grid gap-4 xl:grid-cols-2">
      {deliveries.map((d, i) => (
        <motion.div
          key={d.id}
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: Math.min(i * 0.06, 0.3), ease: "easeOut" }}
        >
          <Panel title={d.id} description={d.item}>
            <dl className="grid grid-cols-2 gap-x-4 gap-y-2 text-sm sm:grid-cols-3">
              <div>
                <dt className="editorial-label">Carrier</dt>
                <dd className="mt-1 font-medium">{d.carrier}</dd>
              </div>
              <div>
                <dt className="editorial-label">Estimated arrival</dt>
                <dd className="mt-1 font-medium">{d.eta}</dd>
              </div>
              <div>
                <dt className="editorial-label">Placed</dt>
                <dd className="mt-1 font-medium">{d.placed}</dd>
              </div>
            </dl>
            <div className="mt-5 border-t border-border pt-5">
              <DeliveryStepper stage={d.stage} />
            </div>
            <div className="mt-5 flex items-center justify-between">
              <p className="text-xs text-muted-foreground">{DELIVERY_STEPS[d.stage]}</p>
              {d.stage === 3 ? <StatusBadge status="delivered" /> : <StatusBadge status="in-transit" />}
            </div>
          </Panel>
        </motion.div>
      ))}
    </div>
  );
}

/* ------------------------------- Saved items ------------------------------- */

function SavedItemsView({
  savedMeds,
  onGoFind,
  onRemove,
  onAddToCart,
}: {
  savedMeds: CatalogMedicine[];
  onGoFind: () => void;
  onRemove: (med: CatalogMedicine) => void;
  onAddToCart: (med: CatalogMedicine) => void;
}) {
  if (savedMeds.length === 0) {
    return (
      <EmptyState
        icon={Heart}
        title="No saved medicines yet"
        description="Tap the heart on any medicine in the catalogue and it will show up here for one-tap reordering."
        action={<Button variant="outline" onClick={onGoFind}>Browse catalogue</Button>}
      />
    );
  }

  return (
    <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
      {savedMeds.map((med, i) => (
        <motion.div
          key={med.id}
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: Math.min(i * 0.05, 0.3), ease: "easeOut" }}
          className="flex flex-col justify-between border border-border bg-card p-5 shadow-soft"
        >
          <div>
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="font-display text-lg">{med.name}</p>
                <p className="text-xs text-muted-foreground">{med.salt}</p>
              </div>
              <Heart className="size-4 shrink-0 fill-current text-destructive" />
            </div>
            <p className="mt-3 text-sm font-medium">{med.dosage}</p>
            <p className="text-xs text-muted-foreground">{med.manufacturer}</p>
          </div>
          <div className="mt-4 flex items-center justify-between gap-3 border-t border-border pt-4">
            <div>
              <p className="font-display text-xl">${med.price.toFixed(2)}</p>
              <StatusBadge status={med.status} className="mt-1.5" />
            </div>
            <div className="flex gap-2">
              <Button
                size="icon"
                variant="outline"
                aria-label={`Remove ${med.name} from saved items`}
                onClick={() => onRemove(med)}
              >
                <Trash2 className="size-4" />
              </Button>
              <Button size="sm" disabled={med.status === "out-of-stock"} onClick={() => onAddToCart(med)}>
                <ShoppingCart className="size-4" /> Add to cart
              </Button>
            </div>
          </div>
        </motion.div>
      ))}
    </div>
  );
}

/* --------------------------------- Overview -------------------------------- */

function OverviewView({
  orders,
  prescriptions,
  savedMeds,
  onOpenOrder,
  onOpenRx,
  onGoFind,
  onGoOrders,
  onGoPrescriptions,
}: {
  orders: Order[];
  prescriptions: Prescription[];
  savedMeds: CatalogMedicine[];
  onOpenOrder: (order: Order) => void;
  onOpenRx: (rx: Prescription) => void;
  onGoFind: () => void;
  onGoOrders: () => void;
  onGoPrescriptions: () => void;
}) {
  const activeOrders = orders.filter((o) => o.status === "processing" || o.status === "in-transit");
  const reviewCount = prescriptions.filter((r) => r.status === "reviewing").length;

  const orderColumns: Column<Order>[] = [
    { key: "id", header: "Order", cell: (r) => <span className="font-medium">{r.id}</span> },
    { key: "item", header: "Item", cell: (r) => r.item },
    { key: "party", header: "Pharmacy", cell: (r) => r.party },
    { key: "date", header: "Placed", cell: (r) => r.date },
    { key: "total", header: "Total", cell: (r) => `$${r.total.toFixed(2)}` },
    { key: "status", header: "Status", cell: (r) => <StatusBadge status={r.status} /> },
  ];

  return (
    <>
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard label="Active orders" value={String(activeOrders.length)} delta="+1" hint="this week" icon={Package} index={0} />
        <StatCard
          label="Prescriptions"
          value={String(prescriptions.length)}
          hint={`${reviewCount} in review`}
          icon={ClipboardList}
          index={1}
        />
        <StatCard
          label="Spent this year"
          value="$1,284"
          delta="8.2%"
          trend="down"
          hint="vs last year"
          icon={Search}
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

        <Panel
          title="Prescriptions"
          description="Verified by our pharmacist team"
          action={
            <Button variant="ghost" size="sm" onClick={onGoPrescriptions}>
              View all
            </Button>
          }
        >
          <ul className="space-y-3">
            {prescriptions.slice(0, 3).map((p) => (
              <li key={p.id}>
                <button
                  type="button"
                  onClick={() => onOpenRx(p)}
                  className="w-full border border-border p-4 text-left transition-colors hover:border-primary/40"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <p className="text-sm font-semibold">{p.doctor}</p>
                      <p className="text-xs text-muted-foreground">{p.clinic}</p>
                    </div>
                    <StatusBadge status={p.status} tone={p.status === "expired" ? "warning" : undefined} />
                  </div>
                  <p className="mt-3 text-xs text-muted-foreground">
                    {p.id} · {p.items} items · uploaded {p.uploaded}
                  </p>
                </button>
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
          action={
            <Button variant="ghost" size="sm" onClick={onGoOrders}>
              View all
            </Button>
          }
        >
          <DataTable columns={orderColumns} rows={orders.slice(0, 5)} onRowClick={onOpenOrder} />
        </Panel>

        <Panel
          title="Saved medicines"
          description="Quick reorder shortlist"
          action={
            savedMeds.length > 0 ? (
              <Button variant="ghost" size="sm" onClick={onGoFind}>
                Browse catalogue
              </Button>
            ) : undefined
          }
        >
          {savedMeds.length === 0 ? (
            <EmptyState
              icon={Heart}
              title="No saved medicines yet"
              description="Save the medicines you reorder often and they'll show up here for one-tap refills."
              action={<Button variant="outline" onClick={onGoFind}>Browse catalogue</Button>}
            />
          ) : (
            <ul className="space-y-3">
              {savedMeds.slice(0, 4).map((m) => (
                <li key={m.id} className="flex items-center justify-between gap-3 border border-border p-3 text-sm">
                  <div>
                    <p className="font-medium">{m.name}</p>
                    <p className="text-xs text-muted-foreground">{m.dosage}</p>
                  </div>
                  <span className="font-display text-lg">${m.price.toFixed(2)}</span>
                </li>
              ))}
            </ul>
          )}
        </Panel>
      </div>
    </>
  );
}

/* --------------------------------- Dialogs --------------------------------- */

function UploadPrescriptionDialog({
  open,
  onOpenChange,
  nextId,
  onSubmit,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  nextId: string;
  onSubmit: (rx: Prescription) => void;
}) {
  const [doctor, setDoctor] = useState("");
  const [clinic, setClinic] = useState("");
  const [notes, setNotes] = useState("");
  const [fileName, setFileName] = useState("");
  const [error, setError] = useState("");

  const reset = () => {
    setDoctor("");
    setClinic("");
    setNotes("");
    setFileName("");
    setError("");
  };

  const handleSubmit = () => {
    if (!fileName) {
      setError("Attach a prescription file (PDF, PNG or JPG) to continue.");
      return;
    }
    const rx: Prescription = {
      id: nextId,
      doctor: doctor.trim() || "Self-uploaded",
      clinic: clinic.trim() || "PharmaBridge Pharmacy",
      uploaded: new Date().toISOString().slice(0, 10),
      items: 1,
      status: "reviewing",
    };
    onSubmit(rx);
    reset();
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle className="font-display text-2xl">Upload a prescription</DialogTitle>
          <DialogDescription>
            Our pharmacist team verifies uploads before any medicine is dispensed.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          <div className="space-y-2">
            <Label>Prescription file</Label>
            <label
              htmlFor="rx-file"
              className="flex cursor-pointer flex-col items-center border border-dashed border-border px-4 py-8 text-center transition-colors hover:bg-muted/40"
            >
              <FileUp className="mb-2 size-6 text-muted-foreground" />
              <p className="text-sm font-medium">
                {fileName || "Drop a PDF or photo here, or click to browse"}
              </p>
              <p className="text-xs text-muted-foreground">Max 10 MB · JPG, PNG or PDF</p>
              <input
                id="rx-file"
                type="file"
                accept=".pdf,.png,.jpg,.jpeg"
                className="sr-only"
                onChange={(e) => {
                  const f = e.target.files?.[0];
                  setFileName(f ? f.name : "");
                  setError("");
                }}
              />
            </label>
            {error ? <p className="text-xs text-destructive">{error}</p> : null}
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="rx-doctor">Prescribing doctor</Label>
              <Input
                id="rx-doctor"
                placeholder="Dr. Amara Osei"
                value={doctor}
                onChange={(e) => setDoctor(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="rx-clinic">Clinic</Label>
              <Input
                id="rx-clinic"
                placeholder="Riverside Family Clinic"
                value={clinic}
                onChange={(e) => setClinic(e.target.value)}
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="rx-notes">Patient notes</Label>
            <Textarea
              id="rx-notes"
              placeholder="Anything our pharmacist should know — allergies, preferred brands, dosage questions…"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              rows={3}
            />
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={handleSubmit}>
            <Upload className="size-4" /> Submit for review
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

/* ------------------------------- Main component ---------------------------- */

function CustomerDashboard() {
  const [tab, setTab] = useState<TabId>("overview");
  const [orders, setOrders] = useState<Order[]>(customerOrders);
  const [rxList, setRxList] = useState<Prescription[]>(prescriptionSeed);
  const [savedIds, setSavedIds] = useState<string[]>([]);
  const [deliveries] = useState<CustomerDelivery[]>(customerDeliveries);
  const [selectedRx, setSelectedRx] = useState<Prescription | null>(null);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [uploadOpen, setUploadOpen] = useState(false);
  const [findFocus, setFindFocus] = useState(0);

  const reviewCount = rxList.filter((r) => r.status === "reviewing").length;
  const savedMeds = customerCatalog.filter((m) => savedIds.includes(m.id));

  const nav = TABS.map((t) => ({
    label: t.label,
    icon: t.icon,
    active: tab === t.id,
    badge:
      t.id === "prescriptions" && reviewCount > 0
        ? String(reviewCount)
        : t.id === "saved" && savedIds.length > 0
          ? String(savedIds.length)
          : undefined,
    onClick: () => setTab(t.id),
  }));

  const meta = TABS.find((t) => t.id === tab)!;

  const goFind = () => {
    setTab("find");
    setFindFocus((f) => f + 1);
  };

  const toggleSave = (med: CatalogMedicine) => {
    const isSaved = savedIds.includes(med.id);
    setSavedIds((prev) => (isSaved ? prev.filter((id) => id !== med.id) : [...prev, med.id]));
    toast.success(isSaved ? `${med.name} removed from saved items` : `${med.name} saved`, {
      description: isSaved
        ? "You can re-save it anytime from the catalogue."
        : "Find it in your Saved items view for quick reordering.",
    });
  };

  const addToCart = (med: CatalogMedicine) => {
    toast.success(`${med.name} added to cart`, {
      description: `$${med.price.toFixed(2)} · ${med.manufacturer}`,
    });
  };

  const reorder = (order: Order) => {
    const newOrder: Order = {
      id: `ORD-${78433 + orders.length}`,
      item: order.item,
      party: order.party,
      quantity: order.quantity,
      total: order.total,
      status: "processing",
      date: new Date().toISOString().slice(0, 10),
    };
    setOrders((prev) => [newOrder, ...prev]);
    setSelectedOrder(null);
    setTab("orders");
    toast.success(`Reorder ${newOrder.id} placed`, {
      description: `${order.item} · ${order.party} — now processing.`,
    });
  };

  const handleUpload = (rx: Prescription) => {
    setRxList((prev) => [rx, ...prev]);
    toast.success("Prescription uploaded successfully. Our pharmacy team is reviewing it.", {
      description: `${rx.id} · ${rx.doctor}`,
    });
  };

  return (
    <>
      <DashboardLayout
        role="customer"
        roleLabel="Customer workspace"
        userName="Marta Kowalski"
        userMeta="Boston, MA"
        nav={nav}
        title={meta.title}
        subtitle={TAB_SUBTITLES[tab]}
        breadcrumbs={["Customer", meta.label]}
        actions={
          <>
            <Button variant="outline" onClick={goFind}>
              <Search className="size-4" /> Find medicine
            </Button>
            <Button onClick={() => setUploadOpen(true)}>
              <Upload className="size-4" /> Upload prescription
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
              orders={orders}
              prescriptions={rxList}
              savedMeds={savedMeds}
              onOpenOrder={setSelectedOrder}
              onOpenRx={setSelectedRx}
              onGoFind={goFind}
              onGoOrders={() => setTab("orders")}
              onGoPrescriptions={() => setTab("prescriptions")}
            />
          ) : null}
          {tab === "find" ? (
            <FindMedicinesView
              savedIds={savedIds}
              focusSignal={findFocus}
              onToggleSave={toggleSave}
              onAddToCart={addToCart}
            />
          ) : null}
          {tab === "prescriptions" ? (
            <PrescriptionsView prescriptions={rxList} onOpen={setSelectedRx} />
          ) : null}
          {tab === "orders" ? <OrdersView orders={orders} onOpen={setSelectedOrder} /> : null}
          {tab === "deliveries" ? <DeliveriesView deliveries={deliveries} /> : null}
          {tab === "saved" ? (
            <SavedItemsView
              savedMeds={savedMeds}
              onGoFind={goFind}
              onRemove={toggleSave}
              onAddToCart={addToCart}
            />
          ) : null}
        </motion.div>
      </DashboardLayout>

      <UploadPrescriptionDialog
        open={uploadOpen}
        onOpenChange={setUploadOpen}
        nextId={`RX-${2292 + rxList.length}`}
        onSubmit={handleUpload}
      />
      <RxDetailDrawer rx={selectedRx} onClose={() => setSelectedRx(null)} />
      <OrderSummaryModal
        order={selectedOrder}
        onClose={() => setSelectedOrder(null)}
        onReorder={reorder}
      />
    </>
  );
}
