import { FC } from 'react';
import { Page, View } from '@react-pdf/renderer';
import { PdfH3 } from '../typography';
import { styles as themeStyles } from '../theme';
import PdfFooter from '../footer';

const BenefitsPage: FC = () => {
    return (
        <Page size="A4" style={themeStyles.page}>
            <View style={{ marginBottom: 20 }}>
                <PdfH3 style={{ color: '#002A7B' }}>Vorteile eines barrierefreien Webauftritts</PdfH3>
            </View>

            <PdfFooter />
        </Page>
    );
};

export default BenefitsPage;
