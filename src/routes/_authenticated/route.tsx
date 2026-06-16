import { createFileRoute, Outlet, redirect } from "@tanstack/react-router";

export const Route = createFileRoute("/_authenticated")({
  ssr: false,
  beforeLoad: async ({ location }) => {
    const email = typeof window !== "undefined" ? window.localStorage.getItem("bookfy_email") : null;
    if (!email) {
      throw redirect({ to: "/auth", search: { redirect: location.href } });
    }
    return { email };
  },
  component: () => <Outlet />,
});