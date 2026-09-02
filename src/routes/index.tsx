import { createFileRoute, Link } from "@tanstack/react-router";
import {
  AlertTriangle,
  ArrowRight,
  Bot,
  BookOpen,
  Crosshair,
  Loader2,
  MapPin,
  Search,
  Smartphone,
  User,
} from "lucide-react";
import { useState } from "react";

import hero from "@/assets/hero-rural-health.jpg";
import { PlaceCard, PlaceCardSkeleton } from "@/components/facilities/PlaceCard";
import { AppShell } from "@/components/layout/AppShell";
import { HealthcareNeedGrid } from "@/components/facilities/HealthcareNeedGrid";
import { LocationBar } from "@/components/location/LocationBar";
import { useLocation } from "@/lib/location/LocationProvider";
import { useFacilitySearch } from "@/lib/useFacilities";
import { useNavigate } from "@tanstack/react-router";
import { firstNameFor } from "@/lib/auth";
import { useAuth } from "@/lib/auth/AuthProvider";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "RuralReach Health — Healthcare that reaches you" },
      {
        name: "description",
        content:
          "Find nearby clinics, hospitals and health information in rural communities. RuralReach Health brings healthcare access to your phone.",
      },
      {
        property: "og:title",
        content: "RuralReach Health — Healthcare that reaches you",
      },
      {
        property: "og:description",
        content:
          "Find nearby clinics, hospitals and health information in rural communities.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Home,
});

const actions = [
  { to: "/find", label: "Find Healthcare Facility", icon: MapPin },
  { to: "/assistant", label: "Health Assistant", icon: Bot },
  { to: "/resources", label: "Health Information", icon: BookOpen },
  { to: "/ussd", label: "USSD / SMS Access", icon: Smartphone },
  { to: "/profile", label: "My Profile", icon: User },
  { to: "/emergency", label: "Emergency / Help", icon: AlertTriangle },
] as const;

