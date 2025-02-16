import { ScanProfile } from "../../api/types.ts";
import { Button, useOverlayController } from "@mittwald/flow-react-components";
import { RenameProfileModal } from "./modals/renameProfileModal.tsx";

export function RenameProfileButton({ profile }: { profile: ScanProfile }) {
  const renameModalController = useOverlayController("Modal");
  return (
    <>
      <Button
        variant="outline"
        slot="secondary"
        color="light"
        size="m"
        onPress={renameModalController.open}
      >
        Umbenennen
      </Button>
      <RenameProfileModal
        profile={profile}
        controller={renameModalController}
      />
    </>
  );
}
