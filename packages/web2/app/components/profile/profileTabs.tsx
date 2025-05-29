import { Scan, ScanProfile } from "../../api/types.ts";
import { Tab, Tabs, TabTitle } from "@mittwald/flow-remote-react-components";
import { Overview } from "./tabs/overview.tsx";
import { Issues } from "./tabs/issues.tsx";
import { Settings } from "./tabs/settings.tsx";

export function ProfileTabs({
  profile,
  lastScan,
}: {
  profile: ScanProfile;
  lastScan: Scan;
}) {
  return (
    <Tabs>
      <Tab id="overview">
        <TabTitle>Übersicht</TabTitle>
        <Overview profile={profile} />
      </Tab>
      <Tab id="issues">
        <TabTitle>Fehler</TabTitle>
        <Issues scan={lastScan} />
      </Tab>
      <Tab id="settings">
        <TabTitle>Einstellungen</TabTitle>
        <Settings />
      </Tab>
    </Tabs>
  );
}
