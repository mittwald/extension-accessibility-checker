import { typedList } from "@mittwald/flow-react-components";
import { Issue } from "../../../api/types.ts";
import { IssueListItemView } from "./issueListItemView.tsx";

export const IssuesList = ({ issues }: { issues: Issue[] }) => {
  const IssueList = typedList<Issue>();

  return (
    <IssueList.List batchSize={issues.length} accordion>
      <IssueList.StaticData data={issues} />
      <IssueList.Item>
        {(issue) => <IssueListItemView issue={issue} />}
      </IssueList.Item>
    </IssueList.List>
  );
};
