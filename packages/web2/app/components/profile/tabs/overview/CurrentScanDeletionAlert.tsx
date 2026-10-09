import { FC } from "react";
import { Alert, Heading, Text } from "@mittwald/flow-remote-react-components";
import { useProfileData } from "../../../../hooks/useProfileData.tsx";
import { DateTime } from "luxon";

export const CurrentScanDeletionAlert: FC = () => {
  const { lastSuccessfulScan } = useProfileData();

  const expiryDays = 90;
  const warningDays = 14;

  const lastSuccessfulScanCompletionDate = lastSuccessfulScan?.completedAt;
  if (!lastSuccessfulScanCompletionDate) {
    return null;
  }

  const deletionDate = DateTime.fromJSDate(
    lastSuccessfulScanCompletionDate,
  ).plus({ days: expiryDays });
  const warningDate = deletionDate.minus({ days: warningDays });

  console.log(warningDate.toISO(), warningDate.diffNow().as("days"));

  if (warningDate.diffNow().as("days") > 0) {
    return null;
  }

  const deletionDateString = deletionDate.toFormat("dd.MM.yyyy");

  return (
    <Alert status="warning">
      <Heading>Löschung nach {expiryDays} Tagen</Heading>
      <Text>
        Der letzte Scan ist bald {expiryDays} Tage alt und wird{" "}
        <strong>am {deletionDateString} gelöscht.</strong> Stelle einen
        Intervall ein, um jederzeit den aktuellsten Scan deiner Seite zu sehen.
      </Text>
    </Alert>
  );
};
