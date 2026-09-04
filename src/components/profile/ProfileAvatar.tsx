import { User } from "lucide-react";

import { cn } from "@/lib/utils";

interface ProfileAvatarProps {
  name?: string | null;
  src?: string | null;
  size?: "sm" | "md" | "lg";
  className?: string;
}

const sizeClasses = {
  sm: "h-9 w-9",
  md: "h-14 w-14",
  lg: "h-24 w-24",
} as const;

const iconClasses = {
  sm: "h-4 w-4",
  md: "h-6 w-6",
  lg: "h-10 w-10",
} as const;

export function ProfileAvatar({ name, src, size = "md", className }: ProfileAvatarProps) {
  const alt = name?.trim() ? `${name.trim()} profile picture` : "Profile picture";

  return (
    <span
      className={cn(
        "grid shrink-0 place-items-center overflow-hidden rounded-full bg-accent text-primary ring-1 ring-border",
        sizeClasses[size],
        className,
      )}
    >
      {src ? (
        <img
          src={src}
          alt={alt}
          className="h-full w-full object-cover"
          onError={(event) => {
            event.currentTarget.style.display = "none";
          }}
        />
      ) : (
        <User className={iconClasses[size]} aria-hidden="true" />
      )}
    </span>
  );
}