import { useState } from "react";
import { Scan, ScanProfile } from "../../api/types.ts";
import {
  AlertIcon,
  Link,
  TabNavigation,
} from "@mittwald/flow-remote-react-components";
import { Overview } from "./tabs/overview.tsx";
import { Issues } from "./tabs/issues.tsx";
import { Settings } from "./tabs/settings.tsx";
import { hasDailyCronInterval } from "../../lib/hasDailyCronInterval.ts";

type ProfileSection = "overview" | "issues" | "settings";

export function ProfileTabs({
  profile,
  lastScan,
}: {
  profile: ScanProfile;
  lastScan: Scan;
}) {
  const [activeSection, setActiveSection] =
    useState<ProfileSection>("overview");

  const ariaCurrent = (section: ProfileSection) =>
    activeSection === section ? "page" : undefined;

  return (
    <>
      <TabNavigation aria-label="Scanprofil">
        <Link
          aria-current={ariaCurrent("overview")}
          onPress={() => setActiveSection("overview")}
        >
          Übersicht
        </Link>
        <Link
          aria-current={ariaCurrent("issues")}
          onPress={() => setActiveSection("issues")}
        >
          Details
        </Link>
        <Link
          aria-current={ariaCurrent("settings")}
          onPress={() => setActiveSection("settings")}
        >
          Einstellungen
          {hasDailyCronInterval(profile) && <AlertIcon status="info" />}
        </Link>
      </TabNavigation>

      {activeSection === "overview" && <Overview profile={profile} />}
      {activeSection === "issues" && <Issues scan={lastScan} />}
      {activeSection === "settings" && <Settings />}
    </>
  );
}
