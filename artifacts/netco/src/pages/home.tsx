import { useState } from "react";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Shield, Zap, Globe, Cpu, ArrowRight } from "lucide-react";
import { useGetPlatformStats, useListPackages } from "@workspace/api-client-react";

export default function Home() {
  const { data: stats } = useGetPlatformStats();
  const { data: packages } = useListPackages();

  return (
    <div className="flex flex-col w-full min-h-screen">
      {/* Hero Section */}
      <section className="relative pt-32 pb-20 lg:pt-48 lg:pb-32 overflow-hidden flex flex-col items-center justify-center text-center px-4">
        {/* Cyber grid bg */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#00F5FF10_1px,transparent_1px),linear-gradient(to_bottom,#00F5FF10_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)] pointer-events-none" />
        
        <div className="relative z-10 max-w-4xl mx-auto space-y-8">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-primary/30 bg-primary/5 text-primary text-sm font-medium mb-4">
            <Zap className="w-4 h-4" />
            <span>High-Speed Configs for Kenya</span>
          </div>
          
          <h1 className="text-5xl md:text-7xl font-bold font-heading text-foreground tracking-tight text-glow">
            Unlock the <br />
            <span className="bg-gradient-to-r from-primary to-secondary text-transparent bg-clip-text">Unrestricted Web</span>
          </h1>
          
          <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto">
            Premium VPN configurations engineered for power users. Bypass throttling, access blocked content, and encrypt your traffic on Safaricom, Airtel, and Telkom.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
            <Link href="/pricing">
              <Button size="lg" className="w-full sm:w-auto bg-primary text-primary-foreground hover:bg-primary/90 glow-primary-hover font-bold px-8 h-12 text-lg">
                Get Access Now <ArrowRight className="ml-2 w-5 h-5" />
              </Button>
            </Link>
            <Link href="/how-to-connect">
              <Button size="lg" variant="outline" className="w-full sm:w-auto border-primary/50 hover:bg-primary/10 h-12 text-lg">
                How It Works
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 border-y border-border bg-card/50 relative">
        <div className="max-w-7xl mx-auto px-4 grid grid-cols-2 md:grid-cols-4 gap-8">
          <div className="text-center space-y-2">
            <div className="text-3xl font-bold font-heading text-primary glow-primary inline-block text-glow">{stats?.activeUsers || "2.4K"}+</div>
            <div className="text-sm text-muted-foreground uppercase tracking-widest">Active Users</div>
          </div>
          <div className="text-center space-y-2">
            <div className="text-3xl font-bold font-heading text-secondary text-glow-secondary inline-block">{stats?.serversOnline || "18"}</div>
            <div className="text-sm text-muted-foreground uppercase tracking-widest">Servers Online</div>
          </div>
          <div className="text-center space-y-2">
            <div className="text-3xl font-bold font-heading text-success inline-block">{stats?.uptime || "99.9"}%</div>
            <div className="text-sm text-muted-foreground uppercase tracking-widest">Uptime</div>
          </div>
          <div className="text-center space-y-2">
            <div className="text-3xl font-bold font-heading text-foreground inline-block">24/7</div>
            <div className="text-sm text-muted-foreground uppercase tracking-widest">Support</div>
          </div>
        </div>
      </section>
    </div>
  );
}
