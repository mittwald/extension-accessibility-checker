// app/routes/__root.tsx
import { createRootRoute, Outlet } from "@tanstack/react-router";
import { ErrorRoot } from "../components/errorRoot.tsx";
import { RootDocument } from "../components/rootDocument.tsx";
import flowCss from "@mittwald/flow-react-components/all.css?url";

export const Route = createRootRoute({
  head: () => ({
    meta: [
      {
        charSet: "utf-8",
      },
      {
        name: "viewport",
        content: "width=device-width, initial-scale=1",
      },
      {
        title: "A11y Checker",
      },
    ],
    links: [{ rel: "stylesheet", href: flowCss }],
  }),
  component: RootComponent,
  errorComponent: ErrorRoot,
});

function RootComponent() {
  return (
    <RootDocument>
      <Outlet />
    </RootDocument>
  );
}
