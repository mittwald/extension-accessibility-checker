import { ScanProfile } from "../../../api/types.ts";
import { Section } from "@mittwald/flow-remote-react-components";
import { CurrentScan } from "../currentScan.tsx";
import { PathResultsTable } from "./overview/pathResultsTable.tsx";
import { IssueSummary } from "./overview/issueSummary.tsx";
import { A11yScore } from "./overview/a11yScore.tsx";

export const Overview = ({ profile }: { profile: ScanProfile }) => {
  return (
    <Section>
      <CurrentScan />
      <A11yScore profile={profile} />
      <IssueSummary profile={profile} />
      <PathResultsTable />
    </Section>
  );
};
