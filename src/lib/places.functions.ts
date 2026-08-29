import { createServerFn } from "@tanstack/react-start";

import {
  fetchLivePlaceDetails,
  forwardGeocode,
  isLiveConfigured,
  reverseGeocode,
  searchLivePlaces,
} from "@/lib/places.server";

export const getPlacesStatus = createServerFn({ method: "GET" }).handler(
  async () => ({ live: isLiveConfigured() }),
);

export const searchFacilities = createServerFn({ method: "POST" })
  .inputValidator(
    (input: {
      latitude: number;
      longitude: number;
      category: string;
      query?: string;
      need?: string;
      radiusMeters?: number;
    }) => input,
  )
  .handler(async ({ data }) => {
    if (!isLiveConfigured()) return { live: false as const, places: [] };
    const places = await searchLivePlaces({
      latitude: data.latitude,
      longitude: data.longitude,
      category: data.category as never,
      ...(data.query ? { query: data.query } : {}),
      ...(data.need ? { need: data.need as never } : {}),
      ...(data.radiusMeters ? { radiusMeters: data.radiusMeters } : {}),
    });
    return { live: true as const, places };
  });

export const getFacilityDetails = createServerFn({ method: "POST" })
  .inputValidator((input: { providerId: string }) => input)
  .handler(async ({ data }) => {
    if (!isLiveConfigured()) return { live: false as const, place: null };
    const place = await fetchLivePlaceDetails(data.providerId);
    return { live: true as const, place };
  });

export const lookupCoordinates = createServerFn({ method: "POST" })
  .inputValidator((input: { latitude: number; longitude: number }) => input)
  .handler(async ({ data }) => {
    if (!isLiveConfigured()) return { live: false as const, results: [] };
    const results = await reverseGeocode(data.latitude, data.longitude);
    return { live: true as const, results };
  });

export const searchLocations = createServerFn({ method: "POST" })
  .inputValidator((input: { query: string }) => input)
  .handler(async ({ data }) => {
    if (!isLiveConfigured()) return { live: false as const, results: [] };
    const results = await forwardGeocode(data.query);
    return { live: true as const, results };
  });
