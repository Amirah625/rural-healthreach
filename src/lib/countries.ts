/**
 * Country configuration for RuralReach Health.
 * Nothing country-specific should be hardcoded in UI components — add a new
 * entry here to support another country.
 */

export interface EmergencyContact {
  label: string;
  number: string;
}

export interface QuickPlace {
  /** Human readable "Area, Region" */
  label: string;
  latitude: number;
  longitude: number;
}

export interface CountryConfig {
  /** ISO 3166-1 alpha-2 */
  code: string;
  name: string;
  currency: string;
  languages: string[];
  /** Simulated USSD short code used by the prototype only */
  ussdCode: string;
  emergency: EmergencyContact[];
  quickPlaces: QuickPlace[];
}

export const COUNTRIES: CountryConfig[] = [
  {
    code: "NG",
    name: "Nigeria",
    currency: "NGN",
    languages: ["English", "Hausa", "Igbo", "Yoruba"],
    ussdCode: "*384#",
    emergency: [
      { label: "National emergency", number: "112" },
      { label: "Police", number: "199" },
    ],
    quickPlaces: [
      { label: "Oye, Ekiti", latitude: 7.8021, longitude: 5.3312 },
      { label: "Ado Ekiti, Ekiti", latitude: 7.6233, longitude: 5.2214 },
      { label: "Ibadan, Oyo", latitude: 7.3775, longitude: 3.947 },
      { label: "Abuja, FCT", latitude: 9.0765, longitude: 7.3986 },
      { label: "Lagos, Lagos", latitude: 6.5244, longitude: 3.3792 },
    ],
  },
  {
    code: "GH",
    name: "Ghana",
    currency: "GHS",
    languages: ["English", "Twi", "Ewe", "Ga"],
    ussdCode: "*384#",
    emergency: [
      { label: "National emergency", number: "112" },
      { label: "Ambulance", number: "193" },
    ],
    quickPlaces: [
      { label: "Kumasi, Ashanti", latitude: 6.6885, longitude: -1.6244 },
      { label: "Accra, Greater Accra", latitude: 5.6037, longitude: -0.187 },
      { label: "Tamale, Northern", latitude: 9.4008, longitude: -0.8393 },
    ],
  },
  {
    code: "KE",
    name: "Kenya",
    currency: "KES",
    languages: ["English", "Swahili"],
    ussdCode: "*384#",
    emergency: [{ label: "National emergency", number: "999" }],
    quickPlaces: [
      { label: "Nairobi, Nairobi County", latitude: -1.2921, longitude: 36.8219 },
      { label: "Kisumu, Kisumu County", latitude: -0.0917, longitude: 34.768 },
    ],
  },
  {
    code: "UG",
    name: "Uganda",
    currency: "UGX",
    languages: ["English", "Luganda", "Swahili"],
    ussdCode: "*384#",
    emergency: [{ label: "National emergency", number: "999" }],
    quickPlaces: [
      { label: "Kampala, Central", latitude: 0.3476, longitude: 32.5825 },
      { label: "Gulu, Northern", latitude: 2.7724, longitude: 32.2881 },
    ],
  },
];

export const DEFAULT_COUNTRY_CODE = "NG";

export function getCountry(code?: string | null): CountryConfig | undefined {
  if (!code) return undefined;
  return COUNTRIES.find((c) => c.code === code.toUpperCase());
}

export function getCountryOrDefault(code?: string | null): CountryConfig {
  return getCountry(code) ?? COUNTRIES[0]!;
}
