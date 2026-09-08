import { createFileRoute, Link } from "@tanstack/react-router";
import { motion } from "motion/react";
import {
  Activity, ArrowRight, Bot, Boxes, Brain, Building2, CheckCircle2,
  FileUp, FlaskConical, LineChart, PackageSearch, Quote, ScanLine,
  ShieldCheck, Sparkles, Truck, UserRound,
} from "lucide-react";
import heroImage from "@/assets/hero-healthcare.jpg";
import { SiteHeader } from "@/components/layout/site-header";
import { SiteFooter } from "@/components/layout/site-footer";
import { AnimatedCounter } from "@/components/landing/animated-counter";
import { TrendAreaChart, MixDonutChart } from "@/components/common/charts";
import { Button } from "@/components/ui/button";
import { categoryMix, demandTrend, testimonials } from "@/lib/mock-data";

export const Route = createFileRoute("/")({
  head: () => ({ meta: [
    { title: "PharmaBridge AI — Healthcare Supply Intelligence" },
    { name: "description", content: "PharmaBridge AI connects customers, hospitals and pharmaceutical companies through intelligent medicine supply and predictive logistics." },
    { property: "og:title", content: "PharmaBridge AI — Healthcare Supply Intelligence" },
    { property: "og:description", content: "One intelligent network for medicine access, hospital inventory and pharmaceutical supply." },
    { property: "og:type", content: "website" },
    { name: "twitter:card", content: "summary_large_image" },
  ]}), component: LandingPage,
});

const stats = [
  { value: 326, suffix: "+", label: "Hospitals connected" },
  { value: 1.24, suffix: "M", label: "Orders processed", decimals: 2 },
  { value: 12400, label: "Medicines tracked" },
  { value: 98.6, suffix: "%", label: "On-time delivery", decimals: 1 },
];
const audiences = [
  { icon: UserRound, title: "Customers", body: "Verified medicine access, prescription intelligence and transparent delivery." },
  { icon: Building2, title: "Hospitals", body: "Ward-level inventory control, automated replenishment and supplier oversight." },
  { icon: FlaskConical, title: "Pharmaceutical companies", body: "Demand-aware production, catalogue distribution and batch visibility." },
  { icon: ShieldCheck, title: "Administrators", body: "Organisation verification, compliance auditing and network governance." },
];
const features = [
  { icon: PackageSearch, title: "Verified discovery", body: "Search 12,400 medicines by brand, generic or condition with live partner availability." },
  { icon: FileUp, title: "Prescription intelligence", body: "OCR extracts dosage, strength and refills for qualified pharmacist review." },
  { icon: Boxes, title: "Inventory forecasting", body: "Par-level models flag ward shortages up to 21 days before they occur." },
  { icon: Truck, title: "Supply-chain visibility", body: "Track each medicine from manufacturer to bedside with cold-chain checkpoints." },
  { icon: Activity, title: "Operational analytics", body: "Compare dispensing volume, fill rate and supplier reliability at a glance." },
  { icon: ShieldCheck, title: "Compliance by design", body: "Role-based access, encrypted records and a clear audit trail for every action." },
];
const steps = [
  ["Connect", "Verify each patient, hospital or manufacturer entering the network."],
  ["Synchronise", "Bring inventory, catalogues and prescriptions into one trusted data layer."],
  ["Forecast", "Anticipate shortages and recommend quantities, suppliers and routes."],
  ["Deliver", "Track the final journey with status, integrity and receipt confirmation."],
];
const aiCapabilities = [
  { icon: Brain, title: "Demand forecasting", body: "Seasonality, outbreaks and dispensing history combine into 90-day forecasts.", metric: "94% forecast accuracy" },
  { icon: ScanLine, title: "Prescription OCR", body: "Printed and handwritten prescriptions become structured, reviewable data.", metric: "1.8s average parse" },
  { icon: Bot, title: "Substitution assistant", body: "Auditable generic-equivalent suggestions when medicine is unavailable.", metric: "27k substitutions guided" },
  { icon: Sparkles, title: "Anomaly detection", body: "Expiry risk, unusual ordering and price outliers surface automatically.", metric: "312 risks flagged monthly" },
];
const fadeUp = { initial: { opacity: 0, y: 22 }, whileInView: { opacity: 1, y: 0 }, viewport: { once: true, margin: "-60px" }, transition: { duration: 0.55, ease: "easeOut" as const } };

function SectionHeading({ label, title, copy }: { label: string; title: string; copy?: string }) {
  return <motion.header {...fadeUp} className="grid gap-5 border-t border-border pt-6 md:grid-cols-[1fr_2fr]">
    <p className="editorial-label text-primary">{label}</p>
    <div><h2 className="max-w-3xl font-display text-4xl leading-tight sm:text-5xl">{title}</h2>{copy ? <p className="mt-4 max-w-2xl text-muted-foreground">{copy}</p> : null}</div>
  </motion.header>;
}

