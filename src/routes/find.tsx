import { createFileRoute, Link } from "@tanstack/react-router";
import { Info, Map, RefreshCcw, Search, Stethoscope } from "lucide-react";
import { useEffect, useState } from "react";

import { PlaceCard, PlaceCardSkeleton } from "@/components/facilities/PlaceCard";
import { AppShell } from "@/components/layout/AppShell";
import { LocationBar } from "@/components/location/LocationBar";
import {
  CATEGORIES,
  MAP_DATA_NOTE,
  NOT_CONFIGURED_NOTE,
  type HealthCategory,
} from "@/lib/health-places";
import { useLocation } from "@/lib/location/LocationProvider";
import { useFacilitySearch } from "@/lib/useFacilities";
import {
  getHealthcareNeed,
  type HealthcareNeedId,
} from "@/lib/healthcare-needs";
import { HealthcareNeedGrid } from "@/components/facilities/HealthcareNeedGrid";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/find")({
  validateSearch: (search: Record<string, unknown>): { need?: HealthcareNeedId } =>
    getHealthcareNeed(search["need"] as string)?.id
      ? { need: search["need"] as HealthcareNeedId }
      : {},
  head: () => ({
    meta: [
      { title: "Find Healthcare Near You | RuralReach Health" },
      {
        name: "description",
        content:
          "Search hospitals, clinics, pharmacies and laboratories near your location, with distance, opening status and phone numbers.",
      },
      {
        property: "og:title",
        content: "Find Healthcare Near You | RuralReach Health",
      },
      {
        property: "og:description",
        content: "Search hospitals, clinics and pharmacies near your location.",
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
        "tap shrink-0 rounded-full border px-4 py-2 text-sm font-bold transition-colors",
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
  const { need: initialNeed } = Route.useSearch();
  const { location, status, detect } = useLocation();
  const [category, setCategory] = useState<HealthCategory>("all");
  const [input, setInput] = useState("");
  const [query, setQuery] = useState("");
  const [need, setNeed] = useState<HealthcareNeedId | undefined>(initialNeed);
  const [radiusMeters, setRadiusMeters] = useState(20_000);

  // Ask for location once on first visit if nothing is chosen yet.
  useEffect(() => {
    if (!location && status === "idle") detect();
  }, [location, status, detect]);

  const results = useFacilitySearch(category, query, need, radiusMeters);
  const places = results.data?.places ?? [];
  const isConfigured = results.data?.configured === true;

  return (
    <AppShell title="Find healthcare near you">
      <LocationBar />

      <section className="mt-5">
        <h2 className="text-lg font-extrabold">What healthcare do you need today?</h2>
        <p className="mt-1 text-sm text-muted-foreground">
          Choose a service to find nearby facilities with provider-verified information.
        </p>
        <div className="mt-3">
          <HealthcareNeedGrid
            selectedNeed={need}
            onSelect={(selected) => {
              setNeed(selected);
              setRadiusMeters(20_000);
            }}
          />
        </div>
      </section>

      <form
        onSubmit={(e) => {
          e.preventDefault();
          setQuery(input);
        }}
        className="mt-3"
      >
        <label className="sr-only" htmlFor="facility-search">
          Search hospitals, clinics, pharmacies
        </label>
        <div className="card-surface flex items-center gap-2 px-4 py-3">
          <Search
            className="h-5 w-5 shrink-0 text-muted-foreground"
            aria-hidden="true"
          />
          <input
            id="facility-search"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Search hospitals, clinics, pharmacies..."
            className="min-w-0 flex-1 bg-transparent text-base outline-none placeholder:text-muted-foreground"
          />
          <button
            type="submit"
            className="tap shrink-0 rounded-full bg-leaf px-3 py-2 text-sm font-extrabold text-leaf-foreground"
          >
            Search
          </button>
        </div>
      </form>

      <div
        className="mt-3 flex gap-2 overflow-x-auto pb-1"
        role="group"
        aria-label="Healthcare categories"
      >
        {CATEGORIES.map((c) => (
          <Chip
            key={c.id}
            active={category === c.id}
            onClick={() => setCategory(c.id)}
          >
            {c.label}
          </Chip>
        ))}
      </div>

      {!location && status !== "detecting" && (
        <section className="card-surface rise mt-4 p-5 text-center">
          <Stethoscope
            className="mx-auto h-8 w-8 text-leaf"
            aria-hidden="true"
          />
          <h2 className="mt-2 text-base font-extrabold">
            We need a location first
          </h2>
          <p className="mt-1 text-sm text-muted-foreground">
            Allow location access, or search for your town or city instead.
          </p>
          <button
            type="button"
            onClick={detect}
            className="tap mt-4 w-full rounded-2xl bg-primary px-5 py-3.5 text-base font-extrabold text-primary-foreground"
          >
            Use my current location
          </button>
        </section>
      )}

      {results.isPending && location && (
        <div className="mt-4 space-y-3" aria-live="polite">
          <p className="text-sm font-semibold text-muted-foreground">
            Finding healthcare near you…
          </p>
          {[0, 1, 2, 3].map((i) => (
            <PlaceCardSkeleton key={i} index={i} />
          ))}
        </div>
      )}

      {results.isError && (
        <section className="card-surface rise mt-4 p-5 text-center">
          <h2 className="text-base font-extrabold">Search didn't work</h2>
          <p className="mt-1 text-sm text-muted-foreground">
            We couldn't reach the healthcare search service. Check your
            connection and try again.
          </p>
          <button
            type="button"
            onClick={() => results.refetch()}
            className="tap mt-4 inline-flex items-center gap-2 rounded-2xl bg-primary px-5 py-3.5 text-base font-extrabold text-primary-foreground"
          >
            <RefreshCcw className="h-5 w-5" aria-hidden="true" />
            Try again
          </button>
        </section>
      )}

      {results.isSuccess && (
        <>
          <p
            className="mt-4 flex items-start gap-2 rounded-2xl bg-secondary p-3 text-xs text-secondary-foreground"
            aria-live="polite"
          >
            <Info className="mt-0.5 h-4 w-4 shrink-0" aria-hidden="true" />
            {isConfigured ? MAP_DATA_NOTE : NOT_CONFIGURED_NOTE}
          </p>

          <p className="mt-4 text-sm font-semibold text-muted-foreground">
            {places.length} nearby facilit
            {places.length === 1 ? "y" : "ies"} found
          </p>

          <div className="mt-2 space-y-3">
            {places.map((place, i) => (
              <PlaceCard
                key={place.id}
                place={place}
                index={i}
                highlightedNeed={need}
              />
            ))}
          </div>

          {places.length === 0 && (
            <section className="card-surface rise mt-2 p-5 text-center">
              <h2 className="text-base font-extrabold">
                {need
                  ? "We couldn't find a nearby facility with verified information for this service."
                  : "We couldn't find healthcare facilities nearby"}
              </h2>
              {!need && (
                <ul className="mt-2 space-y-1 text-sm text-muted-foreground">
                  <li>Try a different healthcare category</li>
                  <li>Search a wider term, like “hospital”</li>
                  <li>Change your location</li>
                </ul>
              )}
              <div className="mt-4 grid gap-2 sm:grid-cols-2">
                {need ? (
                  <button
                    type="button"
                    onClick={() => setRadiusMeters(50_000)}
                    className="tap rounded-2xl bg-secondary px-5 py-3.5 text-sm font-extrabold text-secondary-foreground"
                  >
                    Search a wider area
                  </button>
                ) : (
                  <button
                    type="button"
                    onClick={() => {
                      setCategory("all");
                      setInput("");
                      setQuery("");
                    }}
                    className="tap rounded-2xl bg-secondary px-5 py-3.5 text-sm font-extrabold text-secondary-foreground"
                  >
                    Clear filters
                  </button>
                )}
                <button
                  type="button"
                  onClick={() => {
                    setNeed(undefined);
                    setRadiusMeters(20_000);
                  }}
                  className="tap rounded-2xl bg-primary px-5 py-3.5 text-sm font-extrabold text-primary-foreground"
                >
                  View nearby healthcare facilities
                </button>
              </div>
            </section>
          )}
        </>
      )}

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
