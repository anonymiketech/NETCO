import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { useSubmitContact } from "@workspace/api-client-react";
import { useToast } from "@/hooks/use-toast";
import { MessageSquare, Mail, Clock, Send, CheckCircle } from "lucide-react";
import { useState } from "react";

const contactSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Enter a valid email address"),
  phone: z.string().optional(),
  subject: z.string().optional(),
  message: z.string().min(10, "Message must be at least 10 characters"),
});

type ContactForm = z.infer<typeof contactSchema>;

const CONTACT_ITEMS = [
  { icon: MessageSquare, label: "WhatsApp", value: "+254 782 829 321", href: "https://wa.me/254782829321", color: "text-green-400", bg: "bg-green-400/10 border-green-400/20" },
  { icon: MessageSquare, label: "Telegram", value: "@netco", href: "https://t.me/netco", color: "text-blue-400", bg: "bg-blue-400/10 border-blue-400/20" },
  { icon: Mail, label: "Email", value: "netco@anonymiketech.online", href: "mailto:netco@anonymiketech.online", color: "text-primary", bg: "bg-primary/10 border-primary/20" },
  { icon: Clock, label: "Support Hours", value: "24/7 — Always Available", href: null, color: "text-secondary", bg: "bg-secondary/10 border-secondary/20" },
];

export default function Contact() {
  const { toast } = useToast();
  const [submitted, setSubmitted] = useState(false);
  const submitContact = useSubmitContact();

  const form = useForm<ContactForm>({
    resolver: zodResolver(contactSchema),
    defaultValues: { name: "", email: "", phone: "", subject: "", message: "" },
  });

  const onSubmit = async (data: ContactForm) => {
    try {
      await submitContact.mutateAsync({ data });
      setSubmitted(true);
      toast({ title: "Message sent!", description: "We'll get back to you within a few hours." });
    } catch {
      toast({ title: "Failed to send", description: "Please try again or contact us on WhatsApp.", variant: "destructive" });
    }
  };

  return (
    <div className="min-h-screen pt-24 pb-20 px-4">
      <div className="max-w-5xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-heading font-bold mb-4">
            Get in <span className="bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">Touch</span>
          </h1>
          <p className="text-muted-foreground text-lg">We're available 24/7. Pick the channel that works best for you.</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
          {/* Left: Contact info */}
          <div className="space-y-6">
            <h2 className="font-heading font-bold text-xl">Quick Support Channels</h2>
            <div className="space-y-3">
              {CONTACT_ITEMS.map((item) => {
                const Icon = item.icon;
                const content = (
                  <div className={`glass-card rounded-xl p-4 flex items-center gap-4 transition-all hover:border-primary/50 ${item.bg}`} data-testid={`contact-${item.label.toLowerCase()}`}>
                    <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${item.bg}`}>
                      <Icon className={`w-5 h-5 ${item.color}`} />
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground">{item.label}</p>
                      <p className={`font-medium text-sm ${item.color}`}>{item.value}</p>
                    </div>
                  </div>
                );
                return item.href ? (
                  <a key={item.label} href={item.href} target="_blank" rel="noopener noreferrer">{content}</a>
                ) : (
                  <div key={item.label}>{content}</div>
                );
              })}
            </div>

            <div className="glass-card rounded-xl p-5 border-primary/20 bg-primary/5">
              <h3 className="font-heading font-bold mb-2 text-sm">Fastest Resolution</h3>
              <p className="text-muted-foreground text-sm">For payment issues, send your M-Pesa transaction code and phone number to our WhatsApp. We resolve most issues in under 30 minutes.</p>
            </div>
          </div>

          {/* Right: Contact form */}
          <div className="glass-card rounded-xl p-6">
            {submitted ? (
              <div className="flex flex-col items-center justify-center py-12 text-center space-y-4">
                <CheckCircle className="w-16 h-16 text-success" />
                <h3 className="font-heading font-bold text-xl">Message Received!</h3>
                <p className="text-muted-foreground text-sm">We'll get back to you within a few hours. For urgent issues, WhatsApp is faster.</p>
                <Button onClick={() => { setSubmitted(false); form.reset(); }} variant="outline" className="border-border">Send Another</Button>
              </div>
            ) : (
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                  <h2 className="font-heading font-bold text-xl mb-2">Send a Message</h2>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <FormField control={form.control} name="name" render={({ field }) => (
                      <FormItem>
                        <FormLabel>Full Name</FormLabel>
                        <FormControl>
                          <Input placeholder="John Mwangi" {...field} className="bg-card border-border focus:border-primary h-11" data-testid="input-name" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )} />
                    <FormField control={form.control} name="email" render={({ field }) => (
                      <FormItem>
                        <FormLabel>Email Address</FormLabel>
                        <FormControl>
                          <Input type="email" placeholder="john@example.com" {...field} className="bg-card border-border focus:border-primary h-11" data-testid="input-email" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )} />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <FormField control={form.control} name="phone" render={({ field }) => (
                      <FormItem>
                        <FormLabel>Phone (Optional)</FormLabel>
                        <FormControl>
                          <Input type="tel" placeholder="0712345678" {...field} className="bg-card border-border focus:border-primary h-11" data-testid="input-phone" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )} />
                    <FormField control={form.control} name="subject" render={({ field }) => (
                      <FormItem>
                        <FormLabel>Subject (Optional)</FormLabel>
                        <FormControl>
                          <Input placeholder="e.g. Payment issue" {...field} className="bg-card border-border focus:border-primary h-11" data-testid="input-subject" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )} />
                  </div>

                  <FormField control={form.control} name="message" render={({ field }) => (
                    <FormItem>
                      <FormLabel>Message</FormLabel>
                      <FormControl>
                        <Textarea placeholder="Describe your issue or question..." rows={5} {...field} className="bg-card border-border focus:border-primary resize-none" data-testid="textarea-message" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )} />

                  <Button type="submit" disabled={submitContact.isPending} className="w-full bg-primary text-primary-foreground hover:bg-primary/90 glow-primary-hover h-11" data-testid="button-submit">
                    {submitContact.isPending ? "Sending..." : <><Send className="w-4 h-4 mr-2" /> Send Message</>}
                  </Button>
                </form>
              </Form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
