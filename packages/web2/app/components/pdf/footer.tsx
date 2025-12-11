import { View, Text, StyleSheet } from '@react-pdf/renderer';

const styles = StyleSheet.create({
  footerContainer: {
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    paddingTop: 8,
    borderTopWidth: 0,
    marginTop: 'auto',
  },
  linkText: {
    fontFamily: 'Inter',
    fontSize: 8,
    lineHeight: 1.5,
    color: '#222222',
    flexGrow: 1,
  },
  pageNumber: {
    fontFamily: 'Inter',
    fontSize: 8,
    color: '#222222',
  },
});

const PdfFooter = () => {
  return (
    <View style={styles.footerContainer} fixed>
      <Text style={styles.linkText}>www.mittwald.de</Text>
      <Text style={styles.pageNumber}
        render={({ pageNumber }) => `Seite ${pageNumber-1}`}
      />
    </View>
  );
};

export default PdfFooter;
