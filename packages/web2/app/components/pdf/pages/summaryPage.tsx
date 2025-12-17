import { FC } from "react";
import { Page, View } from "@react-pdf/renderer";
import { PdfH3, PdfText } from "../typography";
import PdfTable, { TableColumn } from "../table";
import { IssueGroup } from "../../profile/tabs/issues/types";
import { styles, theme } from "../theme";

interface PdfSummaryPageProps {
  issueGroups: IssueGroup[];
}

const PdfSummaryPage: FC<PdfSummaryPageProps> = ({ issueGroups }) => {
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
    { header: "Hinweise", accessor: "notice", width: 70, align: "center" },
    { header: "Gesamt", accessor: "total", width: 60, align: "center" },
  ];

  return (
    <Page size="A4" style={styles.page}>
      <View style={{ marginBottom: theme.spacing.m }}>
        <PdfH3>Zusammenfassung nach Prinzipien</PdfH3>
        <PdfText style={{ marginTop: theme.spacing.s }}>
          Hier folgt eine Zusammenfassung der Barrierefreiheitsprobleme, die
          während des Scans gefunden wurden. Die Probleme sind nach den vier
          WCAG-Prinzipien gruppiert.
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
    </Page>
  );
};

export default PdfSummaryPage;
