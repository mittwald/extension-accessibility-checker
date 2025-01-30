import { ScanProfile, Scan } from "extension-a11y-checker-storage/src";

export interface ScanEngine {
  executeScan(profile: ScanProfile, scan: Scan): Promise<void>;
}
