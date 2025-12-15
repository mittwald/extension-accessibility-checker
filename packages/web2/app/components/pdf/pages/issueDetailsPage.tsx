import { styles, theme } from "../theme";
import { Page, View } from "@react-pdf/renderer";
import { PdfH3, PdfH4, PdfText, PdfTextBold } from "../typography";
import { Issue, IssueGroup } from "../../profile/tabs/issues/types";
import wcagLinks from "../../../wcagLinks.json";
import { getIssueMeta } from "../../profile/tabs/issues/helpers";
import { FC } from "react";
import PdfTable from "../table";
import PdfFooter from "../footer";

const groupIssuesByGuideline = (issues: Issue[]) => {
  const groups: Record<
    string,
    { label: string; description?: string; issues: Issue[] }
  > = {};

  issues.forEach((issue) => {
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
  });

  return Object.entries(groups)
    .map(([key, data]) => ({
      key,
      ...data,
    }))
    .sort((a, b) => a.key.localeCompare(b.key));
};

interface IssueGroupOverviewProps {
  group: IssueGroup;
}

const IssueGroupOverview: FC<IssueGroupOverviewProps> = ({ group }) => {
  const guidelineGroups = groupIssuesByGuideline(group.issues);
  const principleData = wcagLinks[group.groupKey as keyof typeof wcagLinks];
  const principleDescription =
    principleData && "description" in principleData
      ? (principleData as { description: string }).description
      : undefined;

  return (
    <View style={{ marginTop: theme.spacing.m }}>
      <PdfH3 style={{ marginBottom: theme.spacing.s }}>
        {group.groupKey}. {group.label}
      </PdfH3>
      {principleDescription && (
        <PdfText style={{ marginBottom: theme.spacing.m }}>
          {principleDescription}{" "}
          <PdfTextBold>
            {group.issues.reduce((total, issue) => {
              return total + issue.count;
            }, 0)}{" "}
            Probleme idenitifiziert
          </PdfTextBold>
        </PdfText>
      )}

      {guidelineGroups.map((guidelineGroup) => (
        <View
          key={guidelineGroup.key}
          style={{ marginBottom: theme.spacing.l }}
          wrap={false}
        >
          <PdfH4 style={{ marginBottom: theme.spacing.s }}>
            {guidelineGroup.key} {guidelineGroup.label}
          </PdfH4>

          {guidelineGroup.description && (
            <PdfText style={{ marginBottom: theme.spacing.m }}>
              <ValidatedPdfTextBold>Auswirkungen: </ValidatedPdfTextBold>
              {guidelineGroup.description}
            </PdfText>
          )}

          <IssueTable issues={guidelineGroup.issues} />
        </View>
      ))}
    </View>
  );
};

const ValidatedPdfTextBold: FC<{ children: React.ReactNode }> = ({
  children,
}) => (
  <PdfText style={{ fontWeight: theme.fontWeight.bold, fontFamily: "Inter" }}>
    {children}
  </PdfText>
);

const IssueTable: FC<{ issues: Issue[] }> = ({ issues }) => {
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

  issues.forEach((issue) => {
    const meta = getIssueMeta(issue);
    const criterionKey = meta.criterion as keyof typeof wcagLinks;
    const criterionData = wcagLinks[criterionKey];

    if (!criterionGroups[criterionKey]) {
      const level =
        criterionData && "wcagLevel" in criterionData
          ? (criterionData as { wcagLevel: string }).wcagLevel
          : "N/A";
      criterionGroups[criterionKey] = {
        criterion: criterionKey,
        label: criterionData?.label || criterionKey,
        type:
          issue.severity === "error"
            ? "Fehler"
            : issue.severity === "warning"
              ? "Hinweis"
              : "Hinweis",
        level: level,
        count: 0,
      };
      if (issue.severity === "error")
        criterionGroups[criterionKey].type = "Fehler";
      else if (issue.severity === "warning")
        criterionGroups[criterionKey].type = "Warnung";
      else criterionGroups[criterionKey].type = "Hinweis";
    }
    criterionGroups[criterionKey].count += issue.count;
  });

  const tableData = Object.values(criterionGroups)
    .map((g) => ({
      col1: `${g.criterion} ${g.label}`,
      col2: g.type,
      col3: g.level,
      col4: g.count,
    }))
    .sort((a, b) => a.col1.localeCompare(b.col1));

  return (
    <PdfTable
      data={tableData}
      columns={[
        { header: "WCAG-Kriterium", accessor: "col1", isFlex: true },
        { header: "Typ", accessor: "col2", width: 60 },
        { header: "Level", accessor: "col3", width: 50, align: "center" },
        { header: "Anzahl", accessor: "col4", width: 70, align: "center" },
      ]}
    />
  );
};

interface IssueDetailsPageProps {
  group: IssueGroup;
  index: number;
}

const IssueDetailsPage: FC<IssueDetailsPageProps> = ({ group, index }) => {
  return (
    <Page size="A4" style={styles.page}>
      {index == 0 && (
        <View style={{ marginBottom: theme.spacing.m }}>
          <PdfH3>Detaillierte Ergebnisse</PdfH3>
          <PdfText>
            Die folgende detaillierte Analyse schlüsselt alle
            Barrierefreiheitsprobleme nach den vier WCAG-Prinzipien auf. Für
            jedes Erfolgskriterium gibt es Informationen zum Fehlertyp, dem
            Konformitätslevel und der Häufigkeit.
          </PdfText>
        </View>
      )}
      <IssueGroupOverview group={group} />
      <PdfFooter />
    </Page>
  );
};

export default IssueDetailsPage;
