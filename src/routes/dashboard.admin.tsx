import { createFileRoute } from "@tanstack/react-router";
import {
  Activity,
  Building2,
  Cpu,
  FileBarChart,
  Home,
  ServerCog,
  ShieldCheck,
  Users,
} from "lucide-react";
import { DashboardLayout } from "@/components/layout/dashboard-layout";
import { StatCard } from "@/components/common/stat-card";
import { Panel } from "@/components/common/panel";
import { DataTable, type Column } from "@/components/common/data-table";
import { StatusBadge } from "@/components/common/status-badge";
import { MixDonutChart, TrendAreaChart } from "@/components/common/charts";
import { ErrorState } from "@/components/common/states";
import { Button } from "@/components/ui/button";
import { categoryMix, demandTrend, platformUsers } from "@/lib/mock-data";

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

const nav = [
  { label: "Overview", icon: Home, active: true },
  { label: "Users", icon: Users, badge: "12" },
  { label: "Organisations", icon: Building2 },
  { label: "Compliance", icon: ShieldCheck },
  { label: "AI models", icon: Cpu },
  { label: "Reports", icon: FileBarChart },
  { label: "System", icon: ServerCog },
];

type PlatformUser = (typeof platformUsers)[number];

const userColumns: Column<PlatformUser>[] = [
  {
    key: "name",
    header: "Account",
    cell: (r) => (
      <div>
        <p className="font-medium">{r.name}</p>
        <p className="text-xs text-muted-foreground">{r.id}</p>
      </div>
    ),
  },
  { key: "type", header: "Type", cell: (r) => r.type },
  { key: "region", header: "Region", cell: (r) => r.region },
  { key: "joined", header: "Joined", cell: (r) => r.joined },
  { key: "status", header: "Status", cell: (r) => <StatusBadge status={r.status} /> },
  {
    key: "actions",
    header: "",
    cell: () => (
      <Button variant="ghost" size="sm">
        Review
      </Button>
    ),
  },
];

const services = [
  { name: "API gateway", uptime: "99.99%", tone: "active" },
  { name: "Prescription OCR", uptime: "99.94%", tone: "active" },
  { name: "Forecast engine", uptime: "99.71%", tone: "review" },
  { name: "Notification service", uptime: "99.98%", tone: "active" },
];

function AdminDashboard() {
  return (
    <DashboardLayout
      role="admin"
      roleLabel="Administrator console"
      userName="Priya Raman"
      userMeta="Platform administrator"
      nav={nav}
      title="Ecosystem health"
      subtitle="12 accounts await verification and one AI service is degraded."
      breadcrumbs={["Administrator", "Overview"]}
      actions={
        <>
          <Button variant="outline">
            <FileBarChart className="size-4" /> Generate report
          </Button>
          <Button>
            <ShieldCheck className="size-4" /> Verification queue
          </Button>
        </>
      }
    >
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
          value="12"
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
          action={<Button variant="ghost">Manage all</Button>}
        >
          <DataTable columns={userColumns} rows={platformUsers} />
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
            <ErrorState
              title="Telemetry unavailable"
              description="The forecast engine metrics feed is degraded. Retry or check the model logs."
            />
          </Panel>
        </div>
      </div>
    </DashboardLayout>
  );
}
