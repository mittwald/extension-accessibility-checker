import {
  Alert,
  Button,
  Content,
  Heading,
  ModalTrigger,
} from "@mittwald/flow-remote-react-components";
import { EditIntervalModal } from "../../../modals/EditIntervalModal.tsx";
import { FC } from "react";
import { ScanProfile } from "~/api/types.ts";

export interface Props {
  profile: ScanProfile;
}

export const SaveResourcesBanner: FC<Props> = ({ profile }) => {
  return (
    <Alert>
      <Heading>Gemeinsam Ressourcen sparen</Heading>
      <Content>
        Seit dem 06.08.2025 ist der automatische Tages-Check für neue Profile
        deaktiviert, um den ökologischen Fußabdruck zu senken. Bitte prüfe, ob
        dieses Profil weiterhin ein tägliches Intervall braucht und passe die
        Einstellung bei Bedarf an.
      </Content>
      <ModalTrigger>
        <Button color="primary" variant="solid" size="s">
          Intervall bearbeiten
        </Button>
        <EditIntervalModal profile={profile} />
      </ModalTrigger>
    </Alert>
  );
};
