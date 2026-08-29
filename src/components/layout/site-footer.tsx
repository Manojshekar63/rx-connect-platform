import { Link } from "@tanstack/react-router";
import { Linkedin, Mail, Stethoscope, Twitter } from "lucide-react";

const columns = [
  {
    title: "Platform",
    items: ["Customer app", "Hospital inventory", "Pharma supply", "Admin console"],
  },
  { title: "Company", items: ["About", "Careers", "Newsroom", "Contact"] },
  { title: "Resources", items: ["Documentation", "API reference", "Security", "Status"] },
  { title: "Legal", items: ["Privacy policy", "Terms of service", "HIPAA", "Data processing"] },
];

export function SiteFooter() {
  return (
    <footer className="border-t border-border bg-card/60">
      <div className="mx-auto w-full max-w-7xl px-4 py-14 sm:px-6 lg:px-8">
        <div className="grid gap-10 lg:grid-cols-[1.4fr_repeat(4,1fr)]">
          <div>
            <Link to="/" className="flex items-center gap-2.5">
              <span className="gradient-brand-bg flex size-9 items-center justify-center rounded-xl text-primary-foreground">
                <Stethoscope className="size-5" />
              </span>
              <span className="font-display text-base font-semibold">
                PharmaBridge <span className="text-primary">AI</span>
              </span>
            </Link>
            <p className="mt-4 max-w-xs text-sm text-muted-foreground">
              An AI-connected healthcare supply network linking patients, hospitals and
              pharmaceutical manufacturers.
            </p>
            <div className="mt-5 flex gap-2">
              {[Twitter, Linkedin, Mail].map((Icon, i) => (
                <span
                  key={i}
                  className="flex size-9 items-center justify-center rounded-xl border border-border text-muted-foreground"
                >
                  <Icon className="size-4" />
                </span>
              ))}
            </div>
          </div>

          {columns.map((col) => (
            <div key={col.title}>
              <h3 className="text-sm font-semibold">{col.title}</h3>
              <ul className="mt-4 space-y-2.5">
                {col.items.map((item) => (
                  <li key={item}>
                    <span className="text-sm text-muted-foreground transition-colors hover:text-foreground">
                      {item}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-12 flex flex-col gap-3 border-t border-border pt-6 text-xs text-muted-foreground sm:flex-row sm:items-center sm:justify-between">
          <p>© 2026 PharmaBridge AI. All rights reserved.</p>
          <p>HIPAA-ready · SOC 2 Type II · GDPR compliant</p>
        </div>
      </div>
    </footer>
  );
}
