import { FC } from "react";
import { Page, View } from "@react-pdf/renderer";
import { PdfH3, PdfH4, PdfTextBold, PdfLink, PdfText } from "../typography";
import { styles, theme } from "../theme";
import PdfFooter from "../footer";
import { PdfSection } from "../layout";
import { PdfLi, PdfUl } from "../list";

const PdfMethodologyPage: FC = () => {
  return (
    <Page
      size="A4"
      style={styles.page}
      bookmark={{
        title: "Das Barrierefreiheitsstärkungsgesetz (BFSG)",
        fit: true,
      }}
    >
      <View style={{ marginBottom: theme.spacing.m }}>
        <PdfH3>Das Barrierefreiheitsstärkungsgesetz (BFSG)</PdfH3>
      </View>
      <View bookmark={{ title: "Was ist das BFSG?", fit: true }}>
        <PdfSection>
          <PdfH4>Was ist das BFSG?</PdfH4>
          <PdfText>
            Das{" "}
            <PdfTextBold>Barrierefreiheitsstärkungsgesetz (BFSG)</PdfTextBold>{" "}
            regelt die <PdfTextBold>digitale Barrierefreiheit</PdfTextBold> für
            bestimmte Produkte und Dienstleistungen verbindlich. Es setzt eine
            EU-Richtlinie um und gilt{" "}
            <PdfTextBold>seit dem 28. Juni 2025</PdfTextBold>.
          </PdfText>
        </PdfSection>
      </View>
      <View bookmark={{ title: "Für wen gilt das BFSG?", fit: true }}>
        <PdfSection>
          <PdfH4>Für wen gilt das BFSG?</PdfH4>
          <PdfText>
            Das Barrierefreiheitsstärkungsgesetz (BFSG) gilt für Unternehmen,
            die{" "}
            <PdfTextBold>
              digitale Produkte oder Dienstleistungen an Endverbraucher (B2C)
            </PdfTextBold>
            {" "}
            anbieten, zum Beispiel <PdfTextBold>Online-Shops</PdfTextBold>, Apps
            oder Webprojekte mit geschäftlichen Funktionen wie Terminbuchungen
            oder Gutscheinbestellungen. Ausgenommen sind{" "}
            <PdfTextBold>
              Kleinstunternehmen mit weniger als 10 Beschäftigten
            </PdfTextBold>{" "}
            und <PdfTextBold>maximal 2 Millionen Euro Jahresumsatz</PdfTextBold>
            . Weitere Infos im{" "}
            <PdfLink src="https://www.mittwald.de/blog/webentwicklung-design/warum-barrierefreiheit-fuer-alle-wichtig-ist">
              mittwald Blog
            </PdfLink>
            .
          </PdfText>
        </PdfSection>
      </View>
      <View
        bookmark={{
          title: "Warum ist Barrierefreiheit über das BFSG hinaus wichtig?",
          fit: true,
        }}
      >
        <PdfSection>
          <PdfH4>
            Warum ist Barrierefreiheit über das BFSG hinaus wichtig?
          </PdfH4>
          <PdfText>
            Barrierefreiheit verbessert nicht nur die rechtliche Konformität,
            sondern vor allem die{" "}
            <PdfTextBold>Qualität und Nutzbarkeit</PdfTextBold> von Websites
            insgesamt.
          </PdfText>
          <PdfUl>
            <PdfLi>
              <PdfTextBold>Größere Zielgruppe:</PdfTextBold> Inhalte sind für
              mehr Menschen nutzbar.
            </PdfLi>
            <PdfLi>
              <PdfTextBold>Bessere Conversion Rate:</PdfTextBold> Verständliche,
              klare Interfaces funktionieren für alle Nutzende und senken
              Abbruchraten.
            </PdfLi>
            <PdfLi>
              <PdfTextBold>Positive SEO-Effekte:</PdfTextBold> Saubere Struktur,
              klare Semantik und gute Lesbarkeit wirken sich positiv auf
              Suchmaschinen aus.
            </PdfLi>
            <PdfLi>
              <PdfTextBold>Zukunftssicherheit:</PdfTextBold> Barrierefreiheit
              wird langfristig zum Standard und reduziert späteren
              Anpassungsaufwand.
            </PdfLi>
          </PdfUl>
          <PdfText>
            Barrierefreiheit ist damit nicht nur ein Compliance-Thema, sondern
            ein{" "}
            <PdfTextBold>
              wesentlicher Qualitätsfaktor moderner Webentwicklung
            </PdfTextBold>
            . Mehr dazu im{" "}
            <PdfLink src="https://www.mittwald.de/blog/webentwicklung-design/warum-barrierefreiheit-fuer-alle-wichtig-ist">
              mittwald Blog
            </PdfLink>
            .
          </PdfText>
        </PdfSection>
      </View>
      <View
        bookmark={{
          title: "Was passiert bei Verstößen gegen das BFSG?",
          fit: true,
        }}
      >
        <PdfSection>
          <PdfH4>Was passiert bei Verstößen gegen das BFSG?</PdfH4>
          <PdfText>
            Werden die Anforderungen des BFSG nicht erfüllt, stellt dies gemäß{" "}
            <PdfTextBold>§ 37 Abs. 1 Nr. 8 BFSG</PdfTextBold> eine{" "}
            <PdfTextBold>Ordnungswidrigkeit</PdfTextBold> dar und kann mit einem{" "}
            <PdfTextBold>Bußgeld von bis zu 100.000 €</PdfTextBold> geahndet
            werden. Weitaus schlimmer könnten Abmahnungen von Mitbewerbern oder
            sogenannten „Abmahnvereinen“ sein. Die Erfahrungen der letzten Jahre
            zeigen, dass gerade Verstöße gegen Informations- und
            Gestaltungspflichten häufig für{" "}
            <PdfTextBold>Massenabmahnungen</PdfTextBold> herangezogen werden –
            vergleichbar mit den Abmahnwellen rund um die{" "}
            <PdfTextBold>DSGVO</PdfTextBold> oder zu den{" "}
            <PdfTextBold>Google Fonts</PdfTextBold>.
          </PdfText>
        </PdfSection>
      </View>
      <View
        bookmark={{
          title: "Hinweis zur Barrierefreiheitserklärung",
          fit: true,
        }}
      >
        <PdfSection>
          <PdfH4>Hinweis zur Barrierefreiheitserklärung</PdfH4>
          <PdfText>
            Für viele der vom BFSG Betroffenen Websites ist zusätzlich eine{" "}
            <PdfTextBold>Barrierefreiheitserklärung</PdfTextBold> erforderlich.
            Diese muss gut sichtbar platziert sein, etwa{" "}
            <PdfTextBold>im Footer in Nähe des Impressums</PdfTextBold>, oder an
            einer ähnlich zentral auffindbaren Stelle auf jeder Seite. Sie
            informiert Nutzende transparent über den Stand der Barrierefreiheit,
            bekannte Einschränkungen sowie Kontaktmöglichkeiten zur Rückmeldung
            von Barrieren.
          </PdfText>
          <PdfText>
            Eine entsprechende Barrierefreiheitserklärung kann mit dem{" "}
            <PdfLink src="https://www.mittwald.de/mstudio/extensions/barriere-erklaerung">
              Generator von mittwald
            </PdfLink>{" "}
            erstellt und bereitgestellt werden.
          </PdfText>
        </PdfSection>
      </View>

      <PdfFooter />
    </Page>
  );
};

export default PdfMethodologyPage;
