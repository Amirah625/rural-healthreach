import { createFileRoute } from "@tanstack/react-router";
import { Bell, Contrast, Globe, MapPin, Type, User } from "lucide-react";
import { useState } from "react";

import { AppShell } from "@/components/layout/AppShell";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/profile")({
  head: () => ({
    meta: [
      { title: "My Profile | RuralReach Health" },
      {
        name: "description",
        content:
          "Demo profile with language, notification and accessibility preferences for RuralReach Health.",
      },
      { property: "og:title", content: "My Profile | RuralReach Health" },
      {
        property: "og:description",
        content: "Preferences, notifications and accessibility settings.",
      },
    ],
  }),
  component: Profile,
});

function Toggle({
  label,
  description,
  icon: Icon,
}: {
  label: string;
  description: string;
  icon: typeof Bell;
}) {
  const [on, setOn] = useState(true);
  return (
    <button
      type="button"
      role="switch"
      aria-checked={on}
      onClick={() => setOn((v) => !v)}
      className="tap flex w-full items-center gap-3 p-4 text-left"
    >
      <span className="grid h-11 w-11 shrink-0 place-items-center rounded-2xl bg-accent text-primary">
        <Icon className="h-5 w-5" aria-hidden="true" />
      </span>
      <span className="min-w-0 flex-1">
        <span className="block text-sm font-bold">{label}</span>
        <span className="block text-xs text-muted-foreground">
          {description}
        </span>
      </span>
      <span
        className={cn(
          "flex h-7 w-12 shrink-0 items-center rounded-full p-1 transition-colors",
          on ? "bg-leaf" : "bg-muted",
        )}
      >
        <span
          className={cn(
            "h-5 w-5 rounded-full bg-card transition-transform",
            on && "translate-x-5",
          )}
        />
      </span>
      <span className="sr-only">{on ? "On" : "Off"}</span>
    </button>
  );
}

function Profile() {
  return (
    <AppShell title="My Profile">
      <section className="card-surface rise flex items-center gap-4 p-5">
        <span className="grid h-16 w-16 shrink-0 place-items-center rounded-full bg-accent text-primary">
          <User className="h-8 w-8" aria-hidden="true" />
        </span>
        <div className="min-w-0">
          <h2 className="truncate text-lg font-extrabold">Demo User</h2>
          <p className="flex items-center gap-1.5 text-sm text-muted-foreground">
            <MapPin className="h-4 w-4 shrink-0" aria-hidden="true" />
            Oye Ekiti
          </p>
        </div>
      </section>

      <h2 className="mt-6 text-base font-extrabold">Preferences</h2>
      <div className="card-surface rise mt-2 divide-y divide-border">
        <Toggle
          icon={Globe}
          label="Language: English"
          description="More languages planned for a future version"
        />
        <Toggle
          icon={Bell}
          label="Facility notifications"
          description="Alerts about opening hours and outreach visits"
        />
      </div>

      <h2 className="mt-6 text-base font-extrabold">Accessibility</h2>
      <div className="card-surface rise mt-2 divide-y divide-border">
        <Toggle
          icon={Type}
          label="Larger text"
          description="Increase text size across the app"
        />
        <Toggle
          icon={Contrast}
          label="High contrast"
          description="Stronger contrast for easier reading"
        />
      </div>

      <p className="mt-5 rounded-2xl bg-secondary p-3 text-xs text-secondary-foreground">
        Demo profile only. RuralReach Health does not collect medical history or
        sensitive health information in this version.
      </p>
    </AppShell>
  );
}
