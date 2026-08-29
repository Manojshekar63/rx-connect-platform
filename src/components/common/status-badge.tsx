import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const statusBadgeVariants = cva(
  "inline-flex items-center gap-1.5 rounded-full border px-2.5 py-0.5 text-xs font-medium capitalize",
  {
    variants: {
      tone: {
        success: "border-success/25 bg-success/12 text-success",
        info: "border-info/25 bg-info/12 text-info",
        warning: "border-warning/30 bg-warning/12 text-warning",
        destructive: "border-destructive/25 bg-destructive/10 text-destructive",
        neutral: "border-border bg-muted text-muted-foreground",
        brand: "border-secondary/30 bg-secondary/15 text-secondary",
      },
    },
    defaultVariants: { tone: "neutral" },
  },
);

const toneByStatus: Record<string, VariantProps<typeof statusBadgeVariants>["tone"]> = {
  delivered: "success",
  active: "success",
  verified: "success",
  "in-stock": "success",
  "in-transit": "brand",
  processing: "info",
  reviewing: "info",
  review: "info",
  pending: "warning",
  "low-stock": "warning",
  expiring: "warning",
  cancelled: "destructive",
  rejected: "destructive",
  suspended: "destructive",
  "out-of-stock": "destructive",
};

export function StatusBadge({
  status,
  tone,
  className,
}: {
  status: string;
  tone?: VariantProps<typeof statusBadgeVariants>["tone"];
  className?: string;
}) {
  const resolved = tone ?? toneByStatus[status] ?? "neutral";
  return (
    <span className={cn(statusBadgeVariants({ tone: resolved }), className)}>
      <span className="size-1.5 rounded-full bg-current" aria-hidden />
      {status.replace(/-/g, " ")}
    </span>
  );
}
