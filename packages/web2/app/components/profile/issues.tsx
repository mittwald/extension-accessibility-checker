import {
  ColumnLayout,
  Content,
  Label,
  LabeledValue,
  Section,
} from "@mittwald/flow-react-components";
import { Scan } from "../../api/types.ts";
import { IssuesList } from "./issues/issueList.tsx";

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

  return (
    <Section>
      <ColumnLayout>
        <LabeledValue>
          <Label>Ausgeführt am</Label>
          <Content>{date.toLocaleString()}</Content>
        </LabeledValue>
      </ColumnLayout>
      <Section>
        <IssuesList issues={preparedIssues ?? []} />
      </Section>
    </Section>
  );
};
