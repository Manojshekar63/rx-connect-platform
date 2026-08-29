import { createFileRoute, Link } from "@tanstack/react-router";
import { Building2, FlaskConical, ShieldCheck, User } from "lucide-react";
import { useState } from "react";
import { AuthShell } from "@/components/layout/auth-shell";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/register")({
  head: () => ({
    meta: [
      { title: "Create your account — PharmaBridge AI" },
      {
        name: "description",
        content:
          "Register as a customer, hospital, pharmaceutical company or administrator on PharmaBridge AI.",
      },
      { property: "og:title", content: "Create your account — PharmaBridge AI" },
      {
        property: "og:description",
        content: "Join the AI-connected healthcare supply network.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: RegisterPage,
});

const accountTypes = [
  { id: "customer", label: "Customer", icon: User, blurb: "Find medicines, upload prescriptions" },
  { id: "hospital", label: "Hospital", icon: Building2, blurb: "Inventory and supply requests" },
  { id: "pharma", label: "Pharmaceutical", icon: FlaskConical, blurb: "Products and distribution" },
  { id: "admin", label: "Administrator", icon: ShieldCheck, blurb: "Ecosystem oversight" },
];

function RegisterPage() {
  const [selected, setSelected] = useState("customer");

  return (
    <AuthShell
      title="Create your account"
      description="Pick the workspace that matches your organisation."
      footer={
        <>
          Already registered?{" "}
          <Link to="/login" className="font-medium text-primary hover:underline">
            Sign in
          </Link>
        </>
      }
    >
      <form className="space-y-5" onSubmit={(e) => e.preventDefault()}>
        <div className="grid grid-cols-2 gap-2">
          {accountTypes.map((t) => (
            <button
              key={t.id}
              type="button"
              onClick={() => setSelected(t.id)}
              className={cn(
                "rounded-2xl border p-3 text-left transition-all",
                selected === t.id
                  ? "border-primary bg-primary/8 shadow-soft"
                  : "border-border hover:border-primary/40",
              )}
            >
              <t.icon
                className={cn(
                  "mb-2 size-5",
                  selected === t.id ? "text-primary" : "text-muted-foreground",
                )}
              />
              <p className="text-sm font-semibold">{t.label}</p>
              <p className="mt-0.5 text-[11px] leading-snug text-muted-foreground">{t.blurb}</p>
            </button>
          ))}
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="firstName">First name</Label>
            <Input id="firstName" placeholder="Marta" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="lastName">Last name</Label>
            <Input id="lastName" placeholder="Kowalski" />
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="org">
            {selected === "customer" ? "City" : "Organisation name"}
          </Label>
          <Input id="org" placeholder={selected === "customer" ? "Boston" : "St. Anne's General"} />
        </div>

        <div className="space-y-2">
          <Label htmlFor="reg-email">Work email</Label>
          <Input id="reg-email" type="email" placeholder="you@organisation.org" />
        </div>

        <div className="space-y-2">
          <Label htmlFor="reg-password">Password</Label>
          <Input id="reg-password" type="password" placeholder="At least 12 characters" />
        </div>

        <label className="flex items-start gap-2 text-xs text-muted-foreground">
          <Checkbox id="terms" className="mt-0.5" />
          <span>
            I agree to the Terms of Service, Privacy Policy and HIPAA data processing addendum.
          </span>
        </label>

        <Button size="lg" className="w-full" asChild>
          <Link to="/verify-otp">Create account</Link>
        </Button>
      </form>
    </AuthShell>
  );
}
