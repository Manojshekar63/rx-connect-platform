import { createFileRoute, Link } from "@tanstack/react-router";
import { motion } from "motion/react";
import {
  Activity,
  ArrowRight,
  Bot,
  Boxes,
  Brain,
  Building2,
  CheckCircle2,
  FileUp,
  FlaskConical,
  LineChart,
  PackageSearch,
  Quote,
  ScanLine,
  ShieldCheck,
  Sparkles,
  Truck,
  UserRound,
} from "lucide-react";
import heroImage from "@/assets/hero-healthcare.jpg";
import { SiteHeader } from "@/components/layout/site-header";
import { SiteFooter } from "@/components/layout/site-footer";
import { AnimatedCounter } from "@/components/landing/animated-counter";
import { TrendAreaChart, MixDonutChart } from "@/components/common/charts";
import { StatusBadge } from "@/components/common/status-badge";
import { Button } from "@/components/ui/button";
import { categoryMix, demandTrend, testimonials } from "@/lib/mock-data";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "PharmaBridge AI — Connecting Healthcare Through AI" },
      {
        name: "description",
        content:
          "PharmaBridge AI links customers, hospitals and pharmaceutical companies with AI-driven medicine discovery, inventory forecasting and supply-chain visibility.",
      },
      { property: "og:title", content: "PharmaBridge AI — Connecting Healthcare Through AI" },
      {
        property: "og:description",
        content:
          "One AI-connected network for prescriptions, hospital inventory and pharmaceutical supply.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: LandingPage,
});

const stats = [
  { value: 326, suffix: "+", label: "Hospitals connected" },
  { value: 1.24, suffix: "M", label: "Orders processed", decimals: 2 },
  { value: 12400, label: "Medicines tracked" },
  { value: 98.6, suffix: "%", label: "On-time delivery", decimals: 1 },
];

const audiences = [
  {
    icon: UserRound,
    title: "Customers",
    body: "Search verified medicines, upload prescriptions and follow every delivery to the door.",
  },
  {
    icon: Building2,
    title: "Hospitals",
    body: "Track par levels across wards, automate replenishment and approve supplier requests.",
  },
  {
    icon: FlaskConical,
    title: "Pharmaceutical companies",
    body: "Publish catalogues, plan production batches and distribute against real demand signals.",
  },
  {
    icon: ShieldCheck,
    title: "Administrators",
    body: "Verify organisations, audit compliance and monitor the health of the whole network.",
  },
];

const features = [
  {
    icon: PackageSearch,
    title: "Verified medicine discovery",
    body: "Search 12,400 SKUs by brand, generic or condition with live availability from nearby partners.",
  },
  {
    icon: FileUp,
    title: "Prescription intelligence",
    body: "Upload a photo or PDF and OCR extracts dosage, strength and refills for pharmacist review.",
  },
  {
    icon: Boxes,
    title: "Inventory forecasting",
    body: "Par-level modelling per ward flags shortages up to 21 days before they happen.",
  },
  {
    icon: Truck,
    title: "Supply-chain visibility",
    body: "Manufacturer to bedside tracking with cold-chain checkpoints and ETA confidence bands.",
  },
  {
    icon: Activity,
    title: "Operational analytics",
    body: "Dispensing volume, fill rate and supplier reliability visualised for every stakeholder.",
  },
  {
    icon: ShieldCheck,
    title: "Compliance by default",
    body: "HIPAA-ready audit trails, role-based access and encrypted records on every action.",
  },
];

const steps = [
  {
    title: "Connect your organisation",
    body: "Register as a customer, hospital or manufacturer and complete identity verification.",
  },
  {
    title: "Sync your catalogue or needs",
    body: "Import inventory, publish products or upload a prescription — the network does the matching.",
  },
  {
    title: "Let AI plan the supply",
    body: "Forecasting suggests replenishment quantities, suppliers and routes before stock runs out.",
  },
  {
    title: "Track to the last mile",
    body: "Every shipment is tracked with live status, cold-chain integrity and delivery confirmation.",
  },
];

const aiCapabilities = [
  {
    icon: Brain,
    title: "Demand forecasting",
    body: "Seasonality, outbreak signals and historic dispensing combine into 90-day SKU forecasts.",
    metric: "94% forecast accuracy",
  },
  {
    icon: ScanLine,
    title: "Prescription OCR",
    body: "Handwritten and printed prescriptions parsed into structured, pharmacist-verifiable data.",
    metric: "1.8s average parse",
  },
  {
    icon: Bot,
    title: "Substitution assistant",
    body: "Generic-equivalent suggestions with interaction checks when a medicine is unavailable.",
    metric: "27k substitutions guided",
  },
  {
    icon: Sparkles,
    title: "Anomaly detection",
    body: "Unusual ordering, expiry-risk batches and pricing outliers surfaced to administrators.",
    metric: "312 risks flagged monthly",
  },
];

