import { NotFoundRouteComponent } from "@tanstack/react-router";
import { RootDocument } from "./rootDocument.js";
import { LayoutCard, Text } from "@mittwald/flow-remote-react-components";

export const NotFoundRoot: NotFoundRouteComponent = ({ data }) => {
  console.error(data);
  return (
    <LayoutCard>
      <Text>404 – Nicht gefunden</Text>
    </LayoutCard>
  );
};
