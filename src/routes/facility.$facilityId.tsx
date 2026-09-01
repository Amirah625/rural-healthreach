import { useQuery } from "@tanstack/react-query";
import { createFileRoute, Link } from "@tanstack/react-router";
import {
  Building2,
  Clock,
  ExternalLink,
  Globe,
  ImageOff,
  Info,
  Bookmark,
  MapPin,
  Navigation,
  Phone,
  Star,
} from "lucide-react";
import { useState } from "react";

import { AppShell } from "@/components/layout/AppShell";
import {
  MAP_DATA_NOTE,
  directionsUrl,
  distanceKm,
  formatDistance,
  hasValidPhone,
  telHref,
  type HealthPlace,
} from "@/lib/health-places";
import { useLocation } from "@/lib/location/LocationProvider";
import { getFacilityDetails } from "@/lib/places.functions";

export const Route = createFileRoute("/facility/$facilityId")({
  head: () => ({
    meta: [
      { title: "Facility details | RuralReach Health" },
      {
        name: "description",
        content:
          "Opening hours, distance, phone number and directions for a healthcare facility near you.",
      },
      { property: "og:title", content: "Facility details | RuralReach Health" },
      {
        property: "og:description",
        content: "Hours, distance, phone number and directions for this facility.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: FacilityDetail,
});

function FacilityDetail() {
  const { facilityId } = Route.useParams();
  const { location } = useLocation();

  const live = useQuery<HealthPlace | null>({
    queryKey: ["facility", facilityId],
    enabled: facilityId.startsWith("live_"),
    staleTime: 300_000,
    queryFn: async () => {
      const res = await getFacilityDetails({
        data: { providerId: facilityId.slice(5) },
      });
      return (res.place as HealthPlace | null) ?? null;
    },
  });

  const place = live.data ?? null;
  const [imageFailed, setImageFailed] = useState(false);
  const [saved, setSaved] = useState(false);

  if (!place) {
    return (
      <AppShell title="Facility details" backTo="/find">
        <div className="card-surface rise p-6 text-center">
          <p className="text-sm font-bold">
            {live.isPending
              ? "Loading facility…"
              : "We couldn't load this facility."}
          </p>
          {!live.isPending && (
            <Link
              to="/find"
              className="tap mt-4 inline-flex rounded-2xl bg-primary px-5 py-3 text-sm font-extrabold text-primary-foreground"
            >
              Back to search
            </Link>
          )}
        </div>
      </AppShell>
    );
  }

  const away =
    place.distanceKm !== undefined
      ? formatDistance(place.distanceKm)
      : location
        ? formatDistance(distanceKm(location, place))
        : undefined;

  return (
    <AppShell title="Facility details" backTo="/find">
      <section className="card-surface rise overflow-hidden">
        <div className="aspect-[16/7] w-full bg-accent">
          {place.photoUrl && !imageFailed ? (
            <img
              src={place.photoUrl}
              alt={`${place.name} facility`}
              width={1200}
              height={525}
              onError={() => setImageFailed(true)}
              className="size-full object-cover"
            />
          ) : (
            <div className="flex size-full flex-col items-center justify-center gap-2 text-primary">
              <ImageOff className="h-9 w-9" aria-hidden="true" />
              <span className="text-sm font-bold">Facility image unavailable</span>
            </div>
          )}
        </div>
        <div className="p-5">
        <div className="flex items-start gap-3">
          <span className="grid h-14 w-14 shrink-0 place-items-center rounded-2xl bg-accent text-primary">
            <Building2 className="h-7 w-7" aria-hidden="true" />
          </span>
          <div className="min-w-0">
            <h2 className="text-xl font-extrabold">{place.name}</h2>
            <p className="text-sm text-muted-foreground">{place.typeLabel}</p>
            <p className="mt-1 inline-flex items-center gap-1 text-sm font-bold">
              {place.rating !== undefined ? (
                <>
                <Star
                  className="h-4 w-4 fill-highlight text-highlight"
                  aria-hidden="true"
                />
                {place.rating.toFixed(1)}
                <span className="sr-only">out of 5</span>
                {place.ratingCount ? (
                  <span className="font-normal text-muted-foreground">
                    ({place.ratingCount})
                  </span>
                ) : null}
                </>
              ) : (
                <span className="font-normal text-muted-foreground">Rating unavailable</span>
              )}
            </p>
          </div>
        </div>

        <dl className="mt-4 space-y-2.5 text-sm">
          <div className="flex items-start gap-2">
            <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-leaf" aria-hidden="true" />
            <dt className="sr-only">Address</dt>
            <dd className="min-w-0">
              <span className="block break-words">{place.address ?? "Information unavailable"}</span>
              <span className="block text-xs text-muted-foreground">
                {away ?? "Distance unavailable"}
              </span>
            </dd>
          </div>
          <div className="flex items-start gap-2">
              <Clock className="mt-0.5 h-4 w-4 shrink-0 text-leaf" aria-hidden="true" />
              <dt className="sr-only">Opening hours</dt>
              <dd>
                {place.openNow !== undefined && (
                  <span className="font-bold">
                    {place.openNow ? "Open now" : "Closed now"}
                  </span>
                )}
                {place.openNow === undefined && (
                  <span className="font-semibold">Opening status unavailable</span>
                )}
                {place.hoursSummary ? ` · ${place.hoursSummary}` : ""}
              </dd>
            </div>
          <div className="flex items-start gap-2">
              <Globe className="mt-0.5 h-4 w-4 shrink-0 text-leaf" aria-hidden="true" />
              <dt className="sr-only">Website</dt>
              <dd className="min-w-0">
                {place.website ? <a
                  href={place.website}
                  target="_blank"
                  rel="noreferrer noopener"
                  className="break-all font-semibold text-primary underline"
                >
                  {place.website}
                </a> : <span className="text-muted-foreground">Website unavailable</span>}
              </dd>
            </div>
        </dl>
        </div>
      </section>

      {place.hours && place.hours.length > 0 && (
        <section className="card-surface rise mt-4 p-5">
          <h3 className="text-base font-extrabold">Opening hours</h3>
          <ul className="mt-2 space-y-1 text-sm text-muted-foreground">
            {place.hours.map((h) => (
              <li key={h}>{h}</li>
            ))}
          </ul>
        </section>
      )}

      <section className="card-surface rise mt-4 p-5">
        <h3 className="text-base font-extrabold">Verified services</h3>
        {place.verifiedServices?.length ? (
          <ul className="mt-3 flex flex-wrap gap-2">
            {place.verifiedServices.map((service) => (
              <li key={service} className="rounded-full bg-accent px-3 py-1.5 text-xs font-bold text-accent-foreground">
                {service.replaceAll("_", " ")}
              </li>
            ))}
          </ul>
        ) : (
          <p className="mt-2 text-sm text-muted-foreground">Service information not verified</p>
        )}
      </section>

      <div className="mt-6 grid gap-3 sm:grid-cols-2">
        {hasValidPhone(place.phone) ? (
          <a
            href={telHref(place.phone)}
            className="tap flex items-center justify-center gap-2 rounded-2xl bg-leaf px-5 py-4 text-base font-extrabold text-leaf-foreground"
          >
            <Phone className="h-5 w-5" aria-hidden="true" />
            Call facility
          </a>
        ) : (
          <p className="flex items-center justify-center rounded-2xl bg-secondary px-5 py-4 text-center text-sm font-semibold text-secondary-foreground">
            Phone number unavailable
          </p>
        )}
        <a
          href={directionsUrl(place)}
          target="_blank"
          rel="noreferrer noopener"
          className="tap flex items-center justify-center gap-2 rounded-2xl bg-primary px-5 py-4 text-base font-extrabold text-primary-foreground"
        >
          <Navigation className="h-5 w-5" aria-hidden="true" />
          Get directions
          <ExternalLink className="h-4 w-4" aria-hidden="true" />
        </a>
      </div>

      <Link
        to="/map"
        search={{ facility: place.id }}
        className="tap mt-3 flex items-center justify-center gap-2 rounded-2xl bg-secondary px-5 py-3.5 text-sm font-extrabold text-secondary-foreground"
      >
        <MapPin className="h-4 w-4" aria-hidden="true" />
        Show on map
      </Link>

      <button
        type="button"
        aria-pressed={saved}
        onClick={() => setSaved((value) => !value)}
        className="tap mt-3 flex min-h-11 w-full items-center justify-center gap-2 rounded-2xl border border-border bg-card px-5 py-3.5 text-sm font-extrabold text-foreground hover:bg-accent"
      >
        <Bookmark className="h-4 w-4" aria-hidden="true" />
        {saved ? "Facility saved" : "Save facility"}
      </button>

      <p className="mt-5 flex items-start gap-2 rounded-2xl bg-secondary p-3 text-xs text-secondary-foreground">
        <Info className="mt-0.5 h-4 w-4 shrink-0" aria-hidden="true" />
        {MAP_DATA_NOTE}
      </p>
    </AppShell>
  );
}
