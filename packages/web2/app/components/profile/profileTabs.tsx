import { Scan, ScanProfile } from "../../api/types.ts";
import {
  AlertIcon,
  Tab,
  Tabs,
  TabTitle,
} from "@mittwald/flow-remote-react-components";
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
        <TabTitle>Details</TabTitle>
        <Issues scan={lastScan} />
      </Tab>
      <Tab id="settings">
        <TabTitle>
          Einstellungen
          <AlertIcon status="info" />
        </TabTitle>
        <Settings />
      </Tab>
    </Tabs>
  );
}
