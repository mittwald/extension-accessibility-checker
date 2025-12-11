import { Link, Text, TextProps } from "@react-pdf/renderer";
import { FC, PropsWithChildren } from "react";
import { PropsWithStyle, styles, theme } from "./theme";

export const PdfText: FC<PropsWithChildren & PropsWithStyle & TextProps> = ({
  children,
  style,
  ...props
}) => <Text style={{ ...styles.text, ...style }} {...props}>{children}</Text>;
export const PdfTextBold: FC<PropsWithChildren & PropsWithStyle & TextProps> = ({
  children,
  style,
  ...props
}) => <Text style={{ ...styles.textBold, ...style }} {...props}>{children}</Text>;
export const PdfSmall: FC<PropsWithChildren & PropsWithStyle & TextProps> = ({
  children,
  style,
  ...props
}) => (
  <Text
    style={{ ...styles.text, fontSize: theme.fontSize.small, ...style }}
    {...props}
  >
    {children}
  </Text>
);
export const PdfLink: FC<PropsWithChildren & PropsWithStyle & { src: string }> = ({
  children,
  style,
  src,
}) => (
  <Link src={src} style={{ ...styles.text, color: theme.colors.info, textDecoration: "none", ...style }}>
    {children}
  </Link>
);
export const PdfH1: FC<PropsWithChildren & PropsWithStyle & TextProps> = ({
  children,
  style,
  ...props
}) => <Text style={{ ...styles.h1, ...style }} {...props}>{children}</Text>;
export const PdfH2: FC<PropsWithChildren & PropsWithStyle & TextProps> = ({
  children,
  style,
  ...props
}) => <Text style={{ ...styles.h2, ...style }} {...props}>{children}</Text>;
export const PdfH3: FC<PropsWithChildren & PropsWithStyle & TextProps> = ({
  children,
  style,
  ...props
}) => <Text style={{ ...styles.h3, ...style }} {...props}>{children}</Text>;
export const PdfH4: FC<PropsWithChildren & PropsWithStyle & TextProps> = ({
  children,
  style,
  ...props
}) => <Text style={{ ...styles.h4, ...style }} {...props}>{children}</Text>;
