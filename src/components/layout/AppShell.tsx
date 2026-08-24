import { Link } from "@tanstack/react-router";
import { Bell, Menu, X, ArrowLeft } from "lucide-react";
import { useState, type ReactNode } from "react";

import { Logo } from "@/components/brand/Logo";
import { BottomNav } from "@/components/layout/BottomNav";
import { cn } from "@/lib/utils";

const menuLinks = [
  { to: "/find", label: "Find Healthcare Facility" },
  { to: "/map", label: "Map" },
  { to: "/resources", label: "Health Information" },
  { to: "/messages", label: "Messages" },
  { to: "/profile", label: "My Profile" },
  { to: "/ussd", label: "USSD / SMS Access" },
  { to: "/assistant", label: "Health Assistant" },
  { to: "/emergency", label: "Emergency / Help" },
] as const;

interface AppShellProps {
  children: ReactNode;
  /** Simple page title header instead of the branded home header */
  title?: string;
  backTo?: string;
  action?: ReactNode;
  tone?: "default" | "emergency";
}

export function AppShell({
  children,
  title,
  backTo,
  action,
  tone = "default",
}: AppShellProps) {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <div className="min-h-dvh bg-background pb-24">
      <header
        className={cn(
          "sticky top-0 z-30 border-b border-border/70 backdrop-blur",
          tone === "emergency" ? "bg-destructive/10" : "bg-background/90",
        )}
      >
        <div className="mx-auto grid max-w-3xl grid-cols-[auto_minmax(0,1fr)_auto] items-center gap-3 px-4 py-3">
          {title ? (
            <>
              <Link
                to={backTo ?? "/"}
                aria-label="Go back"
                className="tap grid h-11 w-11 place-items-center rounded-full bg-secondary text-secondary-foreground"
              >
                <ArrowLeft className="h-5 w-5" aria-hidden="true" />
              </Link>
              <h1 className="truncate text-center text-lg font-extrabold">
                {title}
              </h1>
              <div className="flex h-11 w-11 items-center justify-center">
                {action}
              </div>
            </>
          ) : (
            <>
              <button
                type="button"
                onClick={() => setMenuOpen(true)}
                aria-label="Open menu"
                className="tap grid h-11 w-11 place-items-center rounded-full bg-secondary text-secondary-foreground"
              >
                <Menu className="h-5 w-5" aria-hidden="true" />
              </button>
              <div className="flex min-w-0 justify-center">
                <Logo />
              </div>
              <Link
                to="/messages"
                aria-label="Notifications"
                className="tap grid h-11 w-11 place-items-center rounded-full bg-secondary text-secondary-foreground"
              >
                <Bell className="h-5 w-5" aria-hidden="true" />
              </Link>
            </>
          )}
        </div>
      </header>

      {menuOpen && (
        <div className="fixed inset-0 z-50">
          <button
            type="button"
            aria-label="Close menu"
            onClick={() => setMenuOpen(false)}
            className="absolute inset-0 bg-foreground/40"
          />
          <div className="rise absolute inset-y-0 left-0 flex w-[82%] max-w-xs flex-col gap-1 bg-card p-5 shadow-lift">
            <div className="mb-4 flex items-center justify-between">
              <Logo />
              <button
                type="button"
                onClick={() => setMenuOpen(false)}
                aria-label="Close menu"
                className="tap grid h-11 w-11 place-items-center rounded-full bg-secondary text-secondary-foreground"
              >
                <X className="h-5 w-5" aria-hidden="true" />
              </button>
            </div>
            <nav aria-label="Menu" className="flex flex-col">
              {menuLinks.map((link) => (
                <Link
                  key={link.to}
                  to={link.to}
                  onClick={() => setMenuOpen(false)}
                  className="tap rounded-xl px-3 py-3.5 text-base font-semibold text-foreground hover:bg-secondary data-[status=active]:bg-secondary data-[status=active]:text-primary"
                >
                  {link.label}
                </Link>
              ))}
            </nav>
            <p className="mt-auto pt-6 text-xs text-muted-foreground">
              Healthcare that reaches you, wherever you are.
            </p>
          </div>
        </div>
      )}

      <main className="mx-auto max-w-3xl px-4 pt-4">{children}</main>

      <BottomNav />
    </div>
  );
}
