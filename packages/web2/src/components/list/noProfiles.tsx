import { Icon } from "@mittwald/flow-react-components";
import { IconAccessible } from "@tabler/icons-react";
import { Heading } from "@mittwald/flow-react-components";
import { Text } from "@mittwald/flow-react-components";
import { ActionGroup } from "@mittwald/flow-react-components";
import { Button } from "@mittwald/flow-react-components";
import { IllustratedMessage } from "@mittwald/flow-react-components";
import { Link } from "@tanstack/react-router";

export const NoProfiles = () => {
  return (
    <IllustratedMessage>
      <Icon>
        <IconAccessible />
      </Icon>
      <Heading>Scanprofil anlegen</Heading>
      <Text>
        Lege ein Bewertungsprofil für deine Website an, um einen
        Barrierefreiheitsbewertung basierend auf den WCAG-Richtlinien zu
        ermitteln.
      </Text>
      <ActionGroup>
        <Link
          to="/profiles/$profileId/$tabId"
          params={{ profileId: "67a27257499e57138e2c2d91", tabId: "overview" }}
        >
          Anzeigen
        </Link>
        <Button>Profil anlegen</Button>
      </ActionGroup>
    </IllustratedMessage>
  );
};
