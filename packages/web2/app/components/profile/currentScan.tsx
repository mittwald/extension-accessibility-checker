import { useProfileData } from "../../hooks/useProfileData.tsx";
import {
  Alert,
  Combine,
  Label,
  LoadingSpinner,
  ProgressBar,
  Text,
} from "@mittwald/flow-remote-react-components";
import type { Scan } from "../../api/types.ts";
import { isPending, isRunning } from "./helpers.ts";

const RunningScan = ({ scan }: { scan: Scan }) => {
  const totalPages = scan.pages.length;

  if (totalPages === 0) {
    return (
      <Alert>
        <Combine>
          <LoadingSpinner size="m"></LoadingSpinner>
          <Text>Scan wird ausgeführt …</Text>
        </Combine>
      </Alert>
    );
  }

  const scannedPages = scan.scannedPages ?? 0;

  return (
    <Alert>
      <ProgressBar
        formatOptions={{ style: "decimal" }}
        maxValue={totalPages}
        showMaxValue
        value={scannedPages}
      >
        <Label>Scan wird ausgeführt …</Label>
      </ProgressBar>
    </Alert>
  );
};

const PendingScan = () => {
  return (
    <Alert>
      <Combine>
        <LoadingSpinner size="m"></LoadingSpinner>
        <Text>Scan wird in Kürze gestartet …</Text>
      </Combine>
    </Alert>
  );
};

export const CurrentScan = () => {
  const {
    profile: { nextScan },
  } = useProfileData();

  if (!nextScan) {
    return null;
  }

  if (isRunning(nextScan)) {
    return <RunningScan scan={nextScan} />;
  }

  if (isPending(nextScan)) {
    return <PendingScan />;
  }

  return <></>;
};
