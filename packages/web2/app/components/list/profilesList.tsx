import { ScanProfile } from "../../api/types.ts";
import {
  ActionGroup,
  Avatar,
  Badge,
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
import { useNavigate, useRouter } from "@tanstack/react-router";
import { startScan } from "../../actions.ts";
import { DeleteConfirmationModal } from "../profile/modals/deleteConfirmation.tsx";
import { IconWorldSearch } from "@tabler/icons-react";
import { CreateModal } from "../create/createModal.tsx";
import { useEffect } from "react";
import {
  isPending,
  isRunning,
  isRunningOrPending,
} from "../profile/helpers.ts";

const StateBatch = ({ profile }: { profile: ScanProfile }) => {
  if (!profile.nextScan) {
    return null;
  }

  if (isRunning(profile.nextScan)) {
    return <Badge>Wird ausgeführt …</Badge>;
  }
  if (isPending(profile.nextScan)) {
    return <Badge>Wird gestartet …</Badge>;
  }
};

export const ProfilesList = (props: { profiles: ScanProfile[] }) => {
  const ProfileList = typedList<ScanProfile>();

  const navigate = useNavigate();
  const router = useRouter();
  const deleteModalController = useOverlayController("Modal");

  const shouldReloadData = props.profiles.some((p) =>
    isRunningOrPending(p.nextScan),
  );

  console.log("shouldReloadData", shouldReloadData);

  useEffect(() => {
    let interval = null;
    if (shouldReloadData) {
      interval = setInterval(() => {
        router.invalidate();
      }, 5000);
    }

    return () => {
      if (interval) {
        clearInterval(interval);
      }
    };
  }, [router, shouldReloadData]);

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
            <Heading>
              {profile.name}
              <StateBatch profile={profile} />
            </Heading>
            <Text>
              {profile.domain} | {profile.standard} | Anzahl Pfade:{" "}
              {profile.paths.length}
            </Text>
            {profile.nextScan && (
              <Text>
                Nächster Scan:{" "}
                {profile.nextScan.executionScheduledFor.toLocaleString()}
              </Text>
            )}

            <ContextMenu>
              <MenuItem onAction={() => goToProfile(profile)}>
                <IconInfo />
                Details anzeigen
              </MenuItem>
              <MenuItem
                onAction={async () => {
                  await startScan({ data: profile._id });
                  await router.invalidate({ sync: true });
                }}
              >
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
