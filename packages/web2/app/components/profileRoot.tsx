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
import { ErrorScan } from "./profile/errorScan.js";

export const ProfileRoot = ({
  profile,
  lastScan,
  lastSuccessfulScan,
}: {
  profile: ScanProfile;
  lastScan?: Scan;
  lastSuccessfulScan?: Scan;
}) => {
  const shouldReloadData = isRunningOrPending(profile?.nextScan);
  useAutoRefresh(shouldReloadData);

  const hasSuccessfulScan = !!lastSuccessfulScan;
  const hasScan = !!lastScan;
  const lastScanIsError = lastScan?.status === "failed";

  return (
    <Section>
      <Title>{profile.name}</Title>
      <Breadcrumb>
        <Link href="#">Scanprofil</Link>
      </Breadcrumb>
      <ProfileActions profile={profile} />
      <LayoutCard>
        {hasScan && lastScanIsError && !shouldReloadData && (
          <ErrorScan profile={profile} lastScan={lastScan} />
        )}
        {hasSuccessfulScan ? (
          <ProfileTabs profile={profile} lastScan={lastSuccessfulScan} />
        ) : (
          (!lastScanIsError || shouldReloadData) && (
            <NoScans profile={profile} />
          )
        )}
      </LayoutCard>
    </Section>
  );
};
