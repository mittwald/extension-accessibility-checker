import { NotFoundRouteComponent } from "@tanstack/react-router";
import { RootDocument } from "./rootDocument.tsx";
import { NotFound } from "./notFound.tsx";

export const NotFoundRoot: NotFoundRouteComponent = (props) => {
  return (
    <RootDocument>
      <NotFound {...props} />
    </RootDocument>
  );
};
