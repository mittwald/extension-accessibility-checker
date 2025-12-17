import { FC } from "react";
import { Page } from "@react-pdf/renderer";
import { styles } from "../theme";
import PdfFooter from "../footer";
import { PdfSectionHeader } from "../layout";
import { PdfH2 } from "../typography";

const PdfBenefitsPage: FC = () => {
  return (
    <Page size="A4" style={styles.page}>
      <PdfSectionHeader>
        <PdfH2>Vorteile eines barrierefreien Webauftritts</PdfH2>
      </PdfSectionHeader>
      <PdfFooter />
    </Page>
  );
};

export default PdfBenefitsPage;
