import { NotFoundRouteComponent } from "@tanstack/react-router";
import { LayoutCard, Text } from "@mittwald/flow-remote-react-components";

export const NotFound: NotFoundRouteComponent = ({ data }) => {
  console.error(data);
  return (
    <LayoutCard>
      <Text>404 – Nicht gefunden</Text>
    </LayoutCard>
  );
};
