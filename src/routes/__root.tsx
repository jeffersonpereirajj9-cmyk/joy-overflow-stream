import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import {
  Outlet,
  Link,
  createRootRouteWithContext,
  useRouter,
  HeadContent,
  Scripts,
} from "@tanstack/react-router";

import appCss from "../styles.css?url";
import { initSentry, Sentry } from "@/lib/sentry";
import { Toaster } from "@/components/ui/sonner";

initSentry();

function NotFoundComponent() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="max-w-md text-center">
        <h1 className="text-7xl font-bold text-foreground">404</h1>
        <h2 className="mt-4 text-xl font-semibold text-foreground">Page not found</h2>
        <p className="mt-2 text-sm text-muted-foreground">
          The page you're looking for doesn't exist or has been moved.
        </p>
        <div className="mt-6">
          <Link
            to="/"
            className="inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
          >
            Go home
          </Link>
        </div>
      </div>
    </div>
  );
}

function ErrorComponent({ error, reset }: { error: Error; reset: () => void }) {
  console.error(error);
  Sentry.captureException(error);
  const router = useRouter();

  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="max-w-md text-center">
        <h1 className="text-xl font-semibold tracking-tight text-foreground">
          This page didn't load
        </h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Something went wrong on our end. You can try refreshing or head back home.
        </p>
        <div className="mt-6 flex flex-wrap justify-center gap-2">
          <button
            onClick={() => {
              router.invalidate();
              reset();
            }}
            className="inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
          >
            Try again
          </button>
          <a
            href="/"
            className="inline-flex items-center justify-center rounded-md border border-input bg-background px-4 py-2 text-sm font-medium text-foreground transition-colors hover:bg-accent"
          >
            Go home
          </a>
        </div>
      </div>
    </div>
  );
}

export const Route = createRootRouteWithContext<{ queryClient: QueryClient }>()({
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1, viewport-fit=cover" },
      { name: "theme-color", content: "#0d0810" },
      { title: "Bookfy — Sua biblioteca de romances" },
      { name: "description", content: "Milhares de histórias para se apaixonar. Romance, dark romance, máfia, bilionários e fantasia." },
      { property: "og:title", content: "Bookfy — Sua biblioteca de romances" },
      { name: "twitter:title", content: "Bookfy — Sua biblioteca de romances" },
      { property: "og:description", content: "Milhares de histórias para se apaixonar. Romance, dark romance, máfia, bilionários e fantasia." },
      { name: "twitter:description", content: "Milhares de histórias para se apaixonar. Romance, dark romance, máfia, bilionários e fantasia." },
      { property: "og:image", content: "https://pub-bb2e103a32db4e198524a2e9ed8f35b4.r2.dev/30ab3f57-a5a9-4480-bd03-e8bb50303f26/id-preview-c561e58d--a3614237-5580-44ac-bdc0-bacf20bd8e7c.lovable.app-1781555169006.png" },
      { name: "twitter:image", content: "https://pub-bb2e103a32db4e198524a2e9ed8f35b4.r2.dev/30ab3f57-a5a9-4480-bd03-e8bb50303f26/id-preview-c561e58d--a3614237-5580-44ac-bdc0-bacf20bd8e7c.lovable.app-1781555169006.png" },
      { name: "twitter:card", content: "summary_large_image" },
      { property: "og:type", content: "website" },
    ],
    links: [
      {
        rel: "stylesheet",
        href: appCss,
      },
      { rel: "preconnect", href: "https://fonts.googleapis.com" },
      { rel: "icon", type: "image/svg+xml", href: "/favicon.svg" },
      { rel: "apple-touch-icon", href: "/favicon.svg" },
      { rel: "preconnect", href: "https://fonts.gstatic.com", crossOrigin: "anonymous" },
      { rel: "preconnect", href: "https://books.google.com", crossOrigin: "anonymous" },
      { rel: "preconnect", href: "https://covers.openlibrary.org", crossOrigin: "anonymous" },
      { rel: "preconnect", href: "https://is1-ssl.mzstatic.com", crossOrigin: "anonymous" },
      { rel: "dns-prefetch", href: "https://openlibrary.org" },
      { rel: "dns-prefetch", href: "https://www.googleapis.com" },
      { rel: "dns-prefetch", href: "https://itunes.apple.com" },
      {
        rel: "stylesheet",
        href: "https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=Playfair+Display:ital,wght@0,500;0,600;0,700;1,500&family=Instrument+Serif:ital@0;1&family=Work+Sans:wght@400;500;600;700;800&display=swap",
      },
    ],
    scripts: [
      {
        type: "text/javascript",
        // Defer Facebook Pixel until after the page is interactive so it does not
        // block LCP/TBT. Uses requestIdleCallback when available, otherwise a
        // short timeout after window load.
        children: `(function(){function l(){if(window.fbq)return;!function(f,b,e,v,n,t,s){if(f.fbq)return;n=f.fbq=function(){n.callMethod?n.callMethod.apply(n,arguments):n.queue.push(arguments)};if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';n.queue=[];t=b.createElement(e);t.async=!0;t.src=v;s=b.getElementsByTagName(e)[0];s.parentNode.insertBefore(t,s)}(window,document,'script','https://connect.facebook.net/en_US/fbevents.js');fbq('init','1890669148223555');fbq('track','PageView');}function s(){('requestIdleCallback' in window)?requestIdleCallback(l,{timeout:3000}):setTimeout(l,1500);}if(document.readyState==='complete')s();else window.addEventListener('load',s,{once:true});})();`,
      },
      {
        src: "https://cdn.utmify.com.br/scripts/utms/latest.js",
        async: true,
        defer: true,
        "data-utmify-prevent-xcod-sck": "",
        "data-utmify-prevent-subids": "",
      },
      {
        type: "text/javascript",
        children: `(function(){window.pixelId="6a3b347d6c75180b75e7acf3";function l(){var a=document.createElement("script");a.setAttribute("async","");a.setAttribute("defer","");a.setAttribute("src","https://cdn.utmify.com.br/scripts/pixel/pixel.js");document.head.appendChild(a);}function s(){('requestIdleCallback' in window)?requestIdleCallback(l,{timeout:3000}):setTimeout(l,1500);}if(document.readyState==='complete')s();else window.addEventListener('load',s,{once:true});})();`,
      },
    ],
  }),
  shellComponent: RootShell,
  component: RootComponent,
  notFoundComponent: NotFoundComponent,
  errorComponent: ErrorComponent,
});

function RootShell({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt-BR">
      <head>
        <HeadContent />
      </head>
      <body>
        {children}
        <noscript>
          <img
            height="1"
            width="1"
            style={{ display: "none" }}
            src="https://www.facebook.com/tr?id=1890669148223555&ev=PageView&noscript=1"
            alt=""
          />
        </noscript>
        <Scripts />
      </body>
    </html>
  );
}

function RootComponent() {
  const { queryClient } = Route.useRouteContext();

  return (
    <QueryClientProvider client={queryClient}>
      <Outlet />
      <Toaster position="top-center" richColors />
    </QueryClientProvider>
  );
}
