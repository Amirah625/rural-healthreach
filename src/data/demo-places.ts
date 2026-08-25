/**
 * Demo Mode dataset — used ONLY when live map data is unavailable or when the
 * user explicitly picks a demo location. Never mixed with live results.
 */
import type { HealthPlace } from "@/lib/health-places";

export interface DemoLocation {
  id: string;
  label: string;
  countryCode: string;
  latitude: number;
  longitude: number;
}

export const DEMO_LOCATIONS: DemoLocation[] = [
  {
    id: "oye-ekiti",
    label: "Oye Ekiti, Nigeria",
    countryCode: "NG",
    latitude: 7.8021,
    longitude: 5.3312,
  },
  {
    id: "kumasi",
    label: "Kumasi, Ghana",
    countryCode: "GH",
    latitude: 6.6885,
    longitude: -1.6244,
  },
];

export const demoPlaces: Record<string, HealthPlace[]> = {
  "oye-ekiti": [
    {
      id: "demo_oye-general",
      source: "demo",
      name: "Oye General Hospital",
      typeLabel: "Hospital",
      category: "hospital",
      address: "Hospital Road, Oye Ekiti, Nigeria",
      latitude: 7.8021,
      longitude: 5.3312,
      openNow: true,
      hoursSummary: "24/7 service",
      hours: ["Monday – Sunday: Open 24 hours"],
      phone: "+234 800 000 0101",
      rating: 4.6,
      ratingCount: 128,
    },
    {
      id: "demo_ireopudun",
      source: "demo",
      name: "Ireopudun Health Center",
      typeLabel: "Health centre",
      category: "clinic",
      address: "Ireopudun Street, Oye Ekiti, Nigeria",
      latitude: 7.8104,
      longitude: 5.3402,
      openNow: true,
      hoursSummary: "Mon – Sat: 8am – 6pm",
      phone: "+234 800 000 0102",
      rating: 4.2,
      ratingCount: 41,
    },
    {
      id: "demo_oye-primary",
      source: "demo",
      name: "Oye Primary Healthcare",
      typeLabel: "Primary healthcare",
      category: "clinic",
      address: "Isan Road, Oye Ekiti, Nigeria",
      latitude: 7.7936,
      longitude: 5.3199,
      openNow: false,
      hoursSummary: "Mon – Fri: 8am – 4pm",
      phone: "+234 800 000 0103",
    },
    {
      id: "demo_itapaji-maternity",
      source: "demo",
      name: "Itapaji Maternity Home",
      typeLabel: "Maternity home",
      category: "maternity",
      address: "Itapaji Road, Oye Ekiti, Nigeria",
      latitude: 7.7802,
      longitude: 5.3648,
      openNow: true,
      hoursSummary: "24/7 service",
      phone: "+234 800 000 0105",
    },
    {
      id: "demo_ilupeju-pharmacy",
      source: "demo",
      name: "Ilupeju Community Pharmacy",
      typeLabel: "Pharmacy",
      category: "pharmacy",
      address: "Market Square, Oye Ekiti, Nigeria",
      latitude: 7.8087,
      longitude: 5.3111,
      openNow: true,
      hoursSummary: "Mon – Sun: 8am – 9pm",
      phone: "+234 800 000 0106",
    },
    {
      id: "demo_oye-diagnostics",
      source: "demo",
      name: "Oye Diagnostics Laboratory",
      typeLabel: "Medical laboratory",
      category: "lab",
      address: "Ilupeju Road, Oye Ekiti, Nigeria",
      latitude: 7.8155,
      longitude: 5.3255,
      openNow: false,
      hoursSummary: "Mon – Sat: 8am – 5pm",
    },
    {
      id: "demo_ikole-referral",
      source: "demo",
      name: "Ikole Referral Hospital",
      typeLabel: "Hospital",
      category: "hospital",
      address: "Ikole Ekiti, Nigeria",
      latitude: 7.7991,
      longitude: 5.3855,
      openNow: true,
      hoursSummary: "24/7 service",
      phone: "+234 800 000 0107",
      rating: 4.1,
      ratingCount: 76,
    },
  ],
  kumasi: [
    {
      id: "demo_komfo-anokye",
      source: "demo",
      name: "Komfo Anokye Teaching Hospital",
      typeLabel: "Teaching hospital",
      category: "hospital",
      address: "Okomfo Anokye Road, Kumasi, Ghana",
      latitude: 6.6971,
      longitude: -1.6303,
      openNow: true,
      hoursSummary: "24/7 service",
      phone: "+233 30 000 0101",
      rating: 4.3,
      ratingCount: 210,
    },
    {
      id: "demo_suntreso",
      source: "demo",
      name: "Suntreso Government Hospital",
      typeLabel: "Government hospital",
      category: "hospital",
      address: "Suntreso, Kumasi, Ghana",
      latitude: 6.7025,
      longitude: -1.6415,
      openNow: true,
      hoursSummary: "24/7 service",
      phone: "+233 30 000 0102",
    },
    {
      id: "demo_asafo-clinic",
      source: "demo",
      name: "Asafo Community Clinic",
      typeLabel: "Community clinic",
      category: "clinic",
      address: "Asafo, Kumasi, Ghana",
      latitude: 6.6874,
      longitude: -1.6172,
      openNow: false,
      hoursSummary: "Mon – Fri: 8am – 5pm",
    },
    {
      id: "demo_manhyia-maternity",
      source: "demo",
      name: "Manhyia Maternity Centre",
      typeLabel: "Maternity centre",
      category: "maternity",
      address: "Manhyia, Kumasi, Ghana",
      latitude: 6.7038,
      longitude: -1.6151,
      openNow: true,
      hoursSummary: "24/7 service",
      phone: "+233 30 000 0104",
    },
    {
      id: "demo_adum-pharmacy",
      source: "demo",
      name: "Adum Central Pharmacy",
      typeLabel: "Pharmacy",
      category: "pharmacy",
      address: "Adum, Kumasi, Ghana",
      latitude: 6.6928,
      longitude: -1.6231,
      openNow: true,
      hoursSummary: "Mon – Sun: 7am – 9pm",
    },
    {
      id: "demo_ashanti-labs",
      source: "demo",
      name: "Ashanti Diagnostic Laboratory",
      typeLabel: "Medical laboratory",
      category: "lab",
      address: "Bantama, Kumasi, Ghana",
      latitude: 6.7008,
      longitude: -1.6362,
      openNow: true,
      hoursSummary: "Mon – Sat: 7am – 6pm",
    },
  ],
};

export function findDemoPlace(id: string): HealthPlace | undefined {
  for (const list of Object.values(demoPlaces)) {
    const hit = list.find((p) => p.id === id);
    if (hit) return hit;
  }
  return undefined;
}

/** Nearest demo location to arbitrary coordinates (used for demo fallback). */
export function nearestDemoLocation(
  latitude: number,
  longitude: number,
): DemoLocation {
  let best = DEMO_LOCATIONS[0]!;
  let bestScore = Infinity;
  for (const loc of DEMO_LOCATIONS) {
    const score =
      (loc.latitude - latitude) ** 2 + (loc.longitude - longitude) ** 2;
    if (score < bestScore) {
      bestScore = score;
      best = loc;
    }
  }
  return best;
}
