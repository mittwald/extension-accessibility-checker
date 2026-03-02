import { FC } from "react";
import { Page, View } from "@react-pdf/renderer";
import { PdfH3, PdfText, PdfTextBold } from "../typography";
import PdfTable, { TableColumn } from "../table";
import { IssueGroup } from "../../profile/tabs/issues/types";
import { styles, theme } from "../theme";
import { ScanProfile } from "../../../api/types";
import PdfAlert from "../alert";
import PdfFooter from "../footer";

interface PdfSummaryPageProps {
  profile: ScanProfile;
  issueGroups: IssueGroup[];
}

const PdfSummaryPage: FC<PdfSummaryPageProps> = ({ profile, issueGroups }) => {
  const summaryData = issueGroups.map((group) => {
    let errorCount = 0;
    let warningCount = 0;
    let noticeCount = 0;

    group.issues.forEach((issue) => {
      if (issue.severity === "error") errorCount += issue.count;
      else if (issue.severity === "warning") warningCount += issue.count;
      else noticeCount += issue.count;
    });

    return {
      principle: group.label.split("(")[0].trim(),
      error: errorCount,
      warning: warningCount,
      notice: noticeCount,
      total: errorCount + warningCount + noticeCount,
    };
  });

  const totalError = summaryData.reduce((sum, row) => sum + row.error, 0);
  const totalWarning = summaryData.reduce((sum, row) => sum + row.warning, 0);
  const totalNotice = summaryData.reduce((sum, row) => sum + row.notice, 0);
  const totalAll = summaryData.reduce((sum, row) => sum + row.total, 0);

  type MappedTableRow = {
    principle: string;
    error: number;
    warning: number;
    notice: number;
    total: number;
  };

  const footerData: MappedTableRow = {
    principle: "Gesamt",
    error: totalError,
    warning: totalWarning,
    notice: totalNotice,
    total: totalAll,
  };

  const columns: TableColumn<MappedTableRow>[] = [
    { header: "Prinzip", accessor: "principle", isFlex: true },
    { header: "Fehler", accessor: "error", width: 60, align: "center" },
    { header: "Warnungen", accessor: "warning", width: 80, align: "center" },
    { header: "Hinweise*", accessor: "notice", width: 70, align: "center" },
    { header: "Gesamt", accessor: "total", width: 60, align: "center" },
  ];

  return (
    <Page
      size="A4"
      style={styles.page}
      bookmark={{ title: "Zusammenfassung und Priorisierung", fit: true }}
    >
      <View style={{ marginBottom: theme.spacing.m }}>
        <PdfH3>Zusammenfassung und Priorisierung</PdfH3>
        <PdfText style={{ marginVertical: theme.spacing.s }}>
          Im Rahmen der WCAG-Analyse der Website{" "}
          <PdfTextBold>{profile.domain}</PdfTextBold> wurden insgesamt{" "}
          <PdfTextBold>
            {profile.issueSummary?.errors ?? 0} automatisch erkennbare Fehler
          </PdfTextBold>
          ,{" "}
          <PdfTextBold>
            {profile.issueSummary?.warnings ?? 0} kontextabhängige Warnungen
          </PdfTextBold>{" "}
          sowie{" "}
          <PdfTextBold>
            {profile.issueSummary?.notices ?? 0} Hinweise zur manuellen Prüfung
          </PdfTextBold>{" "}
          festgestellt.
        </PdfText>
        <PdfText>
          Die <PdfTextBold>Fehler</PdfTextBold> stellen eindeutig
          identifizierbare WCAG-Verstöße dar und sollten priorisiert behoben
          werden. <PdfTextBold>Warnungen</PdfTextBold> und{" "}
          <PdfTextBold>Hinweise</PdfTextBold> lassen sich nicht vollständig
          automatisiert bewerten und erfordern eine manuelle Prüfung, da ihre
          Relevanz vom jeweiligen Seiteninhalt und Nutzungsszenario abhängt.
        </PdfText>
      </View>

      <PdfTable
        data={summaryData.map((row) => ({
          principle: row.principle,
          error: row.error,
          warning: row.warning,
          notice: row.notice,
          total: row.total,
        }))}
        footerData={footerData}
        columns={columns}
      />
      <PdfText style={{ marginTop: theme.spacing.s }}>* Hinweise werden nur erfasst und im Report ausgegeben, wenn sie zuvor im Scanprofil des Barriere-Checkers aktiviert wurden.</PdfText>

      <PdfText
        style={{ marginTop: theme.spacing.m, marginBottom: theme.spacing.s }}
      >
        Die Zuordnung zu den{" "}
        <PdfTextBold>WCAG-Konformitätsstufen (A, AA, AAA)</PdfTextBold> bietet
        eine zusätzliche Entscheidungsgrundlage für die weitere Umsetzung.
      </PdfText>
      <PdfAlert
        title="Hinweis"
        description="Nicht alle Barrieren können automatisiert geprüft werden. Bestimmte Aspekte der Barrierefreiheit müssen daher immer manuell getestet werden, unabhängig vom Ergebnis der automatisierten Analyse."
      ></PdfAlert>
      <PdfFooter />
    </Page>
  );
};

export default PdfSummaryPage;
