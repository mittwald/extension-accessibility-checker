import { typedList } from "@mittwald/flow-remote-react-components";
import { IssueListItemView } from "./issueListItemView.tsx";
import { Issue } from "./types.ts";
import { sortIssuesBySeverity } from "./helpers.ts";

export const IssuesList = ({ groups }: { groups: Issue[] }) => {
  const IssueList = typedList<Issue>();

  const issues = sortIssuesBySeverity(groups);

  return (
    <IssueList.List hidePagination batchSize={issues.length} accordion>
      <IssueList.StaticData data={issues} />
      <IssueList.Item textValue={(i) => i.errorCode}>
        {(group) => <IssueListItemView issue={group} />}
      </IssueList.Item>
    </IssueList.List>
  );
};
