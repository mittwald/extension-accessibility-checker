import { Issue, Scan } from "extension-a11y-checker-storage";
import pa11y, { Pa11yOptions } from "pa11y";
import { DocumentType, isDocument } from "@typegoose/typegoose";
import { ScanEngine } from "./ScanEngine.js";

export class Pa11yScanEngine implements ScanEngine {
  public async executeScan(scan: DocumentType<Scan>): Promise<void> {
    // todo: refactor this to use spread operator with subclass
    const options: Pa11yOptions = isDocument(scan.profile)
      ? {
          standard: scan.profile.standard,
          includeNotices: scan.profile.includeNotices,
          includeWarnings: scan.profile.includeWarnings,
        }
      : {};

    if (!scan.issues) {
      scan.issues = [];
    }

    try {
      for (const url of scan.urls) {
        await this.executeURL(url, options, scan);
      }
      scan.status = "completed";
    } catch (e) {
      scan.status = "failed";
    }
  }

  protected async executeURL(url: string, options: Pa11yOptions, scan: Scan) {
    const results = await new Pa11yRunner().run(url, options);
    const mappedIssues: Issue[] = results.issues.map((issue) => {
      const i = new Issue();
      i.errorCode = issue.code;
      i.severity = issue.type;
      i.description = issue.message;
      i.selector = issue.selector;
      i.codeSnippet = issue.context;
      return i;
    });
    scan.issues?.push(...mappedIssues);
  }
}

class Pa11yRunner {
  public async run(url: string, options: Pa11yOptions) {
    const pa11yOptions = {
      ...options,
      log: {
        debug: console.debug,
        error: console.error,
        info: console.info,
        log: console.log,
      },
    };

    return pa11y(url, pa11yOptions);
  }
}
