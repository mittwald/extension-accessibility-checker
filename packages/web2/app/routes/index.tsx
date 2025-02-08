// app/routes/index.tsx
import * as fs from "node:fs";
import { createFileRoute, useRouter, Link } from "@tanstack/react-router";
import { createServerFn } from "@tanstack/start";
import {
  Breadcrumb,
  ColumnLayout,
  Heading,
  LayoutCard,
} from "@mittwald/flow-react-components";
import { Meta } from "../components/list/meta.tsx";
import { NoProfiles } from "../components/list/noProfiles.tsx";
import "@mittwald/flow-react-components/all.css";

const filePath = "count.txt";

async function readCount() {
  return parseInt(
    await fs.promises.readFile(filePath, "utf-8").catch(() => "0"),
  );
}

const getCount = createServerFn({
  method: "GET",
}).handler(() => {
  return readCount();
});

const updateCount = createServerFn({ method: "POST" })
  .validator((d: number) => d)
  .handler(async ({ data }) => {
    const count = await readCount();
    await fs.promises.writeFile(filePath, `${count + data}`);
  });

export const Route = createFileRoute("/")({
  component: Home,
  loader: async () => await getCount(),
});

function Home() {
  const router = useRouter();
  const state = Route.useLoaderData();

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
        <NoProfiles />
      </LayoutCard>
    </ColumnLayout>
  );
}
