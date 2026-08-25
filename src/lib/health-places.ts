/**
 * Shared (browser-safe) healthcare place model.
 * The same shape is produced by live map-provider results and by demo data,
 * but `source` always says which one it is — the two are never mixed silently.
 */

export type PlaceSource = "live" | "demo";

export type HealthCategory =
  | "all"
  | "hospital"
  | "clinic"
  | "pharmacy"
  | "lab"
  | "maternity";

export interface HealthPlace {
  /** Prefixed id: "live_<providerId>" or "demo_<slug>" */
  id: string;
  source: PlaceSource;
  name: string;
  typeLabel: string;
  category: Exclude<HealthCategory, "all">;
  address?: string;
  latitude: number;
  longitude: number;
  distanceKm?: number;
  openNow?: boolean;
  hours?: string[];
  hoursSummary?: string;
  phone?: string;
  website?: string;
  rating?: number;
  ratingCount?: number;
}

export interface CategoryConfig {
  id: HealthCategory;
  label: string;
  /** Query term sent to the places provider */
  term: string;
}

export const CATEGORIES: CategoryConfig[] = [
  { id: "all", label: "All", term: "healthcare facility" },
  { id: "hospital", label: "Hospitals", term: "hospital" },
  { id: "clinic", label: "Clinics", term: "clinic health centre" },
  { id: "pharmacy", label: "Pharmacies", term: "pharmacy" },
  { id: "lab", label: "Labs", term: "medical laboratory diagnostic centre" },
  { id: "maternity", label: "Maternity", term: "maternity clinic" },
];

export const MAP_DATA_NOTE = "Location information provided by map data";

export const DEMO_MODE_NOTE =
  "Demo Mode — these are illustrative facilities, not live listings.";

export function distanceKm(
  from: { latitude: number; longitude: number },
  to: { latitude: number; longitude: number },
): number {
  const R = 6371;
  const dLat = ((to.latitude - from.latitude) * Math.PI) / 180;
  const dLon = ((to.longitude - from.longitude) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos((from.latitude * Math.PI) / 180) *
      Math.cos((to.latitude * Math.PI) / 180) *
      Math.sin(dLon / 2) ** 2;
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

export function formatDistance(km?: number): string | undefined {
  if (km === undefined || Number.isNaN(km)) return undefined;
  return km < 1 ? `${Math.round(km * 1000)} m away` : `${km.toFixed(1)} km away`;
}

export function directionsUrl(place: HealthPlace): string {
  const destination = encodeURIComponent(
    place.address ? `${place.name}, ${place.address}` : place.name,
  );
  return `https://www.google.com/maps/dir/?api=1&destination=${destination}&destination_place_id=`.replace(
    /&destination_place_id=$/,
    place.source === "live" && place.id.startsWith("live_")
      ? `&destination_place_id=${encodeURIComponent(place.id.slice(5))}`
      : `&destination=${place.latitude},${place.longitude}`,
  );
}

export function telHref(phone: string): string {
  return `tel:${phone.replace(/[^\d+]/g, "")}`;
}
