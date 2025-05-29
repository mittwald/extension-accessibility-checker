// app/routes/index.tsx
import { createFileRoute, useRouter } from "@tanstack/react-router";
import { z } from "zod";
import { zodValidator } from "@tanstack/zod-adapter";
import { getProfiles } from "../actions/profile.ts";
import { useEffect } from "react";
import { ProfilesRoot } from "../components/profilesRoot.js";

const QueryParams = z.object({
  contextId: z.string().optional(),
});

export const Route = createFileRoute("/")({
  component: Home,
  validateSearch: zodValidator(QueryParams),
  ssr: false,
  loader: async (ctx) => {
    if (typeof window === "undefined") {
      return null;
    }

    console.log(window.location.href);
    const { contextId } = ctx.location.search;

    return getProfiles({ data: contextId });
  },
});

function Home() {
  const router = useRouter();

  const profiles = Route.useLoaderData();

  useEffect(() => {
    router.invalidate({ sync: true });
  }, []);

  if (profiles === null) {
    return null;
  }

  return <ProfilesRoot profiles={profiles} />;
}
