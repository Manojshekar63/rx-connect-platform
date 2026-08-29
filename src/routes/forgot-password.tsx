import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowLeft, Mail } from "lucide-react";
import { AuthShell } from "@/components/layout/auth-shell";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export const Route = createFileRoute("/forgot-password")({
  head: () => ({
    meta: [
      { title: "Reset your password — PharmaBridge AI" },
      {
        name: "description",
        content: "Request a secure reset link for your PharmaBridge AI healthcare account.",
      },
      { property: "og:title", content: "Reset your password — PharmaBridge AI" },
      {
        property: "og:description",
        content: "Recover access to your PharmaBridge AI workspace.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: ForgotPasswordPage,
});

function ForgotPasswordPage() {
  return (
    <AuthShell
      title="Reset your password"
      description="Enter the email tied to your account and we'll send a secure verification code."
      footer={
        <Link
          to="/login"
          className="inline-flex items-center gap-1.5 font-medium text-primary hover:underline"
        >
          <ArrowLeft className="size-3.5" /> Back to sign in
        </Link>
      }
    >
      <form className="space-y-5" onSubmit={(e) => e.preventDefault()}>
        <div className="space-y-2">
          <Label htmlFor="reset-email">Email address</Label>
          <div className="relative">
            <Mail className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
            <Input id="reset-email" type="email" placeholder="you@clinic.org" className="pl-9" />
          </div>
        </div>
        <Button size="lg" className="w-full" asChild>
          <Link to="/verify-otp">Send verification code</Link>
        </Button>
        <p className="rounded-xl bg-muted p-3 text-xs text-muted-foreground">
          For security, reset links expire after 15 minutes and can only be used once.
        </p>
      </form>
    </AuthShell>
  );
}
