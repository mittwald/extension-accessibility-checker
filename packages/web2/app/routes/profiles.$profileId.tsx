import { createFileRoute, useRouter } from "@tanstack/react-router";
import { isRunningOrPending } from "~/components/profile/helpers";
import { getProfile } from "~/actions/profile";
import { useAutoRefresh } from "~/hooks/useAutoRefresh";
import { useEffect } from "react";
import { ProfileRoot } from "~/components/profileRoot";

export const Route = createFileRoute("/profiles/$profileId")({
  component: RouteComponent,
  ssr: false,
  loader: ({ params: { profileId } }) => {
    if (typeof window === "undefined") {
      return null;
    }
    return getProfile({ data: profileId });
  },
});

function RouteComponent() {
  const data = Route.useLoaderData();
  const { profile, lastScan, lastSuccessfulScan } = data ?? {};

  const shouldReloadData = isRunningOrPending(profile?.nextScan);
  useAutoRefresh(shouldReloadData);

  const router = useRouter();

  useEffect(() => {
    router.invalidate({ sync: true });
  }, []);

  if (!profile) {
    return null;
  }

  return (
    <ProfileRoot
      profile={profile}
      lastScan={lastScan}
      lastSuccessfulScan={lastSuccessfulScan}
    />
  );
}
