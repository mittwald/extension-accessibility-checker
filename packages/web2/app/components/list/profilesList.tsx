import { ScanProfile } from "../../api/types.ts";
import {
  ActionGroup,
  Flex,
  Text,
  typedList,
} from "@mittwald/flow-remote-react-components";
import { isRunningOrPending } from "../profile/helpers.ts";
import { useAutoRefresh } from "../../hooks/useAutoRefresh.tsx";
import { useGoToProfile } from "../../hooks/useGoTo.tsx";
import { CreateProfileButton } from "../create/createProfileButton.tsx";
import { ProfileListItemView } from "./profileListItemView.tsx";

export const ProfilesList = ({ profiles }: { profiles: ScanProfile[] }) => {
  const ProfileList = typedList<ScanProfile>();

  const shouldReloadData = profiles.some((p) => isRunningOrPending(p.nextScan));
  useAutoRefresh(shouldReloadData);

  const goToProfile = useGoToProfile();

  return (
    <ProfileList.List
      batchSize={10}
      aria-label="Scanprofile"
      onAction={goToProfile}
    >
      <ProfileList.StaticData data={profiles} />
      <ActionGroup>
        <CreateProfileButton />
      </ActionGroup>
      <ProfileList.Table>
        <ProfileList.TableHeader>
          <ProfileList.TableColumn>Name</ProfileList.TableColumn>
          <ProfileList.TableColumn>Domain</ProfileList.TableColumn>
          <ProfileList.TableColumn>Standard</ProfileList.TableColumn>
          <ProfileList.TableColumn>Unterseiten</ProfileList.TableColumn>
          <ProfileList.TableColumn>Ausführung</ProfileList.TableColumn>
          <ProfileList.TableColumn>Score</ProfileList.TableColumn>
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
            <ProfileList.TableCell>
              {(profile) => (
                <Flex direction="column">
                  {profile.lastScan && (
                    <Text>
                      Letzter Scan:{" "}
                      {profile.lastScan.completedAt?.toLocaleString()}
                    </Text>
                  )}
                  {profile.nextScan && (
                    <Text>
                      Nächster Scan:{" "}
                      {profile.nextScan.executionScheduledFor.toLocaleString()}
                    </Text>
                  )}
                </Flex>
              )}
            </ProfileList.TableCell>
            <ProfileList.TableCell>
              {(profile) => profile.issueSummary?.score ?? "---"}
            </ProfileList.TableCell>
          </ProfileList.TableRow>
        </ProfileList.TableBody>
      </ProfileList.Table>
      <ProfileList.Item textValue={(p) => p.name}>
        {(profile) => <ProfileListItemView profile={profile} />}
      </ProfileList.Item>
    </ProfileList.List>
  );
};
