import { NotFoundRouteComponent } from "@tanstack/react-router";
import { RootDocument } from "./rootDocument.js";

export const NotFoundRoot: NotFoundRouteComponent = ({ data }) => {
  console.error(data);
  return (
    <RootDocument>
      <p>404 – Nicht gefunden</p>
    </RootDocument>
  );
};
