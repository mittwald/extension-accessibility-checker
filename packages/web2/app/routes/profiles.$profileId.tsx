import { createFileRoute, useRouter } from "@tanstack/react-router";
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
import { useEffect } from "react";

export const Route = createFileRoute("/profiles/$profileId")({
  component: RouteComponent,
  loader: ({ params: { profileId } }) => {
    if (typeof window === "undefined") {
      return null;
    }
    return getProfile({ data: profileId });
  },
});

function RouteComponent() {
  const data = Route.useLoaderData();
  const { profile, lastScan } = data ?? {};

  const shouldReloadData = isRunningOrPending(profile?.nextScan);
  useAutoRefresh(shouldReloadData);

  const router = useRouter();

  useEffect(() => {
    router.invalidate({ sync: true });
  }, []);

  if (data === null) {
    return <></>;
  }

  return (
    <Section>
      <Breadcrumb color="light">
        <Link href={`/?contextId=${profile.project}`}>Projekt</Link>
        <Link href={`/?contextId=${profile.project}`}>A11y Checker</Link>
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
