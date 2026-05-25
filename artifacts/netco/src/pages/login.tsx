import { useState } from "react";
import { Link, useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Shield, Loader2, Eye, EyeOff } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/lib/supabase";

export default function Login() {
  const [, navigate] = useLocation();
  const { toast } = useToast();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPw, setShowPw] = useState(false);
  const [loading, setLoading] = useState(false);
  const [resetMode, setResetMode] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim() || !password.trim()) {
      toast({ title: "Fill in all fields", variant: "destructive" });
      return;
    }
    setLoading(true);
    const { error } = await supabase.auth.signInWithPassword({ email: email.trim(), password });
    setLoading(false);
    if (error) {
      toast({ title: "Login failed", description: error.message, variant: "destructive" });
      return;
    }
    toast({ title: "Welcome back!", description: "You're now signed in." });
    navigate("/dashboard");
  };

  const handleReset = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) {
      toast({ title: "Enter your email", variant: "destructive" });
      return;
    }
    setLoading(true);
    const { error, data } = await supabase.auth.resetPasswordForEmail(email.trim());
    if (error) {
      setLoading(false);
      toast({ title: "Reset failed", description: error.message, variant: "destructive" });
      return;
    }

    try {
      const resetUrl = `${window.location.origin}/reset-password`;
      await fetch(`${import.meta.env.BASE_URL}api/auth/email/reset`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: email.trim(), resetUrl }),
      });
    } catch {
      // non-fatal
    }

    setLoading(false);
    toast({ title: "Check your email", description: "A password reset link has been sent." });
    setResetMode(false);
  };

  return (
    <div className="min-h-screen pt-16 pb-20 px-4 flex items-center justify-center">
      <div className="w-full max-w-md space-y-8">
        <div className="text-center space-y-2">
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-xl bg-primary/10 border border-primary/30 glow-primary mb-4">
            <Shield className="w-8 h-8 text-primary" />
          </div>
          <h1 className="text-3xl font-heading font-bold">{resetMode ? "Reset Password" : "Welcome Back"}</h1>
          <p className="text-muted-foreground text-sm">
            {resetMode ? "Enter your email to receive a reset link" : "Sign in to manage your NETCO configs"}
          </p>
        </div>

        <div className="glass-card rounded-xl p-6 space-y-5" data-testid="login-form">
          <form onSubmit={resetMode ? handleReset : handleLogin} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email Address</Label>
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

            {!resetMode && (
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label htmlFor="password">Password</Label>
                  <button
                    type="button"
                    onClick={() => setResetMode(true)}
                    className="text-xs text-primary hover:underline"
                  >
                    Forgot password?
                  </button>
                </div>
                <div className="relative">
                  <Input
                    id="password"
                    type={showPw ? "text" : "password"}
                    placeholder="Enter your password"
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
            )}

            <Button
              type="submit"
              disabled={loading}
              className="w-full bg-primary text-primary-foreground hover:bg-primary/90 glow-primary-hover h-11"
              data-testid="button-login"
            >
              {loading ? (
                <><Loader2 className="w-4 h-4 mr-2 animate-spin" /> {resetMode ? "Sending…" : "Signing In…"}</>
              ) : (
                resetMode ? "Send Reset Link" : "Sign In"
              )}
            </Button>

            {resetMode && (
              <button
                type="button"
                onClick={() => setResetMode(false)}
                className="w-full text-sm text-muted-foreground hover:text-foreground text-center"
              >
                ← Back to login
              </button>
            )}
          </form>

          <div className="relative">
            <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-border" /></div>
            <div className="relative flex justify-center text-xs"><span className="px-2 bg-card text-muted-foreground">or</span></div>
          </div>

          <div className="text-center text-sm text-muted-foreground">
            No account needed to buy configs.{" "}
            <Link href="/pricing" className="text-primary hover:underline font-medium">Browse Plans →</Link>
          </div>
        </div>

        <p className="text-center text-sm text-muted-foreground">
          Don't have an account?{" "}
          <Link href="/signup" className="text-primary hover:underline font-medium">Sign up</Link>
        </p>
      </div>
    </div>
  );
}
