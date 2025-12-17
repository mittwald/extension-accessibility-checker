import { FC } from "react";
import { Page } from "@react-pdf/renderer";
import { styles } from "../theme";
import PdfFooter from "../footer";
import { PdfSection } from "../layout";

const BenefitsPage: FC = () => {
  return (
    <Page size="A4" style={styles.page}>
      <PdfSection heading="Vorteile eines barrierefreien Webauftritts" />
      <PdfFooter />
    </Page>
  );
};

export default BenefitsPage;
