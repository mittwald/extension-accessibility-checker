import {
  ColumnLayout,
  Content,
  Label,
  LabeledValue,
  Section,
} from "@mittwald/flow-react-components";
import { Scan } from "../../api/types.ts";
import { groupIssuesByGuidelineAndTechnique } from "./issues/helpers.ts";
import { IssueGroupView } from "./issues/components/issueGroup.tsx";

interface IssuesProps {
  scan: Scan;
}

export const Issues = ({ scan }: IssuesProps) => {
  const date = new Date(scan.completedAt ?? scan.executionScheduledFor);

  const preparedIssues = (scan.issues ?? []).sort((a, b) => {
    const order = {
      error: 0,
      warning: 1,
      notice: 2,
    };
    return order[a.severity] - order[b.severity];
  });

  const issueGroups = groupIssuesByGuidelineAndTechnique(preparedIssues ?? []);

  return (
    <Section>
      <ColumnLayout>
        <LabeledValue>
          <Label>Ausgeführt am</Label>
          <Content>{date.toLocaleString()}</Content>
        </LabeledValue>
      </ColumnLayout>
      <Section>
        {issueGroups.map((issueGroup) => (
          <IssueGroupView group={issueGroup} />
        ))}
      </Section>
    </Section>
  );
};
