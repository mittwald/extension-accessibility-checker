import { ScanProfile } from "../../api/types.ts";
import { useRouter } from "@tanstack/react-router";
import {
  deletionDays,
  isRunning,
  isRunningOrPending,
  isScanResultExpired,
} from "./helpers.ts";
import {
  Button,
  Heading,
  Icon,
  IllustratedMessage,
  LoadingSpinner,
  ProgressBar,
  Text,
} from "@mittwald/flow-remote-react-components";
import { IconClockX, IconWorldSearch } from "@tabler/icons-react";
import { startScan } from "../../actions/scan.ts";
import { useProfileData } from "../../hooks/useProfileData.tsx";

export function NoScans({ profile }: { profile: ScanProfile }) {
  const router = useRouter();
  const { lastSuccessfulScan } = useProfileData();

  if (isRunningOrPending(profile.nextScan)) {
    const scan = profile.nextScan!;

    return (
      <IllustratedMessage>
        <LoadingSpinner size="l" />
        {isRunning(profile.nextScan!) ? (
          <>
            <Heading wrap="balance">Scan wird ausgeführt …</Heading>
            <Text wrap="balance">
              Der Barrierefreiheits-Score wird ermittelt. Je nach Anzahl der
              Seiten kann das einen Moment dauern.
            </Text>
            {scan.scannedPages > 0 && (
              <ProgressBar
                formatOptions={{ style: "decimal" }}
                maxValue={scan.pages.length}
                showMaxValue
                value={scan.scannedPages}
              />
            )}
          </>
        ) : (
          <Heading wrap="balance">Scan wird in Kürze gestartet …</Heading>
        )}
      </IllustratedMessage>
    );
  }

  const isExpired = isScanResultExpired(profile, lastSuccessfulScan);

  return (
    <IllustratedMessage>
      {isExpired ? (
        <>
          <Icon>
            <IconClockX />
          </Icon>
          <Heading>Scan-Ergebnis gelöscht</Heading>
          <Text wrap="balance">
            Scan-Ergebnisse werden nach {deletionDays} Tagen automatisch
            gelöscht. Starte einen neuen Scan, um ein aktuelles Ergebnis zu
            erhalten.
          </Text>
        </>
      ) : (
        <>
          <Icon>
            <IconWorldSearch />
          </Icon>
          <Heading>Los geht’s!</Heading>
          <Text wrap="balance">Der Scan wurde noch nicht ausgeführt.</Text>
        </>
      )}
      <Button
        color="success"
        onPress={async () => {
          await startScan({ data: { profileId: profile._id.toString() } });
          await router.invalidate({ sync: true });
        }}
      >
        Scan starten
      </Button>
    </IllustratedMessage>
  );
}
