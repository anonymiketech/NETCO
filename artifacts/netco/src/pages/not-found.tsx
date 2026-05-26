import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Home, ArrowLeft } from "lucide-react";

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center px-4 pt-16">
      <div className="text-center space-y-8 max-w-md mx-auto">
        {/* Glitchy 404 */}
        <div className="relative">
          <div className="text-[10rem] font-heading font-black leading-none text-primary/10 select-none absolute inset-0 flex items-center justify-center">
            404
          </div>
          <div className="relative z-10 text-[10rem] font-heading font-black leading-none bg-gradient-to-b from-primary to-secondary bg-clip-text text-transparent">
            404
          </div>
        </div>

        <div className="space-y-3">
          <h1 className="text-2xl font-heading font-bold">Page Not Found</h1>
          <p className="text-muted-foreground text-sm leading-relaxed">
            The page you're looking for doesn't exist or has been moved. Maybe you followed a bad link, or the URL is mistyped.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
          <Link href="/">
            <Button className="bg-primary text-primary-foreground hover:bg-primary/90 glow-primary-hover gap-2 w-full sm:w-auto" data-testid="button-home">
              <Home className="w-4 h-4" /> Go Home
            </Button>
          </Link>
          <Button
            variant="outline"
            className="border-border hover:border-primary/50 gap-2 w-full sm:w-auto"
            onClick={() => window.history.back()}
            data-testid="button-back"
          >
            <ArrowLeft className="w-4 h-4" /> Go Back
          </Button>
        </div>

        <div className="flex flex-wrap justify-center gap-4 text-sm">
          {[
            { href: "/pricing", label: "Pricing" },
            { href: "/how-to-connect", label: "How to Connect" },
            { href: "/faqs", label: "FAQs" },
            { href: "/contact", label: "Contact" },
          ].map(({ href, label }) => (
            <Link key={href} href={href} className="text-muted-foreground hover:text-primary transition-colors">
              {label}
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
