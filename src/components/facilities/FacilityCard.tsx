import { Link } from "@tanstack/react-router";
import { Building2, ChevronRight, Clock, MapPin, Phone } from "lucide-react";

import type { Facility } from "@/data/facilities";
import { cn } from "@/lib/utils";

interface FacilityCardProps {
  facility: Facility;
  index?: number;
}

export function FacilityCard({ facility, index = 0 }: FacilityCardProps) {
  const isOpen = facility.availability === "open";

  return (
    <article
      className="card-surface rise flex items-stretch gap-3 p-3"
      style={{ animationDelay: `${Math.min(index, 6) * 60}ms` }}
    >
      <Link
        to="/facility/$facilityId"
        params={{ facilityId: facility.id }}
        className="tap flex min-w-0 flex-1 items-center gap-3 rounded-lg text-left"
      >
        <span className="grid h-14 w-14 shrink-0 place-items-center rounded-2xl bg-accent text-primary">
          <Building2 className="h-7 w-7" aria-hidden="true" />
        </span>
        <span className="min-w-0 flex-1">
          <span className="block truncate font-display text-base font-extrabold text-foreground">
            {facility.name}
          </span>
          <span className="mt-0.5 flex items-center gap-1.5 text-sm text-muted-foreground">
            <MapPin className="h-4 w-4 shrink-0" aria-hidden="true" />
            {facility.distanceKm} km away · {facility.type}
          </span>
          <span className="mt-1 flex flex-wrap items-center gap-2">
            <span
              className={cn(
                "inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-xs font-bold",
                isOpen
                  ? "bg-accent text-accent-foreground"
                  : "bg-muted text-muted-foreground",
              )}
            >
              <Clock className="h-3.5 w-3.5" aria-hidden="true" />
              {isOpen ? "Open now" : "Closed now"}
            </span>
            <span className="text-xs text-muted-foreground">
              {facility.openingHours}
            </span>
          </span>
        </span>
        <ChevronRight
          className="h-5 w-5 shrink-0 text-muted-foreground"
          aria-hidden="true"
        />
      </Link>
      <a
        href={`tel:${facility.phone.replace(/\s/g, "")}`}
        aria-label={`Call ${facility.name}`}
        className="tap grid h-14 w-14 shrink-0 place-items-center self-center rounded-full bg-leaf text-leaf-foreground"
      >
        <Phone className="h-6 w-6" aria-hidden="true" />
      </a>
    </article>
  );
}
