import { ScanProfile } from "../../api/types.ts";
import {
  Button,
  ContextMenu,
  ContextMenuTrigger,
  Icon,
  IconChevronDown,
  IconDelete,
  IconEdit,
  MenuItem,
  Text,
  useOverlayController,
} from "@mittwald/flow-react-components";
import { RenameProfileModal } from "./modals/renameProfileModal.tsx";
import { startScan } from "../../actions/scan.ts";
import { IconWorldSearch } from "@tabler/icons-react";
import { useRouter } from "@tanstack/react-router";
import { DeleteConfirmationModal } from "./modals/deleteConfirmation.tsx";
import { isRunningOrPending } from "./helpers.ts";

const ProfileActionsContextMenu = ({ profile }: { profile: ScanProfile }) => {
  const router = useRouter();
  const renameModalController = useOverlayController("Modal");
  const deleteModalController = useOverlayController("Modal");

  return (
    <>
      <ContextMenu>
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
        profile={profile}
        controller={renameModalController}
      />
      <DeleteConfirmationModal
        profile={profile}
        controller={deleteModalController}
      />
    </>
  );
};

export function ProfileActions({ profile }: { profile: ScanProfile }) {
  return (
    <ContextMenuTrigger>
      <Button variant="outline" slot="secondary" color="light" size="m">
        <Text>Aktionen</Text>
        <IconChevronDown />
      </Button>
      <ProfileActionsContextMenu profile={profile} />
    </ContextMenuTrigger>
  );
}
