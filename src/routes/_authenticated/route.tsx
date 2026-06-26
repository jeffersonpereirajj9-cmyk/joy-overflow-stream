import { createFileRoute, Outlet, useNavigate, useRouterState } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Loader2 } from "lucide-react";

export const Route = createFileRoute("/_authenticated")({
  component: AuthenticatedLayout,
});

function AuthenticatedLayout() {
  const navigate = useNavigate();
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const email = window.localStorage.getItem("bookfy_email");
    if (!email) {
      navigate({
        to: "/auth",
        search: { redirect: pathname },
        replace: true,
      });
      return;
    }
    setReady(true);
  }, [navigate, pathname]);

  if (!ready) {
    return (
      <div className="grid min-h-dvh place-items-center bg-background text-muted-foreground">
        <Loader2 className="h-6 w-6 animate-spin text-primary" />
      </div>
    );
  }

  return <Outlet />;
}