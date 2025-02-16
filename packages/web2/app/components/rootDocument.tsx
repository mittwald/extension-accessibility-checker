import type { ReactNode } from "react";
import { HeadContent, Scripts } from "@tanstack/react-router";

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
