import {
  Content,
  Text,
  Heading,
  Modal,
  Section,
  ActionGroup,
  Action,
  Button,
  OverlayController,
} from "@mittwald/flow-react-components";
import { deleteProfile } from "../../../actions.ts";
import { ScanProfile } from "../../../api/types.ts";
import { useRouter } from "@tanstack/react-router";

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
      <Heading>Profil löschen</Heading>
      <Content>
        <Section>
          <Text>
            Sind Sie sicher, dass Sie das Profil <strong>{profile.name}</strong>{" "}
            löschen wollen? Mit dem Profil werden alle dafür durchgeführten
            Scans gelöscht.
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
