/**
 * Server-only helpers for the live healthcare-place provider
 * (Google Maps Platform, called through the Lovable connector gateway).
 * Credentials never leave the server.
 */
import type { HealthCategory, HealthPlace } from "@/lib/health-places";
import { CATEGORIES } from "@/lib/health-places";
import {
  getHealthcareNeed,
  type HealthcareNeedId,
} from "@/lib/healthcare-needs";

const GATEWAY_URL = "https://connector-gateway.lovable.dev/google_maps";

const PLACE_FIELDS = [
  "id",
  "displayName",
  "formattedAddress",
  "location",
  "rating",
  "userRatingCount",
  "nationalPhoneNumber",
  "internationalPhoneNumber",
  "websiteUri",
  "primaryTypeDisplayName",
  "types",
  "currentOpeningHours.openNow",
  "regularOpeningHours.weekdayDescriptions",
];

export function getCredentials():
  | { lovableKey: string; connectionKey: string }
  | null {
  const lovableKey = process.env["LOVABLE_API_KEY"];
  const connectionKey =
    process.env["GOOGLE_MAPS_API_KEY"] ?? process.env["GOOGLE_MAPS_API_KEY_2"];
  if (!lovableKey || !connectionKey) return null;
  return { lovableKey, connectionKey };
}

export function isLiveConfigured(): boolean {
  return getCredentials() !== null;
}

function authHeaders(creds: { lovableKey: string; connectionKey: string }) {
  return {
    Authorization: `Bearer ${creds.lovableKey}`,
    "X-Connection-Api-Key": creds.connectionKey,
  };
}

async function readError(response: Response, label: string): Promise<never> {
  const body = await response.text();
  console.error(`${label} failed [${response.status}]: ${body}`);
  if (response.status === 403) {
    throw new Error(
      "Map data request was denied. Check the Google Maps key restrictions.",
    );
  }
  throw new Error(`Map data request failed [${response.status}]`);
}

interface RawPlace {
  id?: string;
  displayName?: { text?: string };
  formattedAddress?: string;
  location?: { latitude?: number; longitude?: number };
  rating?: number;
  userRatingCount?: number;
  nationalPhoneNumber?: string;
  internationalPhoneNumber?: string;
  websiteUri?: string;
  primaryTypeDisplayName?: { text?: string };
  types?: string[];
  currentOpeningHours?: { openNow?: boolean };
  regularOpeningHours?: { weekdayDescriptions?: string[] };
}

function verifiedServicesFromTypes(
  types: string[],
): HealthcareNeedId[] {
  const services = new Set<HealthcareNeedId>();
  const exactTypeServices: Record<string, HealthcareNeedId> = {
    doctor: "general_consultation",
    medical_clinic: "general_consultation",
    medical_center: "general_consultation",
    medical_lab: "laboratory_tests",
    maternity_hospital: "maternity_care",
    obstetrician_gynecologist: "maternity_care",
    pediatrician: "child_healthcare",
    childrens_hospital: "child_healthcare",
    pharmacy: "pharmacy",
    radiologist: "imaging",
    imaging_center: "imaging",
    emergency_room: "emergency_care",
  };
  for (const type of types) {
    const service = exactTypeServices[type];
    if (service) services.add(service);
  }
  return [...services];
}

function categoryOf(raw: RawPlace): HealthPlace["category"] {
  const types = raw.types ?? [];
  if (types.includes("pharmacy") || types.includes("drugstore"))
    return "pharmacy";
  if (types.includes("hospital")) return "hospital";
  if (types.includes("medical_lab")) return "lab";
  const name = (raw.displayName?.text ?? "").toLowerCase();
  if (name.includes("matern") || name.includes("women")) return "maternity";
  if (name.includes("laborator") || name.includes("diagnost")) return "lab";
  if (name.includes("hospital")) return "hospital";
  return "clinic";
}

function toHealthPlace(raw: RawPlace): HealthPlace | null {
  if (!raw.id || !raw.location?.latitude || !raw.location?.longitude)
    return null;
  const place: HealthPlace = {
    id: `live_${raw.id}`,
    source: "live",
    name: raw.displayName?.text ?? "Unnamed facility",
    typeLabel: raw.primaryTypeDisplayName?.text ?? "Healthcare facility",
    category: categoryOf(raw),
    latitude: raw.location.latitude,
    longitude: raw.location.longitude,
  };
  const verifiedServices = verifiedServicesFromTypes(raw.types ?? []);
  if (verifiedServices.length > 0) place.verifiedServices = verifiedServices;
  if (raw.formattedAddress) place.address = raw.formattedAddress;
  if (typeof raw.rating === "number") place.rating = raw.rating;
  if (typeof raw.userRatingCount === "number")
    place.ratingCount = raw.userRatingCount;
  const phone = raw.nationalPhoneNumber ?? raw.internationalPhoneNumber;
  if (phone) place.phone = phone;
  if (raw.websiteUri) place.website = raw.websiteUri;
  if (typeof raw.currentOpeningHours?.openNow === "boolean")
    place.openNow = raw.currentOpeningHours.openNow;
  const hours = raw.regularOpeningHours?.weekdayDescriptions;
  if (hours?.length) place.hours = hours;
  return place;
}

