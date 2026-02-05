import "@react-pdf/renderer";

// Extend @react-pdf/renderer types to include the bookmark property.
// The bookmark prop is documented and works in @react-pdf/renderer,
// but the TypeScript definitions are outdated and missing this property.
// This declaration adds the missing type to prevent TypeScript errors.
declare module "@react-pdf/renderer" {
  export interface ViewProps {
    bookmark?: {
      title: string;
      top?: number;
      left?: number;
      zoom?: number;
      fit?: boolean;
      expanded?: boolean;
    };
  }
}
