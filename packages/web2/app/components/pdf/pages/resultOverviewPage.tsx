import * as React from "react";
import { ScanProfileWithSuccessfulScan } from "../../../api/types";
import { Page, View } from "@react-pdf/renderer";
import { PdfH2, PdfH3, PdfText, PdfTextBold } from "../typography";
import { styles, theme } from "../theme";
import PdfProgressbar from "../progressBar";
import PdfStatCard from "../statCard";
import PdfAlert from "../alert";
import PdfFooter from "../footer";
import { PdfSection, PdfSectionHeader } from "../layout";
import { PdfLi, PdfUl } from "../list";

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
    <Page
      size="A4"
      style={{ ...styles.page, gap: theme.spacing.m }}
      bookmark={{ title: "Zusammenfassung der Prüfungsergebnisse", fit: true }}
    >
      <PdfSection>
        <PdfSectionHeader>
          <PdfH2>Zusammenfassung der Prüfungsergebnisse</PdfH2>
        </PdfSectionHeader>
        <PdfText>
          Dieser Report prüft die Website{" "}
          <PdfTextBold>{profile.domain}</PdfTextBold> auf Barrierefreiheit nach
          den <PdfTextBold>WCAG-Richtlinien</PdfTextBold> (Web Content
          Accessibility Guidelines) – dem internationalen Standard für
          barrierefreie Websites. Er zeigt den aktuellen Status zum{" "}
          {new Date().toLocaleDateString("de-DE")}, Stärken und
          Optimierungspotenziale der digitalen Präsenz.
        </PdfText>
        <PdfProgressbar
          color={color(profile.issueSummary?.score ?? 0)}
          label="Barrierefreiheitsscore"
          value={profile.issueSummary?.score ?? 0}
        />
        <PdfText>
          Der Barrierefreiheitsscore ist ein gewichteter Durchschnitt von
          Prüfungen auf Barrierefreiheit.
        </PdfText>
        <View
          style={{
            flexDirection: "row",
            alignItems: "stretch",
            gap: theme.spacing.s,
            marginTop: theme.spacing.s,
          }}
        >
          <PdfStatCard
            style={{ flex: 1 }}
            value={profile.issueSummary?.errors ?? 0}
            label="Fehler"
            description="automatisch prüfbare WCAG-Verstöße mit hoher Priorität"
          />
          <PdfStatCard
            style={{ flex: 1 }}
            value={profile.issueSummary?.warnings ?? 0}
            label="Warnungen"
            description="potenzielle Barrieren, die manuell und kontextabhängig geprüft werden müssen"
          />
          <PdfStatCard
            style={{ flex: 1 }}
            value={profile.issueSummary?.notices ?? 0}
            label="Hinweise*"
            description="nicht automatisierbare WCAG-Prüfpunkte, manuelle Bewertung erforderlich"
          />
        </View>
        <PdfText>
          * Hinweise werden nur erfasst und im Report ausgegeben, wenn sie zuvor
          im Scanprofil des Barriere-Checkers aktiviert wurden.
        </PdfText>
        <PdfAlert
          title="Hinweis"
          description="Automatische Scans sind gut – aber sie sehen nicht alles. Manuelle Tests sind für eine vollständige Konformität elementar."
        ></PdfAlert>
        <PdfSection wrap={false}>
          <PdfSectionHeader minPresenceAhead={320}>
            <PdfH3>Vorteile eines barrierefreien Webauftritts</PdfH3>
          </PdfSectionHeader>
          <PdfUl>
            <PdfLi>
              <PdfTextBold>Gesetzliche Compliance:</PdfTextBold> BFSG erfüllen
              und Risiken durch Bußgelder oder Abmahnungen vermeiden.
            </PdfLi>
            <PdfLi>
              <PdfTextBold>Größere Reichweite:</PdfTextBold> Erreicht mehr
              potenzielle Nutzende mit geringeren Abbruchraten.
            </PdfLi>
            <PdfLi>
              <PdfTextBold>Bessere SEO:</PdfTextBold> Suchmaschinen bevorzugen
              barrierefreie Seiten.
            </PdfLi>
            <PdfLi>
              <PdfTextBold>Verbesserte UX:</PdfTextBold> Klare Navigation kommt
              allen zugute.
            </PdfLi>
            <PdfLi>
              <PdfTextBold>Starkes Markenbild:</PdfTextBold> Zeigt
              gesellschaftliche Verantwortung und Professionalität.
            </PdfLi>
          </PdfUl>
          <PdfText>
            Barrierefreiheit ist ein{" "}
            <PdfTextBold>
              zentraler Qualitätsfaktor moderner Webauftritte
            </PdfTextBold>
            .
          </PdfText>
        </PdfSection>
      </PdfSection>
      <PdfFooter />
    </Page>
  );
};

export default PdfResultOverviewPage;
