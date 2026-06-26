import { Link, useRouterState } from "@tanstack/react-router";
import { Home, LayoutGrid, Library, Heart, User } from "lucide-react";

const items = [
  { to: "/", label: "Início", Icon: Home },
  { to: "/categories", label: "Categorias", Icon: LayoutGrid },
  { to: "/library", label: "Biblioteca", Icon: Library },
  { to: "/favorites", label: "Favoritos", Icon: Heart },
  { to: "/profile", label: "Perfil", Icon: User },
] as const;

export function BottomNav() {
  const pathname = useRouterState({ select: (s) => s.location.pathname });

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-40 border-t border-border/60 bg-background/85 pb-[env(safe-area-inset-bottom)] backdrop-blur-xl">
      <ul className="mx-auto flex w-full max-w-md md:max-w-xl items-stretch justify-around px-2 py-2">
        {items.map(({ to, label, Icon }) => {
          const active = to === "/" ? pathname === "/" : pathname.startsWith(to);
          return (
            <li key={to} className="flex-1">
              <Link
                to={to}
                className={`flex flex-col items-center gap-0.5 rounded-xl py-1.5 text-[10px] transition ${
                  active ? "text-primary" : "text-muted-foreground"
                }`}
              >
                <Icon
                  className={`h-5 w-5 transition ${active ? "fill-primary/20" : ""}`}
                  strokeWidth={active ? 2.4 : 1.8}
                />
                <span className={active ? "font-semibold" : ""}>{label}</span>
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}