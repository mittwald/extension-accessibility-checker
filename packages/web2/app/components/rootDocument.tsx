import type { ReactNode } from "react";
import { HeadContent } from "@tanstack/react-router";
import { Scripts } from "@tanstack/start";

export function RootDocument({ children }: Readonly<{ children: ReactNode }>) {
  return (
    <html>
      <head>
        <HeadContent />
      </head>
      <body style={{ backgroundColor: "#00205C" }}>
        {children}
        <Scripts />
      </body>
    </html>
  );
}
