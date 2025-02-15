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
import { isRunningOrPending } from "../components/profile/helpers.ts";

const getProfile = createServerFn({
  method: "GET",
})
  .validator(z.string())
  .handler(async ({ data: profileId }) => {
    await dbConnect();
    const profile = await ScanProfileModel.findById(profileId).exec();
    await profile?.populate("nextScan");
    const lastScan = await ScanModel.lastScanOfProfile(profileId);

    return {
      profile: {
        ...profile?.toObject(),
        issueSummary: lastScan?.getIssueSummary(),
      } as unknown as ScanProfile,
      lastScan: lastScan as unknown as Scan | undefined,
    };
  });

export const Route = createFileRoute("/profiles/$profileId")({
  component: RouteComponent,
  loader: ({ params: { profileId } }) => getProfile({ data: profileId }),
});

function RouteComponent() {
  const { profile, lastScan } = Route.useLoaderData();
  const router = useRouter();

  const shouldReloadData = isRunningOrPending(lastScan);

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
