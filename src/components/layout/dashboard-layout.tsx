import { useState, type ComponentType, type ReactNode } from "react";
import { Link } from "@tanstack/react-router";
import { motion } from "motion/react";
import {
  Bell,
  ChevronRight,
  LogOut,
  Menu,
  Search,
  Settings,
  ShieldCheck,
  Stethoscope,
  User,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Sheet, SheetContent, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { ThemeToggle } from "@/components/theme-provider";
import { StatusBadge } from "@/components/common/status-badge";
import { notifications } from "@/lib/mock-data";
import { cn } from "@/lib/utils";

export interface NavItem {
  label: string;
  icon: ComponentType<{ className?: string }>;
  active?: boolean;
  badge?: string | undefined;
  onClick?: (() => void) | undefined;
}

export interface DashboardLayoutProps {
  role: string;
  roleLabel: string;
  userName: string;
  userMeta: string;
  nav: NavItem[];
  title: string;
  subtitle: string;
  breadcrumbs: string[];
  actions?: ReactNode;
  children: ReactNode;
}

function Brand() {
  return (
    <Link to="/" className="flex items-center gap-2.5">
      <span className="flex size-9 items-center justify-center bg-primary text-primary-foreground shadow-soft">
        <Stethoscope className="size-5" />
      </span>
      <span className="text-sm font-bold uppercase">
        PharmaBridge <span className="text-primary">AI</span>
      </span>
    </Link>
  );
}

function SidebarNav({ nav, roleLabel }: { nav: NavItem[]; roleLabel: string }) {
  return (
    <div className="flex h-full flex-col gap-6 p-4">
      <Brand />
      <p className="px-2 text-xs font-semibold uppercase tracking-widest text-muted-foreground">
        {roleLabel}
      </p>
      <nav className="flex flex-1 flex-col gap-1">
        {nav.map((item) => (
          <button
            key={item.label}
            type="button"
            onClick={item.onClick}
            className={cn(
              "flex items-center gap-3 border-l-2 px-3 py-2.5 text-sm font-medium transition-colors",
              item.active
                ? "border-sidebar-primary bg-sidebar-primary/8 text-sidebar-primary"
                : "border-transparent text-muted-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground",
            )}
          >
            <item.icon className="size-4.5" />
            <span className="flex-1 text-left">{item.label}</span>
            {item.badge ? (
              <span className="rounded-full bg-highlight/15 px-2 py-0.5 text-[11px] font-semibold text-highlight">
                {item.badge}
              </span>
            ) : null}
          </button>
        ))}
      </nav>
       <div className="border border-border bg-primary/5 p-4">
        <ShieldCheck className="mb-2 size-5 text-secondary" />
        <p className="text-sm font-semibold">HIPAA-ready workspace</p>
        <p className="mt-1 text-xs text-muted-foreground">
          Audit logging and encryption are active across this account.
        </p>
      </div>
    </div>
  );
}

function NotificationPanel() {
  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="ghost" size="icon" className="relative rounded-full" aria-label="Notifications">
          <Bell className="size-5" />
          <span className="absolute right-2 top-2 size-2 rounded-full bg-highlight" />
        </Button>
      </PopoverTrigger>
      <PopoverContent align="end" className="w-88 p-0">
        <div className="flex items-center justify-between border-b border-border px-4 py-3">
          <p className="text-sm font-semibold">Notifications</p>
          <span className="text-xs text-muted-foreground">{notifications.length} new</span>
        </div>
        <ul className="max-h-80 divide-y divide-border overflow-y-auto">
          {notifications.map((n) => (
            <li key={n.id} className="px-4 py-3">
              <div className="flex items-start justify-between gap-3">
                <p className="text-sm font-medium">{n.title}</p>
                <StatusBadge status={n.tone} tone={n.tone} />
              </div>
              <p className="mt-1 text-xs text-muted-foreground">{n.body}</p>
              <p className="mt-1 text-[11px] text-muted-foreground">{n.time}</p>
            </li>
          ))}
        </ul>
      </PopoverContent>
    </Popover>
  );
}

