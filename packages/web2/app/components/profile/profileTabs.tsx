import {
  Outlet,
  useMatchRoute,
  useNavigate,
  useParams,
} from "@tanstack/react-router";
import { ScanProfile } from "../../api/types.ts";
import {
  AlertIcon,
  Link,
  TabNavigation,
} from "@mittwald/flow-remote-react-components";
import { hasDailyCronInterval } from "../../lib/hasDailyCronInterval.ts";

type ProfileSection = "overview" | "issues" | "settings";

export function ProfileTabs({ profile }: { profile: ScanProfile }) {
  const navigate = useNavigate();
  const matchRoute = useMatchRoute();
  const { profileId } = useParams({ from: "/profiles/$profileId" });

  const ariaCurrent = (section: ProfileSection) =>
    matchRoute({
      to: `/profiles/$profileId/${section}`,
      params: { profileId },
    })
      ? "page"
      : undefined;

  const navigateTo = (section: ProfileSection) => {
    void navigate({
      to: `/profiles/$profileId/${section}`,
      params: { profileId },
      search: (prev) => prev,
    });
  };

  return (
    <>
      <TabNavigation aria-label="Scanprofil">
        <Link
          aria-current={ariaCurrent("overview")}
          onPress={() => navigateTo("overview")}
        >
          Übersicht
        </Link>
        <Link
          aria-current={ariaCurrent("issues")}
          onPress={() => navigateTo("issues")}
        >
          Details
        </Link>
        <Link
          aria-current={ariaCurrent("settings")}
          onPress={() => navigateTo("settings")}
        >
          Einstellungen
          {hasDailyCronInterval(profile) && <AlertIcon status="info" />}
        </Link>
      </TabNavigation>

      <Outlet />
    </>
  );
}
