import { useQuery } from "@tanstack/react-query";

import { demoPlaces } from "@/data/demo-places";
import {
  distanceKm,
  type HealthCategory,
  type HealthPlace,
} from "@/lib/health-places";
import { demoKeyFor, useLocation } from "@/lib/location/LocationProvider";
import { searchFacilities } from "@/lib/places.functions";

export interface FacilityResults {
  places: HealthPlace[];
  /** true when the list comes from the live map-data provider */
  live: boolean;
}

function withDistance(
  places: HealthPlace[],
  from: { latitude: number; longitude: number },
): HealthPlace[] {
  return places
    .map((p) => ({ ...p, distanceKm: distanceKm(from, p) }))
    .sort((a, b) => (a.distanceKm ?? 0) - (b.distanceKm ?? 0));
}

function demoResults(
  demoKey: string,
  origin: { latitude: number; longitude: number },
  category: HealthCategory,
  query: string,
): FacilityResults {
  const term = query.trim().toLowerCase();
  const list = (demoPlaces[demoKey] ?? []).filter((p) => {
    if (category !== "all" && p.category !== category) return false;
    if (term && !`${p.name} ${p.typeLabel}`.toLowerCase().includes(term))
      return false;
    return true;
  });
  return { places: withDistance(list, origin), live: false };
}

export function useFacilitySearch(category: HealthCategory, query: string) {
  const { location } = useLocation();

  return useQuery<FacilityResults>({
    queryKey: [
      "facilities",
      location?.latitude,
      location?.longitude,
      location?.mode,
      category,
      query.trim(),
    ],
    enabled: Boolean(location),
    staleTime: 60_000,
    queryFn: async () => {
      const loc = location!;
      const demoKey = demoKeyFor(loc);
      if (loc.mode === "demo") {
        return demoResults(demoKey, loc, category, query);
      }
      const result = await searchFacilities({
        data: {
          latitude: loc.latitude,
          longitude: loc.longitude,
          category,
          ...(query.trim() ? { query: query.trim() } : {}),
        },
      });
      if (!result.live) return demoResults(demoKey, loc, category, query);
      return { places: withDistance(result.places, loc), live: true };
    },
  });
}
