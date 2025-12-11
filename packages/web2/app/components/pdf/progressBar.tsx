import { StyleSheet, View, ViewProps } from "@react-pdf/renderer";
import * as React from "react";
import { PdfText, PdfTextBold } from "./typography";

const styles = StyleSheet.create({
  container: {
    width: '100%',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    marginBottom: 4,
  },
  barContainer: {
    height: 16,
    backgroundColor: '#E5E7EB',
    borderRadius: 4,
    overflow: 'hidden',
    border: '1px solid #909090'
  },
  fill: {
    height: '100%',
  },
});

interface PdfProgressbarProps {
  label?: string;
  value: number;
  min?: number;
  max?: number;
  displayType?: "val-max" | "percentage";
  unit?: string;
  color?: string
  style?: ViewProps['style']
}

const PdfProgressbar: React.FC<PdfProgressbarProps> = ({
  label,
  value,
  min = 0,
  max = 100,
  displayType,
  unit = "",
  color = "#F56800",
  style,
}) => {
  const safeMax = max === min ? min + 1 : max;
  const percentage = Math.min(
    Math.max(((value - min) / (safeMax - min)) * 100, 0),
    100,
  );

  const getValueText = () => {
    if (displayType === "val-max") {
      return `${value}/${max}${unit ? ` ${unit}` : ""}`;
    }
    return `${Math.round(percentage)}%`;
  };

  return (
    <View style={{ ...styles.container, ...style }}>
      <View style={styles.header}>
        <PdfText>{label || ""}</PdfText>
        <PdfTextBold>{getValueText()}</PdfTextBold>
      </View>

      <View style={styles.barContainer}>
        <View style={[styles.fill, { width: `${percentage}%`, backgroundColor: color }]} />
      </View>
    </View>
  );
};

export default PdfProgressbar;
