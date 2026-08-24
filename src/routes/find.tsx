import { createFileRoute, Link } from "@tanstack/react-router";
import { Info, Map, Search, SlidersHorizontal } from "lucide-react";
import { useMemo, useState } from "react";

import { FacilityCard } from "@/components/facilities/FacilityCard";
import { AppShell } from "@/components/layout/AppShell";
import {
  DEMO_DATA_NOTE,
  FACILITY_TYPES,
  SERVICES,
  facilities,
  type FacilityType,
} from "@/data/facilities";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/find")({
  head: () => ({
    meta: [
      { title: "Find a Healthcare Facility | RuralReach Health" },
      {
        name: "description",
        content:
          "Search nearby clinics, hospitals and health centres, filter by services and see what is open now.",
      },
      {
        property: "og:title",
        content: "Find a Healthcare Facility | RuralReach Health",
      },
      {
        property: "og:description",
        content: "Search nearby clinics, hospitals and health centres.",
      },
    ],
  }),
  component: FindScreen,
});

function Chip({
  active,
  children,
  onClick,
}: {
  active: boolean;
  children: React.ReactNode;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={active}
      className={cn(
        "tap shrink-0 rounded-full border px-4 py-2 text-sm font-bold",
        active
          ? "border-primary bg-primary text-primary-foreground"
          : "border-border bg-card text-foreground",
      )}
    >
      {children}
    </button>
  );
}

function FindScreen() {
  const [query, setQuery] = useState("");
  const [openNow, setOpenNow] = useState(false);
  const [nearest, setNearest] = useState(true);
  const [type, setType] = useState<FacilityType | null>(null);
  const [service, setService] = useState<string | null>(null);
  const [showFilters, setShowFilters] = useState(false);

  const results = useMemo(() => {
    const list = facilities.filter((f) => {
      if (query && !f.name.toLowerCase().includes(query.toLowerCase()))
        return false;
      if (openNow && f.availability !== "open") return false;
      if (type && f.type !== type) return false;
      if (service && !f.services.includes(service)) return false;
      return true;
    });
    return nearest
      ? [...list].sort((a, b) => a.distanceKm - b.distanceKm)
      : list;
  }, [query, openNow, nearest, type, service]);

  return (
    <AppShell
      title="Find Healthcare Facility"
      action={
        <button
          type="button"
          onClick={() => setShowFilters((v) => !v)}
          aria-expanded={showFilters}
          aria-label="Show filters"
          className="tap grid h-11 w-11 place-items-center rounded-full bg-secondary text-secondary-foreground"
        >
          <SlidersHorizontal className="h-5 w-5" aria-hidden="true" />
        </button>
      }
    >
      <label className="sr-only" htmlFor="facility-search">
        Search for clinics, hospitals
      </label>
      <div className="card-surface flex items-center gap-2 px-4 py-3">
        <Search className="h-5 w-5 shrink-0 text-muted-foreground" aria-hidden="true" />
        <input
          id="facility-search"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search for clinics, hospitals..."
          className="min-w-0 flex-1 bg-transparent text-base outline-none placeholder:text-muted-foreground"
        />
      </div>

      <div className="mt-3 flex items-center justify-between gap-3 text-sm">
        <span className="min-w-0 truncate font-semibold">
          Near you — Oye Ekiti
        </span>
        <button
          type="button"
          onClick={() => setShowFilters(true)}
          className="tap shrink-0 font-bold text-leaf underline-offset-2 hover:underline"
        >
          Change
        </button>
      </div>

      <div className="mt-3 flex gap-2 overflow-x-auto pb-1">
        <Chip active={openNow} onClick={() => setOpenNow((v) => !v)}>
          Open now
        </Chip>
        <Chip active={nearest} onClick={() => setNearest((v) => !v)}>
          Nearest
        </Chip>
        <Chip active={showFilters} onClick={() => setShowFilters((v) => !v)}>
          More filters
        </Chip>
      </div>

      {showFilters && (
        <div className="rise card-surface mt-3 space-y-4 p-4">
          <fieldset>
            <legend className="text-sm font-extrabold">Facility type</legend>
            <div className="mt-2 flex flex-wrap gap-2">
              {FACILITY_TYPES.map((t) => (
                <Chip
                  key={t}
                  active={type === t}
                  onClick={() => setType(type === t ? null : t)}
                >
                  {t}
                </Chip>
              ))}
            </div>
          </fieldset>
          <fieldset>
            <legend className="text-sm font-extrabold">Services</legend>
            <div className="mt-2 flex flex-wrap gap-2">
              {SERVICES.map((s) => (
                <Chip
                  key={s}
                  active={service === s}
                  onClick={() => setService(service === s ? null : s)}
                >
                  {s}
                </Chip>
              ))}
            </div>
          </fieldset>
        </div>
      )}

      <p className="mt-4 flex items-start gap-2 rounded-2xl bg-secondary p-3 text-xs text-secondary-foreground">
        <Info className="mt-0.5 h-4 w-4 shrink-0" aria-hidden="true" />
        {DEMO_DATA_NOTE}
      </p>

      <p className="mt-4 text-sm font-semibold text-muted-foreground" aria-live="polite">
        {results.length} facilit{results.length === 1 ? "y" : "ies"} found
      </p>

      <div className="mt-2 space-y-3">
        {results.map((facility, i) => (
          <FacilityCard key={facility.id} facility={facility} index={i} />
        ))}
        {results.length === 0 && (
          <p className="card-surface p-6 text-center text-sm text-muted-foreground">
            No facilities match your filters. Try removing a filter.
          </p>
        )}
      </div>

      <Link
        to="/map"
        className="tap mt-5 flex items-center justify-center gap-2 rounded-2xl bg-primary px-5 py-4 text-base font-extrabold text-primary-foreground"
      >
        <Map className="h-5 w-5" aria-hidden="true" />
        View on Map
      </Link>
    </AppShell>
  );
}
