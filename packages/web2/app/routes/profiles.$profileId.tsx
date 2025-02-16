import { createFileRoute, useRouter } from "@tanstack/react-router";
import {
  Breadcrumb,
  Button,
  Header,
  Heading,
  LayoutCard,
  Link,
  Section,
  Tab,
  Tabs,
  TabTitle,
  Text,
  useOverlayController,
} from "@mittwald/flow-react-components";
import { Overview } from "../components/profile/overview.tsx";
import { Issues } from "../components/profile/issues.tsx";
import { Settings } from "../components/profile/settings.tsx";
import { useEffect } from "react";
import { isRunningOrPending } from "../components/profile/helpers.ts";
import { getProfile } from "../actions/profile.ts";
import { RenameProfileModal } from "../components/profile/modals/renameProfileModal.tsx";

export const Route = createFileRoute("/profiles/$profileId")({
  component: RouteComponent,
  loader: ({ params: { profileId } }) => getProfile({ data: profileId }),
});

function RouteComponent() {
  const { profile, lastScan } = Route.useLoaderData();

  const renameModalController = useOverlayController("Modal");

  const router = useRouter();

  const shouldReloadData = isRunningOrPending(profile.nextScan);

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
        <Button
          variant="outline"
          slot="secondary"
          color="light"
          size="m"
          onPress={renameModalController.open}
        >
          Umbenennen
        </Button>
        <RenameProfileModal
          profile={profile}
          controller={renameModalController}
        />
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
