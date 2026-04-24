import * as React from "react";
import { ScanProfileWithSuccessfulScan } from "../../api/types";
import { PdfH3, PdfText, PdfTextBold } from "./typography";
import { theme } from "./theme";
import PdfTable, { TableColumn } from "./table";
import { PdfSection, PdfSectionHeader } from "./layout";
import { View } from "@react-pdf/renderer";

interface PdfScannedPagesOverviewProps {
  profile: ScanProfileWithSuccessfulScan;
}

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
  { header: "Hinweise*", accessor: "notices", width: 70, align: "center" },
  { header: "Score", accessor: "score", width: 50, align: "center" },
];

const PdfScannedPagesOverview: React.FC<PdfScannedPagesOverviewProps> = ({
  profile,
}) => {
  const tableData: TableRowData[] =
    profile.lastSuccessfulScan?.pages.map((page) => ({
      path: new URL(page.url).pathname,
      errors: page.issues?.errors ?? 0,
      warnings: page.issues?.warnings ?? 0,
      notices: page.issues?.notices ?? 0,
      score: page.score ?? 0,
    })) ?? [];

  const pagesCount = profile.lastSuccessfulScan?.pages.length ?? 0;

  return (
    <PdfSection>
      <View
        break
        bookmark={{
          title: "Gesamtübersicht aller gescannten Seiten",
          fit: true,
        }}
      >
        <PdfSectionHeader>
          <PdfH3>Gesamtübersicht aller gescannten Seiten</PdfH3>
        </PdfSectionHeader>

        <PdfText>
          Insgesamt {pagesCount === 1 ? "wurde" : "wurden"}{" "}
          <PdfTextBold>
            {pagesCount} {pagesCount === 1 ? "Seite" : "Seiten"}
          </PdfTextBold>{" "}
          von <PdfTextBold>{profile.domain}</PdfTextBold> auf Barrierefreiheit
          geprüft.
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
        <PdfText style={{ marginTop: theme.spacing.s }}>
          * Hinweise werden nur erfasst und im Report ausgegeben, wenn sie zuvor
          im Scanprofil des Barriere-Checkers aktiviert wurden.
        </PdfText>
      </View>
    </PdfSection>
  );
};

export default PdfScannedPagesOverview;
