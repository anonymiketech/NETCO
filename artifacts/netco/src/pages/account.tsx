import { useState, useEffect } from "react";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/AuthContext";
import { apiUrl } from "@/lib/api";
import { Loader2, LogOut, Save, AlertCircle } from "lucide-react";

interface UserProfile {
  id: string;
  email: string;
  fullName?: string;
  phone?: string;
  bio?: string;
  avatarUrl?: string;
  isEmailVerified: boolean;
  isPhoneVerified: boolean;
  newsletterSubscribed: boolean;
}

export default function AccountPage() {
  const [, navigate] = useLocation();
  const { user, session, signOut } = useAuth();
  const { toast } = useToast();

  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [fullName, setFullName] = useState("");
  const [phone, setPhone] = useState("");
  const [bio, setBio] = useState("");
  const [newsletterSubscribed, setNewsletterSubscribed] = useState(true);

  // Redirect if not authenticated
  useEffect(() => {
    if (!user || !session) {
      navigate("/login");
    }
  }, [user, session]);

  // Load profile
  useEffect(() => {
    if (!user) return;

    const loadProfile = async () => {
      try {
        const res = await fetch(apiUrl(`api/auth/profile/${user.id}`));
        if (!res.ok) throw new Error("Failed to load profile");

        const data = await res.json();
        setProfile(data);
        setFullName(data.fullName || "");
        setPhone(data.phone || "");
        setBio(data.bio || "");
        setNewsletterSubscribed(data.newsletterSubscribed ?? true);
      } catch (err) {
        console.error("[v0] Failed to load profile:", err);
        toast({
          title: "Failed to load profile",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };

    loadProfile();
  }, [user]);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    setSaving(true);
    try {
      const res = await fetch(apiUrl(`api/auth/profile/${user.id}`), {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          fullName: fullName || undefined,
          phone: phone || undefined,
          bio: bio || undefined,
          newsletterSubscribed,
        }),
      });

      if (!res.ok) throw new Error("Failed to save profile");

      const updated = await res.json();
      setProfile(updated);
      toast({
        title: "Profile updated",
        description: "Your changes have been saved.",
      });
    } catch (err) {
      console.error("[v0] Profile save error:", err);
      toast({
        title: "Failed to save profile",
        variant: "destructive",
      });
    } finally {
      setSaving(false);
    }
  };

  const handleSignOut = async () => {
    try {
      await signOut();
      navigate("/");
    } catch (err) {
      console.error("[v0] Sign out error:", err);
      toast({ title: "Sign out failed", variant: "destructive" });
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen pt-20 pb-12 px-4 flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="w-8 h-8 animate-spin text-primary" />
          <p className="text-muted-foreground">Loading account settings...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  return (
    <div className="min-h-screen pt-20 pb-12 px-4">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-heading font-bold mb-2">Account Settings</h1>
          <p className="text-muted-foreground">Manage your profile and preferences</p>
        </div>

        {/* Email Verification Alert */}
        {profile && !profile.isEmailVerified && (
          <div className="mb-6 p-4 bg-amber-500/10 border border-amber-500/30 rounded-lg flex gap-3">
            <AlertCircle className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
            <div>
              <p className="font-medium text-amber-900">Email not verified</p>
              <p className="text-sm text-amber-800 mt-1">Check your inbox for a verification email from Supabase.</p>
            </div>
          </div>
        )}

        {/* Profile Form */}
        <div className="glass-card rounded-xl p-6 mb-6">
          <form onSubmit={handleSave} className="space-y-6">
            {/* Email */}
            <div className="space-y-2">
              <Label htmlFor="email">Email Address</Label>
              <Input
                id="email"
                type="email"
                value={profile?.email || ""}
                disabled
                className="bg-card border-border opacity-60 cursor-not-allowed"
              />
              <p className="text-xs text-muted-foreground">
                {profile?.isEmailVerified ? "✓ Verified" : "Awaiting verification"}
              </p>
            </div>

            {/* Full Name */}
            <div className="space-y-2">
              <Label htmlFor="fullName">Full Name</Label>
              <Input
                id="fullName"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                placeholder="John Mwangi"
                className="bg-card border-border focus:border-primary"
              />
            </div>

            {/* Phone */}
            <div className="space-y-2">
              <Label htmlFor="phone">Phone Number</Label>
              <Input
                id="phone"
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="0712345678"
                className="bg-card border-border focus:border-primary"
              />
            </div>

            {/* Bio */}
            <div className="space-y-2">
              <Label htmlFor="bio">Bio</Label>
              <Textarea
                id="bio"
                value={bio}
                onChange={(e) => setBio(e.target.value)}
                placeholder="Tell us about yourself..."
                className="bg-card border-border focus:border-primary min-h-24 resize-none"
              />
            </div>

            {/* Newsletter */}
            <div className="flex items-center gap-3 p-3 bg-background rounded-lg border border-border">
              <Checkbox
                id="newsletter"
                checked={newsletterSubscribed}
                onCheckedChange={(checked) => setNewsletterSubscribed(checked === true)}
              />
              <Label htmlFor="newsletter" className="flex-1 cursor-pointer mb-0">
                Subscribe to newsletter and announcements
              </Label>
            </div>

            {/* Save Button */}
            <Button
              type="submit"
              disabled={saving}
              className="w-full bg-primary text-primary-foreground hover:bg-primary/90 h-11"
            >
              {saving ? (
                <><Loader2 className="w-4 h-4 mr-2 animate-spin" /> Saving...</>
              ) : (
                <><Save className="w-4 h-4 mr-2" /> Save Changes</>
              )}
            </Button>
          </form>
        </div>

        {/* Sign Out Button */}
        <Button
          onClick={handleSignOut}
          variant="outline"
          className="w-full border-red-500/30 text-red-600 hover:bg-red-500/10"
        >
          <LogOut className="w-4 h-4 mr-2" />
          Sign Out
        </Button>
      </div>
    </div>
  );
}
