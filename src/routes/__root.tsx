import { Outlet, Link, createRootRoute, HeadContent, Scripts } from "@tanstack/react-router";
import { AuthProvider } from "@/hooks/useAuth";
import { Toaster } from "@/components/ui/sonner";

import appCss from "../styles.css?url";

function NotFoundComponent() {
  return (
    <div className="flex min-h-screen items-center justify-center px-4">
      <div className="neo-card max-w-md p-8 text-center">
        <h1 className="font-display text-7xl font-extrabold">404</h1>
        <h2 className="mt-4 font-display text-2xl font-bold">Página no encontrada</h2>
        <p className="mt-2 text-sm text-muted-foreground">Quizás se mudó o nunca existió.</p>
        <Link to="/" className="neo-btn mt-6 inline-block rounded-lg bg-primary px-4 py-2 text-sm font-bold text-primary-foreground">
          Volver al inicio
        </Link>
      </div>
    </div>
  );
}

export const Route = createRootRoute({
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      { title: "ECE — Exchange Collaborative Students" },
      { name: "description", content: "La red social donde los estudiantes enseñan y aprenden compartiendo lo que saben. Gana puntos, sube de nivel y crece junto a tu comunidad." },
      { property: "og:title", content: "ECE — Exchange Collaborative Students" },
      { property: "og:description", content: "La red social donde los estudiantes enseñan y aprenden compartiendo lo que saben. Gana puntos, sube de nivel y crece junto a tu comunidad." },
      { property: "og:type", content: "website" },
      { name: "twitter:title", content: "ECE — Exchange Collaborative Students" },
      { name: "twitter:description", content: "La red social donde los estudiantes enseñan y aprenden compartiendo lo que saben. Gana puntos, sube de nivel y crece junto a tu comunidad." },
      { property: "og:image", content: "https://storage.googleapis.com/gpt-engineer-file-uploads/attachments/og-images/60979da0-a343-4d07-9b4e-75b02caf3414" },
      { name: "twitter:image", content: "https://storage.googleapis.com/gpt-engineer-file-uploads/attachments/og-images/60979da0-a343-4d07-9b4e-75b02caf3414" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
    links: [{ rel: "stylesheet", href: appCss }],
  }),
  shellComponent: RootShell,
  component: RootComponent,
  notFoundComponent: NotFoundComponent,
});

function RootShell({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es">
      <head><HeadContent /></head>
      <body>
        {children}
        <Scripts />
      </body>
    </html>
  );
}

function RootComponent() {
  return (
    <AuthProvider>
      <Outlet />
      <Toaster />
    </AuthProvider>
  );
}
