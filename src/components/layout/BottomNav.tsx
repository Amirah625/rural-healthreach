import { Link } from "@tanstack/react-router";
import { Home, Map, BookOpen, MessageSquare, User } from "lucide-react";

const items = [
  { to: "/profile", label: "Profile", icon: User, exact: false },
  { to: "/", label: "Home", icon: Home, exact: true },
  { to: "/map", label: "Map", icon: Map, exact: false },
  { to: "/messages", label: "Messages", icon: MessageSquare, exact: false },
  { to: "/resources", label: "Resources", icon: BookOpen, exact: false },
] as const;

export function BottomNav() {
  return (
    <nav
      aria-label="Main"
      className="fixed inset-x-0 bottom-0 z-40 border-t border-border bg-card/95 backdrop-blur md:mx-auto md:max-w-3xl md:rounded-t-3xl"
    >
      <ul className="mx-auto flex max-w-3xl items-stretch justify-around px-2 pb-[max(0.4rem,env(safe-area-inset-bottom))] pt-1.5">
        {items.map(({ to, label, icon: Icon, exact }) => (
          <li key={to} className="flex-1">
            <Link
              to={to}
              activeOptions={{ exact }}
              className="tap group flex min-h-[56px] flex-col items-center justify-center gap-1 rounded-2xl px-2 py-1.5 text-muted-foreground data-[status=active]:text-primary"
            >
              <Icon
                className="h-6 w-6 transition-transform group-active:scale-90"
                strokeWidth={2}
                aria-hidden="true"
              />
              <span className="text-[0.7rem] font-semibold group-data-[status=active]:font-extrabold">
                {label}
              </span>
            </Link>
          </li>
        ))}
      </ul>
    </nav>
  );
}
