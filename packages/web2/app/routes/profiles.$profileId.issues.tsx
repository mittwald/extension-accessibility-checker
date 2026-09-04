import { createFileRoute } from "@tanstack/react-router";
import { Issues } from "../components/profile/tabs/issues.tsx";
import { useProfileData } from "../hooks/useProfileData.tsx";

export const Route = createFileRoute("/profiles/$profileId/issues")({
  component: RouteComponent,
  ssr: false,
});

function RouteComponent() {
  const { lastSuccessfulScan } = useProfileData();

  if (!lastSuccessfulScan) {
    return null;
  }

  return <Issues scan={lastSuccessfulScan} />;
}
