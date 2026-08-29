import type { ReactNode } from "react";
import { Link } from "@tanstack/react-router";
import { motion } from "motion/react";
import { Activity, ShieldCheck, Stethoscope, Truck } from "lucide-react";
import { ThemeToggle } from "@/components/theme-provider";

const highlights = [
  { icon: Activity, text: "AI demand forecasting across 12,400 SKUs" },
  { icon: Truck, text: "Live supply-chain tracking from plant to patient" },
  { icon: ShieldCheck, text: "HIPAA-ready audit trails on every action" },
];

export function AuthShell({
  title,
  description,
  children,
  footer,
}: {
  title: string;
  description: string;
  children: ReactNode;
  footer?: ReactNode;
}) {
  return (
    <div className="gradient-hero-bg grid min-h-screen lg:grid-cols-2">
      <aside className="relative hidden overflow-hidden border-r border-border p-10 lg:flex lg:flex-col lg:justify-between">
        <div className="grid-medical absolute inset-0 opacity-70" aria-hidden />
        <div className="relative">
          <Link to="/" className="flex items-center gap-2.5">
            <span className="gradient-brand-bg flex size-9 items-center justify-center rounded-xl text-primary-foreground">
              <Stethoscope className="size-5" />
            </span>
            <span className="font-display text-base font-semibold">
              PharmaBridge <span className="text-primary">AI</span>
            </span>
          </Link>
        </div>
        <div className="relative max-w-md">
          <h2 className="font-display text-3xl font-semibold leading-tight">
            One network for customers, hospitals and pharmaceutical supply.
          </h2>
          <ul className="mt-8 space-y-4">
            {highlights.map((h) => (
              <li key={h.text} className="flex items-start gap-3">
                <span className="flex size-9 items-center justify-center rounded-xl bg-secondary/15 text-secondary">
                  <h.icon className="size-4.5" />
                </span>
                <span className="pt-2 text-sm text-muted-foreground">{h.text}</span>
              </li>
            ))}
          </ul>
        </div>
        <p className="relative text-xs text-muted-foreground">
          Trusted by 320+ hospitals and 45 manufacturers worldwide.
        </p>
      </aside>

      <main className="flex flex-col px-5 py-8 sm:px-10">
        <div className="flex items-center justify-between lg:justify-end">
          <Link to="/" className="flex items-center gap-2 lg:hidden">
            <span className="gradient-brand-bg flex size-8 items-center justify-center rounded-lg text-primary-foreground">
              <Stethoscope className="size-4" />
            </span>
            <span className="font-display text-sm font-semibold">PharmaBridge AI</span>
          </Link>
          <ThemeToggle />
        </div>

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="mx-auto flex w-full max-w-md flex-1 flex-col justify-center py-10"
        >
          <div className="glass-panel rounded-3xl p-7 sm:p-8">
            <h1 className="font-display text-2xl font-semibold tracking-tight">{title}</h1>
            <p className="mt-2 text-sm text-muted-foreground">{description}</p>
            <div className="mt-7">{children}</div>
          </div>
          {footer ? (
            <p className="mt-6 text-center text-sm text-muted-foreground">{footer}</p>
          ) : null}
        </motion.div>
      </main>
    </div>
  );
}
