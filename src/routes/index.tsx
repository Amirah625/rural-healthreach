import { createFileRoute, Link } from "@tanstack/react-router";
import {
  AlertTriangle,
  ArrowRight,
  Bot,
  BookOpen,
  MapPin,
  Smartphone,
  User,
} from "lucide-react";

import hero from "@/assets/hero-rural-health.jpg";
import { AppShell } from "@/components/layout/AppShell";

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
  return (
    <AppShell>
      <p className="rise text-center text-sm text-muted-foreground">
        Healthcare that reaches you,
        <br />
        wherever you are.
      </p>

      <section className="rise mt-4 overflow-hidden rounded-3xl shadow-soft">
        <img
          src={hero}
          alt="A community health worker smiling beside a rural clinic"
          width={1200}
          height={704}
          className="h-44 w-full object-cover sm:h-64"
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
        <h2 className="text-lg font-extrabold">What do you need today?</h2>
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

      <p className="mt-6 text-center text-xs text-muted-foreground">
        Demo prototype — facility information should be verified before
        visiting.
      </p>
    </AppShell>
  );
}
