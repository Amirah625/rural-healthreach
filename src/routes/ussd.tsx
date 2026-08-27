import { createFileRoute } from "@tanstack/react-router";
import { Info, MessageSquare, Smartphone } from "lucide-react";
import { useState } from "react";

import { AppShell } from "@/components/layout/AppShell";
import { LocationBar } from "@/components/location/LocationBar";
import { getCountryOrDefault } from "@/lib/countries";
import { formatDistance } from "@/lib/health-places";
import { useLocation } from "@/lib/location/LocationProvider";
import { useFacilitySearch } from "@/lib/useFacilities";

export const Route = createFileRoute("/ussd")({
  head: () => ({
    meta: [
      { title: "USSD / SMS Access (Demo) | RuralReach Health" },
      {
        name: "description",
        content:
          "A prototype demonstration of how RuralReach Health could work on basic phones through USSD and SMS, using your real nearby facilities.",
      },
      {
        property: "og:title",
        content: "USSD / SMS Access (Demo) | RuralReach Health",
      },
      {
        property: "og:description",
        content: "How RuralReach Health could work without internet access.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: Ussd,
});

const menu = [
  "1. Find Healthcare",
  "2. Emergency Help",
  "3. Health Information",
  "4. About RuralReach",
];

function Ussd() {
  const [screen, setScreen] = useState<string | null>(null);
  const { location } = useLocation();
  const country = getCountryOrDefault(location?.countryCode);
  const results = useFacilitySearch("all", "");
  const places = results.data?.places ?? [];

  const nearbyText = results.isPending
    ? "Searching for facilities near you..."
    : places.length === 0
      ? "No facilities found. Set your location in the app."
      : places
          .slice(0, 3)
          .map(
            (p, i) =>
              `${i + 1}. ${p.name}${
                p.distanceKm !== undefined
                  ? ` (${formatDistance(p.distanceKm)})`
                  : ""
              }`,
          )
          .join("\n");

  const responses: Record<string, string> = {
    "1": `Near ${location?.label ?? "you"}:\n${nearbyText}\nReply 0 for menu.`,
    "2": `Emergency in ${country.name}:\n${country.emergency
      .map((e) => `${e.label}: ${e.number}`)
      .join("\n")}\nReply 0 for menu.`,
    "3": "Malaria: sleep under a treated net, clear standing water.\nReply 0 for menu.",
    "4": "RuralReach Health helps rural communities find care nearby.\nReply 0 for menu.",
  };

  return (
    <AppShell title="USSD / SMS Access">
      <p className="rise flex items-start gap-2 rounded-2xl border border-highlight bg-highlight/25 p-3 text-xs font-semibold text-highlight-foreground">
        <Info className="mt-0.5 h-4 w-4 shrink-0" aria-hidden="true" />
        Prototype demonstration — actual USSD/SMS integration is planned for a
        future version. Dialling {country.ussdCode} will not connect to the app.
      </p>

      <div className="mt-3">
        <LocationBar compact />
      </div>

      <section className="card-surface rise mt-4 p-5">
        <h2 className="flex items-center gap-2 text-base font-extrabold">
          <Smartphone className="h-5 w-5 text-leaf" aria-hidden="true" />
          No internet? No problem.
        </h2>
        <p className="mt-1 text-sm text-muted-foreground">
          Dial <span className="font-bold text-foreground">{country.ussdCode}</span>{" "}
          on any basic phone — this simulation uses the facilities we found near
          you.
        </p>

        <div className="mx-auto mt-4 max-w-xs rounded-3xl border-4 border-primary bg-primary/95 p-3 shadow-lift">
          <div
            className="rounded-2xl bg-accent p-4 font-mono text-sm leading-relaxed text-accent-foreground"
            aria-live="polite"
          >
            <p className="font-bold">RuralReach Health</p>
            <div className="mt-2 whitespace-pre-line">
              {screen ? responses[screen] : menu.join("\n")}
            </div>
          </div>
          <div className="mt-3 grid grid-cols-3 gap-2">
            {["1", "2", "3", "4", "0"].map((key) => (
              <button
                key={key}
                type="button"
                onClick={() => setScreen(key === "0" ? null : key)}
                aria-label={
                  key === "0" ? "Back to demo menu" : `Choose option ${key}`
                }
                className="tap rounded-xl bg-card py-3 text-base font-extrabold text-primary"
              >
                {key}
              </button>
            ))}
          </div>
          <p className="mt-3 text-center text-xs text-primary-foreground/80">
            Demo keypad — nothing is dialled
          </p>
        </div>
      </section>

      <section className="card-surface rise mt-4 p-5">
        <h2 className="flex items-center gap-2 text-base font-extrabold">
          <MessageSquare className="h-5 w-5 text-leaf" aria-hidden="true" />
          Planned SMS access
        </h2>
        <p className="mt-1 text-sm text-muted-foreground">
          In a future version, sending a keyword such as{" "}
          <span className="font-bold text-foreground">HELP</span> to a shortcode
          would return the nearest facilities by text message.
        </p>
      </section>
    </AppShell>
  );
}
