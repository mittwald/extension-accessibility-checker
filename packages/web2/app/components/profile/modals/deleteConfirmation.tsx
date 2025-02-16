import {
  Action,
  ActionGroup,
  Button,
  Content,
  Heading,
  Modal,
  OverlayController,
  Section,
  Text,
} from "@mittwald/flow-react-components";
import { ScanProfile } from "../../../api/types.ts";
import { useRouter } from "@tanstack/react-router";
import { deleteProfile } from "../../../actions/profile.ts";

export const DeleteConfirmationModal = ({
  profile,
  controller,
}: {
  controller: OverlayController;
  profile: ScanProfile;
}) => {
  const router = useRouter();
  return (
    <Modal controller={controller}>
      <Heading slot="title">Profil löschen</Heading>
      <Content>
        <Section>
          <Text>
            Bist Du, dass Du das Profil <strong>{profile.name}</strong> löschen
            willst? Mit dem Profil werden alle dafür durchgeführten Scans
            gelöscht.
          </Text>
        </Section>
      </Content>
      <ActionGroup>
        <Action action={controller.close}>
          <Action
            action={async () => {
              await deleteProfile({ data: profile._id });
              router.invalidate();
            }}
          >
            <Button color="danger">Profil löschen</Button>
          </Action>
          <Button variant="soft" color="secondary">
            Abbrechen
          </Button>
        </Action>
      </ActionGroup>
    </Modal>
  );
};
