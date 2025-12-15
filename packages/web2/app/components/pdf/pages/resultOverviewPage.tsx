import * as React from "react";
import { ScanProfileWithSuccessfulScan } from "../../../api/types";
import { Page, View } from "@react-pdf/renderer";
import { PdfH2, PdfText, PdfTextBold } from "../typography";
import { styles, theme } from "../theme";
import PdfProgressbar from "../progressBar";
import StatCard from "../statCard";
import PdfAlert from "../alert";
import PdfFooter from "../footer";

interface PdfResultOverviewPageProps {
  profile: ScanProfileWithSuccessfulScan;
}

const PdfResultOverviewPage: React.FC<PdfResultOverviewPageProps> = ({
  profile,
}) => {
  const color = (value: number | undefined) => {
    if (value === undefined) {
      return undefined;
    }
    if (value < 50) {
      return theme.colors.danger;
    }
    if (value < 90) {
      return theme.colors.warning;
    }
    return theme.colors.success;
  };
  return (
    <Page size="A4" style={{ ...styles.page, gap: theme.spacing.m }}>
      <PdfH2>Scanergebnis</PdfH2>
      <PdfText>
        Dieser Report zeigt den Stand der Barrierefreiheit der Domain
        <PdfTextBold>{profile.domain}</PdfTextBold> zum{" "}
        <PdfTextBold>{new Date().toLocaleDateString("de-DE")}</PdfTextBold>.
        Grundlage dafür sind die Web Content Accessibility Guidelines (WCAG) 2.1
        auf dem Konformitätsniveau <PdfTextBold>AAA</PdfTextBold>. Er bietet
        einen schnellen Überblick über Optimierungspotenziale.
      </PdfText>
      <PdfProgressbar
        color={color(profile.issueSummary?.score ?? 0)}
        label="Barrierefreiheitsscore"
        value={profile.issueSummary?.score ?? 0}
      />
      <View style={{ flexDirection: "row", gap: theme.spacing.m }}>
        <StatCard
          value={profile.issueSummary?.errors ?? 0}
          label="Fehler"
          description="Kritische Fehler, die mit höchster Priorität behoben werden sollten."
        />
        <StatCard
          value={profile.issueSummary?.warnings ?? 0}
          label="Warnungen"
          description="Punkte, die überprüft und bei Bedarf verbessert werden sollten."
        />
        <StatCard
          value={profile.issueSummary?.notices ?? 0}
          label="Hinweise"
          description="Empfehlungen, über WCAG-Konformatität hinaus."
        />
      </View>
      <PdfAlert
        title="Hinweis"
        description="Der Barrierefreiheitsscore liefert einen ersten Hinweis über den Stand der Barrierefreiheit. Einzelne Fehler oder Warnungen können die Nutzung weithin beeinträchtigen und müssen geprüft und behboben werden."
      ></PdfAlert>
      <PdfFooter />
    </Page>
  );
};

export default PdfResultOverviewPage;
