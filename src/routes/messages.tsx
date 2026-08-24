import { createFileRoute, Link } from "@tanstack/react-router";
import { MessagesSquare } from "lucide-react";

import { AppShell } from "@/components/layout/AppShell";

export const Route = createFileRoute("/messages")({
  head: () => ({
    meta: [
      { title: "Messages | RuralReach Health" },
      {
        name: "description",
        content:
          "Messages between you and health workers will appear here in a future version of RuralReach Health.",
      },
      { property: "og:title", content: "Messages | RuralReach Health" },
      {
        property: "og:description",
        content: "Your conversations with health workers, coming soon.",
      },
    ],
  }),
  component: Messages,
});

function Messages() {
  return (
    <AppShell title="Messages">
      <section className="card-surface rise mt-8 flex flex-col items-center gap-4 p-8 text-center">
        <span className="grid h-20 w-20 place-items-center rounded-full bg-accent text-primary">
          <MessagesSquare className="h-10 w-10" aria-hidden="true" />
        </span>
        <h2 className="text-lg font-extrabold">
          Your conversations will appear here.
        </h2>
        <p className="max-w-sm text-sm text-muted-foreground">
          Messaging with health workers and facilities is planned for a future
          version. For now you can call a facility directly.
        </p>
        <Link
          to="/find"
          className="tap rounded-2xl bg-primary px-5 py-3.5 text-base font-extrabold text-primary-foreground"
        >
          Find a facility
        </Link>
      </section>
    </AppShell>
  );
}
