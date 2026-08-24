/**
 * Demo facility dataset for RuralReach Health V1.
 * Shaped so it can be swapped for a real database query later.
 */

export type FacilityType =
  | "Hospital"
  | "Health Center"
  | "Primary Healthcare"
  | "Clinic"
  | "Pharmacy";

export type Availability = "open" | "closed" | "unknown";

export type CostLevel = "free" | "low" | "moderate";

export interface Facility {
  id: string;
  name: string;
  type: FacilityType;
  distanceKm: number;
  openingHours: string;
  services: string[];
  phone: string;
  latitude: number;
  longitude: number;
  availability: Availability;
  costLevel: CostLevel;
}

export const SERVICES = [
  "General consultation",
  "Maternal care",
  "Child healthcare",
  "Pharmacy",
  "Laboratory",
  "Emergency care",
] as const;

export const FACILITY_TYPES: FacilityType[] = [
  "Hospital",
  "Health Center",
  "Primary Healthcare",
  "Clinic",
  "Pharmacy",
];

export const facilities: Facility[] = [
  {
    id: "oye-general",
    name: "Oye General Hospital",
    type: "Hospital",
    distanceKm: 1.2,
    openingHours: "24/7 Service",
    services: [
      "General consultation",
      "Emergency care",
      "Laboratory",
      "Maternal care",
    ],
    phone: "+234 800 000 0101",
    latitude: 7.8021,
    longitude: 5.3312,
    availability: "open",
    costLevel: "moderate",
  },
  {
    id: "ireopudun",
    name: "Ireopudun Health Center",
    type: "Health Center",
    distanceKm: 2.7,
    openingHours: "Mon - Sat: 8am - 6pm",
    services: ["General consultation", "Child healthcare", "Pharmacy"],
    phone: "+234 800 000 0102",
    latitude: 7.8104,
    longitude: 5.3402,
    availability: "open",
    costLevel: "low",
  },
  {
    id: "oye-primary",
    name: "Oye Primary Healthcare",
    type: "Primary Healthcare",
    distanceKm: 4.3,
    openingHours: "Mon - Fri: 8am - 4pm",
    services: ["General consultation", "Maternal care", "Child healthcare"],
    phone: "+234 800 000 0103",
    latitude: 7.7936,
    longitude: 5.3199,
    availability: "closed",
    costLevel: "free",
  },
  {
    id: "ayegbaju-clinic",
    name: "Ayegbaju Community Clinic",
    type: "Clinic",
    distanceKm: 5.6,
    openingHours: "Mon - Sat: 9am - 5pm",
    services: ["General consultation", "Laboratory"],
    phone: "+234 800 000 0104",
    latitude: 7.8215,
    longitude: 5.3521,
    availability: "open",
    costLevel: "low",
  },
  {
    id: "itapaji-maternity",
    name: "Itapaji Maternity Home",
    type: "Health Center",
    distanceKm: 6.9,
    openingHours: "24/7 Service",
    services: ["Maternal care", "Child healthcare", "Emergency care"],
    phone: "+234 800 000 0105",
    latitude: 7.7802,
    longitude: 5.3648,
    availability: "open",
    costLevel: "moderate",
  },
  {
    id: "ilupeju-pharmacy",
    name: "Ilupeju Community Pharmacy",
    type: "Pharmacy",
    distanceKm: 3.1,
    openingHours: "Mon - Sun: 8am - 9pm",
    services: ["Pharmacy"],
    phone: "+234 800 000 0106",
    latitude: 7.8087,
    longitude: 5.3111,
    availability: "open",
    costLevel: "low",
  },
  {
    id: "ikole-referral",
    name: "Ikole Referral Hospital",
    type: "Hospital",
    distanceKm: 9.4,
    openingHours: "24/7 Service",
    services: [
      "Emergency care",
      "Laboratory",
      "General consultation",
      "Maternal care",
      "Child healthcare",
    ],
    phone: "+234 800 000 0107",
    latitude: 7.7991,
    longitude: 5.3855,
    availability: "open",
    costLevel: "moderate",
  },
  {
    id: "aaye-outreach",
    name: "Aaye Village Outreach Post",
    type: "Primary Healthcare",
    distanceKm: 11.2,
    openingHours: "Tue & Thu: 9am - 3pm",
    services: ["General consultation", "Child healthcare"],
    phone: "+234 800 000 0108",
    latitude: 7.7688,
    longitude: 5.2984,
    availability: "closed",
    costLevel: "free",
  },
];

export function getFacility(id: string): Facility | undefined {
  return facilities.find((facility) => facility.id === id);
}

export const DEMO_DATA_NOTE =
  "Demo facility data — availability should be verified before visiting.";
