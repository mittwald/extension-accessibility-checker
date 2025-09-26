import { ReactNode } from "react";
import { ScanProfile } from "../../../api/types.js";

export interface Props {
  profile: ScanProfile;
  scanId: string;
  headline?: string;
  description?: ReactNode;
}
