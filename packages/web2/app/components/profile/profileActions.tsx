import { ScanProfile } from "../../api/types.ts";
import {
  Button,
  IconContextMenu,
  useOverlayController,
  ContextMenuTrigger,
  ContextMenu,
  IconChevronDown,
  MenuItem,
  Icon,
  IconEdit,
  IconDelete,
} from "@mittwald/flow-react-components";
import { RenameProfileModal } from "./modals/renameProfileModal.tsx";
import { startScan } from "../../actions/scan.ts";
import { IconWorldSearch } from "@tabler/icons-react";
import { useRouter } from "@tanstack/react-router";
import { DeleteConfirmationModal } from "./modals/deleteConfirmation.tsx";

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
        <MenuItem onAction={deleteModalController.open}>
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
  const renameModalController = useOverlayController("Modal");
  return (
    <ContextMenuTrigger>
      <Button variant="outline" slot="secondary" color="light" size="m">
        Aktionen <IconChevronDown />
      </Button>
      <ProfileActionsContextMenu profile={profile} />
    </ContextMenuTrigger>
  );

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
