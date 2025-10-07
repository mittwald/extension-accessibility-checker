import { FC } from "react";
import { BaseProps } from "./types.js";
import { useRouter } from "@tanstack/react-router";
import { Action, Button } from "@mittwald/flow-remote-react-components";
import { startScan } from "~/actions/scan";

export const RestartScanButton: FC<BaseProps> = ({ profile, scanId }) => {
  const router = useRouter();
  return (
    <Action
      onAction={async () => {
        await startScan({
          data: { profileId: profile._id.toString(), restartedScan: scanId },
        });
        await router.invalidate({ sync: true });
      }}
    >
      <Button variant="soft" color="secondary">
        Scan erneut starten
      </Button>
    </Action>
  );
};
