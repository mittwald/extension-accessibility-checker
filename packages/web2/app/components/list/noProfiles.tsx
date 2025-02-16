import {
  ActionGroup,
  Button,
  Heading,
  Icon,
  IllustratedMessage,
  ModalTrigger,
  Text,
} from "@mittwald/flow-react-components";
import { IconAccessible } from "@tabler/icons-react";
import { CreateModal } from "../create/createModal.tsx";

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
        <ModalTrigger>
          <Button>Profil anlegen</Button>
          <CreateModal />
        </ModalTrigger>
      </ActionGroup>
    </IllustratedMessage>
  );
};
