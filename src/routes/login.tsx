import { createFileRoute, Link } from "@tanstack/react-router";
import { Lock, Mail } from "lucide-react";
import { AuthShell } from "@/components/layout/auth-shell";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";

export const Route = createFileRoute("/login")({
  head: () => ({
    meta: [
      { title: "Sign in — PharmaBridge AI" },
      {
        name: "description",
        content:
          "Sign in to PharmaBridge AI to manage prescriptions, hospital inventory or pharmaceutical supply.",
      },
      { property: "og:title", content: "Sign in — PharmaBridge AI" },
      {
        property: "og:description",
        content: "Access your PharmaBridge AI healthcare workspace.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: LoginPage,
});

const roles = [
  { value: "customer", label: "Customer", to: "/dashboard/customer" },
  { value: "hospital", label: "Hospital", to: "/dashboard/hospital" },
  { value: "pharma", label: "Pharma", to: "/dashboard/pharmaceutical" },
  { value: "admin", label: "Admin", to: "/dashboard/admin" },
] as const;

function LoginPage() {
  return (
    <AuthShell
      title="Welcome back"
      description="Sign in to your PharmaBridge AI workspace."
      footer={
        <>
          New to PharmaBridge?{" "}
          <Link to="/register" className="font-medium text-primary hover:underline">
            Create an account
          </Link>
        </>
      }
    >
      <form className="space-y-5" onSubmit={(e) => e.preventDefault()}>
        <div className="space-y-2">
          <Label>Account type</Label>
          <Tabs defaultValue="customer">
            <TabsList className="grid w-full grid-cols-4">
              {roles.map((r) => (
                <TabsTrigger key={r.value} value={r.value} className="text-xs">
                  {r.label}
                </TabsTrigger>
              ))}
            </TabsList>
          </Tabs>
        </div>

        <div className="space-y-2">
          <Label htmlFor="email">Email address</Label>
          <div className="relative">
            <Mail className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
            <Input id="email" type="email" placeholder="you@clinic.org" className="pl-9" />
          </div>
        </div>

        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <Label htmlFor="password">Password</Label>
            <Link to="/forgot-password" className="text-xs text-primary hover:underline">
              Forgot password?
            </Link>
          </div>
          <div className="relative">
            <Lock className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
            <Input id="password" type="password" placeholder="••••••••" className="pl-9" />
          </div>
        </div>

        <label className="flex items-center gap-2 text-sm text-muted-foreground">
          <Checkbox id="remember" /> Keep me signed in on this device
        </label>

        <Button type="submit" className="w-full" size="lg">
          Sign in
        </Button>
      </form>

      <div className="mt-6">
        <p className="mb-3 text-center text-xs uppercase tracking-widest text-muted-foreground">
          Explore a demo workspace
        </p>
        <div className="grid grid-cols-2 gap-2">
          {roles.map((r) => (
            <Button key={r.value} variant="outline" size="sm" asChild>
              <Link to={r.to}>{r.label} view</Link>
            </Button>
          ))}
        </div>
      </div>
    </AuthShell>
  );
}
