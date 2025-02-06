import { Icon } from "@mittwald/flow-react-components/Icon";
import { IconAccessible } from "@tabler/icons-react";
import { Heading } from "@mittwald/flow-react-components/Heading";
import Text from "@mittwald/flow-react-components/Text";
import ActionGroup from "@mittwald/flow-react-components/ActionGroup";
import Link from "@mittwald/flow-react-components/Link";
import Button from "@mittwald/flow-react-components/Button";
import { IllustratedMessage } from "@mittwald/flow-react-components/IllustratedMessage";

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
        <Link href="/profiles/67a27257499e57138e2c2d91">Anzeigen</Link>
        <Button>Profil anlegen</Button>
      </ActionGroup>
    </IllustratedMessage>
  );
};
