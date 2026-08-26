import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";

import { DEMO_LOCATIONS, nearestDemoLocation } from "@/data/demo-places";
import { DEFAULT_COUNTRY_CODE } from "@/lib/countries";
import { lookupCoordinates } from "@/lib/places.functions";

export type LocationMode = "device" | "manual" | "demo";

export type LocationStatus =
  | "idle"
  | "detecting"
  | "ready"
  | "denied"
  | "unavailable";

export interface AppLocation {
  label: string;
  countryCode: string;
  latitude: number;
  longitude: number;
  mode: LocationMode;
  /** Demo dataset key when mode === "demo" */
  demoId?: string;
}

interface LocationContextValue {
  location: AppLocation | null;
  status: LocationStatus;
  error: string | null;
  detect: () => void;
  setLocation: (next: AppLocation) => void;
  useDemoLocation: (demoId: string) => void;
}

const STORAGE_KEY = "ruralreach.location.v2";

const LocationContext = createContext<LocationContextValue | null>(null);

function demoLocation(demoId: string): AppLocation {
  const demo =
    DEMO_LOCATIONS.find((d) => d.id === demoId) ?? DEMO_LOCATIONS[0]!;
  return {
    label: demo.label,
    countryCode: demo.countryCode,
    latitude: demo.latitude,
    longitude: demo.longitude,
    mode: "demo",
    demoId: demo.id,
  };
}

export function LocationProvider({ children }: { children: ReactNode }) {
  const [location, setLocationState] = useState<AppLocation | null>(null);
  const [status, setStatus] = useState<LocationStatus>("idle");
  const [error, setError] = useState<string | null>(null);

  // Restore any previously chosen location after hydration.
  useEffect(() => {
    try {
      const raw = window.localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw) as AppLocation;
        if (typeof parsed?.latitude === "number") {
          setLocationState(parsed);
          setStatus("ready");
        }
      }
    } catch {
      /* ignore corrupt storage */
    }
  }, []);

  const persist = useCallback((next: AppLocation) => {
    setLocationState(next);
    setStatus("ready");
    setError(null);
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
    } catch {
      /* storage may be unavailable */
    }
  }, []);

  const detect = useCallback(() => {
    if (typeof navigator === "undefined" || !navigator.geolocation) {
      setStatus("unavailable");
      setError("Location is not supported on this device.");
      return;
    }
    setStatus("detecting");
    setError(null);
    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const { latitude, longitude } = position.coords;
        let label = "Your current area";
        let countryCode = DEFAULT_COUNTRY_CODE;
        try {
          const res = await lookupCoordinates({
            data: { latitude, longitude },
          });
          const first = res.results[0];
          if (first) {
            label = first.label;
            if (first.countryCode) countryCode = first.countryCode;
          }
        } catch {
          /* keep the generic label if reverse geocoding is unavailable */
        }
        persist({
          label,
          countryCode,
          latitude,
          longitude,
          mode: "device",
        });
      },
      (err) => {
        setStatus(err.code === err.PERMISSION_DENIED ? "denied" : "unavailable");
        setError(
          err.code === err.PERMISSION_DENIED
            ? "We couldn't access your location."
            : "Your location is currently unavailable.",
        );
      },
      { enableHighAccuracy: false, timeout: 12000, maximumAge: 300000 },
    );
  }, [persist]);

  const useDemoLocation = useCallback(
    (demoId: string) => persist(demoLocation(demoId)),
    [persist],
  );

  const value = useMemo<LocationContextValue>(
    () => ({
      location,
      status,
      error,
      detect,
      setLocation: persist,
      useDemoLocation,
    }),
    [location, status, error, detect, persist, useDemoLocation],
  );

  return (
    <LocationContext.Provider value={value}>
      {children}
    </LocationContext.Provider>
  );
}

export function useLocation(): LocationContextValue {
  const ctx = useContext(LocationContext);
  if (!ctx)
    throw new Error("useLocation must be used inside <LocationProvider>");
  return ctx;
}

/** Demo dataset key to use for a location (falls back to the nearest demo area). */
export function demoKeyFor(location: AppLocation | null): string {
  if (!location) return DEMO_LOCATIONS[0]!.id;
  if (location.demoId) return location.demoId;
  return nearestDemoLocation(location.latitude, location.longitude).id;
}
