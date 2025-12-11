import { FC } from 'react';
import { Page, View } from '@react-pdf/renderer';
import { PdfH3 } from '../typography';
import { styles as themeStyles } from '../theme';
import PdfFooter from '../footer';

const MethodologyPage: FC = () => {
    return (
        <Page size="A4" style={themeStyles.page}>
            <View style={{ marginBottom: 20 }}>
                <PdfH3 style={{ color: '#002A7B' }}>Methodik & Hinweise</PdfH3>
            </View>

            <PdfFooter />
        </Page>
    );
};

export default MethodologyPage;
