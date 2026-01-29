import * as React from "react";
import { ScanProfileWithSuccessfulScan } from "../../../api/types";
import { Page } from "@react-pdf/renderer";
import { PdfH3, PdfText, PdfTextBold } from "../typography";
import { styles, theme } from "../theme";
import PdfTable, { TableColumn } from "../table";
import PdfFooter from "../footer";

interface PdfScannedPagesPageProps {
  profile: ScanProfileWithSuccessfulScan;
}

const PdfScannedPagesPage: React.FC<PdfScannedPagesPageProps> = ({
  profile,
}) => {
  type TableRowData = {
    path: string;
    errors: number | string;
    warnings: number | string;
    notices: number | string;
    score: number | string;
  };

  const tableColumns: TableColumn<TableRowData>[] = [
    { header: "Pfade", accessor: "path", isFlex: true, align: "left" },
    { header: "Fehler", accessor: "errors", width: 50, align: "center" },
    { header: "Warnungen", accessor: "warnings", width: 80, align: "center" },
    { header: "Hinweise", accessor: "notices", width: 70, align: "center" },
    { header: "Score", accessor: "score", width: 50, align: "center" },
  ];

  const tableData: TableRowData[] =
    profile.lastSuccessfulScan?.pages.map((page) => ({
      path: new URL(page.url).pathname,
      errors: page.issues?.errors ?? 0,
      warnings: page.issues?.warnings ?? 0,
      notices: page.issues?.notices ?? 0,
      score: page.score ?? 0,
    })) ?? [];

  return (
    <Page size="A4" style={{ ...styles.page, gap: theme.spacing.m }}>
      <PdfH3>Gesamtübersicht aller gescannten Seiten</PdfH3>

      <PdfText>
        Insgesamt wurden{" "}
        <PdfTextBold>
          {profile.lastSuccessfulScan?.pages.length ?? 0} Seiten
        </PdfTextBold>{" "}
        von <PdfTextBold>{profile.domain}</PdfTextBold> auf Barrierefreiheit
        geprüft. auf Barrierefreiheit geprüft.
      </PdfText>

      <PdfTable
        columns={tableColumns}
        data={tableData}
        footerData={{
          path: "Gesamtbewertung",
          errors: "",
          warnings: "",
          notices: "",
          score: `Ø ${profile.issueSummary?.score ?? 0}`,
        }}
      />
      <PdfFooter />
    </Page>
  );
};

export default PdfScannedPagesPage;
