/**
 * Shared (browser-safe) healthcare place model.
 * Every place comes from the live map-data provider — the app never invents
 * facility information. Missing fields stay undefined and the UI says so.
 */

import type { HealthcareNeedId } from "@/lib/healthcare-needs";

export type PlaceSource = "live";

export type HealthCategory =
  | "all"
  | "hospital"
  | "clinic"
  | "pharmacy"
  | "lab"
  | "maternity";

export interface HealthPlace {
  /** Prefixed id: "live_<providerId>" */
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
  /** Services explicitly represented by the provider's place types. */
  verifiedServices?: HealthcareNeedId[];
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

export const MAP_DATA_NOTE =
  "Facility information comes from live map data. Fields that are not published by the facility are shown as unavailable.";

export const NOT_CONFIGURED_NOTE =
  "Healthcare search is not configured yet. The map data provider needs to be connected before facilities can be shown.";

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
  const params = new URLSearchParams({
    api: "1",
    destination: `${place.latitude},${place.longitude}`,
  });
  if (place.id.startsWith("live_")) {
    params.set("destination_place_id", place.id.slice(5));
  }
  return `https://www.google.com/maps/dir/?${params.toString()}`;
}

export function telHref(phone: string): string {
  return `tel:${phone.replace(/[^\d+]/g, "")}`;
}
