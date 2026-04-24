import * as React from "react";
import { ScanProfileWithSuccessfulScan } from "../../../api/types";
import { Page, View } from "@react-pdf/renderer";
import { PdfIconAccessible, PdfIconMittwald } from "../icons";
import { PdfH1, PdfLargeHeading, PdfText, PdfTextBold } from "../typography";
import { styles } from "../theme";

interface PdfFrontPageProps {
  profile: ScanProfileWithSuccessfulScan;
}

const PdfFrontPage: React.FC<PdfFrontPageProps> = ({ profile }) => {
  return (
    <Page size="A4" style={styles.page}>
      <View style={styles.frontPage}>
        <PdfH1 style={{ textAlign: "center" }}>
          Detaillierte Analyse der Prüfung auf Barrierefreiheit nach den
          WCAG-Grundprinzipien
        </PdfH1>
        <View style={styles.frontPageContent}>
          <PdfIconAccessible size={64} style={{ marginBottom: 4 }} />
          <View style={styles.frontPageInner}>
            <PdfLargeHeading>Barrierefreiheits-Report</PdfLargeHeading>
            <View style={{ flexDirection: "column", alignItems: "center" }}>
              <PdfText style={{ marginBottom: 18 }}>
                Strukturierte Analyse aller Fehler nach den WCAG-Grundprinzipien
              </PdfText>
              <PdfText style={{ marginBottom: 2 }}>
                <PdfTextBold>Domain:</PdfTextBold> {profile.domain}
              </PdfText>
              <PdfText style={{ marginBottom: 2 }}>
                <PdfTextBold>Scan-Datum:</PdfTextBold>{" "}
                {profile.lastSuccessfulScan?.createdAt.toLocaleDateString(
                  "de-DE",
                )}
              </PdfText>
              <PdfText>
                <PdfTextBold>Report erstellt:</PdfTextBold>{" "}
                {new Date().toLocaleDateString("de-DE")}
              </PdfText>
            </View>
          </View>
        </View>
        <View style={styles.frontPageFooter}>
          <PdfIconMittwald size={30} />
        </View>
      </View>
    </Page>
  );
};

export default PdfFrontPage;
