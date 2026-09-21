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
import type { SortingFn } from "@tanstack/react-table";

const statusFilterValues = ["running", "scheduled", "manual"] as const;
type StatusFilterValue = (typeof statusFilterValues)[number];

const statusFilterLabels: Record<StatusFilterValue, string> = {
  running: "Läuft gerade",
  scheduled: "Geplant",
  manual: "Manuelle Ausführung",
};

const matchesStatusFilter = (
  filterBy: StatusFilterValue,
  profile: ScanProfile,
) => {
  switch (filterBy) {
    case "running":
      return isRunningOrPending(profile.nextScan);
    case "scheduled":
      return !!profile.cronSchedule;
    case "manual":
      return !profile.cronSchedule;
  }
};

const sortByLastScanCompletedAt: SortingFn<ScanProfile> = (
  rowA,
  rowB,
  columnId,
) => {
  const getTimestamp = (value: unknown) => {
    if (value === undefined || value === null) {
      return Number.NEGATIVE_INFINITY;
    }

    const timestamp =
      value instanceof Date ? value.getTime() : Date.parse(String(value));
    return Number.isNaN(timestamp) ? Number.NEGATIVE_INFINITY : timestamp;
  };

  const timestampA = getTimestamp(rowA.getValue(columnId));
  const timestampB = getTimestamp(rowB.getValue(columnId));

  if (timestampA === timestampB) {
    return 0;
  }

  return timestampA < timestampB ? -1 : 1;
};

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
      <ProfileList.Sorting
        property="lastScan.completedAt"
        name="Letzter Scan"
        direction="desc"
        defaultEnabled
        directionName="Neueste zuerst"
        customSortingFn={sortByLastScanCompletedAt}
      />
      <ProfileList.Sorting
        property="lastScan.completedAt"
        name="Letzter Scan"
        direction="asc"
        directionName="Älteste zuerst"
        customSortingFn={sortByLastScanCompletedAt}
      />
      <ProfileList.Sorting
        property="domain"
        name="Domain"
        direction="asc"
        directionName="A–Z"
      />
      <ProfileList.Sorting
        property="domain"
        name="Domain"
        direction="desc"
        directionName="Z–A"
      />
      <ProfileList.Sorting
        property="issueSummary.score"
        name="Score"
        direction="asc"
        directionName="Niedrigste zuerst"
      />
      <ProfileList.Sorting
        property="issueSummary.score"
        name="Score"
        direction="desc"
        directionName="Höchste zuerst"
      />
      <ProfileList.Filter
        property="$status"
        mode="some"
        name="Status"
        values={statusFilterValues}
        matcher={matchesStatusFilter}
      >
        {(value) => statusFilterLabels[value]}
      </ProfileList.Filter>
      <ProfileList.Search />
      <ProfileList.Table>
        <ProfileList.TableHeader>
          <ProfileList.TableColumn>Name</ProfileList.TableColumn>
          <ProfileList.TableColumn>Domain</ProfileList.TableColumn>
          <ProfileList.TableColumn>Standard</ProfileList.TableColumn>
          <ProfileList.TableColumn>Pfade</ProfileList.TableColumn>
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
              {(profile) => profile.issueSummary?.score ?? "-"}
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
