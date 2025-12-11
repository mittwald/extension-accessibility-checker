
import { View, Text, StyleSheet, ViewProps } from '@react-pdf/renderer';

export interface TableColumn<T> {
  header: string;
  accessor: keyof T;
  width?: number | string;
  isFlex?: boolean;
  align?: 'left' | 'center' | 'right';
}

interface TableProps<T> {
  columns: TableColumn<T>[];
  data: T[];
  footerData?: { label: string; value: string };
  style?: ViewProps['style'];
}

const borderColor = '#909090';
const textColor = '#222222';

const styles = StyleSheet.create({
  tableContainer: {
    width: '100%',
    flexDirection: 'column',
  },
  row: {
    flexDirection: 'row',
    alignItems: 'stretch',
    minHeight: 34,
    borderLeftWidth: 1,
    borderRightWidth: 1,
    borderLeftColor: borderColor,
    borderRightColor: borderColor,
  },
  headerRow: {
    borderTopWidth: 1,
    borderTopColor: borderColor,
    borderBottomWidth: 2,
    borderBottomColor: borderColor,
    borderTopLeftRadius: 4,
    borderTopRightRadius: 4,
  },
  bodyRow: {
    borderBottomWidth: 1,
    borderBottomColor: borderColor,
  },
  footerRow: {
    borderTopWidth: 2,
    borderTopColor: borderColor,
    borderBottomWidth: 1,
    borderBottomColor: borderColor,
    borderBottomLeftRadius: 4,
    borderBottomRightRadius: 4,
  },
  cell: {
    paddingVertical: 8,
    paddingHorizontal: 4,
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
  },
  text: {
    fontFamily: 'Inter',
    fontSize: 10,
    lineHeight: 1.2,
    color: textColor,
  },
  textBold: {
    fontWeight: 700,
  },
});

const mapAlign = (align?: string) => {
  if (align === 'center') return 'center';
  if (align === 'right') return 'flex-end';
  return 'flex-start';
};

const forceBreak = (word: string) => word.split('');

const PdfTable = <T extends Record<string, unknown>>({
  columns,
  data = [],
  footerData,
  style,
}: TableProps<T>) => {
  return (
    <View style={{ ...styles.tableContainer, ...style }}>
      <View style={[styles.row, styles.headerRow]} fixed>
        {columns.map((col, i) => (
          <View
            key={i}
            style={[
              styles.cell,
              {
                width: col.width,
                flexGrow: col.isFlex ? 1 : 0,
                flexShrink: col.isFlex ? 1 : 0,
                flexBasis: col.isFlex ? 0 : 'auto',
                alignItems: mapAlign(col.align),
              },
            ]}
          >
            <Text style={[styles.text, styles.textBold, { textAlign: col.align || 'left' }]}>
              {col.header}
            </Text>
          </View>
        ))}
      </View>
      {data.map((row, i) => {
        const bg = i % 2 === 0 ? '#F8F8F8' : '#FFFFFF';
        const isLastRow = i === data.length - 1;
        const borderBottomWidth = isLastRow && !footerData ? 1 : 1;

        return (
          <View
            key={i}
            wrap={false}
            style={[
              styles.row,
              styles.bodyRow,
              {
                backgroundColor: bg,
                borderBottomWidth: borderBottomWidth,
              },
            ]}
          >
            {columns.map((col, j) => (
              <View
                key={j}
                style={[
                  styles.cell,
                  {
                    width: col.width,
                    flexGrow: col.isFlex ? 1 : 0,
                    flexShrink: col.isFlex ? 1 : 0,
                    flexBasis: col.isFlex ? 0 : 'auto',
                    alignItems: mapAlign(col.align),
                  },
                ]}
              >
                <Text
                  style={[styles.text, { textAlign: col.align || 'left' }]}
                  hyphenationCallback={col.isFlex ? forceBreak : undefined}
                >
                  {String(row[col.accessor] ?? '')}
                </Text>
              </View>
            ))}
          </View>
        );
      })}
      {footerData && (
        <View style={[styles.row, styles.footerRow]} wrap={false}>
          <View style={[styles.cell, { flexGrow: 1, paddingLeft: 8 }]}>
            <Text style={[styles.text, styles.textBold]}>{footerData.label}</Text>
          </View>
          <View style={[styles.cell, { width: 100, alignItems: 'flex-end', paddingRight: 8 }]}>
            <Text style={[styles.text, styles.textBold, { textAlign: 'right' }]}>
              {footerData.value}
            </Text>
          </View>
        </View>
      )}
    </View>
  );
};

export default PdfTable;