function ProfileMenu({ userName, userMeta }: { userName: string; userMeta: string }) {
  const initials = userName
    .split(" ")
    .map((p) => p[0])
    .slice(0, 2)
    .join("");

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button className="flex items-center gap-2.5 rounded-full border border-border py-1 pl-1 pr-3 transition-colors hover:bg-muted">
          <Avatar className="size-8">
            <AvatarFallback className="bg-primary/12 text-xs font-semibold text-primary">
              {initials}
            </AvatarFallback>
          </Avatar>
          <span className="hidden text-left sm:block">
            <span className="block text-xs font-semibold leading-tight">{userName}</span>
            <span className="block text-[11px] leading-tight text-muted-foreground">{userMeta}</span>
          </span>
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-56">
        <DropdownMenuLabel>{userName}</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem>
          <User className="size-4" /> Profile
        </DropdownMenuItem>
        <DropdownMenuItem>
          <Settings className="size-4" /> Settings
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem asChild>
          <Link to="/login">
            <LogOut className="size-4" /> Sign out
          </Link>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

export function DashboardLayout({
  roleLabel,
  userName,
  userMeta,
  nav,
  title,
  subtitle,
  breadcrumbs,
  actions,
  children,
}: DashboardLayoutProps) {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <div className="min-h-screen bg-background">
      <div className="mx-auto flex w-full max-w-[1600px]">
        <aside className="sticky top-0 hidden h-screen w-68 shrink-0 border-r border-sidebar-border bg-sidebar lg:block">
          <SidebarNav nav={nav} roleLabel={roleLabel} />
        </aside>

        <div className="min-w-0 flex-1">
          <header className="sticky top-0 z-30 border-b border-border bg-background/90 backdrop-blur-xl">
            <div className="flex items-center gap-3 px-4 py-3 sm:px-6">
              <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
                <SheetTrigger asChild>
                  <Button variant="ghost" size="icon" className="lg:hidden" aria-label="Open menu">
                    <Menu className="size-5" />
                  </Button>
                </SheetTrigger>
                <SheetContent side="left" className="w-72 bg-sidebar p-0">
                  <SheetTitle className="sr-only">Navigation</SheetTitle>
                  <SidebarNav nav={nav} roleLabel={roleLabel} />
                </SheetContent>
              </Sheet>

              <div className="relative hidden max-w-sm flex-1 md:block">
                <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  placeholder="Search medicines, orders, partners…"
                    className="pl-9"
                  aria-label="Search"
                />
              </div>

              <div className="ml-auto flex items-center gap-1.5 sm:gap-2">
                <ThemeToggle />
                <NotificationPanel />
                <ProfileMenu userName={userName} userMeta={userMeta} />
              </div>
            </div>
          </header>

          <main className="px-4 py-6 sm:px-6 lg:px-8">
            <nav aria-label="Breadcrumb" className="mb-4">
              <ol className="flex flex-wrap items-center gap-1.5 text-xs text-muted-foreground">
                <li>
                  <Link to="/" className="hover:text-foreground">
                    Home
                  </Link>
                </li>
                {breadcrumbs.map((crumb, i) => (
                  <li key={crumb} className="flex items-center gap-1.5">
                    <ChevronRight className="size-3.5" />
                    <span className={cn(i === breadcrumbs.length - 1 && "font-medium text-foreground")}>
                      {crumb}
                    </span>
                  </li>
                ))}
              </ol>
            </nav>

            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.35 }}
              className="mb-6 flex flex-wrap items-end justify-between gap-4"
            >
              <div>
                <h1 className="font-display text-3xl sm:text-4xl">
                  {title}
                </h1>
                <p className="mt-1 text-sm text-muted-foreground">{subtitle}</p>
              </div>
              {actions ? <div className="flex flex-wrap gap-2">{actions}</div> : null}
            </motion.div>

            {children}
          </main>
        </div>
      </div>

      <nav className="sticky bottom-0 z-30 flex items-center justify-around border-t border-border bg-background/90 px-2 py-2 backdrop-blur-xl lg:hidden">
        {nav.slice(0, 4).map((item) => (
          <button
            key={item.label}
            type="button"
            onClick={item.onClick}
            className={cn(
              "flex flex-1 flex-col items-center gap-1 rounded-lg py-1.5 text-[11px] font-medium transition-colors",
              item.active
                ? "bg-primary/10 text-primary"
                : "text-muted-foreground hover:bg-muted",
            )}
            aria-current={item.active ? "page" : undefined}
          >
            <item.icon className="size-5" />
            {item.label}
          </button>
        ))}
      </nav>
    </div>
  );
}
