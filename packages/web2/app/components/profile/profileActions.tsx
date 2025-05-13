import { ScanProfile } from "../../api/types.ts";
import {
  Icon,
  IconDelete,
  IconEdit,
  MenuItem,
  useOverlayController,
} from "@mittwald/flow-remote-react-components";
import { RenameProfileModal } from "./modals/renameProfileModal.tsx";
import { startScan } from "../../actions/scan.ts";
import { IconWorldSearch } from "@tabler/icons-react";
import { useRouter } from "@tanstack/react-router";
import { DeleteConfirmationModal } from "./modals/deleteConfirmation.tsx";
import { isRunningOrPending } from "./helpers.ts";
import { useGoToRoot } from "../../hooks/useGoTo.js";
import { Actions } from "@mittwald/mstudio-ext-react-components";

export function ProfileActions({ profile }: { profile: ScanProfile }) {
  const router = useRouter();
  const goToRoot = useGoToRoot();
  const renameModalController = useOverlayController("Modal");
  const deleteModalController = useOverlayController("Modal");

  return (
    <>
      <Actions>
        <MenuItem
          onAction={async () => {
            await startScan({ data: { profileId: profile._id.toString() } });
            await router.invalidate({ sync: true });
          }}
          isDisabled={isRunningOrPending(profile.nextScan)}
        >
          <Icon>
            <IconWorldSearch />
          </Icon>
          Scan starten
        </MenuItem>
        <MenuItem onAction={renameModalController.open}>
          <IconEdit />
          Umbenennen
        </MenuItem>
        <MenuItem
          onAction={deleteModalController.open}
          isDisabled={isRunningOrPending(profile.nextScan)}
        >
          <IconDelete />
          Löschen
        </MenuItem>
      </Actions>
      <RenameProfileModal
        profile={profile}
        controller={renameModalController}
      />
      <DeleteConfirmationModal
        profile={profile}
        controller={deleteModalController}
        onDelete={() => goToRoot()}
      />
    </>
  );
}
