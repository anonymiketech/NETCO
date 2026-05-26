import { useGetServerStatus, useGetPlatformStats } from "@workspace/api-client-react";
import { Badge } from "@/components/ui/badge";
import { Activity, Wifi, Server, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";

function StatusBadge({ status }: { status: string }) {
  if (status === "online") return <Badge className="bg-success/20 text-success border-success/30 text-xs">Online</Badge>;
  if (status === "maintenance") return <Badge className="bg-warning/20 text-warning border-warning/30 text-xs">Maintenance</Badge>;
  return <Badge className="bg-destructive/20 text-destructive border-destructive/30 text-xs">Offline</Badge>;
}

function LoadBar({ load }: { load: number }) {
  const color = load >= 80 ? "bg-destructive" : load >= 60 ? "bg-warning" : "bg-success";
  return (
    <div className="w-full bg-muted/20 rounded-full h-1.5">
      <div className={`h-1.5 rounded-full transition-all ${color}`} style={{ width: `${load}%` }} />
    </div>
  );
}

const NETWORK_COLORS: Record<string, string> = {
  Safaricom: "text-green-400",
  Airtel: "text-red-400",
  Telkom: "text-blue-400",
};

export default function ServerStatus() {
  const { data: servers, isLoading, refetch, isRefetching } = useGetServerStatus();
  const { data: stats } = useGetPlatformStats();

  const online = servers?.filter((s) => s.status === "online").length ?? 0;
  const total = servers?.length ?? 0;

  const grouped = servers?.reduce<Record<string, typeof servers>>((acc, s) => {
    if (!acc[s.network]) acc[s.network] = [];
    acc[s.network].push(s);
    return acc;
  }, {}) ?? {};

  return (
    <div className="min-h-screen pt-24 pb-20 px-4">
      <div className="max-w-6xl mx-auto space-y-8">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <h1 className="text-4xl font-heading font-bold mb-2">
              Server <span className="bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">Status</span>
            </h1>
            <p className="text-muted-foreground">Real-time status of all NETCO VPN servers across Kenya</p>
          </div>
          <Button onClick={() => refetch()} variant="outline" className="border-border hover:border-primary/50" disabled={isRefetching} data-testid="button-refresh">
            <RefreshCw className={`w-4 h-4 mr-2 ${isRefetching ? "animate-spin" : ""}`} /> Refresh
          </Button>
        </div>

        {/* Summary cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { icon: Server, label: "Total Servers", value: isLoading ? "—" : String(total), color: "text-foreground" },
            { icon: Activity, label: "Online", value: isLoading ? "—" : String(online), color: "text-success" },
            { icon: Wifi, label: "Uptime", value: stats ? `${stats.uptime}%` : "—", color: "text-primary" },
            { icon: RefreshCw, label: "Active Users", value: stats ? `${stats.activeUsers.toLocaleString()}+` : "—", color: "text-secondary" },
          ].map(({ icon: Icon, label, value, color }) => (
            <div key={label} className="glass-card rounded-xl p-4 text-center space-y-2">
              <Icon className={`w-6 h-6 mx-auto ${color}`} />
              <div className={`text-2xl font-heading font-bold ${color}`}>{value}</div>
              <div className="text-xs text-muted-foreground uppercase tracking-widest">{label}</div>
            </div>
          ))}
        </div>

        {/* Server groups */}
        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div key={i} className="glass-card rounded-xl p-5 animate-pulse space-y-3">
                <div className="h-5 bg-muted/30 rounded w-2/3" />
                <div className="h-3 bg-muted/20 rounded w-1/2" />
                <div className="h-2 bg-muted/20 rounded" />
              </div>
            ))}
          </div>
        ) : (
          Object.entries(grouped).map(([network, networkServers]) => (
            <div key={network} className="space-y-3">
              <h2 className={`font-heading font-bold text-lg flex items-center gap-2 ${NETWORK_COLORS[network] ?? "text-foreground"}`}>
                <span className={`w-2 h-2 rounded-full inline-block ${network === "Safaricom" ? "bg-green-400" : network === "Airtel" ? "bg-red-400" : "bg-blue-400"}`} />
                {network}
                <span className="text-muted-foreground text-sm font-normal ml-1">
                  {networkServers.filter((s) => s.status === "online").length}/{networkServers.length} online
                </span>
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                {networkServers.map((server) => (
                  <div
                    key={server.id}
                    className={`glass-card rounded-xl p-4 space-y-3 transition-all ${server.status === "online" ? "border-border hover:border-success/30" : "opacity-60"}`}
                    data-testid={`card-server-${server.id}`}
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <p className="font-medium text-sm">{server.name}</p>
                        <p className="text-xs text-muted-foreground">{server.location}</p>
                      </div>
                      <StatusBadge status={server.status} />
                    </div>

                    {server.status === "online" && (
                      <>
                        <div className="space-y-1">
                          <div className="flex justify-between text-xs text-muted-foreground">
                            <span>Load</span>
                            <span>{server.load}%</span>
                          </div>
                          <LoadBar load={server.load} />
                        </div>
                        <div className="flex items-center justify-between text-xs">
                          <span className="text-muted-foreground">Ping</span>
                          <span className={server.ping < 30 ? "text-success" : server.ping < 60 ? "text-warning" : "text-destructive"}>
                            {server.ping} ms
                          </span>
                        </div>
                      </>
                    )}
                    {server.status === "maintenance" && (
                      <p className="text-xs text-warning">Scheduled maintenance in progress</p>
                    )}
                    {server.status === "offline" && (
                      <p className="text-xs text-destructive">Server temporarily unavailable</p>
                    )}
                  </div>
                ))}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
