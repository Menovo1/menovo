import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import {
  Outlet,
  createRootRouteWithContext,
  useRouter,
  useRouterState,
  HeadContent,
  Scripts,
} from "@tanstack/react-router";
import { useEffect, type ReactNode } from "react";

import appCss from "../styles.css?url";
import { reportLovableError } from "../lib/lovable-error-reporting";
import { Navbar } from "@/components/site/Navbar";
import { Footer } from "@/components/site/Footer";
import { WhatsAppButton } from "@/components/site/WhatsAppButton";

function NotFoundComponent() {
  return (
    <div className="min-h-screen flex items-center justify-center px-4 bg-background">
      <div className="text-center max-w-md">
        <div className="text-8xl font-bold text-gradient-gold font-display">404</div>
        <h1 className="mt-6 text-2xl font-semibold">This page has left the table.</h1>
        <p className="mt-3 text-muted-foreground">The page you're looking for doesn't exist.</p>
        <a href="/" className="mt-8 inline-flex items-center justify-center rounded-full btn-gold px-6 py-3">
          Return home
        </a>
      </div>
    </div>
  );
}

function ErrorComponent({ error, reset }: { error: Error; reset: () => void }) {
  console.error(error);
  const router = useRouter();
  useEffect(() => {
    reportLovableError(error, { boundary: "tanstack_root_error_component" });
  }, [error]);
  return (
    <div className="min-h-screen flex items-center justify-center px-4 bg-background">
      <div className="text-center max-w-md">
        <h1 className="text-2xl font-semibold">Something went wrong</h1>
        <p className="mt-3 text-muted-foreground">Please try again.</p>
        <button
          onClick={() => { router.invalidate(); reset(); }}
          className="mt-8 inline-flex items-center justify-center rounded-full btn-gold px-6 py-3"
        >
          Try again
        </button>
      </div>
    </div>
  );
}

export const Route = createRootRouteWithContext<{ queryClient: QueryClient }>()({
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      { title: "MENOVO — From Table to Screen | Hospitality Websites & QR Menus" },
      { name: "description", content: "Premium websites and digital QR menus for hotels, restaurants and cafés. Honest pricing, luxury design, fast delivery." },
      { name: "author", content: "MENOVO" },
      { name: "theme-color", content: "#001229" },
      { property: "og:title", content: "MENOVO — From Table to Screen | Hospitality Websites & QR Menus" },
      { property: "og:description", content: "Premium websites and digital QR menus for hotels, restaurants and cafés. Honest pricing, luxury design, fast delivery." },
      { property: "og:type", content: "website" },
      { property: "og:site_name", content: "MENOVO" },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "twitter:title", content: "MENOVO — From Table to Screen | Hospitality Websites & QR Menus" },
      { name: "twitter:description", content: "Premium websites and digital QR menus for hotels, restaurants and cafés. Honest pricing, luxury design, fast delivery." },
      { property: "og:image", content: "https://storage.googleapis.com/gpt-engineer-file-uploads/attachments/og-images/f711e788-f43d-4ca2-8db9-edd41b94341a" },
      { name: "twitter:image", content: "https://storage.googleapis.com/gpt-engineer-file-uploads/attachments/og-images/f711e788-f43d-4ca2-8db9-edd41b94341a" },
    ],
    scripts: [
      {
        children: `(function(){try{var t=localStorage.getItem('menovo-theme');if(t==='dark'||(!t&&window.matchMedia('(prefers-color-scheme: dark)').matches)){document.documentElement.classList.add('dark')}}catch(e){}})();`,
      },
      {
        src: "https://www.googletagmanager.com/gtag/js?id=G-MEEPRHCC73",
        async: true,
      },
      {
        children: `window.dataLayer = window.dataLayer || []; function gtag(){dataLayer.push(arguments);} gtag('js', new Date()); gtag('config', 'G-MEEPRHCC73');`,
      },
    ],
    links: [
      { rel: "stylesheet", href: appCss },
      { rel: "icon", type: "image/png", href: "/favicon.png" },
      { rel: "preconnect", href: "https://fonts.googleapis.com" },
      { rel: "preconnect", href: "https://fonts.gstatic.com", crossOrigin: "anonymous" },
      { rel: "stylesheet", href: "https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=Playfair+Display:wght@600;700;800;900&family=Space+Grotesk:wght@500;600;700&display=swap" },
    ],
  }),
  shellComponent: RootShell,
  component: RootComponent,
  notFoundComponent: NotFoundComponent,
  errorComponent: ErrorComponent,
});

function RootShell({ children }: { children: ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <HeadContent />
      </head>
      <body>
        {children}
        <Scripts />
      </body>
    </html>
  );
}

function RootComponent() {
  const { queryClient } = Route.useRouteContext();
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const isAdmin = pathname.startsWith("/admin");

  useEffect(() => {
    if (isAdmin) return;
    void import("@/lib/analytics.functions").then(({ trackPageView }) =>
      trackPageView({ data: { path: pathname, referrer: document.referrer } }).catch(() => {}),
    );
  }, [pathname, isAdmin]);

  if (isAdmin) {
    return (
      <QueryClientProvider client={queryClient}>
        <Outlet />
      </QueryClientProvider>
    );
  }

  return (
    <QueryClientProvider client={queryClient}>
      <div className="min-h-screen flex flex-col bg-background text-foreground">
        <Navbar />
        <main className="flex-1">
          <Outlet />
        </main>
        <Footer />
        <WhatsAppButton />
      </div>
    </QueryClientProvider>
  );
}
