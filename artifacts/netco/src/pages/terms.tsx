import { Link } from "wouter";
import { FileText } from "lucide-react";

const SECTIONS = [
  {
    title: "1. Acceptance of Terms",
    content: `By accessing and using NETCO VPN services ("Service"), you agree to be bound by these Terms of Service. If you do not agree to these terms, you may not use the Service. We reserve the right to modify these terms at any time, and your continued use of the Service constitutes acceptance of any changes.`,
  },
  {
    title: "2. Service Description",
    content: `NETCO provides device-locked VPN configuration files for use with HTTP Custom and HTTP Injector applications on Safaricom, Airtel, and Telkom Kenya networks. All configs are sold as-is and are bound to the specific Device ID or HWID provided at the time of purchase.`,
  },
  {
    title: "3. Device Locking Policy",
    content: `All VPN configurations purchased through NETCO are permanently locked to the device specified at checkout. Configs may not be transferred to another device. If your device is reset, replaced, or its identifier changes, your config will cease to function. NETCO is not liable for config failure resulting from device changes. To use the service on a new device, a new config must be purchased.`,
  },
  {
    title: "4. Payment Terms",
    content: `All payments are processed via M-Pesa. All sales are final — no refunds are issued except in cases where a config fails to activate due to a verified error on our end. If you experience a payment issue, contact support within 24 hours with your M-Pesa transaction code. NETCO reserves the right to change pricing at any time without prior notice.`,
  },
  {
    title: "5. Acceptable Use",
    content: `You agree to use the Service only for lawful purposes. You may not use NETCO configs to: (a) access or distribute illegal content; (b) conduct denial-of-service attacks; (c) engage in hacking, phishing, or fraudulent activities; (d) violate any applicable local, national, or international law. Violation of this section may result in immediate termination of your service without refund.`,
  },
  {
    title: "6. No Sharing or Resale",
    content: `Configs are issued for single-device personal use only. You may not share, sublicense, rent, or resell any config issued to you. Detected sharing or commercial redistribution of NETCO configs will result in immediate deactivation without refund and may result in legal action.`,
  },
  {
    title: "7. Service Availability",
    content: `NETCO aims for 99.9% uptime but does not guarantee uninterrupted service. Maintenance windows, network outages, or carrier-side restrictions may temporarily affect connectivity. NETCO is not liable for losses arising from service interruptions. We will communicate scheduled maintenance where possible.`,
  },
  {
    title: "8. Privacy",
    content: `We collect your phone number and Device ID solely for the purpose of delivering and managing your config. We do not sell or share your personal data with third parties. Payment data is processed entirely through Safaricom M-Pesa and is not stored on our servers. By using the Service, you consent to this data collection as described.`,
  },
  {
    title: "9. Limitation of Liability",
    content: `To the maximum extent permitted by law, NETCO and its operators shall not be liable for any indirect, incidental, special, or consequential damages arising from the use or inability to use the Service. Our total liability to you shall not exceed the amount you paid for the specific config in question.`,
  },
  {
    title: "10. Governing Law",
    content: `These Terms are governed by the laws of Kenya. Any disputes shall be resolved in the courts of Nairobi, Kenya. If any provision of these Terms is found to be unenforceable, the remaining provisions shall remain in full force and effect.`,
  },
  {
    title: "11. Contact",
    content: `For questions about these Terms, contact us at support@netco.co.ke or on WhatsApp at +254 700 000 000.`,
  },
];

export default function Terms() {
  return (
    <div className="min-h-screen pt-24 pb-20 px-4">
      <div className="max-w-3xl mx-auto space-y-8">
        <div className="text-center">
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-primary/10 border border-primary/30 mb-4">
            <FileText className="w-6 h-6 text-primary" />
          </div>
          <h1 className="text-4xl font-heading font-bold mb-2">
            Terms of <span className="bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">Service</span>
          </h1>
          <p className="text-muted-foreground text-sm">Last updated: May 2026</p>
        </div>

        <div className="glass-card rounded-xl p-6 border-primary/20 bg-primary/5 text-sm text-muted-foreground">
          Please read these Terms of Service carefully before using NETCO VPN. By purchasing or using any NETCO config, you agree to be bound by these terms.
        </div>

        <div className="space-y-6">
          {SECTIONS.map((s) => (
            <div key={s.title} className="glass-card rounded-xl p-6 space-y-3" data-testid={`section-${s.title.split(".")[0]}`}>
              <h2 className="font-heading font-bold text-base text-foreground">{s.title}</h2>
              <p className="text-muted-foreground text-sm leading-relaxed">{s.content}</p>
            </div>
          ))}
        </div>

        <div className="text-center space-y-4 pt-4">
          <p className="text-sm text-muted-foreground">Have questions about our terms?</p>
          <Link href="/contact">
            <button className="text-primary hover:underline text-sm font-medium" data-testid="link-contact-terms">Contact Support →</button>
          </Link>
        </div>
      </div>
    </div>
  );
}
