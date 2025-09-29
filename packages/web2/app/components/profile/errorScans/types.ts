import { ReactNode } from "react";
import { ScanProfile } from "../../../api/types.js";

export interface BaseProps {
  profile: ScanProfile;
  scanId: string;
}

export interface DetailedErrorProps extends BaseProps {
  headline: string;
  description: ReactNode;
}
