import { useState } from "react";
import { Link } from "@tanstack/react-router";
import { Menu, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { ThemeToggle } from "@/components/theme-provider";

const links = [
  { label: "Solutions", href: "#features" },
  { label: "Platform", href: "#how-it-works" },
  { label: "Intelligence", href: "#ai" },
  { label: "Analytics", href: "#analytics" },
];

export function SiteHeader() {
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-40 bg-background/90 backdrop-blur-xl">
      <div className="mx-auto flex h-20 w-full max-w-[1400px] items-center gap-4 border-b border-border px-5 sm:px-8 lg:px-12">
        <Link to="/" className="flex items-center gap-2.5">
          <span className="flex size-8 items-center justify-center bg-primary text-primary-foreground">
            <Plus className="size-5" strokeWidth={2.5} />
          </span>
          <span className="text-sm font-bold uppercase">
            PharmaBridge <span className="text-primary">AI</span>
          </span>
        </Link>

        <nav className="ml-auto hidden items-center gap-8 lg:flex">
          {links.map((l) => (
            <a
              key={l.href}
              href={l.href}
              className="text-xs font-medium uppercase tracking-[0.1em] text-muted-foreground transition-colors hover:text-primary"
            >
              {l.label}
            </a>
          ))}
        </nav>

        <div className="flex items-center gap-2 lg:ml-5">
          <ThemeToggle />
          <Button variant="ghost" asChild className="hidden sm:inline-flex">
            <Link to="/login">Sign in</Link>
          </Button>
          <Button asChild className="hidden sm:inline-flex">
             <Link to="/register">Register</Link>
          </Button>

          <Sheet open={open} onOpenChange={setOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="lg:hidden" aria-label="Open menu">
                <Menu className="size-5" />
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-72">
              <SheetTitle className="sr-only">Navigation</SheetTitle>
              <nav className="mt-10 flex flex-col gap-1 p-4">
                {links.map((l) => (
                  <a
                    key={l.href}
                    href={l.href}
                    onClick={() => setOpen(false)}
                    className="px-3 py-2.5 text-sm font-medium hover:bg-muted"
                  >
                    {l.label}
                  </a>
                ))}
                <div className="mt-4 flex flex-col gap-2">
                  <Button variant="outline" asChild>
                    <Link to="/login">Sign in</Link>
                  </Button>
                  <Button asChild>
                     <Link to="/register">Register</Link>
                  </Button>
                </div>
              </nav>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}
