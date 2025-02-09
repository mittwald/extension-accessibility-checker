// app/routes/index.tsx
import { createFileRoute, Link } from "@tanstack/react-router";
import {
  Breadcrumb,
  ColumnLayout,
  Heading,
  LayoutCard,
} from "@mittwald/flow-react-components";
import { Meta } from "../components/list/meta.tsx";
import { NoProfiles } from "../components/list/noProfiles.tsx";
import "@mittwald/flow-react-components/all.css";
import { ProfilesList } from "../components/list/profilesList.tsx";
import { getProfiles } from "../actions.ts";

export const Route = createFileRoute("/")({
  component: Home,
  loader: async () => getProfiles(),
});

function Home() {
  const profiles = Route.useLoaderData();

  const hasProfiles = !!profiles && profiles.length > 0;

  return (
    <ColumnLayout s={[1]}>
      <Breadcrumb color="light">
        <Link to="/">Projekt</Link>
        <Link to="/">A11y Checker</Link>
      </Breadcrumb>
      <Heading level={1} color="light">
        A11y Checker
      </Heading>
      <Meta />
      <LayoutCard>
        {hasProfiles ? <ProfilesList profiles={profiles} /> : <NoProfiles />}
      </LayoutCard>
    </ColumnLayout>
  );
}
