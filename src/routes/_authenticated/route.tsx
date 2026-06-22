import { createFileRoute, Outlet, redirect } from "@tanstack/react-router";
import { supabase } from "@/integrations/supabase/client";
import { checkBuyerEmail } from "@/lib/buyer-auth.functions";

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
      // Verify the Google email is an authorized buyer
      try {
        const result = await checkBuyerEmail({ data: { email: data.user.email } });
        if (result.allowed) {
          if (typeof window !== "undefined") {
            window.localStorage.setItem("bookfy_email", data.user.email);
          }
          return { email: data.user.email };
        }
      } catch {
        // fall through to no-access
      }
      await supabase.auth.signOut();
      throw redirect({ to: "/sem-acesso", search: { email: data.user.email } });
    }
    throw redirect({ to: "/auth", search: { redirect: location.href } });
  },
  component: () => <Outlet />,
});