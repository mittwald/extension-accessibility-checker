import { StyleSheet, SVGProps } from "@react-pdf/renderer";

export const theme = {
  colors: {
    text: "#222222",
    heading: "#002A7B",
    primary: "#0054F5",
    link: "#003FB8",
    border: "#909090",
    background: "#FFFFFF",
    backgroundSecondary: "#F8F8F8",
    backgroundLight: "rgba(0, 84, 245, 0.02)",
    borderDashed: "#0054F5",
    success: "#00825B",
    info: "#0054F5",
    danger: "#E1244C",
    warning: "#F56800",
    warningDark: "#C25200",
  },
  spacing: {
    xs: 4,
    s: 8,
    m: 16,
    l: 24,
    xl: 32,
    xxl: 40,
    pagePadding: 40,
  },
  fontSize: {
    largeHeading: 32,
    h1: 18,
    h2: 16,
    h3: 14,
    default: 12,
    small: 8,
  },
  fontWeight: {
    regular: 400,
    bold: 700,
  },
  borderRadius: {
    default: 4,
  },
  lineHeight: {
    default: 1.5,
  },
};

export const styles = StyleSheet.create({
  page: {
    fontFamily: "Inter",
    height: "100%",
    flexDirection: "column",
    padding: theme.spacing.pagePadding,
    backgroundColor: theme.colors.background,
    color: theme.colors.text,
    fontSize: theme.fontSize.default,
  },
  text: {
    fontFamily: "Inter",
    fontSize: theme.fontSize.default,
    color: theme.colors.text,
    lineHeight: theme.lineHeight.default,
    fontWeight: theme.fontWeight.regular,
  },
  textBold: {
    fontFamily: "Inter",
    fontWeight: theme.fontWeight.bold,
    fontSize: theme.fontSize.default,
    color: theme.colors.text,
    lineHeight: theme.lineHeight.default,
  },
  textSmall: {
    fontFamily: "Inter",
    fontSize: theme.fontSize.small,
    color: theme.colors.text,
    lineHeight: theme.lineHeight.default,
    fontWeight: theme.fontWeight.regular,
  },
  textSmallBold: {
    fontFamily: "Inter",
    fontSize: theme.fontSize.small,
    color: theme.colors.text,
    lineHeight: theme.lineHeight.default,
    fontWeight: theme.fontWeight.bold,
  },
  largeHeading: {
    fontFamily: "Inter",
    fontSize: theme.fontSize.largeHeading,
    color: theme.colors.heading,
    fontWeight: theme.fontWeight.bold,
    lineHeight: theme.lineHeight.default,
  },
  h1: {
    fontFamily: "Inter",
    fontSize: theme.fontSize.h1,
    color: theme.colors.heading,
    fontWeight: theme.fontWeight.bold,
    lineHeight: theme.lineHeight.default,
  },
  h2: {
    fontFamily: "Inter",
    fontSize: theme.fontSize.h2,
    color: theme.colors.heading,
    fontWeight: theme.fontWeight.bold,
    lineHeight: theme.lineHeight.default,
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
  },
  col: {
    flexDirection: "column",
  },
  section: {
    flexDirection: "column",
    gap: theme.spacing.m,
    width: "100%",
    marginBottom: theme.spacing.m,
  },
  sectionHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: theme.spacing.m,
    gap: theme.spacing.s,
  },
  frontPage: {
    paddingTop: 80,
    alignItems: "center",
    height: "100%",
  },
  frontPageContent: {
    padding: theme.spacing.m,
    flexDirection: "column",
    alignItems: "center",
    height: "100%",
  },
  frontPageInner: {
    padding: theme.spacing.m,
    flexDirection: "column",
    alignItems: "center",
    flexGrow: 1,
  },
  frontPageFooter: {
    width: "100%",
    flexDirection: "row",
    justifyContent: "flex-end",
  },
  centerPage: {
    justifyContent: "center",
    alignItems: "center",
    flexGrow: 1,
  },
  dashedBox: {
    boxSizing: "border-box",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    padding: 64,
    width: "100%",
    backgroundColor: theme.colors.backgroundLight,
    borderWidth: 1,
    borderStyle: "dashed",
    borderColor: theme.colors.borderDashed,
    borderRadius: theme.borderRadius.default,
  },
  footerContainer: {
    width: "100%",
    marginTop: "auto",
    borderTopWidth: 1,
    borderTopColor: theme.colors.border,
    paddingTop: 10,
    alignItems: "center",
    gap: 8,
  },
});

export interface PropsWithStyle {
  style?: SVGProps["style"];
}
