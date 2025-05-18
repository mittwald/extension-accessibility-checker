import {
  ActionGroup,
  Button,
  Heading,
  Icon,
  IllustratedMessage,
  ModalTrigger,
  Text,
} from "@mittwald/flow-remote-react-components";
import { IconAccessible } from "@tabler/icons-react";
import { CreateModal } from "../create/createModal.tsx";

export const NoProfiles = () => {
  return (
    <IllustratedMessage>
      <Icon>
        <IconAccessible />
      </Icon>
      <Heading>Scanprofil anlegen</Heading>
      <Text wrap="balance">
        Lege ein Scanprofil an und erhalte eine Barrierefreiheitsbewertung
        deiner Webseite gemäß der WCAG-Standards.
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
