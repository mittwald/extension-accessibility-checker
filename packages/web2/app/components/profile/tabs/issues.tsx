import {
  Button,
  ColumnLayout,
  Content,
  ContextMenu,
  ContextMenuTrigger,
  IconFilter,
  Label,
  LabeledValue,
  MenuItem,
  Section,
  Separator,
  Text,
} from "@mittwald/flow-remote-react-components";
import { Scan } from "../../../api/types.ts";
import {
  getIssueMeta,
  groupIssuesByGuidelineAndTechnique,
} from "./issues/helpers.ts";
import { IssueGroupView } from "./issues/components/issueGroup.tsx";
import { CurrentScan } from "../currentScan.tsx";
import { useState } from "react";
import { NoIssues } from "../noIssues.tsx";
import wcagLinks from "../../../wcagLinks.json";

interface IssuesProps {
  scan: Scan;
}

export const Issues = ({ scan }: IssuesProps) => {
  const date = scan.completedAt ?? scan.executionScheduledFor;

  const [viewOptions, setViewOptions] = useState([
    "A",
    "AA",
    "AAA",
    "error",
    "warning",
    "notice",
  ]);

  const toggleOption = (option: string) => () => {
    if (viewOptions.includes(option)) {
      setViewOptions(viewOptions.filter((o) => o !== option));
    } else {
      setViewOptions([...viewOptions, option]);
    }
  };

  const preparedIssues = (scan.issues ?? [])
    .filter((issue) => viewOptions.includes(issue.severity))
    .filter((issue) => {
      const meta = getIssueMeta(issue);
      const wcagData = wcagLinks[meta.criterion];
      return (
        !wcagData ||
        !("wcagLevel" in wcagData) ||
        viewOptions.includes(wcagData.wcagLevel)
      );
    })
    .sort((a, b) => {
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
      <CurrentScan />
      <ColumnLayout>
        <ContextMenuTrigger>
          <Button variant={"outline"} color={"secondary"}>
            <Text>Filteroptionen</Text>
            <IconFilter />
          </Button>
          <ContextMenu
            selectionMode="multiple"
            defaultSelectedKeys={viewOptions}
          >
            <MenuItem id="A" onAction={toggleOption("A")}>
              Level A
            </MenuItem>
            <MenuItem id="AA" onAction={toggleOption("AA")}>
              Level AA
            </MenuItem>
            <MenuItem id="AAA" onAction={toggleOption("AAA")}>
              Level AAA
            </MenuItem>
            <Separator />
            <MenuItem id="error" onAction={toggleOption("error")}>
              Fehler
            </MenuItem>
            <MenuItem id="warning" onAction={toggleOption("warning")}>
              Warnungen
            </MenuItem>
            <MenuItem id="notice" onAction={toggleOption("notice")}>
              Hinweise
            </MenuItem>
          </ContextMenu>
        </ContextMenuTrigger>
        <LabeledValue>
          <Label>Ausgeführt am</Label>
          <Content>{date.toLocaleString()}</Content>
        </LabeledValue>
      </ColumnLayout>

      {issueGroups.length === 0 && <NoIssues />}
      {issueGroups.map((issueGroup) => (
        <IssueGroupView key={issueGroup.groupKey} group={issueGroup} />
      ))}
    </Section>
  );
};
