import { FC } from 'react';
import { Page, View } from '@react-pdf/renderer';
import { PdfH3, PdfText } from '../typography';
import PdfTable, { TableColumn } from '../table';
import { IssueGroup } from '../../profile/tabs/issues/types';
import { styles as themeStyles } from '../theme';

interface SummaryPageProps {
    issueGroups: IssueGroup[];
}

const SummaryPage: FC<SummaryPageProps> = ({ issueGroups }) => {
    const summaryData = issueGroups.map(group => {
        let errorCount = 0;
        let warningCount = 0;
        let noticeCount = 0;

        group.issues.forEach(issue => {
            if (issue.severity === 'error') errorCount += issue.count;
            else if (issue.severity === 'warning') warningCount += issue.count;
            else noticeCount += issue.count;
        });

        return {
            principle: group.label.split('(')[0].trim(),
            error: errorCount,
            warning: warningCount,
            notice: noticeCount,
            total: errorCount + warningCount + noticeCount
        };
    });

    const totalError = summaryData.reduce((sum, row) => sum + row.error, 0);
    const totalWarning = summaryData.reduce((sum, row) => sum + row.warning, 0);
    const totalNotice = summaryData.reduce((sum, row) => sum + row.notice, 0);
    const totalAll = summaryData.reduce((sum, row) => sum + row.total, 0);

    const footerData = {
        c1: 'Gesamt',
        c2: totalError,
        c3: totalWarning,
        c4: totalNotice,
        c5: totalAll
    };

    type MappedTableRow = {
        c1: string;
        c2: number;
        c3: number;
        c4: number;
        c5: number;
    };

    const columns: TableColumn<MappedTableRow>[] = [
        { header: 'Prinzip', accessor: 'c1', isFlex: true },
        { header: 'Fehler', accessor: 'c2', width: 60, align: 'center' },
        { header: 'Warnungen', accessor: 'c3', width: 70, align: 'center' },
        { header: 'Hinweise', accessor: 'c4', width: 60, align: 'center' },
        { header: 'Gesamt', accessor: 'c5', width: 60, align: 'center' },
    ];

    return (
        <Page size="A4" style={themeStyles.page}>
            <View style={{ marginBottom: 20 }}>
                <PdfH3 style={{ color: '#002A7B' }}>Zusammenfassung nach Prinzipien</PdfH3>
                <PdfText style={{ marginTop: 8 }}>
                    Hier folgt eine Zusammenfassung der Barrierefreiheitsprobleme, die während des Scans gefunden wurden. Die Probleme sind nach den vier WCAG-Prinzipien gruppiert.
                </PdfText>
            </View>

            <PdfTable
                data={summaryData.map(row => ({
                    c1: row.principle,
                    c2: row.error,
                    c3: row.warning,
                    c4: row.notice,
                    c5: row.total,
                }))}
                footerData={footerData}
                columns={columns}
            />
        </Page>
    );
};

export default SummaryPage;
