import { describe, expect, test } from "vitest";
import { sortIssuesBySeverity } from "./helpers.ts";
import { Issue, IssueMeta } from "./types.ts";

const buildIssueItem = (
  item: Partial<Issue>,
  issueMeta?: Partial<IssueMeta>,
) => {
  const commonMeta: IssueMeta = {
    criterion: "1.1.1",
    principle: "1",
    guideline: "1.1",
    techniques: ["H67"],
    rest: ["1"],
    wcagLevel: "WCAG2AA",
  };

  const meta = issueMeta ? { ...commonMeta, ...issueMeta } : commonMeta;
  const severity = item.severity ?? "warning";

  const common: Issue = {
    count: 2,
    description:
      "Img element is marked so that it is ignored by Assistive Technology.",
    errorCode: "WCAG2AA.Principle1.Guideline1_1.1_1_1.H67.1",
    selectors: [
      {
        selector: "html > body > main > img:nth-child(2)",
        context: '<img src="/images/hero.png" alt="" role="presentation">',
        urls: ["https://example.com/", "https://example.com/impressum"],
      },
    ],
    key: `${meta.criterion}.${meta.techniques.join(",")}.${severity}`,
    severity,
    meta,
  };
  return { ...common, ...item };
};

describe("sortIssuesBySeverity", () => {
  test("sorts by severity", () => {
    const issues: Issue[] = [
      buildIssueItem({ severity: "notice" }),
      buildIssueItem({ severity: "error" }),
      buildIssueItem({ severity: "warning" }),
      buildIssueItem({ severity: "notice" }),
      buildIssueItem({ severity: "error" }),
    ];

    const result = sortIssuesBySeverity(issues);

    expect(
      result.map((issue) => [issue.severity, issue.meta.criterion]),
    ).toEqual([
      ["error", "1.1.1"],
      ["error", "1.1.1"],
      ["warning", "1.1.1"],
      ["notice", "1.1.1"],
      ["notice", "1.1.1"],
    ]);
  });

  test("sorts criteria by numeric segment", () => {
    const issues: Issue[] = [
      buildIssueItem({}, { criterion: "1.4.13" }),
      buildIssueItem({}, { criterion: "1.4.10" }),
      buildIssueItem({}, { criterion: "2.1" }),
      buildIssueItem({}, { criterion: "1.4.2" }),
    ];

    const result = sortIssuesBySeverity(issues);

    expect(
      result.map((issue) => [issue.severity, issue.meta.criterion]),
    ).toEqual([
      ["warning", "1.4.2"],
      ["warning", "1.4.10"],
      ["warning", "1.4.13"],
      ["warning", "2.1"],
    ]);
  });

  test("sorts shorter matching criteria first", () => {
    const issues: Issue[] = [
      buildIssueItem({}, { criterion: "1.2" }),
      buildIssueItem({}, { criterion: "1.1.1" }),
      buildIssueItem({}, { criterion: "1.1" }),
    ];

    const result = sortIssuesBySeverity(issues);

    expect(
      result.map((issue) => [issue.severity, issue.meta.criterion]),
    ).toEqual([
      ["warning", "1.1"],
      ["warning", "1.1.1"],
      ["warning", "1.2"],
    ]);
  });

  test("sorts by severity before criterion", () => {
    const issues: Issue[] = [
      buildIssueItem({ severity: "warning" }, { criterion: "1.1.1" }),
      buildIssueItem({ severity: "error" }, { criterion: "4.1.2" }),
    ];

    const result = sortIssuesBySeverity(issues);

    expect(
      result.map((issue) => [issue.severity, issue.meta.criterion]),
    ).toEqual([
      ["error", "4.1.2"],
      ["warning", "1.1.1"],
    ]);
  });

  test("does not mutate the input array", () => {
    const issues: Issue[] = [
      buildIssueItem({ severity: "notice" }, { criterion: "2.1" }),
      buildIssueItem({ severity: "error" }, { criterion: "1.1.1" }),
      buildIssueItem({ severity: "warning" }, { criterion: "1.4.2" }),
    ];
    const originalOrder = issues.map((issue) => [
      issue.severity,
      issue.meta.criterion,
    ]);

    sortIssuesBySeverity(issues);

    expect(
      issues.map((issue) => [issue.severity, issue.meta.criterion]),
    ).toEqual(originalOrder);
  });
});
