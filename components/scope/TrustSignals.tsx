import { Lock, ShieldCheck, FileCheck } from "lucide-react";

export function TrustSignals() {
  return (
    <div className="flex flex-wrap items-center justify-center gap-x-6 gap-y-2 pt-3 text-xs text-muted-foreground">
      <span className="flex items-center gap-1.5">
        <Lock className="h-3.5 w-3.5" />
        Secure payment via Stripe
      </span>
      <span className="flex items-center gap-1.5">
        <ShieldCheck className="h-3.5 w-3.5" />
        14-day money-back guarantee
      </span>
      <span className="flex items-center gap-1.5">
        <FileCheck className="h-3.5 w-3.5" />
        Based on AS/NZS 3000
      </span>
    </div>
  );
}
