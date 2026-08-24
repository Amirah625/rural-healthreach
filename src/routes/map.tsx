import { createFileRoute, Link } from "@tanstack/react-router";
import { Info, MapPin, Navigation, Search, SlidersHorizontal } from "lucide-react";
import { useState } from "react";

import { AppShell } from "@/components/layout/AppShell";
import { DEMO_DATA_NOTE, facilities } from "@/data/facilities";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/map")({
  validateSearch: (search: Record<string, unknown>) => ({
    facility: typeof search.facility === "string" ? search.facility : undefined,
  }),
  head: () => ({
    meta: [
      { title: "Map of Nearby Facilities | RuralReach Health" },
      {
        name: "description",
        content:
          "See healthcare facilities around Oye Ekiti on a simple map view and get directions.",
      },
      {
        property: "og:title",
        content: "Map of Nearby Facilities | RuralReach Health",
      },
      {
        property: "og:description",
        content: "Healthcare facilities around you on a simple map view.",
      },
    ],
  }),
  component: MapScreen,
});

// Mock marker positions (percentages) — replaced by real coordinates once a
// map provider is connected.
const markerPositions = [
  { top: "22%", left: "28%" },
  { top: "34%", left: "68%" },
  { top: "52%", left: "18%" },
  { top: "58%", left: "52%" },
  { top: "70%", left: "76%" },
  { top: "44%", left: "42%" },
  { top: "80%", left: "34%" },
  { top: "16%", left: "58%" },
];

function MapScreen() {
  const { facility: initial } = Route.useSearch();
  const [selectedId, setSelectedId] = useState(initial ?? facilities[0].id);
  const selected =
    facilities.find((f) => f.id === selectedId) ?? facilities[0];

  return (
    <AppShell title="Map" backTo="/find">
      <div className="card-surface flex items-center gap-2 px-4 py-3">
        <Search className="h-5 w-5 shrink-0 text-muted-foreground" aria-hidden="true" />
        <label className="sr-only" htmlFor="map-search">
          Search location
        </label>
        <input
          id="map-search"
          placeholder="Search location..."
          className="min-w-0 flex-1 bg-transparent text-base outline-none placeholder:text-muted-foreground"
        />
        <Link
          to="/find"
          aria-label="Open facility filters"
          className="tap grid h-9 w-9 shrink-0 place-items-center rounded-full bg-secondary text-secondary-foreground"
        >
          <SlidersHorizontal className="h-4 w-4" aria-hidden="true" />
        </Link>
      </div>

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
        <div
          aria-hidden="true"
          className="absolute left-1/2 top-0 h-full w-8 -translate-x-1/2 rotate-6 bg-highlight/40"
        />
        <ul className="absolute inset-0">
          {facilities.map((f, i) => {
            const pos = markerPositions[i % markerPositions.length];
            const active = f.id === selected.id;
            return (
              <li key={f.id} className="absolute" style={pos}>
                <button
                  type="button"
                  onClick={() => setSelectedId(f.id)}
                  aria-pressed={active}
                  aria-label={`Select ${f.name}`}
                  className={cn(
                    "tap grid h-11 w-11 place-items-center rounded-full shadow-lift",
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
        <p className="absolute bottom-2 left-1/2 w-[92%] -translate-x-1/2 rounded-xl bg-card/90 px-3 py-1.5 text-center text-[0.7rem] text-muted-foreground">
          Illustrative map — live map and navigation will be connected in a
          later version.
        </p>
      </div>

      <section
        key={selected.id}
        className="card-surface rise mt-3 flex items-center gap-3 p-4"
      >
        <div className="min-w-0 flex-1">
          <h2 className="truncate text-base font-extrabold">{selected.name}</h2>
          <p className="text-sm text-muted-foreground">
            {selected.distanceKm} km away
          </p>
          <p className="text-sm font-semibold text-leaf">
            {selected.openingHours}
          </p>
        </div>
        <Link
          to="/facility/$facilityId"
          params={{ facilityId: selected.id }}
          className="tap flex shrink-0 items-center gap-2 rounded-full bg-primary px-4 py-3 text-sm font-extrabold text-primary-foreground"
        >
          <Navigation className="h-4 w-4" aria-hidden="true" />
          Directions
        </Link>
      </section>

      <p className="mt-4 flex items-start gap-2 rounded-2xl bg-secondary p-3 text-xs text-secondary-foreground">
        <Info className="mt-0.5 h-4 w-4 shrink-0" aria-hidden="true" />
        {DEMO_DATA_NOTE}
      </p>
    </AppShell>
  );
}
