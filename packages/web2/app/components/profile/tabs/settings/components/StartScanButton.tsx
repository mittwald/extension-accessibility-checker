import { FC } from "react";
import { startScan } from "../../../../../actions/scan.ts";
import { isRunningOrPending } from "../../../helpers.ts";
import { Button } from "@mittwald/flow-remote-react-components";
import { ScanProfile } from "../../../../../api/types.ts";
import { useRouter } from "@tanstack/react-router";

interface Props {
  profile: ScanProfile;
  text?: string;
}

export const StartScanButton: FC<Props> = (props) => {
  const { profile, text } = props;
  const router = useRouter();

  const nextScan = profile.nextScan;
  return (
    <Button
      color="success"
      onPress={async () => {
        await startScan({ data: { profileId: profile._id } });
        await router.invalidate({ sync: true });
      }}
      isDisabled={isRunningOrPending(nextScan)}
    >
      {text ?? "Scan starten"}
    </Button>
  );
};
