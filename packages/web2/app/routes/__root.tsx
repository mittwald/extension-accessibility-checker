// app/routes/__root.tsx
import { createRootRoute, Outlet, useNavigate } from "@tanstack/react-router";
import { ErrorRoot } from "../components/errorRoot.tsx";
import { RootDocument } from "../components/rootDocument.tsx";
import { NotFoundRoot } from "../components/notFoundRoot.js";
import RemoteRoot from "@mittwald/flow-remote-react-components/RemoteRoot";

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
  }),
  component: RootComponent,
  errorComponent: ErrorRoot,
  notFoundComponent: NotFoundRoot,
});

function RootComponent() {
  const navigate = useNavigate();

  return (
    <RootDocument>
      <RemoteRoot
        onHostPathnameChanged={(path) => {
          console.log("onHostPathnameChanged", path);
          return navigate({
            to: path,
          });
        }}
      >
        <Outlet />
      </RemoteRoot>
    </RootDocument>
  );
}
