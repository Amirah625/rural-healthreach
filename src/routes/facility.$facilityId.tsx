import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { Building2, Clock, MapPin, Navigation, Phone, Wallet } from "lucide-react";

import { AppShell } from "@/components/layout/AppShell";
import { DEMO_DATA_NOTE, getFacility } from "@/data/facilities";

export const Route = createFileRoute("/facility/$facilityId")({
  loader: ({ params }) => {
    const facility = getFacility(params.facilityId);
    if (!facility) throw notFound();
    return { facility };
  },
  head: ({ loaderData }) => {
    if (!loaderData) {
      return {
        meta: [
          { title: "Facility unavailable | RuralReach Health" },
          { name: "robots", content: "noindex" },
        ],
      };
    }
    const { facility } = loaderData;
    return {
      meta: [
        { title: `${facility.name} | RuralReach Health` },
        {
          name: "description",
          content: `${facility.name} — ${facility.type}, ${facility.distanceKm} km away. ${facility.openingHours}.`,
        },
        { property: "og:title", content: `${facility.name} | RuralReach Health` },
        {
          property: "og:description",
          content: `${facility.type}, ${facility.distanceKm} km away. ${facility.openingHours}.`,
        },
      ],
    };
  },
  component: FacilityDetail,
});

const costLabel = {
  free: "Free / government supported",
  low: "Low cost",
  moderate: "Moderate cost",
} as const;

function FacilityDetail() {
  const { facility } = Route.useLoaderData();
  const isOpen = facility.availability === "open";

  return (
    <AppShell title="Facility Details" backTo="/find">
      <section className="card-surface rise p-5">
        <div className="flex items-start gap-3">
          <span className="grid h-14 w-14 shrink-0 place-items-center rounded-2xl bg-accent text-primary">
            <Building2 className="h-7 w-7" aria-hidden="true" />
          </span>
          <div className="min-w-0">
            <h2 className="text-xl font-extrabold">{facility.name}</h2>
            <p className="text-sm text-muted-foreground">{facility.type}</p>
          </div>
        </div>

        <dl className="mt-4 space-y-2.5 text-sm">
          <div className="flex items-center gap-2">
            <MapPin className="h-4 w-4 shrink-0 text-leaf" aria-hidden="true" />
            <dt className="sr-only">Distance</dt>
            <dd>{facility.distanceKm} km away — Oye Ekiti</dd>
          </div>
          <div className="flex items-center gap-2">
            <Clock className="h-4 w-4 shrink-0 text-leaf" aria-hidden="true" />
            <dt className="sr-only">Opening hours</dt>
            <dd>
              {facility.openingHours} ·{" "}
              <span className="font-bold">
                {isOpen ? "Open now" : "Closed now"}
              </span>
            </dd>
          </div>
          <div className="flex items-center gap-2">
            <Wallet className="h-4 w-4 shrink-0 text-leaf" aria-hidden="true" />
            <dt className="sr-only">Cost</dt>
            <dd>{costLabel[facility.costLevel]}</dd>
          </div>
        </dl>
      </section>

      <section className="mt-4">
        <h3 className="text-base font-extrabold">Services available</h3>
        <ul className="mt-2 flex flex-wrap gap-2">
          {facility.services.map((s) => (
            <li
              key={s}
              className="rounded-full bg-accent px-3 py-1.5 text-sm font-semibold text-accent-foreground"
            >
              {s}
            </li>
          ))}
        </ul>
      </section>

      <div className="mt-6 grid gap-3 sm:grid-cols-2">
        <a
          href={`tel:${facility.phone.replace(/\s/g, "")}`}
          className="tap flex items-center justify-center gap-2 rounded-2xl bg-leaf px-5 py-4 text-base font-extrabold text-leaf-foreground"
        >
          <Phone className="h-5 w-5" aria-hidden="true" />
          Call {facility.phone}
        </a>
        <Link
          to="/map"
          search={{ facility: facility.id }}
          className="tap flex items-center justify-center gap-2 rounded-2xl bg-primary px-5 py-4 text-base font-extrabold text-primary-foreground"
        >
          <Navigation className="h-5 w-5" aria-hidden="true" />
          Show on map
        </Link>
      </div>

      <p className="mt-5 rounded-2xl bg-secondary p-3 text-xs text-secondary-foreground">
        {DEMO_DATA_NOTE} Phone numbers are demo placeholders.
      </p>
    </AppShell>
  );
}
