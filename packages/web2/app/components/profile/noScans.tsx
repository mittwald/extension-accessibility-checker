import { ScanProfile } from "../../api/types.ts";
import { useRouter } from "@tanstack/react-router";
import { isRunning, isRunningOrPending } from "./helpers.ts";
import {
  Button,
  Heading,
  Icon,
  IllustratedMessage,
  LoadingSpinner,
  Text,
} from "@mittwald/flow-remote-react-components";
import { IconWorldSearch } from "@tabler/icons-react";
import { startScan } from "../../actions/scan.ts";

export function NoScans({ profile }: { profile: ScanProfile }) {
  const router = useRouter();

  if (isRunningOrPending(profile.nextScan)) {
    return (
      <IllustratedMessage>
        <LoadingSpinner size="l" />
        {isRunning(profile.nextScan!) ? (
          <>
            <Heading>Scan wird ausgeführt …</Heading>
            <Text>
              Der Barrierefreiheits-Score wird ermittelt. Je nach Anzahl der
              Seiten kann das einen Moment dauern.
            </Text>
          </>
        ) : (
          <Heading>Scan wird in Kürze gestartet …</Heading>
        )}
      </IllustratedMessage>
    );
  }

  return (
    <IllustratedMessage>
      <Icon>
        <IconWorldSearch />
      </Icon>
      <Heading>Los geht’s!</Heading>
      <Text>Der Scan wurde noch nicht ausgeführt.</Text>
      <Button
        color="accent"
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
