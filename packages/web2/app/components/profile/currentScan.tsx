import { Route } from "../../routes/profiles.$profileId.tsx";
import {
  Alert,
  Align,
  LoadingSpinner,
  Text,
} from "@mittwald/flow-remote-react-components";
import { isPending, isRunning } from "./helpers.ts";

const RunningScan = () => {
  return (
    <Alert>
      <Align>
        <LoadingSpinner size="m"></LoadingSpinner>
        <Text>Scan wird ausgeführt …</Text>
      </Align>
    </Alert>
  );
};

const PendingScan = () => {
  return (
    <Alert>
      <Align>
        <LoadingSpinner size="m"></LoadingSpinner>
        <Text>Scan wird in Kürze gestartet …</Text>
      </Align>
    </Alert>
  );
};

export const CurrentScan = () => {
  const {
    profile: { nextScan },
  } = Route.useLoaderData();

  if (!nextScan) {
    console.warn("Kein Scan geplant!");
    return null;
  }

  if (isRunning(nextScan)) {
    return <RunningScan />;
  }

  if (isPending(nextScan)) {
    return <PendingScan />;
  }

  return <></>;
};
