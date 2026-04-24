import { Text, View, StyleSheet, ViewProps } from "@react-pdf/renderer";
import React, { FC, PropsWithChildren, ReactElement } from "react";
import { theme, styles as baseStyles } from "./theme";
import { PdfText } from "./typography";

const styles = StyleSheet.create({
  ul: {
    flexDirection: "column",
    marginBottom: theme.spacing.m,
  },
  li: {
    flexDirection: "row",
    alignItems: "flex-start",
    marginBottom: theme.spacing.xs,
  },
  bullet: {
    width: theme.spacing.m,
    marginRight: theme.spacing.xs,
    textAlign: "right",
  },
  content: {
    flex: 1,
    flexDirection: "column",
  },
});

interface PdfUlProps extends ViewProps {
  bullet?: string;
}

export const PdfUl: FC<PropsWithChildren & PdfUlProps> = ({
  children,
  style,
  bullet = "•",
  ...props
}) => {
  return (
    <View style={{ ...styles.ul, ...style }} {...props}>
      {React.Children.map(children, (child) => {
        if (React.isValidElement(child)) {
          return React.cloneElement(child as ReactElement<PdfLiProps>, {
            label: bullet,
          });
        }
        return child;
      })}
    </View>
  );
};

export const PdfOl: FC<PropsWithChildren & ViewProps> = ({
  children,
  style,
  ...props
}) => {
  return (
    <View style={{ ...styles.ul, ...style }} {...props}>
      {React.Children.map(children, (child, index) => {
        if (React.isValidElement(child)) {
          return React.cloneElement(child as ReactElement<PdfLiProps>, {
            label: `${index + 1}.`,
          });
        }
        return child;
      })}
    </View>
  );
};

export interface PdfLiProps extends ViewProps {
  label?: string;
}

export const PdfLi: FC<PropsWithChildren & PdfLiProps> = ({
  children,
  style,
  label,
  ...props
}) => {
  return (
    <View style={{ ...styles.li, ...style }} {...props}>
      <View style={styles.bullet}>
        <Text style={baseStyles.text}>{label}</Text>
      </View>
      <View style={styles.content}>
        <PdfText>{children}</PdfText>
      </View>
    </View>
  );
};
