import { createFileRoute, Link } from "@tanstack/react-router";
import { ShieldCheck } from "lucide-react";
import { AuthShell } from "@/components/layout/auth-shell";
import { Button } from "@/components/ui/button";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSeparator,
  InputOTPSlot,
} from "@/components/ui/input-otp";

export const Route = createFileRoute("/verify-otp")({
  head: () => ({
    meta: [
      { title: "Verify your code — PharmaBridge AI" },
      {
        name: "description",
        content: "Enter the six-digit verification code sent to your email to secure your account.",
      },
      { property: "og:title", content: "Verify your code — PharmaBridge AI" },
      {
        property: "og:description",
        content: "Two-step verification for your PharmaBridge AI account.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: VerifyOtpPage,
});

function VerifyOtpPage() {
  return (
    <AuthShell
      title="Verify your identity"
      description="We sent a 6-digit code to m•••@clinic.org. It expires in 10 minutes."
      footer={
        <>
          Didn't get a code?{" "}
          <button className="font-medium text-primary hover:underline">Resend in 0:42</button>
        </>
      }
    >
      <div className="space-y-6">
        <div className="flex justify-center">
          <InputOTP maxLength={6}>
            <InputOTPGroup>
              <InputOTPSlot index={0} />
              <InputOTPSlot index={1} />
              <InputOTPSlot index={2} />
            </InputOTPGroup>
            <InputOTPSeparator />
            <InputOTPGroup>
              <InputOTPSlot index={3} />
              <InputOTPSlot index={4} />
              <InputOTPSlot index={5} />
            </InputOTPGroup>
          </InputOTP>
        </div>

        <Button size="lg" className="w-full" asChild>
          <Link to="/dashboard/customer">Verify and continue</Link>
        </Button>

        <div className="flex items-start gap-2 rounded-xl bg-secondary/10 p-3 text-xs text-muted-foreground">
          <ShieldCheck className="mt-0.5 size-4 shrink-0 text-secondary" />
          <span>
            Multi-factor verification is required for every healthcare workspace on PharmaBridge AI.
          </span>
        </div>
      </div>
    </AuthShell>
  );
}
