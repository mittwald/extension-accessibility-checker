import { DocumentType } from "@typegoose/typegoose";
import { Scan } from "extension-a11y-checker-storage";

export interface ScanEngine {
  executeScan(scan: DocumentType<Scan>): Promise<void>;
}
