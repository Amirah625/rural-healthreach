import { createFileRoute } from "@tanstack/react-router";
import { Apple, Baby, HeartPulse, Info, Stethoscope } from "lucide-react";
import { useState } from "react";

import { AppShell } from "@/components/layout/AppShell";
import {
  ARTICLE_CATEGORIES,
  HEALTH_INFO_DISCLAIMER,
  articles,
  type ArticleCategory,
} from "@/data/articles";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/resources")({
  head: () => ({
    meta: [
      { title: "Health Information | RuralReach Health" },
      {
        name: "description",
        content:
          "Plain-language health articles on maternal health, child health, common illnesses and nutrition.",
      },
      { property: "og:title", content: "Health Information | RuralReach Health" },
      {
        property: "og:description",
        content:
          "Plain-language health articles for rural communities — maternal, child, illnesses and nutrition.",
      },
    ],
  }),
  component: Resources,
});

const categoryIcons = {
  "Maternal Health": HeartPulse,
  "Child Health": Baby,
  "Common Illnesses": Stethoscope,
  Nutrition: Apple,
} as const;

function Resources() {
  const [category, setCategory] = useState<ArticleCategory | null>(null);
  const [openId, setOpenId] = useState<string | null>(null);

  const visible = category
    ? articles.filter((a) => a.category === category)
    : articles;

  return (
    <AppShell title="Health Information">
      <h2 className="text-base font-extrabold">Browse by category</h2>
      <ul className="mt-3 grid grid-cols-4 gap-2">
        {ARTICLE_CATEGORIES.map((c) => {
          const Icon = categoryIcons[c];
          const active = category === c;
          return (
            <li key={c}>
              <button
                type="button"
                onClick={() => setCategory(active ? null : c)}
                aria-pressed={active}
                className={cn(
                  "tap flex h-full w-full flex-col items-center gap-1.5 rounded-2xl border p-2 text-center",
                  active
                    ? "border-primary bg-primary text-primary-foreground"
                    : "border-border bg-card text-foreground",
                )}
              >
                <Icon className="h-6 w-6" aria-hidden="true" />
                <span className="text-[0.7rem] font-bold leading-tight">
                  {c}
                </span>
              </button>
            </li>
          );
        })}
      </ul>

      <h2 className="mt-6 text-base font-extrabold">
        {category ?? "All articles"}
      </h2>
      <div className="mt-3 space-y-3">
        {visible.map((article, i) => {
          const open = openId === article.id;
          return (
            <article
              key={article.id}
              className="card-surface rise overflow-hidden"
              style={{ animationDelay: `${i * 50}ms` }}
            >
              <button
                type="button"
                onClick={() => setOpenId(open ? null : article.id)}
                aria-expanded={open}
                className="tap flex w-full items-start gap-3 p-4 text-left"
              >
                <span className="min-w-0 flex-1">
                  <span className="block font-display text-base font-extrabold">
                    {article.title}
                  </span>
                  <span className="mt-1 block text-sm text-muted-foreground">
                    {article.summary}
                  </span>
                  <span className="mt-2 inline-block rounded-full bg-accent px-2.5 py-0.5 text-xs font-bold text-accent-foreground">
                    {article.category} · {article.readMinutes} min read
                  </span>
                </span>
              </button>
              {open && (
                <div className="rise space-y-2 border-t border-border bg-secondary/40 p-4 text-sm leading-relaxed">
                  {article.body.map((p) => (
                    <p key={p}>{p}</p>
                  ))}
                </div>
              )}
            </article>
          );
        })}
      </div>

      <p className="mt-5 flex items-start gap-2 rounded-2xl bg-secondary p-3 text-xs text-secondary-foreground">
        <Info className="mt-0.5 h-4 w-4 shrink-0" aria-hidden="true" />
        {HEALTH_INFO_DISCLAIMER}
      </p>
    </AppShell>
  );
}