const supplyStages = [
  { icon: FlaskConical, label: "Manufacturer", detail: "Batch released" },
  { icon: Boxes, label: "Distribution hub", detail: "Quality verified" },
  { icon: Building2, label: "Hospital / pharmacy", detail: "Stock received" },
  { icon: UserRound, label: "Patient", detail: "Delivered" },
];

const fadeUp = {
  initial: { opacity: 0, y: 24 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: "-80px" },
  transition: { duration: 0.5, ease: "easeOut" as const },
};

function LandingPage() {
  return (
    <div className="gradient-hero-bg min-h-screen">
      <SiteHeader />

      <main>
        {/* Hero */}
        <section className="relative overflow-hidden">
          <div className="grid-medical absolute inset-0 opacity-60" aria-hidden />
          <div className="relative mx-auto grid w-full max-w-7xl items-center gap-12 px-4 py-16 sm:px-6 lg:grid-cols-2 lg:px-8 lg:py-24">
            <motion.div
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, ease: "easeOut" }}
            >
              <span className="inline-flex items-center gap-2 rounded-full border border-secondary/30 bg-secondary/10 px-3 py-1 text-xs font-medium text-secondary">
                <Sparkles className="size-3.5" /> AI-powered healthcare supply network
              </span>
              <h1 className="mt-6 font-display text-4xl font-semibold leading-[1.08] tracking-tight sm:text-5xl lg:text-6xl">
                Connecting Healthcare{" "}
                <span className="gradient-brand-text">Through AI</span>
              </h1>
              <p className="mt-5 max-w-xl text-base text-muted-foreground sm:text-lg">
                PharmaBridge AI brings patients, hospitals and pharmaceutical manufacturers onto one
                intelligent platform — so the right medicine reaches the right person, on time.
              </p>
              <div className="mt-8 flex flex-wrap gap-3">
                <Button size="lg" asChild>
                  <Link to="/register">
                    Get started <ArrowRight className="size-4" />
                  </Link>
                </Button>
                <Button size="lg" variant="outline" asChild>
                  <Link to="/dashboard/hospital">See a live dashboard</Link>
                </Button>
              </div>
              <div className="mt-8 flex flex-wrap items-center gap-x-6 gap-y-2 text-xs text-muted-foreground">
                {["HIPAA-ready", "SOC 2 Type II", "320+ hospitals", "45 manufacturers"].map((t) => (
                  <span key={t} className="inline-flex items-center gap-1.5">
                    <CheckCircle2 className="size-3.5 text-accent" /> {t}
                  </span>
                ))}
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, scale: 0.96 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.7, delay: 0.1, ease: "easeOut" }}
              className="glass-panel rounded-3xl p-3"
            >
              <img
                src={heroImage}
                alt="Isometric illustration of an AI-connected medical supply network with hospital, warehouse, pharmacy and drone delivery"
                width={1280}
                height={1024}
                className="w-full rounded-2xl"
              />
            </motion.div>
          </div>
        </section>

        {/* Animated statistics */}
        <section className="mx-auto w-full max-w-7xl px-4 pb-16 sm:px-6 lg:px-8">
          <motion.div
            {...fadeUp}
            className="glass-panel grid gap-6 rounded-3xl px-6 py-8 sm:grid-cols-2 lg:grid-cols-4"
          >
            {stats.map((s) => (
              <div key={s.label} className="text-center">
                <p className="font-display text-3xl font-semibold tracking-tight sm:text-4xl">
                  <AnimatedCounter
                    value={s.value}
                    suffix={s.suffix ?? ""}
                    decimals={s.decimals ?? 0}
                  />
                </p>
                <p className="mt-1.5 text-sm text-muted-foreground">{s.label}</p>
              </div>
            ))}
          </motion.div>
        </section>

        {/* Audiences */}
        <section className="mx-auto w-full max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
            {audiences.map((a, i) => (
              <motion.article
                key={a.title}
                {...fadeUp}
                transition={{ duration: 0.5, delay: i * 0.07, ease: "easeOut" }}
                className="glass-panel rounded-2xl p-6"
              >
                <span className="flex size-11 items-center justify-center rounded-xl bg-primary/10 text-primary">
                  <a.icon className="size-5" />
                </span>
                <h3 className="mt-4 text-base font-semibold">{a.title}</h3>
                <p className="mt-2 text-sm text-muted-foreground">{a.body}</p>
              </motion.article>
            ))}
          </div>
        </section>

        {/* Features */}
        <section id="features" className="mx-auto w-full max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
          <motion.header {...fadeUp} className="max-w-2xl">
            <p className="text-xs font-semibold uppercase tracking-widest text-secondary">
              Platform
            </p>
            <h2 className="mt-3 font-display text-3xl font-semibold tracking-tight sm:text-4xl">
              Everything a healthcare supply chain needs
            </h2>
            <p className="mt-4 text-muted-foreground">
              Purpose-built modules for each participant, sharing one verified source of medicine
              data.
            </p>
          </motion.header>

          <div className="mt-10 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {features.map((f, i) => (
              <motion.article
                key={f.title}
                {...fadeUp}
                transition={{ duration: 0.5, delay: (i % 3) * 0.07, ease: "easeOut" }}
                className="glass-panel group rounded-2xl p-6 transition-transform hover:-translate-y-1"
              >
                <span className="flex size-11 items-center justify-center rounded-xl bg-secondary/12 text-secondary">
                  <f.icon className="size-5" />
                </span>
                <h3 className="mt-4 text-base font-semibold">{f.title}</h3>
                <p className="mt-2 text-sm text-muted-foreground">{f.body}</p>
              </motion.article>
            ))}
          </div>
        </section>

        {/* How it works */}
        <section id="how-it-works" className="border-y border-border bg-card/50 py-20">
          <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8">
            <motion.header {...fadeUp} className="max-w-2xl">
              <p className="text-xs font-semibold uppercase tracking-widest text-secondary">
                How it works
              </p>
              <h2 className="mt-3 font-display text-3xl font-semibold tracking-tight sm:text-4xl">
                From registration to last-mile delivery
              </h2>
            </motion.header>

            <ol className="mt-12 grid gap-6 md:grid-cols-2 lg:grid-cols-4">
              {steps.map((s, i) => (
                <motion.li
                  key={s.title}
                  {...fadeUp}
                  transition={{ duration: 0.5, delay: i * 0.08, ease: "easeOut" }}
                  className="relative rounded-2xl border border-border bg-background/60 p-6"
                >
                  <span className="gradient-brand-bg flex size-9 items-center justify-center rounded-xl text-sm font-semibold text-primary-foreground">
                    {i + 1}
                  </span>
                  <h3 className="mt-4 text-base font-semibold">{s.title}</h3>
                  <p className="mt-2 text-sm text-muted-foreground">{s.body}</p>
                </motion.li>
              ))}
            </ol>
          </div>
        </section>

        {/* AI capabilities */}
        <section id="ai" className="mx-auto w-full max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
          <div className="grid gap-10 lg:grid-cols-[0.9fr_1.1fr] lg:items-center">
            <motion.div {...fadeUp}>
              <p className="text-xs font-semibold uppercase tracking-widest text-secondary">
                AI capabilities
              </p>
              <h2 className="mt-3 font-display text-3xl font-semibold tracking-tight sm:text-4xl">
                Models trained on real dispensing behaviour
              </h2>
              <p className="mt-4 text-muted-foreground">
                Four production models run continuously across the network, each auditable and
                reviewable by clinical staff before any action is taken.
              </p>
              <Button className="mt-7" variant="outline" asChild>
                <Link to="/dashboard/pharmaceutical">
                  Explore the pharma workspace <ArrowRight className="size-4" />
                </Link>
              </Button>
            </motion.div>

            <div className="grid gap-4 sm:grid-cols-2">
              {aiCapabilities.map((c, i) => (
                <motion.article
                  key={c.title}
                  {...fadeUp}
                  transition={{ duration: 0.5, delay: i * 0.07, ease: "easeOut" }}
                  className="glass-panel rounded-2xl p-5"
                >
                  <span className="flex size-10 items-center justify-center rounded-xl bg-accent/12 text-accent">
                    <c.icon className="size-5" />
                  </span>
                  <h3 className="mt-4 text-sm font-semibold">{c.title}</h3>
                  <p className="mt-2 text-xs text-muted-foreground">{c.body}</p>
                  <p className="mt-4 text-xs font-semibold text-primary">{c.metric}</p>
                </motion.article>
              ))}
            </div>
          </div>
        </section>

        {/* Supply chain visualisation */}
        <section className="border-y border-border bg-card/50 py-20">
          <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8">
            <motion.header {...fadeUp} className="max-w-2xl">
              <p className="text-xs font-semibold uppercase tracking-widest text-secondary">
                Supply chain
              </p>
              <h2 className="mt-3 font-display text-3xl font-semibold tracking-tight sm:text-4xl">
                Every batch, traceable end to end
              </h2>
            </motion.header>

            <div className="mt-12 grid gap-4 lg:grid-cols-4">
              {supplyStages.map((stage, i) => (
                <motion.div
                  key={stage.label}
                  {...fadeUp}
                  transition={{ duration: 0.5, delay: i * 0.1, ease: "easeOut" }}
                  className="relative"
                >
                  <div className="glass-panel rounded-2xl p-6">
                    <div className="flex items-center justify-between">
                      <span className="flex size-11 items-center justify-center rounded-xl bg-primary/10 text-primary">
                        <stage.icon className="size-5" />
                      </span>
                      <StatusBadge status={i === 3 ? "in-transit" : "verified"} />
                    </div>
                    <h3 className="mt-4 text-base font-semibold">{stage.label}</h3>
                    <p className="mt-1 text-sm text-muted-foreground">{stage.detail}</p>
                    <div className="mt-4 h-1.5 overflow-hidden rounded-full bg-muted">
                      <motion.span
                        initial={{ width: 0 }}
                        whileInView={{ width: i === 3 ? "62%" : "100%" }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.9, delay: 0.2 + i * 0.1 }}
                        className="gradient-brand-bg block h-full"
                      />
                    </div>
                  </div>
                  {i < supplyStages.length - 1 ? (
                    <ArrowRight className="absolute -right-3 top-1/2 hidden size-5 -translate-y-1/2 text-muted-foreground lg:block" />
                  ) : null}
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Analytics preview */}
        <section id="analytics" className="mx-auto w-full max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
          <motion.header {...fadeUp} className="max-w-2xl">
            <p className="text-xs font-semibold uppercase tracking-widest text-secondary">
              Analytics
            </p>
            <h2 className="mt-3 font-display text-3xl font-semibold tracking-tight sm:text-4xl">
              The numbers your team already asks for
            </h2>
          </motion.header>

          <motion.div {...fadeUp} className="mt-10 grid gap-4 lg:grid-cols-3">
            <div className="glass-panel rounded-2xl p-6 lg:col-span-2">
              <div className="mb-4 flex items-center gap-2">
                <LineChart className="size-4 text-primary" />
                <h3 className="text-sm font-semibold">Demand vs fulfilment (units, thousands)</h3>
              </div>
              <TrendAreaChart
                data={demandTrend}
                xKey="month"
                series={[
                  { key: "requested", label: "Requested", color: "var(--chart-1)" },
                  { key: "fulfilled", label: "Fulfilled", color: "var(--chart-3)" },
                ]}
                height={280}
              />
            </div>
            <div className="glass-panel rounded-2xl p-6">
              <div className="mb-4 flex items-center gap-2">
                <Activity className="size-4 text-secondary" />
                <h3 className="text-sm font-semibold">Therapeutic mix</h3>
              </div>
              <MixDonutChart data={categoryMix} height={280} />
            </div>
          </motion.div>
        </section>

        {/* Testimonials */}
        <section className="border-t border-border bg-card/50 py-20">
          <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8">
            <motion.header {...fadeUp} className="max-w-2xl">
              <p className="text-xs font-semibold uppercase tracking-widest text-secondary">
                Testimonials
              </p>
              <h2 className="mt-3 font-display text-3xl font-semibold tracking-tight sm:text-4xl">
                Trusted across the care continuum
              </h2>
            </motion.header>

            <div className="mt-10 grid gap-4 lg:grid-cols-3">
              {testimonials.map((t, i) => (
                <motion.figure
                  key={t.name}
                  {...fadeUp}
                  transition={{ duration: 0.5, delay: i * 0.08, ease: "easeOut" }}
                  className="glass-panel flex flex-col rounded-2xl p-6"
                >
                  <Quote className="size-6 text-secondary" />
                  <blockquote className="mt-4 flex-1 text-sm leading-relaxed">{t.quote}</blockquote>
                  <figcaption className="mt-6">
                    <p className="text-sm font-semibold">{t.name}</p>
                    <p className="text-xs text-muted-foreground">{t.role}</p>
                  </figcaption>
                </motion.figure>
              ))}
            </div>

            <motion.div
              {...fadeUp}
              className="glass-panel mt-12 flex flex-col items-start gap-6 rounded-3xl p-8 sm:flex-row sm:items-center sm:justify-between"
            >
              <div>
                <h3 className="font-display text-2xl font-semibold tracking-tight">
                  Bring your organisation onto the network
                </h3>
                <p className="mt-2 text-sm text-muted-foreground">
                  Onboarding takes under a week, including verification and catalogue import.
                </p>
              </div>
              <Button size="lg" asChild>
                <Link to="/register">
                  Create your account <ArrowRight className="size-4" />
                </Link>
              </Button>
            </motion.div>
          </div>
        </section>
      </main>

      <SiteFooter />
    </div>
  );
}
