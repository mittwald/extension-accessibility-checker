import { Children, cloneElement, isValidElement, ReactNode } from "react";
import { View } from "@react-pdf/renderer";
import { styles, PropsWithStyle, theme } from "./theme";

export interface PdfBaseProps extends PropsWithStyle {
  children?: ReactNode;
  debug?: boolean;
}

interface PdfSectionProps extends PdfBaseProps {
  marginTop?: boolean;
  wrap?: boolean;
}

export const PdfSection = ({
  children,
  style,
  wrap = true,
  debug,
}: PdfSectionProps) => {
  const containerStyles = {
    ...styles.section,
    ...style,
  };

  return (
    <>
      <View style={containerStyles} wrap={wrap} debug={debug}>
        {Children.map(children, (child, index) => {
          if (!isValidElement(child)) {
            return child;
          }
          if (child.type === PdfSection) {
            return child;
          }
          if (child.type === PdfSectionHeader) {
            return child;
          }
          if (index === Children.count(children) - 1) {
            return child;
          }
          return cloneElement(child as React.ReactElement<PropsWithStyle>, {
            style: {
              ...(child.props as PropsWithStyle).style,
              marginBottom: theme.spacing.m,
            },
          });
        })}
      </View>
    </>
  );
};

export const PdfSectionHeader = ({ children, style, debug }: PdfBaseProps) => (
  <View style={{ ...styles.sectionHeader, ...style }} debug={debug}>
    {children}
  </View>
);
