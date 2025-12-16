import { View, Text, StyleSheet, ViewProps } from "@react-pdf/renderer";
import { theme } from "./theme";

export interface TableColumn<T> {
  header: string;
  accessor: keyof T;
  width?: number | string;
  isFlex?: boolean;
  align?: "left" | "center" | "right";
}

interface TableProps<T> {
  columns: TableColumn<T>[];
  data: T[];
  footerData?: T;
  style?: ViewProps["style"];
}

const styles = StyleSheet.create({
  tableContainer: {
    width: "100%",
    flexDirection: "column",
    position: "relative",
  },
  tableOverlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  frameBorder: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    borderLeftWidth: 1,
    borderLeftColor: theme.colors.border,
    borderRightWidth: 1,
    borderRightColor: theme.colors.border,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border,
    borderBottomLeftRadius: theme.borderRadius.default,
    borderBottomRightRadius: theme.borderRadius.default,
    borderTopWidth: 1,
    borderTopColor: theme.colors.border,
    borderTopLeftRadius: theme.borderRadius.default,
    borderTopRightRadius: theme.borderRadius.default,
  },
  cornerMask: {
    position: "absolute",
    bottom: 0,
    width: 6,
    height: 6,
    backgroundColor: theme.colors.background,
  },
  maskLeft: {
    left: 0,
  },
  maskRight: {
    right: 0,
  },
  row: {
    flexDirection: "row",
    alignItems: "stretch",
  },
  headerRow: {
    borderTopLeftRadius: theme.borderRadius.default,
    borderTopRightRadius: theme.borderRadius.default,
    borderBottomWidth: 2,
    borderBottomColor: theme.colors.border,
    backgroundColor: theme.colors.background,
  },
  bodyRow: {
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border,
  },
  footerRow: {
    backgroundColor: theme.colors.background,
    borderTopWidth: 2,
    borderTopColor: theme.colors.border,
    flexDirection: "row",
    alignItems: "stretch",
  },
  cell: {
    paddingVertical: theme.spacing.s,
    paddingHorizontal: theme.spacing.xs,
    display: "flex",
    flexDirection: "column",
    justifyContent: "flex-start",
  },
  text: {
    fontFamily: "Inter",
    fontSize: theme.fontSize.default,
    lineHeight: 1.5,
    color: theme.colors.text,
  },
  textBold: {
    fontWeight: theme.fontWeight.bold,
  },
});

const mapAlign = (align?: string) => {
  if (align === "center") return "center";
  if (align === "right") return "flex-end";
  return "flex-start";
};

const forceBreak = (word: string) => word.split("");

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
                flexBasis: col.isFlex ? 0 : "auto",
                alignItems: mapAlign(col.align),
                paddingLeft: i === 0 ? theme.spacing.m : theme.spacing.xs,
                paddingRight:
                  i === columns.length - 1 ? theme.spacing.m : theme.spacing.xs,
              },
            ]}
          >
            <Text
              style={[
                styles.text,
                styles.textBold,
                { textAlign: col.align || "left" },
              ]}
            >
              {col.header}
            </Text>
          </View>
        ))}
      </View>

      {data.map((row, i) => {
        const bg = i % 2 === 0 ? theme.colors.backgroundSecondary : undefined;
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
                    flexBasis: col.isFlex ? 0 : "auto",
                    alignItems: mapAlign(col.align),
                    paddingLeft: j === 0 ? theme.spacing.m : theme.spacing.xs,
                    paddingRight:
                      j === columns.length - 1
                        ? theme.spacing.m
                        : theme.spacing.xs,
                  },
                ]}
              >
                <Text
                  style={[styles.text, { textAlign: col.align || "left" }]}
                  hyphenationCallback={col.isFlex ? forceBreak : undefined}
                >
                  {String(row[col.accessor] ?? "")}
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
                  flexBasis: col.isFlex ? 0 : "auto",
                  alignItems: mapAlign(col.align),
                  paddingLeft: j === 0 ? theme.spacing.m : theme.spacing.xs,
                  paddingRight:
                    j === columns.length - 1
                      ? theme.spacing.m
                      : theme.spacing.xs,
                },
              ]}
            >
              <Text
                style={[
                  styles.text,
                  styles.textBold,
                  { textAlign: col.align || "left" },
                ]}
              >
                {String(footerData[col.accessor] ?? "")}
              </Text>
            </View>
          ))}
        </View>
      )}
      <View style={styles.tableOverlay} fixed>
        <View style={[styles.cornerMask, styles.maskLeft]} />
        <View style={[styles.cornerMask, styles.maskRight]} />
        <View style={styles.frameBorder} />
      </View>
    </View>
  );
};

export default PdfTable;
