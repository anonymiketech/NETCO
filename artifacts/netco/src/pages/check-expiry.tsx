import { useState } from "react";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { useListPlans, getListPlansQueryKey } from "@workspace/api-client-react";
import { useToast } from "@/hooks/use-toast";
import { Search, Clock, CheckCircle, XCircle, Wifi, RefreshCw } from "lucide-react";

function daysRemaining(expiryDate: string): number {
  const diff = new Date(expiryDate).getTime() - Date.now();
  return Math.ceil(diff / 86400000);
}

function formatExpiry(expiryDate: string): string {
  return new Date(expiryDate).toLocaleDateString("en-KE", { weekday: "long", year: "numeric", month: "long", day: "numeric" });
}

export default function CheckExpiry() {
  const { toast } = useToast();
  const [input, setInput] = useState("");
  const [searchBy, setSearchBy] = useState<"phone" | "deviceId">("phone");
  const [searchParams, setSearchParams] = useState<{ phone?: string; deviceId?: string } | null>(null);

  const { data: plans, isLoading } = useListPlans(
    searchParams ?? {},
    { query: { enabled: !!searchParams, queryKey: getListPlansQueryKey(searchParams ?? {}) } }
  );

  const handleSearch = () => {
    if (!input.trim()) {
      toast({ title: "Enter a value", description: "Enter your phone number or Device ID to check.", variant: "destructive" });
      return;
    }
    const params: { phone?: string; deviceId?: string } = {};
    if (searchBy === "phone") params.phone = input.trim();
    else params.deviceId = input.trim();
    setSearchParams(params);
  };

  return (
    <div className="min-h-screen pt-24 pb-20 px-4">
      <div className="max-w-lg mx-auto space-y-8">
        <div className="text-center">
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-xl bg-primary/10 border border-primary/30 mb-4">
            <Clock className="w-8 h-8 text-primary" />
          </div>
          <h1 className="text-3xl md:text-4xl font-heading font-bold mb-2">
            Check Plan <span className="bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">Expiry</span>
          </h1>
          <p className="text-muted-foreground text-sm">Enter your phone number or Device ID to see your plan status</p>
        </div>

        <div className="glass-card rounded-xl p-6 space-y-5" data-testid="expiry-check-panel">
          <div className="flex gap-2">
            {(["phone", "deviceId"] as const).map((type) => (
              <button
                key={type}
                onClick={() => { setSearchBy(type); setInput(""); setSearchParams(null); }}
                data-testid={`tab-search-${type}`}
                className={`flex-1 py-2 rounded-md text-sm font-medium transition-all border ${
                  searchBy === type
                    ? "bg-primary/10 border-primary/40 text-primary"
                    : "bg-card border-border text-muted-foreground hover:text-foreground"
                }`}
              >
                {type === "phone" ? "By Phone Number" : "By Device ID / HWID"}
              </button>
            ))}
          </div>

          <div className="space-y-2">
            <Label htmlFor="expiry-input">
              {searchBy === "phone" ? "M-Pesa Phone Number" : "Device ID / HWID"}
            </Label>
            <div className="flex gap-2">
              <Input
                id="expiry-input"
                type={searchBy === "phone" ? "tel" : "text"}
                placeholder={searchBy === "phone" ? "e.g. 0712345678" : "Paste your Device ID or HWID"}
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleSearch()}
                className={`bg-card border-border focus:border-primary h-11 ${searchBy === "deviceId" ? "font-mono text-sm" : ""}`}
                data-testid="input-expiry"
              />
              <Button onClick={handleSearch} disabled={isLoading} className="bg-primary text-primary-foreground hover:bg-primary/90 h-11 px-4 flex-shrink-0" data-testid="button-check">
                <Search className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </div>

        {/* Results */}
        {isLoading && (
          <div className="space-y-3">
            {[1, 2].map((i) => <div key={i} className="glass-card rounded-xl p-5 animate-pulse h-28" />)}
          </div>
        )}

        {searchParams && !isLoading && plans?.length === 0 && (
          <div className="glass-card rounded-xl p-10 text-center space-y-4">
            <Search className="w-10 h-10 text-muted-foreground mx-auto" />
            <h3 className="font-heading font-bold">No Plans Found</h3>
            <p className="text-muted-foreground text-sm">No configs found for this {searchBy === "phone" ? "phone number" : "Device ID"}.</p>
            <Link href="/pricing"><Button className="bg-primary text-primary-foreground" size="sm">Buy a Plan</Button></Link>
          </div>
        )}

        {plans && plans.length > 0 && (
          <div className="space-y-3">
            <p className="text-sm text-muted-foreground">{plans.length} plan{plans.length !== 1 ? "s" : ""} found</p>
            {plans.map((plan) => {
              const days = daysRemaining(plan.expiryDate);
              const isActive = plan.status === "active" && days > 0;
              const isExpiringSoon = isActive && days <= 3;

              return (
                <div
                  key={plan.id}
                  className={`glass-card rounded-xl p-5 space-y-4 ${
                    isActive
                      ? isExpiringSoon
                        ? "border-warning/40 bg-warning/5"
                        : "border-success/30 bg-success/5"
                      : "opacity-60"
                  }`}
                  data-testid={`card-plan-${plan.id}`}
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-center gap-2">
                      {isActive ? <CheckCircle className="w-5 h-5 text-success flex-shrink-0" /> : <XCircle className="w-5 h-5 text-muted-foreground flex-shrink-0" />}
                      <div>
                        <div className="font-heading font-bold">{plan.network}</div>
                        <div className="text-sm text-muted-foreground">{plan.planName} · {plan.duration}</div>
                      </div>
                    </div>
                    <Badge className={
                      isActive
                        ? isExpiringSoon
                          ? "bg-warning/20 text-warning border-warning/30"
                          : "bg-success/20 text-success border-success/30"
                        : "bg-muted text-muted-foreground border-border"
                    }>
                      {isActive ? (isExpiringSoon ? "Expiring Soon" : "Active") : "Expired"}
                    </Badge>
                  </div>

                  <div className="flex items-center gap-2 text-sm">
                    <Clock className={`w-4 h-4 flex-shrink-0 ${isActive ? (isExpiringSoon ? "text-warning" : "text-success") : "text-muted-foreground"}`} />
                    {isActive ? (
                      <span className={isExpiringSoon ? "text-warning font-medium" : "text-success font-medium"}>
                        {days === 1 ? "Expires tomorrow" : days <= 0 ? "Expired" : `${days} days remaining`}
                      </span>
                    ) : (
                      <span className="text-muted-foreground">Expired</span>
                    )}
                  </div>

                  <div className={`text-xs rounded-md px-3 py-2 border flex items-center gap-2 ${isActive ? "bg-muted/10 border-border" : "bg-muted/5 border-border/50"}`}>
                    <Wifi className="w-3.5 h-3.5 text-muted-foreground flex-shrink-0" />
                    <span className="text-muted-foreground">{formatExpiry(plan.expiryDate)}</span>
                  </div>

                  {!isActive && (
                    <Link href="/pricing">
                      <Button size="sm" className="bg-primary/20 text-primary border border-primary/30 hover:bg-primary/30 w-full text-xs">
                        <RefreshCw className="w-3 h-3 mr-1.5" /> Renew Plan
                      </Button>
                    </Link>
                  )}
                  {isExpiringSoon && isActive && (
                    <Link href="/pricing">
                      <Button size="sm" className="bg-warning/20 text-warning border border-warning/30 hover:bg-warning/30 w-full text-xs">
                        <RefreshCw className="w-3 h-3 mr-1.5" /> Renew Before Expiry
                      </Button>
                    </Link>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
