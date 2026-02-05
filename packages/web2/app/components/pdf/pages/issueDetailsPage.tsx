import { styles, theme } from "../theme";
import { Page } from "@react-pdf/renderer";
import { PdfH2, PdfH3, PdfH4, PdfText, PdfTextBold } from "../typography";
import { Issue, IssueGroup } from "../../profile/tabs/issues/types";
import wcagLinks from "../../../wcagLinks.json";
import { getIssueMeta } from "../../profile/tabs/issues/helpers";
import { FC, ReactNode } from "react";
import PdfTable from "../table";
import PdfFooter from "../footer";
import { PdfSection, PdfSectionHeader } from "../layout";
import { PdfLi, PdfUl } from "../list";

interface TextPart {
  type: "bold" | "text";
  content: string;
}

const parseBoldText = (text: string): TextPart[] => {
  const parts = text.split(/(\*\*.*?\*\*)/g);
  return parts
    .filter((part) => part.length > 0)
    .map((part) => {
      if (part.startsWith("**") && part.endsWith("**")) {
        return { type: "bold" as const, content: part.slice(2, -2) };
      }
      return { type: "text" as const, content: part };
    });
};

const renderParsedText = (parts: TextPart[]): ReactNode[] => {
  return parts.map((part, i) =>
    part.type === "bold" ? (
      <PdfTextBold key={i}>{part.content}</PdfTextBold>
    ) : (
      part.content
    ),
  );
};

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
          {renderParsedText(parseBoldText(principleDescription))} Insgesamt
          wurden{" "}
          <PdfTextBold>
            {totalIssuesInGroup}{" "}
            {totalIssuesInGroup === 1 ? "Problem" : "Probleme"}
          </PdfTextBold>{" "}
          im Bereich{" "}
          {(principleData as { topic?: string })?.topic || group.label}{" "}
          identifiziert.
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

interface PdfGuidelineDescriptionProps {
  description?: string;
}

const PdfGuidelineDescription: FC<PdfGuidelineDescriptionProps> = ({
  description,
}) => {
  if (!description) return null;
  const parsedParts = parseBoldText(description);
  return (
    <PdfText style={{ marginBottom: theme.spacing.m }}>
      <PdfTextBold>Auswirkungen: </PdfTextBold>
      {renderParsedText(parsedParts)}
    </PdfText>
  );
};

interface GuidelineGroup {
  key: string;
  label: string;
  description?: string;
  issues: Issue[];
}

interface PdfGuidelineGroupProps {
  guidelineGroup: GuidelineGroup;
}

const PdfGuidelineGroup: FC<PdfGuidelineGroupProps> = ({ guidelineGroup }) => (
  <PdfSection wrap={false} marginTop>
    <PdfSectionHeader>
      <PdfH4>
        {guidelineGroup.key}. {guidelineGroup.label}
      </PdfH4>
    </PdfSectionHeader>
    <PdfGuidelineDescription description={guidelineGroup.description} />
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
            Die detaillierte Analyse gliedert sich nach den vier{" "}
            <PdfTextBold>
              WCAG-Grundprinzipien: wahrnehmbar, bedienbar, verständlich und
              robust.
            </PdfTextBold>{" "}
            WCAG 2.1 umfasst <PdfTextBold>13 Richtlinien</PdfTextBold> mit
            insgesamt <PdfTextBold>78 Erfolgskriterien</PdfTextBold>, die
            wiederum in drei Typen unterteilt werden.
          </PdfText>
          <PdfUl>
            <PdfLi>
              <PdfTextBold>Fehler</PdfTextBold> stellen eindeutig
              identifizierbare WCAG-Verstöße dar und sollten priorisiert behoben
              werden.
            </PdfLi>
            <PdfLi>
              <PdfTextBold>Warnungen</PdfTextBold> kennzeichnen potenzielle
              Barrieren, deren Bewertung vom Nutzungskontext abhängt und daher
              manuell geprüft werden muss.
            </PdfLi>
            <PdfLi>
              <PdfTextBold>Hinweise</PdfTextBold> betreffen WCAG-Prüfpunkte, die
              nicht automatisiert erkannt werden können und ausschließlich einer
              manuellen Prüfung bedürfen.
            </PdfLi>
          </PdfUl>
          <PdfText>
            Für jedes Erfolgskriterium geben die Konformitätsstufen A, AA und
            AAA den jeweiligen Grad der Barrierefreiheit an.
          </PdfText>
          <PdfUl>
            <PdfLi>
              <PdfTextBold>A:</PdfTextBold> Mindestanforderung
            </PdfLi>
            <PdfLi>
              <PdfTextBold>AA:</PdfTextBold> gilt als Standard und entspricht
              den gesetzlichen Vorgaben z. B. dem BFSG
            </PdfLi>
            <PdfLi>
              <PdfTextBold>AAA:</PdfTextBold> höchstes Niveau
            </PdfLi>
          </PdfUl>
          <PdfText>
            Das <PdfTextBold>Barrierefreiheitsstärkungsgesetz</PdfTextBold>{" "}
            (BFSG) schreibt für betroffene Unternehmen die Einhaltung der
            Konformitätsstufe <PdfTextBold>AA der WCAG 2.1</PdfTextBold> vor.
            Das bedeutet, dass die Anforderungen der WCAG-Stufen A und AA
            erfüllt sein müssen, um den gesetzlichen Vorgaben zu entsprechen.
          </PdfText>
        </PdfSection>
      )}
      <PdfIssueGroupOverview group={group} />
      <PdfFooter />
    </Page>
  );
};

export default PdfIssueDetailsPage;
