import { View, Text, StyleSheet } from "@react-pdf/renderer";
import { PropsWithStyle, theme } from "./theme";

interface StatCardProps extends PropsWithStyle {
  value: string | number;
  label: string;
  description: string;
}

const styles = StyleSheet.create({
  accentBox: {
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    padding: theme.spacing.m,
    gap: theme.spacing.s,

    backgroundColor: theme.colors.backgroundSecondary,
    borderRadius: theme.borderRadius.default,
    width: "100%",
  },
  bigNumberWrapper: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    gap: theme.spacing.xs,
  },
  valueText: {
    fontFamily: "Inter",
    fontWeight: theme.fontWeight.bold,
    fontSize: 24,
    lineHeight: 1.5,
    textAlign: "center",
    color: theme.colors.text,
  },
  labelText: {
    fontFamily: "Inter",
    fontWeight: theme.fontWeight.bold,
    fontSize: theme.fontSize.default,
    lineHeight: 1.5,
    textAlign: "center",
    color: theme.colors.text,
  },
  descriptionText: {
    fontFamily: "Inter",
    fontWeight: theme.fontWeight.regular,
    fontSize: theme.fontSize.default,
    lineHeight: 1.5,
    textAlign: "center",
    color: theme.colors.text,
  },
});

const PdfStatCard = ({ value, label, description, style }: StatCardProps) => {
  return (
    <View style={{ ...styles.accentBox, ...style }}>
      <View style={styles.bigNumberWrapper}>
        <Text style={styles.valueText}>{value}</Text>
        <Text style={styles.labelText}>{label}</Text>
      </View>
      <Text style={styles.descriptionText}>{description}</Text>
    </View>
  );
};

export default PdfStatCard;
