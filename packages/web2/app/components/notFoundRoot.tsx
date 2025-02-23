import { NotFoundRouteComponent } from "@tanstack/react-router";
import { RootDocument } from "./rootDocument.js";
import {
  Heading,
  IconSearch,
  IllustratedMessage,
  LayoutCard,
  Link,
} from "@mittwald/flow-react-components";

export const NotFoundRoot: NotFoundRouteComponent = ({ data }) => {
  console.error(data);
  return (
    <RootDocument>
      <LayoutCard>
        <IllustratedMessage>
          <IconSearch />
          <Heading>404 - Nicht gefunden</Heading>
          <Link href="/">Zur Startseite</Link>
        </IllustratedMessage>
      </LayoutCard>
    </RootDocument>
  );
};
