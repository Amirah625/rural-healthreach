import { createFileRoute, Link } from "@tanstack/react-router";
import { Info, MapPin, Navigation, Crosshair } from "lucide-react";
import { useMemo, useState } from "react";

import { AppShell } from "@/components/layout/AppShell";
import { LocationBar } from "@/components/location/LocationBar";
import {
  DEMO_MODE_NOTE,
  MAP_DATA_NOTE,
  directionsUrl,
  formatDistance,
  type HealthPlace,
} from "@/lib/health-places";
import { useLocation } from "@/lib/location/LocationProvider";
import { useFacilitySearch } from "@/lib/useFacilities";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/map")({
  validateSearch: (search: Record<string, unknown>): { facility?: string } =>
    typeof search["facility"] === "string"
      ? { facility: search["facility"] }
      : {},
  head: () => ({
    meta: [
      { title: "Map of Nearby Facilities | RuralReach Health" },
      {
        name: "description",
        content:
          "See healthcare facilities around your location on a simple map view and open directions.",
      },
      {
        property: "og:title",
        content: "Map of Nearby Facilities | RuralReach Health",
      },
      {
        property: "og:description",
        content: "Healthcare facilities around you on a simple map view.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: MapScreen,
});

interface Positioned {
  place: HealthPlace;
  top: string;
  left: string;
}

function layout(
  places: HealthPlace[],
  origin: { latitude: number; longitude: number } | null,
): Positioned[] {
  if (places.length === 0) return [];
  const lats = places.map((p) => p.latitude);
  const lngs = places.map((p) => p.longitude);
  if (origin) {
    lats.push(origin.latitude);
    lngs.push(origin.longitude);
  }
  const minLat = Math.min(...lats);
  const maxLat = Math.max(...lats);
  const minLng = Math.min(...lngs);
  const maxLng = Math.max(...lngs);
  const spanLat = Math.max(maxLat - minLat, 0.0025);
  const spanLng = Math.max(maxLng - minLng, 0.0025);
  return places.map((place) => ({
    place,
    top: `${12 + ((maxLat - place.latitude) / spanLat) * 74}%`,
    left: `${10 + ((place.longitude - minLng) / spanLng) * 78}%`,
  }));
}

function MapScreen() {
  const { facility: initial } = Route.useSearch();
  const { location } = useLocation();
  const results = useFacilitySearch("all", "");
  const places = useMemo(
    () => (results.data?.places ?? []).slice(0, 10),
    [results.data],
  );
  const [selectedId, setSelectedId] = useState<string | undefined>(initial);
  const selected =
    places.find((p) => p.id === (selectedId ?? initial)) ?? places[0];

  const positioned = useMemo(() => layout(places, location), [places, location]);

  return (
    <AppShell title="Map" backTo="/find">
      <LocationBar compact />

      <div className="rise relative mt-3 h-[340px] overflow-hidden rounded-3xl border border-border bg-accent/60 shadow-soft">
        <div
          aria-hidden="true"
          className="absolute inset-0 opacity-60"
          style={{
            backgroundImage:
              "linear-gradient(to right, var(--color-border) 1px, transparent 1px), linear-gradient(to bottom, var(--color-border) 1px, transparent 1px)",
            backgroundSize: "44px 44px",
          }}
        />
        {location && (
          <span
            className="absolute left-1/2 top-1/2 grid h-9 w-9 -translate-x-1/2 -translate-y-1/2 place-items-center rounded-full bg-leaf text-leaf-foreground shadow-lift"
            aria-hidden="true"
          >
            <Crosshair className="h-4 w-4" />
          </span>
        )}
        <ul className="absolute inset-0">
          {positioned.map(({ place, top, left }) => {
            const active = place.id === selected?.id;
            return (
              <li key={place.id} className="absolute" style={{ top, left }}>
                <button
                  type="button"
                  onClick={() => setSelectedId(place.id)}
                  aria-pressed={active}
                  aria-label={`Select ${place.name}`}
                  className={cn(
                    "tap grid h-11 w-11 -translate-x-1/2 -translate-y-1/2 place-items-center rounded-full shadow-lift",
                    active
                      ? "bg-primary text-primary-foreground ring-4 ring-highlight"
                      : "bg-card text-primary",
                  )}
                >
                  <MapPin className="h-5 w-5" aria-hidden="true" />
                </button>
              </li>
            );
          })}
        </ul>
        {places.length === 0 && (
          <p className="absolute inset-x-6 top-1/2 -translate-y-1/2 rounded-2xl bg-card/95 p-4 text-center text-sm font-semibold text-muted-foreground">
            {results.isPending
              ? "Finding facilities around you…"
              : "Choose a location to see facilities nearby."}
          </p>
        )}
        <p className="absolute bottom-2 left-1/2 w-[92%] -translate-x-1/2 rounded-xl bg-card/90 px-3 py-1.5 text-center text-[0.7rem] text-muted-foreground">
          Simplified map view — tap a marker, then open directions.
        </p>
      </div>

      {selected && (
        <section
          key={selected.id}
          className="card-surface rise mt-3 flex items-center gap-3 p-4"
        >
          <Link
            to="/facility/$facilityId"
            params={{ facilityId: selected.id }}
            className="tap min-w-0 flex-1 rounded-lg"
          >
            <span className="block truncate text-base font-extrabold">
              {selected.name}
            </span>
            <span className="block text-sm text-muted-foreground">
              {[formatDistance(selected.distanceKm), selected.typeLabel]
                .filter(Boolean)
                .join(" · ")}
            </span>
            {selected.openNow !== undefined && (
              <span className="block text-sm font-semibold text-leaf">
                {selected.openNow ? "Open now" : "Closed now"}
              </span>
            )}
          </Link>
          <a
            href={directionsUrl(selected)}
            target="_blank"
            rel="noreferrer noopener"
            className="tap flex shrink-0 items-center gap-2 rounded-full bg-primary px-4 py-3 text-sm font-extrabold text-primary-foreground"
          >
            <Navigation className="h-4 w-4" aria-hidden="true" />
            Directions
          </a>
        </section>
      )}

      <p className="mt-4 flex items-start gap-2 rounded-2xl bg-secondary p-3 text-xs text-secondary-foreground">
        <Info className="mt-0.5 h-4 w-4 shrink-0" aria-hidden="true" />
        {results.data?.live ? MAP_DATA_NOTE : DEMO_MODE_NOTE}
      </p>
    </AppShell>
  );
}
