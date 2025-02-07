import { createFileRoute } from "@tanstack/react-router";
import { ColumnLayout, Heading } from "@mittwald/flow-react-components";
import { Link } from "@mittwald/flow-react-components";
import { LayoutCard } from "@mittwald/flow-react-components";
import { Breadcrumb } from "@mittwald/flow-react-components";
import { NoProfiles } from "../components/list/noProfiles.tsx";
import { Meta } from "../components/list/meta.tsx";

export const Route = createFileRoute("/")({
  component: Index,
});

function Index() {
  return (
    <ColumnLayout s={[1]}>
      <Breadcrumb color="light">
        <Link href="/">Projekt</Link>
        <Link href="#">A11y Checker</Link>
      </Breadcrumb>
      <Heading level={1} color="light">
        A11y Checker
      </Heading>
      <Meta />
      <LayoutCard>
        <NoProfiles />
      </LayoutCard>
    </ColumnLayout>
  );
}
