import {
  LayoutCard,
  Link,
  Section,
} from "@mittwald/flow-remote-react-components";
import { ProfileActions } from "./profile/profileActions.js";
import { ProfileTabs } from "./profile/profileTabs.js";
import { NoScans } from "./profile/noScans.js";
import { Scan, ScanProfile } from "../api/types.js";
import { isRunningOrPending } from "./profile/helpers.js";
import { useAutoRefresh } from "../hooks/useAutoRefresh.js";
import { Breadcrumb, Title } from "@mittwald/mstudio-ext-react-components";

export const ProfileRoot = ({
  profile,
  lastScan,
}: {
  profile: ScanProfile;
  lastScan?: Scan;
}) => {
  const shouldReloadData = isRunningOrPending(profile?.nextScan);
  useAutoRefresh(shouldReloadData);

  return (
    <Section>
      <Title>{profile.name}</Title>
      <Breadcrumb>
        <Link href="#">Scanprofil</Link>
      </Breadcrumb>
      <ProfileActions profile={profile} />
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
