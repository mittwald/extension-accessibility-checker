import { FC } from "react";
import { Page, View } from "@react-pdf/renderer";
import { styles } from "../theme";
import { ScanProfileWithSuccessfulScan } from "../../../api/types";
import { PdfSmall } from "../typography";

interface ClosingPageProps {
  profile: ScanProfileWithSuccessfulScan;
}

const ClosingPage: FC<ClosingPageProps> = ({ profile }) => {
  const createdDate = new Date().toLocaleDateString("de-DE");
  const scanDate = profile.lastSuccessfulScan?.createdAt
    ? new Date(profile.lastSuccessfulScan.createdAt).toLocaleDateString("de-DE")
    : "N/A";

  return (
    <Page size="A4" style={styles.page}>
      <View style={{ flexGrow: 1 }} />

      <View style={styles.footerContainer}>
        <PdfSmall>made with 💙 by mittwald</PdfSmall>
        <PdfSmall>
          Report erstellt: {createdDate} | Scandatum: {scanDate}
        </PdfSmall>
        <PdfSmall>
          Dieser Report wurde automatisiert aus den Daten des Barriere-Checkers
          von mittwald generiert.
        </PdfSmall>
      </View>
    </Page>
  );
};

export default ClosingPage;
