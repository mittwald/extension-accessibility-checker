import { createFileRoute } from "@tanstack/react-router";
import Tabs, { Tab, TabTitle } from "@mittwald/flow-react-components/Tabs";
import { Overview } from "../../components/profile/overview.tsx";
import { Issues } from "../../components/profile/issues.tsx";
import { Settings } from "../../components/profile/settings.tsx";
import { Heading } from "@mittwald/flow-react-components/Heading";
import { Breadcrumb } from "@mittwald/flow-react-components/Breadcrumb";
import Link from "@mittwald/flow-react-components/Link";
import { LayoutCard } from "@mittwald/flow-react-components/LayoutCard";
import { getProfile } from "../../api/profile.ts";

export const Route = createFileRoute("/profiles/$profileId")({
  component: RouteComponent,

  loader: ({ params: { profileId } }) =>
    getProfile("67a27257499e57138e2c2d8e", profileId),
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
          <Tab>
            <TabTitle>Übersicht</TabTitle>
            <Overview profile={profile} />
          </Tab>
          <Tab>
            <TabTitle>Fehler</TabTitle>
            <Issues />
          </Tab>
          <Tab>
            <TabTitle>Einstellungen</TabTitle>
            <Settings />
          </Tab>
        </Tabs>
      </LayoutCard>
    </>
  );
}
