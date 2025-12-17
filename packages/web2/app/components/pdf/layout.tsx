import { View } from "@react-pdf/renderer";
import { styles, theme } from "./theme";
import { FC, PropsWithChildren, ReactNode } from "react";
import { PdfH1, PdfH2, PdfH3, PdfH4, PdfText } from "./typography";

interface Props extends PropsWithChildren {
  headingLevel?: 1 | 2 | 3 | 4;
  heading: string | ReactNode;
  wrap?: boolean;
}

export const PdfSection: FC<Props> = ({
  children,
  headingLevel = 2,
  heading,
  wrap = true,
}) => {
  const Heading: FC<PropsWithChildren> = ({ children }) =>
    headingLevel === 1 ? (
      <PdfH1>{children}</PdfH1>
    ) : headingLevel === 2 ? (
      <PdfH2>{children}</PdfH2>
    ) : headingLevel === 3 ? (
      <PdfH3>{children}</PdfH3>
    ) : headingLevel === 4 ? (
      <PdfH4>{children}</PdfH4>
    ) : (
      <PdfText>{children}</PdfText>
    );

  return (
      <View
        style={{ ...styles.section, gap: theme.spacing.m }}
        wrap={wrap}
      >
        <Heading>{heading}</Heading>
        {children}
      </View>
    );
};