export async function searchLivePlaces(input: {
  latitude: number;
  longitude: number;
  category: HealthCategory;
  query?: string;
  radiusMeters?: number;
  need?: HealthcareNeedId;
}): Promise<HealthPlace[]> {
  const creds = getCredentials();
  if (!creds) return [];
  const term =
    CATEGORIES.find((c) => c.id === input.category)?.term ??
    "healthcare facility";
  const need = getHealthcareNeed(input.need);
  const serviceTerm = need?.searchTerm ?? term;
  const textQuery = input.query?.trim()
    ? `${input.query.trim()} ${serviceTerm}`
    : serviceTerm;

  const response = await fetch(`${GATEWAY_URL}/places/v1/places:searchText`, {
    method: "POST",
    headers: {
      ...authHeaders(creds),
      "Content-Type": "application/json",
      "X-Goog-FieldMask": PLACE_FIELDS.map((f) => `places.${f}`).join(","),
    },
    body: JSON.stringify({
      textQuery,
      maxResultCount: 20,
      locationBias: {
        circle: {
          center: { latitude: input.latitude, longitude: input.longitude },
          radius: Math.min(input.radiusMeters ?? 20000, 50000),
        },
      },
    }),
  });

  if (!response.ok) await readError(response, "Places text search");
  const data = (await response.json()) as { places?: RawPlace[] };
  const places = (data.places ?? [])
    .map(toHealthPlace)
    .filter((p): p is HealthPlace => p !== null);
  if (!input.need) return places;
  return places.filter((place) =>
    place.verifiedServices?.includes(input.need as HealthcareNeedId),
  );
}

export async function fetchLivePlaceDetails(
  providerId: string,
): Promise<HealthPlace | null> {
  const creds = getCredentials();
  if (!creds) return null;
  const response = await fetch(
    `${GATEWAY_URL}/places/v1/places/${encodeURIComponent(providerId)}`,
    {
      headers: {
        ...authHeaders(creds),
        "X-Goog-FieldMask": PLACE_FIELDS.join(","),
      },
    },
  );
  if (response.status === 404) return null;
  if (!response.ok) await readError(response, "Place details");
  return toHealthPlace((await response.json()) as RawPlace);
}

export interface GeocodedPlace {
  label: string;
  countryCode?: string;
  latitude: number;
  longitude: number;
}

interface RawGeocodeResult {
  formatted_address?: string;
  address_components?: { short_name?: string; types?: string[] }[];
  geometry?: { location?: { lat?: number; lng?: number } };
}

function toGeocoded(result: RawGeocodeResult): GeocodedPlace | null {
  const lat = result.geometry?.location?.lat;
  const lng = result.geometry?.location?.lng;
  if (typeof lat !== "number" || typeof lng !== "number") return null;
  const country = result.address_components?.find((c) =>
    c.types?.includes("country"),
  )?.short_name;
  const place: GeocodedPlace = {
    label: result.formatted_address ?? "Selected location",
    latitude: lat,
    longitude: lng,
  };
  if (country) place.countryCode = country;
  return place;
}

async function geocode(params: URLSearchParams): Promise<GeocodedPlace[]> {
  const creds = getCredentials();
  if (!creds) return [];
  const response = await fetch(
    `${GATEWAY_URL}/maps/api/geocode/json?${params.toString()}`,
    { headers: authHeaders(creds) },
  );
  if (!response.ok) await readError(response, "Geocoding");
  const data = (await response.json()) as { results?: RawGeocodeResult[] };
  return (data.results ?? [])
    .map(toGeocoded)
    .filter((r): r is GeocodedPlace => r !== null)
    .slice(0, 6);
}

export function reverseGeocode(latitude: number, longitude: number) {
  return geocode(new URLSearchParams({ latlng: `${latitude},${longitude}` }));
}

export function forwardGeocode(address: string) {
  return geocode(new URLSearchParams({ address }));
}
