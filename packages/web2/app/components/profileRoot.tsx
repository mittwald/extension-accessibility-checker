import {
  Button,
  Header,
  Heading,
  LayoutCard,
  Section,
} from "@mittwald/flow-react-components";
import { ProfileActions } from "./profile/profileActions.js";
import { ProfileTabs } from "./profile/profileTabs.js";
import { NoScans } from "./profile/noScans.js";
import { Scan, ScanProfile } from "../api/types.js";
import { isRunningOrPending } from "./profile/helpers.js";
import { useAutoRefresh } from "../hooks/useAutoRefresh.js";
import { useGoToRoot } from "../hooks/useGoTo.js";

export const ProfileRoot = ({
  profile,
  lastScan,
}: {
  profile: ScanProfile;
  lastScan?: Scan;
}) => {
  const shouldReloadData = isRunningOrPending(profile?.nextScan);
  useAutoRefresh(shouldReloadData);

  const goToRoot = useGoToRoot();

  return (
    <Section>
      <Button onPress={() => goToRoot()} variant="soft">
        Zurück
      </Button>
      <Header>
        <Heading level={1} color="light">
          {profile.name}
        </Heading>
        <ProfileActions profile={profile} />
      </Header>
      <LayoutCard>
        {lastScan ? (
          <ProfileTabs profile={profile} lastScan={lastScan} />
        ) : (
          <NoScans profile={profile} />
        )}
      </LayoutCard>
    </Section>
  );
};
