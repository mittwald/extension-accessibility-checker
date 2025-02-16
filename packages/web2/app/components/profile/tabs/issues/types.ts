import wcagLinks from "../../../../wcagLinks.json";
import techniquesLinks from "../../../../techniquesLinks.json";
import { Issue as ApiIssue } from "../../../../api/types.ts";

export interface IssueMeta {
  wcagLevel: string;
  principle: string;
  guideline: keyof typeof wcagLinks;
  criterion: keyof typeof wcagLinks;
  techniques: (keyof typeof techniquesLinks)[];
  rest: string[];
}

export interface IssueGroup {
  groupKey: string;
  label: string;
  issues: Issue[];
}

export interface Issue
  extends Pick<ApiIssue, "description" | "errorCode" | "severity"> {
  key: string;
  count: number;
  description: string;

  meta: IssueMeta;
  selectors: IssueOccurrence[];
}

export interface IssueOccurrence {
  selector?: string;
  context?: string;
  urls: string[];
}
