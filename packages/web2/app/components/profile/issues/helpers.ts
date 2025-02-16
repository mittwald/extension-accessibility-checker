import { Issue as APIIssue } from "../../../api/types.ts";
import wcagLinks from "../../../wcagLinks.json";
import techniquesLinks from "../../../techniquesLinks.json";
import { Issue, IssueGroup, IssueMeta } from "./types.ts";

export const getLinkForTechnique = (technique: string) => {
  switch (technique.charAt(0)) {
    case "ARIA":
    case "SCR":
    case "C":
    case "F":
    case "G":
    case "H":
      return `https://www.w3.org/WAI/WCAG22/Techniques/html/${technique}`;
    case "PDF":
    case "SVR":
    case "SM":
    case "T":
    default:
      return null;
  }
};

export const getIssueMeta = (issue: APIIssue): IssueMeta => {
  const [wcagLevel, principle, guideline, criterion, techniques, ...rest] =
    issue.errorCode.split(".");
  return {
    wcagLevel,
    principle: principle.replace("Principle", "").replace("_", "."),
    guideline: guideline
      .replace("Guideline", "")
      .replace("_", ".") as keyof typeof wcagLinks,
    criterion: criterion.split("_").join(".") as keyof typeof wcagLinks,
    techniques: techniques.split(",") as (keyof typeof techniquesLinks)[],
    rest,
  };
};

export const groupIssuesByGuidelineAndTechnique = (
  issues: APIIssue[],
): IssueGroup[] => {
  const groupedByCode: Record<
    IssueGroup["groupKey"],
    Record<string, Omit<Issue, "key">>
  > = {};

  // Group issues by errorCode and selector
  for (const issue of issues) {
    const meta = getIssueMeta(issue);
    const groupKey = `${meta.guideline}`;
    const issueKey = `${meta.criterion}.${meta.techniques.join(",")}`;

    if (!groupedByCode[groupKey]) {
      groupedByCode[groupKey] = {};
    }

    if (!groupedByCode[groupKey][issueKey]) {
      groupedByCode[groupKey][issueKey] = {
        meta,
        count: 0,
        description: issue.description,
        errorCode: issue.errorCode,
        severity: issue.severity,
        selectors: [],
      };
    }

    const aggregatedIssue = groupedByCode[groupKey][issueKey];
    aggregatedIssue.count++;

    const occurrence = aggregatedIssue.selectors.find(
      (s) => s.selector === issue.selector,
    );
    if (occurrence) {
      occurrence.urls.push(issue.url);
    } else {
      aggregatedIssue.selectors.push({
        selector: issue.selector,
        context: issue.context,
        urls: [issue.url],
      });
    }
  }

  // Transform the grouped issues into IssueGroup objects
  return Object.entries(groupedByCode).map(([errorCode, selectorGroups]) => ({
    groupKey: errorCode,
    label: wcagLinks[errorCode as keyof typeof wcagLinks]?.label ?? "",
    issues: Object.entries(selectorGroups).map(([key, issueData]) => ({
      key,
      ...issueData,
    })),
  }));
};
