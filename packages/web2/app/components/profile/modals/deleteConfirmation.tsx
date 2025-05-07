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
} from "@mittwald/flow-remote-react-components";
import { ScanProfile } from "../../../api/types.ts";
import { deleteProfile } from "../../../actions/profile.ts";

export const DeleteConfirmationModal = ({
  profile,
  controller,
  onDelete,
}: {
  controller: OverlayController;
  profile: ScanProfile;
  onDelete?: () => Promise<void> | void;
}) => {
  return (
    <Modal controller={controller}>
      <Heading slot="title">Profil löschen</Heading>
      <Content>
        <Section>
          <Text>
            Bist Du sicher, dass Du das Profil <strong>{profile.name}</strong>{" "}
            löschen willst? Mit dem Profil werden alle dafür durchgeführten
            Scans gelöscht.
          </Text>
        </Section>
      </Content>
      <ActionGroup>
        <Action action={controller.close}>
          <Action
            action={async () => {
              await deleteProfile({ data: profile._id });
              await onDelete?.();
            }}
          >
            <Button color="danger">Löschen</Button>
          </Action>
          <Button variant="soft" color="secondary">
            Abbrechen
          </Button>
        </Action>
      </ActionGroup>
    </Modal>
  );
};
