import { Issue, Page, Scan } from "extension-a11y-checker-storage";
import pa11y, { Pa11yOptions, Pa11yResults, Pa11yIssue } from "pa11y";
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
          runners: ["htmlcs"],
        }
      : {};

    if (!scan.issues) {
      scan.issues = [];
    }

    try {
      for (const url of scan.pages) {
        await this.executeURL(url, options, scan);
      }
      scan.status = "completed";
    } catch (e) {
      scan.status = "failed";
    }
  }

  protected async executeURL(page: Page, options: Pa11yOptions, scan: Scan) {
    const results = await new Pa11yRunner().run(page.url, options);
    page.title = results.documentTitle;
    const mappedIssues: Issue[] = results.issues.map((i) =>
      this.convertToUnifiedIssue(i, results),
    );
    page.issues = mappedIssues.reduce(
      (c, i) => ({
        ...c,
        [`${i.severity}s`]: c[`${i.severity}s`] + 1,
      }),
      {
        errors: 0,
        warnings: 0,
        notices: 0,
      },
    );
    scan.issues?.push(...mappedIssues);
  }

  private convertToUnifiedIssue(issue: Pa11yIssue, results: Pa11yResults) {
    const i = new Issue();
    i.url = results.pageUrl;
    i.errorCode = issue.code;
    i.severity = issue.type;
    i.description = issue.message;
    i.selector = issue.selector;
    i.context = issue.context;
    return i;
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
