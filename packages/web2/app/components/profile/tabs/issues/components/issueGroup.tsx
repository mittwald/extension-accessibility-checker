import { Heading } from "@mittwald/flow-remote-react-components";
import { IssueGroup } from "../types.ts";
import { IssuesList } from "../issueList.tsx";

export const IssueGroupView = ({ group }: { group: IssueGroup }) => {
  return (
    <>
      <Heading>
        {group.groupKey}: {group.label}
      </Heading>
      <IssuesList key={group.groupKey} groups={group.issues} />
    </>
  );
};
