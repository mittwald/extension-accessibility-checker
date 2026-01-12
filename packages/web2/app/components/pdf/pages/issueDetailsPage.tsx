import { styles, theme } from "../theme";
import { Page } from "@react-pdf/renderer";
import { PdfH2, PdfH3, PdfH4, PdfText, PdfTextBold } from "../typography";
import { Issue, IssueGroup } from "../../profile/tabs/issues/types";
import wcagLinks from "../../../wcagLinks.json";
import { getIssueMeta } from "../../profile/tabs/issues/helpers";
import { FC } from "react";
import PdfTable from "../table";
import PdfFooter from "../footer";
import { PdfSection, PdfSectionHeader } from "../layout";

const groupIssuesByGuideline = (issues: Issue[]) => {
  const groups: Record<
    string,
    { label: string; description?: string; issues: Issue[] }
  > = {};

  for (const issue of issues) {
    const meta = getIssueMeta(issue);
    const guidelineKey = meta.guideline as keyof typeof wcagLinks;
    const guidelineData = wcagLinks[guidelineKey];

    if (!groups[guidelineKey]) {
      const desc =
        guidelineData && "description" in guidelineData
          ? (guidelineData as { description: string }).description
          : undefined;
      groups[guidelineKey] = {
        label: guidelineData?.label || guidelineKey,
        description: desc,
        issues: [],
      };
    }
    groups[guidelineKey].issues.push(issue);
  }

  return Object.entries(groups)
    .map(([key, data]) => ({
      key,
      ...data,
    }))
    .sort((a, b) => a.key.localeCompare(b.key));
};

interface PdfIssueGroupOverviewProps {
  group: IssueGroup;
}

const PdfIssueGroupOverview: FC<PdfIssueGroupOverviewProps> = ({ group }) => {
  const guidelineGroups = groupIssuesByGuideline(group.issues);
  const principleData = wcagLinks[group.groupKey as keyof typeof wcagLinks];
  const principleDescription =
    principleData && "description" in principleData
      ? (principleData as { description: string }).description
      : undefined;

  const totalIssuesInGroup = group.issues.reduce((total, issue) => {
    return total + issue.count;
  }, 0);

  return (
    <PdfSection marginTop>
      <PdfSectionHeader>
        <PdfH3>
          {group.groupKey}. {group.label}
        </PdfH3>
      </PdfSectionHeader>
      {principleDescription && (
        <PdfText style={{ marginBottom: theme.spacing.m }}>
          {principleDescription}{" "}
          <PdfTextBold>
            {totalIssuesInGroup} {totalIssuesInGroup === 1 ? "Problem" : "Probleme"} identifiziert.
          </PdfTextBold>
        </PdfText>
      )}

      {guidelineGroups.map((guidelineGroup) => (
        <PdfGuidelineGroup
          key={guidelineGroup.key}
          guidelineGroup={guidelineGroup}
        />
      ))}
    </PdfSection>
  );
};

const PdfIssueTable: FC<{ issues: Issue[] }> = ({ issues }) => {
  const criterionGroups: Record<
    string,
    {
      criterion: string;
      label: string;
      type: string;
      level: string;
      count: number;
    }
  > = {};

  for (const issue of issues) {
    const meta = getIssueMeta(issue);
    const criterionKey = meta.criterion as keyof typeof wcagLinks;
    const criterionData = wcagLinks[criterionKey];

    if (!criterionGroups[criterionKey]) {
      const level =
        criterionData && "wcagLevel" in criterionData
          ? (criterionData as { wcagLevel: string }).wcagLevel
          : "N/A";

      let type = "Hinweis";
      switch (issue.severity) {
        case "error":
          type = "Fehler";
          break;
        case "warning":
          type = "Warnung";
          break;
      }

      criterionGroups[criterionKey] = {
        criterion: criterionKey,
        label: criterionData?.label || criterionKey,
        type,
        level: level,
        count: 0,
      };
    }
    criterionGroups[criterionKey].count += issue.count;
  }

  const tableData = Object.values(criterionGroups)
    .map((g) => ({
      criteria: `${g.criterion} ${g.label}`,
      type: g.type,
      level: g.level,
      count: g.count,
    }))
    .sort((a, b) => a.criteria.localeCompare(b.criteria));

  return (
    <PdfTable
      data={tableData}
      columns={[
        { header: "WCAG-Kriterium", accessor: "criteria", isFlex: true },
        { header: "Typ", accessor: "type", width: 60 },
        { header: "Level", accessor: "level", width: 50, align: "center" },
        { header: "Anzahl", accessor: "count", width: 70, align: "center" },
      ]}
    />
  );
};

interface PdfGuidelineGroupProps {
  guidelineGroup: {
    key: string;
    label: string;
    description?: string;
    issues: Issue[];
  };
}

const PdfGuidelineGroup: FC<PdfGuidelineGroupProps> = ({ guidelineGroup }) => (
  <PdfSection wrap={false} marginTop>
    <PdfSectionHeader>
      <PdfH4>
        {guidelineGroup.key}. {guidelineGroup.label}
      </PdfH4>
    </PdfSectionHeader>
    {guidelineGroup.description && (
      <PdfText style={{ marginBottom: theme.spacing.m }}>
        <PdfTextBold>Auswirkungen: </PdfTextBold>
        {guidelineGroup.description}
      </PdfText>
    )}
    <PdfIssueTable issues={guidelineGroup.issues} />
  </PdfSection>
);

interface PdfIssueDetailsPageProps {
  group: IssueGroup;
  index: number;
}

const PdfIssueDetailsPage: FC<PdfIssueDetailsPageProps> = ({
  group,
  index,
}) => {
  return (
    <Page size="A4" style={styles.page}>
      {index == 0 && (
        <PdfSection marginTop>
          <PdfSectionHeader>
            <PdfH2>Detaillierte Ergebnisse</PdfH2>
          </PdfSectionHeader>
          <PdfText>
            Die folgende detaillierte Analyse schlüsselt alle
            Barrierefreiheitsprobleme nach den vier WCAG-Prinzipien auf. Für
            jedes Erfolgskriterium gibt es Informationen zum Fehlertyp, dem
            Konformitätslevel und der Häufigkeit.
          </PdfText>
        </PdfSection>
      )}
      <PdfIssueGroupOverview group={group} />
      <PdfFooter />
    </Page>
  );
};

export default PdfIssueDetailsPage;
