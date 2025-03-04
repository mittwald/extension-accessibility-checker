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
import { z } from "zod";
import { zodValidator } from "@tanstack/zod-adapter";
import { getProfiles } from "../actions/profile.ts";

const QueryParams = z.object({
  contextId: z.string(),
});

export const Route = createFileRoute("/")({
  component: Home,
  validateSearch: zodValidator(QueryParams),
  loader: async (ctx) => {
    const contextId = ctx.location.search.contextId;
    return getProfiles({ data: contextId });
  },
});

function Home() {
  const { contextId } = Route.useSearch();
  const profiles = Route.useLoaderData();

  const hasProfiles = !!profiles && profiles.length > 0;

  return (
    <ColumnLayout s={[1]}>
      <Breadcrumb color="light">
        <Link to="/" search={{ contextId }}>
          Projekt
        </Link>
        <Link to="/" search={{ contextId }}>
          A11y Checker
        </Link>
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
