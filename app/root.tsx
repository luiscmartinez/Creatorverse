import { useEffect, useState } from "react";
import {
  isRouteErrorResponse,
  Links,
  Meta,
  Scripts,
  ScrollRestoration,
} from "react-router";
import { Navigate, useRoutes } from "react-router-dom";

import type { Route } from "./+types/root";
import "./app.css";
import AddCreator from "./src/pages/AddCreator";
import EditCreator from "./src/pages/EditCreator";
import ShowCreators from "./src/pages/ShowCreators";
import ViewCreator from "./src/pages/ViewCreator";
import { supabase } from "./src/client.js";
import type { Creator } from "./src/types";

export const links: Route.LinksFunction = () => [
  { rel: "preconnect", href: "https://fonts.googleapis.com" },
  {
    rel: "preconnect",
    href: "https://fonts.gstatic.com",
    crossOrigin: "anonymous",
  },
  {
    rel: "stylesheet",
    href: "https://fonts.googleapis.com/css2?family=Inter:ital,opsz,wght@0,14..32,100..900;1,14..32,100..900&display=swap",
  },
];

export function Layout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <Meta />
        <Links />
      </head>
      <body>
        {children}
        <ScrollRestoration />
        <Scripts />
      </body>
    </html>
  );
}

export default function App() {
  const [creators, setCreators] = useState<Creator[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");

  const fetchCreators = async () => {
    setIsLoading(true);
    setErrorMessage("");

    const { data, error } = await supabase
      .from("creators")
      .select("*")
      .order("name", { ascending: true });

    if (error) {
      setErrorMessage(error.message);
      setCreators([]);
    } else {
      setCreators((data ?? []) as Creator[]);
    }

    setIsLoading(false);
  };

  useEffect(() => {
    void fetchCreators();
  }, []);

  return useRoutes([
    {
      path: "/",
      element: (
        <ShowCreators
          creators={creators}
          errorMessage={errorMessage}
          isLoading={isLoading}
          onRefresh={fetchCreators}
        />
      ),
    },
    {
      path: "/new",
      element: <AddCreator onCreatorAdded={fetchCreators} />,
    },
    {
      path: "/creator/:id",
      element: <ViewCreator />,
    },
    {
      path: "/creator/:id/edit",
      element: <EditCreator onCreatorChanged={fetchCreators} />,
    },
    {
      path: "*",
      element: <Navigate to="/" replace />,
    },
  ]);
}

export function ErrorBoundary({ error }: Route.ErrorBoundaryProps) {
  let message = "Oops!";
  let details = "An unexpected error occurred.";
  let stack: string | undefined;

  if (isRouteErrorResponse(error)) {
    message = error.status === 404 ? "404" : "Error";
    details =
      error.status === 404
        ? "The requested page could not be found."
        : error.statusText || details;
  } else if (import.meta.env.DEV && error && error instanceof Error) {
    details = error.message;
    stack = error.stack;
  }

  return (
    <main className="pt-16 p-4 container mx-auto">
      <h1>{message}</h1>
      <p>{details}</p>
      {stack && (
        <pre className="w-full p-4 overflow-x-auto">
          <code>{stack}</code>
        </pre>
      )}
    </main>
  );
}
