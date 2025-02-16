import { ScanProfile } from "../../../api/types.ts";
import { Section } from "@mittwald/flow-react-components";
import { CurrentScan } from "../currentScan.tsx";
import { PathResultsTable } from "./overview/pathResultsTable.tsx";
import { IssueSummary } from "./overview/issueSummary.tsx";
import { A11yScore } from "./overview/a11yScore.tsx";

export const Overview = ({ profile }: { profile: ScanProfile }) => {
  return (
    <Section>
      <CurrentScan />
      <A11yScore profile={profile} />
      <Section>
        <IssueSummary profile={profile} />
      </Section>
      <Section>
        <PathResultsTable />
      </Section>
    </Section>
  );
};
