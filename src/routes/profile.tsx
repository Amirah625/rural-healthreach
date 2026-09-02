import { createFileRoute, Link } from "@tanstack/react-router";
import { Bell, Contrast, Globe, Loader2, LogOut, Mail, MapPin, Phone, Type, User } from "lucide-react";
import { useState } from "react";
import { useQueryClient } from "@tanstack/react-query";

import { AppShell } from "@/components/layout/AppShell";
import { cn } from "@/lib/utils";
import { useAuth } from "@/lib/auth/AuthProvider";

export const Route = createFileRoute("/profile")({
  head: () => ({
    meta: [
      { title: "My Profile | RuralReach Health" },
      {
        name: "description",
        content:
          "Manage your RuralReach Health account and accessibility preferences.",
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
  const { user, profile, loading } = useAuth();
  const queryClient = useQueryClient();
  const navigate = Route.useNavigate();
  const [signingOut, setSigningOut] = useState(false);

  async function signOut() {
    setSigningOut(true);
    await queryClient.cancelQueries();
    queryClient.clear();
    await (await import("@/integrations/supabase/client")).supabase.auth.signOut();
    navigate({ to: "/auth", replace: true });
  }

  if (loading) {
    return <AppShell title="My Profile"><div className="card-surface flex min-h-40 items-center justify-center"><Loader2 className="h-7 w-7 animate-spin text-primary" aria-label="Loading profile" /></div></AppShell>;
  }

  if (!user) {
    return (
      <AppShell title="My Profile">
        <section className="card-surface rise p-6 text-center sm:p-8">
          <span className="mx-auto grid h-16 w-16 place-items-center rounded-full bg-accent text-primary"><User className="h-8 w-8" aria-hidden="true" /></span>
          <h2 className="mt-4 text-xl font-extrabold">Make RuralReach yours</h2>
          <p className="mx-auto mt-2 max-w-md text-sm text-muted-foreground">Sign in to personalize your greeting and keep your account details together. Healthcare discovery stays open to everyone.</p>
          <Link to="/auth" className="tap mt-5 inline-flex min-h-12 items-center justify-center rounded-2xl bg-primary px-5 py-3.5 text-base font-extrabold text-primary-foreground">Sign in or create an account</Link>
        </section>
      </AppShell>
    );
  }

  return (
    <AppShell title="My Profile">
      <section className="card-surface rise flex items-center gap-4 p-5">
        <span className="grid h-16 w-16 shrink-0 place-items-center rounded-full bg-accent text-primary">
          <User className="h-8 w-8" aria-hidden="true" />
        </span>
        <div className="min-w-0">
           <h2 className="truncate text-lg font-extrabold">{profile?.full_name ?? user.user_metadata?.full_name ?? "RuralReach member"}</h2>
           <p className="flex items-center gap-1.5 text-sm text-muted-foreground"><Mail className="h-4 w-4 shrink-0" aria-hidden="true" />{user.email}</p>
           {profile?.phone && <p className="mt-1 flex items-center gap-1.5 text-sm text-muted-foreground"><Phone className="h-4 w-4 shrink-0" aria-hidden="true" />{profile.phone}</p>}
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

      <section className="card-surface rise mt-6 p-4">
        <div className="flex items-center justify-between gap-4">
          <div>
            <h2 className="text-base font-extrabold">Account</h2>
            <p className="mt-1 text-sm text-muted-foreground">Patient / community member</p>
          </div>
          <span className="rounded-full bg-accent px-3 py-1 text-xs font-extrabold text-accent-foreground">Active</span>
        </div>
        <button type="button" onClick={signOut} disabled={signingOut} className="tap mt-4 flex min-h-12 w-full items-center justify-center gap-2 rounded-2xl border border-border bg-card px-5 py-3.5 text-base font-extrabold text-foreground hover:bg-secondary disabled:opacity-70">
          {signingOut ? <Loader2 className="h-5 w-5 animate-spin" aria-hidden="true" /> : <LogOut className="h-5 w-5" aria-hidden="true" />}
          Sign out
        </button>
      </section>

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

      <p className="mt-5 rounded-2xl bg-secondary p-3 text-xs text-secondary-foreground">RuralReach Health stores your account details only to personalize this experience. Medical history is not collected in this version.</p>
    </AppShell>
  );
}
