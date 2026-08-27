import { createFileRoute, Link } from "@tanstack/react-router";
import {
  AlertTriangle,
  ChevronRight,
  Info,
  MapPin,
  Phone,
  Smartphone,
} from "lucide-react";

import { AppShell } from "@/components/layout/AppShell";
import { LocationBar } from "@/components/location/LocationBar";
import { getCountryOrDefault } from "@/lib/countries";
import { formatDistance, telHref } from "@/lib/health-places";
import { useLocation } from "@/lib/location/LocationProvider";
import { useFacilitySearch } from "@/lib/useFacilities";

export const Route = createFileRoute("/emergency")({
  head: () => ({
    meta: [
      { title: "Emergency / Help | RuralReach Health" },
      {
        name: "description",
        content:
          "Local emergency numbers, the nearest hospital to you and quick help resources in RuralReach Health.",
      },
      { property: "og:title", content: "Emergency / Help | RuralReach Health" },
      {
        property: "og:description",
        content: "Local emergency numbers and the nearest hospital to you.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: Emergency,
});

function Emergency() {
  const { location } = useLocation();
  const country = getCountryOrDefault(location?.countryCode);
  const results = useFacilitySearch("hospital", "");
  const nearest = results.data?.places?.[0];
  const primary = country.emergency[0]!;

  return (
    <AppShell title="Emergency / Help" tone="emergency">
      <section className="rise rounded-3xl border-2 border-destructive bg-destructive/10 p-5">
        <h2 className="flex items-start gap-2 text-base font-extrabold text-destructive">
          <AlertTriangle className="mt-0.5 h-5 w-5 shrink-0" aria-hidden="true" />
          In an emergency, call your local emergency service immediately.
        </h2>
        <div className="mt-4 space-y-2">
          {country.emergency.map((contact) => (
            <a
              key={contact.number}
              href={telHref(contact.number)}
              className="tap flex items-center justify-center gap-2 rounded-2xl bg-destructive px-5 py-4 text-lg font-extrabold text-destructive-foreground"
            >
              <Phone className="h-5 w-5" aria-hidden="true" />
              Call {contact.number} — {contact.label}
            </a>
          ))}
        </div>
        <p className="mt-3 text-xs text-destructive">
          {primary.number} is the emergency number shown for {country.name}.
          RuralReach Health does not provide emergency medical care itself.
        </p>
      </section>

      <div className="mt-4">
        <LocationBar compact />
      </div>

      <h2 className="mt-6 text-base font-extrabold">Quick help</h2>
      <div className="mt-2 space-y-3">
        {nearest ? (
          <Link
            to="/facility/$facilityId"
            params={{ facilityId: nearest.id }}
            className="card-surface tap rise flex items-center gap-3 p-4"
          >
            <span className="grid h-11 w-11 shrink-0 place-items-center rounded-2xl bg-accent text-primary">
              <MapPin className="h-5 w-5" aria-hidden="true" />
            </span>
            <span className="min-w-0 flex-1">
              <span className="block text-sm font-bold">Nearest hospital</span>
              <span className="block truncate text-xs text-muted-foreground">
                {[nearest.name, formatDistance(nearest.distanceKm)]
                  .filter(Boolean)
                  .join(" · ")}
              </span>
            </span>
            <ChevronRight
              className="h-5 w-5 shrink-0 text-muted-foreground"
              aria-hidden="true"
            />
          </Link>
        ) : (
          <Link
            to="/find"
            className="card-surface tap rise flex items-center gap-3 p-4"
          >
            <span className="grid h-11 w-11 shrink-0 place-items-center rounded-2xl bg-accent text-primary">
              <MapPin className="h-5 w-5" aria-hidden="true" />
            </span>
            <span className="min-w-0 flex-1">
              <span className="block text-sm font-bold">
                Find the nearest hospital
              </span>
              <span className="block text-xs text-muted-foreground">
                {results.isPending
                  ? "Searching near you…"
                  : "Set your location to see hospitals nearby"}
              </span>
            </span>
            <ChevronRight
              className="h-5 w-5 shrink-0 text-muted-foreground"
              aria-hidden="true"
            />
          </Link>
        )}

        <Link
          to="/resources"
          className="card-surface tap rise flex items-center gap-3 p-4"
        >
          <span className="grid h-11 w-11 shrink-0 place-items-center rounded-2xl bg-accent text-primary">
            <Info className="h-5 w-5" aria-hidden="true" />
          </span>
          <span className="min-w-0 flex-1">
            <span className="block text-sm font-bold">
              Emergency information
            </span>
            <span className="block text-xs text-muted-foreground">
              What to do while waiting for help
            </span>
          </span>
          <ChevronRight
            className="h-5 w-5 shrink-0 text-muted-foreground"
            aria-hidden="true"
          />
        </Link>

        <Link
          to="/ussd"
          className="card-surface tap rise flex items-center gap-3 p-4"
        >
          <span className="grid h-11 w-11 shrink-0 place-items-center rounded-2xl bg-accent text-primary">
            <Smartphone className="h-5 w-5" aria-hidden="true" />
          </span>
          <span className="min-w-0 flex-1">
            <span className="block text-sm font-bold">No internet access?</span>
            <span className="block text-xs text-muted-foreground">
              See how {country.ussdCode} could work on a basic phone
            </span>
          </span>
          <ChevronRight
            className="h-5 w-5 shrink-0 text-muted-foreground"
            aria-hidden="true"
          />
        </Link>
      </div>
    </AppShell>
  );
}
