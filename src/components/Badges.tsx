import { ShieldCheck } from "lucide-react";
import { cn } from "@/lib/utils";

export function VettedBadge({ className }: { className?: string }) {
  return (
    <span className={cn("inline-flex items-center gap-1 rounded-full bg-card/95 px-2 py-0.5 text-[11px] font-semibold text-vetted shadow-card backdrop-blur", className)}>
      <ShieldCheck className="h-3.5 w-3.5" /> Vetted Candidate
    </span>
  );
}

export function ReadinessPill({ score, className }: { score: number; className?: string }) {
  const grad = score >= 90 ? "bg-grad-elite" : score >= 80 ? "bg-grad-strong" : "bg-grad-base";
  return (
    <span className={cn("inline-flex items-center rounded-full px-2.5 py-0.5 text-[11px] font-bold tabular-nums text-primary-foreground shadow-card", grad, className)}>
      {score}/100 Readiness
    </span>
  );
}
