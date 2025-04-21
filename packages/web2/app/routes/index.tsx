// app/routes/index.tsx
import { createFileRoute, useRouter } from "@tanstack/react-router";
import { z } from "zod";
import { zodValidator } from "@tanstack/zod-adapter";
import { getProfile, getProfiles } from "../actions/profile.ts";
import { useEffect } from "react";
import { ProfilesRoot } from "../components/profilesRoot.js";
import { ProfileRoot } from "../components/profileRoot.js";

const QueryParams = z.object({
  contextId: z.string().optional(),
  profileId: z.string().optional(),
});

export const Route = createFileRoute("/")({
  component: Home,
  validateSearch: zodValidator(QueryParams),
  ssr: false,
  loader: async (ctx) => {
    if (typeof window === "undefined") {
      return null;
    }

    const { contextId, profileId } = ctx.location.search;

    if (profileId) {
      return {
        page: "profile" as const,
        ...(await getProfile({ data: profileId })),
      };
    }

    return {
      page: "profiles" as const,
      profiles: await getProfiles({ data: contextId }),
    };
  },
});

function Home() {
  const router = useRouter();

  const data = Route.useLoaderData();

  useEffect(() => {
    router.invalidate({ sync: true });
  }, []);

  switch (data?.page) {
    case "profile":
      return <ProfileRoot profile={data.profile} lastScan={data.lastScan} />;
    case "profiles":
      return <ProfilesRoot profiles={data.profiles} />;
    default:
      return <p>Nope</p>;
  }
}
