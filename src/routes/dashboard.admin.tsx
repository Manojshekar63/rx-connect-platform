import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useRef, useState, type ReactNode } from "react";
import { motion } from "motion/react";
import {
  Activity,
  Building2,
  CheckCircle2,
  Eye,
  FileBarChart,
  FileText,
  Home,
  KeyRound,
  Loader2,
  MoreVertical,
  ShieldCheck,
  UserCheck,
  UserX,
  Users,
} from "lucide-react";
import { toast } from "sonner";
import { DashboardLayout } from "@/components/layout/dashboard-layout";
import { StatCard } from "@/components/common/stat-card";
import { Panel } from "@/components/common/panel";
import { DataTable, type Column } from "@/components/common/data-table";
import { StatusBadge } from "@/components/common/status-badge";
import { MixDonutChart, TrendAreaChart } from "@/components/common/charts";
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
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
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
  auditEvents as auditSeed,
  categoryMix,
  demandTrend,
  organisations as orgSeed,
  platformUsers as userSeed,
  reportHistory as reportSeed,
  type AuditEvent,
  type GeneratedReport,
  type Organization,
  type PlatformUser,
} from "@/lib/mock-data";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/dashboard/admin")({
  head: () => ({
    meta: [
      { title: "Admin dashboard — PharmaBridge AI" },
      {
        name: "description",
        content:
          "Oversee users, verification queues, compliance and platform health across the PharmaBridge AI ecosystem.",
      },
      { property: "og:title", content: "Admin dashboard — PharmaBridge AI" },
      {
        property: "og:description",
        content: "Full ecosystem oversight for the PharmaBridge AI network.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: AdminDashboard,
});

/* ---------------------------------- Tabs ---------------------------------- */

const TABS = [
  {
    id: "overview",
    label: "Overview",
    icon: Home,
    title: "Ecosystem health",
    subtitle: "Network-wide accounts, orders and platform services.",
  },
  {
    id: "users",
    label: "Users",
    icon: Users,
    title: "User directory",
    subtitle: "Every individual account on the platform, in one place.",
  },
  {
    id: "organisations",
    label: "Organisations",
    icon: Building2,
    title: "Organisation management",
    subtitle: "Licenses, contacts and onboarding for partner facilities.",
  },
  {
    id: "compliance",
    label: "Compliance",
    icon: ShieldCheck,
    title: "Compliance & audit",
    subtitle: "Security posture, flagged incidents and the audit ledger.",
  },
] as const;

type TabId = (typeof TABS)[number]["id"];

const ROLE_FILTERS = [
  { id: "all", label: "All roles" },
  { id: "Customer", label: "Customers" },
  { id: "Hospital Staff", label: "Hospital Staff" },
  { id: "Pharma Rep", label: "Pharma Reps" },
] as const;

const USER_STATUS_FILTERS = [
  { id: "all", label: "All statuses" },
  { id: "active", label: "Active" },
  { id: "suspended", label: "Suspended" },
] as const;

const ORG_FILTERS = [
  { id: "all", label: "All" },
  { id: "Hospital", label: "Hospitals" },
  { id: "Pharmaceutical", label: "Pharmaceuticals" },
  { id: "review", label: "Pending Verification" },
] as const;

const REPORT_SCOPES = ["Network Health", "Order Transaction Volume", "Prescription Compliance", "Organisation Audits"];
const REPORT_RANGES = ["Last 7 Days", "Last 30 Days", "Year to Date"];
const REPORT_FORMATS = ["PDF", "CSV"] as const;

interface FieldErrors {
  scope?: string;
  range?: string;
  format?: string;
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

/* -------------------------------- Users view ------------------------------- */

function UsersView({
  users,
  onOpenUser,
  onToggleStatus,
  onResetPassword,
}: {
  users: PlatformUser[];
  onOpenUser: (u: PlatformUser) => void;
  onToggleStatus: (id: string) => void;
  onResetPassword: (u: PlatformUser) => void;
}) {
  const [query, setQuery] = useState("");
  const [roleFilter, setRoleFilter] = useState<(typeof ROLE_FILTERS)[number]["id"]>("all");
  const [statusFilter, setStatusFilter] = useState<(typeof USER_STATUS_FILTERS)[number]["id"]>("all");

  const roleCounts = useMemo(() => {
    const map: Record<string, number> = { all: users.length };
    for (const f of ROLE_FILTERS) {
      if (f.id !== "all") map[f.id] = users.filter((u) => u.role === f.id).length;
    }
    return map;
  }, [users]);

  const statusCounts = useMemo(() => {
    const map: Record<string, number> = { all: users.length };
    for (const f of USER_STATUS_FILTERS) {
      if (f.id !== "all") map[f.id] = users.filter((u) => u.status === f.id).length;
    }
    return map;
  }, [users]);

  const rows = useMemo(() => {
    const q = query.trim().toLowerCase();
    return users.filter((u) => {
      const matchesRole = roleFilter === "all" || u.role === roleFilter;
      const matchesStatus = statusFilter === "all" || u.status === statusFilter;
      const matchesQuery =
        q === "" ||
        u.id.toLowerCase().includes(q) ||
        u.name.toLowerCase().includes(q) ||
        u.email.toLowerCase().includes(q);
      return matchesRole && matchesStatus && matchesQuery;
    });
  }, [users, query, roleFilter, statusFilter]);

  const columns: Column<PlatformUser>[] = [
    { key: "id", header: "User ID", cell: (r) => <span className="font-medium">{r.id}</span> },
    {
      key: "name",
      header: "Name",
      cell: (r) => (
        <div>
          <p className="font-medium">{r.name}</p>
          <p className="text-xs text-muted-foreground">{r.email}</p>
        </div>
      ),
    },
    { key: "role", header: "Role", cell: (r) => r.role },
    { key: "region", header: "Region", cell: (r) => r.region },
    { key: "joined", header: "Joined", cell: (r) => r.joined },
    { key: "status", header: "Status", cell: (r) => <StatusBadge status={r.status} /> },
    {
      key: "actions",
      header: "Actions",
      className: "text-right",
      cell: (r) => (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className="size-8" aria-label={`Actions for ${r.name}`}>
              <MoreVertical className="size-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-48">
            <DropdownMenuItem onSelect={() => onOpenUser(r)}>
              <Eye className="size-4" /> View details
            </DropdownMenuItem>
            <DropdownMenuItem onSelect={() => onToggleStatus(r.id)}>
              {r.status === "suspended" ? (
                <>
                  <UserCheck className="size-4" /> Activate account
                </>
              ) : (
                <>
                  <UserX className="size-4" /> Suspend account
                </>
              )}
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem onSelect={() => onResetPassword(r)}>
              <KeyRound className="size-4" /> Reset password
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      ),
    },
  ];

  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
        <div className="relative w-full max-w-sm">
          <Input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search by user ID, name or email…"
            aria-label="Search users"
          />
        </div>
        <div className="flex flex-wrap gap-4">
          <div className="flex flex-wrap gap-2">
            {ROLE_FILTERS.map((f) => (
              <FilterChip
                key={f.id}
                label={f.label}
                count={roleCounts[f.id]}
                active={roleFilter === f.id}
                onClick={() => setRoleFilter(f.id)}
              />
            ))}
          </div>
          <div className="flex flex-wrap gap-2">
            {USER_STATUS_FILTERS.map((f) => (
              <FilterChip
                key={f.id}
                label={f.label}
                count={statusCounts[f.id]}
                active={statusFilter === f.id}
                onClick={() => setStatusFilter(f.id)}
              />
            ))}
          </div>
        </div>
      </div>

      <DataTable
        columns={columns}
        rows={rows}
        emptyTitle="No users match"
        emptyDescription="Try a different search term or clear the filters."
      />
    </div>
  );
}

/* ---------------------------- Organisations view --------------------------- */

function OrganisationsView({
  orgs,
  onOpenOrg,
  onOpenQueue,
}: {
  orgs: Organization[];
  onOpenOrg: (o: Organization) => void;
  onOpenQueue: () => void;
}) {
  const [filter, setFilter] = useState<(typeof ORG_FILTERS)[number]["id"]>("all");
  const [query, setQuery] = useState("");

  const counts = useMemo(() => {
    const map: Record<string, number> = { all: orgs.length };
    for (const f of ORG_FILTERS) {
      if (f.id === "review") map[f.id] = orgs.filter((o) => o.status === "review").length;
      else if (f.id !== "all") map[f.id] = orgs.filter((o) => o.type === f.id).length;
    }
    return map;
  }, [orgs]);

  const rows = useMemo(() => {
    const q = query.trim().toLowerCase();
    return orgs.filter((o) => {
      const matchesFilter =
        filter === "all" || (filter === "review" ? o.status === "review" : o.type === filter);
      const matchesQuery =
        q === "" ||
        o.name.toLowerCase().includes(q) ||
        o.licenseId.toLowerCase().includes(q) ||
        o.region.toLowerCase().includes(q);
      return matchesFilter && matchesQuery;
    });
  }, [orgs, filter, query]);

  const columns: Column<Organization>[] = [
    {
      key: "name",
      header: "Organisation name",
      cell: (r) => (
        <div>
          <p className="font-medium">{r.name}</p>
          <p className="text-xs text-muted-foreground">{r.id}</p>
        </div>
      ),
    },
    { key: "type", header: "Type", cell: (r) => r.type },
    { key: "licenseId", header: "License ID", cell: (r) => r.licenseId },
    { key: "region", header: "Region", cell: (r) => r.region },
    { key: "reps", header: "Assigned reps", cell: (r) => String(r.reps) },
    { key: "status", header: "Status", cell: (r) => <StatusBadge status={r.status} /> },
    {
      key: "actions",
      header: "Actions",
      className: "text-right",
      cell: (r) => (
        <Button variant="outline" size="sm" onClick={() => onOpenOrg(r)}>
          Review
        </Button>
      ),
    },
  ];

  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
        <div className="relative w-full max-w-sm">
          <Input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search organisations…"
            aria-label="Search organisations"
          />
        </div>
        <div className="flex flex-wrap gap-2">
          {ORG_FILTERS.map((f) => (
            <FilterChip
              key={f.id}
              label={f.label}
              count={counts[f.id]}
              active={filter === f.id}
              onClick={() => setFilter(f.id)}
            />
          ))}
        </div>
      </div>

      <Panel
        title="Organisation register"
        description="All partner facilities on the network"
        action={
          <Button variant="outline" onClick={onOpenQueue}>
            <ShieldCheck className="size-4" /> Review onboarding
          </Button>
        }
      >
        <DataTable
          columns={columns}
          rows={rows}
          onRowClick={onOpenOrg}
          emptyTitle="No organisations match"
          emptyDescription="Try a different search term or clear the filters."
        />
      </Panel>
    </div>
  );
}

/* ----------------------------- Compliance view ----------------------------- */

const RISK_TONE = { Low: "success", Medium: "warning", High: "destructive" } as const;

function ComplianceView({
  reports,
  onInspect,
}: {
  reports: GeneratedReport[];
  onInspect: (e: AuditEvent) => void;
}) {
  const openIncidents = auditSeed.filter((e) => e.risk !== "Low").length;

  const columns: Column<AuditEvent>[] = [
    { key: "timestamp", header: "Timestamp", cell: (r) => <span className="font-medium">{r.timestamp}</span> },
    { key: "eventType", header: "Event type", cell: (r) => r.eventType },
    { key: "actor", header: "Actor", cell: (r) => r.actor },
    {
      key: "risk",
      header: "Risk level",
      cell: (r) => <StatusBadge status={r.risk.toLowerCase()} tone={RISK_TONE[r.risk]} />,
    },
    {
      key: "actions",
      header: "Actions",
      className: "text-right",
      cell: (r) => (
        <Button variant="outline" size="sm" onClick={() => onInspect(r)}>
          <Eye className="size-3.5" /> Inspect event
        </Button>
      ),
    },
  ];

  return (
    <div className="space-y-4">
      <div className="grid gap-4 md:grid-cols-3">
        <Panel title="Compliance score" description="Network-wide, last 90 days">
          <div className="flex items-end gap-3">
            <p className="font-display text-5xl leading-none">92</p>
            <p className="pb-1 text-sm text-muted-foreground">/ 100</p>
          </div>
          <Progress value={92} className="mt-4" />
          <p className="mt-3 text-xs text-muted-foreground">
            SOC 2 Type II in progress · HIPAA-aligned controls active.
          </p>
        </Panel>
        <Panel title="Open flagged incidents" description="High and medium risk, unresolved">
          <p className="font-display text-5xl leading-none">{openIncidents}</p>
          <p className="mt-3 text-xs text-muted-foreground">
            {auditSeed.filter((e) => e.risk === "High").length} high risk ·{" "}
            {auditSeed.filter((e) => e.risk === "Medium").length} medium risk events in the ledger.
          </p>
        </Panel>
        <Panel title="Regulatory reports" description="Generated exports and filings">
          <p className="font-display text-5xl leading-none">{reports.length}</p>
          <ul className="mt-4 space-y-2 text-sm">
            {reports.slice(0, 3).map((r) => (
              <li key={r.id} className="flex items-center justify-between gap-3 border-b border-border pb-2 last:border-0">
                <span className="flex min-w-0 items-center gap-2">
                  <FileText className="size-4 shrink-0 text-primary" />
                  <span className="truncate font-medium">{r.type}</span>
                </span>
                <span className="shrink-0 text-xs text-muted-foreground">
                  {r.format} · {r.generated}
                </span>
              </li>
            ))}
          </ul>
        </Panel>
      </div>

      <Panel title="Audit ledger" description="Security and prescription-safety events across the platform">
        <DataTable
          columns={columns}
          rows={auditSeed}
          emptyTitle="No audit events"
          emptyDescription="Events will appear here as the platform records them."
        />
      </Panel>
    </div>
  );
}

/* ----------------------------- Overview view ------------------------------ */

function OverviewView({
  orgs,
  pendingCount,
  forecastStatus,
  reconnecting,
  onRetryTelemetry,
  onOpenOrg,
}: {
  orgs: Organization[];
  pendingCount: number;
  forecastStatus: "active" | "review";
  reconnecting: boolean;
  onRetryTelemetry: () => void;
  onOpenOrg: (o: Organization) => void;
}) {
  const services = [
    { name: "API gateway", uptime: "99.99%", tone: "active" },
    { name: "Prescription OCR", uptime: "99.94%", tone: "active" },
    { name: "Forecast engine", uptime: forecastStatus === "active" ? "99.99%" : "99.71%", tone: forecastStatus },
    { name: "Notification service", uptime: "99.98%", tone: "active" },
  ];

  const orgColumns: Column<Organization>[] = [
    {
      key: "name",
      header: "Organisation",
      cell: (r) => (
        <div>
          <p className="font-medium">{r.name}</p>
          <p className="text-xs text-muted-foreground">{r.licenseId}</p>
        </div>
      ),
    },
    { key: "type", header: "Type", cell: (r) => r.type },
    { key: "region", header: "Region", cell: (r) => r.region },
    { key: "status", header: "Status", cell: (r) => <StatusBadge status={r.status} /> },
    {
      key: "actions",
      header: "",
      cell: (r) => (
        <Button variant="ghost" size="sm" onClick={() => onOpenOrg(r)}>
          Review
        </Button>
      ),
    },
  ];

  return (
    <>
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard label="Total accounts" value="18,942" delta="+412" hint="last 30 days" icon={Users} index={0} />
        <StatCard label="Hospitals" value="326" delta="+9" hint="onboarded" icon={Building2} index={1} />
        <StatCard
          label="Orders processed"
          value="1.24M"
          delta="6.8%"
          hint="this quarter"
          icon={Activity}
          index={2}
        />
        <StatCard
          label="Verification queue"
          value={String(pendingCount)}
          delta="3 overdue"
          trend="down"
          hint="needs review"
          icon={ShieldCheck}
          index={3}
        />
      </div>

      <div className="mt-6 grid gap-4 xl:grid-cols-3">
        <Panel
          title="Platform transaction volume"
          description="Requests vs fulfilled orders network-wide"
          className="xl:col-span-2"
        >
          <TrendAreaChart
            data={demandTrend}
            xKey="month"
            series={[
              { key: "requested", label: "Requests", color: "var(--chart-1)" },
              { key: "fulfilled", label: "Fulfilled", color: "var(--chart-2)" },
            ]}
          />
        </Panel>
        <Panel title="Category distribution" description="Network-wide order mix">
          <MixDonutChart data={categoryMix} />
        </Panel>
      </div>

      <div className="mt-6 grid gap-4 xl:grid-cols-3">
        <Panel
          title="Accounts"
          description="Newest and flagged organisations"
          className="xl:col-span-2"
        >
          <DataTable columns={orgColumns} rows={orgs.slice(0, 5)} onRowClick={onOpenOrg} />
        </Panel>

        <div className="space-y-4">
          <Panel title="Service status" description="Last 24 hours">
            <ul className="space-y-3">
              {services.map((s) => (
                <li
                  key={s.name}
                  className="flex items-center justify-between rounded-xl border border-border px-3 py-2.5"
                >
                  <div>
                    <p className="text-sm font-medium">{s.name}</p>
                    <p className="text-xs text-muted-foreground">Uptime {s.uptime}</p>
                  </div>
                  <StatusBadge status={s.tone} />
                </li>
              ))}
            </ul>
          </Panel>
          <Panel title="Forecast engine" description="Model telemetry stream">
            {forecastStatus === "active" ? (
              <div className="flex items-start gap-3 text-sm">
                <CheckCircle2 className="mt-0.5 size-5 shrink-0 text-success" />
                <div>
                  <p className="font-medium">Telemetry operational</p>
                  <p className="mt-1 text-xs text-muted-foreground">
                    Metrics feed restored. Last sync completed just now.
                  </p>
                </div>
              </div>
            ) : (
              <div className="text-sm">
                <div className="flex items-center gap-2">
                  <span className="relative flex size-2.5">
                    <span className="absolute inline-flex size-full animate-ping rounded-full bg-warning opacity-60" />
                    <span className="relative inline-flex size-2.5 rounded-full bg-warning" />
                  </span>
                  <p className="font-medium">Telemetry unavailable</p>
                </div>
                <p className="mt-2 text-muted-foreground">
                  The forecast engine metrics feed is degraded.{" "}
                  <button
                    type="button"
                    onClick={onRetryTelemetry}
                    disabled={reconnecting}
                    className="inline-flex items-center gap-1.5 font-medium text-primary underline underline-offset-4 disabled:opacity-60"
                  >
                    {reconnecting ? (
                      <>
                        <Loader2 className="size-3.5 animate-spin" /> Reconnecting…
                      </>
                    ) : (
                      "Retry or check the model logs"
                    )}
                  </button>
                </p>
              </div>
            )}
          </Panel>
        </div>
      </div>
    </>
  );
}

/* --------------------------------- Drawers -------------------------------- */

function UserDetailDrawer({ user, onClose }: { user: PlatformUser | null; onClose: () => void }) {
  if (!user) return null;
  const rows: [string, ReactNode][] = [
    ["User ID", user.id],
    ["Name", user.name],
    ["Email", user.email],
    ["Role", user.role],
    ["Region", user.region],
    ["Joined", user.joined],
  ];

  return (
    <Sheet open={!!user} onOpenChange={(open) => !open && onClose()}>
      <SheetContent side="right" className="w-full overflow-y-auto sm:max-w-md">
        <SheetHeader>
          <SheetTitle className="font-display text-2xl">{user.name}</SheetTitle>
          <SheetDescription>Individual account overview</SheetDescription>
        </SheetHeader>
        <div className="mt-6 space-y-6 px-1 pb-6">
          <section>
            <p className="editorial-label mb-3">Account</p>
            <dl className="space-y-2.5 text-sm">
              {rows.map(([k, v]) => (
                <div key={k} className="flex items-start justify-between gap-4">
                  <dt className="text-muted-foreground">{k}</dt>
                  <dd className="text-right font-medium">{v}</dd>
                </div>
              ))}
              <div className="flex items-center justify-between">
                <dt className="text-muted-foreground">Status</dt>
                <dd>
                  <StatusBadge status={user.status} />
                </dd>
              </div>
            </dl>
          </section>
        </div>
      </SheetContent>
    </Sheet>
  );
}

function OrgDetailDrawer({
  org,
  onClose,
  onSetStatus,
}: {
  org: Organization | null;
  onClose: () => void;
  onSetStatus: (id: string, status: "active" | "suspended") => void;
}) {
  if (!org) return null;
  const inReview = org.status === "review";

  return (
    <Sheet open={!!org} onOpenChange={(open) => !open && onClose()}>
      <SheetContent side="right" className="w-full overflow-y-auto sm:max-w-md">
        <SheetHeader>
          <SheetTitle className="font-display text-2xl">{org.name}</SheetTitle>
          <SheetDescription>Organisation overview and license details</SheetDescription>
        </SheetHeader>

        <div className="mt-6 space-y-6 px-1 pb-6">
          <section>
            <p className="editorial-label mb-3">Overview</p>
            <dl className="space-y-2.5 text-sm">
              {([
                ["Organisation ID", org.id],
                ["Type", org.type],
                ["Region", org.region],
                ["Assigned reps", String(org.reps)],
              ] as [string, string][]).map(([k, v]) => (
                <div key={k} className="flex items-start justify-between gap-4">
                  <dt className="text-muted-foreground">{k}</dt>
                  <dd className="text-right font-medium">{v}</dd>
                </div>
              ))}
              <div className="flex items-center justify-between">
                <dt className="text-muted-foreground">Status</dt>
                <dd>
                  <StatusBadge status={org.status} />
                </dd>
              </div>
            </dl>
          </section>

          <Separator />

          <section>
            <p className="editorial-label mb-3">Primary contact</p>
            <div className="border border-border bg-muted/40 p-3 text-sm">
              <p className="font-medium">{org.contact}</p>
              <p className="mt-0.5 text-xs text-muted-foreground">{org.contactRole}</p>
            </div>
          </section>

          <Separator />

          <section>
            <p className="editorial-label mb-3">License details</p>
            <dl className="space-y-2.5 text-sm">
              <div className="flex items-start justify-between gap-4">
                <dt className="text-muted-foreground">License ID</dt>
                <dd className="text-right font-medium">{org.licenseId}</dd>
              </div>
              <div className="flex items-start justify-between gap-4">
                <dt className="text-muted-foreground">License expiry</dt>
                <dd className="text-right font-medium">{org.licenseExpiry}</dd>
              </div>
            </dl>
          </section>

          <Separator />

          <section>
            <p className="editorial-label mb-3">Account status</p>
            {inReview ? (
              <p className="border border-border bg-muted/40 p-3 text-sm text-muted-foreground">
                This organisation is awaiting verification. Use the Verification Queue to approve or
                request information.
              </p>
            ) : (
              <Select
                value={org.status}
                onValueChange={(value) => onSetStatus(org.id, value as "active" | "suspended")}
              >
                <SelectTrigger aria-label="Account status">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="suspended">Suspended</SelectItem>
                </SelectContent>
              </Select>
            )}
          </section>
        </div>
      </SheetContent>
    </Sheet>
  );
}

function VerificationQueueDrawer({
  open,
  onOpenChange,
  orgs,
  onApprove,
  onRequestInfo,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  orgs: Organization[];
  onApprove: (org: Organization) => void;
  onRequestInfo: (org: Organization) => void;
}) {
  const queue = orgs.filter((o) => o.status === "review");

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="right" className="w-full overflow-y-auto sm:max-w-md">
        <SheetHeader>
          <SheetTitle className="font-display text-2xl">Verification queue</SheetTitle>
          <SheetDescription>
            {queue.length} organisation{queue.length === 1 ? "" : "s"} awaiting license verification
          </SheetDescription>
        </SheetHeader>

        <div className="mt-6 space-y-5 px-1 pb-6">
          {queue.length === 0 ? (
            <p className="border border-border bg-muted/40 p-4 text-sm text-muted-foreground">
              The queue is clear — every submitted registration has been processed.
            </p>
          ) : (
            queue.map((org) => (
              <section key={org.id} className="border border-border p-4">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="font-medium">{org.name}</p>
                    <p className="mt-0.5 text-xs text-muted-foreground">
                      {org.type} · {org.region} · {org.licenseId}
                    </p>
                  </div>
                  <StatusBadge status={org.status} />
                </div>

                <p className="editorial-label mt-4 mb-2">Submitted documents</p>
                <ul className="space-y-1.5">
                  {org.documents.map((doc) => (
                    <li key={doc} className="flex items-center gap-2 text-sm">
                      <FileText className="size-4 shrink-0 text-primary" />
                      {doc}
                    </li>
                  ))}
                </ul>

                <div className="mt-4 flex gap-2">
                  <Button size="sm" className="flex-1" onClick={() => onApprove(org)}>
                    <CheckCircle2 className="size-4" /> Approve license
                  </Button>
                  <Button variant="outline" size="sm" className="flex-1" onClick={() => onRequestInfo(org)}>
                    Request information
                  </Button>
                </div>
              </section>
            ))
          )}
        </div>
      </SheetContent>
    </Sheet>
  );
}

