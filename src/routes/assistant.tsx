import { createFileRoute, Link } from "@tanstack/react-router";
import { Bot, Info } from "lucide-react";

import { AppShell } from "@/components/layout/AppShell";

export const Route = createFileRoute("/assistant")({
  head: () => ({
    meta: [
      { title: "Health Assistant (Coming Soon) | RuralReach Health" },
      {
        name: "description",
        content:
          "A guided health assistant to help you describe your need and reach the right facility — planned for a future version.",
      },
      {
        property: "og:title",
        content: "Health Assistant (Coming Soon) | RuralReach Health",
      },
      {
        property: "og:description",
        content: "A guided assistant to help you reach the right facility.",
      },
    ],
  }),
  component: Assistant,
});

function Assistant() {
  return (
    <AppShell title="Health Assistant">
      <p className="rise flex items-start gap-2 rounded-2xl border border-highlight bg-highlight/25 p-3 text-xs font-semibold text-highlight-foreground">
        <Info className="mt-0.5 h-4 w-4 shrink-0" aria-hidden="true" />
        Coming soon — this assistant is not active yet and does not give medical
        advice.
      </p>

      <section className="card-surface rise mt-4 p-6 text-center">
        <span className="mx-auto grid h-20 w-20 place-items-center rounded-full bg-accent text-primary">
          <Bot className="h-10 w-10" aria-hidden="true" />
        </span>
        <h2 className="mt-4 text-lg font-extrabold">
          Tell us what you need, in plain words
        </h2>
        <p className="mx-auto mt-2 max-w-sm text-sm text-muted-foreground">
          A future version will ask a few simple questions and point you to the
          nearest facility offering the care you need. It will never diagnose or
          prescribe.
        </p>

        <div className="mt-5 space-y-2 text-left">
          {[
            "“My child has had fever since yesterday.”",
            "“I need an antenatal check-up this week.”",
            "“Where can I collect malaria medicine nearby?”",
          ].map((example) => (
            <p
              key={example}
              className="rounded-2xl bg-secondary px-4 py-3 text-sm text-secondary-foreground"
            >
              {example}
            </p>
          ))}
        </div>

        <Link
          to="/find"
          className="tap mt-6 inline-flex rounded-2xl bg-primary px-5 py-3.5 text-base font-extrabold text-primary-foreground"
        >
          Find a facility instead
        </Link>
      </section>
    </AppShell>
  );
}