function Home() {
  const navigate = useNavigate();
  const { location, status, detect } = useLocation();
  const { user, profile } = useAuth();
  const [input, setInput] = useState("");
  const nearby = useFacilitySearch("all", "");
  const nearbyPlaces = nearby.data?.places.slice(0, 3) ?? [];

  function submitSearch(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    navigate({
      to: "/find",
      search: input.trim() ? { query: input.trim() } : {},
    });
  }

  return (
    <AppShell>
      <section className="rise text-center">
        <p className="text-sm font-bold text-primary">
          {user ? `Good ${new Date().getHours() < 12 ? "morning" : new Date().getHours() < 18 ? "afternoon" : "evening"}, ${firstNameFor(user, profile)} 👋` : "Welcome to RuralReach 👋"}
        </p>
        <h1 className="mt-1 text-2xl font-extrabold sm:text-3xl">
          {user ? "How can we help you find healthcare today?" : "Healthcare that reaches you"}
        </h1>
        <p className="mt-1 text-sm text-muted-foreground">Wherever you are.</p>
      </section>

      <section className="rise mt-5 rounded-3xl bg-primary p-5 text-primary-foreground shadow-lift sm:p-6">
        <div className="max-w-2xl">
          <p className="text-sm font-bold text-primary-foreground/80">
            Find care near you
          </p>
          <h2 className="mt-1 text-2xl font-extrabold leading-tight">
            Where do you need healthcare?
          </h2>
        </div>
        <form onSubmit={submitSearch} className="mt-4" role="search">
          <label className="sr-only" htmlFor="home-health-search">
            Search hospitals, clinics, services or locations
          </label>
          <div className="flex items-center gap-2 rounded-2xl bg-card p-2 text-foreground shadow-soft focus-within:ring-2 focus-within:ring-ring">
            <Search className="ml-2 h-5 w-5 shrink-0 text-muted-foreground" aria-hidden="true" />
            <input
              id="home-health-search"
              value={input}
              onChange={(event) => setInput(event.target.value)}
              placeholder="Search hospitals, clinics, services or locations…"
              autoComplete="off"
              className="min-w-0 flex-1 bg-transparent px-1 py-2 text-base outline-none placeholder:text-muted-foreground"
            />
            <button
              type="submit"
              className="tap min-h-11 shrink-0 rounded-xl bg-leaf px-4 text-sm font-extrabold text-leaf-foreground"
            >
              Search
            </button>
          </div>
        </form>
        <button
          type="button"
          onClick={detect}
          disabled={status === "detecting"}
          className="tap mt-3 inline-flex min-h-11 items-center gap-2 rounded-xl px-2 text-sm font-bold text-primary-foreground hover:bg-primary-foreground/10 disabled:opacity-70"
        >
          {status === "detecting" ? (
            <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />
          ) : (
            <Crosshair className="h-4 w-4" aria-hidden="true" />
          )}
          {status === "detecting" ? "Finding your location…" : "Use my location"}
        </button>
      </section>

      <div className="mt-3">
        <LocationBar compact />
      </div>

      <section className="mt-7">
        <h2 className="text-lg font-extrabold">What healthcare do you need today?</h2>
        <p className="mt-1 text-sm text-muted-foreground">
          Choose a service to search nearby provider information.
        </p>
        <div className="mt-3">
          <HealthcareNeedGrid />
        </div>
      </section>

      <section className="mt-7" aria-labelledby="nearby-heading">
        <div className="flex items-end justify-between gap-3">
          <div className="min-w-0">
            <h2 id="nearby-heading" className="text-lg font-extrabold">
              Nearby healthcare facilities
            </h2>
            <p className="mt-1 text-sm text-muted-foreground">
              {location ? "Live provider information around your location." : "Set your location to see live facilities nearby."}
            </p>
          </div>
          {location && nearbyPlaces.length > 0 && (
            <a href="/find" className="tap shrink-0 rounded-full px-3 py-2 text-sm font-extrabold text-primary hover:bg-accent">
              View all
            </a>
          )}
        </div>
        {nearby.isPending && location && (
          <div className="mt-3 space-y-3" aria-live="polite">
            {[0, 1, 2].map((index) => <PlaceCardSkeleton key={index} index={index} />)}
          </div>
        )}
        {nearby.isSuccess && nearbyPlaces.length > 0 && (
          <div className="mt-3 space-y-3">
            {nearbyPlaces.map((place, index) => <PlaceCard key={place.id} place={place} index={index} />)}
          </div>
        )}
        {!location && status !== "detecting" && (
          <button
            type="button"
            onClick={detect}
            className="card-surface tap mt-3 flex w-full items-center justify-center gap-2 p-4 text-sm font-extrabold text-primary hover:shadow-lift"
          >
            <Crosshair className="h-5 w-5" aria-hidden="true" />
            Use my location to find nearby care
          </button>
        )}
        {nearby.isSuccess && location && nearbyPlaces.length === 0 && (
          <p className="mt-3 rounded-2xl bg-secondary p-4 text-sm text-secondary-foreground">
            No nearby facilities with provider information were found.
          </p>
        )}
      </section>

      <section className="rise mt-7 overflow-hidden rounded-3xl shadow-soft">
        <img
          src={hero}
          alt="A community health worker smiling beside a rural clinic"
          width={1200}
          height={704}
          className="block aspect-[16/8] h-auto w-full object-cover sm:aspect-[16/7]"
        />
      </section>

      <section
        className="rise mt-4 rounded-3xl bg-primary p-5 text-primary-foreground shadow-lift"
        style={{ animationDelay: "80ms" }}
      >
        <h2 className="text-xl font-extrabold leading-snug">
          Quality healthcare information and services in your hands.
        </h2>
        <Link
          to="/find"
          className="tap mt-4 flex items-center justify-between gap-3 rounded-2xl bg-leaf px-5 py-3.5 text-base font-extrabold text-leaf-foreground"
        >
          Get Started
          <ArrowRight className="h-5 w-5" aria-hidden="true" />
        </Link>
      </section>

      <section className="mt-7">
        <h2 className="text-lg font-extrabold">Explore RuralReach</h2>
        <ul className="mt-3 grid grid-cols-2 gap-3 sm:grid-cols-3">
          {actions.map(({ to, label, icon: Icon }, i) => (
            <li key={to}>
              <Link
                to={to}
                className="card-surface tap rise flex h-full min-h-[112px] flex-col items-center justify-center gap-2 p-3 text-center hover:shadow-lift"
                style={{ animationDelay: `${120 + i * 50}ms` }}
              >
                <span
                  className={`grid h-11 w-11 place-items-center rounded-2xl ${
                    to === "/emergency"
                      ? "bg-destructive/10 text-destructive"
                      : "bg-accent text-primary"
                  }`}
                >
                  <Icon className="h-6 w-6" aria-hidden="true" />
                </span>
                <span className="text-sm font-bold leading-tight">{label}</span>
              </Link>
            </li>
          ))}
        </ul>
      </section>

    </AppShell>
  );
}
