import { Issue as APIIssue } from "../../../../api/types.ts";
import wcagLinks from "../../../../wcagLinks.json";
import techniquesLinks from "../../../../techniquesLinks.json";
import { Issue, IssueGroup, IssueMeta } from "./types.ts";

export const getLinkForTechnique = (technique: string) => {
  switch (true) {
    case technique.startsWith("ARIA"):
      return `https://www.w3.org/WAI/WCAG22/Techniques/aria/${technique}`;
    case technique.startsWith("SCR"):
      return `https://www.w3.org/WAI/WCAG22/Techniques/client-side-script/${technique}`;
    case technique.startsWith("C"):
      return `https://www.w3.org/WAI/WCAG22/Techniques/css/${technique}`;
    case technique.startsWith("F"):
      return `https://www.w3.org/WAI/WCAG22/Techniques/failures/${technique}`;
    case technique.startsWith("G"):
      return `https://www.w3.org/WAI/WCAG22/Techniques/general/${technique}`;
    case technique.startsWith("H"):
      return `https://www.w3.org/WAI/WCAG22/Techniques/html/${technique}`;
    case technique.startsWith("PDF"):
      return `https://www.w3.org/WAI/WCAG22/Techniques/pdf/${technique}`;
    case technique.startsWith("SVR"):
      return `https://www.w3.org/WAI/WCAG22/Techniques/server-side-script/${technique}`;
    case technique.startsWith("SM"):
      return `https://www.w3.org/WAI/WCAG22/Techniques/smil/${technique}`;
    case technique.startsWith("T"):
      return `https://www.w3.org/WAI/WCAG22/Techniques/text/${technique}`;
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
    criterion: criterion
      .split("_")
      .slice(0, 3)
      .join(".") as keyof typeof wcagLinks,
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
