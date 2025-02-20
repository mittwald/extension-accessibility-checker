// app/routes/index.tsx
import { createFileRoute, Link } from "@tanstack/react-router";
import {
  Breadcrumb,
  ColumnLayout,
  Heading,
  LayoutCard,
} from "@mittwald/flow-react-components";
import { EducationCards } from "../components/list/educationCards.tsx";
import { NoProfiles } from "../components/list/noProfiles.tsx";
import { ProfilesList } from "../components/list/profilesList.tsx";

import { getProfiles } from "../actions/profile.ts";

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
      <EducationCards />
      <LayoutCard>
        {hasProfiles ? <ProfilesList profiles={profiles} /> : <NoProfiles />}
      </LayoutCard>
    </ColumnLayout>
  );
}
