import logo from "@/assets/ruralreach-logo.jpg.asset.json";
import { cn } from "@/lib/utils";

interface LogoProps {
  className?: string;
  /** Show the wordmark next to the mark */
  withWordmark?: boolean;
  size?: number;
}

/**
 * RuralReach Health logo. The uploaded artwork is a square lockup, so the mark
 * is shown through a circular crop and the wordmark is set in the brand type.
 */
export function Logo({ className, withWordmark = true, size = 40 }: LogoProps) {
  return (
    <span className={cn("flex min-w-0 items-center gap-2.5", className)}>
      <span
        className="shrink-0 overflow-hidden rounded-full bg-card ring-1 ring-border"
        style={{ width: size, height: size }}
      >
        <img
          src={logo.url}
          alt="RuralReach Health logo"
          width={size}
          height={size}
          className="h-full w-full scale-[1.85] object-cover object-[50%_28%]"
        />
      </span>
      {withWordmark && (
        <span className="min-w-0 leading-tight">
          <span className="block font-display text-[1.05rem] font-extrabold text-primary">
            RuralReach
          </span>
          <span className="block font-display text-[0.95rem] font-bold text-leaf">
            Health
          </span>
        </span>
      )}
    </span>
  );
}
