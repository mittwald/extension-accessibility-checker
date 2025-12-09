import {
  LayoutCard,
  Link,
  Section,
} from "@mittwald/flow-remote-react-components";
import { ProfileActions } from "./profile/profileActions.js";
import { ProfileTabs } from "./profile/profileTabs.js";
import { NoScans } from "./profile/noScans.js";
import { Scan, ScanProfile } from "~/api/types";
import { isRunningOrPending } from "./profile/helpers.js";
import { useAutoRefresh } from "~/hooks/useAutoRefresh";
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
      {hasScan && lastScanIsError && !shouldReloadData && (
        <LayoutCard>
          <ErrorScan profile={profile} lastScan={lastScan} />
        </LayoutCard>
      )}
      {hasSuccessfulScan ? (
        <LayoutCard>
          <ProfileTabs profile={profile} lastScan={lastSuccessfulScan} />
        </LayoutCard>
      ) : (
        (!lastScanIsError || shouldReloadData) && (
          <LayoutCard>
            <NoScans profile={profile} />
          </LayoutCard>
        )
      )}
    </Section>
  );
};
