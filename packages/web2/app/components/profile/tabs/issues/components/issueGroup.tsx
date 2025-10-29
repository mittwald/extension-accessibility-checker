import { Heading } from "@mittwald/flow-remote-react-components";
import { IssueGroup } from "~/components/profile/tabs/issues/types";
import { IssuesList } from "~/components/profile/tabs/issues/issueList";

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
