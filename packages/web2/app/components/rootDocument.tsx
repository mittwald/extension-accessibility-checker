import type { ReactNode } from "react";
import { HeadContent, Scripts } from "@tanstack/react-router";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

export function RootDocument({ children }: Readonly<{ children: ReactNode }>) {
  const queryClient = new QueryClient();

  return (
    <html>
      <head>
        <HeadContent />
      </head>
      <QueryClientProvider client={queryClient}>
        <body style={{ backgroundColor: "#00205C" }}>
          {children}
          <Scripts />
        </body>
      </QueryClientProvider>
    </html>
  );
}
