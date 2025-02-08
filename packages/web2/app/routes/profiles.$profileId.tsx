import { createFileRoute } from "@tanstack/react-router";
import { Tabs, Tab, TabTitle } from "@mittwald/flow-react-components";
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
import { ScanProfile } from "../api/types.ts";

const getProfile = createServerFn({
  method: "GET",
})
  .validator(z.string())
  .handler(async ({ data: profileId }) => {
    await dbConnect();
    const profile = await ScanProfileModel.findById(profileId).exec();
    const lastScan = await ScanModel.lastScanOfProfile(profileId);

    return {
      ...profile?.toJSON(),
      issueSummary: lastScan?.getIssueSummary(),
    } as unknown as ScanProfile;
  });

export const Route = createFileRoute("/profiles/$profileId")({
  component: RouteComponent,
  loader: ({ params: { profileId } }) => getProfile({ data: profileId }),
});

function RouteComponent() {
  const profile = Route.useLoaderData();

  return (
    <>
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
            <Overview profile={profile as ScanProfile} />
          </Tab>
          <Tab id="issues">
            <TabTitle>Fehler</TabTitle>
            <Issues />
          </Tab>
          <Tab id="settings">
            <TabTitle>Einstellungen</TabTitle>
            <Settings />
          </Tab>
        </Tabs>
      </LayoutCard>
    </>
  );
}
