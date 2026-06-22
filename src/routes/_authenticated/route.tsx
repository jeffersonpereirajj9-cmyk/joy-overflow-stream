import { createFileRoute, Outlet, redirect } from "@tanstack/react-router";
import { supabase } from "@/integrations/supabase/client";

export const Route = createFileRoute("/_authenticated")({
  ssr: false,
  beforeLoad: async ({ location }) => {
    // First check localStorage (legacy/manual auth)
    const email = typeof window !== "undefined" ? window.localStorage.getItem("bookfy_email") : null;
    if (email) {
      return { email };
    }
    // Then check Supabase auth (Google OAuth)
    const { data } = await supabase.auth.getUser();
    if (data.user?.email) {
      return { email: data.user.email };
    }
    throw redirect({ to: "/auth", search: { redirect: location.href } });
  },
  component: () => <Outlet />,
});