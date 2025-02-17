import { createFileRoute } from "@tanstack/react-router";
import {
  Breadcrumb,
  Header,
  Heading,
  LayoutCard,
  Link,
  Section,
} from "@mittwald/flow-react-components";
import { isRunningOrPending } from "../components/profile/helpers.ts";
import { getProfile } from "../actions/profile.ts";
import { useAutoRefresh } from "../hooks/useAutoRefresh.tsx";
import { ProfileActions } from "../components/profile/profileActions.tsx";
import { ProfileTabs } from "../components/profile/profileTabs.tsx";
import { NoScans } from "../components/profile/noScans.tsx";

export const Route = createFileRoute("/profiles/$profileId")({
  component: RouteComponent,
  loader: ({ params: { profileId } }) => getProfile({ data: profileId }),
});

function RouteComponent() {
  const { profile, lastScan } = Route.useLoaderData();

  const shouldReloadData = isRunningOrPending(profile.nextScan);
  useAutoRefresh(shouldReloadData);

  return (
    <Section>
      <Breadcrumb color="light">
        <Link href="/">Projekt</Link>
        <Link href="/">A11y Checker</Link>
        <Link href="#">{profile.name}</Link>
      </Breadcrumb>
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
}
