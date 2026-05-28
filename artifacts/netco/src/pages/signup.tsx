import { useState } from "react";
import { Link, useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Shield, Loader2, Eye, EyeOff, CheckCircle, Mail } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/lib/supabase";
import { apiUrl } from "@/lib/api";

export default function Signup() {
  const [, navigate] = useLocation();
  const { toast } = useToast();
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPw, setShowPw] = useState(false);
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !email.trim() || !password.trim()) {
      toast({ title: "Fill in required fields", variant: "destructive" });
      return;
    }
    if (password.length < 8) {
      toast({ title: "Password too short", description: "Use at least 8 characters.", variant: "destructive" });
      return;
    }
    setLoading(true);
    const { data, error } = await supabase.auth.signUp({
      email: email.trim(),
      password,
      options: {
        data: { full_name: name.trim(), phone: phone.trim() },
      },
    });
    if (error) {
      setLoading(false);
      toast({ title: "Signup failed", description: error.message, variant: "destructive" });
      return;
    }

    // Create user profile in our database
    try {
      if (data.user) {
        const profileUrl = apiUrl("/auth/profile/create");
        const profileRes = await fetch(profileUrl, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            supabaseUid: data.user.id,
            email: email.trim(),
            fullName: name.trim() || undefined,
            phone: phone.trim() || undefined,
          }),
        });
        if (!profileRes.ok) {
          const profileError = await profileRes.json().catch(() => ({}));
          console.error("[v0] Profile creation failed:", profileError);
        }
      }
    } catch (profileErr) {
      console.error("[v0] Profile creation error:", profileErr);
      // Non-fatal — profile creation failure shouldn't block signup
    }

    setLoading(false);
    setDone(true);
  };

  if (done) {
    return (
      <div className="min-h-screen pt-16 pb-20 px-4 flex items-center justify-center">
        <div className="glass-card rounded-xl p-10 max-w-md w-full text-center space-y-5" data-testid="signup-success">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary/10 border border-primary/30 mx-auto">
            <Mail className="w-8 h-8 text-primary" />
          </div>
          <h2 className="text-2xl font-heading font-bold">Check Your Email</h2>
          <p className="text-muted-foreground text-sm">
            We sent a confirmation link to <strong className="text-foreground">{email}</strong>.
            Click it to activate your account, then sign in.
          </p>
          <Button onClick={() => navigate("/login")} className="bg-primary text-primary-foreground w-full glow-primary-hover">
            Go to Login
          </Button>
          <Link href="/pricing">
            <Button variant="outline" className="w-full border-border mt-2">Browse Plans First</Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-16 pb-20 px-4 flex items-center justify-center">
      <div className="w-full max-w-md space-y-8">
        <div className="text-center space-y-2">
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-xl bg-primary/10 border border-primary/30 glow-primary mb-4">
            <Shield className="w-8 h-8 text-primary" />
          </div>
          <h1 className="text-3xl font-heading font-bold">Create Account</h1>
          <p className="text-muted-foreground text-sm">Join NETCO — manage your configs in one place</p>
        </div>

        <div className="glass-card rounded-xl p-6 space-y-5" data-testid="signup-form">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">Full Name <span className="text-destructive">*</span></Label>
              <Input
                id="name"
                placeholder="John Mwangi"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="bg-card border-border focus:border-primary h-11"
                data-testid="input-name"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">Email Address <span className="text-destructive">*</span></Label>
              <Input
                id="email"
                type="email"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="bg-card border-border focus:border-primary h-11"
                data-testid="input-email"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="phone">Phone Number <span className="text-muted-foreground text-xs">(optional)</span></Label>
              <Input
                id="phone"
                type="tel"
                placeholder="0712345678"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="bg-card border-border focus:border-primary h-11"
                data-testid="input-phone"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">Password <span className="text-destructive">*</span></Label>
              <div className="relative">
                <Input
                  id="password"
                  type={showPw ? "text" : "password"}
                  placeholder="At least 8 characters"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="bg-card border-border focus:border-primary h-11 pr-10"
                  data-testid="input-password"
                />
                <button
                  type="button"
                  onClick={() => setShowPw(!showPw)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                >
                  {showPw ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <p className="text-xs text-muted-foreground">
              By signing up you agree to our{" "}
              <Link href="/terms" className="text-primary hover:underline">Terms of Service</Link>.
            </p>

            <Button
              type="submit"
              disabled={loading}
              className="w-full bg-primary text-primary-foreground hover:bg-primary/90 glow-primary-hover h-11"
              data-testid="button-signup"
            >
              {loading ? <><Loader2 className="w-4 h-4 mr-2 animate-spin" /> Creating Account…</> : "Create Account"}
            </Button>
          </form>
        </div>

        <p className="text-center text-sm text-muted-foreground">
          Already have an account?{" "}
          <Link href="/login" className="text-primary hover:underline font-medium">Sign in</Link>
        </p>
      </div>
    </div>
  );
}
