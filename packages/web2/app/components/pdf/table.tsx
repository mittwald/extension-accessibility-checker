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
  footerData?: T;
  style?: ViewProps['style'];
}

const borderColor = '#909090';
const textColor = '#222222';

const styles = StyleSheet.create({
  tableContainer: {
    width: '100%',
    flexDirection: 'column',
    position: 'relative',
  },
  tableOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  frameBorder: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    borderLeftWidth: 1,
    borderLeftColor: borderColor,
    borderRightWidth: 1,
    borderRightColor: borderColor,
    borderBottomWidth: 1,
    borderBottomColor: borderColor,
    borderBottomLeftRadius: 4,
    borderBottomRightRadius: 4,
    borderTopWidth: 1,
    borderTopColor: borderColor,
    borderTopLeftRadius: 4,
    borderTopRightRadius: 4,
  },
  cornerMask: {
    position: 'absolute',
    bottom: 0,
    width: 6,
    height: 6,
    backgroundColor: '#FFFFFF',
  },
  maskLeft: {
    left: 0,
  },
  maskRight: {
    right: 0,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'stretch',
  },
  headerRow: {
    borderTopLeftRadius: 4,
    borderTopRightRadius: 4,
    borderBottomWidth: 2,
    borderBottomColor: borderColor,
    backgroundColor: '#FFFFFF',
  },
  bodyRow: {
    borderBottomWidth: 1,
    borderBottomColor: borderColor,
  },
  footerRow: {
    backgroundColor: '#FFFFFF',
    borderTopWidth: 2,
    borderTopColor: borderColor,
    flexDirection: 'row',
    alignItems: 'stretch',
  },
  cell: {
    paddingVertical: 8,
    paddingHorizontal: 4,
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'flex-start',
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
      {/* Content Layer (Rows) */}
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
        const bg = i % 2 === 0 ? '#F8F8F8' : undefined;
        const isLastDataRow = i === data.length - 1;
        const isVisuallyLast = isLastDataRow && !footerData;
        const borderBottomWidth = isVisuallyLast ? 0 : 1;

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
        <View style={[styles.footerRow]} wrap={false}>
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
                style={[styles.text, styles.textBold, { textAlign: col.align || 'left' }]}
              >
                {String(footerData[col.accessor] ?? '')}
              </Text>
            </View>
          ))}
        </View>
      )}

      {/* Overlay Layer (Frame + Masks) - Renders on TOP */}
      <View style={styles.tableOverlay} fixed>
        {/* Masks first (hide content corners) */}
        <View style={[styles.cornerMask, styles.maskLeft]} />
        <View style={[styles.cornerMask, styles.maskRight]} />
        {/* Frame Border on top */}
        <View style={styles.frameBorder} />
      </View>
    </View>
  );
};

export default PdfTable;
