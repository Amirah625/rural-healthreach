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

/** Primary links shown inline in the desktop header */
const desktopLinks = [
  { to: "/find", label: "Find care" },
  { to: "/map", label: "Map" },
  { to: "/assistant", label: "Health Assistant" },
  { to: "/resources", label: "Health info" },
  { to: "/ussd", label: "USSD / SMS" },
  { to: "/profile", label: "Profile" },
] as const;

interface AppShellProps {
  children: ReactNode;
  /** Simple page title header instead of the branded home header */
  title?: string;
  backTo?: string;
  action?: ReactNode;
  tone?: "default" | "emergency";
  /** Content max width on large screens */
  width?: "prose" | "wide" | "full";
}

const widthClass = {
  prose: "max-w-3xl",
  wide: "max-w-6xl",
  full: "max-w-[1600px]",
} as const;

export function AppShell({
  children,
  title,
  backTo,
  action,
  tone = "default",
  width = "wide",
}: AppShellProps) {
  const [menuOpen, setMenuOpen] = useState(false);
  const container = `mx-auto w-full ${widthClass[width]} px-4 sm:px-6 lg:px-8`;

  return (
    <div className="min-h-dvh bg-background pb-24 md:pb-10">
      <header
        className={cn(
          "sticky top-0 z-30 border-b border-border/70 backdrop-blur",
          tone === "emergency" ? "bg-destructive/10" : "bg-background/90",
        )}
      >
        {/* Mobile / tablet header */}
        <div
          className={`${container} grid grid-cols-[auto_minmax(0,1fr)_auto] items-center gap-3 py-3 md:hidden`}
        >
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

        {/* Desktop header */}
        <div
          className={`${container} hidden items-center gap-6 py-3 md:flex`}
        >
          <Link to="/" aria-label="RuralReach Health home" className="shrink-0">
            <Logo />
          </Link>
          <nav
            aria-label="Primary"
            className="flex min-w-0 flex-1 items-center gap-1 overflow-x-auto"
          >
            {desktopLinks.map((link) => (
              <Link
                key={link.to}
                to={link.to}
                className="tap shrink-0 rounded-full px-3 py-2 text-sm font-bold text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground data-[status=active]:bg-secondary data-[status=active]:text-primary"
              >
                {link.label}
              </Link>
            ))}
          </nav>
          <Link
            to="/emergency"
            className="tap shrink-0 rounded-full bg-destructive px-4 py-2 text-sm font-extrabold text-destructive-foreground"
          >
            Emergency
          </Link>
        </div>
      </header>

      {menuOpen && (
        <div className="fixed inset-0 z-50 md:hidden">
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

      <main className={`${container} pt-4 md:pt-8`}>
        {title && (
          <h1 className="mb-5 hidden font-display text-3xl font-extrabold md:block lg:text-4xl">
            {title}
          </h1>
        )}
        {children}
      </main>

      <BottomNav />
    </div>
  );
}
