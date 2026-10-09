import { FC } from "react";
import { Alert, Heading, Text } from "@mittwald/flow-remote-react-components";
import { useProfileData } from "../../../../hooks/useProfileData.tsx";
import {
  deletionDays,
  getDeletionDate,
  isDeletionDateSoon,
} from "../../helpers.ts";

export const CurrentScanDeletionAlert: FC = () => {
  const { lastSuccessfulScan } = useProfileData();

  const deletionDate = getDeletionDate(lastSuccessfulScan);
  const isDeletedSoon = isDeletionDateSoon(lastSuccessfulScan);

  if (!isDeletedSoon || !deletionDate) {
    return null;
  }

  return (
    <Alert status="warning">
      <Heading>Löschung nach {deletionDays} Tagen</Heading>
      <Text>
        Der letzte Scan ist bald {deletionDays} Tage alt und das Ergebnis wird{" "}
        <strong>am {deletionDate.toFormat("dd.MM.yyyy")} gelöscht.</strong>{" "}
        Stelle einen Intervall ein, um jederzeit das aktuellste Ergebnis deiner
        Scans zu sehen.
      </Text>
    </Alert>
  );
};
