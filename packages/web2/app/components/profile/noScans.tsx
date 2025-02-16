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
} from "@mittwald/flow-react-components";
import { IconWorldSearch } from "@tabler/icons-react";
import { startScan } from "../../actions/scan.ts";

export function NoScans({ profile }: { profile: ScanProfile }) {
  const router = useRouter();

  if (isRunningOrPending(profile.nextScan)) {
    const text = isRunning(profile.nextScan!)
      ? "Scan wird ausgeführt …"
      : "Scan wird in Kürze gestartet …";
    return (
      <IllustratedMessage>
        <LoadingSpinner size="l" />
        <Heading>{text}</Heading>
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
          await startScan({ data: profile._id.toString() });
          await router.invalidate({ sync: true });
        }}
      >
        Scan starten
      </Button>
    </IllustratedMessage>
  );
}
