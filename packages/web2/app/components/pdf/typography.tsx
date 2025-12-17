import { Link, Text, TextProps } from "@react-pdf/renderer";
import { FC, PropsWithChildren } from "react";
import { PropsWithStyle, styles, theme } from "./theme";

export const PdfText: FC<PropsWithChildren & PropsWithStyle & TextProps> = ({
  children,
  style,
  ...props
}) => (
  <Text style={{ ...styles.text, ...style }} {...props}>
    {children}
  </Text>
);

export const PdfTextBold: FC<
  PropsWithChildren & PropsWithStyle & TextProps
> = ({ children, style, ...props }) => (
  <Text style={{ ...styles.textBold, ...style }} {...props}>
    {children}
  </Text>
);

export const PdfSmall: FC<PropsWithChildren & PropsWithStyle & TextProps> = ({
  children,
  style,
  ...props
}) => (
  <Text style={{ ...styles.textSmall, ...style }} {...props}>
    {children}
  </Text>
);

export const PdfSmallBold: FC<
  PropsWithChildren & PropsWithStyle & TextProps
> = ({ children, style, ...props }) => (
  <Text style={{ ...styles.textSmallBold, ...style }} {...props}>
    {children}
  </Text>
);

export const PdfLink: FC<
  PropsWithChildren & PropsWithStyle & { src: string }
> = ({ children, style, src, ...props }) => (
  <Link
    src={src}
    style={{
      ...styles.text,
      color: theme.colors.link,
      textDecoration: "none",
      ...style,
    }}
    {...props}
  >
    {children}
  </Link>
);

export const PdfLargeHeading: FC<
  PropsWithChildren & PropsWithStyle & TextProps
> = ({ children, style, ...props }) => (
  <Text style={{ ...styles.largeHeading, ...style }} {...props}>
    {children}
  </Text>
);

export const PdfH1: FC<PropsWithChildren & PropsWithStyle & TextProps> = ({
  children,
  style,
  ...props
}) => (
  <Text style={{ ...styles.h1, ...style }} {...props}>
    {children}
  </Text>
);

export const PdfH2: FC<PropsWithChildren & PropsWithStyle & TextProps> = ({
  children,
  style,
  ...props
}) => (
  <Text style={{ ...styles.h2, ...style }} {...props}>
    {children}
  </Text>
);

export const PdfH3: FC<PropsWithChildren & PropsWithStyle & TextProps> = ({
  children,
  style,
  ...props
}) => (
  <Text style={{ ...styles.h3, ...style }} {...props}>
    {children}
  </Text>
);

export const PdfH4: FC<PropsWithChildren & PropsWithStyle & TextProps> = ({
  children,
  style,
  ...props
}) => (
  <Text style={{ ...styles.h4, ...style }} {...props}>
    {children}
  </Text>
);
