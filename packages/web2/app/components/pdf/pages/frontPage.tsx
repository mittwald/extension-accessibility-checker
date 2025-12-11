import * as React from "react";
import { ScanProfileWithSuccessfulScan } from "../../../api/types";
import { Page, View } from "@react-pdf/renderer";
import { PdfIconAccessible, PdfIconMittwald } from "../icons";
import { PdfH1, PdfText, PdfTextBold } from "../typography";
import { styles, theme } from "../theme";

interface PdfFrontPageProps {
  profile: ScanProfileWithSuccessfulScan;
}

const PdfFrontPage: React.FC<PdfFrontPageProps> = ({ profile }) => {
  return (
    <Page size="A4" style={styles.page}>
      <View style={styles.frontPage}>
        <View
          style={{
            padding: 16,
            flexDirection: "column",
            alignItems: "center",
            height: "100%",
          }}
        >
          <PdfIconAccessible
            size={theme.page.front.iconSize}
            style={{ marginBottom: 4 }}
          />
          <View
            style={{
              padding: 16,
              flexDirection: "column",
              alignItems: "center",
              flexGrow: 1,
            }}
          >
            <PdfH1 style={{ marginBottom: 6 }}>Barrierefreiheits-Report</PdfH1>
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
        <View
          style={{
            width: "100%",
            flexDirection: "row",
            justifyContent: "flex-end",
          }}
        >
          <PdfIconMittwald size={30} />
        </View>
      </View>
    </Page>
  );
};

export default PdfFrontPage;
