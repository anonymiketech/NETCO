import { Router } from "express";

const router = Router();

const NETWORKS = [
  {
    id: "safaricom",
    name: "Safaricom",
    color: "#00B300",
    categories: [
      {
        id: "unlimited",
        name: "Unlimited VPN",
        plans: [
          {
            id: "saf-unl-basic",
            name: "Safaricom Basic Unlimited",
            speed: "Up to 5 Mbps",
            description: "Great for browsing and social media",
            dailyPrice: 50,
            weeklyPrice: 200,
            monthlyPrice: 600,
            dailyLabel: "1 Day",
            weeklyLabel: "7 Days",
            monthlyLabel: "30 Days",
            popular: false,
            features: ["Unlimited data", "5 Mbps speed", "1 device", "HTTP Custom & Injector", "24/7 support"],
          },
          {
            id: "saf-unl-pro",
            name: "Safaricom Pro Unlimited",
            speed: "Up to 20 Mbps",
            description: "Best for streaming and downloads",
            dailyPrice: 80,
            weeklyPrice: 350,
            monthlyPrice: 1000,
            dailyLabel: "1 Day",
            weeklyLabel: "7 Days",
            monthlyLabel: "30 Days",
            popular: true,
            features: ["Unlimited data", "20 Mbps speed", "1 device (locked)", "HTTP Custom & Injector", "Priority support", "Auto-renewal"],
          },
          {
            id: "saf-unl-ultra",
            name: "Safaricom Ultra Unlimited",
            speed: "Up to 50 Mbps",
            description: "Maximum speed for power users",
            dailyPrice: 120,
            weeklyPrice: 500,
            monthlyPrice: 1500,
            dailyLabel: "1 Day",
            weeklyLabel: "7 Days",
            monthlyLabel: "30 Days",
            popular: false,
            features: ["Unlimited data", "50 Mbps speed", "1 device (locked)", "HTTP Custom & Injector", "Priority support", "Bypass throttling"],
          },
        ],
      },
      {
        id: "capped",
        name: "Capped / Limited VPN",
        plans: [
          {
            id: "saf-cap-1gb",
            name: "Safaricom 1GB Pack",
            speed: "Up to 20 Mbps",
            description: "Light browsing and messaging",
            dailyPrice: 20,
            weeklyPrice: 80,
            monthlyPrice: 250,
            dailyLabel: "1 Day",
            weeklyLabel: "7 Days",
            monthlyLabel: "30 Days",
            popular: false,
            features: ["1 GB data", "20 Mbps speed", "1 device", "HTTP Custom & Injector"],
          },
          {
            id: "saf-cap-5gb",
            name: "Safaricom 5GB Pack",
            speed: "Up to 20 Mbps",
            description: "Moderate use — social + video calls",
            dailyPrice: 60,
            weeklyPrice: 250,
            monthlyPrice: 700,
            dailyLabel: "1 Day",
            weeklyLabel: "7 Days",
            monthlyLabel: "30 Days",
            popular: true,
            features: ["5 GB data", "20 Mbps speed", "1 device (locked)", "HTTP Custom & Injector", "Rollover on renewal"],
          },
        ],
      },
      {
        id: "wifi",
        name: "WiFi Installation",
        plans: [
          {
            id: "saf-wifi-home",
            name: "Safaricom Home WiFi",
            speed: "Up to 10 Mbps",
            description: "Whole-home coverage via Safaricom",
            dailyPrice: 0,
            weeklyPrice: 0,
            monthlyPrice: 2500,
            dailyLabel: "N/A",
            weeklyLabel: "N/A",
            monthlyLabel: "30 Days",
            popular: false,
            features: ["Unlimited data", "10 Mbps speed", "Router included", "Installation included", "Multiple devices", "24/7 support"],
          },
        ],
      },
    ],
  },
  {
    id: "airtel",
    name: "Airtel",
    color: "#FF0000",
    categories: [
      {
        id: "unlimited",
        name: "Unlimited VPN",
        plans: [
          {
            id: "air-unl-basic",
            name: "Airtel Basic Unlimited",
            speed: "Up to 5 Mbps",
            description: "Affordable unlimited for daily use",
            dailyPrice: 45,
            weeklyPrice: 180,
            monthlyPrice: 550,
            dailyLabel: "1 Day",
            weeklyLabel: "7 Days",
            monthlyLabel: "30 Days",
            popular: false,
            features: ["Unlimited data", "5 Mbps speed", "1 device", "HTTP Custom & Injector"],
          },
          {
            id: "air-unl-pro",
            name: "Airtel Pro Unlimited",
            speed: "Up to 20 Mbps",
            description: "Smooth streaming and gaming",
            dailyPrice: 70,
            weeklyPrice: 300,
            monthlyPrice: 900,
            dailyLabel: "1 Day",
            weeklyLabel: "7 Days",
            monthlyLabel: "30 Days",
            popular: true,
            features: ["Unlimited data", "20 Mbps speed", "1 device (locked)", "HTTP Custom & Injector", "Priority support"],
          },
        ],
      },
      {
        id: "capped",
        name: "Capped / Limited VPN",
        plans: [
          {
            id: "air-cap-2gb",
            name: "Airtel 2GB Pack",
            speed: "Up to 15 Mbps",
            description: "Light usage — social & messaging",
            dailyPrice: 30,
            weeklyPrice: 120,
            monthlyPrice: 380,
            dailyLabel: "1 Day",
            weeklyLabel: "7 Days",
            monthlyLabel: "30 Days",
            popular: false,
            features: ["2 GB data", "15 Mbps speed", "1 device", "HTTP Custom & Injector"],
          },
        ],
      },
      {
        id: "wifi",
        name: "WiFi Installation",
        plans: [
          {
            id: "air-wifi-home",
            name: "Airtel Home WiFi",
            speed: "Up to 8 Mbps",
            description: "Affordable home internet via Airtel",
            dailyPrice: 0,
            weeklyPrice: 0,
            monthlyPrice: 2000,
            dailyLabel: "N/A",
            weeklyLabel: "N/A",
            monthlyLabel: "30 Days",
            popular: false,
            features: ["Unlimited data", "8 Mbps speed", "Router included", "Installation included", "Multiple devices"],
          },
        ],
      },
    ],
  },
  {
    id: "telkom",
    name: "Telkom",
    color: "#0057A8",
    categories: [
      {
        id: "unlimited",
        name: "Unlimited VPN",
        plans: [
          {
            id: "tel-unl-basic",
            name: "Telkom Basic Unlimited",
            speed: "Up to 5 Mbps",
            description: "Budget-friendly unlimited access",
            dailyPrice: 40,
            weeklyPrice: 160,
            monthlyPrice: 500,
            dailyLabel: "1 Day",
            weeklyLabel: "7 Days",
            monthlyLabel: "30 Days",
            popular: false,
            features: ["Unlimited data", "5 Mbps speed", "1 device", "HTTP Custom & Injector"],
          },
          {
            id: "tel-unl-pro",
            name: "Telkom Pro Unlimited",
            speed: "Up to 15 Mbps",
            description: "Reliable speeds for work and entertainment",
            dailyPrice: 60,
            weeklyPrice: 250,
            monthlyPrice: 750,
            dailyLabel: "1 Day",
            weeklyLabel: "7 Days",
            monthlyLabel: "30 Days",
            popular: true,
            features: ["Unlimited data", "15 Mbps speed", "1 device (locked)", "HTTP Custom & Injector", "Priority support"],
          },
        ],
      },
      {
        id: "capped",
        name: "Capped / Limited VPN",
        plans: [
          {
            id: "tel-cap-3gb",
            name: "Telkom 3GB Pack",
            speed: "Up to 15 Mbps",
            description: "Good value for moderate use",
            dailyPrice: 35,
            weeklyPrice: 140,
            monthlyPrice: 430,
            dailyLabel: "1 Day",
            weeklyLabel: "7 Days",
            monthlyLabel: "30 Days",
            popular: false,
            features: ["3 GB data", "15 Mbps speed", "1 device", "HTTP Custom & Injector"],
          },
        ],
      },
      {
        id: "wifi",
        name: "WiFi Installation",
        plans: [
          {
            id: "tel-wifi-home",
            name: "Telkom Home WiFi",
            speed: "Up to 10 Mbps",
            description: "Solid home WiFi via Telkom fiber",
            dailyPrice: 0,
            weeklyPrice: 0,
            monthlyPrice: 1800,
            dailyLabel: "N/A",
            weeklyLabel: "N/A",
            monthlyLabel: "30 Days",
            popular: false,
            features: ["Unlimited data", "10 Mbps speed", "Router included", "Installation included", "Multiple devices"],
          },
        ],
      },
    ],
  },
];

router.get("/", (_req, res) => {
  res.json(NETWORKS);
});

router.get("/:id", (req, res) => {
  for (const network of NETWORKS) {
    for (const category of network.categories) {
      const plan = category.plans.find((p) => p.id === req.params.id);
      if (plan) {
        res.json(plan);
        return;
      }
    }
  }
  res.status(404).json({ error: "Package not found" });
});

export default router;
