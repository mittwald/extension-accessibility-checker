import { FC } from "react";
import {
  ActionGroup,
  Alert,
  Button,
  Content,
  Heading,
  ModalTrigger,
  Text,
} from "@mittwald/flow-remote-react-components";
import { useProfileData } from "../../../../hooks/useProfileData.tsx";
import {
  deletionDays,
  getDeletionDate,
  isDeletionDateSoon,
} from "../../helpers.ts";
import { StartScanButton } from "../settings/components/StartScanButton.tsx";
import { EditIntervalModal } from "../../modals/EditIntervalModal.tsx";

export const CurrentScanDeletionAlert: FC = () => {
  const { lastSuccessfulScan, profile } = useProfileData();

  const deletionDate = getDeletionDate(lastSuccessfulScan);
  const isDeletedSoon = isDeletionDateSoon(lastSuccessfulScan);

  if (!isDeletedSoon || !deletionDate) {
    return null;
  }

  return (
    <Alert status="warning">
      <Heading>Löschung nach {deletionDays} Tagen</Heading>
      <Content>
        <Text>
          Der letzte Scan ist bald {deletionDays} Tage alt und das Ergebnis wird{" "}
          <strong>am {deletionDate.toFormat("dd.MM.yyyy")} gelöscht.</strong>{" "}
          Aktualisiere das Ergebnis, indem du einen neuen Scan startest oder
          konfiguriere einen Intervall, um jederzeit das aktuellste Ergebnis
          deiner Scans zu sehen.
        </Text>
        <ActionGroup>
          <StartScanButton text="Scan jetzt starten" profile={profile} />
          <ModalTrigger>
            <Button color="secondary" variant="soft">
              Intervall bearbeiten
            </Button>
            <EditIntervalModal profile={profile} />
          </ModalTrigger>
        </ActionGroup>
      </Content>
    </Alert>
  );
};
