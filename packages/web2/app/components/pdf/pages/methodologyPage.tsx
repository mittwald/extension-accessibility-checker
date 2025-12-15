import { FC } from "react";
import { Page, View } from "@react-pdf/renderer";
import { PdfH3 } from "../typography";
import { styles, theme } from "../theme";
import PdfFooter from "../footer";

const MethodologyPage: FC = () => {
  return (
    <Page size="A4" style={styles.page}>
      <View style={{ marginBottom: theme.spacing.m }}>
        <PdfH3>Methodik & Hinweise</PdfH3>
      </View>

      <PdfFooter />
    </Page>
  );
};

export default MethodologyPage;