function LandingPage() {
  return <div className="min-h-screen bg-background"><SiteHeader /><main>
    <section className="mx-auto w-full max-w-[1400px] px-5 pb-16 pt-10 sm:px-8 lg:px-12 lg:pb-24 lg:pt-16">
      <div className="grid gap-12 lg:grid-cols-12">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: .65 }} className="lg:col-span-7">
          <span className="editorial-label inline-block bg-highlight/10 px-3 py-1.5 text-highlight">Healthcare intelligence / 2026</span>
          <h1 className="mt-7 font-display text-6xl leading-[.88] sm:text-8xl lg:text-[7.5rem]">Bridging the<br/><span className="italic text-primary">Supply Gap</span></h1>
          <p className="mt-8 max-w-2xl text-lg font-light leading-relaxed text-foreground/75 sm:text-xl">Advanced AI orchestration for the pharmaceutical ecosystem—connecting patients, hospitals, manufacturers and administrators through predictive logistics.</p>
          <div className="mt-10 flex flex-wrap items-center gap-6"><Button size="lg" asChild><Link to="/dashboard/hospital">Explore dashboard <ArrowRight /></Link></Button><div className="border-l-2 border-secondary pl-4 text-sm"><strong className="block">Live network</strong><span className="text-secondary">Operational · 98.6% on time</span></div></div>
        </motion.div>
        <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: .65, delay: .1 }} className="grid grid-cols-2 gap-px bg-border lg:col-span-5">
          {audiences.map((a, i) => <Link key={a.title} to={i === 0 ? "/dashboard/customer" : i === 1 ? "/dashboard/hospital" : i === 2 ? "/dashboard/pharmaceutical" : "/dashboard/admin"} className={`group flex min-h-56 flex-col justify-between bg-card p-5 transition-colors sm:p-7 ${i === 3 ? "bg-foreground text-background hover:bg-highlight" : "hover:bg-primary hover:text-primary-foreground"}`}>
            <div className="flex items-start justify-between"><span className="font-mono text-xs text-highlight">0{i + 1}.</span><a.icon className="size-5 opacity-50" /></div><div><h2 className="font-display text-2xl sm:text-3xl">{a.title}</h2><p className={`mt-3 text-xs leading-relaxed ${i === 3 ? "text-background/65" : "text-muted-foreground group-hover:text-primary-foreground/75"}`}>{a.body}</p><ArrowRight className="mt-5 size-4 transition-transform group-hover:translate-x-1" /></div>
          </Link>)}
        </motion.div>
      </div>
      <div className="mt-16 grid border-y border-border sm:grid-cols-2 lg:grid-cols-4">{stats.map((s, i) => <motion.div key={s.label} {...fadeUp} transition={{ ...fadeUp.transition, delay: i * .06 }} className="border-border px-5 py-7 sm:border-r last:border-r-0"><p className="font-display text-4xl"><AnimatedCounter value={s.value} suffix={s.suffix ?? ""} decimals={s.decimals ?? 0}/></p><p className="mt-1 text-xs uppercase tracking-[.1em] text-muted-foreground">{s.label}</p></motion.div>)}</div>
    </section>

    <section id="features" className="border-y border-border bg-card"><div className="mx-auto grid max-w-[1400px] gap-10 px-5 py-20 sm:px-8 lg:grid-cols-12 lg:px-12">
      <motion.div {...fadeUp} className="lg:col-span-5"><p className="editorial-label text-secondary">Network view / Live</p><h2 className="mt-4 font-display text-5xl leading-tight">One system.<br/><span className="italic text-secondary">No blind spots.</span></h2><p className="mt-5 max-w-md text-muted-foreground">A shared operational picture makes every handoff visible, accountable and easier to improve.</p><div className="mt-8 flex flex-wrap gap-4 text-xs text-muted-foreground">{["HIPAA-ready", "SOC 2 Type II", "Role-controlled"].map(x => <span key={x} className="flex items-center gap-2"><CheckCircle2 className="size-4 text-accent"/>{x}</span>)}</div></motion.div>
      <motion.div {...fadeUp} className="relative overflow-hidden border border-border bg-background p-3 lg:col-span-7"><img src={heroImage} width={1280} height={1024} alt="AI-connected network linking a hospital, warehouse, pharmacy and medical delivery" className="aspect-[16/10] w-full object-cover"/><div className="absolute bottom-7 left-7 bg-background/90 px-4 py-3 backdrop-blur"><p className="editorial-label text-primary">Network pulse</p><p className="mt-1 text-sm font-medium">All critical routes verified</p></div></motion.div>
    </div></section>

    <section className="mx-auto max-w-[1400px] px-5 py-24 sm:px-8 lg:px-12"><SectionHeading label="Platform / 06 modules" title="Infrastructure for the full medicine journey" copy="Each module serves a distinct decision while sharing one verified source of healthcare data."/><div className="mt-12 grid gap-px border border-border bg-border md:grid-cols-2 lg:grid-cols-3">{features.map((f,i)=><motion.article key={f.title} {...fadeUp} transition={{...fadeUp.transition,delay:(i%3)*.06}} className="group min-h-64 bg-background p-7 transition-colors hover:bg-card"><div className="flex items-center justify-between"><span className="font-mono text-xs text-muted-foreground">0{i+1}</span><f.icon className="size-5 text-secondary"/></div><h3 className="mt-14 font-display text-2xl">{f.title}</h3><p className="mt-3 text-sm leading-relaxed text-muted-foreground">{f.body}</p></motion.article>)}</div></section>

    <section id="how-it-works" className="bg-foreground text-background"><div className="mx-auto max-w-[1400px] px-5 py-24 sm:px-8 lg:px-12"><motion.div {...fadeUp} className="grid gap-6 md:grid-cols-2"><p className="editorial-label text-secondary">Operating model / 04 stages</p><h2 className="font-display text-5xl leading-tight">From signal to supply,<br/><span className="italic text-secondary">without interruption.</span></h2></motion.div><ol className="mt-16 grid border-y border-background/15 md:grid-cols-4">{steps.map(([title,body],i)=><motion.li key={title} {...fadeUp} transition={{...fadeUp.transition,delay:i*.08}} className="border-background/15 py-8 md:border-r md:px-6 first:pl-0 last:border-r-0"><span className="font-mono text-xs text-secondary">0{i+1}</span><h3 className="mt-12 font-display text-3xl">{title}</h3><p className="mt-3 text-sm leading-relaxed text-background/60">{body}</p></motion.li>)}</ol></div></section>

    <section id="ai" className="mx-auto max-w-[1400px] px-5 py-24 sm:px-8 lg:px-12"><SectionHeading label="Intelligence / Human reviewed" title="Models built to inform clinical operations—not replace judgment."/><div className="mt-12 grid gap-px border border-border bg-border lg:grid-cols-2">{aiCapabilities.map((c,i)=><motion.article key={c.title} {...fadeUp} className="grid gap-6 bg-card p-7 sm:grid-cols-[auto_1fr] sm:p-9"><span className="flex size-11 items-center justify-center border border-primary/20 text-primary"><c.icon className="size-5"/></span><div><div className="flex flex-wrap items-baseline justify-between gap-3"><h3 className="font-display text-3xl">{c.title}</h3><span className="text-xs font-semibold text-primary">{c.metric}</span></div><p className="mt-3 text-sm text-muted-foreground">{c.body}</p></div></motion.article>)}</div></section>

    <section id="analytics" className="border-y border-border bg-card"><div className="mx-auto max-w-[1400px] px-5 py-24 sm:px-8 lg:px-12"><SectionHeading label="Evidence / Live analytics" title="The numbers decision-makers already ask for."/><motion.div {...fadeUp} className="mt-12 grid gap-10 lg:grid-cols-[2fr_1fr]"><div className="border-t border-border pt-5"><div className="mb-5 flex items-center gap-2"><LineChart className="size-4 text-primary"/><h3 className="text-sm font-semibold">Demand vs fulfilment</h3></div><TrendAreaChart data={demandTrend} xKey="month" series={[{key:"requested",label:"Requested",color:"var(--chart-1)"},{key:"fulfilled",label:"Fulfilled",color:"var(--chart-3)"}]} height={300}/></div><div className="border-t border-border pt-5"><div className="mb-5 flex items-center gap-2"><Activity className="size-4 text-secondary"/><h3 className="text-sm font-semibold">Therapeutic mix</h3></div><MixDonutChart data={categoryMix} height={300}/></div></motion.div></div></section>

    <section className="mx-auto max-w-[1400px] px-5 py-24 sm:px-8 lg:px-12"><SectionHeading label="Field notes / Partners" title="Trusted across the care continuum."/><div className="mt-12 grid gap-px border border-border bg-border lg:grid-cols-3">{testimonials.map((t,i)=><motion.figure key={t.name} {...fadeUp} transition={{...fadeUp.transition,delay:i*.08}} className="flex min-h-72 flex-col bg-background p-7"><Quote className="size-6 text-secondary"/><blockquote className="mt-7 flex-1 font-display text-2xl leading-snug">“{t.quote}”</blockquote><figcaption className="mt-7 border-t border-border pt-4"><p className="text-sm font-semibold">{t.name}</p><p className="text-xs text-muted-foreground">{t.role}</p></figcaption></motion.figure>)}</div><motion.div {...fadeUp} className="mt-16 flex flex-col gap-8 border-y border-border py-10 sm:flex-row sm:items-center sm:justify-between"><div><p className="editorial-label text-highlight">Join the network</p><h3 className="mt-3 font-display text-4xl">Bring your organisation into view.</h3></div><Button size="lg" asChild><Link to="/register">Create your account <ArrowRight/></Link></Button></motion.div></section>
  </main><SiteFooter/></div>;
}
