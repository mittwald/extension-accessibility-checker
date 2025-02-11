import { typedList } from "@mittwald/flow-react-components";
import { IssueListItemView } from "./issueListItemView.tsx";
import { Issue } from "./types.ts";

export const IssuesList = ({ groups }: { groups: Issue[] }) => {
  const IssueList = typedList<Issue>();

  return (
    <IssueList.List batchSize={groups.length} accordion>
      <IssueList.StaticData data={groups} />
      <IssueList.Item>
        {(group) => <IssueListItemView issue={group} />}
      </IssueList.Item>
    </IssueList.List>
  );
};