function EventInspectDrawer({ event, onClose }: { event: AuditEvent | null; onClose: () => void }) {
  if (!event) return null;
  return (
    <Sheet open={!!event} onOpenChange={(open) => !open && onClose()}>
      <SheetContent side="right" className="w-full overflow-y-auto sm:max-w-md">
        <SheetHeader>
          <SheetTitle className="font-display text-2xl">Event {event.id}</SheetTitle>
          <SheetDescription>Audit ledger inspection</SheetDescription>
        </SheetHeader>
        <div className="mt-6 space-y-6 px-1 pb-6">
          <section>
            <p className="editorial-label mb-3">Event</p>
            <dl className="space-y-2.5 text-sm">
              {([
                ["Timestamp", event.timestamp],
                ["Event type", event.eventType],
                ["Actor", event.actor],
                ["Detail", event.detail],
              ] as [string, string][]).map(([k, v]) => (
                <div key={k} className="flex items-start justify-between gap-4">
                  <dt className="text-muted-foreground">{k}</dt>
                  <dd className="max-w-[60%] text-right font-medium">{v}</dd>
                </div>
              ))}
              <div className="flex items-center justify-between">
                <dt className="text-muted-foreground">Risk level</dt>
                <dd>
                  <StatusBadge status={event.risk.toLowerCase()} tone={RISK_TONE[event.risk]} />
                </dd>
              </div>
            </dl>
          </section>
          <Separator />
          <section>
            <p className="editorial-label mb-3">Recommended action</p>
            <p className="border border-border bg-muted/40 p-3 text-sm">
              {event.risk === "High"
                ? "Escalate to the compliance officer and confirm the counterparty license before any release."
                : event.risk === "Medium"
                  ? "Review the actor's recent activity and confirm the change was authorised."
                  : "No action required — logged for the periodic compliance review."}
            </p>
          </section>
        </div>
      </SheetContent>
    </Sheet>
  );
}

