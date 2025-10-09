// app/routes/__root.tsx
import { createRootRoute, Outlet, useNavigate } from "@tanstack/react-router";
import { ErrorRoot } from "~/components/errorRoot";
import { RootDocument } from "~/components/rootDocument";
import { NotFoundRoot } from "~/components/notFoundRoot";
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
