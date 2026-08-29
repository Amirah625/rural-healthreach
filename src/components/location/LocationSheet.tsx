import { Crosshair, Loader2, MapPin, Search, X } from "lucide-react";
import { useState } from "react";

import { COUNTRIES, getCountryOrDefault } from "@/lib/countries";
import { useLocation } from "@/lib/location/LocationProvider";
import { searchLocations } from "@/lib/places.functions";

interface LocationSheetProps {
  open: boolean;
  onClose: () => void;
}

export function LocationSheet({ open, onClose }: LocationSheetProps) {
  const { location, status, error, detect, setLocation } = useLocation();
  const [countryCode, setCountryCode] = useState(
    location?.countryCode ?? COUNTRIES[0]!.code,
  );
  const [term, setTerm] = useState("");
  const [searching, setSearching] = useState(false);
  const [searchError, setSearchError] = useState<string | null>(null);
  const [results, setResults] = useState<
    { label: string; countryCode?: string; latitude: number; longitude: number }[]
  >([]);

  if (!open) return null;

  const country = getCountryOrDefault(countryCode);

  async function runSearch(event: React.FormEvent) {
    event.preventDefault();
    if (!term.trim()) return;
    setSearching(true);
    setSearchError(null);
    try {
      const res = await searchLocations({
        data: { query: `${term.trim()}, ${country.name}` },
      });
      if (!res.live) {
        setSearchError(
          "Location search is not configured yet. Try again later or use your current location.",
        );
        setResults([]);
      } else if (res.results.length === 0) {
        setSearchError("We couldn't find that place. Try another spelling.");
        setResults([]);
      } else {
        setResults(res.results);
      }
    } catch {
      setSearchError("Location search failed. Please try again.");
    } finally {
      setSearching(false);
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center">
      <button
        type="button"
        aria-label="Close location picker"
        onClick={onClose}
        className="absolute inset-0 bg-foreground/40"
      />
      <div
        role="dialog"
        aria-modal="true"
        aria-label="Choose your location"
        className="rise relative max-h-[88dvh] w-full max-w-lg overflow-y-auto rounded-t-3xl bg-card p-5 shadow-lift"
      >
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-extrabold">Choose your location</h2>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close"
            className="tap grid h-11 w-11 place-items-center rounded-full bg-secondary text-secondary-foreground"
          >
            <X className="h-5 w-5" aria-hidden="true" />
          </button>
        </div>

        <button
          type="button"
          onClick={() => {
            detect();
          }}
          className="tap mt-4 flex w-full items-center justify-center gap-2 rounded-2xl bg-primary px-5 py-4 text-base font-extrabold text-primary-foreground"
        >
          {status === "detecting" ? (
            <Loader2 className="h-5 w-5 animate-spin" aria-hidden="true" />
          ) : (
            <Crosshair className="h-5 w-5" aria-hidden="true" />
          )}
          Use my current location
        </button>
        {error && (
          <p className="mt-2 rounded-2xl bg-destructive/10 p-3 text-xs font-semibold text-destructive">
            {error} You can search for your town or city instead.
          </p>
        )}

        <div className="mt-5">
          <label
            htmlFor="country-select"
            className="text-sm font-extrabold"
          >
            Country
          </label>
          <select
            id="country-select"
            value={countryCode}
            onChange={(e) => {
              setCountryCode(e.target.value);
              setResults([]);
            }}
            className="tap mt-2 w-full rounded-2xl border border-border bg-background px-4 py-3 text-base font-semibold"
          >
            {COUNTRIES.map((c) => (
              <option key={c.code} value={c.code}>
                {c.name}
              </option>
            ))}
          </select>
        </div>

        <form onSubmit={runSearch} className="mt-4">
          <label htmlFor="location-search" className="text-sm font-extrabold">
            Search city, town or area
          </label>
          <div className="mt-2 flex gap-2">
            <div className="flex min-w-0 flex-1 items-center gap-2 rounded-2xl border border-border bg-background px-4 py-3">
              <Search
                className="h-5 w-5 shrink-0 text-muted-foreground"
                aria-hidden="true"
              />
              <input
                id="location-search"
                value={term}
                onChange={(e) => setTerm(e.target.value)}
                placeholder={`e.g. ${country.quickPlaces[0]?.label ?? "your town"}`}
                className="min-w-0 flex-1 bg-transparent text-base outline-none"
              />
            </div>
            <button
              type="submit"
              className="tap shrink-0 rounded-2xl bg-leaf px-4 py-3 text-sm font-extrabold text-leaf-foreground"
            >
              {searching ? "Searching…" : "Search"}
            </button>
          </div>
        </form>

        {searchError && (
          <p className="mt-2 text-xs font-semibold text-muted-foreground">
            {searchError}
          </p>
        )}

        {results.length > 0 && (
          <ul className="mt-3 space-y-2">
            {results.map((r) => (
              <li key={`${r.label}-${r.latitude}`}>
                <button
                  type="button"
                  onClick={() => {
                    setLocation({
                      label: r.label,
                      countryCode: r.countryCode ?? countryCode,
                      latitude: r.latitude,
                      longitude: r.longitude,
                      mode: "manual",
                    });
                    onClose();
                  }}
                  className="tap flex w-full items-center gap-2 rounded-2xl border border-border px-4 py-3 text-left text-sm font-semibold"
                >
                  <MapPin className="h-4 w-4 shrink-0 text-leaf" aria-hidden="true" />
                  {r.label}
                </button>
              </li>
            ))}
          </ul>
        )}

        <h3 className="mt-5 text-sm font-extrabold">
          Popular areas in {country.name}
        </h3>
        <ul className="mt-2 flex flex-wrap gap-2">
          {country.quickPlaces.map((p) => (
            <li key={p.label}>
              <button
                type="button"
                onClick={() => {
                  setLocation({
                    label: `${p.label}, ${country.name}`,
                    countryCode: country.code,
                    latitude: p.latitude,
                    longitude: p.longitude,
                    mode: "manual",
                  });
                  onClose();
                }}
                className="tap rounded-full border border-border bg-background px-4 py-2 text-sm font-bold"
              >
                {p.label}
              </button>
            </li>
          ))}
        </ul>

      </div>
    </div>
  );
}
