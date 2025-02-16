import { createFileRoute } from "@tanstack/react-router";
import {
  Breadcrumb,
  Header,
  Heading,
  LayoutCard,
  Link,
  Section,
  Tab,
  Tabs,
  TabTitle,
  Text,
} from "@mittwald/flow-react-components";
import { Overview } from "../components/profile/overview.tsx";
import { Issues } from "../components/profile/issues.tsx";
import { Settings } from "../components/profile/settings.tsx";
import { isRunningOrPending } from "../components/profile/helpers.ts";
import { getProfile } from "../actions/profile.ts";
import { useAutoRefresh } from "../hooks/useAutoRefresh.tsx";
import { RenameProfileButton } from "../components/profile/renameProfileButton.tsx";

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
        <RenameProfileButton profile={profile} />
      </Header>
      <LayoutCard>
        <Tabs>
          <Tab id="overview">
            <TabTitle>Übersicht</TabTitle>
            <Overview profile={profile} />
          </Tab>
          <Tab id="issues">
            <TabTitle>Fehler</TabTitle>
            {lastScan ? (
              <Issues scan={lastScan} />
            ) : (
              <Text>Noch nicht ausgeführt.</Text>
            )}
          </Tab>
          <Tab id="settings">
            <TabTitle>Einstellungen</TabTitle>
            <Settings />
          </Tab>
        </Tabs>
      </LayoutCard>
    </Section>
  );
}
