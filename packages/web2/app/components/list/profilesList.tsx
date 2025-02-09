import { ScanProfile } from "../../api/types.ts";
import {
  ActionGroup,
  Avatar,
  Button,
  ContextMenu,
  Heading,
  Icon,
  IconDelete,
  IconInfo,
  IconSubdomain,
  MenuItem,
  ModalTrigger,
  Text,
  typedList,
  useOverlayController,
} from "@mittwald/flow-react-components";
import { useNavigate } from "@tanstack/react-router";
import { startScan } from "../../actions.ts";
import { DeleteConfirmationModal } from "../profile/modals/deleteConfirmation.tsx";
import { IconWorldSearch } from "@tabler/icons-react";
import { CreateModal } from "../create/createModal.tsx";

export const ProfilesList = (props: { profiles: ScanProfile[] }) => {
  const ProfileList = typedList<ScanProfile>();

  const navigate = useNavigate();
  const deleteModalController = useOverlayController("Modal");

  const goToProfile = (profile: ScanProfile) =>
    navigate({
      to: "/profiles/$profileId",
      params: { profileId: profile._id },
    });

  return (
    <ProfileList.List
      batchSize={10}
      aria-label="ScanProfile"
      onAction={goToProfile}
    >
      <ProfileList.StaticData data={props.profiles} />
      <ActionGroup>
        <ModalTrigger>
          <Button color="accent">Anlegen</Button>
          <CreateModal />
        </ModalTrigger>
      </ActionGroup>
      <ProfileList.Table>
        <ProfileList.TableHeader>
          <ProfileList.TableColumn>Name</ProfileList.TableColumn>
          <ProfileList.TableColumn>Domain</ProfileList.TableColumn>
          <ProfileList.TableColumn>Standard</ProfileList.TableColumn>
          <ProfileList.TableColumn>Pfade</ProfileList.TableColumn>
        </ProfileList.TableHeader>

        <ProfileList.TableBody>
          <ProfileList.TableRow>
            <ProfileList.TableCell>
              {(profile) => profile.name}
            </ProfileList.TableCell>
            <ProfileList.TableCell>
              {(profile) => profile.domain}
            </ProfileList.TableCell>
            <ProfileList.TableCell>
              {(profile) => profile.standard}
            </ProfileList.TableCell>
            <ProfileList.TableCell>
              {(profile) => profile.paths.length}
            </ProfileList.TableCell>
          </ProfileList.TableRow>
        </ProfileList.TableBody>
      </ProfileList.Table>
      <ProfileList.Item textValue={(p) => p.name}>
        {(profile) => (
          <ProfileList.ItemView>
            <Avatar color="blue">
              <IconSubdomain aria-label="" />
            </Avatar>
            <Heading>{profile.name}</Heading>
            <Text>
              {profile.domain} | {profile.standard} | Anzahl Pfade:{" "}
              {profile.paths.length}
            </Text>

            <ContextMenu>
              <MenuItem onAction={() => goToProfile(profile)}>
                <IconInfo />
                Details anzeigen
              </MenuItem>
              <MenuItem onAction={() => startScan({ data: profile._id })}>
                <Icon>
                  <IconWorldSearch />
                </Icon>
                Scan starten
              </MenuItem>
              <MenuItem onAction={deleteModalController.open}>
                <IconDelete />
                Löschen
              </MenuItem>
            </ContextMenu>
            <DeleteConfirmationModal
              profile={profile}
              controller={deleteModalController}
            />
          </ProfileList.ItemView>
        )}
      </ProfileList.Item>
    </ProfileList.List>
  );
};
