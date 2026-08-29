import { useQuery } from "@tanstack/react-query";

import {
  distanceKm,
  type HealthCategory,
  type HealthPlace,
} from "@/lib/health-places";
import type { HealthcareNeedId } from "@/lib/healthcare-needs";
import { useLocation } from "@/lib/location/LocationProvider";
import { searchFacilities } from "@/lib/places.functions";

export interface FacilityResults {
  places: HealthPlace[];
  /** false when the map-data provider is not configured on the server */
  configured: boolean;
}

function withDistance(
  places: HealthPlace[],
  from: { latitude: number; longitude: number },
): HealthPlace[] {
  return places
    .map((p) => ({ ...p, distanceKm: distanceKm(from, p) }))
    .sort((a, b) => (a.distanceKm ?? 0) - (b.distanceKm ?? 0));
}

export function useFacilitySearch(
  category: HealthCategory,
  query: string,
  need?: HealthcareNeedId,
  radiusMeters = 20_000,
) {
  const { location } = useLocation();

  return useQuery<FacilityResults>({
    queryKey: [
      "facilities",
      location?.latitude,
      location?.longitude,
      category,
      query.trim(),
      need,
      radiusMeters,
    ],
    enabled: Boolean(location),
    staleTime: 5 * 60_000,
    gcTime: 30 * 60_000,
    queryFn: async () => {
      if (!location) return { places: [], configured: false };
      const loc = location;
      const result = await searchFacilities({
        data: {
          latitude: loc.latitude,
          longitude: loc.longitude,
          category,
          ...(query.trim() ? { query: query.trim() } : {}),
          ...(need ? { need } : {}),
          radiusMeters,
        },
      });
      if (!result.live) return { places: [], configured: false };
      return { places: withDistance(result.places, loc), configured: true };
    },
  });
}
