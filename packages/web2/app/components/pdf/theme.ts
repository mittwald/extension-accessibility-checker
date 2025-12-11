import { StyleSheet, SVGProps } from "@react-pdf/renderer";

export const theme = {
  colors: {
    text: "#222222",
    heading: "#002A7B",
    border: "#F8F8F8",
    background: "#FFFFFF",
    success: "#00825B",
    info: "#0054F5",
    danger: "#E1244C",
    warning: "#F56800",
  },
  spacing: {
    heading: 8,
  },
  fontSize: {
    h1: 32,
    h2: 18,
    h3: 16,
    h4: 14,
    default: 12,
    small: 8,
  },
  page: {
    front: {
      iconSize: 64,
    },
  },
};

export const styles = StyleSheet.create({
  page: {
    height: "100%",
    flexDirection: "column",
    padding: 40,
    backgroundColor: theme.colors.background,
  },
  frontPage: {
    height: "100%",
    paddingTop: 80,
    alignItems: "center",
  },
  text: {
    fontFamily: "Inter",
    color: theme.colors.text,
    fontSize: theme.fontSize.default,
    fontWeight: "normal",
    lineHeight: 1.5,
  },
  textBold: {
    fontFamily: "Inter",
    color: theme.colors.text,
    fontWeight: "bold",
    fontSize: theme.fontSize.default,
    lineHeight: 1.5,
  },
  h1: {
    fontFamily: "Inter",
    fontSize: theme.fontSize.h1,
    color: theme.colors.heading,
    fontWeight: 700,
    marginBottom: theme.spacing.heading,
    lineHeight: 1.5,
  },
  h2: {
    fontFamily: "Inter",
    fontSize: theme.fontSize.h2,
    color: theme.colors.heading,
    fontWeight: "bold",
    marginBottom: theme.spacing.heading,
    lineHeight: 1.5,
  },
  h3: {
    fontFamily: "Inter",
    fontSize: theme.fontSize.h3,
    color: theme.colors.heading,
    fontWeight: "bold",
    marginBottom: theme.spacing.heading,
    lineHeight: 1.5,
  },
  h4: {
    fontFamily: "Inter",
    fontSize: theme.fontSize.h4,
    color: theme.colors.heading,
    fontWeight: "bold",
    marginBottom: theme.spacing.heading,
    lineHeight: 1.5,
  },
  body: {
    fontSize: theme.fontSize.default,
    color: "#000",
    lineHeight: 1.5,
  },
});

export interface PropsWithStyle {
  style?: SVGProps["style"];
}
