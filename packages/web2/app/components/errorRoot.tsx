import { ErrorRouteComponent } from "@tanstack/react-router";
import { RootDocument } from "./rootDocument.tsx";

export const ErrorRoot: ErrorRouteComponent = ({ error, info }) => {
  return (
    <RootDocument>
      <p>Fehler</p>
      <pre>{JSON.stringify(info, null, 2)}</pre>
      <pre>{JSON.stringify(error, null, 2)}</pre>
      {String(error)}
    </RootDocument>
  );
};
