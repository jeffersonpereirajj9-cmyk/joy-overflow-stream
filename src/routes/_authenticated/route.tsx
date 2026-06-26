import { createFileRoute, Outlet } from "@tanstack/react-router";
import { supabase } from "@/integrations/supabase/client";

export const Route = createFileRoute("/_authenticated")({
  beforeLoad: async () => {
    // App liberado para qualquer pessoa — sem gate de compra.
    let email = typeof window !== "undefined" ? window.localStorage.getItem("bookfy_email") : null;
    if (!email) {
      const { data } = await supabase.auth.getUser();
      email = data.user?.email ?? "guest@bookfy.app";
      if (typeof window !== "undefined") {
        window.localStorage.setItem("bookfy_email", email);
      }
    }
    return { email };
  },
  component: () => <Outlet />,
});