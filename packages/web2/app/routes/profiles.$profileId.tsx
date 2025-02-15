import { createFileRoute, useRouter } from "@tanstack/react-router";
import {
  Tabs,
  Tab,
  TabTitle,
  Text,
  Section,
} from "@mittwald/flow-react-components";
import { Overview } from "../components/profile/overview.tsx";
import { Issues } from "../components/profile/issues.tsx";
import { Settings } from "../components/profile/settings.tsx";
import { Heading } from "@mittwald/flow-react-components";
import { Breadcrumb } from "@mittwald/flow-react-components";
import { Link } from "@mittwald/flow-react-components";
import { LayoutCard } from "@mittwald/flow-react-components";
import { createServerFn } from "@tanstack/start";
import { z } from "zod";
import {
  dbConnect,
  ScanModel,
  ScanProfileModel,
} from "extension-a11y-checker-storage";
import { Scan, ScanProfile } from "../api/types.ts";
import { useEffect } from "react";
import { isPending, isRunning } from "../components/profile/helpers.ts";

const getProfile = createServerFn({
  method: "GET",
})
  .validator(z.string())
  .handler(async ({ data: profileId }) => {
    await dbConnect();
    const profile = await ScanProfileModel.findById(profileId).exec();
    const lastScan = await ScanModel.lastScanOfProfile(profileId);
    const nextScan = await ScanModel.nextScanOfProfile(profileId);

    return {
      profile: {
        ...profile?.toJSON(),
        issueSummary: lastScan?.getIssueSummary(),
      } as unknown as ScanProfile,
      lastScan: lastScan?.toJSON() as unknown as Scan | undefined,
      nextScan: nextScan?.toJSON() as unknown as Scan | undefined,
    };
  });

export const Route = createFileRoute("/profiles/$profileId")({
  component: RouteComponent,
  loader: ({ params: { profileId } }) => getProfile({ data: profileId }),
});

function RouteComponent() {
  const { profile, lastScan, nextScan } = Route.useLoaderData();
  const router = useRouter();

  const isRunningOrPending =
    nextScan && (isRunning(nextScan) || isPending(nextScan));

  useEffect(() => {
    let interval = null;
    if (isRunningOrPending) {
      interval = setInterval(() => {
        router.invalidate();
      }, 5000);
    }

    return () => {
      if (interval) {
        clearInterval(interval);
      }
    };
  }, [router, isRunningOrPending]);

  return (
    <Section>
      <Breadcrumb color="light">
        <Link href="/">Projekt</Link>
        <Link href="/">A11y Checker</Link>
        <Link href="#">{profile.name}</Link>
      </Breadcrumb>
      <Heading level={1} color="light">
        {profile.name}
      </Heading>
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
