import { View, Text, StyleSheet } from "@react-pdf/renderer";
import { theme } from "./theme";

const styles = StyleSheet.create({
  footerContainer: {
    width: "100%",
    flexDirection: "row",
    alignItems: "center",
    paddingTop: theme.spacing.s,
    borderTopWidth: 0,
    marginTop: "auto",
  },
  linkText: {
    fontFamily: "Inter",
    fontSize: theme.fontSize.small,
    lineHeight: 1.5,
    color: theme.colors.text,
    flexGrow: 1,
  },
  pageNumber: {
    fontFamily: "Inter",
    fontSize: theme.fontSize.small,
    color: theme.colors.text,
  },
});

const PdfFooter = () => {
  return (
    <View style={styles.footerContainer} fixed>
      <Text style={styles.linkText}>www.mittwald.de</Text>
      <Text
        style={styles.pageNumber}
        render={({ pageNumber }) => `Seite ${pageNumber}`}
      />
    </View>
  );
};

export default PdfFooter;
