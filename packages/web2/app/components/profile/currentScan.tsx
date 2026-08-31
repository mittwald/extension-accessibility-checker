import { Route } from "../../routes/profiles.$profileId.tsx";
import {
  Alert,
  Combine,
  LoadingSpinner,
  Text,
} from "@mittwald/flow-remote-react-components";
import { isPending, isRunning } from "./helpers.ts";

const RunningScan = () => {
  return (
    <Alert>
      <Combine>
        <LoadingSpinner size="m"></LoadingSpinner>
        <Text>Scan wird ausgeführt …</Text>
      </Combine>
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
  } = Route.useLoaderData();

  if (!nextScan) {
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
