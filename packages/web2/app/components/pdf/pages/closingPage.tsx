import { FC } from 'react';
import { Page, View, StyleSheet } from '@react-pdf/renderer';
import { styles as themeStyles } from '../theme';
import { ScanProfileWithSuccessfulScan } from '../../../api/types';
import { PdfSmall } from '../typography';

interface ClosingPageProps {
    profile: ScanProfileWithSuccessfulScan;
}

const styles = StyleSheet.create({
    footerContainer: {
        width: '100%',
        marginTop: 'auto',
        borderTopWidth: 1,
        borderTopColor: '#909090',
        paddingTop: 10,
        alignItems: 'center',
        gap: 8,
    },
});

const ClosingPage: FC<ClosingPageProps> = ({ profile }) => {
    // Format dates
    const createdDate = new Date().toLocaleDateString('de-DE'); // Current date for report creation
    const scanDate = profile.lastSuccessfulScan?.createdAt
        ? new Date(profile.lastSuccessfulScan.createdAt).toLocaleDateString('de-DE')
        : 'N/A';

    return (
        <Page size="A4" style={themeStyles.page}>
            <View style={{ flexGrow: 1 }} />

            <View style={styles.footerContainer}>
                <PdfSmall>made with 💙 by mittwald</PdfSmall>
                <PdfSmall>Report erstellt: {createdDate} | Scandatum: {scanDate}</PdfSmall>
                <PdfSmall>Dieser Report wurde automatisiert aus den Daten des Barriere-Checkers von mittwald generiert.</PdfSmall>
            </View>
        </Page>
    );
};

export default ClosingPage;
