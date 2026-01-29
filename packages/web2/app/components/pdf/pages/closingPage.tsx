import { FC } from "react";
import { Page, View } from "@react-pdf/renderer";
import { styles, theme } from "../theme";
import { ScanProfileWithSuccessfulScan } from "../../../api/types";
import { PdfLink, PdfSmall, PdfSmallBold } from "../typography";

interface PdfClosingPageProps {
  profile: ScanProfileWithSuccessfulScan;
}

const PdfClosingPage: FC<PdfClosingPageProps> = ({ profile }) => {
  const createdDate = new Date().toLocaleDateString("de-DE");
  const scanDate = profile.lastSuccessfulScan?.createdAt
    ? new Date(profile.lastSuccessfulScan.createdAt).toLocaleDateString("de-DE")
    : "N/A";

  return (
    <Page size="A4" style={styles.page}>
      {/* just a placeholder */}
      <View style={{ flexGrow: 1 }} />
      <View style={styles.footerContainer}>
        <PdfSmall>
          made with 💙 by{" "}
          <PdfLink
            style={{ fontSize: theme.fontSize.small }}
            src="https://mittwald.de"
          >
            mittwald
          </PdfLink>
        </PdfSmall>
        <PdfSmall>
          <PdfSmallBold>Report erstellt:</PdfSmallBold> {createdDate} |{" "}
          <PdfSmallBold>Scandatum:</PdfSmallBold> {scanDate}
        </PdfSmall>
        <PdfSmall>
          Dieser Report wurde automatisiert aus den Daten des Barriere-Checkers
          von mittwald generiert.
        </PdfSmall>
        <PdfSmall style={{ textAlign: "center" }}>
          Disclaimer / Rechtlicher Hinweis: Dieses Dokument dient lediglich der
          Information und stellt keine Rechtsberatung dar. Eine Gewähr und
          Haftung für die Richtigkeit aller Angaben wird nicht übernommen.
        </PdfSmall>
      </View>
    </Page>
  );
};

export default PdfClosingPage;