/* --------------------------------- Dialog --------------------------------- */

function GenerateReportDialog({
  open,
  onOpenChange,
  onSubmit,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (type: string, range: string, format: "PDF" | "CSV") => void;
}) {
  const [scope, setScope] = useState("");
  const [range, setRange] = useState("");
  const [format, setFormat] = useState("");
  const [errors, setErrors] = useState<FieldErrors>({});
  const [generating, setGenerating] = useState(false);
  const [progress, setProgress] = useState(0);
  const finishedRef = useRef(false);

  const reset = () => {
    setScope("");
    setRange("");
    setFormat("");
    setErrors({});
    setGenerating(false);
    setProgress(0);
    finishedRef.current = false;
  };

  useEffect(() => {
    if (!generating) return;
    const timer = setInterval(() => {
      setProgress((p) => Math.min(100, p + 8 + Math.round(Math.random() * 12)));
    }, 180);
    return () => clearInterval(timer);
  }, [generating]);

  useEffect(() => {
    if (!generating || progress < 100 || finishedRef.current) return;
    finishedRef.current = true;
    const ext = format === "PDF" ? "pdf" : "csv";
    onSubmit(scope, range, format);
    toast.success(`Report ${scope}.${ext} generated and downloaded`, {
      description: `${range} · logged in compliance history`,
    });
    const t = setTimeout(() => {
      reset();
      onOpenChange(false);
    }, 500);
    return () => clearTimeout(t);
  }, [generating, progress]); // eslint-disable-line react-hooks/exhaustive-deps

  const start = () => {
    const next: FieldErrors = {};
    if (!scope) next.scope = "Select a report scope";
    if (!range) next.range = "Select a date range";
    if (!format) next.format = "Choose an export format";
    setErrors(next);
    if (Object.keys(next).length > 0) return;
    setGenerating(true);
    setProgress(4);
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
          <DialogTitle className="font-display text-2xl">Generate report</DialogTitle>
          <DialogDescription>
            Export a platform report for regulators or internal review.
          </DialogDescription>
        </DialogHeader>

        {generating ? (
          <div className="mt-4 space-y-4">
            <div className="flex items-center gap-2 text-sm">
              <Loader2 className="size-4 animate-spin text-primary" />
              <span>Preparing {scope} report…</span>
            </div>
            <Progress value={progress} aria-label="Export progress" />
            <p className="text-right text-xs text-muted-foreground">{progress}%</p>
          </div>
        ) : (
          <>
            <div className="mt-2 grid gap-4">
              <div className="grid gap-1.5">
                <Label>Report scope</Label>
                <Select value={scope} onValueChange={setScope}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select scope" />
                  </SelectTrigger>
                  <SelectContent>
                    {REPORT_SCOPES.map((s) => (
                      <SelectItem key={s} value={s}>
                        {s}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {errors.scope ? <p className="text-xs text-destructive">{errors.scope}</p> : null}
              </div>
              <div className="grid gap-1.5">
                <Label>Date range</Label>
                <Select value={range} onValueChange={setRange}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select range" />
                  </SelectTrigger>
                  <SelectContent>
                    {REPORT_RANGES.map((r) => (
                      <SelectItem key={r} value={r}>
                        {r}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {errors.range ? <p className="text-xs text-destructive">{errors.range}</p> : null}
              </div>
              <div className="grid gap-1.5">
                <Label>Export format</Label>
                <Select value={format} onValueChange={setFormat}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select format" />
                  </SelectTrigger>
                  <SelectContent>
                    {REPORT_FORMATS.map((f) => (
                      <SelectItem key={f} value={f}>
                        {f}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {errors.format ? <p className="text-xs text-destructive">{errors.format}</p> : null}
              </div>
            </div>

            <DialogFooter>
              <Button variant="outline" onClick={() => onOpenChange(false)}>
                Cancel
              </Button>
              <Button onClick={start}>Generate report</Button>
            </DialogFooter>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
}

/* ------------------------------ Main component ----------------------------- */

function AdminDashboard() {
  const [tab, setTab] = useState<TabId>("overview");
  const [users, setUsers] = useState<PlatformUser[]>(userSeed);
  const [orgs, setOrgs] = useState<Organization[]>(orgSeed);
  const [reports, setReports] = useState<GeneratedReport[]>(reportSeed);
  const [forecastStatus, setForecastStatus] = useState<"active" | "review">("review");
  const [reconnecting, setReconnecting] = useState(false);
  const [reportOpen, setReportOpen] = useState(false);
  const [queueOpen, setQueueOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<PlatformUser | null>(null);
  const [selectedOrg, setSelectedOrg] = useState<Organization | null>(null);
  const [selectedEvent, setSelectedEvent] = useState<AuditEvent | null>(null);

  const pendingCount = orgs.filter((o) => o.status === "review").length;

  const nav = TABS.map((t) => ({
    label: t.label,
    icon: t.icon,
    active: tab === t.id,
    onClick: () => setTab(t.id),
  }));

  const meta = TABS.find((t) => t.id === tab)!;
  const overviewSubtitle = `${pendingCount} organisation${pendingCount === 1 ? "" : "s"} await verification and one AI service is degraded.`;

  const handleToggleUser = (id: string) => {
    const target = users.find((u) => u.id === id);
    if (!target) return;
    const nextStatus = target.status === "active" ? "suspended" : "active";
    setUsers((prev) => prev.map((u) => (u.id === id ? { ...u, status: nextStatus } : u)));
    setSelectedUser((prev) => (prev && prev.id === id ? { ...prev, status: nextStatus } : prev));
    toast.success(
      nextStatus === "suspended" ? `${target.name} suspended` : `${target.name} reactivated`,
      {
        description:
          nextStatus === "suspended"
            ? "Sign-in is blocked and active sessions were revoked."
            : "The account can sign in again immediately.",
      },
    );
  };

  const handleResetPassword = (user: PlatformUser) => {
    toast.success(`Password reset sent to ${user.name}`, {
      description: `A secure reset link was emailed to ${user.email}.`,
    });
  };

  const handleSetOrgStatus = (id: string, status: "active" | "suspended") => {
    const target = orgs.find((o) => o.id === id);
    if (!target) return;
    setOrgs((prev) => prev.map((o) => (o.id === id ? { ...o, status } : o)));
    setSelectedOrg((prev) => (prev && prev.id === id ? { ...prev, status } : prev));
    toast.success(
      status === "active" ? `${target.name} marked active` : `${target.name} suspended`,
      {
        description:
          status === "active"
            ? "All platform services are available to this organisation."
            : "Orders and new registrations are paused for this organisation.",
      },
    );
  };

  const handleApprove = (org: Organization) => {
    setOrgs((prev) => prev.map((o) => (o.id === org.id ? { ...o, status: "active" } : o)));
    setSelectedOrg((prev) => (prev && prev.id === org.id ? { ...prev, status: "active" } : prev));
    toast.success(`License approved for ${org.name}`, {
      description: "The organisation moved from review to active and is now live on the network.",
    });
  };

  const handleRequestInfo = (org: Organization) => {
    toast.success(`Information requested from ${org.name}`, {
      description: "The organisation must re-upload its registration documents before approval.",
    });
  };

  const handleGenerateReport = (type: string, range: string, format: "PDF" | "CSV") => {
    setReports((prev) => [
      {
        id: `REP-${142 + prev.length}`,
        type,
        range,
        format,
        generated: new Date().toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }),
      },
      ...prev,
    ]);
  };

  const handleRetryTelemetry = () => {
    if (reconnecting) return;
    setReconnecting(true);
    window.setTimeout(() => {
      setForecastStatus("active");
      setReconnecting(false);
      toast.success("Forecast engine reconnected", {
        description: "The telemetry stream is operational again.",
      });
    }, 1800);
  };

  return (
    <>
      <DashboardLayout
        role="admin"
        roleLabel="Administrator console"
        userName="Priya Raman"
        userMeta="Platform administrator"
        nav={nav}
        title={meta.title}
        subtitle={tab === "overview" ? overviewSubtitle : meta.subtitle}
        breadcrumbs={["Administrator", meta.label]}
        actions={
          <>
            <Button variant="outline" onClick={() => setReportOpen(true)}>
              <FileBarChart className="size-4" /> Generate report
            </Button>
            <Button onClick={() => setQueueOpen(true)}>
              <ShieldCheck className="size-4" /> Verification queue
              <span className="ml-1 rounded-full bg-primary-foreground/20 px-2 py-0.5 text-[11px] font-semibold">
                {pendingCount}
              </span>
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
              orgs={orgs}
              pendingCount={pendingCount}
              forecastStatus={forecastStatus}
              reconnecting={reconnecting}
              onRetryTelemetry={handleRetryTelemetry}
              onOpenOrg={setSelectedOrg}
            />
          ) : null}
          {tab === "users" ? (
            <UsersView
              users={users}
              onOpenUser={setSelectedUser}
              onToggleStatus={handleToggleUser}
              onResetPassword={handleResetPassword}
            />
          ) : null}
          {tab === "organisations" ? (
            <OrganisationsView
              orgs={orgs}
              onOpenOrg={setSelectedOrg}
              onOpenQueue={() => setQueueOpen(true)}
            />
          ) : null}
          {tab === "compliance" ? (
            <ComplianceView reports={reports} onInspect={setSelectedEvent} />
          ) : null}
        </motion.div>
      </DashboardLayout>

      <GenerateReportDialog open={reportOpen} onOpenChange={setReportOpen} onSubmit={handleGenerateReport} />
      <VerificationQueueDrawer
        open={queueOpen}
        onOpenChange={setQueueOpen}
        orgs={orgs}
        onApprove={handleApprove}
        onRequestInfo={handleRequestInfo}
      />
      <OrgDetailDrawer
        org={selectedOrg}
        onClose={() => setSelectedOrg(null)}
        onSetStatus={handleSetOrgStatus}
      />
      <UserDetailDrawer user={selectedUser} onClose={() => setSelectedUser(null)} />
      <EventInspectDrawer event={selectedEvent} onClose={() => setSelectedEvent(null)} />
    </>
  );
}
