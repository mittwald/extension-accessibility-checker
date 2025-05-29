import { ScanProfile } from "../../api/types.ts";
import { useGoToProfile } from "../../hooks/useGoTo.tsx";
import { useRouter } from "@tanstack/react-router";
import {
  ContextMenu,
  Icon,
  IconDelete,
  IconEdit,
  IconInfo,
  MenuItem,
  useOverlayController,
} from "@mittwald/flow-remote-react-components";
import { startScan } from "../../actions/scan.ts";
import { IconWorldSearch } from "@tabler/icons-react";
import { RenameProfileModal } from "../profile/modals/renameProfileModal.tsx";
import { DeleteConfirmationModal } from "../profile/modals/deleteConfirmation.tsx";
import { isRunningOrPending } from "../profile/helpers.ts";

export function ProfileListContextMenu({ profile }: { profile: ScanProfile }) {
  const goToProfile = useGoToProfile();
  const router = useRouter();
  const renameModalController = useOverlayController("Modal");
  const deleteModalController = useOverlayController("Modal");

  return (
    <>
      <ContextMenu>
        <MenuItem onAction={() => goToProfile(profile)}>
          <IconInfo />
          Details anzeigen
        </MenuItem>
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
      </ContextMenu>
      <RenameProfileModal
        controller={renameModalController}
        profile={profile}
      />
      <DeleteConfirmationModal
        profile={profile}
        controller={deleteModalController}
        onDelete={() => router.invalidate({ sync: true })}
      />
    </>
  );
}
