import { createFileRoute, Link } from "@tanstack/react-router";
import { AlertTriangle, ChevronRight, HeartHandshake, Info, MapPin, Phone } from "lucide-react";

import { AppShell } from "@/components/layout/AppShell";
import { facilities } from "@/data/facilities";

export const Route = createFileRoute("/emergency")({
  head: () => ({
    meta: [
      { title: "Emergency / Help | RuralReach Health" },
      {
        name: "description",
        content:
          "Emergency guidance, the nearest emergency facility and general help resources in RuralReach Health.",
      },
      { property: "og:title", content: "Emergency / Help | RuralReach Health" },
      {
        property: "og:description",
        content: "Emergency guidance and nearest emergency facility.",
      },
    ],
  }),
  component: Emergency,
});

function Emergency() {
  const nearestEmergency = facilities
    .filter((f) => f.services.includes("Emergency care"))
    .sort((a, b) => a.distanceKm - b.distanceKm)[0];

  return (
    <AppShell title="Emergency / Help" tone="emergency">
      <section className="rise rounded-3xl border-2 border-destructive bg-destructive/10 p-5">
        <h2 className="flex items-start gap-2 text-base font-extrabold text-destructive">
          <AlertTriangle className="mt-0.5 h-5 w-5 shrink-0" aria-hidden="true" />
          In an emergency, seek immediate help from the appropriate local
          emergency service.
        </h2>
        <a
          href="tel:112"
          className="tap mt-4 flex items-center justify-center gap-2 rounded-2xl bg-destructive px-5 py-4 text-lg font-extrabold text-destructive-foreground"
        >
          <Phone className="h-5 w-5" aria-hidden="true" />
          Call 112
        </a>
        <p className="mt-3 text-xs text-destructive">
          112 is the national emergency number used in Nigeria. RuralReach
          Health does not provide emergency medical care itself.
        </p>
      </section>

      <h2 className="mt-6 text-base font-extrabold">Quick help</h2>
      <div className="mt-2 space-y-3">
        <Link
          to="/facility/$facilityId"
          params={{ facilityId: nearestEmergency.id }}
          className="card-surface tap rise flex items-center gap-3 p-4"
        >
          <span className="grid h-11 w-11 shrink-0 place-items-center rounded-2xl bg-accent text-primary">
            <MapPin className="h-5 w-5" aria-hidden="true" />
          </span>
          <span className="min-w-0 flex-1">
            <span className="block text-sm font-bold">
              Nearest emergency facility
            </span>
            <span className="block truncate text-xs text-muted-foreground">
              {nearestEmergency.name} · {nearestEmergency.distanceKm} km away
            </span>
          </span>
          <ChevronRight className="h-5 w-5 shrink-0 text-muted-foreground" aria-hidden="true" />
        </Link>

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
          <ChevronRight className="h-5 w-5 shrink-0 text-muted-foreground" aria-hidden="true" />
        </Link>

        <Link
          to="/ussd"
          className="card-surface tap rise flex items-center gap-3 p-4"
        >
          <span className="grid h-11 w-11 shrink-0 place-items-center rounded-2xl bg-accent text-primary">
            <HeartHandshake className="h-5 w-5" aria-hidden="true" />
          </span>
          <span className="min-w-0 flex-1">
            <span className="block text-sm font-bold">Help without internet</span>
            <span className="block text-xs text-muted-foreground">
              See the planned USSD / SMS access
            </span>
          </span>
          <ChevronRight className="h-5 w-5 shrink-0 text-muted-foreground" aria-hidden="true" />
        </Link>
      </div>

      <p className="mt-5 rounded-2xl bg-secondary p-3 text-xs text-secondary-foreground">
        Prototype screen. Emergency service integrations are not connected in
        this version.
      </p>
    </AppShell>
  );
}
