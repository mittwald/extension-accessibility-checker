import { ScanProfile } from "@/app/scanProfile/scanProfile.model";
import { Scan } from "@/app/scan/scan.model";

export interface ScanEngine {
  executeScan(profile: ScanProfile, scan: Scan): Promise<void>;
}
