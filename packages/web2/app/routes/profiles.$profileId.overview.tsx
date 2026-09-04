import { createFileRoute } from "@tanstack/react-router";
import { Overview } from "../components/profile/tabs/overview.tsx";
import { useProfileData } from "../hooks/useProfileData.tsx";

export const Route = createFileRoute("/profiles/$profileId/overview")({
  component: RouteComponent,
  ssr: false,
});

function RouteComponent() {
  const { profile } = useProfileData();

  return <Overview profile={profile} />;
}
