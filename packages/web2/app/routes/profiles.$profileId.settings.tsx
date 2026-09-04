import { createFileRoute } from "@tanstack/react-router";
import { Settings } from "../components/profile/tabs/settings.tsx";

export const Route = createFileRoute("/profiles/$profileId/settings")({
  component: Settings,
  ssr: false,
});
