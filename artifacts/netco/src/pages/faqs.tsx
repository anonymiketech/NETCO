import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { HelpCircle } from "lucide-react";

const FAQS = [
  {
    category: "Getting Started",
    items: [
      { q: "What is NETCO?", a: "NETCO is a premium VPN internet config provider for Kenya. We sell device-locked VPN configurations for HTTP Custom and HTTP Injector apps, enabling fast and unrestricted internet access on Safaricom, Airtel, and Telkom networks." },
      { q: "How does NETCO work?", a: "NETCO provides custom config files that route your internet traffic through our optimized servers. Once you load the config in HTTP Custom or HTTP Injector, all your traffic is encrypted and bypasses network throttling." },
      { q: "Which apps do I need?", a: "You need either HTTP Custom (Google Play: 'HTTP Custom') or HTTP Injector (Google Play: 'HTTP Injector'). Both are free. HTTP Custom uses .hc config files; HTTP Injector uses .ehi config files." },
    ],
  },
  {
    category: "Device ID & Setup",
    items: [
      { q: "How do I find my Device ID in HTTP Custom?", a: "Open HTTP Custom → tap the three-line menu → tap 'Device ID'. Copy the full alphanumeric string shown. This is what you paste when ordering your config." },
      { q: "How do I find my HWID in HTTP Injector?", a: "Open HTTP Injector → go to Config tab → tap Export or the info icon. Your HWID appears at the top of the exported file, or you can find it in the app's About/Device section." },
      { q: "What happens if I reset my phone or get a new phone?", a: "Your config is locked to your original Device ID/HWID. If your device changes (factory reset or new phone), your Device ID will change and the config will no longer work. You will need to purchase a new config. Contact support if you have an active plan and need assistance." },
    ],
  },
  {
    category: "Payment & Delivery",
    items: [
      { q: "What payment methods do you accept?", a: "We currently accept M-Pesa only. We use STK Push — you enter your phone number and we send a prompt directly to your phone for PIN entry. No need to send money manually." },
      { q: "How long does it take to receive my config?", a: "Delivery is instant. Once M-Pesa confirms your payment (usually within 30 seconds), your config is processed automatically and ready for download." },
      { q: "I paid but didn't receive my config. What do I do?", a: "Contact our support team on WhatsApp with your M-Pesa transaction code and the phone number or Device ID you used at checkout. We resolve all delivery issues within 1 hour, 24/7." },
    ],
  },
  {
    category: "Plans & Usage",
    items: [
      { q: "Can I share my config with someone else?", a: "No. All configs are device-locked to your specific Device ID or HWID. If you load it on a different device, it will not work. Sharing is not possible by design." },
      { q: "What speeds can I expect?", a: "Speeds depend on your chosen plan and your current network coverage. Basic plans deliver up to 5 Mbps, Pro plans up to 20 Mbps, and Ultra plans up to 50 Mbps. Real-world speeds may vary based on your location and network load." },
      { q: "Will I get a reminder before my plan expires?", a: "We recommend noting your expiry date. You can check your plan status anytime on the Dashboard or Check Expiry page using your phone number or Device ID." },
      { q: "Can I use NETCO for WiFi installation?", a: "Yes. We offer home WiFi installation packages for Safaricom, Airtel, and Telkom. These are monthly plans that include router setup and installation. Contact us to arrange a site visit." },
      { q: "Is using a VPN config legal in Kenya?", a: "Yes. VPN use is legal in Kenya. NETCO configs encrypt your traffic and improve your privacy. We comply with all applicable laws and do not condone illegal activities on our network." },
    ],
  },
];

export default function FAQs() {
  return (
    <div className="min-h-screen pt-24 pb-20 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-primary/30 bg-primary/5 text-primary text-sm font-medium mb-4">
            <HelpCircle className="w-4 h-4" />
            <span>Got Questions?</span>
          </div>
          <h1 className="text-4xl md:text-5xl font-heading font-bold mb-4">
            Frequently Asked{" "}
            <span className="bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">Questions</span>
          </h1>
          <p className="text-muted-foreground text-lg">Everything you need to know about NETCO VPN configs.</p>
        </div>

        <div className="space-y-10">
          {FAQS.map((section) => (
            <div key={section.category}>
              <h2 className="text-lg font-heading font-bold text-secondary mb-4 flex items-center gap-2">
                <span className="w-1 h-5 bg-secondary rounded-full inline-block" />
                {section.category}
              </h2>
              <Accordion type="single" collapsible className="space-y-2">
                {section.items.map((faq, i) => (
                  <AccordionItem
                    key={i}
                    value={`${section.category}-${i}`}
                    className="glass-card rounded-lg border-border px-4"
                    data-testid={`faq-item-${section.category}-${i}`}
                  >
                    <AccordionTrigger className="text-left font-medium hover:text-primary hover:no-underline py-4 text-sm sm:text-base">
                      {faq.q}
                    </AccordionTrigger>
                    <AccordionContent className="text-muted-foreground pb-4 text-sm leading-relaxed">
                      {faq.a}
                    </AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            </div>
          ))}
        </div>

        <div className="mt-12 glass-card rounded-xl p-6 text-center border-primary/20 bg-primary/5">
          <h3 className="font-heading font-bold text-xl mb-2">Still have questions?</h3>
          <p className="text-muted-foreground mb-4 text-sm">Our support team is available 24/7 on WhatsApp and Telegram.</p>
          <a href="https://wa.me/254700000000" target="_blank" rel="noopener noreferrer">
            <button className="bg-primary text-primary-foreground px-6 py-2.5 rounded-md font-medium text-sm hover:bg-primary/90 transition-colors" data-testid="button-whatsapp-support">
              Chat on WhatsApp
            </button>
          </a>
        </div>
      </div>
    </div>
  );
}
