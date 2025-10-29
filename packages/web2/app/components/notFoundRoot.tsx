import { NotFoundRouteComponent } from "@tanstack/react-router";
import { RootDocument } from "~/components/rootDocument.tsx";
import { NotFound } from "~/components/notFound.tsx";

export const NotFoundRoot: NotFoundRouteComponent = (props) => {
  return (
    <RootDocument>
      <NotFound {...props} />
    </RootDocument>
  );
};
