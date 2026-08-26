import { Loader2, MapPin } from "lucide-react";
import { useState } from "react";

import { LocationSheet } from "@/components/location/LocationSheet";
import { useLocation } from "@/lib/location/LocationProvider";

export function LocationBar({ compact = false }: { compact?: boolean }) {
  const { location, status } = useLocation();
  const [open, setOpen] = useState(false);

  const label =
    status === "detecting"
      ? "Detecting your location…"
      : (location?.label ?? "Choose your location");

  return (
    <>
      <div className="card-surface flex items-center gap-3 px-4 py-3">
        <span className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-accent text-primary">
          {status === "detecting" ? (
            <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />
          ) : (
            <MapPin className="h-4 w-4" aria-hidden="true" />
          )}
        </span>
        <span className="min-w-0 flex-1">
          {!compact && (
            <span className="block text-xs font-semibold text-muted-foreground">
              Your location
            </span>
          )}
          <span className="block truncate text-sm font-bold">{label}</span>
          {location?.mode === "demo" && (
            <span className="mt-0.5 inline-block rounded-full bg-highlight/40 px-2 py-0.5 text-[0.65rem] font-bold text-highlight-foreground">
              Demo Mode
            </span>
          )}
        </span>
        <button
          type="button"
          onClick={() => setOpen(true)}
          className="tap shrink-0 rounded-full bg-secondary px-3 py-2 text-sm font-bold text-secondary-foreground"
        >
          Change
        </button>
      </div>
      <LocationSheet open={open} onClose={() => setOpen(false)} />
    </>
  );
}
