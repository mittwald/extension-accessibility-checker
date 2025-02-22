import { DocumentType } from "@typegoose/typegoose";
import { Issue, Page, Scan } from "extension-a11y-checker-storage";
import { Pa11yScanEngine } from "./Pa11yScanEngine.js";

export type PageResult = Pick<
  DocumentType<Page>,
  "url" | "issues" | "score" | "title"
>;

export interface ScanResults {
  issues: Issue[];
  pages: PageResult[];
}

export interface ScanEngine {
  executeScan(): Promise<ScanResults>;
}

export class ScanEngineFactory {
  static buildFor(scan: DocumentType<Scan>): ScanEngine {
    return new Pa11yScanEngine(scan);
  }
}
