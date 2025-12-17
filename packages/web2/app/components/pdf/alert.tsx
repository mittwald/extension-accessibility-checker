import React from "react";
import { View, Text, StyleSheet, ViewProps } from "@react-pdf/renderer";
import { theme } from "./theme";
import { PdfIconAlert } from "./icons";

interface AlertProps {
  title: string;
  description: string;
  icon?: React.ReactNode;
  style?: ViewProps["style"];
}

const styles = StyleSheet.create({
  container: {
    display: "flex",
    flexDirection: "row",
    alignItems: "flex-start",
    borderTopWidth: 1,
    borderRightWidth: 1,
    borderBottomWidth: 1,
    borderLeftWidth: 0,
    borderStyle: "solid",
    borderColor: theme.colors.warning,
    borderRadius: theme.borderRadius.default,
    overflow: "hidden",
  },
  leftBorder: {
    width: 8,
    height: "100%",
    backgroundColor: theme.colors.warning,
    flexGrow: 0,
    flexShrink: 0,
  },
  innerFrame: {
    display: "flex",
    flexDirection: "row",
    alignItems: "flex-start",
    padding: theme.spacing.m,
    gap: theme.spacing.m,
    flexGrow: 1,
  },
  content: {
    display: "flex",
    flexDirection: "column",
    alignItems: "flex-start",
    gap: theme.spacing.s,
    flexGrow: 1,
  },
  headingRow: {
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    gap: theme.spacing.xs,
    height: 21,
    flexGrow: 0,
  },
  iconContainer: {
    width: 21,
    height: 21,
    justifyContent: "center",
    alignItems: "center",
    flexGrow: 0,
  },
  headline: {
    fontFamily: "Inter",
    fontWeight: theme.fontWeight.bold,
    fontSize: theme.fontSize.h3,
    lineHeight: 1.5,
    color: theme.colors.warningDark,
    height: 21,
  },
  description: {
    fontFamily: "Inter",
    fontWeight: theme.fontWeight.regular,
    fontSize: theme.fontSize.default,
    lineHeight: 1.5,
    color: theme.colors.text,
  },
});

const Alert = ({ title, description, icon, style }: AlertProps) => {
  return (
    <View style={{ ...styles.container, ...style }}>
      <View style={styles.leftBorder} />
      <View style={styles.innerFrame}>
        <View style={styles.content}>
          <View style={styles.headingRow}>
            <View style={styles.iconContainer}>
              {icon || (
                <PdfIconAlert color={theme.colors.warningDark} size={21} />
              )}
            </View>
            <Text style={styles.headline}>{title}</Text>
          </View>
          <Text style={styles.description}>{description}</Text>
        </View>
      </View>
    </View>
  );
};

export default Alert;
