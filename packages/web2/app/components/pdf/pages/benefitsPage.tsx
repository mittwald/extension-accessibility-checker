import { FC } from "react";
import { Page, View } from "@react-pdf/renderer";
import { PdfH3 } from "../typography";
import { styles, theme } from "../theme";
import PdfFooter from "../footer";

const BenefitsPage: FC = () => {
  return (
    <Page size="A4" style={styles.page}>
      <View style={{ marginBottom: theme.spacing.m }}>
        <PdfH3>Vorteile eines barrierefreien Webauftritts</PdfH3>
      </View>

      <PdfFooter />
    </Page>
  );
};

export default BenefitsPage;
