import { Link } from "@tanstack/react-router";
import {
  Baby,
  BabyIcon,
  ClipboardList,
  Cross,
  HeartPulse,
  ScanLine,
  Siren,
  TestTube2,
  type LucideIcon,
} from "lucide-react";

import {
  HEALTHCARE_NEEDS,
  type HealthcareNeedId,
} from "@/lib/healthcare-needs";
import { cn } from "@/lib/utils";

const icons: Record<HealthcareNeedId, LucideIcon> = {
  general_consultation: ClipboardList,
  laboratory_tests: TestTube2,
  maternity_care: Baby,
  child_healthcare: BabyIcon,
  pharmacy: Cross,
  imaging: ScanLine,
  emergency_care: Siren,
};

interface HealthcareNeedGridProps {
  selectedNeed?: HealthcareNeedId | undefined;
  onSelect?: (need: HealthcareNeedId) => void;
}

export function HealthcareNeedGrid({
  selectedNeed,
  onSelect,
}: HealthcareNeedGridProps) {
  return (
    <div
      className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4"
      role="group"
      aria-label="Healthcare needs"
    >
      {HEALTHCARE_NEEDS.map((need, index) => {
        const Icon = icons[need.id];
        const active = selectedNeed === need.id;
        const className = cn(
          "card-surface tap rise flex min-h-[104px] items-center gap-3 p-3 text-left hover:shadow-lift",
          active && "border-primary bg-accent ring-2 ring-ring",
        );
        const content = (
          <>
            <span
              className={cn(
                "grid h-10 w-10 shrink-0 place-items-center rounded-2xl bg-accent text-primary",
                active && "bg-primary text-primary-foreground",
              )}
            >
              <Icon className="h-5 w-5" aria-hidden="true" />
            </span>
            <span className="min-w-0 text-sm font-extrabold leading-tight">
              {need.label}
            </span>
          </>
        );

        return onSelect ? (
          <button
            key={need.id}
            type="button"
            onClick={() => onSelect(need.id)}
            aria-pressed={active}
            className={className}
            style={{ animationDelay: `${index * 45}ms` }}
          >
            {content}
          </button>
        ) : (
          <Link
            key={need.id}
            to="/find"
            search={{ need: need.id }}
            aria-label={`Find facilities for ${need.label}`}
            className={className}
            style={{ animationDelay: `${index * 45}ms` }}
          >
            {content}
          </Link>
        );
      })}
    </div>
  );
}