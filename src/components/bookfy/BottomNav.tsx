import { Link, useRouterState } from "@tanstack/react-router";
import { Home, LayoutGrid, Library, Heart, User, Search } from "lucide-react";

const items = [
  { to: "/", label: "Início", Icon: Home },
  { to: "/search", label: "Buscar", Icon: Search },
  { to: "/categories", label: "Categorias", Icon: LayoutGrid },
  { to: "/library", label: "Biblioteca", Icon: Library },
  { to: "/favorites", label: "Favoritos", Icon: Heart },
  { to: "/profile", label: "Perfil", Icon: User },
] as const;

export function BottomNav() {
  const pathname = useRouterState({ select: (s) => s.location.pathname });

  return (
    <div className="pointer-events-none fixed bottom-0 left-0 right-0 z-40 pb-[max(env(safe-area-inset-bottom),0.75rem)] px-3">
      <nav className="pointer-events-auto mx-auto w-full max-w-md md:max-w-xl">
        <ul className="glass-strong relative flex items-stretch justify-around gap-1 rounded-3xl px-2 py-2 shadow-[0_24px_48px_-16px_rgba(0,0,0,0.6)]">
          {items.map(({ to, label, Icon }) => {
            const active = to === "/" ? pathname === "/" : pathname.startsWith(to);
            return (
              <li key={to} className="flex-1">
                <Link
                  to={to}
                  aria-label={label}
                  aria-current={active ? "page" : undefined}
                  className={`group relative flex min-h-11 flex-col items-center justify-center gap-0.5 rounded-2xl py-2 text-[10px] transition-all duration-300 ${
                    active
                      ? "text-primary-foreground"
                      : "text-muted-foreground hover:text-foreground"
                  }`}
                >
                  {active && (
                    <span className="absolute inset-0 -z-10 rounded-2xl gradient-primary shadow-[0_8px_24px_-6px_oklch(0.6_0.22_350/0.6)]" />
                  )}
                  <Icon
                    className="h-5 w-5 transition-transform duration-300 group-active:scale-90"
                    strokeWidth={active ? 2.4 : 1.7}
                  />
                  <span className={active ? "font-semibold" : "font-medium"}>{label}</span>
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>
    </div>
  );
}