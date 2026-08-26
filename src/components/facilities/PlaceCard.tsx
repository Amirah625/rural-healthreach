import { Link } from "@tanstack/react-router";
import { Building2, ChevronRight, Clock, MapPin, Phone, Star } from "lucide-react";

import {
  formatDistance,
  telHref,
  type HealthPlace,
} from "@/lib/health-places";
import { cn } from "@/lib/utils";

interface PlaceCardProps {
  place: HealthPlace;
  index?: number;
}

export function PlaceCard({ place, index = 0 }: PlaceCardProps) {
  const distance = formatDistance(place.distanceKm);

  return (
    <article
      className="card-surface rise flex items-stretch gap-3 p-3"
      style={{ animationDelay: `${Math.min(index, 6) * 60}ms` }}
    >
      <Link
        to="/facility/$facilityId"
        params={{ facilityId: place.id }}
        aria-label={`View ${place.name}`}
        className="tap flex min-w-0 flex-1 items-center gap-3 rounded-lg text-left"
      >
        <span className="grid h-14 w-14 shrink-0 place-items-center rounded-2xl bg-accent text-primary">
          <Building2 className="h-7 w-7" aria-hidden="true" />
        </span>
        <span className="min-w-0 flex-1">
          <span className="block truncate font-display text-base font-extrabold text-foreground">
            {place.name}
          </span>
          <span className="mt-0.5 flex items-center gap-1.5 text-sm text-muted-foreground">
            <MapPin className="h-4 w-4 shrink-0" aria-hidden="true" />
            <span className="truncate">
              {[distance, place.typeLabel].filter(Boolean).join(" · ")}
            </span>
          </span>
          {place.address && (
            <span className="mt-0.5 block truncate text-xs text-muted-foreground">
              {place.address}
            </span>
          )}
          <span className="mt-1 flex flex-wrap items-center gap-2">
            {place.openNow !== undefined && (
              <span
                className={cn(
                  "inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-xs font-bold",
                  place.openNow
                    ? "bg-accent text-accent-foreground"
                    : "bg-muted text-muted-foreground",
                )}
              >
                <Clock className="h-3.5 w-3.5" aria-hidden="true" />
                {place.openNow ? "Open now" : "Closed now"}
              </span>
            )}
            {place.hoursSummary && (
              <span className="text-xs text-muted-foreground">
                {place.hoursSummary}
              </span>
            )}
            {place.rating !== undefined && (
              <span className="inline-flex items-center gap-1 text-xs font-bold text-foreground">
                <Star
                  className="h-3.5 w-3.5 fill-highlight text-highlight"
                  aria-hidden="true"
                />
                {place.rating.toFixed(1)}
                <span className="sr-only">out of 5</span>
                {place.ratingCount ? ` (${place.ratingCount})` : ""}
              </span>
            )}
          </span>
        </span>
        <ChevronRight
          className="h-5 w-5 shrink-0 text-muted-foreground"
          aria-hidden="true"
        />
      </Link>
      {place.phone && (
        <a
          href={telHref(place.phone)}
          aria-label={`Call ${place.name}`}
          className="tap grid h-14 w-14 shrink-0 place-items-center self-center rounded-full bg-leaf text-leaf-foreground"
        >
          <Phone className="h-6 w-6" aria-hidden="true" />
        </a>
      )}
    </article>
  );
}

export function PlaceCardSkeleton({ index = 0 }: { index?: number }) {
  return (
    <div
      className="card-surface rise flex items-center gap-3 p-3"
      style={{ animationDelay: `${index * 60}ms` }}
      aria-hidden="true"
    >
      <div className="h-14 w-14 shrink-0 animate-pulse rounded-2xl bg-muted" />
      <div className="min-w-0 flex-1 space-y-2">
        <div className="h-4 w-2/3 animate-pulse rounded bg-muted" />
        <div className="h-3 w-1/2 animate-pulse rounded bg-muted" />
        <div className="h-3 w-1/3 animate-pulse rounded bg-muted" />
      </div>
    </div>
  );
}
