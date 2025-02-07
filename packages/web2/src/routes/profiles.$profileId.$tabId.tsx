import { createFileRoute } from "@tanstack/react-router";
import { Tabs, Tab, TabTitle } from "@mittwald/flow-react-components";
import { Overview } from "../components/profile/overview.tsx";
import { Issues } from "../components/profile/issues.tsx";
import { Settings } from "../components/profile/settings.tsx";
import { Heading } from "@mittwald/flow-react-components";
import { Breadcrumb } from "@mittwald/flow-react-components";
import { Link } from "@mittwald/flow-react-components";
import { LayoutCard } from "@mittwald/flow-react-components";
import { getProfile } from "../api/profile.ts";

export const Route = createFileRoute("/profiles/$profileId/$tabId")({
  component: RouteComponent,

  loader: ({ params: { profileId } }) =>
    getProfile("67a27257499e57138e2c2d8e", profileId),
});

function RouteComponent() {
  // const navigate = Route.useNavigate();
  const { tabId } = Route.useParams();
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
        <Tabs
          selectedKey={tabId ?? "overview"}
          onSelectionChange={(key) => {
            console.log("key selected", key);
            // return navigate({
            //   to: "/profiles/$profileId/$tabId",
            //   params: {
            //     profileId: profile._id,
            //     tabId: key,
            //   },
            // });
          }}
        >
          <Tab id="overview">
            <TabTitle>Übersicht</TabTitle>
            <Overview profile={profile} />
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
