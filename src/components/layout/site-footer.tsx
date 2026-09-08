import { Link } from "@tanstack/react-router";
import { Linkedin, Mail, Plus, Twitter } from "lucide-react";

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
    <footer className="border-t border-border bg-card">
      <div className="mx-auto w-full max-w-[1400px] px-5 py-16 sm:px-8 lg:px-12">
        <div className="grid gap-12 lg:grid-cols-[1.5fr_repeat(4,1fr)]">
          <div>
            <Link to="/" className="flex items-center gap-2.5">
              <span className="flex size-8 items-center justify-center bg-primary text-primary-foreground">
                <Plus className="size-5" />
              </span>
              <span className="text-sm font-bold uppercase">
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
                  className="flex size-9 items-center justify-center border border-border text-muted-foreground transition-colors hover:border-primary hover:text-primary"
                >
                  <Icon className="size-4" />
                </span>
              ))}
            </div>
          </div>

          {columns.map((col) => (
            <div key={col.title}>
              <h3 className="editorial-label text-foreground">{col.title}</h3>
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
